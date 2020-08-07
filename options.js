$(function(){

    chrome.storage.local.get(['amazonResults','addProductResults', 'optionConfig', 'closeTabs', 'amazonReviews'], function(result){
        if(result.amazonResults === undefined){
            chrome.storage.local.set({ amazonResults: [] })
        }

        if(result.addProductResults === undefined){
            chrome.storage.local.set({ addProductResults: [] })
        }

        if(result.amazonReviews === undefined){
            chrome.storage.local.set({ amazonReviews: [] })
        }

        if(result.closeTabs === undefined){
            chrome.storage.local.set({ closeTabs: 'enabled' })
            $("input#chkCloseTabs").prop("checked", true);
        }else{
            result.closeTabs === 'enabled' ? $("input#chkCloseTabs").prop("checked", true) : $("input#chkCloseTabs").prop("checked", false);
        }

        if(result.optionConfig === undefined){
            chrome.storage.local.set({ optionConfig: { type: 'chkAmazon', closeTabs: 'enabled' } }, function(){
                $("input[name=radioType][value='chkAmazon']").prop("checked", true);
            })
        }else{
            $(`input[name=radioType][value='${result.optionConfig.type}']`).prop("checked", true);
            change_type()
        }

        handleChangeResults();
    })

    handleSearchTable();
    handleChangeType();

    handleChangeProductIDList(); //handle input data to textarea
    handleClearProductIDList();//handle clearing ASIN List
    handleOpenProductIDList(); //handle opening asins by tab
    handleCloseTabs();

    handleRefreshTable();
    handleResetTable();
    copyResults();
    
    handleOptionModal();
    handleExportTable();

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (var key in changes) {
            var storageChange = changes[key];
            console.log('Storage key "%s" in namespace "%s" changed. ' +
                      'Old value was "%s", new value is "%s".',
                      key,
                      namespace,
                      storageChange.oldValue,
                      storageChange.newValue);

            handleChangeResults();
        }
    });
});

function handleExportTable(){
    $("#exportTableToExcel").click(function(){
        $("#resultTable").table2excel({
            name:"Sheet1",
            filename:`ExportTable-${Date.now()}`,
            fileext:".xls"
        });
    })
}
function handleChangeResults(){
    let radioTypeValue = $("input[name='radioType']:checked").val();
    if(radioTypeValue === 'chkAmazon'){
        chrome.storage.local.get(['amazonResults'], function(result){
            let data = [].concat(...result.amazonResults.map(e => e))
            console.log(data);
            loadTable(radioTypeValue, data)
        })
        $('#categoryLimit').text(`Amazon Page Limit: 100`);
    }else if(radioTypeValue === 'chkAddProduct'){
        chrome.storage.local.get(['addProductResults'], function(result){
            let data = [].concat(...result.addProductResults.map(e => e))
            console.log(data);
            loadTable(radioTypeValue, data)
        })
        $('#categoryLimit').text(`Add Product Page Limit: 50`);
    }else if(radioTypeValue === 'chkAmazonReviews'){
        chrome.storage.local.get(['amazonReviews'], function(result){
            let data = [].concat(...result.amazonReviews.map(e => e))
            console.log(data);
            loadTable(radioTypeValue, data)
        })
        $('#categoryLimit').text(`Amazon Review Page Limit: 100`);
    }
}

function handleChangeType(){
    //update table header
    $('input:radio[name="radioType"]').change(function(){
        change_type();
    }); 
}
function change_type(){
    let type = $("input[name='radioType']:checked").val();
    $("#tableHeader").empty();
    if (type === 'chkAmazon') {
        $("#tableHeader").append(`
            <th>ASIN</th>
            <th>Brand</th>
            <th>Title</th>
            <th>Image</th>
            <th>Category</th>
            <th>Description</th>
            <th>Bullets</th>`
        );
        chrome.storage.local.get(['amazonResults'], function(result){
            let data = [].concat(...result.amazonResults.map(e => e))
            console.log(data);
            loadTable(type, data)
        })
        chrome.storage.local.set({ optionConfig: { type: 'chkAmazon'} })
    }else if (type === 'chkAddProduct') {
        $("#tableHeader").append(`
            <th>Search ID</th>
            <th>ASIN</th>
            <th>Title</th>
            <th>UPC</th>
            <th>EAN</th>
            <th>Sales Rank</th>
            <th>Offers</th>
            <th>Status</th>`
        );

        chrome.storage.local.get(['addProductResults'], function(result){
            let data = [].concat(...result.addProductResults.map(e => e))
            console.log(data);
            loadTable(type, data)
        })
        chrome.storage.local.set({ optionConfig: { type: 'chkAddProduct'} })
    }else if (type === 'chkAmazonReviews') {
        $("#tableHeader").append(`
            <th>ASIN</th>
            <th>Brand</th>
            <th>Title</th>
            <th>Star Rating</th>
            <th>Five Star Percent</th>
            <th>Customer Rating</th>
            <th>Review 1</th>
            <th>Review 2</th>
            <th>Review 3</th>
            <th>Review 4</th>
            <th>Review 5</th>
            <th>Review 6</th>
            <th>Review 7</th>
            <th>Review 8</th>
            <th>Review 9</th>
            <th>Review 10</th>`
        );

        chrome.storage.local.get(['amazonReviews'], function(result){
            let data = [].concat(...result.amazonReviews.map(e => e))
            console.log(data);
            loadTable(type, data)
        })
        chrome.storage.local.set({ optionConfig: { type: 'chkAmazonReviews'} })
    }
}

function handleChangeProductIDList(){
    $('#asinList').keyup(function(){
        let asins = $('#asinList').val().split('\n');
        let filteredASINs = asins.filter(asin => asin !== "");
        $('#asinInput').text(filteredASINs.length);

        let type = $("input[name='radioType']:checked").val();
        if(type === 'chkAmazon' && filteredASINs.length > 100){
            showNotification('Warning!', `You've exceed ${filteredASINs.length-100} for limit number of Amazon Detail Page.\nExceed Product IDs will not be opened.`)
        }else if(type === 'chkAddProduct' || type === 'chkAmazonReviews' && filteredASINs.length > 50){
            showNotification('Warning!', `You've exceed ${filteredASINs.length-50} for limit number of Add Product Page.\nExceed Product IDs will not be opened.`)
        }
    })
}

function handleClearProductIDList(){
    $('#btnClearASINList').click(function(){
        $('#asinList').val('');
        $('#asinInput').text(0)
    })
}

function handleOpenProductIDList(){
    $('#btnOpenASINList').click(function(){
        let radioTypeValue = $("input[name='radioType']:checked").val();
        let limit = radioTypeValue === 'chkAmazon' ? 100 : 50;
        let asins = $('#asinList').val().split('\n');
        let filteredASINs = asins.filter(asin => asin !== "");
        let maxASIN = filteredASINs.length > limit ? limit : filteredASINs.length;

        for(let x=0; x<maxASIN; x++){
            let asin = filteredASINs[x];
            if(radioTypeValue === 'chkAmazon'){
                chrome.tabs.create({url: `https://www.amazon.com/dp/${asin}?ref=myi_title_dp&th=1&psc=1`, active: false })
            }else if(radioTypeValue === 'chkAddProduct'){
                chrome.tabs.create({url: `https://sellercentral.amazon.com/product-search?q=${asin}&ref_=xx_prodsrch_cont_prodsrch&`, active: false })
            }else if(radioTypeValue === 'chkAmazonReviews'){
                chrome.tabs.create({url: `https://www.amazon.com/product-reviews/${asin}/ref=acr_dpx_hist_5?ie=UTF8&filterByStar=five_star&reviewerType=all_reviews#reviews-filter-bar`, active: false })
            }
        }
        $('#asinList').val('');
        $('#asinInput').text(0)
    })
}

function handleCloseTabs(){
    $('#btnCloseTabs').click(function(){
        closeTabs()
    })
}

function closeTabs(){
    chrome.tabs.query({currentWindow: true}, callback);
    function callback(tabs){
        let type = $("input[name='radioType']:checked").val();
        if(type === 'chkAmazon'){
            for(let x in tabs){
                let tab = tabs[x];
                if(tab.url.indexOf('www.amazon.com') > -1){
                    chrome.tabs.remove(tab.id);
                }
            }
        }else if(type === 'chkAddProduct'){
            for(let x in tabs){
                let tab = tabs[x];
                if(tab.url.indexOf('sellercentral.amazon.com/product') > -1){
                    chrome.tabs.remove(tab.id);
                }
            }
        }else if(type === 'chkAmazonReviews'){
            for(let x in tabs){
                let tab = tabs[x];
                if(tab.url.indexOf('www.amazon.com/product-reviews') > -1){
                    chrome.tabs.remove(tab.id);
                }
            }
        }
    }
}

function handleRefreshTable(){
    $('#btnLoadTable').click(function(){
        $("#btnLoadTable").attr("disabled", true);
        $("#btnLoadTable").html("Loading...");

        chrome.tabs.query({currentWindow: true}, callback);
        function callback(tabs){
            let type = $("input[name='radioType']:checked").val();
            if(type === 'chkAmazon'){
                let currentData = [];
                let updatedData = [];
                let closeTab;
                chrome.storage.local.get(['amazonResults','closeTabs'], function(result){
                    currentData = result.amazonResults;
                    closeTab = result.closeTabs
                });

                for(let x in tabs){
                    let tab = tabs[x];
                    
                    let status = tab.status;
                    let url = tab.url.indexOf('dp/B0')
                    if(status === 'complete' && url > -1){
                        chrome.tabs.sendMessage(tab.id, { greeting: "hello" }, function(response) {
                            let newData = response.farewell;
                            updatedData.push(newData);
                        });
                    }
                }
                setTimeout(function(){
                    currentData.push(updatedData);
                    chrome.storage.local.set({ amazonResults: currentData });

                    //REMOVE TAB AFTER LOADED TO TABLE
                    if(closeTab === 'enabled'){
                        closeTabs()
                    }

                    $("#btnLoadTable").attr("disabled", false);
                    $("#btnLoadTable").html("Load");
                },3000)

            }else if(type === 'chkAddProduct'){
                let currentData = [];
                let updatedData = [];
                let closeTab;
                chrome.storage.local.get(['addProductResults','closeTabs'], function(result){
                    currentData = result.addProductResults;
                    closeTab = result.closeTabs
                });

                for(let x in tabs){
                    let tab = tabs[x];
                    
                    let status = tab.status;
                    let url = tab.url.indexOf('search?q=')
                    if(status === 'complete' && url > -1){
                        chrome.tabs.sendMessage(tab.id, { greeting: "addProduct" }, function(response) {
                            let newData = response.farewell;
                            for(let y in newData){
                                updatedData.push(newData[y])
                            }
                        }); 
                    }
                }
                setTimeout(function(){
                    currentData.push(updatedData);
                    chrome.storage.local.set({ addProductResults: currentData });

                    //REMOVE TAB AFTER LOADED TO TABLE
                    if(closeTab === 'enabled'){
                        closeTabs()
                    }

                    $("#btnLoadTable").attr("disabled", false);
                    $("#btnLoadTable").html("Load");
                },3000)
            }else if(type === 'chkAmazonReviews'){
                let currentData = [];
                let updatedData = [];
                let closeTab;
                chrome.storage.local.get(['amazonReviews','closeTabs'], function(result){
                    currentData = result.amazonReviews;
                    closeTab = result.closeTabs
                });

                for(let x in tabs){
                    let tab = tabs[x];
                    
                    let status = tab.status;
                    let url = tab.url.indexOf('www.amazon.com/product-reviews')
                    if(status === 'complete' && url > -1){
                        chrome.tabs.sendMessage(tab.id, { greeting: "amzReviews" }, function(response) {
                            console.log(response)
                            let newData = response.farewell;
                            updatedData.push(newData);
                        });
                    }
                }
                setTimeout(function(){
                    currentData.push(updatedData);
                    chrome.storage.local.set({ amazonReviews: currentData });

                    //REMOVE TAB AFTER LOADED TO TABLE
                    if(closeTab === 'enabled'){
                        closeTabs()
                    }

                    $("#btnLoadTable").attr("disabled", false);
                    $("#btnLoadTable").html("Load");
                },3000)
            }
        }
    })
}

//CLEAR TABLE
function handleResetTable(){
    $('#btnResetTable').click(function(){
        let type = $("input[name='radioType']:checked").val();
        if(type === 'chkAmazon'){
            chrome.storage.local.set({amazonResults: []}, function(){
                $("#tableBody > tr").remove()
            });
        }else if(type === 'chkAddProduct'){
            chrome.storage.local.set({addProductResults: []}, function(){
                $("#tableBody > tr").remove()
            });
        }else if(type === 'chkAmazonReviews'){
            chrome.storage.local.set({amazonReviews: []}, function(){
                $("#tableBody > tr").remove()
            });
        }
    })
}


//LOAD TABLE
function loadTable(type, rows){
    $("#tableBody").empty();
    if(type === 'chkAmazon'){
        for (let index = 0; index < rows.length; index++) {
            const row = JSON.parse(rows[index]);
            $("#tableBody").append(
                "<tr>" +
                "<td>" + row.asin + "</td>" +
                "<td>" + row.brand + "</td>" +
                "<td>" + row.childTitle + "</td>" +
                "<td>" + row.mainImage + "</td>" +
                "<td>" + row.category + "</td>" +
                "<td>" + row.description + "</td>" +
                "<td>" + row.bullets + "</td>" +
                "</tr>"
            );
        }
    }else if(type === 'chkAddProduct'){
        for (let index = 0; index < rows.length; index++) {
            const row = JSON.parse(rows[index]);
            $("#tableBody").append(
                "<tr>" +
                    "<td>" + row.productId + "</td>" +
                    "<td>" + row.asin + "</td>" +
                    "<td>" + row.title + "</td>" +
                    "<td>" + row.UPC + "</td>" +
                    "<td>" + row.EAN + "</td>" +
                    "<td>" + row.salesRank + "</td>" +
                    "<td>" + row.offers + "</td>" +
                    "<td>" + row.status + "</td>" +
                "</tr>"
            );
        }
    }else if(type === 'chkAmazonReviews'){
        for (let index = 0; index < rows.length; index++) {
            const row = JSON.parse(rows[index]);
            $("#tableBody").append(
                "<tr>" +
                    "<td>" + row.asin + "</td>" +
                    "<td>" + row.brand + "</td>" +
                    "<td>" + row.title + "</td>" +
                    "<td>" + row.starRating + "</td>" +
                    "<td>" + row.fiveStarRating + "</td>" +
                    "<td>" + row.customerRating + "</td>" +
                    "<td>" + row.reviews.split("|")[0] + "</td>" +
                    "<td>" + row.reviews.split("|")[1] + "</td>" +
                    "<td>" + row.reviews.split("|")[2] + "</td>" +
                    "<td>" + row.reviews.split("|")[3] + "</td>" +
                    "<td>" + row.reviews.split("|")[4] + "</td>" +
                    "<td>" + row.reviews.split("|")[5] + "</td>" +
                    "<td>" + row.reviews.split("|")[6] + "</td>" +
                    "<td>" + row.reviews.split("|")[7] + "</td>" +
                    "<td>" + row.reviews.split("|")[8] + "</td>" +
                    "<td>" + row.reviews.split("|")[9] + "</td>" +
                "</tr>"
            );
        }
    }
    $('#totalResult').html(`(${rows.length} Rows)`)
}

//COPY RESULTS TO CLIPBOARD
function copyResults(){
    $('#btnCopyTable').click(function(){
        let type = $("input[name='radioType']:checked").val();
        if(type === 'chkAmazon'){
            chrome.storage.local.get('amazonResults', function(result){
                let data = [].concat(...result.amazonResults.map(e => e));
                let mergeData = '';
                let header = 'ASIN\tBrand\tTitle\tImage\tCategory\tDescription\tBullets\n'; 
                mergeData = mergeData + header;
    
                for(let x in data){
                    let e = JSON.parse(data[x]);
                    mergeData = mergeData + `${e.asin}\t${e.brand}\t${e.childTitle}\t${e.mainImage}\t${e.category}\t${e.description}\t${e.bullets}\n`
                }
                copyToClipboard(mergeData)
            });
        }else if(type === 'chkAddProduct'){
            chrome.storage.local.get('addProductResults', function(result){
                let data = [].concat(...result.addProductResults.map(e => e));
                let mergeData = '';
                let header = 'SearchID\tASIN\tTitle\tUPC\tEAN\tSales Rank\tOffer\tStatus\n'; 
                mergeData = mergeData + header;
    
                for(let x in data){
                    let e = JSON.parse(data[x]);
                    mergeData = mergeData + `'${e.productId}\t${e.asin}\t${e.title}\t'${e.UPC}\t'${e.EAN}\t${e.salesRank}\t${e.offers}\t${e.status}\n`;
                }
                copyToClipboard(mergeData)
            });
        }else if(type === 'chkAmazonReviews'){
            chrome.storage.local.get('amazonReviews', function(result){
                let data = [].concat(...result.amazonReviews.map(e => e));
                let mergeData = '';
                let header = 'ASIN\tBrand\tTitle\tStar Rating\t5 Star Percent\tCustomer Rating\tReview1\tReview2\tReview3\tReview4\tReview5\tReview6\tReview7\tReview8\tReview9\tReview10\n'; 
                mergeData = mergeData + header;
    
                for(let x in data){
                    let e = JSON.parse(data[x]);
                    mergeData = mergeData + `${e.asin}\t${e.brand}\t${e.title}\t${e.starRating}\t${e.fiveStarRating}\t${e.customerRating}\t${e.reviews.split("|")[0]}\t${e.reviews.split("|")[1]}\t${e.reviews.split("|")[2]}\t${e.reviews.split("|")[3]}\t${e.reviews.split("|")[4]}\t${e.reviews.split("|")[5]}\t${e.reviews.split("|")[6]}\t${e.reviews.split("|")[7]}\t${e.reviews.split("|")[8]}\t${e.reviews.split("|")[9]}\n`;
                }
                copyToClipboard(mergeData)
            });
        }
        showNotification('Awesome!', 'Successfully copied to clipboard!\nYou can paste it now to Excel File.')
    })
}

function copyToClipboard(text){
	const els = document.createElement('textarea');
	els.value = text;
	document.body.appendChild(els);
	els.select();
	document.execCommand('copy');
	document.body.removeChild(els)
}

function handleSearchTable(){
    $('#search').keyup(function(){
        search_table($(this).val());
    })

    function search_table(value){
        $('#tableBody tr').each(function(){
            let found = false;
            $(this).each(function(){
                if($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    found = true
                }
            })

            if(found){
                $(this).show();
            }else{
                $(this).hide();
            }
        })
    }
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

function handleOptionModal(){
    $('#btnOption').click(function(){
        document.getElementById('optionModal').style.display='block'
    })

    $('#btnCloseOption').click(function(){
        document.getElementById('optionModal').style.display='none'
    })

    $('input:checkbox').change(function(){

        chrome.storage.local.get('closeTabs', function(result){
            let res = result.closeTabs;
            if(res === 'enabled'){
                chrome.storage.local.set({ closeTabs: 'disabled' })
            }else{
                chrome.storage.local.set({ closeTabs: 'enabled' })
            }
        })
    });

}
