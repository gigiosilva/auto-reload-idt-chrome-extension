var tabId = null;
var intervalSec = null;
var intervalHour = null;
var myTimerHour = new Array();
var myTimerSec = new Array();
var localId;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

    	if(request.type == "startingSec") {
	    	intervalSec = request.interval;

	    	clearInterval(myTimerSec[request.tab.url]);

	    	myTimerSec[request.tab.url] = setInterval(function(){

			 	tabId = request.tab.id;

                chrome.tabs.reload(tabId, function() {
                    if (chrome.runtime.lastError) {
                        clearInterval(myTimerSec[request.tab.url]);
                        clearStorage(request.tab.url, "sec");
                    }
                });

			}, intervalSec*1000);
	    }

	    if(request.type == "stoppingSec") {

            clearInterval(myTimerSec[request.tab.url]);
        }

        if(request.type == "startingHour") {

	    	clearInterval(myTimerHour[request.tab.url]);

	    	myTimerHour[request.tab.url] = setInterval(function(){

	    		if(request.interval == timeNow()){
	    			tabId = request.tab.id;

                    chrome.tabs.reload(tabId, function() {
                        if (chrome.runtime.lastError) {
                            clearInterval(myTimerHour[request.tab.url]);
                            clearStorage(request.tab.url, "hour");
                        }
                    });

	    		}

			}, 1000);
	    }

	    if(request.type == "stoppingHour") {

            clearInterval(myTimerHour[request.tab.url]);

        }

});

function checkRunning(tabUrl){

    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var savedItem = JSON.parse(localStorage.getItem(key))

        if(isNaN(myTimerSec[key])){

            savedItem.running = 'OFF';

        }

        if(isNaN(myTimerHour[key])){

            savedItem.runningHour = 'OFF';

        }

        localStorage[key] = JSON.stringify(savedItem);

    }

    return JSON.parse(localStorage.getItem(tabUrl));
}

function clearStorage(tabUrl, type){

    var savedItem = JSON.parse(localStorage.getItem(tabUrl))

    if(type == "sec"){

        savedItem.running = 'OFF';

    }

    if(type == "hour"){

        savedItem.runningHour = 'OFF';

    }

    localStorage[tabUrl] = JSON.stringify(savedItem);

}

function timeNow(){
    var now= new Date(), 
    h= now.getHours(), 
    m= now.getMinutes(), 
    s= now.getSeconds();

    if(h<10) h= '0'+h;
    if(m<10) m= '0'+m;
    if(s<10) s= '0'+s;
	
    return h  + ':' + m + ':' + s;
}
