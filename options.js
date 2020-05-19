$(function(){
    chrome.storage.local.get(['amazonResults'], function(result){
        if(result.amazonResults === undefined){
            chrome.storage.local.set({ amazonResults: [] })
        }

        chrome.storage.local.get(['amazonResults'], function(result){
            let data = [].concat(...result.amazonResults.map(e => e))
            console.log(data);
            loadTable(data)
        })
    })

    handleChangeASINList(); //handle input data to textarea
    handleClearASINList();//handle clearing ASIN List
    handleOpenASINList(); //handle opening asins by tab
    handleCloseTabs();

    handleRefreshTable();
    handleResetTable();
    copyResults();

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (var key in changes) {
            var storageChange = changes[key];
            console.log('Storage key "%s" in namespace "%s" changed. ' +
                      'Old value was "%s", new value is "%s".',
                      key,
                      namespace,
                      storageChange.oldValue,
                      storageChange.newValue);
            chrome.storage.local.get(['amazonResults'], function(result){
                let data = [].concat(...result.amazonResults.map(e => e))
                loadTable(data)
            })
        }
    });
});

function handleChangeASINList(){
    $('#asinList').keyup(function(){
        let asins = $('#asinList').val().split('\n');
        let filteredASINs = asins.filter(asin => asin !== "");
        $('#asinInput').text(filteredASINs.length)
    })
}

function handleClearASINList(){
    $('#btnClearASINList').click(function(){
        $('#asinList').val('');
        $('#asinInput').text(0)
    })
}

function handleOpenASINList(){
    $('#btnOpenASINList').click(function(){
        let asins = $('#asinList').val().split('\n');
        let filteredASINs = asins.filter(asin => asin !== "");
        let maxASIN = filteredASINs.length > 100 ? 100 : filteredASINs.length;

        for(let x=0; x<maxASIN; x++){
            let asin = filteredASINs[x];
            chrome.tabs.create({url: `https://www.amazon.com/dp/${asin}?ref=myi_title_dp&th=1&psc=1`, active: false })
        }
        $('#asinList').val('');
        $('#asinInput').text(0)
    })
}

function handleCloseTabs(){
    $('#btnCloseTabs').click(function(){
        chrome.tabs.query({currentWindow: true}, callback);
        function callback(tabs){
            for(let x in tabs){
                let tab = tabs[x];

                let status = tab.status;
                let url = tab.url.indexOf('dp/B0')
                if(status === 'complete' && url > -1){
                    chrome.tabs.remove(tab.id);
                }
            }
        }
    })
}

function handleRefreshTable(){
    $('#btnLoadTable').click(function(){
        $("#btnLoadTable").attr("disabled", true);
        $("#btnLoadTable").html("Loading...");

        chrome.tabs.query({currentWindow: true}, callback);
        function callback(tabs){
            let currentData = [];
            let updatedData = [];
            chrome.storage.local.get(['amazonResults'], function(result){
                currentData = result.amazonResults;
            });

            for(let x in tabs){
                let tab = tabs[x];
                
                let status = tab.status;
                let url = tab.url.indexOf('dp/B0')
                if(status === 'complete' && url > -1){
                    chrome.tabs.sendMessage(tab.id, { greeting: "hello" }, function(response) {
                        let newData = response.farewell;
                        updatedData.push(newData)
                    });
                }
            }
            setTimeout(function(){
                currentData.push(updatedData);
                chrome.storage.local.set({ amazonResults: currentData });

                $("#btnLoadTable").attr("disabled", false);
                $("#btnLoadTable").html("Load");
            },3000)
        }
    })
}

function handleResetTable(){
    $('#btnResetTable').click(function(){
        chrome.storage.local.set({amazonResults: []}, function(){
            $("#tableBody > tr").remove()
        });
    })
}

function loadTable(rows){
    if(rows.length==0){
        $("#tableBody").append(
            "<tr class='w3-center'>No Data Found!</tr>"
        );
    }else{
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
    }
}

function copyResults(){
    $('#btnCopyTable').click(function(){
        chrome.storage.local.get('amazonResults', function(result){
            let data = [].concat(...result.amazonResults.map(e => e));
            let mergeData = '';
            let header = 'ASIN\tBrand\tTitle\tImage\tCategory\tDescription\tBullets\n'; 
            mergeData = mergeData + header;

            for(let x in data){
                let e = JSON.parse(data[x]);
                mergeData = mergeData + `${e.asin}\t${e.brand}\t${e.childTitle}\t${e.mainImage}\t${e.category}\t${e.description}\t${e.bullets}\n`
            }
            console.log(mergeData);
            copyToClipboard(mergeData)
        });
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