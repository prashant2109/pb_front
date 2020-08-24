var app = angular.module("tas.modulesInfo", [])
app.controller("modules_info", function($scope,  $rootScope, $http, $timeout, $location, $filter, $sce, tasAlert, tasService){
        $scope.Object = Object
        $scope.config.scope = $scope;
        $scope.font_list = font_list;
	$scope.side_menu_active = true;
        /***********************************/
         window.scope_vars = $scope
	/***********************************/
	$scope.do_resize = function(){
        	$timeout(function(){
                	window.dispatchEvent(new Event('resize'));
        	});
    	}
	/***********************************/
         $scope.modules = {'c_dict':{'root':[]}, 'p_dict':{},'data':{}, 'root':[]
            }
	/***********************************/
        window.allowDrop = function(ev) {
            ev.preventDefault();
        }
	/***********************************/
	$scope.logout_func = function(){
		window.location.href = "/login";
	}
	/***********************************/ 
         $scope.sel_dicts ={}
         $scope.s_data ={}
         $scope.inside_var= 0
         window.drag = function(ev, data){
              $scope.$apply(function(){
                $scope.dag_data_right = false
                $scope.inside_var= 1
                $scope.sel_attribute = ev.target.getAttribute('m_id')
              });
         }
	/***********************************/
	$scope.side_menu_active = true;
	$scope.inp_m_fltr = '';
	$scope.m_list = [];
	$scope.module_map_idx_dic = {};
	$scope.cl_bk_init_func = function(res){
		$scope.config.parent_scope.ps = false;
		if(res['message']){
			if(res['message'] == 'done'){
				$scope.m_list = res['data'];
				$scope.m_list.forEach(function(r, i){
					$scope.module_map_idx_dic[r['k']] = i;
                                        $scope.sel_dicts[r['k']] = {'fa_icon':r['fi'], 'full_name': r['f_n'], 'k': r['k'], 'level_id': r['r_id'], 'n': r['n'], 'rid': r['r_id'], "submenu":[]}
				});
			}else{
				tasAlert.show(res['message'], 'error', 1000);
			}
		}
	}
	/***********************************/
	$scope.init_func = function(){
		var post_data = {'cmd_id': 25};
		$scope.config.parent_scope.ps = true;
		tasService.ajax_request(post_data, 'POST', $scope.cl_bk_init_func);
	}
	//$scope.init_func();
	$scope.sl_c_dic = {};
	/***********************************/
	$scope.checked_option = function(){
		if(!($scope.sl_c_dic['d_v'])){
			$scope.sl_c_dic['d_v'] = 'Y'
		}else{
			if($scope.sl_c_dic['d_v'] == 'Y')
				$scope.sl_c_dic['d_v'] = 'N'
			else
				$scope.sl_c_dic['d_v'] = 'Y'
		}
			
	}
	/***********************************/
	$scope.active_change_func = function(){
                if(!($scope.sl_c_dic['s'])){
                        $scope.sl_c_dic['s'] = 'N'
                }else{
                        if($scope.sl_c_dic['s'] == 'Y')
                                $scope.sl_c_dic['s'] = 'N'
                        else
                                $scope.sl_c_dic['s'] = 'Y'
                }

        }
	/***********************************/
	$scope.cl_bk_module_save_func = function(res){
		$scope.config.parent_scope.ps = false;
		if(res['message']){
			if(res['message'] == 'done'){
				$scope.init_func();
				$scope.sl_c_dic = {};
				$scope.module_edit_flg = false;
				tasAlert.show(res['message'], 'success', 1000);
			}else{
				tasAlert.show(res['message'], 'error', 1000);
			}
		}
	}
	/***********************************/
	$scope.module_save_func = function(){
		if(!(Object.keys($scope.sl_c_dic).length)){
			tasAlert.show('Nothing to save.', 'warning', 1000);
			return;
		}
		if(!($scope.sl_c_dic['n']) || $scope.sl_c_dic['n'] == ''){
			tasAlert.show('Please enter module name.', 'warning', 1000);
                        return;
		}
		if(!($scope.sl_c_dic['k']) || $scope.sl_c_dic['k'] == ''){
                        tasAlert.show('Please enter module key.', 'warning', 1000);
                        return;
                }
		if(!($scope.module_edit_flg) && $scope.sl_c_dic['k'] in $scope.module_map_idx_dic){
			tasAlert.show('Key already present in some other module, Please make it unique.', 'warning', 1000);
                        return;
		}
		var update_key = 'N';
		var txt = 'Are you sure you want to save new module?'
		if($scope.module_edit_flg){
			update_key = 'Y';
			txt = 'Are you sure you want to update?';
		}
		cflg    = confirm(txt);
                if(!cflg)
                	return;
		var post_data = {'cmd_id': 26, 'data': $scope.sl_c_dic, 'update': update_key, 'user': 'demo'};
                $scope.config.parent_scope.ps = true;
                tasService.ajax_request(post_data, 'POST', $scope.cl_bk_module_save_func);
        }
         /**********************************/
        $scope.sel_data_drop = {}
	$scope.module_edit_flg = false;
	$scope.module_click_func = function(m){
                $scope.sel_data_drop = m
		$scope.module_edit_flg = true;
		$scope.sl_c_dic = angular.copy(m);
	}
	/***********************************/
	$scope.s_tab = 'module';
	$scope.tab_change_func = function(k){
		$scope.s_tab = k;
		$scope.sl_c_dic = {};
		$scope.module_edit_flg = false;
		$scope.show_icon_flg = false;
		if($scope.s_tab == 'config'){
			$timeout(function(){
	                        $scope.load_tree()
                                
			}, 100);
		}else{
		}
	}
	/***********************************/
	$scope.new_module_func = function(){
		$scope.sl_c_dic = {};
		$scope.module_edit_flg = false;
	}
	/***********************************/
	$scope.show_icon_flg = false;
	$scope.show_all_icons_func = function(){
		$scope.show_icon_flg = !$scope.show_icon_flg;
	}
	/***********************************/
	$scope.cls_fnt_pop_func = function(){
		$scope.show_icon_flg = false;
	}
	/***********************************/
	$scope.slct_font_func = function(i){
		$scope.sl_c_dic['fi'] = i;
	}
	/***********************************/
	$scope.icon_filter = '';
	/***********************************/
         $scope.data_vv = ''
         $scope.drag_leave = function(){
              $scope.$apply(function(){
              var cols = document.querySelectorAll('#drop_div_id .a_ttribute');
              [].forEach.call(cols, function (col) {
                        col.classList.remove('over');  
                });
              });
         }
	/***********************************/
         window.dragEnter = function(ev){
                $scope.$apply(function(){
                    $scope.data_vv =  ev.target.getAttribute('m_id')||''
                })
         }

         /***********************************/
         $scope.parent_data = ''
         $scope.check_parent = function(from_key, to_key){
                var parent_data_to = $scope.modules['p_dict'][to_key] 
                
                if (to_key == 'root'){
                   return 0
        
                }else if (from_key == parent_data_to){
                   tasAlert.show('Move not applicable', 'warning', 1000); 
                   return 1
                }else {$scope.check_parent(from_key, parent_data_to)}
             
               
         }
         /***********************************/
         $scope.first_sum_men_list  = ''
         $scope.parant_nodes = ''
         $scope.all_left_side_data ={}
         window.drop_node_data = function(ev, level){
           
            $scope.drag_leave()
            ev.preventDefault();
            ev.stopPropagation()
             
            var data_val = ev.target.getAttribute('m_id')

            var from_key 		= $scope.sel_attribute;
            var to_key 			= data_val;
            if (from_key == to_key){
                return
            }
            res = $scope.check_parent(from_key, to_key)
            if (res ==1){return}
            var from_parent 		= $scope.modules['p_dict'][from_key];
            var to_parent 		= $scope.modules['p_dict'][to_key];
            var toc_child               = $scope.modules['c_dict'][to_key] ||[]
            var from_parent_child 	= $scope.modules['c_dict'][from_parent] || [];
            var to_parent_child 	= $scope.modules['c_dict'][to_parent] || [];
            var ctrl_ev = ev.ctrlKey
            if (ctrl_ev == true){ 
                var index = to_parent_child.indexOf(to_key)+1
            	to_parent_child.splice(index, 0, from_key)
                $scope.modules['p_dict'][from_key] = to_parent
            }else{
		    toc_child.push(from_key)
                    $scope.modules['p_dict'][from_key] = to_key	
            }
            if  ($scope.dag_data_right == false){
                 $scope.modules['data'][from_key] = $scope.sel_dicts[from_key]
                
            }else{
                    var index_of = from_parent_child.indexOf(from_key)
                    from_parent_child.splice(index_of, 1)
            }
            $scope.modules['c_dict'][from_parent] = from_parent_child
            $scope.modules['c_dict'][to_parent]   = to_parent_child
            $scope.modules['c_dict'][to_key]      = toc_child
            $scope.$apply()
            $scope.handle_drag_fun()
         }
         /***********************************/
         $scope.dag_data_right = false
         $scope.rearr_data = ''
         window.drag_left_data  = function(ev){
                $scope.$apply(function(){
                $scope.dag_data_right = true
                $scope.sel_attribute = ev.target.getAttribute('m_id')
              });
       
         }
         /***********************************/
         
        window.drop_data = function(ev){
            $scope.drag_leave()
            ev.preventDefault();
            ev.stopPropagation()
            var event_val = ev.ctrlKey
            if ($scope.dag_data_right == true){return}
            if (!($scope.sel_attribute in $scope.modules.data)){
                  $scope.$apply(function(){
                       var sel_data = $scope.sel_dicts[$scope.sel_attribute];
                       $scope.modules.data[$scope.sel_attribute] = sel_data;
                       $scope.all_left_side_data[$scope.sel_attribute]  = 'Y';
                       $scope.modules.c_dict[$scope.sel_attribute] = [];
		       if(!('root' in $scope.modules.c_dict))
                                $scope.modules.c_dict['root'] = [];
                       $scope.modules.c_dict['root'].push($scope.sel_attribute);
                       $scope.modules.p_dict[$scope.sel_attribute] = 'root';
                 });
            }
            $scope.handle_drag_fun()
        }                                       
        /***********************************/
         $scope.cl_bk_module_to_save = function(res){
                $scope.config.parent_scope.ps = false;
                if (res["message"] == 'done'){
                    tasAlert.show(res['message'], 'success', 1000);
                }else{
                    tasAlert.show(res['message'], 'error', 1000);
                }
 
         }
        /***********************************/
         $scope.data_dict_tree = []
         $scope.tree_save_func = function(){
                  $scope.data_dict_tree = []
                  for (data in $scope.modules['c_dict']){
                         var arr_val = $scope.modules['c_dict'][data]
                         for (data_val in $scope.modules['c_dict'][data]){
                             var key_data = $scope.modules['c_dict'][data][data_val]
                             var sdicts ={}
                             var rid =  $scope.modules['data'][key_data]['rid']
                             if (data == 'root'){
                                var p_id = -1
                             }else{ var p_id =  $scope.modules['data'][data]['rid']}
                             var index_dat = arr_val.indexOf(key_data)
                             sdicts['id']=  rid
                             sdicts['p_id'] = p_id
                             sdicts['index'] = index_dat
                             $scope.data_dict_tree.push(sdicts)
                              }
                         }
                  var post_data = {'cmd_id': 31, 'data': $scope.data_dict_tree};
                  $scope.config.parent_scope.ps = true;
                  tasService.ajax_request(post_data, 'POST', $scope.cl_bk_module_to_save);
 
        }
	/***********************************/
        $scope.cl_bk_tree_data = function(res){
		$scope.config.parent_scope.ps = false;
               if (res["message"] == 'done'){
                 $scope.modules.data   = res['data']
                 $scope.modules.c_dict = res['c_dict']
                 $scope.modules.p_dict = res['p_dict']
               }
             $scope.handle_drag_fun()
        }
	/***********************************/
        $scope.load_tree = function(){
               var post_data = {'cmd_id': 32};
		$scope.config.parent_scope.ps = true;
               tasService.ajax_request(post_data, 'POST', $scope.cl_bk_tree_data);
        }
	/***********************************/
         
	/***********************************/
         $scope.remove_child_nodes = function(data, parent_nodes){
                 $scope.modules['p_dict'][data] = ''
                 var lists_data_patent = $scope.modules['c_dict'][parent_nodes] 
                 var index = lists_data_patent.indexOf(data)
                 lists_data_patent.splice(index, 1)
                 $scope.modules['c_dict'][parent_nodes] = lists_data_patent
                 delete $scope.modules['data'][data]
                 var child_nodes = angular.copy($scope.modules['c_dict'][data]  || []);
                 for (data1 in child_nodes){
                         var data_to_rem = child_nodes[data1]
                         var parent_nodes = $scope.modules['p_dict'][data_to_rem]
                         var ch_nod = $scope.modules['c_dict'][data_to_rem] || []
                         $scope.remove_child_nodes(data_to_rem, parent_nodes, ch_nod)
              }
         }
	/***********************************/
         window.remove_selected_nodes = function(){
                $scope.$apply(function(){
                       var parent_nodes = $scope.modules['p_dict'][$scope.sel_attribute]
                       var child_nodes = $scope.modules['c_dict'][$scope.sel_attribute]
                       $scope.remove_child_nodes($scope.sel_attribute, parent_nodes)
                })
        }
	/***********************************/
         $scope.active_data = false
         window.delete_seleted_node = function(ev){
                $scope.$apply(function(){
                       var node_id = $(ev.target).closest('div').attr('id')
                       if (node_id == 'del_node_data'){
                          $scope.active_data = true
                       }else{$scope.active_data = false}
                })
         }
	/***********************************/
         window.remove_highlight = function(){
                $scope.$apply(function(){
                   $scope.active_data = false
                });
                $scope.handle_drag_fun()
         }
	/***********************************/
         $scope.handle_drag_fun = function(){
               var cols  = document.querySelectorAll('#drg_sec .clgbbi_handle_act');
                [].forEach.call(cols, function(col) {
                      var kay_data = col.getAttribute('m_id')
                      if ( $scope.modules.data[kay_data] != undefined){
                               col.removeAttribute('draggable');
                         }
                      else{  col.setAttribute('draggable', 'true')}
                })

        } 
	/***********************************/

});
app.directive('moduleInfo', function(){
                 return {
                   restrict: 'AE',
                   template:`			
			<div class="mod_inf">
			    <div class="ts_box_menu app-sidebar">
					<div class="app-sidebar__inner">
				    <ul class="vertical-nav-menu metismenu">
					<li class="app-sidebar__heading">List of Modules <span ng-if="m_list.length">({{m_list.length}})</span></li>
						</ul>
						<div class="inpt_src_sec"><input type="text" class="form-control sl_cip" ng-model="inp_m_fltr" style="width: 100%;" placeholder="Search Module"></div>
						<ul class="vertical-nav-menu metismenu" style="overflow: auto;height: calc(100% - 90px);" id="drg_sec">
					<li class="mtr_card__list_group_item waves-effect" ng-repeat="m in m_list | filter: inp_m_fltr" ng-click="module_click_func(m)" ng-class="{active: sl_c_dic['k'] == m['k'] }">
							<div class="mtr_card__indicator" ng-class="{'bg-success':  modules.data[m['k']]}"></div>
							<div class="mtr_card__widget_content" ng-class="{clgbbi_handle_act: s_tab == 'config'}" draggable="true" ondragstart="drag(event)" m_id="{{m['k']}}">
								<i class="fa {{m['fi']}} metismenu-icon" aria-hidden="true"></i>
								<div class="mtr_card__widget_heading" ng-bind-html="m['n']" title="{{m['n']}}"></div>
								<div class="mtr_card__widget_subheading" ng-bind-html="m['f_n']" title="{{m['f_n']}}"></div>
								<div class="clgbbi" ng-if="m['d_v'] == 'Y'" title="Doc View"><i class="fa fa-file-text-o" aria-hidden="true"></i></div>
							</div>
							<!--	<div class="clgbbi_handle" ng-if="s_tab == 'config'">:::</div>-->
						    </li>
				    </ul>	
					</div>
				</div>
				<div class="mtr_main">
					<div class="mtr_card mtr_main__sb_sec">
						<div class="mtr_card__header" style="height: 40px;">
							 <div class="mtr_card__tab_f">
								<div class="mtr_card__tab" ng-class="{active: s_tab == 'module'}" ng-click="tab_change_func('module')">Module</div>
								<div class="mtr_card__tab" ng-class="{active: s_tab == 'config'}" ng-click="tab_change_func('config')">Configuration</div>
							 </div>	
							 <div class="btn btn-success btn-sm pull-right menu_sec_btn waves-effect" ng-click="module_save_func()" ng-if="s_tab == 'module'">Save</div>
							 <div class="btn btn-sm pull-right btn_nrml_sec waves-effect" ng-click="new_module_func()" ng-if="s_tab == 'module'" ng-class="{active_k: !module_edit_flg}">New Module</div>
					 <div class="btn btn-success btn-sm pull-right menu_sec_btn waves-effect" ng-click="tree_save_func()" ng-if="s_tab == 'config'">Save</div>
							 <div class="btn btn-sm pull-right btn_del_sec waves-effect" ng-click="tree_del_func()" ng-if="s_tab == 'config'" ondragenter="delete_seleted_node(event)"  ondrop="remove_selected_nodes()"  ondragover="allowDrop(event)"   onmouseleave="remove_highlight()" id="del_node_data" ng-class="{'highlight': active_data == true}"><i class="fa fa-trash-o" aria-hidden="true"></i>
							 </div>
						</div>
						<div class="mtr_card__body" ng-if="s_tab == 'module'">
							<div class="clg_p">
								<div class="clgh_p">Module Information</div>
								<div class="clgb_p">
									<div class="clgbb_p">
										<code class="clgbbn_p">Name</code>
										<div class="clgbbt_p">
											<input type="text" ng-model="sl_c_dic['n']" placeholder="Name" class="form-control sl_cip" ng-class="{disabled: edit_c_flg}">
										</div>
									</div>
									<div class="clgbb_p">
										<code class="clgbbn_p">Full Name</code>
										<div class="clgbbt_p">
											<input type="text" ng-model="sl_c_dic['f_n']" placeholder="Full Name" class="form-control sl_cip">
										</div>
									</div>
									<div class="clgbb_p">
										<code class="clgbbn_p">Key</code>
										<div class="clgbbt_p">
											<input type="text" ng-model="sl_c_dic['k']" placeholder="Key" class="form-control sl_cip" ng-class="{disabled: module_edit_flg}">
										</div>
									</div>
									<div class="clgbb_p">
										<code class="clgbbn_p">Icon
										<span class="pull-right fnt_icn_srch waves-effect" ng-click="show_all_icons_func()" title="Search Icons in List"><i class="fa fa-search" aria-hidden="true"></i></span>
										</code>
										<div class="clgbbt_p">
											<input type="text" ng-model="sl_c_dic['fi']" placeholder="Icon" class="form-control sl_cip">
										</div>
									</div>
									 <div class="clgbb_p">
										<code class="clgbbn_p">Doc View</code>
										<div class="clgbbt_p">
											<div class="demo_check" ng-class="{'active': sl_c_dic['d_v']== 'Y'}" ng-click="checked_option()"></div>										    
										</div>
									</div>
									<div class="clgbb_p" ng-if="module_edit_flg">
										<code class="clgbbn_p">Status</code>
										<div class="clgbbt_p">
											<div class="clgbbi_p" ng-class="{'in_act': sl_c_dic['s'] == 'N'}" ng-click="active_change_func()"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="fnt_icn_list" ng-if="show_icon_flg">
							<div class="fnt_icn_list_hdr">
								<div class="mtr_card__title">Icons :</div>
								<input type="text" class="form-control filter_input" placeholder="Search Icons" ng-model="icon_filter">	
								<div class="fnt_icn_list_cls pull-right waves-effect" ng-click="cls_fnt_pop_func()">&times;</div>	
							</div>
							<div class="fnt_icn_list_btm">
								<div class="fnt_icns waves-effect" ng-repeat="icn in font_list | filter:icon_filter track by $index" ng-click="slct_font_func(icn)" ng-class="{active: sl_c_dic['fi'] == icn}">
									<div class="fnt_icn_bx">
										 <i class="fa {{icn}} metismenu-icon" aria-hidden="true"></i>
									</div>
									<div class="fnt_icn_txt">
											{{icn}}
									</div>
								</div>	
							</div>	
						</div>
					<div class="mtr_card__body" ng-if="s_tab == 'config'" style="min-height: calc(100% - 40px);" >
					<div class="clg_p">
					    <div class="clgh_p">Menu Configuration</div>
					    <div class="clgb_p menu-config" drop="true" style="min-height: calc(100% - 50px);" id="drop_div_id" ondrop="drop_data(event)" ondragover="allowDrop(event)">
						<div class="app-sidebar__inner1">
									<ul class="vertical-nav-menu metismenu" id="dragable_data" >
										<ng-include src="'modules_template_innr.html'" ng-repeat="key in modules['c_dict']['root'] track by $index"></ng-include>
									</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

<script type="text/ng-template" id="modules_template_innr.html" >
	<li class="mm-active waves-effect" style="clear:both"  m_id="{{modules['data'][key]['k']}}" >
	<div class="d-inline pull-left ch_new_cnt">
		<div class="demo_check" ng-class="{'active': menu_showing[modules['data'][key]['k']] == 'Y'}" ng-show="editorOption"></div>
	</div>
	<a href="#" class="a_ttribute" aria-expanded="true"  draggable= "true"  ng-class="{ 'over':  modules['data'][key]['k'] == data_vv && data_vv != '', 'active': side_menu_slcted_flg == modules['data'][key]['k'],'opc_n': (menu_showing[modules['data'][key]['k']] == 'N' && !editorOption), 'opc_n_e': editorOption, 'active': sel_attribute == modules['data'][key]['k']}" title="{{modules['data'][key]['n']}}" ondrop = "drop_node_data(event)" ondragover="allowDrop(event)"    m_id ="{{modules['data'][key]['k']}}"   ondragenter="dragEnter(event)" ondragstart="drag_left_data(event)" >
	<i class="fa {{modules['data'][key]['fa_icon']}} metismenu-icon" aria-hidden="true"></i>
	{{modules['data'][key]['n']}}	
	</a>
		<ul class="mm-collapse mm-show" ng-class="{'chbxadded': editorOption == true}"  ng-if="modules['c_dict'][key].length" >
                	<ng-include src="'modules_template_innr.html'" ng-repeat="key in modules['c_dict'][key] track by $index"></ng-include>
		</ul>
	</li>
</script>
<style>
			module-info {width: 100%;height: 100%;float:left;}
                       .mod_inf {width:100%; height:100%; position: relative;}
                       .mod_inf .mtr_main{background: #f1f4f6;height: calc(100% - 0px);width: calc(100% - 420px);position: relative;flex: 1;flex-direction: column;display: flex;overflow: auto; float:right;}
                       .mod_inf .mtr_main .mtr_main__inner {padding: 20px 20px 0;flex: 1;}
                       .mod_inf .mtr_card {position: relative;display: flex;flex-direction: column;min-width: 0;word-wrap: break-word;background-color: #fff;background-clip: border-box;border: 1px solid rgba(26,54,126,0.125);border-radius: .25rem;box-shadow: 0 0.4rem 2rem rgba(4,9,20,0.03), 0 0.9rem 0.40625rem rgba(4,9,20,0.03), 0 0.2rem 0.5rem rgba(4,9,20,0.05), 0 0.125rem 0.1em rgba(4,9,20,0.03);border-width: 0;transition: all .2s;    /*min-height: calc(100% - 20px);*/}
                       .mod_inf .mtr_card .mtr_card__header {background-color: rgba(0,0,0,.03);border-bottom: 1px solid #dfdfdf;height: 35px;}
                       .mod_inf .mtr_card .mtr_card__body {display: flex;min-height: 100px;}
                       .mod_inf .mtr_card .mtr_card__header .mtr_card__title,.mod_inf  .mtr_card__title{line-height: 35px;padding-left: 10px;font-size: 14px;color: #3F51B5;font-weight: bold;float: left;}
                       .mod_inf .mtr_card .mtr_card__header .mtr_card__sub_title{line-height: 35px;padding-left: 10px;font-size: 13px;color: #8e8787;font-weight: bold;float: left;}
                       .mod_inf .mtr_card__doc_left{width: 500px; max-height:100%;background-color: #fff;border-right: 1px solid #dfdfdf;float:left;height:auto;}
                       .mod_inf .mtr_card__doc_right{width: calc(100% - 500px); height:auto;float: left;} 
                       .mod_inf .mtr_card__indicator{position: absolute;width: 4px;height: 40px;border-radius: .3rem;left: 10px;top: 15px;opacity: .6;transition: opacity .2s;background: #d1d1d1;}
                       .mod_inf .mtr_card__doc_left_inner{padding: .5rem!important;overflow: auto;width: 100%; height: 400px;}
                       .mod_inf .mtr_card__list_group{display: -ms-flexbox;display: flex;-ms-flex-direction: column;flex-direction: column;padding-left: 0;margin-bottom: 0;}
                       .mod_inf .mtr_card__list_group_item {position: relative;display: block;background-color: #fff;border-bottom: 1px solid #dfdfdf;height: 70px;padding: 10px 10px 10px 25px;border-right: 0;border-left: 0;border-radius: 0;-webkit-border-bottom-left-radius: .125rem;border-bottom-left-radius: .125rem;-webkit-border-bottom-right-radius: .125rem;border-bottom-right-radius: .125rem;}
                       .mod_inf .mtr_card__list_group_item.active{background-color: #dae8f1;}
                       .mod_inf .mtr_card__list_group_item:first-child {border-top: 0;}
                       .mod_inf .mtr_card__list_group_item:last-child {border-bottom: 0;}
                       .mod_inf .mtr_card__widget_heading {opacity: .8;font-weight: bold;line-height: 1.5;color: #343a40;white-space: nowrap;-ms-text-overflow: ellipsis;-o-text-overflow: ellipsis;text-overflow: ellipsis;overflow:hidden;font-size: 13px;width: calc(100% - 78px);float:left;}
                       .mod_inf .mtr_card__widget_subheading {margin-top: 10px;position: relative;white-space: nowrap;-ms-text-overflow: ellipsis;-o-text-overflow: ellipsis;text-overflow: ellipsis;overflow: hidden;font-size: 12px;opacity: 0.5;font-style: italic;width: calc(100% - 75px);float:left;}
                       .mod_inf .mtr_card__widget_sn{float:left;height: 100%;width: 25px;line-height: 40px;font-weight: bold;color: #8e8787; opacity:.5;}
                       .mod_inf .mtr_card__widget_content{float: left;width: 100%;height: 100%;position: relative;}
                       .mod_inf .mtr_card__widget_desc{float:left;height: 100%; width: calc(100% - 25px);position: relative;}
                       .mod_inf .mtr_card__doc_right_top{float: left;width: 100%;height: 70px;border-bottom: 1px solid #dfdfdf;}
                       .mod_inf .mtr_card__doc_right_btm{height: calc(100% - 70px);position: relative;width: 100%;float: left;padding: 10px 10px;overflow: hidden;}
                       .mod_inf .progress {height: 10px;position: relative;transition: width 0.6s ease;}
                       /*.mod_inf .ts_box_menu{width: 420px;display: flex;overflow: hidden;min-width: 280px;flex: 0 0 280px;transition: all .2s;position: fixed;height: 100vh;box-shadow: 7px 0 60px rgba(0,0,0,0.05);background: #fff;}*/
                       .mod_inf .ts_box_menu{width: 420px;float: left;overflow: hidden;transition: all .2s;height: 100%;box-shadow: 7px 0 60px rgba(0,0,0,0.05);background: #fff;}
                       .mod_inf .app-sidebar .app-sidebar__inner {padding: 2px 15px 20px;z-index: 15;width: 100%;height: 100%;}
                       .mod_inf .vertical-nav-menu {margin: 0;padding: 0;position: relative;list-style: none;float: left;width: calc(100%);}
                       .mod_inf .app-sidebar__heading {font-size: .8rem;margin: .75rem 0;font-weight: bold;color: #3f6ad8;white-space: nowrap;position: relative;}
                       .mod_inf .vertical-nav-menu li a {display: block;line-height: 2.4rem;height: 2.4rem;padding: 0 10px 0 45px;position: relative;border-radius: .25rem;color: #343a40;white-space: nowrap;transition: all .2s;margin: .1rem 0;white-space: nowrap;-ms-text-overflow: ellipsis;-o-text-overflow: ellipsis;text-overflow: ellipsis;overflow: hidden;}
                       .mod_inf .vertical-nav-menu li a:hover{background: #dae8f1;}
                       .mod_inf .vertical-nav-menu li a.active{font-weight: bold;background: #dae8f1;}
                       .mod_inf .vertical-nav-menu i.metismenu-state-icon, .mod_inf  .vertical-nav-menu i.metismenu-icon {text-align: center;width: 34px;height: 50px;line-height: 50px;position: relative;font-size: 1.5rem;opacity: .3;transition: color 300ms;float: left;margin-right: 15px;}
		       .mod_inf .mtr_card__widget_heading a{color: #495057;}
		       .mod_inf	.mtr_card__widget_heading a:hover{color: ##007bff;}
		       .mod_inf .vertical-nav-menu ul:before {content: '';height: 100%;opacity: 1;width: 3px;background: #e0f3ff;position: absolute;left: 20px;top: 0;border-radius: 15px;}
                       .mod_inf .vertical-nav-menu ul {margin: 0;padding: 0;position: relative;list-style: none;}
		       .mod_inf .vertical-nav-menu ul {transition: padding 300ms;padding: .5em 0 0 2rem;}
		       .mod_inf .vertical-nav-menu ul>li>a {color: #6c757d;height: 2rem;line-height: 2rem;padding: 0 1rem 0;}
		       .mod_inf .vertical-nav-menu ul>li>a.mm-active {color: #3f6ad8;background: #dae8f1;font-weight: bold;}
		       .mod_inf .vertical-nav-menu ul {transition: padding 300ms;padding: .5em 0 0 2rem;}
		       .mod_inf .mtr_main__sb_sec{margin: 10px 10px;flex: 1;overflow: hidden;border-radius: .25rem;border: 1px solid rgba(26,54,126,0.125);}
		       .mod_inf .clgbbi {display: block;float: left;margin: 6px 0px;position: absolute;right: 5px;color: #3f6ad8;font-size: 16px;}
		       .mod_inf .inpt_src_sec{float: left;width: 100%;height: 50px;}
		       .mod_inf .clg_p{width: 100%;padding: 16px;float: left;max-height: 100%;overflow: auto;}
		       .mod_inf .clgh_p{margin: 0;padding: 0;margin-bottom: 16px;font-size: 19px;font-weight: 400;color: #3f6ad8;margin-top: 8px;margin-bottom: 16px;white-space: nowrap;overflow: hidden;}
		       .mod_inf .clgh_p:after {margin-left: 24px;content: '';display: inline-block;vertical-align: middle;width: 100%;height: 1px;background: linear-gradient(to right,rgba(116, 95, 181, 0.2),rgba(0, 0, 0, 0.05) 80%);}
		       .mod_inf .clgb_p{float: left;width: 100%;background: #fff;box-shadow: 0 6px 8px rgba(102,119,136,.03), 0 1px 2px rgba(102,119,136,.3);border-radius: 2px;border: 1px solid rgba(187, 187, 187, 0.35);overflow: hidden;overflow-x: auto;border-top: 0px;margin: 0;padding: 16px;}
		       .mod_inf .clgbbi_p {width: 12px;height: 12px;background: #77dab2;border-radius: 50%;margin: 0px 3px;margin-top: 14px;}
		       .mod_inf .clgbbi_p.in_act {background: #e97d75;}
		       .mod_inf .clgbb_p{width: 100%;float: left;line-height: 30px;overflow: hidden;display: flex;padding-right: 15px;margin-bottom: 6px;}
		       .mod_inf .clgbb_p.edit{margin-bottom: 10px;}
		       .mod_inf .clgbbn_p{float: left;line-height: 38px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;width: 200px;text-transform: capitalize;user-select: none;}
		       .mod_inf .clgbbt_p{color: #745fb5;text-decoration: none;display: block;white-space: nowrap;float: left;text-overflow: ellipsis;overflow: hidden;width: calc(100% - 100px);font-family: cousine,sfmono-regular,Consolas,Menlo,liberation mono,ubuntu mono,Courier,monospace;font-weight: bold;letter-spacing: .03em;}
		       .mod_inf .sl_cip{margin: 2px;width: calc(100% - 10px);padding: 2px 6px;height: 34px;font-size: 12px;}
		       .mod_inf .clgbbt_pfa{font-size: 16px;color: #745fb5;margin-left: 3px;cursor: pointer;width: 20px;line-height: 38px;}
		       .mod_inf code {font-family: cousine,sfmono-regular,Consolas,Menlo,liberation mono,ubuntu mono,Courier,monospace;letter-spacing: .03em;color: #345;font-size: 12px;}
		/**************checkbox Start******************************/
		       .mod_inf .demo_check:before{content:"\e83f";width:22px;height:22px;display:inline-block;border:2px solid #e9eaec;border-radius:3px;font-size:15px;font-family:feather;font-weight:400;line-height:12px;vertical-align:bottom;text-align:center;background:#fff;color:transparent;cursor:pointer;transition:all .2s ease-in-out;position:absolute;left:0;top:3px;z-index:1;opacity:0;content:"\\e840";font-size:15px;background:0;}
		       .mod_inf .demo_check{margin-top: 10px;min-height:auto;position:relative;width:20px;height:20px;}
		       .mod_inf .demo_check:after{content:"";width:14.5px;height:14.5px;display:inline-block;margin-right:10px;border:2px solid #c1c1c2;border-radius:2px;vertical-align:bottom;text-align:center;background:0;cursor:pointer;transition:all .2s ease-in-out;position:absolute;top:3px;left:3px;z-index:1;}
		       .mod_inf .demo_check.active:before{opacity:1;color:#33b5e5;background:0;border-color:transparent;}
		       .mod_inf .demo_check.active:after{opacity:0;}
		/***************checkbox end*****************************/
		       .mod_inf .form-control:focus {color: #495057;background-color: #fff;border-color: transparent;outline: 0;box-shadow: 0 0 0 0.1rem rgba(149, 180, 206, 0.6) !important; -webkit-box-shadow:  0 0 0 0.1rem rgba(149, 180, 206, 0.6) !important;}
		       .mod_inf .form-control.disabled, .form-control[readonly] {background-color: #e9ecef;opacity: 1;}
		       .mod_inf input:-internal-autofill-selected {background-color: #fff !important;background-image: none !important;color: rgb(0, 0, 0) !important;}
		       .mod_inf .menu_sec_btn {padding: 5px 15px !important;}
		       .mod_inf .mtr_card__tab_f{float:left; width: auto;}
		       .mod_inf .mtr_card__tab{float:left;padding: 0px 10px;line-height: 39px;-webkit-transition: all .2s ease-in-out;-o-transition: all .2s ease-in-out;transition: all .2s ease-in-out;}
		       .mod_inf .mtr_card__tab.active{background: #84a6c3 !important;font-size: 13px;box-shadow: 0px 0px 2px #8ca1ad;color: #fff !important;}
		       .mod_inf .btn_nrml_sec {color: #7ea0bc;border: 2px solid #b3c0c4;padding: 4px 15px !important;box-shadow: none;}
		       .mod_inf .btn_nrml_sec.active_k{color: #ffffff;background: #3f6ad8;border:2px solid #3553a2;}
		       .mod_inf .fnt_icn_srch{width: 23px;text-align: center;height: 23px;line-height: 21px;color: #171717;font-size: 11px;border-radius: 3px;margin-top: 8px;margin-right: 6px;border: 1px solid #80a2bf;background: #eef6fc;}
		       .mod_inf .fnt_icn_list{position: absolute;bottom: 0px;height: 50%;width: 100%;background: #fff;z-index: 8;box-shadow: 0px -3px 5px rgb(228, 228, 228);border-top: 1px solid #e5e5e5;}
		       .mod_inf .fnt_icn_list_hdr{background-color: rgba(0,0,0,.0);border-bottom: 1px solid #dfdfdf;width: 100%;height: 35px;float: left;}
		       .mod_inf .fnt_icn_list_btm{width: 100%;height: calc(100% - 35px);float: left;overflow: auto;}
		       .mod_inf .fnt_icn_list_cls{width: 35px;line-height: 35px;text-align: center;color: #F44336;font-size: 26px;border-left: 1px solid #dfdfdf;}
		       .mod_inf .fnt_icns{width: 100px;float: left;background-color: #fff;height: 100px;padding: 10px;border-right: 1px solid #dfdfdf;border-bottom: 1px solid #dfdfdf;text-align: center;font-size: 10px;cursor: pointer;}
		       .mod_inf .fnt_icn_bx{font-size: 30px;color: #343a40;}
		       .mod_inf .fnt_icn_txt{color: #797979;margin-top: 10px;}
		       .mod_inf .fnt_icns.active{background: #dae8f1;font-weight: 500;}
		       .mod_inf .fnt_icns.active .fnt_icn_bx{color:#3f6ad8;}
		       .mod_inf .filter_input{height:28px;padding:2px 12px;border-radius: 0px;margin-right:3px;font-size:13px;border-bottom:2px solid #eaeaea!important;border:0;margin:-2px 7px;}
		       .mod_inf .filter_input::placeholder{color:#bbd3e8;}
		       .mod_inf .filter_input:focus{box-shadow:none !important;border-bottom: 2px solid #95b4ce!important;}
		       .mod_inf .filter_input{width: 200px;margin-left: 20px;float: left;padding-left: 6px;margin-top: 2px;}
		       .mod_inf .clgbbi_handle{float: left;height: 100%;width: 20px;text-align: right;line-height: 49px;font-size: 16px;cursor: move;color: #6a6a6a;}
		       .mod_inf .clgbbi_handle_act {/*width: calc(100% - 20px);*/ cursor: move;}
		       .mod_inf  .mtr_card__list_group_item.over{border: 2px dashed #81a2bf;}
                       .mod_inf .menu-config  .app-sidebar__inner1{padding:2px 15px 300px;z-index:15;width:100%;overflow:auto;}
                       .mod_inf .menu-config .vertical-nav-menu{margin:0;padding:0;position:relative;list-style:none;}
                       .mod_inf .menu-config .app-sidebar__heading{font-size:.8rem;margin:.75rem 0;font-weight:bold;color:#3f6ad8;white-space:nowrap;position:relative;}
                       .mod_inf .menu-config .vertical-nav-menu li a{display:block;line-height:2.4rem;height:2.4rem;padding:0 10px 0 45px;position:relative;border-radius:.25rem;color:#343a40;white-space:nowrap;transition:all .2s;margin:.1rem 0;white-space:nowrap;-ms-text-overflow:ellipsis;-o-text-overflow:ellipsis;text-overflow:ellipsis;overflow:hidden;}
                       .mod_inf .menu-config .vertical-nav-menu li a.active{font-weight:bold;background:#dae8f1;}
                       .mod_inf .menu-config .vertical-nav-menu i.metismenu-state-icon,.mod_inf  .menu-config .vertical-nav-menu i.metismenu-icon{text-align:center;width:34px;height:34px;line-height:34px;position:absolute;left:5px;top:50%;margin-top:-17px;font-size:1.5rem;transition:color 300ms;opacity: 0.3;/*color:#6eacbd;*/}
                       .mod_inf .menu-config .vertical-nav-menu ul:before{content:'';height:100%;opacity:1;width:3px;background:#e0f3ff;position:absolute;left:20px;top:0;border-radius:15px;}
                       .mod_inf .menu-config .opc_n{opacity:0.5;pointer-events: none;cursor: pointer;}
                       .mod_inf .menu-config .opc_n_e{opacity:1;pointer-events: none;cursor: pointer;}
                       .mod_inf .menu-config .vertical-nav-menu ul.chbxadded:before{left:40px;}
                       .mod_inf .menu-config .vertical-nav-menu ul{margin:0;padding:0;position:relative;list-style:none;}
                       .mod_inf .menu-config .vertical-nav-menu ul{transition:padding 300ms;padding:.3rem 0 0 3rem;}
                       .mod_inf .menu-config .vertical-nav-menu ul.chbxadded{padding:0.5rem 0 0 4.3rem;}
                       .mod_inf .menu-config .vertical-nav-menu ul>li>a{color:#6c757d;height:2rem;line-height:2rem;padding:0 0.5rem 0;}
                       .mod_inf .menu-config .ch_new_cnt{padding-top: 8px;}
                       .mod_inf .menu-config .mtr_card__list_group_item.over{border: 2px dashed #81a2bf;}
                       .mod_inf .menu-config .mm-active.over{border: 2px dashed red}
                       .mod_inf .menu-config .mtr_card__widget_content.over{border: 2px dashed #81a2bf;}
                       .mod_inf .menu-config .a_ttribute{display:block;line-height:2.4rem;height:2.4rem;padding:0 10px 0 45px;position:relative;border-radius:.25rem;color:#343a40;white-space:nowrap;transition:all .2s;white-space:nowrap;-ms-text-overflow:ellipsis;-o-text-overflow:ellipsis;text-overflow:ellipsis;overflow:hidden; margin-top: 100px;margin-left:.1rem 0; margin-right:.1rem 0; margin-bottom:.1rem 0;}
                       .mod_inf .menu-config .a_ttribute.over{border: 2px dashed red !important}
                       .mod_inf .menu-config .a_ttribute.active{background-color:#dae8f1 !important; border: 2px solid #81a2bf;}
                       .mod_inf .menu-config .mtr_card__widget_content.clgbbi_handle_act.dis_able_drag{-webkit-user-drag: none;}
                       .mod_inf .btn_del_sec {color: white;border: 2px solid transparent;;padding: 3px 15px !important; background-color: #ff6961; opacity: 0.8;}
                       .mod_inf .btn_del_sec.highlight{border : 2px solid #81a2bf;}

<style>`,
                   controller: 'modules_info',
                   scope: {
                        'config': '='
                },
                link: function (scope, elm, attrs, controller) {
                },
       }
}); 
