let port = chrome.runtime.connect({
    name: "popup"
});

port.postMessage("send-data");

port.onMessage.addListener((msg) => {

    console.log("Data recieved from background  :  "+ msg.co2 +"   "+ msg.limit + " " +msg.isLimitSet+" "+ msg.noPages);

    document.querySelector("#show1").innerHTML = msg.co2 + " g";
    document.querySelector("#show2").innerHTML = msg.noPages;
    document.querySelector("#limit").innerHTML = "Limit : " + msg.limit + " g";
    document.querySelector("#limit-status").checked = msg.isLimitSet;

});

document.querySelector("#set-limit-button").addEventListener("click" , () =>{ 
    port.postMessage("set-limit");
})

document.querySelector("#limit-status").addEventListener("change" , e => {
    
    if(e.target.checked){
        port.postMessage("enable-limit");
    }else{
        port.postMessage("disable-limit");
    }

})


