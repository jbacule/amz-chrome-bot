$(function(){
    $('.collapsible').collapsible();

    $(".pages").hide();
    function callback(tabs) {
        detectSCSite(tabs[0]);
    }
    chrome.tabs.query({ active: true, currentWindow: true }, callback);

    redirectLink();

    $("#menu").click(function(){
        $("#allPage").show();
        $("#pageHolder").hide();
    })
})

const detectSCSite = tabData => {
    let page = "";
    if(tabData.title === "Manage Inventory - Price Alerts"){
        page = "Price Alerts"
        $(".pages").hide();
        $("#priceAlert").show();
    }else if(tabData.title === "Manage Inventory"){
        page =  "Manage Inventory"
        $(".pages").hide();
        $("#manageInventory").show();
    }else if(tabData.url.indexOf('sellercentral.amazon.com/listing/upload') >= 0){
        page =  "Add Product via Upload"
        $(".pages").hide();
        $("#uploadFeed").show();
    }else{
        $("#allPage").show();
        $("#pageHolder").hide();
    }

    if(page!==""){
        $('#url').text(`${page}`);
    }else{
        $('#url').hide();
    }
    setUploadFeed();
    setManageInventory();
    setPriceAlerts();
}

const setUploadFeed = () => {
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
        $("#purgeReplaceStatus").text("Purge & Replace Enabled!");
    }else{
        $("#switchValue").prop('checked', isEnabled);
        $("#purgeReplaceStatus").text("Purge & Replace Disabled!");
    }
}

const setManageInventory = () => {
    $("#manageInventory > button").click(function(){
        chrome.storage.local.set({"pageEnabled": "manageInventory"});
        chrome.tabs.executeScript({
            file: "content.js"
        });
        $("#manageInventory > button").hide();
        $("#miStatus").text("Copied!");
        setInterval(function(){
            $("#manageInventory > button").show();
            $("#miStatus").text("");
        },2000);
    })
}

const setPriceAlerts = () => {
    $("#priceAlert > button").click(function(){
        chrome.storage.local.set({"pageEnabled": "priceAlerts"});
        chrome.tabs.executeScript({
            file: "content.js"
        });
        $("#priceAlert > button").hide();
        $("#paStatus").text("Copied!");
        setInterval(function(){
            $("#priceAlert > button").show();
            $("#paStatus").text("");
        },2000);
    })
}

const redirectLink = () => {
    $("a.collection-item:nth-child(1)").click(function(){
        chrome.tabs.update({url: "https://sellercentral.amazon.com/inventory/ref=xx_invmgr_dnav_xx"});
        window.close();
    });
    $("a.collection-item:nth-child(2)").click(function(){
        chrome.tabs.update({url: "https://sellercentral.amazon.com/inventory?viewId=PRICEALERTS&ref_=myi_pa_vl_fba"});
        window.close();
    });
    $("a.collection-item:nth-child(3)").click(function(){
        chrome.tabs.update({url: "https://sellercentral.amazon.com/listing/upload?ref_=xx_upload_tnav_status"});
        window.close();
    });
    $("a.collection-item:nth-child(4)").click(function(){
        $("#allPage").hide();
        $("#amazonPage").show();
    });
}