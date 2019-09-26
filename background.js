chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'sellercentral.amazon.com'},
      }),
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'www.amazon.com'},
      })
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
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