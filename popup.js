var background = chrome.extension.getBackgroundPage();  

function hop_reseter(){
	background.content_visitor = 0;
	background.badge();

}
function getContentTotal(){
	
	if (background.content_visitor != 10)
		return("Hops: ") + background.content_visitor;
	else (background.content_visitor == 10) 
		return('Have you found what you where searching for ?');

};

document.addEventListener('DOMContentLoaded', function () {
	
	function PageShower(){
		var div_time = document.getElementById('hopscounter');
		div_time.innerHTML = (getContentTotal());
		} 
		
	PageShower();

	var tabContent = document.getElementById('tabs-content'),
		recordList0 = document.getElementById('record-list-0'),
		recordList1 = document.getElementById('record-list-1'),
		deleteBtn = document.getElementById('delete-btn');


	chrome.tabs.query({
		active: true,
    currentWindow: true
	}, function (tabs) {
		var tab = tabs[0];
		if (tab) {
			tabContent.style.display = 'block';
			recordList0.style.display = 'block';
			recordList1.style.display = 'none';
			deleteBtn.style.display = 'block';

			var recentlyClosed = [],
				allHistory = [],

				incogRecentLocalStorage = localStorage.getItem('incogHistory'),
				incogHistoryLocalStorage = localStorage.getItem('incogRecent');

			recentlyClosed = JSON.parse(incogRecentLocalStorage);
			allHistory = JSON.parse(incogHistoryLocalStorage);

			if (incogRecentLocalStorage != null) {
				if (recentlyClosed.length != 0)
					notNullResponse();
				else
					nullResponse('Search to begin your hopscotch!');

				showRecord(recentlyClosed, 'record-list-0');
			}
			else
				nullResponse('Search to begin your hopscotch!');


			if (incogHistoryLocalStorage != null)
				showRecord(allHistory, 'record-list-1');


			var targetTabList = document.getElementById('tabs-content').getElementsByTagName('span');

			for (var i = 0; i < targetTabList.length; i++) {
				targetTabList[i].addEventListener('click', function (event) {

					var tabIndex = this.getAttribute('data-tab-index');
					document.getElementById('tab-bottom-slider').style.left = 225 * tabIndex + 'px';

					var tabsList = document.getElementsByClassName('tab-record-list'),
						tabsListLength = tabsList.length - 1;

					for (var i = 0; i <= tabsListLength; i++) {
						tabsList[i].style.display = 'none';
					}

					var currentTabList = document.getElementById('record-list-' + tabIndex);
					if (currentTabList.getElementsByTagName('li').length == 0)
						nullResponse('Search to begin your hopscotch!');

					else {
						notNullResponse();
						currentTabList.style.display = 'block';
						currentTabList.scrollTop = 0;
					}

				
				});
					
			}

			var recentLinkList = document.getElementsByClassName('recent-target-link');

			for (var i = 0; i < recentLinkList.length; i++) {
				recentLinkList[i].addEventListener('click', function (event) {
					chrome.tabs.create({
						'url': this.getAttribute('href')
					});
					trackLinkClick(event);
				});
			}

			var historyLinkList = document.getElementsByClassName('history-target-link');

			for (var i = 0; i < historyLinkList.length; i++) {
				historyLinkList[i].addEventListener('click', function (event) {
					chrome.tabs.create({
						'url': this.getAttribute('href')
					});
					trackLinkClick(event);
				});
			}
		}
	})	


	document.getElementById('delete-btn').addEventListener('click', function (event) {
		
		var recentlyClosed = [],
			allHistory = [];
			

		
		recentlyClosed = JSON.parse(localStorage.getItem('incogRecent'));
		allHistory = JSON.parse(localStorage.getItem('incogHistory'));
	
		recentlyClosed.length = 0;
		allHistory.length = 0;
		
		localStorage.setItem('incogHistory', JSON.stringify(allHistory));
		localStorage.setItem('incogRecent', JSON.stringify(recentlyClosed));
		

		recordList0.innerHTML = '';
		recordList1.innerHTML = '';
		nullResponse('You hopped back!');
		hop_reseter();

	});
	

	var nullResponse = function (message) {
		document.getElementById('tab-response-content').style.display = 'block';
		document.getElementById('response-text').innerHTML = message;
	}

	var notNullResponse = function () {
		document.getElementById('tab-response-content').style.display = 'none';
		document.getElementById('response-text').innerHTML = '';
	}

});


		
// Show 
function showRecord(result, list) {
	var i,
		ul = document.getElementById(list),
		record = result,
		recordLength = record.length - 1,
		ulType = parseInt(list.charAt(list.length - 1));

	for (i = recordLength; i >= 0; i--) {
		var li = document.createElement('li');
		var img = document.createElement('img');
		var favIconUrl = record[i].favIcon;
		if (favIconUrl != undefined)
			img.setAttribute('src', favIconUrl);

		li.appendChild(img);

		var a = document.createElement('a');
		a.setAttribute('href', record[i].url);
		if (ulType)
			a.setAttribute('class', 'history-target-link');
		else
			a.setAttribute('class', 'recent-target-link');

		a.appendChild(document.createTextNode(record[i].title));
		li.appendChild(a);

		var span = document.createElement('span');
		var time = new Date(record[i].timestamp);
		var hour = time.getHours();
		var minutes = time.getMinutes();
		if (minutes > 9)
			span.appendChild(document.createTextNode(hour + ":" + minutes));
		else
			span.appendChild(document.createTextNode(hour + ":0" + minutes));

		li.appendChild(span);
		ul.appendChild(li);
	}
}
