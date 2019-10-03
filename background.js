chrome.runtime.onInstalled.addListener(function() {
  let { version, name, description, author } = chrome.runtime.getManifest();
  chrome.storage.local.set({
      version,
      name,
      author,
      description,
      "copyShortcut": "enabled",
      "purgeReplaceStatus": "disabled",
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