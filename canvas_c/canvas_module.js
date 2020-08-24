var global_search_attribute = 'id';
var TASApp={};
TASApp.gbl={};
TASApp.gbl.doc_type="html";

function TASCanvasApp(){
  this.canvas = null;
  this.selected_customindexs=[];
  this.doc = null;
  this.id_val = ""
}

TASCanvasApp.prototype.constructor	= TASCanvasApp;
(function(){
  this.create_canvas = function(doc, id_val, iframe_id, iframe_id1){
    //id_val = 'id';
    this.doc = doc;
    this.id_val = id_val;
    this.iframe_id = iframe_id;
    this.canvas = new Canvas("", "/src/canvas_c/canvas_ir/");
    //this.canvas.init_body(doc, this.save_crop_data.bind(this), 'group_highlighter', {'GP':{}, 'GP Repeat Elm':{}, 'Elm': {}, 'Formula': {}, 'Formula Elm': {}, 'NA Elm': {}}, iframe_id);
    this.canvas.init_body(doc, this.save_crop_data.bind(this), 'group_highlighter', {'GP Elm':{}, 'Formula': {}, 'Formula Elm': {}}, iframe_id, iframe_id1);
  }

  this.save_crop_data = function(obj){
      var all_xml_ids_new = [];
      var marked_tbl_lst = [];
      var co_ordi     = obj.getSelectedCord();
      console.log('co_ordi', co_ordi)
      var taxo_id = obj.taxo_id;
      var taxo_name =obj.taxo_name;
      var iframe_dom = this.doc;
      //if (!(taxo_name)){
      //    alert("select any taxonomy");
      //    return;
      //}
      if (taxo_name === 'Clear Data'){
          var small_div_id    = co_ordi.split('_');
          var gtx = Math.round(parseInt(small_div_id[0]));
          var gty = Math.round(parseInt(small_div_id[1]));
          var gtw = Math.round(parseInt(small_div_id[2]));
          var gth = Math.round(parseInt(small_div_id[3]));
          if(TASApp.gbl.doc_type.toLowerCase() == 'pdf'){
              all_xml_ids_new = this.get_xml_ids(Number(gtx), Number(gty), Number(gtw), Number(gth));
          }else{
              all_xml_ids_new = this.get_custom_ids(Number(gtx), Number(gty), Number(gtw), Number(gth));
          }

          this.remove_ldr(all_xml_ids_new);
          this.canvas.hide_popup_div();
          this.canvas.RemoveRect();
      }else{
          var selected_tab = taxo_name;
          var small_div_id    = co_ordi.split('_');
          var gtx = Math.round(parseInt(small_div_id[0]));
          var gty = Math.round(parseInt(small_div_id[1]));
          var gtw = Math.round(parseInt(small_div_id[2]));
          var gth = Math.round(parseInt(small_div_id[3]));
          x_cord = gtx;
          y_cord = gty;
          w_cord = gtw;
          h_cord = gth;
          co_ordi = gtx+'_'+gty+'_'+gtw+'_'+gth;
          marked_tbl_lst.push(co_ordi);
          var selected_tab_arr = selected_tab.split(" ");
          var id = selected_tab_arr.join("_") + "_div";
          if(TASApp.gbl.doc_type.toLowerCase() == 'pdf'){
              all_xml_ids_new = this.get_xml_ids(Number(gtx), Number(gty), Number(gtw), Number(gth));
          }else{
              all_xml_ids_new = this.get_custom_ids(Number(gtx), Number(gty), Number(gtw), Number(gth));
              //console.log('IF ', all_xml_ids_new)
          }
          if (all_xml_ids_new.length == 0){
              alert("please mark correctly...xml ids empty..");
              return;
          }
          all_xml_ids_new = Array.from(new Set(all_xml_ids_new));
          marked_tbl_lst.push(all_xml_ids_new);
          this.canvas.hide_popup_div();
          this.canvas.RemoveRect();
        }
        //console.log('selected nodes - ', all_xml_ids_new)
        /*****/
        var scope = angular.element($('#body_wrapper')).scope();
        //setTimeout(function(){
        if(this.iframe_id == 'iframe_sub'){ 
            scope.setSelectedObj(all_xml_ids_new);
        }else{
            scope.setSelectedObj_2(all_xml_ids_new);
        }
        //}, 500);
        /*****/
      }

      this.remove_ldr = function(all_xml_ids_new){
          for (var i=0;i<all_xml_ids_new.length;i++){
              var td = this.get_td_obj(all_xml_ids_new[i]);
              if (td.hasAttribute('ldr'))
                  td.removeAttribute('ldr');
              td.style.background = "";
          }
      }

      this.get_custom_ids = function(gtx, gty, gtw, gth){
	  return [gtx, gty, gtw, gth]
          var iframe_dom = this.doc;
		  var scrollLeft = iframe_dom.body.scrollLeft;
  		  var scrollTop= iframe_dom.body.scrollTop;
          var textElms = iframe_dom.querySelectorAll("span") || [];
          var xml_ids_arr = [];
          var section_type_obj = {};
          if (textElms.length > 0){
              var tmp_arr, txtNode, rect, x, y, w, h, tmp_str;
              for (var j=0;j<textElms.length;j++){
                  txtNode = textElms[j];
                  tmp_arr = [];
                  if (txtNode){
                      rect        = txtNode.getBoundingClientRect();
                      x           = parseInt(rect.left + scrollLeft);
                      y           = parseInt(rect.top + scrollTop);
                      w           = parseInt(rect.right - rect.left);
                      h           = parseInt(rect.bottom - rect.top);
                      if ((x >= gtx && ((gtx+gtw) >= (x+w))) && (y >= gty && ((gty+gth) >= (y+h)))){
                          var cur_xml = txtNode.getAttribute(this.id_val);
                          tmp_arr.push(cur_xml);
                          var cur_table_id = txtNode.getAttribute('table_id');
                          tmp_str = tmp_arr.join('$');
                          //xml_ids_arr.push(tmp_str);
                          var cur_section_type = txtNode.parentNode.getAttribute('section_type');
                          if(txtNode.innerHTML){
                            xml_ids_arr.push([tmp_str, txtNode.innerHTML, cur_table_id, cur_section_type]);
                          }
                      }
                  }
              }
          }
          return xml_ids_arr;
      }

      this.get_xml_ids = function(gtx, gty, gtw, gth){
	  return [gtx, gty, gtw, gth]
          var iframe_dom = this.doc;
          var scrollLeft = iframe_dom.scrollLeft;
          var scrollTop= iframe_dom.scrollTop;
          var xml_ids_arr = [];
  		  var check_dic = {};
          if (tables.length > 0){
  	        for(var  p  = 0 ; p < tables.length ; p++){
                  var data_table = tables[p];
                  var table_rows = data_table.rows;
                  var table_cells, td_obj, all_spans, tmp_arr, span, rect, x, y, w, h, tmp_str;
                  for (var i = 0;i<table_rows.length;i++){
                      table_cells = table_rows[i].cells;
                      for (var j=0;j<table_cells.length;j++){
                          td_obj = table_cells[j];
                          all_spans = td_obj.querySelectorAll("span");
                          tmp_arr = [];
                          for (var k=0;k<all_spans.length;k++){
                              span = all_spans[k];
                              if (span){
                                  rect        = span.getBoundingClientRect();
  								  x           = parseInt(rect.left + scrollLeft);
  								  y           = parseInt(rect.top + scrollTop);
                                  w           = parseInt(rect.right - rect.left);
                                  h           = parseInt(rect.bottom - rect.top);
                                  if ((x >= gtx && ((gtx+gtw) >= (x+w))) && (y >= gty && ((gty+gth) >= (y+h)))){
  								    if(check_dic.hasOwnProperty(span.id)){

									}	else{
  										check_dic[span.id] = span.id;
                                        tmp_arr.push(span.id);
  									}
                                  }
                              }
                          }
                          if (tmp_arr.length >= 1){
                              tmp_str = tmp_arr.join('$');
                              xml_ids_arr.push(tmp_str);
                          }
                      }
                  }
  			}
  		}
        return xml_ids_arr;
      }
      this.get_td_obj = function(ele){
          var ele_arr = ele.split('$');
          var first_ele = ele_arr[0];
          var iframe_dom = this.doc;
          if(TASApp.gbl.doc_type.toLowerCase() == 'pdf'){
                  var td_obj = iframe_dom.getElementById(first_ele);
                  while(true){
                      if (td_obj.nodeName === "SPAN"){
                          break
                      }else{
                          td_obj = td_obj.parentNode;
                      }
                  }
              }else{
                  var td_obj = iframe_dom.querySelector('['+this.id_val+'="'+first_ele+'"]');
              }
          //console.log("===="+td_obj.outerHTML);
          return td_obj;
      }
      this.clearCanvas = function(){
          if (this.canvas){
              this.canvas.EmptyElement('mg_kdiv_tt');
              var a = document.querySelectorAll("div[data_id]")
              for (var i  = 0 ;i< a.length;i++){
                a[i].style.display = "none";
              }
          }
      }

      }).apply(TASCanvasApp.prototype);

TASApp.canvas = new TASCanvasApp();
/*function get_canvas(){
  return new TASCanvasApp();
}*/
