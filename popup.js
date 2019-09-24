$(function(){
    function callback(tabs) {
        let currentTab = tabs[0];
        let page = detectSCSite(currentTab.url);
        if(page!==""){
            $('#url').text(`${page} page detected!`);
        }
    }
    chrome.tabs.query({ active: true, currentWindow: true }, callback);
})

const detectSCSite = url => {
    if(url.indexOf('sellercentral.amazon.com/inventory?viewId=PRICEALERTS') >= 0){
        return "Price Alerts"
    }else if(url.indexOf('sellercentral.amazon.com/inventory/') >= 0){
        return "Manage Inventory"
    }else if(url.indexOf('sellercentral.amazon.com/listing/upload') >= 0){
        return "Upload Feed"
    }else{
        return ""
    }
}