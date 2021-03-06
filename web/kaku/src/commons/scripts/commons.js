var vue = require('vue');

window.loadEnd = function(cb) {

	var loadInterval = setInterval(function() {

		if(typeof window.router != 'undefined') {
			clearInterval(loadInterval);
			cb;
		}

	}, 1);

};

module.exports = {

	registerComponent: function(obj) {
		var myComponent = vue.extend({
			template: obj.template
		});

		vue.component(obj.name, myComponent);
	},

	getElementsByClassName: function(className) {
		var all = document.all ? document.all : document.getElementsByTagName( ' *' );
    	var elements = new Array();
    	for ( var e = 0; e < all.length; e ++ ) {
      		if (all[e].className == className) {
        		elements[elements.length] = all[e];
        		break ;
      		}
    	}
    	return elements;
    },

    cancelActiveMenu: function() {
		var poiHeader = document.getElementById('poi-header');
		var ul = poiHeader.childNodes;

		if(ul.item(1) != null){
			var lis = ul.item(1).getElementsByTagName('li');
		}else {
			var lis = ul.item(0).getElementsByTagName('li');
		}

		for (var i = 0; i < lis.length; i++) {
			var li = lis[i];
			var route = li.getAttribute('route');
			var span = li.childNodes.item(0);

			span.setAttribute('class', '');
		};
    },

    tologin: function() {
    	router.go('/login');
    	localStorage.logPrev = router.path;
    },

    toRegister: function() {
    	router.go('/register');
    	localStorage.logPrev = router.path; 
    },

	setCookie: function(c_name, value, expiredays) {  
		var exdate=new Date();
		exdate.setDate(exdate.getDate()+expiredays);
		document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString())+";path=/;domain=poimoe.com";
	},

	getCookie: function(c_name) {  
		if (document.cookie.length > 0){  
			c_start = document.cookie.indexOf(c_name + "=");
			if (c_start != -1){
				c_start = c_start + c_name.length+1;  
				c_end = document.cookie.indexOf(";",c_start);  
				if (c_end == -1){
					c_end = document.cookie.length;  
					return unescape(document.cookie.substring(c_start,c_end));  					
				}
			}   
		}  
		return "";  
	},

    resetNavSearchSize: function() {
        var indexSearchNav = document.getElementById('index-nav-search');

        if(indexSearchNav != null) {
            var indexSearchInput = document.getElementById('index-search-input');

            var isiWidth = indexSearchInput.clientWidth + 1;
            indexSearchNav.setAttribute('style', 'width: ' + isiWidth + 'px');
        }
    },

	emailCheck: function(val) {
		var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
		if (!pattern.test(val)) {
			return false;
		}
		return true;
	},

	messageBox: function(message, danger, right) {

		var _this = this;

		var boxId = danger ? 'alert-danger' : 'alert-success';
		var tipsId = danger ? 'danger-tips' : 'success-tips';

		var alertSuccess = document.getElementById(boxId);
		var cls = alertSuccess.getAttribute('class');
		var cls = cls.split(' ');
		var i = cls.indexOf('displaynone');
		cls.splice(i, 1);
		cls.push('fade-enter');
		var cls = cls.join(' ');
		alertSuccess.setAttribute('class', cls);
		var tips = document.getElementById(tipsId);
		tips.innerHTML = message;

		setTimeout(function() {
			_this.hideMessageBox(boxId);
		}, 3000);

		var loginFailedList = [
			'access_token非法或用户登录已失效，请重新登录',
			'access_token已过期，请重新登录',
			'access_token非法，请重新登录',
			'用户未登录或无权限，请重新登录'
		];

		if(loginFailedList.indexOf(message) != -1) {
			setTimeout(function() {
				window.location.href = 'http://poi.poimoe.com/#!/login';
			},1000);
		}

	},

	hideMessageBox: function(id) {
		var alertSuccess = document.getElementById(id);
		var cls = alertSuccess.getAttribute('class');
		var cls = cls.split(' ');
		var i = cls.indexOf('fade-enter');
		cls.splice(i, 1);
		cls.push('fade-leave');
		alertSuccess.setAttribute('class', cls.join(' '));
	},

	confirm: function(content) {
		return confirm(content);
	},

	handleError: function(err, type) {
		var _this = this;

		console.log(err);

		type = type || 'common';

		var result = '';

		var msgType = {
			common: function() {
				console.log(err);
				if(typeof err === 'object') {
					var requestUrl = err.request.url || '';
					var dataCode = typeof err.data == 'undefined' ? '' : err.data.code;
					var dataMessage = typeof err.data == 'undefined' ? '' : err.data.message;
					result += '<p>Status: ' + err.status + '</p>';
					result += '<p>Status Text: ' + err.statusText + '</p>';
					result += '<p>Data Code: ' + dataCode + '</p>';
					result += '<p>Data Message: ' + dataMessage + '</p>';
					result += '<p>Request URL: ' + requestUrl + '</p>';
				}else {
					result = err;
				}
				_this.messageBox(result, true);
			},

			socket: function() {
				if(typeof err == 'string') {
					_this.messageBox(err);
				} else {
					var requestUrl = err.request.url || '';
					result += '<p>Code: ' + err.code + '</p>';
					result += '<p>Detail: ' + err.message + '</p>';
					result += '<p>Error: ' + err.error + '</p>';
					_this.messageBox(result, true);					
				}
			}
		};

		msgType[type]();
	},

	session: function(key, val) {

		if(key == null) {
			return false;
		}

		localStorage[key] = val;
		return localStorage[key];

	},

	pathToSearch: function(name) {
		this.cancelActiveMenu();
        var route = {
            name: 'search-key',
            params: {
                keywords: name
            }
        };
        router.replace(route);
	},

	toPageTop: function() {
		document.documentElement.scrollTop = 0;
	},
	
	//图片上传预览,IE使用了滤镜
    previewImage: function(fileid, outer, inner, class_, style_) {
    	var _this = this;

    	var file = document.getElementById(fileid);
      	var MAXWIDTH  = 260; 
      	var MAXHEIGHT = 180;
      	var div = document.getElementById(outer);
      	if(file.files && file.files[0]) {
          	div.innerHTML ='<img style="' + style_ + '" id="' + inner + '" class="' + class_ + '">';
          	var img = document.getElementById(inner);
          	img.onload = function(){
	            var rect = _this.clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
	            img.width  =  rect.width;
	            img.height =  rect.height;
	            // img.style.marginTop = rect.top + 'px';
          	}
      		var reader = new FileReader();
      		reader.onload = function(evt){img.src = evt.target.result;}
      		reader.readAsDataURL(file.files[0]);
      		return img;
      }else {
        var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        file.select();
        var src = document.selection.createRange().text;
      	div.innerHTML ='<img style="' + style_ + '" id="' + inner + '" class="' + class_ + '">';
	    var img = document.getElementById(inner);
        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
        var rect = _this.clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);
        div.innerHTML = "<div id='divhead' style='width:"+rect.width+"px;height:"+rect.height+"px;margin-top:"+rect.top+"px;"+sFilter+src+"\"'></div>";
        return div.innerHTML;
      }
    },

	clacImgZoomParam: function(maxWidth, maxHeight, width, height){
	    var param = {top:0, left:0, width:width, height:height};
	    if( width>maxWidth || height>maxHeight )
	    {
	        rateWidth = width / maxWidth;
	        rateHeight = height / maxHeight;
	         
	        if( rateWidth > rateHeight )
	        {
	            param.width =  maxWidth;
	            param.height = Math.round(height / rateWidth);
	        }else
	        {
	            param.width = Math.round(width / rateHeight);
	            param.height = maxHeight;
	        }
	    }
	     
	    param.left = Math.round((maxWidth - param.width) / 2);
	    param.top = Math.round((maxHeight - param.height) / 2);
	    return param;
	},

	syncUploadPic: function(submitBtnId, ifrId, cb) {
		document.getElementById(submitBtnId).click();

		var _this = this;

        var getJSON = function() {
        	var picJSON = JSON.parse(localStorage.pictureUploadedJSON);

        	if(picJSON.status != 200) {
        		_this.messageBox('上传失败，请重试');
        		return false;
        	}

        	cb(picJSON);
        };

        var oFrm = document.getElementById(ifrId);

		oFrm.onload = oFrm.onreadystatechange = function() {
		     if (this.readyState && this.readyState != 'complete') {
		     	return false;
		     }
		     else {
		         getJSON();
		     }
		}
	},

	turnoffEventSource: function(backend) {
		backend = backend || false;

		var _this = this;

		services.TimelineService.turnOffES().then(function(res) {

			var code = res.data.code;
			var data = res.data.message;

			if(code != 200) {
				if(!backend) {
					_this.messageBox(data);					
				}
				return false;
			}

			if(!backend) {
				_this.messageBox(data);
			}

		}, function(err) {
			_this.handleError(err);
		});
	},

	randomString: function(len) {
	　　len = len || 32;
	　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	　　var maxPos = $chars.length;
	　　var pwd = '';
	　　for (i = 0; i < len; i++) {
	　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	　　}
	　　return pwd;
	},

	cloneObject: function(original, ignoreList) {

		ignoreList = ignoreList || false;

		var tmp = {};

		for(var key in original) {
			if(ignoreList) {
				if(ignoreList.indexOf(key) === -1) {
					tmp[key] = original[key];
				}
			}else {
				tmp[key] = original[key];
			}
		}

		return tmp;

	},

	formatDate: function(strTime) {
	    var date = new Date(strTime);
	    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	},

	turnToRealBoolean: function(obj, result, key) {

		// 字符串
		if(typeof obj == 'string') {
			obj = obj == 'false' ? false : ( obj == 'true' ? true : obj );
			if(key) {
				result[key] = obj;
			}
		}

		// 数组
		if(typeof obj.length == 'number' && typeof obj == 'object') {
			for (var i = 0; i < obj.length; i++) {
				var currentElement = obj[i];
				this.turnToRealBoolean(currentElement);
			};
		}

		// 对象
		if(typeof obj == 'object') {
			for(var key in obj) {
				var c = obj[key];
				this.turnToRealBoolean(c, result, key);
			}
		}

	},

	getLayerDataURL: function(canvas) {
		var cxt = canvas.getContext('2d');
		var oldData = cxt.getImageData(0, 0, canvas.width, canvas.height);
		var newCanvas = document.createElement("canvas");
		newCanvas.width = canvas.width;
		newCanvas.height = canvas.height;
		newCanvas.id = "tmpLayer";
		document.body.appendChild(newCanvas);
		var newCxt = newCanvas.getContext("2d");
		newCxt.putImageData(oldData, 0 ,0);
		var data = newCanvas.toDataURL();
		newCanvas.parentNode.removeChild(newCanvas);
		return data;
	}
	
};