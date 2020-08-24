
function create_dom(tag_name,attributes,parent_div,innerdata){
    var dom = document.createElement(tag_name);
    for(key in attributes){
            dom.setAttribute(key,attributes[key]);
    }
    dom.innerHTML = innerdata;
    if(parent_div)
    parent_div.appendChild(dom);
    return dom;
}

function clear_tashighlights(contentwindow){
   Array.prototype.forEach.call(contentwindow.document.querySelectorAll('[role="tas_highlights"]'),function(node){
       node.parentElement.removeChild(node);
   }) 
}

window.clear_highlightsbbox = function(id){
        var content_window = document.querySelector('#'+id).contentWindow;
        clear_tashighlights(content_window);
}

window.highlightsbbox_withclass = function(id, bboxs, info, class_name, flag){
    if(!info || info.length == 0)
        info  = [0,0,0,0]
    if(!Array.isArray(bboxs)){
        try{
            bboxs   = JSON.parse(bboxs)
        }catch(e){
            bboxs   = []
        }
    }
    var content_window = document.querySelector('#'+id).contentWindow
    if(flag)
            clear_tashighlights(content_window)
    var d   = 0
    bboxs.sort(function(a,b){
 	return (a[2]<b[2])
    });
    var done_bbox	= {}
    bboxs.forEach(function(bbox){
        var p_dom          = content_window.document.querySelector('#pageContainer'+1)
        var dom_w            = $(p_dom).width()
        var dom_h            = $(p_dom).height()
        var bbox           = bbox.map(function(t){ return Number(t)})
	if(bbox.length>4){
        	bbox[4]             = Number(bbox[4]||0)
        	bbox[5]             = Number(bbox[5]||0)
	}else{
	        bbox[4]             = Number(info[2]||0)
	        bbox[5]             = Number(info[3]||0)
	}
	var bb_str	   = bbox.join('_')
	if(bb_str in done_bbox) return
	done_bbox[bb_str]	= 1
        bbox[0]            = bbox[0]*(dom_w/bbox[4])
        bbox[1]            = bbox[1]*(dom_h/bbox[5])
        bbox[2]            = bbox[2]*(dom_w/bbox[4])
        bbox[3]            = bbox[3]*(dom_h/bbox[5])
        var left           = bbox[0] //(bbox[0]*1.25) //+(bbox[0]/2)
        var top1           = bbox[1] //((bbox[1]-3)*1.25) //+(bbox[1]/2)
        var width          = bbox[2] //(bbox[2]*1.25) //+(bbox[2]/2)
        var height         = bbox[3] //((bbox[3]+3)*1.25) //+(bbox[3]/2)
        var border_value = "1px solid #FFC500";
        var bg_color = "rgba(245, 209, 86, 0.25)";
        if(class_name == 'parent_iframe_tag'){
                //border_value = "1px solid #36fdfe";
                //bg_color = "rgba(54, 253, 254, 0.24)";
		bg_color ="rgba(255, 193, 7, 0.2)";
    		border_value = "2px solid rgb(0, 126, 255)";
        }else if(class_name == 'res_iframe_tag'){
                border_value = "2px solid #5cb85c";
                bg_color = "rgba(92, 184, 92, 0.2)";
        }else if(class_name == 'green_iframe_tag'){
             border_value = "2px solid #78fd79";
                bg_color = "rgba(120, 253, 121, 0.2)";
        }else if(class_name == 'red_iframe_tag'){
                border_value = "2px solid #ff847b";
                bg_color = "rgba(255, 193, 7, 0.2)";
        }else{
                border_value = "1px solid #cdb0ff";
                bg_color = "rgba(205, 176, 255, 0.25)";
        }
        var style          = 'width:'+width+'px;height:'+height+'px;top:'+top1+'px;left:'+left+'px;z-index:100000000;background-color: '+bg_color+';border:'+border_value+';position: absolute;box-sizing: content-box;'
        var nw_som  =   create_dom('div',{'style': style,'role':'tas_highlights'},p_dom,'')
        if(d==0 && nw_som){
            d = 1
            var v_dom          = content_window.document.querySelector('#viewerContainer');
            if(!v_dom){
                return;
            }
        var w_width        = v_dom.clientWidth
            var sleft          = 0
            if((left+width) > w_width){
                    sleft   = (left - w_width)+width+30
            }
            $(content_window.document.querySelector('#viewerContainer')).animate({
                scrollTop: ((top1+height) - 120),
                scrollLeft: sleft,
            }, 0);
            
        }
    })
}

