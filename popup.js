$(function(){
    $(".pages").hide();
    function callback(tabs) {
        detectSCSite(tabs[0]);
    }
    chrome.tabs.query({ active: true, currentWindow: true }, callback);
    
})

const detectSCSite = tabData => {
    console.log(tabData.id);
    let url = tabData.url;
    let page = "";
    if(url.indexOf('sellercentral.amazon.com/inventory?viewId=PRICEALERTS') >= 0){
        page = "Price Alerts"
        $(".pages").hide();
        $("#priceAlert").show();
    }else if(url.indexOf('sellercentral.amazon.com/inventory/ref=xx_invmgr_dnav_xx') >= 0 || url.indexOf('sellercentral.amazon.com/inventory?tbla_myitable') >= 0){
        page =  "Manage Inventory"
        $(".pages").hide();
        $("#manageInventory").show();
    }else if(url.indexOf('sellercentral.amazon.com/listing/upload') >= 0){
        page =  "Upload Feed"
        $(".pages").hide();
        $("#uploadFeed").show();
    }else{
        page = ""
        $("#allPage").show();
    }

    if(page!==""){
        $('#url').text(`${page} Page detected!`);
    }else{
        $('#url').hide();
    }
    setUploadFeed();
    setManageInventory();
    setPriceAlerts();
}

const setUploadFeed = () => {
    chrome.storage.local.set({"pageEnabled": "uploadFeed"});
    chrome.tabs.executeScript({
        file: 'content.js'
    });
    chrome.storage.local.get("priceAlertStatus", function(data) {
        if(data.priceAlertStatus === "enabled"){
            setupSwitch(true);
        }else{
            setupSwitch(false);
        }
    });
    
    $(".switch").on("click",function() {
        let status = "disabled";
        let setEnabled = $("#switchValue").prop('checked');
        if(setEnabled){
            status = "disabled";
            setupSwitch(false);
        }else{
            status = "enabled";
            setupSwitch(true);
        }
        chrome.storage.local.set({"priceAlertStatus": status});

        // reload page
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.reload(tabs[0].id);
        });
        chrome.tabs.executeScript({
            file: 'content.js'
        });
    });
}

const setupSwitch = isEnabled => {
    if(isEnabled){
        $("#switchValue").prop('checked', isEnabled);
        $("#purgeReplaceStatus").text("Purge & Replace Disabled!");
    }else{
        $("#switchValue").prop('checked', isEnabled);
        $("#purgeReplaceStatus").text("Purge & Replace Enabled!");
    }
}

const setManageInventory = () => {
    $("#manageInventory > button").click(function(){
        chrome.storage.local.set({"pageEnabled": "manageInventory"});
        chrome.tabs.executeScript({
            file: "content.js"
        });
    })
}

const setPriceAlerts = () => {
    $("#priceAlert > button").click(function(){
        chrome.storage.local.set({"pageEnabled": "priceAlerts"});
        chrome.tabs.executeScript({
            file: "content.js"
        });
    })
}