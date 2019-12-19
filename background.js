var windowCount = 'windowCount',
	incogHistory = 'incogHistory', 
	content_visitor = 0, 
	incogRecent = 'incogRecent';

function increase_number_visits(){
	content_visitor++;
	badge();
}

function badge() {
    var text = String(content_visitor);
    if(content_visitor>1000)
    {
    text = String(Math.floor(content_visitor/1000) + "K")
    }
	
	chrome.browserAction.setBadgeText({text:text});
    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 130, 255, 0] });
}

window.onload = function() {
	badge();
    };


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

	if (!sender.tab) {
		return;
	}

	var tabInfo = {
		id: sender.tab.id,
		url: sender.tab.url,
		title: sender.tab.title,
		favIcon: sender.tab.favIconUrl,
		timestamp: Date()
	};
	increase_number_visits();
	if (localStorage.getItem(windowCount) == null) {
		count = 1;
		localStorage.setItem(windowCount, count);
	}

	if (localStorage.getItem(incogHistory) == null) {
		var arr = [];
		localStorage.setItem(incogHistory, JSON.stringify(arr));
	}

	if (localStorage.getItem(incogRecent) == null) {
		var arr = [];
		arr.length = 0;
		localStorage.setItem(incogRecent, JSON.stringify(arr));
	}

	tab.storeData(tabInfo);

});

var tab = {
	storeData: function (tabInfo) {
		var arr = [];
		arr = JSON.parse(localStorage.getItem(incogHistory));
		arr.push(tabInfo);

		localStorage.setItem(incogHistory, JSON.stringify(arr));
	}
}


function recentRecord(tabId) {
	var recent = [],
		history = [],
		historyLength;

	history = JSON.parse(localStorage.getItem(incogHistory));
	historyLength = history.length - 1;

	if (tabId != undefined) {
		var sameTab = [],
			sameTabLength;

		recent = JSON.parse(localStorage.getItem(incogRecent));

		for (var i = 0; i <= historyLength; i++) {
			if (tabId == history[i].id)
				sameTab.push(history[i]);
		}
		
		sameTabLength = sameTab.length;
		if (sameTabLength > 1)
			recent.push(sameTab[sameTabLength - 1]);
		else
			recent.push(sameTab[0]);

		recent = recent.filter(function (e) { return e != null });

		localStorage.setItem(incogRecent, JSON.stringify(recent));
	}
}


chrome.tabs.onRemoved.addListener(function (tab) {
	recentRecord(tab);
	increase_number_visits();
});

chrome.windows.onCreated.addListener(function (window) {
	if (localStorage.getItem(windowCount) == null) {
		count = 1;
		localStorage.setItem(windowCount, count);
	}
	else {
		var count = parseInt(localStorage.getItem(windowCount));
		count++;
		localStorage.setItem(windowCount, count);
	}
});

chrome.windows.onRemoved.addListener(function () {

	if (localStorage.getItem(windowCount) != null) {
		var count = parseInt(localStorage.getItem(windowCount));
		count--;
		localStorage.setItem(windowCount, count);
	}
	increase_number_visits();
	if (count == 0) {
		localStorage.removeItem(incogHistory);
		localStorage.removeItem(incogRecent);
		localStorage.removeItem(windowCount);
	}

});

