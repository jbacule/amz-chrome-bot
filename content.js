chrome.storage.local.get("priceAlertStatus", function(data) {
	let uploadHeader = $('span.a-color-error').text();
	let elem = '#vlw-container > div.a-row > div.a-column.a-span9 > div.a-row.a-expander-container.a-expander-section-container.a-section-expander-container';
	if( uploadHeader === 'Purge and Replace Your Inventory'){
		if(data.priceAlertStatus === "disabled"){
			$(elem).hide();
		}else{
			$(elem).show();
		}
		showNotification('Reminder',`Purge & Replace was ${data.priceAlertStatus}!`)
	}
});

chrome.storage.local.get("manageInventoryStatus", function(data) {
	let url = $(location).attr("href");
	if(url.indexOf("sellercentral.amazon.com/inventory/ref=xx_invmgr_dnav_xx") > -1){
		if(data.manageInventoryStatus === "enabled"){
			copyToClipboard(manageInventory());
			showNotification('Copied',"Data Successfully copied to Clipboard!");
		}
	}
});

const showNotification = (title, message) => {
	let opt = {
		type: "basic",
		title: title,
		message: message,
		iconUrl: "images/icon128.png"
	};
	chrome.runtime.sendMessage({type: "shownotification", opt: opt});
};

const copyToClipboard = text => {
	const els = document.createElement('textarea');
	els.value = text;
	document.body.appendChild(els);
	els.select();
	document.execCommand('copy');
	document.body.removeChild(els)
}

function priceAlerts(){
	let data = "SKU\tSTATUS\tSTATUS2\tASIN\tTITLE\tQTY\tPrice\tMin\tMax\tFullfilledBy\n";
	document.querySelectorAll("table.a-bordered.a-horizontal-stripes.mt-table > tbody > tr.mt-row").forEach((item)=>{
	   let sku = $(item).find('td[data-column="sku"] > div > a').text();
	   let status = $(item).find('td[data-column="status"] > div:nth-child(1) > div[data-column="status"] > span > div > div > div > a > span').text();
	   let status2 = $(item).find('td[data-column="status"] > div:nth-child(2) > div > div > div').text();
	   let asin = $(item).find('td[data-column="title"] > div > div[data-column="asin"]').text();
	   let title = $(item).find('td[data-column="title"] > div > div[data-column="title"]').text();
	   let usedQTY = "";
	   let qty = $(item).find('td[data-column="quantity"] > div > div > div > span > input').attr("value");
	   if(qty==undefined){
		   usedQTY = $(item).find('td[data-column="quantity"] > div > div > span > div > div > div > a > span').text();
	   }else{
		   usedQTY = qty;
	   }
	   let price = $(item).find('td[data-column="price"] > div > div > div > span > input').attr("value");
	   let min = $(item).find('td[data-column="minimumPrice"] > div > div > div > span > input').attr("value");
	   let max = $(item).find('td[data-column="maximumPrice"] > div > div > div > span > input').attr("value");
	   let fullfilledby = $(item).find('td[data-column="fulfillment_channel"] > div > span').text();
	   data = data + verifyData(sku) + "\t" + verifyData(status) + "\t" + verifyData(status2) + "\t" + verifyData(asin) + "\t" + verifyData(title) +
		   "\t" + verifyData(usedQTY) + "\t" + verifyData(price) + "\t" + verifyData(min) + "\t" + verifyData(max) + "\t" + verifyData(fullfilledby) +"\n";
	});
	return data;
 }
 
 function manageInventory(){
	let data = "SKU\tSTATUS\tSTATUS2\tASIN\tTITLE\tQTY\tFullfilledBy\n";
   	document.querySelectorAll("table.a-bordered.a-horizontal-stripes.mt-table > tbody > tr.mt-row").forEach((item)=>{
	   let sku = $(item).find('td[data-column="sku"] > div > div[data-column="sku"]').text();
	   let usedStatus = "";
	   let status1 = $(item).find('td[data-column="status"] > div:nth-child(1) > div[data-column="status"] > div > span').text();
	   console.log(status1)
	   if(status1==""){
		  usedStatus = $(item).find('td[data-column="status"] > div > div[data-column="status"] > div > a').text();
	   }else{ usedStatus = status1 }
	   let status2 = $(item).find('td[data-column="status"] > div:nth-child(2) > div > div > div').text();
	   let asin = $(item).find('td[data-column="title"] > div > div[data-column="asin"]').text();
	   let title = $(item).find('td[data-column="title"] > div > div[data-column="title"]').text();
	   let usedQTY = "";
	   let qty = $(item).find('td[data-column="quantity"] > div > div > div > span > input').attr("value");
	   if(qty==undefined){
		   usedQTY = $(item).find('td[data-column="quantity"] > div > div > span > div > div > div > a > span').text();
	   }else{
		   usedQTY = qty;
	   }
	   let fullfilledby = $(item).find('td[data-column="fulfillment_channel"] > div > span').text();
	   data = data + verifyData(sku) + "\t" + verifyData(usedStatus) + "\t" + verifyData(status2) + "\t" + verifyData(asin) + "\t" + verifyData(title) + "\t" + verifyData(usedQTY) + "\t" + verifyData(fullfilledby) + "\n";
   	});
	return data;
 }
 
 let verifyData = (data) =>{
	 if(data!=undefined){
		 return data.replace(/\n|\t|\r|…/g,'').replace(/\s+/g,' ').trim();
	 }else{
		 return "n/a";
	 }
 }