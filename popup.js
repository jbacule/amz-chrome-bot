$(document).ready(function() {
    panelController();
    manageButtons();
    manageUploadFeed();
    manageAmazonPage();
});

function panelController(){
    $(':button').click(function(){
        if (this.id == 'btnManageInv') {
            modifyPanel(this.id, 'ManageInv');
        }else if (this.id == 'btnPriceAlert') {
            modifyPanel(this.id, 'PriceAlert');
        }else if (this.id == 'btnUploadFeed') {
            modifyPanel(this.id, 'UploadFeed');
        }else if (this.id == 'btnAmazonPage') {
            modifyPanel(this.id, 'AmazonPage');
        }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, callback);

    function callback(tabs) {
        let tabData = tabs[0];
        if(tabData.title === "Manage Inventory - Price Alerts"){
            modifyPanel('btnPriceAlert', 'PriceAlert');
        }else if(tabData.title === "Manage Inventory"){
            modifyPanel('btnManageInv', 'ManageInv');
        }else if(tabData.url.indexOf('sellercentral.amazon.com/listing/upload') >= 0){
            modifyPanel('btnUploadFeed', 'UploadFeed');
        }else{
            modifyPanel('btnAmazonPage', 'AmazonPage');
        }
    }
}

function modifyPanel(btn, panel){
    $(`.panel`).css({ display: "none" });
    $(`.tablink`).removeClass(' w3-teal');
    $(`#${panel}`).css({ display: "block" });
    $(`#${btn}`).addClass(' w3-teal');
}

function manageButtons(){
    // Manage Inventory Page
    $('#btnExtractManage').click(function(){
        chrome.storage.local.set({"pageEnabled": "manageInventory"});
        chrome.tabs.executeScript({
            file: "content.js"
        });
        $("#btnExtractManage").attr("disabled", true);
        $("#btnExtractManage").html("Copied!");
        setInterval(function(){
            $("#btnExtractManage").attr("disabled", false);
            $("#btnExtractManage").html("Extract Table");
        },2000);
    });
    $('#btnSearchManage').click(function(){
        let searchText = $('#txtSearchManage').val();
        chrome.tabs.update({url: `https://sellercentral.amazon.com/inventory/ref=xx_invmgr_dnav_xx?search:${searchText}`});
        window.close();
    });
    // Price Alert Page
    $('#btnExtractPrice').click(function(){
        chrome.storage.local.set({"pageEnabled": "priceAlerts"});
        chrome.tabs.executeScript({
            file: "content.js"
        });
        $("#btnExtractPrice").attr("disabled", true);
        $("#btnExtractPrice").html("Copied!");
        setInterval(function(){
            $("#btnExtractPrice").attr("disabled", false);
            $("#btnExtractPrice").html("Extract Table");
        },2000);
    });
    $('#btnSearchPrice').click(function(){
        let searchText = $('#txtSearchPrice').val();
        chrome.tabs.update({url: `https://sellercentral.amazon.com/inventory?viewId=PRICEALERTS&ref_=myi_pa_vl_fba&search:${searchText}`});
        window.close();
    });
}

function manageUploadFeed(){
    chrome.storage.local.get("priceAlertStatus", function(data) {
        if(data.priceAlertStatus==="enabled"){
            $("#btnUploadStatus").html('Disabled');
            $(`#btnUploadStatus`).removeClass('w3-red').addClass('w3-blue');
        }else{
            $("#btnUploadStatus").html('Enable');
            $(`#btnUploadStatus`).removeClass('w3-blue').addClass('w3-red');
        }
    });

    $("#btnUploadStatus").on("click",function() {
        chrome.storage.local.get("priceAlertStatus", function(data) {
            let status = data.priceAlertStatus;
            let newStatus;
            if(status==="enabled"){
                newStatus = "disabled";
                $("#btnUploadStatus").html('Enable');
                $(`#btnUploadStatus`).removeClass('w3-blue').addClass('w3-red');
            }else{
                newStatus = "enabled";
                $("#btnUploadStatus").html('Disabled');
                $(`#btnUploadStatus`).removeClass('w3-red').addClass('w3-blue');
            }
            chrome.storage.local.set({"priceAlertStatus": newStatus});
    
            // reload page
            chrome.tabs.update({url: `https://sellercentral.amazon.com/listing/upload?ref_=xx_upload_tnav_status`});
            chrome.tabs.executeScript({
                file: 'content.js'
            });
        });
    });
    $('#gotoUploadFeed').click(function(){
        chrome.tabs.update({url: `https://sellercentral.amazon.com/listing/upload?ref_=xx_upload_tnav_status`});
    });
}

function manageAmazonPage(){
    $('#btnOlp,#btnMdp').click(function(){
        let txtSearchAmazon = $('#txtSearchAmazon').val();
        if(txtSearchAmazon === "" || txtSearchAmazon.substring(0,2) !== "B0"){
            $("#alert-msg").text("Invalid ASIN!");
        }else{
            $("#alert-msg").text("");
            if(this.id==="btnOlp"){
                chrome.tabs.update({url: `https://www.amazon.com/gp/offer-listing/${txtSearchAmazon}`});
            }else{
                chrome.tabs.update({url: `https://www.amazon.com/dp/${txtSearchAmazon}`});
            }
            window.close();
        }
    });
}