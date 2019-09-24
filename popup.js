$(function(){
    $(".pages").hide();
    function callback(tabs) {
        let currentTab = tabs[0];
        detectSCSite(currentTab.url);
        
        setPriceAlert();
    }
    chrome.tabs.query({ active: true, currentWindow: true }, callback);
})

const detectSCSite = url => {
    let page = "";
    if(url.indexOf('sellercentral.amazon.com/inventory?viewId=PRICEALERTS') >= 0){
        page = "Price Alerts"
        $(".pages").hide();
        $("#priceAlert").show();
    }else if(url.indexOf('sellercentral.amazon.com/inventory/') >= 0){
        page =  "Manage Inventory"
        $(".pages").hide();
        $("#manageInventory").show();
    }else if(url.indexOf('sellercentral.amazon.com/listing/upload') >= 0){
        page =  "Upload Feed"
        $(".pages").hide();
        $("#uploadFeed").show();
    }else{
        page = ""
    }

    if(page!==""){
        $('#url').text(`${page} Page detected!`);
    }else{
        $('#url').hide();
    }
}

const setPriceAlert = () => {
    chrome.storage.local.get("priceAlertStatus", function(data) {
        data.priceAlertStatus === "enabled" ? $("#switchValue").prop('checked', true) : $("#switchValue").prop('checked', false);
    });

    $("#switchValue").prop('checked', false);
    $("#purgeReplaceStatus").text("Purge & Replace Disabled!");

    $(".switch").on("click",function() {
        let status = "disabled";
        let setEnabled = $("#switchValue").prop('checked');
        if(setEnabled){
            status = "disabled";
            $("#switchValue").prop('checked', false);
            $("#purgeReplaceStatus").text("Purge & Replace Disabled!");
        }else{
            status = "enabled";
            $("#switchValue").prop('checked', true);
            $("#purgeReplaceStatus").text("Purge & Replace Enabled!");
        }

        chrome.storage.local.set({"priceAlertStatus": status});

        //reload page
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.reload(tabs[0].id);
        });
        chrome.tabs.executeScript(null, {
            file: 'content.js'
        });
    });
}

const setManageInventory = () => {
    $("#manageInventory > button").click(function(){
        chrome.storage.local.set({"manageInventoryStatus": "enabled"});
        chrome.tabs.executeScript(null, {
            file: 'content.js'
        });
    })
}