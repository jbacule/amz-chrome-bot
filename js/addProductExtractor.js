function addProductExtractor(){
	let url = $(location).attr("href");
	let searchId = $('#product-search').attr("value");
	if(url.indexOf('https://sellercentral.amazon.com/productsearch') > -1){
		let data = [];
		jQuery.each($('div.a-box.product'), (index, item) => {
			let title = $(item).find('div.a-fixed-right-grid-col.description > span.a-text-bold').text();
			let upc = $(item).find('div.a-fixed-right-grid-col.description > span:nth-child(2)').text();
			let ean = $(item).find('div.a-fixed-right-grid-col.description > span:nth-child(3)').text();
			let asin = $(item).find('div.a-fixed-right-grid-col.description > a').attr('href');
			
			let usedUPC = upc.includes("UPC") ? upc.substring(5,upc.length) : "-";
			let usedEAN = ean.includes("EAN") ? ean.substring(5,ean.length) : "-";
			let usedASIN = asin.substring(asin.length-10,asin.length);
			console.log({searchId,usedUPC, usedEAN, usedASIN, title })
			let res = `${searchId}|${usedUPC}|${usedEAN}|${usedASIN}|${title}`;
			data.push(res);
		});	
		document.title = data.join("\n");
	}
}