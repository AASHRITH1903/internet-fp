let co2 = 0,limit = 0,isLimitSet = false,noPages = 0;

let d = new Date()
let key = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}-internet-fp`
console.log(key);

// today's data
let td = localStorage.getItem(key)
if(td === null){
    localStorage.setItem(key, JSON.stringify({
        co2: 0,
        noPages: 0,
    }))
}else{
    td = JSON.parse(td)
    co2 = td.co2
    noPages = td.noPages
}

limit = localStorage.getItem('limit-internet-fp')
if(limit === null){
    limit = 50
    localStorage.setItem('limit-internet-fp', 50)
}

isLimitSet = localStorage.getItem('limit-status-internet-fp')
if(isLimitSet === null){
    isLimitSet = true
    localStorage.setItem('limit-status-internet-fp', true)
}


chrome.runtime.onMessage.addListener( async (req, sender, sendResponse) => {

    let e = new URL(req.url);

    let res = await fetch("http://api.thegreenwebfoundation.org/greencheck/"+e.host)
    let data = await res.json()
    chrome.tabs.sendMessage(sender.tab.id, {isGreen: data.green})

    res = await fetch("https://api.websitecarbon.com/b?url="+e.protocol+"//"+e.host+e.pathname)
    data = await res.json()
    co2 += data.c
    noPages++

    
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
                limit = prompt("Enter CO2 limit per day :", 50)
            }else if(msg === "enable-limit"){
                isLimitSet = true;
            }else if(msg === "disable-limit"){
                isLimitSet = false;
            }
        })
    }
})

window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = 'Closing'
    console.log("closed");
})