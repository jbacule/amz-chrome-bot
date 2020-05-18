function noImgDetector(){
	if($(location).attr("href").indexOf('/offer-listing') > -1){
		console.log('Amazon Offer-listing accessed!')
		let img = $('#olpProductImage > a > img').attr('src');
	    if(img.indexOf('no-img') > -1){
	       imgError();
	       $('title').text(`Image Not Found|${img}`);
	       console.log('image not found');
	    }else{
	      imgSuccess();
	      $('title').text(`Image Found|${img}`);
	      console.log('image found');
	    }
	}
}

function imgError(){
    var favicon_link_html = document.createElement('link');
    favicon_link_html.rel = 'icon';
    favicon_link_html.href = 'https://img.icons8.com/cute-clipart/64/000000/error.png';
    favicon_link_html.type = 'image/png';
    try {
        document.getElementsByTagName('head')[0].appendChild( favicon_link_html );
    }
    catch(e) { }
}

function imgSuccess(){
    var favicon_link_html = document.createElement('link');
    favicon_link_html.rel = 'icon';
    favicon_link_html.href = 'https://img.icons8.com/cute-clipart/64/000000/approval.png';
    favicon_link_html.type = 'image/png';
    try {
        document.getElementsByTagName('head')[0].appendChild( favicon_link_html );
    }
    catch(e) { }
}