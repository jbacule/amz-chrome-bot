chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

	if (request.greeting == "hello"){
		let url = $(location).attr('href');
		let asin = url.substring(url.indexOf('dp/B0')+3,url.indexOf('dp/B0')+13)
		let brand = $('#bylineInfo').text();
		let category = verifyData($('#wayfinding-breadcrumbs_feature_div').text());
		let childTitle = verifyData($('#imgTagWrapperId > img').attr("alt"));
		let parentTitle = verifyData($('#productTitle').text());
		let mainImage = verifyData($('#imgTagWrapperId > img').attr("data-old-hires"));
		let dimension = $('#imgTagWrapperId > img').height().toFixed(0) + "x" + $('#imgTagWrapperId > img').width().toFixed(0);
		let bullets = [];
		$('#feature-bullets > ul > li').each(function(){
		let bullet = verifyData($(this).text());
			bullets.push(bullet)
		});
		let description = verifyData($('#productDescription').text());

		let objectData = {
			asin,
			brand,
			category,
			childTitle,
			parentTitle,
			mainImage,
			dimension,
			bullets: bullets.join('|'),
			description
		}
		sendResponse({farewell: JSON.stringify(objectData) });
	}
	
});

uploadFeed();

chrome.storage.local.get("velcroDetectorStatus", function(data){
	if(data.velcroDetectorStatus === "enabled"){
		console.log('velcro detector enabled');
		velcroDetector();
	}
})

chrome.storage.local.get("noImgDetectorStatus", function(data){
	if(data.noImgDetectorStatus === "enabled"){
		console.log('No Image detector enabled');
		noImgDetector();
	}
})

chrome.storage.local.get("addProductExtractorStatus", function(data){
	if(data.addProductExtractorStatus === "enabled"){
		console.log('Add Product Extractor enabled');
		addProductExtractor();
	}
})

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
			console.log(amazonDetailPage());
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

if(document.URL.indexOf('sellercentral.amazon.com/productsearch') > -1 ){
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
	},4000);
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