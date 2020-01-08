$(document).ready(function() {
    setupUI();
    panelController();
    manageButtons();
    manageUploadFeed();
    manageAmazonPage();
    manageNewTab();
    manageMenuShortcut();
});

function setupUI(){
    chrome.storage.local.get(['version','author'], function(data){
        $('#appVersion').text(`v${data.version}`);
        $('#appAuthor').text(`Created by ${data.author}`);
    })
}

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
        }else if (this.id == 'btnHelp') {
            modifyPanel(this.id, 'Help');
        }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, callback);

    function callback(tabs) {
        let tabData = tabs[0];
        if(tabData.title === "Manage Inventory - Price Alerts"){
            modifyPanel('btnPriceAlert', 'PriceAlert');
            manageExtractButtons(2);
        }else if(tabData.title === "Manage Inventory"){
            modifyPanel('btnManageInv', 'ManageInv');
            manageExtractButtons(1);
        }else if(tabData.url.indexOf('sellercentral.amazon.com/listing/upload') >= 0){
            modifyPanel('btnUploadFeed', 'UploadFeed');
            manageExtractButtons(3);
        }else if(tabData.title.indexOf('Amazon.com') >= 0){
            modifyPanel('btnAmazonPage', 'AmazonPage');
            manageExtractButtons(0);
        }else{
            modifyPanel('btnHelp', 'Help');
            manageExtractButtons(0);
        }

        if(tabData.url.indexOf("dp/B0") >= 0){
            $("#btnExtractAmazon").attr("disabled", false);
        }else{
            $("#btnExtractAmazon").attr("disabled", true);
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
        chrome.storage.local.get("manageNewTab", function(data) {
            if(data.manageNewTab==="enabled"){
                chrome.tabs.create({url: `https://sellercentral.amazon.com/inventory/ref=xx_invmgr_dnav_xx?search:${searchText}`});
            }else{
                chrome.tabs.update({url: `https://sellercentral.amazon.com/inventory/ref=xx_invmgr_dnav_xx?search:${searchText}`});
            }
        });
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
        chrome.storage.local.get("priceNewTab", function(data) {
            if(data.priceNewTab==="enabled"){
                chrome.tabs.create({url: `https://sellercentral.amazon.com/inventory?viewId=PRICEALERTS&ref_=myi_pa_vl_fba&search:${searchText}`});
            }else{
                chrome.tabs.update({url: `https://sellercentral.amazon.com/inventory?viewId=PRICEALERTS&ref_=myi_pa_vl_fba&search:${searchText}`});
            }
        });
        window.close();
    });

    $('#btnExtractAmazon').click(function(){
        chrome.storage.local.set({"pageEnabled": "amazonPage"});
        chrome.tabs.executeScript({
            file: "content.js"
        });
        $("#btnExtractAmazon").attr("disabled", true);
        $("#btnExtractAmazon").html("Copied!");
        setInterval(function(){
            $("#btnExtractAmazon").attr("disabled", false);
            $("#btnExtractAmazon").html("Extract Details");
        },2000);
    });
}

function manageUploadFeed(){
    chrome.storage.local.get("purgeReplaceStatus", function(data) {
        if(data.purgeReplaceStatus==="enabled"){
            $("#btnUploadStatus").html('Disabled');
            $(`#btnUploadStatus`).removeClass('w3-red').addClass('w3-blue');
        }else{
            $("#btnUploadStatus").html('Enable');
            $(`#btnUploadStatus`).removeClass('w3-blue').addClass('w3-red');
        }
    });

    $("#btnUploadStatus").on("click",function() {
        chrome.storage.local.get("purgeReplaceStatus", function(data) {
            let status = data.purgeReplaceStatus;
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
            chrome.storage.local.set({"purgeReplaceStatus": newStatus});
    
            // reload page
            chrome.tabs.update({url: `https://sellercentral.amazon.com/listing/upload?ref_=xx_upload_tnav_status`});
            chrome.tabs.executeScript({
                file: 'content.js'
            });
        });
    });
    $('#gotoUploadFeed').click(function(){
        chrome.tabs.create({url: `https://sellercentral.amazon.com/listing/upload?ref_=xx_upload_tnav_status`});
    });
}

function manageAmazonPage(){
    $('#btnOlp,#btnMdp').click(function(){
        let button = this.id;
        let txtSearchAmazon = $('#txtSearchAmazon').val();
        if(txtSearchAmazon === "" || txtSearchAmazon.substring(0,2) !== "B0"){
            $("#alert-msg").text("Invalid ASIN!");
        }else{
            $("#alert-msg").text("");
            chrome.storage.local.get("amazonNewTab", function(data) {
                if(data.amazonNewTab==="enabled"){
                    if(button==="btnOlp"){
                        chrome.tabs.create({url: `https://www.amazon.com/gp/offer-listing/${txtSearchAmazon}`});
                    }else{
                        chrome.tabs.create({url: `https://www.amazon.com/dp/${txtSearchAmazon}`});
                    }
                }else{
                    if(button==="btnOlp"){
                        chrome.tabs.update({url: `https://www.amazon.com/gp/offer-listing/${txtSearchAmazon}`});
                    }else{
                        chrome.tabs.update({url: `https://www.amazon.com/dp/${txtSearchAmazon}`});
                    }
                }
            });
            window.close();
        }
    });
}

function manageNewTab(){
    chrome.storage.local.get(['manageNewTab', 'priceNewTab','amazonNewTab'], function(data){
        data.manageNewTab === "enabled" ? $('#chkManage').prop('checked', true) : $('#chkManage').prop('checked', false);
        data.priceNewTab === "enabled" ? $('#chkPrice').prop('checked', true) : $('#chkPrice').prop('checked', false);
        data.amazonNewTab === "enabled" ? $('#chkAmazon').prop('checked', true) : $('#chkAmazon').prop('checked', false);
    })
    $('input:checkbox').change(function(){
        if (this.id === 'chkManage') {
            let newTabStatus = $('#chkManage').prop('checked') ? "enabled" : "disabled";
            chrome.storage.local.set({'manageNewTab' : newTabStatus});
        }else if (this.id === 'chkPrice') {
            let newTabStatus = $('#chkPrice').prop('checked') ? "enabled" : "disabled";
            chrome.storage.local.set({'priceNewTab' : newTabStatus});
        }else if (this.id === 'chkAmazon') {
            let newTabStatus = $('#chkAmazon').prop('checked') ? "enabled" : "disabled";
            chrome.storage.local.set({'amazonNewTab' : newTabStatus});
        }
    });
}

function manageExtractButtons(index){
    if(index==1){
        $("#btnExtractManage").attr("disabled", false);
        $("#btnExtractPrice").attr("disabled", true);
        $("#btnUploadStatus").attr("disabled", true);
        $("#btnUploadStatus").attr("disabled", true);
    }else if(index==2){
        $("#btnExtractManage").attr("disabled", true);
        $("#btnExtractPrice").attr("disabled", false);
        $("#btnUploadStatus").attr("disabled", true);
    }else if(index==3){
        $("#btnExtractManage").attr("disabled", true);
        $("#btnExtractPrice").attr("disabled", true);
        $("#btnUploadStatus").attr("disabled", false);
    }else{
        $("#btnExtractManage").attr("disabled", true);
        $("#btnExtractPrice").attr("disabled", true);
        $("#btnUploadStatus").attr("disabled", true);
    }
}

function manageMenuShortcut(){
    document.body.onkeyup = function(e){
        if(e.ctrlKey && e.keyCode == 50){
            modifyPanel('btnPriceAlert', 'PriceAlert');
        }else if(e.ctrlKey && e.keyCode == 49){
            modifyPanel('btnManageInv', 'ManageInv');
        }else if(e.ctrlKey && e.keyCode == 51){
            modifyPanel('btnUploadFeed', 'UploadFeed');
        }else if(e.ctrlKey && e.keyCode == 52){
            modifyPanel('btnAmazonPage', 'AmazonPage');
        }else if(e.ctrlKey && e.keyCode == 53){
            modifyPanel('btnHelp', 'Help');
        }
    }
}