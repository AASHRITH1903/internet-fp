(function(){

    var d = new Date()
    var key = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}-internet-fp`

    var [co2, noPages] = (function(){

        var temp = localStorage.getItem(key)
        if(temp === null){
            localStorage.setItem(key, JSON.stringify({
                co2: 0,
                noPages: 0,
            }))
            return [0, 0]
        }else{
            temp = JSON.parse(temp)
            return [temp.co2, temp.noPages]
        }
    })()

    var limit = (function(){
        var temp = localStorage.getItem('limit-internet-fp')
        if(temp === null){
            localStorage.setItem('limit-internet-fp', 50)
            return 50
        }else{
            return Number(temp)
        }
    })()

    var isLimitSet = (function(){
        var temp = localStorage.getItem('limit-status-internet-fp')
        if(temp === null){
            localStorage.setItem('limit-status-internet-fp', true)
            return true
        }else{
            return (temp === "true")
        }
    })()

    console.log({co2, noPages, limit, isLimitSet});

    function checkLimit(){
        if(isLimitSet && co2 > limit)
            alert("Warning !! Daily Limit Reached")
    }

    checkLimit()

    chrome.runtime.onMessage.addListener( async (req, sender, sendResponse) => {

        var e = new URL(req.url);

        var res = await fetch("http://api.thegreenwebfoundation.org/greencheck/"+e.host)
        var data = await res.json()
        chrome.tabs.sendMessage(sender.tab.id, {isGreen: data.green})

        try{
            res = await fetch("https://api.websitecarbon.com/b?url="+e.protocol+"//"+e.host+e.pathname)
            data = await res.json()
            co2 += data.c
        }catch(e){
            try{
                res = await fetch("https://api.websitecarbon.com/b?url="+e.protocol+"//"+e.host)
                data = await res.json()
                co2 += data.c
            }catch(e){
                co2 += 1
            }
        }
        noPages++
        localStorage.setItem(key, JSON.stringify({co2,noPages}))
        checkLimit()
    });

    chrome.runtime.onConnect.addListener((port) => {
        if(port.name === "popup"){
            port.onMessage.addListener((msg) => {
                if(msg === "send-data"){
                    port.postMessage({
                        co2,
                        limit,
                        isLimitSet,
                        noPages,
                    })            
                }else if(msg === "set-limit"){

                    limit = (function(){
                        var temp = prompt("Enter CO2 limit per day :", 50)
                        if(temp != null && temp != "" && Number(temp) != NaN && Number(temp) > 0){
                            localStorage.setItem('limit-internet-fp', temp)
                            return Number(temp)
                        }else{
                            return limit
                        }
                    })()
                    checkLimit()
                }else if(msg === "enable-limit"){
                    isLimitSet = true;
                    localStorage.setItem('limit-status-internet-fp', true)
                    checkLimit()
                }else if(msg === "disable-limit"){
                    isLimitSet = false;
                    localStorage.setItem('limit-status-internet-fp', false)
                    checkLimit()
                }
            })
        }
    })

})();