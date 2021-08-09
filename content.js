
$(document).ready(() => {
        console.log("content");
        console.log(location.href);
        chrome.runtime.sendMessage({url: location.href})
    
        chrome.runtime.onMessage.addListener((req , sender , sendResponse) => {
            
            if(req.isGreen){
                $.notify("This is a Green Site . " , {align:"right", verticalAlign:"middle" , color : "#fff" , background : "#20D67B"})
            }else{
                $.notify("This is a Gray Site . " ,  {align:"right", verticalAlign:"middle" , color: "#fff", background: "#D44950"})
            }
        })
})








