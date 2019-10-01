chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({
      "copyShortcut": "enabled",
      "purgeReplaceStatus": "disabled",
      "shortcutAmazonNavigator": "enabled",
      "manageNewTab": "enabled",
      "priceNewTab": "enabled",
      "amazonNewTab": "enabled"
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.type == "shownotification"){
    chrome.notifications.create("notify", request.opt, function(msj) {
      setTimeout(function() {
        chrome.notifications.clear(msj);
      }, 5000); 
    });
  }
});