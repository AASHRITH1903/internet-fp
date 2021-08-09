let port = chrome.extension.connect({
    name: "To background"
});

port.postMessage("send data");

port.onMessage.addListener(function(msg) {

    console.log("Data recieved from background  :  "+ msg.co2 +"   "+ msg.limit + " " +msg.isLimitSet+" "+ msg.noPages);

    document.getElementById("show1").innerHTML = msg.co2 + " g";

    document.getElementById("show2").innerHTML = msg.noPages;

    document.getElementById("limit").innerHTML = "Limit : " + msg.limit + " g";

    document.getElementById('limit-status').checked = msg.isLimitSet;


});

document.getElementById("set-limit-button").addEventListener("click" , () => {

    port.postMessage("set-limit");

})

document.getElementById("limit-status").addEventListener("change" , e => {
    
    if(e.target.checked){
        port.postMessage("enable-limit");
    }else{
        port.postMessage("disable-limit");
    }

})


