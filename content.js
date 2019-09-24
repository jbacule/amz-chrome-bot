let opt = {
	type: "basic",
	title: "Warning!",
	message: "This is message!",
	iconUrl: "images/icon128.png"
};
chrome.runtime.sendMessage({type: "shownotification", opt: opt}); 