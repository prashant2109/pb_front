var app = angular.module("tas.reference", []);

app.controller('RefController', function($scope, $rootScope, $http, $timeout, $location, $filter, $sce, refIframe, refAlert){
	$scope.config.scope = $scope;
	var def_opt = {"toolBar":1,"doc_id": false,'doc_head': '','column': '',"htmlRef":false,"pdfRef":false,"html_type":"pdf","active":"pdf","title":"","dropDown":true,"path":"src/no_ref_found.html","pno_list":[],"selected_pno": 0,"options":{"zoom":true,"clear":true,"multiselect":true},"ref":[], 'd_path': ''};
        for (var dopt in def_opt){
                if(!$scope.config.hasOwnProperty(dopt))
                        $scope.config[dopt] = def_opt[dopt];
        }
	$scope.tab_click_func = function(c, k){
		c['active'] = k;
        	if('tab_click_func' in $scope.config.parent_scope)
            		$scope.config.parent_scope.tab_click_func(c, k);
	}
	/***********************************/
	//if(!$scope.$$listenerCount['ref_temp_data']){
	$scope.$on('ref_temp_data', function (event, config) {
    		console.log('cccc');
		$scope.iframe_page_no_change(config);
    	});
	//}
    	/***********************************/
	$scope.clear_pdf_highlight = function(id){
		refIframe.clearPdfHighlight(id);
	}
    	/***********************************/
        $scope.create_search_html_func = function(data,config){
             var iframe_id = config['id'] || '';
             if(iframe_id=='')
                 return;
             var iframe_dom = document.querySelector('#'+iframe_id);
             var frame_window = iframe_dom.contentWindow;
             var doc = frame_window.document;
             doc.body.innerHTML = '';
             $(doc.body).append(data);
        }
    	/***********************************/
	$scope.clear_table_highlight = function(id){
            refIframe.clearTableHighlight(id);
        }
    	/***********************************/
	$scope.pno_filter_inp_func = function(data, txt=''){
        	if(!data)
                	return [];
        	return data.filter(function(tv){ return (String(tv || '').toLocaleLowerCase().includes(txt.toLocaleLowerCase()))});
    	}
    	/***********************************/
	$scope.set_frame_obj	= function(){
		var iframe_dom = document.querySelector('#'+$scop.config.id)
		if(iframe_dom){
			iframe_dom.callback = function(type, pno, xml, c){
				console.log('ION ', type, pno, xml, c)
				
			}
		}
	}
    	/***********************************/
    	$scope.iframe_page_no_change = function(config){
		if (config.page_change)
			config.page_change(config.selected_pno);
		if(config['active'] == 'pdf'){
		    if(config.hasOwnProperty('ref')){
                config['ref'].forEach(function (ech_ref_dict){
				    if(Object.keys(ech_ref_dict).length){
				         var bbox = [];
						 var coord = [];
						 bbox = ech_ref_dict['bbox'] || [];
						 coord =  ech_ref_dict['coord'] || [];
						 bg = ech_ref_dict['bg'] || '';
						 border = ech_ref_dict['border'] || '';
						 class_name = ech_ref_dict['c_name'] || 'parent_iframe_tag';
						 pno = ech_ref_dict['p_pno'] || 1;
						 if('pdf_pno_list' in $scope.config && $scope.config['pdf_pno_list'].length>1){
							pno = ech_ref_dict['pno'];
						 }
						 clr_flg = true;
						 if('clr_flg' in ech_ref_dict)
						     clr_flg = ech_ref_dict['clr_flg'];
						 refIframe.pdfHighlight(config, bbox, coord, class_name, clr_flg, bg, border, pno);
				    }
                })
		    }
		}else{
            var iframe_id = config['id'] || '';
            var path = config['path'];
            if(iframe_id=='')
                return;
		    var iframe_dom = document.querySelector('#'+iframe_id)
	            if(!iframe_dom)
			return;
		    var doc_path = iframe_dom.getAttribute('src') || '';
		    var temp = path;
		    if(doc_path != temp || !iframe_dom.contentWindow.document.body){
			var time_event_call = false;
			setTimeout(function (){
			      if(!time_event_call){
				   time_event_call=true;
				   ref_call();	
			      }		
			},1500)
			iframe_dom.onload = function (){
				if(!time_event_call){
					time_event_call=true;
					ref_call();
				}
			}
			iframe_dom.setAttribute('src', temp);
		    }else{
				ref_call()
		    }
            function ref_call () {
			    if(config.hasOwnProperty('ref')){
				 config['ref'].forEach(function (ech_ref_dict, idx){
					 var xml_list = [];
				         if(!('xml_list' in ech_ref_dict)){
						 if(ech_ref_dict.hasOwnProperty('x')){
							if(ech_ref_dict['x'] != "")
								xml_list=[ech_ref_dict['x']]
							if(ech_ref_dict['x'].indexOf('$') > -1)
								xml_list=ech_ref_dict['x'].split('$');
							else if(ech_ref_dict['x'].indexOf('#') > -1)
								xml_list=ech_ref_dict['x'].split('#');
						 }
						 var xml_list_m = [];
						 if(ech_ref_dict.hasOwnProperty('xml_list')){
							ech_ref_dict['xml_list'].forEach(function (ech_ids){
								var ech_ids_lst = [];  
								if(ech_ids != "")
									ech_ids_lst=[ech_ids]
								if(ech_ids.indexOf('$') > -1)
									ech_ids_lst=ech_ids.split('$');
								else if(ech_ids.indexOf('#') > -1)
									ech_ids_lst=ech_ids.split('#');
								xml_list_m = xml_list_m.concat(ech_ids_lst);
							})
						}
						var conc_xml_lst = xml_list.concat(xml_list_m);
					}else{
						conc_xml_lst = ech_ref_dict['xml_list'];
					}
					if(conc_xml_lst.length){
					 	ech_ref_dict['xml_list'] = conc_xml_lst;
                        refIframe.tableHighlight(config, 'parent_iframe_tag', ech_ref_dict['clr_flg'], ech_ref_dict, '');
					}
				 })
			   }
            }
	       }
    }
    /***********************************/
	$scope.page_no_change_func = function(config, pos){
		var get_idx = config.pno_list.indexOf(config.selected_pno);
		if(pos == 'prev'){
		    rw = config.pno_list[get_idx - 1];
		}else if(pos == 'next'){
		    rw = config.pno_list[get_idx + 1];
		}
		config.selected_pno = rw;
		if('page_num_change' in $scope.config.parent_scope)
			$scope.config.parent_scope.page_num_change(config.selected_pno);
		$scope.iframe_page_no_change(config);
    	}
    	/***********************************/
	$scope.html_ref_zoom_func = function(config, key){
        	refIframe.zoom(config['id'], 'id', key);
		$timeout(function(){
			$scope.iframe_page_no_change(config);
		});
    	}
    	/***********************************/
      	$scope.selct_pno_change_func = function(config, rw){
		config.selected_pno = rw;
		if('page_num_change' in $scope.config.parent_scope)
			$scope.config.parent_scope.page_num_change(config.selected_pno);
	        $scope.iframe_page_no_change(config);
    	}
    	/***********************************/
    	/**************Taxo List************/
	$scope.taxo_list = [];
	$scope.drop_data_set = function(taxo_list = []){
		$scope.taxo_list = taxo_list;
    	}
	/***********************************/
	$scope.desc_hight_func = function(data, idx){
        $scope.sltced_desc_flg = idx;
		if(data['vtype'] == 'Availability'){
		    var d_spt = data['desc'].split('@@');
		    var pg_crd = d_spt[1];
		    var xml = d_spt[2];
		    var xml_spt = xml.split('_');
		    var pg_no = xml_spt[xml_spt.length - 1];
		    $scope.selected_pno = pg_no;
		    var ref_dic = {};
		    ref_dic[pg_no] = {};
		    ref_dic[pg_no][xml] = [pg_crd];
		    $scope.iframe_page_no_change(ref_dic); 
		}
    	}
	/***********************************/
	$scope.clear_win_selection = function(){
        	var iframe_dom = document.querySelector('#'+$scope.config.id);
        	var frame_window = iframe_dom.contentWindow;
        	if (frame_window.getSelection) {
              		if (frame_window.getSelection().empty) { //C
                		frame_window.getSelection().empty();
              		}
			 else if (frame_window.getSelection().removeAllRanges) {  // F
                		frame_window.getSelection().removeAllRanges();
              		}
        	}
		 else if (frame_window.document.selection) {  // IE
              		frame_window.document.selection.empty();
        	}
    	}
	/***********************************/
    	$scope.txo_list_pop_flg = {'k': false};
    	$scope.txo_list_pop_cls = function(){
        	$scope.txo_list_pop_flg = {"k": false};
        	$scope.clear_win_selection();
		
    	}
	/***********************************/
	$scope.selected_pno = null;
	window.getSelected_page_no = function(){
        	return $scope.selected_pno;

    	}
	/***********************************/
    	$scope.txo_list_pop_slted_obj = {};
	window[$scope.config.id] = {}
	if('id' in $scope.config && $scope.config.id in window){
		window[$scope.config.id].get_slcted_val_pop_func = function(obj){
			if($scope.config.dropDown){
				$scope.txo_list_pop_flg = {'k': true};
				$scope.main_input_txtarea = obj['text'];
				$scope.txo_list_pop_slted_obj = obj;
				var input_dom = document.getElementById("txo_list_pop_f_lft_c_ipt");
				$timeout(function(){
					input_dom.focus();
				});
				$scope.$apply();
			}
		}
	}
	/***********************************/
    	window[$scope.config.id].snipet_click = function(ev){
           var dom = ev.target;
           var xmlId = dom.getAttribute("id");
           var ch = dom.getAttribute("ch");
           $scope.config.parent_scope.newPop(xmlId,ch);
	}
	/***********************************/
    	window[$scope.config.id].reset_txo_pop_func = function(){
		$scope.txo_list_pop_flg = {'k': false};
		$scope.main_input_txtarea = '';
		$scope.txo_list_pop_f_txt = '';
		$scope.txo_list_pop_side_f_txt = '';
		$scope.txo_list_pop_slted_obj = {};
		$scope.txo_list_pop_f_lft_t_id = {};
		$scope.side_txo_list = [];
		$('.txo_list_pop_f_lft_bli').show();
		$('.txo_list_pop_side_fl_b_lst').show();
		$scope.txo_list_pop_side_flg = false;
		$scope.$apply();
    	}
	/***********************************/
    	$scope.add_tas_na_text = function(){
        	$scope.main_input_txtarea = 'TAS-NA';
    	}
	/***********************************/
    	$scope.txo_pop_save_func = function(){
		var slct_obj = $scope.txo_list_pop_slted_obj;
		var pageno = $scope.config.selected_pno;
		var dic = {sted: "", v: $scope.main_input_txtarea, x: "", 'ref': slct_obj['cids'], 'updated': "Y", 'fcd': slct_obj['from_custom_dom']};
		$scope.config.parent_scope.slt_data_frame(pageno, dic)
    	}
	/***********************************/
    	$scope.txo_pop_list_save_func = function(flg=false, lookup=[]){
		var slct_obj = $scope.txo_list_pop_slted_obj;
		var value = $scope.txo_list_pop_f_lft_t_id['taxo'];
		if($scope.txo_list_pop_f_lft_t_id['dropdown'].length){
		    if(flg){
			refAlert.show('Please select from sidedropdown.', 'warning', 1000);
			return;
		    } 
		}
		$scope.selcted_taxo_dic = $scope.txo_list_pop_f_lft_t_id;
		var slcted_dic = $scope.txo_list_pop_f_lft_t_id;
		if(Object.keys(slcted_dic).length && 'meta_flg' in slcted_dic && slcted_dic['meta_flg']=='Y'){
		    refAlert.show('This Meta data don\'t have edit option.', 'warning', 2000);
		    return;
		}
		var dic = {sted: "", v: $scope.main_input_txtarea, x: "", 'ref': slct_obj['cids'], 'updated': "Y", 'fcd': slct_obj['from_custom_dom'],'id': $scope.txo_list_pop_f_lft_t_id["id"]};
		if (lookup && lookup.length == 2){
		    dic['c_c']  = lookup[0]
		    dic['c_desc']  = lookup[1]
		}
		var pageno = $scope.config.selected_pno;
		$scope.config.parent_scope.slt_data_frame(pageno, dic, value)
	}
	/***********************************/
	window.getSelected_page_no = function(){
		return $scope.config.selected_pno || 1;
	}
	/***********************************/
	$scope.taxo_avl_srl_func = function(tl){
		var id = [tl['taxo'], tl['t_id']].join('_');
		var row  = document.querySelector('#'+id);
		var tableContainer = $('#tableContainer');
		tableContainer.scrollTop(0);
		tableContainer.scrollTop(row.offsetTop - (tableContainer.height()/2));
		$scope.selcted_taxo_dic = tl;
    	}
	/***********************************/
	window.show_txt_proper_slct_pop = function(){
		if($scope.config.dropDown){
                	$scope.txo_list_pop_slted_obj = {};
                	refAlert.show('Please select proper text.', 'warning', 1000);
                	$scope.$apply();
		}
        }
	/***********************************/
	$scope.taxo_li_movr_func = function(tl, idx){
        	$scope.txo_list_pop_side_flg = false;
        	$scope.txo_list_pop_f_lft_t_id = tl;
        	$scope.side_txo_list = [];
        	if(tl['dropdown'].length){
            		$scope.side_txo_list = tl['dropdown'];
            		$scope.txo_list_pop_side_flg = true;
        	}
    	}
	/***********************************/
    	$scope.filter_function = function(txt='', event, pnodeId, prnt_div_class){
		var pnode = document.querySelector("." + pnodeId);
		if(event){
			if(event.keyCode == 13){
				var all_list_dom = pnode.querySelectorAll("." + prnt_div_class) || [];
				if(all_list_dom.length){
					for(var i=0;i<all_list_dom.length;i++){
						if(all_list_dom[i].style.display == 'block'){
							all_list_dom[i].click();
							return;
						}
					}
				}
			}
		}
		var all_list_dom = pnode.querySelectorAll("." + prnt_div_class) || [];
		for(var i=0;i<all_list_dom.length;i++){
			var inner_data = all_list_dom[i].textContent.toLocaleLowerCase();
			var dom_data = txt.toLocaleLowerCase();
			if(!dom_data){
				all_list_dom[i].style.display = 'block'; 
			}
			if(inner_data.indexOf(dom_data) == -1){
				all_list_dom[i].style.display = 'none';      
			}else{
				all_list_dom[i].style.display = 'block';      
			}
		} 
    	}
	/***********************************/
	$scope.html_ref_clear_func = function(){
		$scope.clear_table_highlight($scope.config.id);
    	}
	/***********************************/
    $scope.html_ref_multi_flg = false;
    $scope.html_ref_multi_func = function(){
        $scope.html_ref_multi_flg = !$scope.html_ref_multi_flg;
    }
	/***********************************/
	$scope.ref_alert_section_close = function(){
		refAlert.hide();	
         }	
	/***********************************/
         $scope.d_path_func = function(){
                path = $scope.config['d_path'];
                var dom = document.getElementById('dwn_load_path_id');
                dom.setAttribute('href', path);
                $timeout(function(){
                        dom.click();
                });
        }
	/***********************************/
	/***********************************/
});

app.directive('refDiv', function(){
	return {
		restrict: 'AE',
		template:`
				<div class="rmc">
					<div class="rmct" ng-if="config['toolBar']">
						<div class="rmctl">
							<div class="rmctlb waves-effect" ng-click="tab_click_func(config, 'pdf')" ng-if="config['pdfRef']" ng-class="{active: config['active'] == 'pdf'}">PDF</div>
							<div class="rmctlb waves-effect" ng-click="tab_click_func(config, 'html')" ng-if="config['htmlRef']" ng-class="{active: config['active'] == 'html'}">HTML</div>
							<div class="rmctlb_id" ng-if="config['title']" title="{{config['title']}}">{{config['title']}}</div>
						</div>
						<div class="rmctr">
                                                         <div  class="pull-left rmcticn" ng-if="config['d_path'] != ''" ng-click="d_path_func()"><i class="fa fa-download" aria-hidden="true"></i></div>
                                                	<a href="" id="dwn_load_path_id" download style="display:none">Download</a>
							  <div class="pull-left" ng-if="config['htmlRef'] && config['active']=='html' && config['html_type'] == 'pdf'">
				                <div class="rmcticn waves-effect pull-left" ng-if="config['options']['clear']" title="Clear Selection" ng-click="html_ref_clear_func()"><i class="fa fa-eraser" aria-hidden="true"></i></div>
                          		<div class="rmcticn waves-effect pull-left" ng-if="config['options']['multiselect']" title="Multiselection" ng-click="html_ref_multi_func()" ng-class="{active: html_ref_multi_flg}"><i class="fa fa-object-ungroup" aria-hidden="true"></i></div>
								<div class="rmcticn waves-effect pull-left" ng-click="page_no_change_func(config, 'prev')" ng-class="{rmc_disable_btn: config.selected_pno == config.pno_list[0] || config.pno_list.length==0}"><i class="fa fa-chevron-left" aria-hidden="true"></i></div>
								<div class="dropdown pull-left" style="width: 70px;">
								    <div class="rmcticn waves-effect dropdown-toggle header_icon_sec" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="padding: 0px 5px;color: #232323;text-align: right;">
									<div class="header_icon_txt">{{config.selected_pno}}</div>
								    </div>
								    <div class="dropdown-menu rmc_dropdown_menu_tas rmc_main_pno_drp_dwn" ng-class="{rmc_zoom_no: !config.options['zoom']}">
									    <div class="md-form rmc_md_form_tas" style="margin: 5px 15px;">
										    <input class="form-control" type="text" placeholder="Search" aria-label="Search" ng-model="config.pno_filter['val']" style="font-size: 14px;" autofocus>
									    </div>
									    <div class="rmc_dropdown_item_tas_full">
										    <div class="rmc_dropdown_item_tas waves-effect" ng-repeat="rw in pno_filter_inp_func(config.pno_list, config.pno_filter['val']) track by $index" ng-click="selct_pno_change_func(config, rw)" ng-class="{act: config.selected_pno == rw}">{{rw}}</div>
									    </div>
								    </div>
								</div>
								<div class="rmcticn waves-effect pull-left" ng-click="page_no_change_func(config, 'next')" ng-class="{rmc_disable_btn: config.selected_pno == config.pno_list[config.pno_list.length - 1] || config.pno_list.length==0}"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>
							  </div>
							  <div class="rmcticn waves-effect pull-left" title="Zoom Out" ng-if="config['htmlRef'] && config['active']=='html' && config['options']['zoom']" ng-click="html_ref_zoom_func(config, -1)"><i class="fa fa-search-minus" aria-hidden="true"></i></div>
							  <div class="rmcticn waves-effect pull-left" title="Zoom Fit" ng-if="config['htmlRef'] && config['active']=='html' && config['options']['zoom']" ng-click="html_ref_zoom_func(config, 2)"><i class="fa fa-table" aria-hidden="true"></i></div>
							  <div class="rmcticn waves-effect pull-left" title="Zoom In" ng-if="config['htmlRef'] && config['active']=='html' && config['options']['zoom']" ng-click="html_ref_zoom_func(config, 1)"><i class="fa fa-search-plus" aria-hidden="true"></i></div>
						</div>
					</div>
					<div class="rmcb" ng-class="{fh:!config['toolBar']}">
						<iframe src="{{config['path']}}" id="{{config['id']}}" ng-if="!config['hide_frame']" doc_type="{{config['doc_type']}}" config_id="{{config['config_id']}}"></iframe>
					</div>
				</div>
				<div class="txo_list_pop_full" id="{{config['id']}}_txo_list_pop_full" ng-show="txo_list_pop_flg['k']">
					<div class="txo_list_pop_f_lft">
					    <div class="txo_list_pop_f_lft_t">
						<textarea class="txo_list_pop_f_lft_t_txtara" autocomplete="off" id="main_input_txt_option" ng-model="main_input_txtarea"></textarea> 
						<div class="txo_list_pop_f_lft_t_btn" id="main_input_TAS_NA" ng-click="add_tas_na_text()">TAS-NA</div>
					    </div>
					    <div class="txo_list_pop_f_lft_c">
						<div ng-click="txo_pop_save_func()" class="txo_list_pop_f_lft_c_sv">Save</div>
						<div ng-click="config.parent_scope.dublicate_creation()" class="dub_group" ng-if="config.group_duplicate == true"><i class="fa fa-clone"></i></div>
						<input type="text" class="txo_list_pop_f_lft_c_ipt" value="" ng-model="txo_list_pop_f_txt" id="txo_list_pop_f_lft_c_ipt" ng-keyup="filter_function(txo_list_pop_f_txt, event, config['id'] +'_txo_list_pop_full', 'txo_list_pop_f_lft_bli')" ng-class="{'txo_list_pop_f_lft_c_ipt_wcg': config.group_duplicate != true}">
						<div ng-click="txo_list_pop_cls()" class="txo_list_pop_f_lft_c_del">&times;</div>
					    </div> 
					    <div class="txo_list_pop_f_lft_b">
						<div class="txo_list_pop_f_lft_bli" ng-repeat="tl in taxo_list" ng-mouseover="taxo_li_movr_func(tl, $index);$event.stopPropagation();" ng-click="txo_pop_list_save_func(true)" ng-class="{active: txo_list_pop_f_lft_t_id['t_id'] == tl['t_id']}">
						    {{tl['t_id']}} - {{tl['taxo']}}
						    <div class="txo_val_avl_div_prt" ng-if="doc_full_res['data'][tl['taxo']] && doc_full_res['data'][tl['taxo']][doc_full_res['data'][tl['taxo']].length - 1]['v'] != ''" ng-click="taxo_avl_srl_func(tl);$event.stopPropagation();">
							<div class="txo_val_avl_div"></div>
						    </div> 
						    <div class="kpi_drp_dwn_icn dropdown-toggle" ng-if="tl['dropdown'].length" style="float: right;float: right;position: absolute;right: 2px;top: 10px;">
							<span class="sr-only">Toggle Dropdown</span>
						    </div> 
						</div>
					    </div> 
					</div>
					<div class="txo_list_pop_side_fl" ng-if="txo_list_pop_side_flg">
					    <div class="txo_list_pop_side_fl_t">
						<input autocomplete="off" class="txo_list_pop_side_fl_t_ipt" value="" ng-model="txo_list_pop_side_f_txt" ng-keyup="filter_function(txo_list_pop_side_f_txt, event, 'txo_list_pop_full', 'txo_list_pop_side_fl_b_lst')" id="main_input_div_option">
					    </div>
					    <div class="txo_list_pop_side_fl_b">
						<div class="txo_list_pop_side_fl_b_lst" ng-repeat="sde in side_txo_list track by $index" title="{{sde[1]}}" ng-click="txo_pop_list_save_func(false, sde)">
						    {{sde[1]}}
						    <sub class="txo_list_pop_side_fl_b_lst_sub" title="{{sde[0]}}">{{sde[0]}}</sub>
						</div>
					    </div>
					</div>
				</div>
					<div id="rmc_alert_section">
					    <div id="rmc_alert_box">
						    <div class="rmc_alert_text"></div>
						    <div class="rmc_alert_close" ng-click="ref_alert_section_close()">&times;</div>
					    </div>
					</div>
					<style>
					.rmc{width: 100%;height: 100%;float: left;border-bottom: 1px solid #d9d9d9;}
					.rmct{width: 100%;height: 30px;float: left;position: relative;background: #fff;border-bottom: 1px solid #d9d9d9;}
					.rmcb{width: 100%;height: calc(100% - 30px);float: left;position: relative;background: #fff;}
					.rmcb.fh{height: 100% !important;min-height: auto;}
					.rmctl{float:left;}
					.rmctr{float:right;}
					.rmctlb{padding: 0px 10px;height: 29px;line-height: 30px;width: auto;float: left;font-size: 12px;}
					.rmctlb.active{background: #455a64;height: 30px;font-weight: bold;color: #fff;}
					.rmcticn{height: 29px;width: auto;text-align: center;line-height: 29px;background: inherit;padding: 0px 13px;border-left: 1px solid #dfdfdf;}
					.rmcticn.active {background: #99ffac;}
					.rmcticn i{font-size: 11px;color: #005775;}
					.rmcticn span{padding-left: 7px; text-transform: capitalize; color: #212121!important;}
					.rmcticn.rmc_disable_btn {border-left: 1px solid #b5b5b5 !important;}
					.rmc .header_icon_txt{float: left;width: calc(100% - 15px);text-align: left;font-weight: 500;color: #232323;}
					.rmc .rmc_dropdown_menu_tas.show {display: block;max-height: 400px !important;overflow: auto;border-radius: 0px;width: 330px;}
					.rmc .rmc_dropdown_item_tas{display: block;width: 100%;padding: .25rem 0px .25rem 1.5rem;clear: both;font-weight: 400;text-align: inherit;white-space: nowrap;background-color: transparent;border: 0;font-size: 13px;line-height: 22px;border-bottom: 1px solid #ececec;cursor: pointer;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;}
					.rmc .rmc_dropdown_item_tas:hover{background: #eaeaea;color: #05698c !important;font-weight: bold;}
					.md-form.rmc_md_form_tas input[type=text]:focus:not([readonly]) {-webkit-box-shadow: 0 1px 0 0 #6b859e;box-shadow: 0 1px 0 0 #6b859e;border-bottom: 1px solid #6b859e;}
					.rmc .rmc_disable_btn {cursor: not-allowed !important;pointer-events: none;opacity: .5;}
					iframe{width: 100%;height: 100%;border: 0px;}
			        .rmc_dropdown_item_tas_full{overflow: auto;max-height: 332px;position: relative;width: 100%;height: auto;}
			        .dropdown-menu.rmc_dropdown_menu_tas.rmc_main_pno_drp_dwn {min-width: 140px !important;width: 144px !important;left: -36px !important;}
			        .dropdown-menu.rmc_dropdown_menu_tas.rmc_main_pno_drp_dwn.rmc_zoom_no {/*left: unset !important;*/}
					.rmc_dropdown_item_tas.act {font-weight: bold;}
					.txo_list_pop_full{position: absolute;left:10px;top: 45px;width: 350px;z-index: 2000000;padding: 0px;margin: 0px;background: #6b859e;-webkit-box-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12);box-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12);height: calc(100% - 120px);}
					.txo_list_pop_f_lft {float: left;width: 100%;height: 100%;}
					.txo_list_pop_f_lft_t {width: 100%;height: 70px;margin: 0 auto;clear: both;float: left;}
					.txo_list_pop_f_lft_t_txtara {display: block;width: 295px;padding: 2px 6px 10px 6px;resize: none;font-size: 13px;line-height: 19px;color: #555;background-color: #fff;background-image: none;border: 0px solid #ccc;border-radius: 0px;margin-left: 5px;margin-top: 10px;float: left;height: 50px;}
					.txo_list_pop_f_lft_t_btn {display: block;width: 45px;float: left;color: #555;background-color: #ffdaac;font-size: 10px;text-align: center;margin-top: 10px;height: 50px;line-height: 50px;cursor: pointer;font-weight: bold;}
					.txo_list_pop_f_lft_c {width: 100%;float: left;height: 40px;}
					.txo_list_pop_f_lft_c_sv {color: #fff;float: inherit;height: 25px;display: block;background: #36c851;padding: 0px 6px;line-height: 25px;font-size: 12px;cursor: pointer;border-radius: 2px;margin-left: 2px;}
					.txo_list_pop_f_lft_c_ipt {display: block;width: 235px;padding: 5px 6px;font-size: 13px;line-height: 1.42857143;color: #555;background-color: #fff;background-image: none;border: 1px solid #ccc;border-radius: 0px;float: left;margin-left: 8px;height: 25px;}
                                        .txo_list_pop_f_lft_c_ipt_wcg{width: 265px;}
					.txo_list_pop_f_lft_c_del {float: right;display: block;text-align: center;font-size: 21px;cursor: pointer;width: 27px;height: 25px;background-color: #e0463b;background-size: 10px 10px;box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);color: #fff;line-height: 25px; border-radius: 2px;margin-right: 2px;}
					.txo_list_pop_f_lft_b {display: block;width: 100%;clear: both;height: auto;overflow: auto;max-height: calc(100% - 110px);}
					.txo_list_pop_f_lft_bli {position: relative;padding: 10px 8px;border-bottom: 1px solid #61767f;list-style-type: none;background: #6b859e;color: white;word-break: break-all;font-size: 13px;cursor: pointer;margin: 0px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;padding-right: 40px;}
					.txo_list_pop_side_fl {position: absolute;width: 250px;clear: both;height: calc(100% - 70px);top: 70px;right: -250px;background: rgb(164, 180, 195);display: block;}
					.txo_list_pop_side_fl_t {display: block;width: 100%;height: 40px;margin: 0 auto;clear: both;}
					.txo_list_pop_side_fl_b {display: block;width: 100%;clear: both;height: calc(100% - 50px);overflow: auto;}
					.txo_list_pop_side_fl_b_lst {position: relative;display: block;padding: 10px 8px;border-bottom: 1px solid #61767f;list-style-type: none;background: #6b859e;color: white;word-break: break-all;font-size: 13px;cursor: pointer;margin: 0px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
					.txo_list_pop_side_fl_t_ipt {display: block;width: calc(100% - 25px);padding: 6px 6px;font-size: 13px;line-height: 1.42857143;color: #555;background-color: #fff;background-image: none;border: 1px solid #ccc;border-radius: 0px;-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);box-shadow: inset 0 1px 1px rgba(0,0,0,.075);margin: 2px auto;margin-top: 10px;}
					.rmctlb_id{float:left;margin-left: 10px;line-height: 30px;color: #006f98;width: auto;max-width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;font-weight: bold;}
					#rmc_alert_section{position: absolute;width: 100%;height: 100%;z-index: 100000000;background: rgba(0,0,0,0.4);top: 0px;bottom: 0px;left: 0px;right: 0px;display: none;}
					#rmc_alert_box{padding: 10px;border: 1px solid transparent;border-radius: 0px;position: absolute;top: 60px;color: #000000;background-color: #ececec;border-color: #c7c7c7;width: 500px;max-width: 500px;margin: auto;left: 0px;right: 0px;}
					#rmc_alert_box.success{color: #3c763d;background-color: #dff0d8;border-color: #d6e9c6;}
					#rmc_alert_box.error{color: #a94442;background-color: #f2dede;border-color: #ebccd1;}
					#rmc_alert_box.warning{color: #8a6d3b;background-color: #fcf8e3;border-color: #faebcc;}
					#rmc_alert_box.info{color: #31708f;background-color: #d9edf7;border-color: #bce8f1;}
					#rmc_alert_box .rmc_alert_text{float: left;width: calc(100% - 20px);}
					#rmc_alert_box .rmc_alert_close{position: relative;color: inherit;float: right;text-decoration: none !important;font-size: 20px !important;width: 20px;height: 20px;text-align: center;cursor: pointer;margin-right: -5px;margin-top: -3px;font-weight: 700;text-shadow: 0 1px 0 #fff;filter: alpha(opacity=20);opacity: .2;}
					#rmc_alert_box .rmc_alert_close:hover{opacity: .8;}
                                        .txo_list_pop_full .dub_group{color: #fff; float: left; height: 25px; display: block; background: #02cdf0; padding: 0px 8px; line-height: 25px; font-size: 12px; cursor: pointer; margin-left: 5px; border-radius: 2px;}
                                        .txo_list_pop_full .dub_group i {font-weight: bold;}
					</style>
				</div>`,
		controller: 'RefController',
		scope: {
			'config': '='
		},
		link: function (scope, elm, attrs, controller) {
		
		}
	}
});


app.factory('refIframe', function($timeout){
        var obj = {};
        var curr_zoom_factor = 0;

	function create_dom(tag_name, attributes, parent_div, innerdata){
	    var dom = document.createElement(tag_name);
	    for(key in attributes){
		    dom.setAttribute(key,attributes[key]);
	    }
	    dom.innerHTML = innerdata;
	    if(parent_div)
	    parent_div.appendChild(dom);
	    return dom;
	}

	function clear_highlightsbbox(id){
	   var contentwindow = document.querySelector('#'+id).contentWindow;
	   Array.prototype.forEach.call(contentwindow.document.querySelectorAll('[role="tas_highlights"]'),function(node){
	       node.parentElement.removeChild(node);
	   }) 
	}
         
        function remove_highlight(id){
           var id_vals = document.getElementById(id)
           var contentwindow = document.querySelector('#'+id).contentWindow;
           Array.prototype.forEach.call(contentwindow.document.querySelectorAll('[class="highlight_class"]'),function(node){
               node.classList.remove("highlight_class");
           })
        }

	function highlightsbbox_withclass(id, bboxs, info, class_name, flag, bg, border, pno){
	    if(!info || info.length == 0)
		info  = [] //[0,0,0,0]
	    if(!Array.isArray(bboxs)){
		try{
		    bboxs   = JSON.parse(bboxs)
		}catch(e){
		    bboxs   = []
		}
	    }
	    var content_window = document.querySelector('#'+id).contentWindow
	    if(flag)
		    clear_highlightsbbox(id);
	    var d   = 0
	    bboxs.sort(function(a,b){
		return (a[2]<b[2])
	    });
	    var done_bbox       = {}
	    bboxs.forEach(function(bbox){
		var p_dom       = content_window.document.querySelector('#pageContainer'+pno)
		var dom_w       = $(p_dom).width()
		var dom_h       = $(p_dom).height()
		var bbox        = bbox.map(function(t){ return Number(t)})
		if(bbox.length>4){
			bbox[4]    = Number(bbox[4]||0) || dom_w
			bbox[5]    = Number(bbox[5]||0) || dom_h
		}else{
			bbox[4]    = Number(info[2]||0) || dom_w
			bbox[5]    = Number(info[3]||0) || dom_h
		}
		var bb_str         = bbox.join('_')
		if(bb_str in done_bbox) return
		done_bbox[bb_str]  = 1
		bbox[0]            = bbox[0]*(dom_w/bbox[4])
		bbox[1]            = bbox[1]*(dom_h/bbox[5])
		bbox[2]            = bbox[2]*(dom_w/bbox[4])
		bbox[3]            = bbox[3]*(dom_h/bbox[5])
		var left           = bbox[0] //(bbox[0]*1.25) //+(bbox[0]/2)
		var top1           = bbox[1] //((bbox[1]-3)*1.25) //+(bbox[1]/2)
		var width          = bbox[2] //(bbox[2]*1.25) //+(bbox[2]/2)
		var height         = bbox[3] //((bbox[3]+3)*1.25) //+(bbox[3]/2)
		var border_value   = "1px solid #FFC500";
		var bg_color	   = "rgba(245, 209, 86, 0.25)";
		if(bg !=''){
			var border_value   = border;
			var bg_color	   = bg;
		}else{
			if(class_name == 'parent_iframe_tag'){
				bg_color ="rgba(243, 230, 88, 0.407843)";
				border_value = "2px solid rgb(0, 126, 255)";
			}else if(class_name == 'res_iframe_tag'){
				border_value = "1px solid #5cb85c";
				bg_color = "rgba(92, 184, 92, 0.25)";
			}else if(class_name == 'green_iframe_tag'){
			     border_value = "1px solid #78fd79";
				bg_color = "rgba(120, 253, 121, 0.2)";
			}else if(class_name == 'red_iframe_tag'){
				border_value = "1px solid #ff847b";
				bg_color = "rgba(255, 159, 152, 0.33)";
			}else{
				border_value = "1px solid #cdb0ff";
				bg_color = "rgba(205, 176, 255, 0.25)";
			}
		}
		var style          = 'width:'+width+'px;height:'+height+'px;top:'+top1+'px;left:'+left+'px;z-index:100000000;background-color: '+bg_color+';border:'+border_value+';position: absolute;box-sizing: content-box;'
		var nw_som  =   create_dom('div',{'style': style,'role':'tas_highlights'},p_dom,'')
                nw_som.onclick = function(){
                       remove_highlight(id)
                       nw_som.setAttribute('class', 'highlight_class');
                }
		if(d==0 && nw_som){
		    d = 1
		    var v_dom       = content_window.document.querySelector('#viewerContainer');
		    if(!v_dom){
			return;
		    }
		    var w_width     = v_dom.clientWidth
		    var sleft       = 0
		    if((left+width) > w_width){
			    sleft   = (left - w_width)+width+30
		    }
		    top1 = top1+(p_dom.offsetTop||0);
		    sleft = sleft+(p_dom.offsetLeft||0);
		    $(content_window.document.querySelector('#viewerContainer')).animate({
			scrollTop: ((top1+height) - 150),
			scrollLeft: sleft,
		    }, 0);

		}
	    });
	}

        obj.clearTableHighlight = function(iframe_id){
		var iframe_dom = document.querySelector('#'+iframe_id)
                if(!iframe_dom)
                    return;
            	var frame_window = iframe_dom.contentWindow;
            	var doms    = frame_window.document.querySelectorAll('.div_bbox')
            	for(var i=0, l=doms.length; i<l;i++)
                	doms[i].parentNode.removeChild(doms[i])
        }

        obj.tableHighlight = function(config, class_name, clear_flag, ref_dict){
		var iframe_id = config['id'] || '';
		var xml_list = [];
            	var char_list = [];
            	if('xml_list' in ref_dict){
                	xml_list = ref_dict['xml_list'] || [];
            	}
            	if('c' in ref_dict){
                	char_list	= ref_dict['c'];
            	}
		var bg="rgba(243, 230, 88, 0.3)";
		if(ref_dict.hasOwnProperty('bg'))
			bg = ref_dict['bg'];
                var border="2px solid #F44336";
		if(ref_dict.hasOwnProperty('border'))
			border = ref_dict['border'];
		var iframe_dom = document.querySelector('#'+iframe_id)
                var frame_window = iframe_dom.contentWindow;
                if(clear_flag){
                    obj.clearTableHighlight(iframe_id);
                }
                var d = 0;
            	var bbox    = {'x': '', 'y': '', 'x2': 0, 'y2': 0};
            	frame_window.document.documentElement.scrollTop = 0;
            	frame_window.document.documentElement.scrollLeft = 0;
                frame_window.scrollTo(0,0)
		xml_list.forEach(function(v, xml_idx){
		   if(config['html_type'] == 'pdf'){
                    	dom = frame_window.document.querySelector('[id="'+v+'"]');
                        if(!dom)
                    	     dom = frame_window.document.querySelector('[customindex="'+v+'"]');
                   }else{
                    	dom = frame_window.document.querySelector('text[customindex="'+v+'"]');
                   }
		   if(!dom){
		       var n_id   = v.split('#').filter(function(t){return (t != '');});
		       for(var a=0; a<n_id.length; a++){
		    	    var x_id_is =n_id[a];
		    	    if(config['html_type'] == 'pdf'){
                            	dom = frame_window.document.querySelector('[id*="'+x_id_is+'"]');
				if(!dom)
				     dom = frame_window.document.querySelector('[customindex="'+v+'"]');
                   	    }else{
                            	dom = frame_window.document.querySelector('text[customindex="'+x_id_is+'"]');
                   	    }
		    	    if(!dom)
		    		continue
		    	    var rect    = dom.parentElement.getBoundingClientRect();
		    	    bbox['x']   = bbox['x'] === ''?rect.x:Math.min(rect.x, bbox['x']);
		    	    bbox['y']   = bbox['y'] === ''?rect.y:Math.min(rect.y, bbox['y']);
		    	    bbox['x2']  = Math.max(rect.right, bbox['x2']);
		    	    bbox['y2']  = Math.max(rect.bottom, bbox['y2']);
		       }
		   }else{
		        var rect    = dom.parentElement.getBoundingClientRect();
			tmpbbox	= angular.copy(bbox)
			var update	= 0
		        if(char_list.length && char_list[xml_idx]){
		    	    var range    = iframe_dom.contentWindow.document.createRange();
                    	    var sel      = iframe_dom.contentWindow.getSelection();
		    	    var elm_len = dom.firstChild.length; 
		    	    char_arr = char_list;
		    	    var char_val = char_arr[xml_idx].split('_');
                            if(dom.firstChild.length < char_val[1]){
                                  char_val[1] = dom.firstChild.length;
                            }
		    	    if((((char_val[0] != '') && (char_val[1] != '')) && ((parseInt(char_val[0]) < parseInt(char_val[1])) && (parseInt(char_val[1]) <= dom.firstChild.length))) && (char_arr[xml_idx] != undefined)){
		    		s   = char_val[0];
		    		e   = char_val[1];
		    	    }else{
		    		s   = 0;
		    		e   = dom.firstChild.length;
		    	    }	
		    	   range.setStart(dom.firstChild,parseInt(s));
		    	   range.setEnd(dom.firstChild, parseInt(e));
		    	   sel.removeAllRanges();
		    	   if (range.getBoundingClientRect) {
		    		var get_client_rect = range.getClientRects();
		    		var get_keys_gcr    =  Object.keys(get_client_rect);
		    		for(var rect_k=0, l=get_keys_gcr.length;rect_k<l;rect_k++){
		    		    var rect   = get_client_rect[get_keys_gcr[rect_k]];
					tmpbbox['x']   = tmpbbox['x'] === ''?rect.x:Math.min(rect.x, tmpbbox['x']);
					tmpbbox['y']   = tmpbbox['y'] === ''?rect.y:Math.min(rect.y, tmpbbox['y']);
					tmpbbox['x2']  = Math.max(rect.right, tmpbbox['x2']);
					tmpbbox['y2']  = Math.max(rect.bottom, tmpbbox['y2']);
		    		    /*bbox['x2'] = rect.right - rect.left;
		    		    bbox['y2'] = rect.bottom - rect.top;
		    		    bbox['x']  = rect.left+frame_window.document.documentElement.scrollLeft;
		    		    bbox['y']  = rect.top+frame_window.document.documentElement.scrollTop;*/
		    		}
		    	   }
		        }
			if(update == 0){
				tmpbbox['x']   = tmpbbox['x'] === ''?rect.x:Math.min(rect.x, tmpbbox['x']);
				tmpbbox['y']   = tmpbbox['y'] === ''?rect.y:Math.min(rect.y, tmpbbox['y']);
				tmpbbox['x2']  = Math.max(rect.right, tmpbbox['x2']);
				tmpbbox['y2']  = Math.max(rect.bottom, tmpbbox['y2']);
			}
			bbox	= tmpbbox
			
				
		    }
		});
		var dom = frame_window.document.createElement("div");
		dom.setAttribute('class', 'div_bbox');
              	dom.setAttribute('onclick','this.parentNode.removeChild(this)');
              	 
		var top1    = (bbox['y']+frame_window.document.documentElement.scrollTop);
		var left1   = (bbox['x'] + frame_window.document.documentElement.scrollLeft);
  		var width1  = (bbox['x2'] - bbox['x']);
		var height1 = (bbox['y2'] - bbox['y']);
		//console.log(top1,left1,width1,height1)
		//dom.style   = "position:absolute;top:"+top1+"px;left:"+left1+"px;width:"+width1+"px;height:"+height1+"px;background:rgba(243, 230, 88, 0.3);z-index:1000;border:2px solid #F44336;";
		dom.style   = "position:absolute;top:"+top1+"px;left:"+left1+"px;width:"+width1+"px;height:"+height1+"px;background:"+bg+";z-index:999;border:"+border+";";
		frame_window.document.body.appendChild(dom);
		var w_width = frame_window.document.documentElement.clientWidth;
		var sleft   = 0;
		if((left1+width1) > w_width){
		    sleft   = (left1 - w_width)+width1+30;
		}
		frame_window.scrollTo(sleft, ((top1+height1) - 150));
        }

        obj.clearPdfHighlight = function(iframe_id){
                clear_highlightsbbox(iframe_id);
        }

        obj.pdfHighlight = function(config, bbox, info, class_name, clear_flag, bg='', border='', pno = 1){
		var iframe_id = config['id'];
		var path = config['path'];
                var iframe_dom = document.querySelector('#'+iframe_id)
                if(!iframe_dom)
                        return;
                var doc_path = iframe_dom.getAttribute('src') || '';
                if(doc_path)
                        doc_path = doc_path.split('#')[0];
                //var temp = '/pdf_canvas/viewer.html?file='+path;
                var temp = path;
            if(doc_path != temp){
                 //temp = temp+"#disableAutoFetch=true&disableStream=true&zoom=100";
                 window.highlight_pdf = function(id){
                        $timeout(function(){
                                highlightsbbox_withclass(iframe_id, bbox, info, class_name, clear_flag, bg, border, pno);
                        });
                 }
                 iframe_dom.setAttribute('src', temp);
            }else{
                highlightsbbox_withclass(iframe_id, bbox, info, class_name, clear_flag, bg, border, pno);
            }
        }

        obj.zoom = function (iframe_id, html_type, inc_dec){
               if (inc_dec == undefined)
                   inc_dec = 1;
               if ((inc_dec == 2) && ((curr_zoom_factor == 0)))
                   return;
               var iframe_dom = document.querySelector('#'+iframe_id);
               var frame_window = iframe_dom.contentWindow;
               var p = [];
               if(html_type == 'id'){
                    p = frame_window.document.querySelectorAll('span');
               }else if(html_type == 'customindex'){
                    p = frame_window.document.querySelectorAll('TEXT');
               }
               var zoom_val = 1.5;   
               if (inc_dec == -1){
                   zoom_val = (1/1.5);
                   curr_zoom_factor -= 1;   
               }else if (inc_dec != 2)
                   curr_zoom_factor += 1;   
               if (inc_dec == 2){                                 //To original font size
                   zoom_val = (1/Math.pow(1.5, curr_zoom_factor));
                   curr_zoom_factor = 0;
               }
               angular.forEach(p, function(val, idx) {
                   var temp = window.getComputedStyle(val).fontSize;
                   var fs   = parseFloat(temp.slice(0, temp.length-2));
                   val.style.fontSize = (fs*zoom_val)+"px";
               });
        }

        return obj;
}); 

app.factory('refAlert', function() {
        var obj = {};
        obj.show = function(text, status, time){
                var dom_text = document.querySelector('#rmc_alert_section #rmc_alert_box .rmc_alert_text');
                dom_text.innerHTML = text;
                var dom_box = document.querySelector('#rmc_alert_section #rmc_alert_box');
                dom_box.setAttribute('class', status);
                var dom = document.querySelector('#rmc_alert_section');
                dom.style.display =  'block';
                if(time != '' && time != undefined && !isNaN(Number(time))){
                        time = Number(time);
                        setTimeout(function(){dom.style.display = 'none'}, time);
                }
        }
        obj.hide = function(){
                var dom = document.querySelector('#rmc_alert_section');
                dom.style.display =  'none';
        }
        return obj;
});

