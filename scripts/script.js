function onInitialize() {

    $("#startBtn").click(function() {
        chrome.tabs.getSelected(null, function(tab) {

            intervalSec = parseInt($("#interval").val());

            saveStorage(tab, intervalSec, "sec");

            chrome.runtime.sendMessage({type:"startingSec", tab:tab, interval:intervalSec});

            $("#startBtn").hide();
            $("#stopBtn").show();

        });
    });

    $("#stopBtn").click(function() {
        chrome.tabs.getSelected(null, function(tab) {

            chrome.runtime.sendMessage({type:"stoppingSec", tab:tab});

            $("#startBtn").show();
            $("#stopBtn").hide();

            stoppedStorage(tab, $("#interval").val(), "sec");
        });
    });

    $("#setTimerBtn").click(function() {
        chrome.tabs.getSelected(null, function(tab) {

            intervalSec = $("#intervalHour").val();

            saveStorage(tab, intervalSec, "hour");

            chrome.runtime.sendMessage({type:"startingHour", tab:tab, interval:intervalSec});

            $("#setTimerBtn").hide();
            $("#stopTimerBtn").show();

        });
    });

    $("#stopTimerBtn").click(function() {
        chrome.tabs.getSelected(null, function(tab) {

            chrome.runtime.sendMessage({type:"stoppingHour", tab:tab});

            $("#setTimerBtn").show();
            $("#stopTimerBtn").hide();

            stoppedStorage(tab, $("#intervalHour").val(), "hour");
        });
    });

chrome.tabs.getSelected(null, function(tab) {

    var savedItem = chrome.extension.getBackgroundPage().checkRunning(tab.url);

    if(savedItem !== null){
        
        $("#startBtn").hide();
        $("#stopBtn").show();
        $("#setTimerBtn").hide();
        $("#stopTimerBtn").show();

        $("#interval").val(savedItem.interval);
        $("#intervalHour").val(savedItem.intervalHour);

        if(savedItem.running == "ON"){
            $("#startBtn").hide();
            $("#stopBtn").show();
        }else{
            $("#startBtn").show();
            $("#stopBtn").hide();
        }

        if(savedItem.runningHour == "ON"){
            $("#setTimerBtn").hide();
            $("#stopTimerBtn").show();
        }else{
            $("#setTimerBtn").show();
            $("#stopTimerBtn").hide();
        }

    }else{
        $("#startBtn").show();
        $("#stopBtn").hide();
        $("#setTimerBtn").show();
        $("#stopTimerBtn").hide();
    }

});

}

function saveStorage(tab, interval, type) {
    var key = tab.url;

    var savedItem = JSON.parse(localStorage.getItem(tab.url));

    if(type == "sec"){
        if(savedItem !== null){
            savedItem.interval = interval;
            savedItem.running = 'ON';
        }else{
            savedItem = { 'interval': interval, 'running': 'ON', 'intervalHour': '00:00:00', 'runningHour': 'OFF'};
        }
    }

    if(type == "hour"){
        if(savedItem !== null){
            savedItem.intervalHour = interval;
            savedItem.runningHour = 'ON';
        }else{
            savedItem = { 'interval': '0', 'running': 'OFF', 'intervalHour': interval, 'runningHour': 'ON'};
        }
    }

    localStorage[key] = JSON.stringify(savedItem)
}

function stoppedStorage(tab, interval, type){
    var key = tab.url;

    var savedItem = JSON.parse(localStorage.getItem(tab.url));

    if(type == "sec"){
        savedItem.interval = interval;
        savedItem.running = 'OFF';
    }

    if(type == "hour"){
        savedItem.intervalHour = interval;
        savedItem.runningHour = 'OFF';
    }

    localStorage[key] = JSON.stringify(savedItem)
}
