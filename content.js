uploadFeed();
chrome.storage.local.get("pageEnabled", function(data) {
	if(data.pageEnabled === "manageInventory"){
		copyToClipboard(manageInventory());
	}else if(data.pageEnabled === "priceAlerts"){
		copyToClipboard(priceAlerts());
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