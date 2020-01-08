uploadFeed();

chrome.storage.local.get("pageEnabled", function(data) {
	if(data.pageEnabled === "manageInventory"){
		copyToClipboard(manageInventory());
		showNotification("Hello!","Manage Inventory Data Extracted!");
	}else if(data.pageEnabled === "priceAlerts"){
		copyToClipboard(priceAlerts());
		showNotification("Hello!","Price Alert Data Extracted!");
	}else if(data.pageEnabled === "amazonPage"){
		copyToClipboard(amazonDetailPage());
		showNotification("Wazzup!","Amazon Product Details Extracted!");
	}
	chrome.storage.local.set({'pageEnabled':'done'})
});

$(window).keydown(function(e) {
    if(e.ctrlKey && e.keyCode == 13){ //keyboard shortcut: ctrl key + enter
		if(document.title === "Manage Inventory"){
			copyToClipboard(manageInventory());	
			showNotification("Hi!","Manage Inventory Data Extracted!");
		}else if(document.title === "Manage Inventory - Price Alerts"){
			copyToClipboard(priceAlerts());
			showNotification("Hi!","Price Alert Data Extracted!");
		}else if(window.location.href.indexOf('/dp/B0') > -1){
			copyToClipboard(amazonDetailPage());
		    showNotification("Wazzup!","Amazon Product Details Extracted!");
		}
	}

	if(window.location.href.indexOf('www.amazon.com') > -1){
		if(e.ctrlKey && e.keyCode == 37){ // shift key + enter
			document.querySelector('#olpProductImage > a').click();
		}else if(e.ctrlKey && e.keyCode == 39){ // ctrl key + enter
			let asin = window.location.href.substring(window.location.href.indexOf('/B0')+1, window.location.href.indexOf('/B0')+11);
			window.location.href = 'https://www.amazon.com/dp/offer-listing/' + asin;
		}
	}
});

if(document.URL.indexOf('https://sellercentral.amazon.com/listing/status') > -1){
	// //upload status page
	// let onProgessCount = 0;
	// let batchIds = "";
	// jQuery.each($('td[data-column="status"]'), (index, item) => {
	// 	let batchid = $(item).find('div[data-column="feed_status"]').attr('data-row');
	// 	let status = $(item).find('div[data-column="feed_status"] > div > span').text();
		
	// 	if(status.trim() === "Upload Status In Progress"){
	// 		onProgessCount = onProgessCount + 1;
	// 		batchIds =+ batchid + "\n";
	// 	}
	// });
	// setTimeout(function(){
	// 	if(onProgessCount===0){
	// 		showNotification("Hello!",`Your uploads in the first page are all done.`);
	// 	}else{
	// 		showNotification("Hey!",`You have ${onProgessCount} ongoing upload.\nBatch Ids:\n${batchIds}`);
	// 	}
	// },1000);
}else if(document.URL.indexOf('sellercentral.amazon.com/productsearch') > -1 ){
	//old add product page
	jQuery.each($('a[data-csm="seeAllProductDetailsClick"]'), (index, item) => {
		let url = $(item).attr('href');
		let asin = url.substring(url.length-10,url.length)
		$(item).html(`ASIN: ${asin}`);
	});
}else if(document.URL.indexOf('sellercentral.amazon.com/product-search/search')>-1){
	//new add product page
	setTimeout(function(){
		jQuery.each($('div.content.kat-row.row-container'), (index, item) => {
			let url = $(item).find('a').attr('href');
			let asin = url.substring(url.length-10,url.length);
			let source = $(item).find('section.kat-col-xs-6.search-row-identifier-attributes').html();
			$(item).find('section.kat-col-xs-6.search-row-identifier-attributes').html(source + `<p class="attribute"><span class="bold">ASIN</span>: ${asin}</p>`);
		});
	},2000);
}

function copyToClipboard(text){
	const els = document.createElement('textarea');
	els.value = text;
	document.body.appendChild(els);
	els.select();
	document.execCommand('copy');
	document.body.removeChild(els)
}

function showNotification(title, message){
	let opt = {
		type: "basic",
		title: title,
		message: message,
		iconUrl: "images/icon128.png"
	};
	chrome.runtime.sendMessage({type: "shownotification", opt: opt});
};