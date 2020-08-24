app.factory('tasAlert', function() {
        var obj = {};
        /*text = 'Sample text'
 	  status = success, error, info or warning
          time = 1000 (in millseconds)*/
        obj.show = function(text, status, time){
                var dom_text = document.querySelector('#alert_section #alert_box .alert_text');
                dom_text.innerHTML = text;
                var dom_box = document.querySelector('#alert_section #alert_box');
                dom_box.setAttribute('class', status);
                var dom = document.querySelector('#alert_section');
                dom.style.display =  'block';
                if(time != '' && time != undefined && !isNaN(Number(time))){
                        time = Number(time);
                        setTimeout(function(){dom.style.display = 'none'}, time);
                }
        }

	obj.hide = function(){
		var dom = document.querySelector('#alert_section');
        	dom.style.display =  'none';
	}

        obj.unicodeToHTMLEntities = function (text) {
             text   = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g,'&apos').replace(/[\u00A0-\u9999<>\&]/gim,function(i) { return '&#'+i.charCodeAt(0)+';'; });
             return text;
	}

        obj.ord = function (text){
             return text.charCodeAt(0);
        }

        obj.convertNonAsciiToHTMLEntities = function (text){
             text = String(text).replace('&amp;', '&')
             var new_txt = "";
             var find_entities = {};
             for (var ech_idx in text){
                  var x = text[ech_idx];
                  if (obj.ord(x) == obj.ord('&')){
                       new_txt += '&amp;';
                  }else if (obj.ord(x) < 128){
                       new_txt += x;
                  }else{
                       var flg = 0;
                       try{
                           elm = obj.unicodeToHTMLEntities(x);
                       }catch(err){
                           flg = 1
                           elm = '&#'+str(obj.ord(x))+';'
                       }
                       if (flg){
                            find_entities[elm] = 0
                       }
                       new_txt += elm //self.unicodeToHTMLEntities(x)
                  }
              }
              new_txt = new_txt.replace('&amp;#', '&#');
              new_txt = new_txt.replace('&amp;quot;', '&quot;');
              new_txt = new_txt.replace('&#160;', ' ');
              new_txt = (new_txt.trim().split()).join(' ');
              var cp1252_to_unicode_dict = {'&#92;':'&#2019;', '&#145;':'&#8216;', '&#146;':'&#8217;', '&#147;':'&#8220;', '&#148;':'&#8221;', '&#149;':'&#8226;', '&#150;':'&#8211;', '&#151;':'&#8212;', '&#152;':'&#732;', '&#153;':'&#8482;'};
              for (var key_obj in cp1252_to_unicode_dict){
                  var val_obj = cp1252_to_unicode_dict[key_obj];
                  new_txt = new_txt.replace(key_obj, val_obj);
              }
              new_txt = String((new_txt.split()).join(" "));
                   return new_txt
              }
 
        return obj;
});

