
console.log("content");

document.addEventListener('readystatechange', event => {

    
    if (event.target.readyState === "complete") {
        
        let url = location.href
        
        chrome.runtime.sendMessage({url : url} , (response) => {})
        
        
        chrome.runtime.onMessage.addListener((req , sender , sendResponse) => {
            
            let isGreen = req.isGreen;
            
            if(isGreen){
                $.notify("This is a Green Site . " , {align:"right", verticalAlign:"middle" , color : "#fff" , background : "#20D67B"})
            }else{
                $.notify("This is a Gray Site . " ,  {align:"right", verticalAlign:"middle" , color: "#fff", background: "#D44950"})
            }
            
            sendResponse("got the message.")
            
        })
        

    }

})










