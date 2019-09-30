uploadFeed();
chrome.storage.local.get("pageEnabled", function(data) {
	if(data.pageEnabled === "manageInventory"){
		copyToClipboard(manageInventory());
	}else if(data.pageEnabled === "priceAlerts"){
		copyToClipboard(priceAlerts());
	}
});

chrome.storage.local.get("copyShortcut", function(data) {
	if(data.copyShortcut === "enabled"){
		document.body.onkeyup = function(e){
			if(e.ctrlKey && e.keyCode == 13){ //keyboard shortcut: ctrl key + enter
				if(document.title === "Manage Inventory"){
					copyToClipboard(manageInventory());	
					showNotification("Copy","Manage Inventory Copied!");
				}else{
					copyToClipboard(priceAlerts());
					showNotification("Copy","Manage Inventory Copied!");
				}
			}
		}	
	}
});

chrome.storage.local.get("shortcutAmazonNavigator", function(data) {
	if(data.shortcutAmazonNavigator === "enabled"){
		document.body.onkeyup = function(e){
			if(e.ctrlKey && e.keyCode == 37){ // shift key + enter
				document.querySelector('#olpProductImage > a').click();
			}else if(e.ctrlKey && e.keyCode == 39){ // ctrl key + enter
				let asin = window.location.href.substring(window.location.href.indexOf('/B0')+1, window.location.href.indexOf('/B0')+11);
				window.location.href = 'https://www.amazon.com/dp/offer-listing/' + asin;
			}
		}	
	}
});

function copyToClipboard(text){
	const els = document.createElement('textarea');
	els.value = text;
	document.body.appendChild(els);
	els.select();
	document.execCommand('copy');
	document.body.removeChild(els)
}

function showNotification(title, message){
	let opt = {
		type: "basic",
		title: title,
		message: message,
		iconUrl: "images/icon128.png"
	};
	chrome.runtime.sendMessage({type: "shownotification", opt: opt});
};