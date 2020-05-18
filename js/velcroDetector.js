let findText = "Velcro";
let vText = new RegExp('(\\w*' + findText + '\\w*)','gi');
let elementArray = ["productTitle","feature-bullets","productDescription","olpProductDetails", "aplus3p_feature_div"];
let counter = 0;

function velcroDetector(){
	if($(location).attr("href").indexOf('/dp/B0') > -1){
		console.log("amazon page accessed!")
		for(var i=0; i<elementArray.length;i++){
	        if(document.body.contains(document.getElementById(elementArray[i]))){
	            executeVelcroFinder(elementArray[i]);
	        }
	    }

	    if(counter>0){
	        console.log("Found Velcro on Amazon.");
	        document.title = "Velcro Found!";
	        errorIcon();
	    }else{
            console.log("No Velcro found on Amazon!");
            document.title = "No Velcro Found!";
	        successIcon();
	    }
	}
}

function executeVelcroFinder(elementID){
    let elementText = this.document.getElementById(elementID).innerHTML.match(vText);
    if(elementText != null){
        document.getElementById(elementID).innerHTML = this.document.getElementById(elementID).innerHTML.replace(vText, '<span style="background-color: yellow; color: red; font-weight: bold;">Velcro</span>');
        counter++;
    }
}

function getDetail(elementID){
    if(elementID=="productTitle"){
        return "Title";
    }else if(elementID=="feature-bullets"){
        return "Bullets";
    }else if(elementID=="productDescription"){
        return "Description";
    }else if(elementID=="aplus3p_feature_div"){
        return "EBC";
     }else{
        return "Offer Listing Details"
    }
}

function errorIcon(){
    var favicon_link_html = document.createElement('link');
    favicon_link_html.rel = 'icon';
    favicon_link_html.href = 'https://png.icons8.com/color/64/000000/high-priority.png';
    favicon_link_html.type = 'image/png';
    try {
        document.getElementsByTagName('head')[0].appendChild( favicon_link_html );
    }
    catch(e) { }
}

function successIcon(){
    var favicon_link_html = document.createElement('link');
    favicon_link_html.rel = 'icon';
    favicon_link_html.href = 'https://png.icons8.com/color/64/000000/ok.png';
    favicon_link_html.type = 'image/png';
    try {
        document.getElementsByTagName('head')[0].appendChild( favicon_link_html );
    }
    catch(e) { }
}