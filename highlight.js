// email:alex@newmediaguru.com
// window.onerror = null;

var searchHighLight={
	searchString:'',
	
	init:function(){
		if(searchHighLight.checkHighLight()==true){
			this.attachObjEvent(window,'load',searchHighLight.highLight,false);
		}
	},
	trim:function(str){
		return str.replace(/^\s*((?:[\S\s]*\S)?)\s*$/, '$1')
	},
	attachObjEvent:function(target,event,func,p){
		if(target.addEventListener){
			target.addEventListener(event,func,p);return true;
		}else if(target.attachEvent){
			target.attachEvent('on'+event,func,p);return true;
		}
		return false;
	},
	
	getQueryVariable:function(variable){
		var query=window.location.search.substring(1);
		var vars=query.split("&");
		for(var i=0;i<vars.length;i++){
			var pair=vars[i].split('=');
			if(pair[0]==variable){
				return pair[1];
			}
		}
		return false;
	},
	getRewriteVariable:function(variable){
		var vars=window.location.pathname.split('/').reverse();
		for(var i=0;i<vars.length;i++){
			var pair=vars[i].split('-');
			if(pair[0]==variable){
				pair.shift();
				return pair.join("-");
			}
		}
		return false;
	},
	checkHighLight:function(){

		var q=searchHighLight.getRewriteVariable('q');
		if(!q){
			q=searchHighLight.getQueryVariable('q');
		}
		if(q){
			searchHighLight.searchString=decodeURIComponent(q);
			return true;
		}
		return false;
	},

	highLight:function(){
		searchArray=searchHighLight.searchString.split(" ");
		if(!document.body||typeof(document.body.innerHTML)=="undefined"){
			return false;
		}
		for(var i=0;i<searchArray.length;i++){
			searchArray[i]=searchHighLight.trim(searchArray[i]).toLowerCase();
			if(searchArray[i].length>2){
				searchHighLight.doSearch(document.body,searchArray[i]);
			}
		}
		return true;
	},

	doSearch:function(el,searchTerm){
		if(el.nodeType == 3){
			var parent = el.parentNode.nodeName;
			var skips = 'HTML,HEAD,STYLE,TITLE,LINK,META,SCRIPT,OBJECT,IFRAME,OPTION';
			if(parent.indexOf(skips)<0){
			//if(parent != 'OPTION' || parent != 'SCRIPT' || parent!='STYLE'){
				var value = el.nodeValue.toLowerCase();
				if(value.indexOf(searchTerm)>=0){
					return searchHighLight.doReplace(el,searchTerm);
				}
			}
		}

		var children = el.childNodes;
		for (var i = children.length - 1 ; i >= 0 ; i--)
		{
			searchHighLight.doSearch(children[i],searchTerm);
		}
	},

	doReplace:function(el,searchTerm){
		var div			= document.createElement("div");
		re =new RegExp('('+searchTerm+')', 'gi')
		div.innerHTML	= el.nodeValue.replace(re, "<font style='color:blue; background-color:yellow;'>$1</font>");
		//div.innerHTML	= el.nodeValue.replace(/\b(\w+)\b/g, "<font style='color:blue; background-color:yellow;'>$1</font>");
		var parent		= el.parentNode;
		var children	 = div.childNodes;
		for (var i = children.length - 1 ; i >= 0 ; i--)
		{
			parent.insertBefore(children[i], el.nextSibling);
		}
		parent.removeChild(el);
	}
}

searchHighLight.init();