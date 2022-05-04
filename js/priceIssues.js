const HEADERS = {
  //Inactive Offers - Listings Deactivated due to Potential Pricing Error
  inactiveOffers: {
    sku: 'SKU',
    asin: 'ASIN',
    title: 'TITLE',
    url: 'URL',
    condition: 'Condition',
    price: 'Price',
    minPrice: 'Min Price',
    minRecommendedPrice: 'Minimum Recommended Price',
    maxPrice: 'Max Price',
    maxRecommendedPrice: 'Maximum Recommended Price',
    averageSellingPrice: "ReferencePrice: Average Selling Price",
    featuredOffer: "ReferencePrice: Featured Offer",
    priceByAmazon: "ReferencePrice: Prize by Amazon",
    listPrice: "ReferencePrice: List Price"
  },
  //Featured Offer - Ineligible - Not Competitive Price
  foIneligible1: {
    sku: 'SKU',
    asin: 'ASIN',
    title: 'TITLE',
    url: 'URL',
    pricingStatus: 'Pricing Status',
    price: 'Price',
    shipping: 'Shipping',
    competitivePrice: 'Competitive Price'
  },
  //Featured Offer - Ineligible - High Price
  foIneligible2: {
    sku: 'SKU',
    asin: 'ASIN',
    title: 'TITLE',
    url: 'URL',
    pricingStatus: 'Pricing Status',
    price: 'Price',
    shipping: 'Shipping',
    averageSellingPrice: "ReferencePrice: Average Selling Price",
    featuredOffer: "ReferencePrice: Featured Offer",
    priceByAmazon: "ReferencePrice: Prize by Amazon",
    listPrice: "ReferencePrice: List Price"
  },
  //Featured Offer - Eligible But Not Offered
  foEligible: {
    sku: 'SKU',
    asin: 'ASIN',
    title: 'TITLE',
    url: 'URL',
    pricingStatus: 'Pricing Status',
    price: 'Price',
    shipping: 'Shipping',
    featuredOfferPrice: 'Featured Offer Price'
  },
  //Sales Conversion - Listings with No Sales
  scListingsNoSales: {
    sku: 'SKU',
    asin: 'ASIN',
    title: 'TITLE',
    url: 'URL',
    price: 'Price',
    shipping: 'Shipping',
    salesLast30Days: 'Sales in last 30 Days',
    proposedLowerPrice: 'Proposed Lower Price'
  },
}

function createExcelFile(filename, dataArray) {
  //dataArray = { sheetName, headers, rows, headers }
	let wb = XLSX.utils.book_new()
  for(let x in dataArray){
    let data = dataArray[x]
    let ws = XLSX.utils.json_to_sheet(data.rows, { header: data.headers });
    XLSX.utils.book_append_sheet(wb, ws, data.sheetName);
  }
	XLSX.writeFile(wb, filename);
}

async function extractPriceError() {
	let results = []
	let counter = -1;
	let worker = setInterval(() => {
		window.scrollTo(0, document.body.scrollHeight);
		document.querySelector("kat-button[label='Show more']").click();

		setTimeout(async () => {
			document.querySelectorAll('kat-table-body[role="rowgroup"] > kat-table-row[role="row"]:not(.pep-alert-row)').forEach((item, index) => {
				if (counter < index && item.querySelectorAll('kat-table-cell').length > 0) {
					let baseSelector = 'kat-table-cell.nudge-list-row-pep-bulk-action__col-one > div > div.product-details__description-container';

					let title = item.querySelector(`${baseSelector} > kat-link`) ? item.querySelector(`${baseSelector} > kat-link`).getAttribute('label') : '';
					let url = item.querySelector(`${baseSelector} > kat-link`) ? item.querySelector(`${baseSelector} > kat-link`).getAttribute('href') : '';
					let asin = item.querySelector(`${baseSelector} > div > div:nth-child(1)`) ? item.querySelector(`${baseSelector} > div > div:nth-child(1)`).textContent.replace(/\n|\r|\t|ASIN:/g, '').trim() : ''
					let sku = item.querySelector(`${baseSelector} > div > div:nth-child(2)`) ? item.querySelector(`${baseSelector} > div > div:nth-child(2)`).textContent.replace(/\n|\r|\t|SKU:/g, '').trim() : ''
					let condition = item.querySelector(`${baseSelector} > div > div:nth-child(3)`) ? item.querySelector(`${baseSelector} > div > div:nth-child(3)`).textContent.replace(/\n|\r|\t|Condition:/g, '').trim() : ''

					let priceElem  = item.querySelector('kat-table-cell.nudge-list-row-pep-bulk-action__col-four > div.product-offer-sale-business-price div.editable-price__new-price kat-input');
          let price = priceElem ? priceElem.getAttribute('value') : '';

          let minPriceELem = item.querySelector('kat-table-cell.nudge-list-row-pep-bulk-action__col-three > div.product-minimum-maximum-price > div:nth-child(2) div.editable-price__new-price kat-input');
					let minPrice = minPriceELem ? minPriceELem.getAttribute('value') : ''

          let minRecommenededPriceELem = item.querySelector('kat-table-cell.nudge-list-row-pep-bulk-action__col-three > div.product-minimum-maximum-price > div:nth-child(2) div.product-reference-price__source');
					let minRecommendedPrice = minRecommenededPriceELem ? minRecommenededPriceELem.textContent : ''

          let maxPriceELem = item.querySelector('kat-table-cell.nudge-list-row-pep-bulk-action__col-three > div.product-minimum-maximum-price > div:nth-child(4) div.editable-price__new-price kat-input');
					let maxPrice = maxPriceELem ? maxPriceELem.getAttribute('value') : ''

          let maxRecommendedPriceELem = item.querySelector('kat-table-cell.nudge-list-row-pep-bulk-action__col-three > div.product-minimum-maximum-price > div:nth-child(4) div.product-reference-price__source');
					let maxRecommendedPrice = maxRecommendedPriceELem ? maxRecommendedPriceELem.textContent : ''

					let referencePrices = []
					let noReferencePriceElem = item.querySelectorAll('kat-table-cell.nudge-list-row-pep__col-six div.product-reference-price:nth-child(1) > kat-label[text="No applicable Reference price"]')
					if (noReferencePriceElem.length === 0) {
						item.querySelectorAll('kat-table-cell.nudge-list-row-pep-bulk-action__col-five div.product-reference-price').forEach(e => {
							let value = e.querySelector('kat-label').getAttribute('text');
							let text = e.querySelector('div.product-reference-price__source') ? e.querySelector('div.product-reference-price__source').textContent.replace(/\n|\r/g, '').trim() : '';
							referencePrices.push({ text, value })
						})
					}

					let averageSellingPrice = referencePrices.length > 0 && referencePrices.some(e => e.text === 'Average Selling Price')
						? referencePrices.find(e => e.text === 'Average Selling Price').value : '-';

					let featuredOffer = referencePrices.length > 0 && referencePrices.some(e => e.text === 'Featured Offer')
						? referencePrices.find(e => e.text === 'Featured Offer').value : '-';

					let priceByAmazon = referencePrices.length > 0 && referencePrices.some(e => e.text === 'Price by Amazon')
						? referencePrices.find(e => e.text === 'Price by Amazon').value : '-';

					let listPrice = referencePrices.length > 0 && referencePrices.some(e => e.text === 'List Price')
						? referencePrices.find(e => e.text === 'List Price').value : '-';

          let objData = {}
          let { inactiveOffers } = HEADERS
          objData[inactiveOffers.sku] = sku
          objData[inactiveOffers.asin] = asin
          objData[inactiveOffers.title] = title
          objData[inactiveOffers.url] = url
          objData[inactiveOffers.condition] = condition
          objData[inactiveOffers.price] = price
          objData[inactiveOffers.minPrice] = minPrice
          objData[inactiveOffers.minRecommendedPrice] = minRecommendedPrice
          objData[inactiveOffers.maxPrice] = maxPrice
          objData[inactiveOffers.maxRecommendedPrice] = maxRecommendedPrice
          objData[inactiveOffers.averageSellingPrice] = averageSellingPrice
          objData[inactiveOffers.featuredOffer] = featuredOffer
          objData[inactiveOffers.priceByAmazon] = priceByAmazon
          objData[inactiveOffers.listPrice] = listPrice

          console.log(objData)
					results.push(objData)
					counter = index;
				}
			})


			let showMoreButtonStatus = document.querySelector("kat-button[label='Show more']");
			if (showMoreButtonStatus.getAttribute('disabled') && showMoreButtonStatus.getAttribute('disabled') === 'true') {
				clearInterval(worker)
				const headers = Object.values(HEADERS.inactiveOffers)
        await createExcelFile(`Price_Alerts-Inactive-Offers.xlsx`, [{
          sheetName: "Inactive Offers",
          headers,
          rows: results
        }])
			}
		}, 1500)
	}, 3000)
}

async function extractSalesConversion() {
	let results = []
	let counter = -1;
	let worker = setInterval(() => {
		window.scrollTo(0, document.body.scrollHeight);
		document.querySelector("kat-button[label='Show more']").click();

		setTimeout(async () => {
			document.querySelectorAll('kat-table-body[role="rowgroup"] > kat-table-row[role="row"]:not(.pep-alert-row)').forEach((item, index) => {
				if (counter < index && item.querySelectorAll('kat-table-cell').length > 0) {
					let baseSelector = 'kat-table-cell.nudge-list-row-nosale__col-one > div > div.product-details__description-container';

					let title = item.querySelector(`${baseSelector} > kat-link`).getAttribute('label');
					let url = item.querySelector(`${baseSelector} > kat-link`).getAttribute('href');
					let asin = item.querySelector(`${baseSelector} > div > div:nth-child(1)`).textContent.replace(/\n|\r|\t|ASIN:/g, '').trim()
					let sku = item.querySelector(`${baseSelector} > div > div:nth-child(2)`).textContent.replace(/\n|\r|\t|SKU:/g, '').trim()
					
					let price = item.querySelector('kat-table-cell.nudge-list-row-nosale__col-two > div.product-offer-price').firstChild.textContent
          let shipping = item.querySelector('kat-table-cell.nudge-list-row-nosale__col-two > div.product-offer-price > div.product-offer-price__shipping').textContent
					let salesLast30Days = item.querySelector('kat-table-cell.nudge-list-row-nosale__col-three').textContent
          let proposedLowerPrice = item.querySelector('kat-table-cell.nudge-list-row-nosale__col-four').textContent

          let objData = {}
          let { scListingsNoSales } = HEADERS
          objData[scListingsNoSales.sku] = sku
          objData[scListingsNoSales.asin] = asin
          objData[scListingsNoSales.title] = title
          objData[scListingsNoSales.url] = url
          objData[scListingsNoSales.price] = price
          objData[scListingsNoSales.shipping] = shipping
          objData[scListingsNoSales.salesLast30Days] = salesLast30Days
          objData[scListingsNoSales.proposedLowerPrice] = proposedLowerPrice

					results.push(objData)
					counter = index;
				}
			})


			let showMoreButtonStatus = document.querySelector("kat-button[label='Show more']");
			if (showMoreButtonStatus.getAttribute('disabled') && showMoreButtonStatus.getAttribute('disabled') === 'true') {
				clearInterval(worker)
				const headers = Object.values(HEADERS.scListingsNoSales)
        await createExcelFile(`Price_Alerts-Sales-Conversion.xlsx`, [{
          sheetName: "Sales Conversion",
          headers,
          rows: results
        }])
			}
		}, 1500)
	}, 3000)
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getFoIneligible1(){
  return new Promise(async (resolve, reject) => {
    document.querySelector('kat-tab.ph-tab-body[tab-id="FODNudgeList"]').shadowRoot.querySelector('div[role="tab"]').click()
    await delay(2000)

    //1st tab
    document.querySelector('kat-tab.ph-tab-fod-body[tab-id="FODNudgeList"]').shadowRoot.querySelector('div[role="tab"]').click()
    await delay(5000)

    let runWorker = true
    let rows1 = []
    let counter1 = -1;

    while(runWorker){
      document.querySelectorAll('kat-tab[tab-id="FODNudgeList"] > div > kat-table > kat-table-body[role="rowgroup"] > kat-table-row[role="row"]:not(.pep-alert-row)').forEach((item, index) => {
        if (counter1 < index && item.querySelectorAll('kat-table-cell').length > 0) {
          let baseSelector = 'kat-table-cell.nudge-list-row__col-one > div > div.product-details__description-container';

          let title = item.querySelector(`${baseSelector} > kat-link`).getAttribute('label');
          let url = item.querySelector(`${baseSelector} > kat-link`).getAttribute('href');
          let asin = item.querySelector(`${baseSelector} > div > div:nth-child(1)`).textContent.replace(/\n|\r|\t|ASIN:/g, '').trim()
          let sku = item.querySelector(`${baseSelector} > div > div:nth-child(2)`).textContent.replace(/\n|\r|\t|SKU:/g, '').trim()
          
          let pricingStatus = item.querySelector('kat-table-cell.nudge-list-row__col-three').textContent
          let price = item.querySelector('kat-table-cell.nudge-list-row__col-four > div.product-offer-price').firstChild.textContent
          let shipping = item.querySelector('kat-table-cell.nudge-list-row__col-four > div.product-offer-price > div.product-offer-price__shipping').textContent
          let competitivePrice = item.querySelector('kat-table-cell.nudge-list-row__col-five').textContent

          let objData = {}
          let { foIneligible1 } = HEADERS
          objData[foIneligible1.sku] = sku
          objData[foIneligible1.asin] = asin
          objData[foIneligible1.title] = title
          objData[foIneligible1.url] = url
          objData[foIneligible1.pricingStatus] = pricingStatus
          objData[foIneligible1.price] = price
          objData[foIneligible1.shipping] = shipping
          objData[foIneligible1.competitivePrice] = competitivePrice

          rows1.push(objData)
          counter1 = index;
        }
      })

      window.scrollTo(0, document.body.scrollHeight);

      let showMoreButtonStatus = document.querySelector('kat-tab[tab-id="FODNudgeList"] > div > div.nudge-list-footer__show-more > kat-button[label="Show more"]');
      if (showMoreButtonStatus.getAttribute('disabled') && showMoreButtonStatus.getAttribute('disabled') === 'true') {
        runWorker = false
      } else {
        showMoreButtonStatus.click();
        await delay(3000)
      }
    }

    const headers = Object.values(HEADERS.foIneligible1)
    resolve({
      sheetName: 'Ineligible-Tab1',
      headers,
      rows: rows1
    })
  })
}

function getFoIneligible2(){
  return new Promise(async (resolve, reject) => {
    //2nd tab
    document.querySelector('kat-tab.ph-tab-fod-body[tab-id="PGFODNudgeList"]').shadowRoot.querySelector('div[role="tab"]').click()
    await delay(5000)

    let runWorker = true
    let rows2 = []
    let counter2 = -1;

    while(runWorker){
      document.querySelectorAll('kat-tab[tab-id="PGFODNudgeList"] > div > kat-table > kat-table-body[role="rowgroup"] > kat-table-row[role="row"]:not(.pep-alert-row)').forEach((item, index) => {
        if (counter2 < index && item.querySelectorAll('kat-table-cell').length > 0) {
          let baseSelector = 'kat-table-cell.nudge-list-row__col-one > div > div.product-details__description-container';

          let title = item.querySelector(`${baseSelector} > kat-link`).getAttribute('label');
          let url = item.querySelector(`${baseSelector} > kat-link`).getAttribute('href');
          let asin = item.querySelector(`${baseSelector} > div > div:nth-child(1)`).textContent.replace(/\n|\r|\t|ASIN:/g, '').trim()
          let sku = item.querySelector(`${baseSelector} > div > div:nth-child(2)`).textContent.replace(/\n|\r|\t|SKU:/g, '').trim()
          
          let pricingStatus = item.querySelector('kat-table-cell.nudge-list-row__col-three').textContent
          let price = item.querySelector('kat-table-cell.nudge-list-row__col-four > div.product-offer-price').firstChild.textContent
          let shipping = item.querySelector('kat-table-cell.nudge-list-row__col-four > div.product-offer-price > div.product-offer-price__shipping').textContent
          
          let referencePrices = []
          let noReferencePriceElem = item.querySelectorAll('kat-table-cell.nudge-list-row__col-five div.product-reference-price:nth-child(1) > kat-label[text="No applicable Reference price"]')
          if (noReferencePriceElem.length === 0) {
            item.querySelectorAll('kat-table-cell.nudge-list-row__col-five div.product-reference-price').forEach(e => {
              let value = e.querySelector('kat-label').getAttribute('text');
              let text = e.querySelector('div.product-reference-price__source').textContent.replace(/\n|\r/g, '').trim();
              referencePrices.push({ text, value })
            })
          }

          let averageSellingPrice = referencePrices.length > 0 && referencePrices.some(e => e.text === 'Average Selling Price')
            ? referencePrices.find(e => e.text === 'Average Selling Price').value : '-';

          let featuredOffer = referencePrices.length > 0 && referencePrices.some(e => e.text === 'Featured Offer')
            ? referencePrices.find(e => e.text === 'Featured Offer').value : '-';

          let priceByAmazon = referencePrices.length > 0 && referencePrices.some(e => e.text === 'Price by Amazon')
            ? referencePrices.find(e => e.text === 'Price by Amazon').value : '-';

          let listPrice = referencePrices.length > 0 && referencePrices.some(e => e.text === 'List Price')
            ? referencePrices.find(e => e.text === 'List Price').value : '-';

          let objData = {}
          let { foIneligible2 } = HEADERS
          objData[foIneligible2.sku] = sku
          objData[foIneligible2.asin] = asin
          objData[foIneligible2.title] = title
          objData[foIneligible2.url] = url
          objData[foIneligible2.pricingStatus] = pricingStatus
          objData[foIneligible2.price] = price
          objData[foIneligible2.shipping] = shipping
          objData[foIneligible2.averageSellingPrice] = averageSellingPrice
          objData[foIneligible2.featuredOffer] = featuredOffer
          objData[foIneligible2.priceByAmazon] = priceByAmazon
          objData[foIneligible2.listPrice] = listPrice

          rows2.push(objData)
          counter2 = index;
        }
      })

      window.scrollTo(0, document.body.scrollHeight);
      //PGFODNudgeList
      let showMoreButtonStatus = document.querySelector('kat-tab[tab-id="PGFODNudgeList"] > div > div.nudge-list-footer__show-more > kat-button[label="Show more"]');
      if (showMoreButtonStatus.getAttribute('disabled') && showMoreButtonStatus.getAttribute('disabled') === 'true') {
        runWorker = false
      }else{
        showMoreButtonStatus.click();
        await delay(3000)
      }
    }
    const headers = Object.values(HEADERS.foIneligible2)
    resolve({
      sheetName: 'Ineligible-Tab2',
      headers,
      rows: rows2
    })
  })
}

function getFoEligible(){
  return new Promise(async (resolve, reject) => {
    //3rd tab
    document.querySelector('kat-tab.ph-tab-body[tab-id="FOENudgeList"]').shadowRoot.querySelector('div[role="tab"]').click()
    await delay(5000)

    let runWorker = true
    let rows3 = []
    let counter3 = -1;

    while(runWorker){
      document.querySelectorAll('kat-tab[tab-id="FOENudgeList"] > div > kat-table > kat-table-body[role="rowgroup"] > kat-table-row[role="row"]:not(.pep-alert-row)').forEach((item, index) => {
        if (counter3 < index && item.querySelectorAll('kat-table-cell').length > 0) {
          let baseSelector = 'kat-table-cell.nudge-list-row-fo__col-one > div > div.product-details__description-container';

          let title = item.querySelector(`${baseSelector} > kat-link`).getAttribute('label');
          let url = item.querySelector(`${baseSelector} > kat-link`).getAttribute('href');
          let asin = item.querySelector(`${baseSelector} > div > div:nth-child(1)`).textContent.replace(/\n|\r|\t|ASIN:/g, '').trim()
          let sku = item.querySelector(`${baseSelector} > div > div:nth-child(2)`).textContent.replace(/\n|\r|\t|SKU:/g, '').trim()
          
          let pricingStatus = item.querySelector('kat-table-cell.nudge-list-row__col-three').textContent
          let price = item.querySelector('kat-table-cell.nudge-list-row-fo__col-four > div.product-offer-price').textContent
          let shipping = item.querySelector('kat-table-cell.nudge-list-row-fo__col-four > div.product-offer-price > div.product-offer-price__shipping').textContent
          let featuredOfferPrice = item.querySelector('kat-table-cell.nudge-list-row-fo__col-five').textContent

          let objData = {}
          let { foEligible } = HEADERS
          objData[foEligible.sku] = sku
          objData[foEligible.asin] = asin
          objData[foEligible.title] = title
          objData[foEligible.url] = url
          objData[foEligible.pricingStatus] = pricingStatus
          objData[foEligible.price] = price
          objData[foEligible.shipping] = shipping
          objData[foEligible.featuredOfferPrice] = featuredOfferPrice

          rows3.push(objData)
          counter3 = index;
        }
      })
      window.scrollTo(0, document.body.scrollHeight);
      //FOENudgeList
      let showMoreButtonStatus = document.querySelector('kat-tab[tab-id="FOENudgeList"] > div > div.nudge-list-footer__show-more > kat-button[label="Show more"]');
      if (showMoreButtonStatus.getAttribute('disabled') && showMoreButtonStatus.getAttribute('disabled') === 'true') {
        runWorker = false
      }else{
        showMoreButtonStatus.click();
        await delay(3000)
      }
    }
    const headers = Object.values(HEADERS.foEligible)
    resolve({
      sheetName: 'Ilegible-Tab1',
      headers,
      rows: rows3
    })
  })
}

async function extractFeaturedOffers() {
  let items = []
  let result1 = await getFoIneligible1()
  items.push(result1)

  let result2 = await getFoIneligible2()
  items.push(result2)

  let result3 = await getFoEligible()
  items.push(result3)
  
  await createExcelFile(`Price_Alerts-Featured-Offer.xlsx`, items)
}