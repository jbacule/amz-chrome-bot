function addProductExtractor(){
	let url = $(location).attr("href");
	let searchId = $('#product-search').attr("value");
	if(url.indexOf('https://sellercentral.amazon.com/productsearch') > -1){
		let data = [];
		jQuery.each($('div.a-box.product'), (index, item) => {
			let title = $(item).find('div.a-fixed-right-grid-col.description > span.a-text-bold').text();
			let upc = $(item).find('div.a-fixed-right-grid-col.description > span:nth-child(2)').text();
			let ean = $(item).find('div.a-fixed-right-grid-col.description > span:nth-child(3)').text();
			let salesRank = $(item).find('div.a-fixed-right-grid-col.description > span:nth-child(4)').text();
			let offers = $(item).find('div.a-fixed-right-grid-col.description > span.offerCountDetails').text();
			let asin = $(item).find('div.a-fixed-right-grid-col.description > a').attr('href');
			
			let usedUPC = upc.includes("UPC") ? upc.substring(5,upc.length) : "-";
			let usedEAN = ean.includes("EAN") ? ean.substring(5,ean.length) : "-";
			let usedASIN = asin.substring(asin.length-10,asin.length);
			let usedSalesRank = salesRank.includes("Sales Rank") ? salesRank : "-";
			let usedOffer = offers ? verifyData(offers) : "-";

			console.log({searchId,usedUPC, usedEAN, usedASIN, title, usedSalesRank, usedOffer })

			let res = `${searchId}|${usedUPC}|${usedEAN}|${usedASIN}|${title}`;
			data.push(res);
		});	
		document.title = data.join("\n");
	}else if(url.indexOf('https://sellercentral.amazon.com/product-search') > -1){
		setTimeout(function(){
			let productId = $('div.search-input-container > kat-input-group > kat-input').attr('value');
			let count = $('div.content.kat-row.row-container').length;
			jQuery.each($('div.content.kat-row.row-container'), (index, item) => {
				let title = $(item).find('section.kat-col-xs-4.search-row-title > kat-link').attr('label');
				let link = $(item).find('section.kat-col-xs-4.search-row-title > kat-link').attr('href');
				let asin = link.substring(link.length-10, link.length);
				let UPC = 'n/a';
				let EAN = 'n/a';
				
				jQuery.each($(item).find('section.kat-col-xs-6.search-row-identifier-attributes > p'), (index, data) => {
					let res = data.innerText;
					if(res.includes('UPC')){
						UPC = res.substring(5, res.length)
					}
					if(res.includes('EAN')){
						EAN = res.substring(5, res.length)
					}
				})
				
				let salesRank = 'n/a';
				let offers = 'n/a';
				jQuery.each($(item).find('section.kat-col-xs-6.search-row-sales-attributes > p'), (index, data) => {
					let res = data.innerText;
					if(res.includes('Sales rank')){
						salesRank = res.substring(11, res.length)
					}
					if(res.includes('Offers')){
						offers = res.substring(8, res.length)
					}
				})
				let status = count > 1 ? 'Duplicate' : 'Non-Duplicate';
				console.log({ productId, asin, title, UPC, EAN, salesRank, offers, status });
			})
		},1500)
	}
}

function verifyData(data){
    if(data!=undefined){
        return data.replace(/\n|\t|\r|…/g,'').replace(/\s+/g,' ').trim();
    }else{
        return "n/a";
    }
}