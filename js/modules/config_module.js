"use strict";
var app = angular.module("tas.configuration",["ui.grid","tas.modulesInfo"]);
app.controller("Configuration",function($scope, $rootScope, $http, $timeout, $location, $filter, $sce, tasAlert, tasService){
	$scope.config.scope = $scope;
	$scope.ps = $scope.config.parent_scope.ps;
	$scope.modules = {parent_scope: $scope};
	/***********************************/
	$scope.tab_select = function(){
		$scope.tab_slt = "module";
		$timeout(function(){
			$scope.modules.scope.init_func();
		});
	}	
	/***********************************/
	$scope.pop_close = function(){
		$scope.config.parent_scope.cmp_edit = false;
		$scope.avcmp = false;
	}
	/***********************************/
	$scope.infield = false;
	$scope.show_input = function(){
		$scope.infield = !$scope.infield;
		$timeout(function(){document.querySelector("#cmp_fcus").focus();})
	}
	/***********************************/
	$scope.doc = {
		enableRowSelection: true,rowHeight:30, enableFiltering:true, noUnselect : false, enableSorting:false,
		showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false,
		enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false,
		columnDefs:[],
		onRegisterApi: function (gridApi) {
		    $scope.ApiDoc = gridApi;
		}
    	}
	/***********************************/
	var doc_check_1 ={
		field: '#',
                displayName: '#',
                width: 30,
		pinnedLeft: true,
                cellEditableCondition:false,
		'headerCellTemplate':`
			<div class="ui-grid-header-cell" style="padding: 0px; cursor: pointer;">
                        <div class="ui-grid-cell-contents"  style="padding-right: 4px;">
                                <div class="demo_check" ng-class="{'active': grid.appScope.doc_slc_all == 'Y'}" ng-click="grid.appScope.doc_all_check(grid.appScope.doc_slc_all)"></div>
                        </div>
                </div>`,
		cellTemplate:
		`<div class="ui-grid-cell-contents" style="padding: 0px; cursor: pointer;" ng-class="{'doc_edit': row.entity.edit == 'Y'}">
                        <div class="ui-grid-cell-contents">
				<div class="demo_check" ng-class="{'active': row.entity.checked == 'Y'}" ng-click="grid.appScope.doc_check(row.entity)"></div>
                        </div>
                </div>`
          };	
	/***********************************/
	function gridOptionsDoccolumnDefs_func(){
		var gridOptions_columnDef = [
		    {
				field: '#',
				displayName: 'S.No',
				width: 60,
				pinnedLeft: false,
				pinnedRight: false,
				cellEditableCondition:false,
				headerCellClass: 'hdr_cntr',
				cellTemplate:
					`<div class="ui-grid-cell-contents row_col_grid_cell" ng-class="{'doc_edit': row.entity.edit == 'Y'}">
						{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}
					</div>`,
		},
			{
		    field: 'd',
		    displayName: 'Doc Id',
		    width: '80',
		    pinnedLeft: false,
		    pinnedRight: false,
		    cellEditableCondition:false,
				headerCellClass: 'hdr_cntr',
		    cellTemplate:
				`<div class="ui-grid-cell-contents row_col_grid_cell did" ng-class="{hold_status: row.entity.holdstatus, pub_stst_cl: row.entity.pub_sts=='Y', 'doc_edit': row.entity.edit == 'Y'}">
						{{COL_FIELD}}
				</div>`
		},
			{
		    field: 'doc_name',
		    displayName: 'Doc Name',
		    width: '*',
		    minWidth: 100,
		    pinnedLeft: false,
		    pinnedRight: false,
		    cellEditableCondition:false,
				headerCellClass: 'hdr_cntr',
		    cellTemplate:
			     `<div class="ui-grid-cell-contents row_col_grid_cell project" title="{{COL_FIELD}}" ng-class="{'doc_edit': row.entity.edit == 'Y'}">
						{{COL_FIELD}}
			     </div>`
		},
		{
                    field: 'status',
                    displayName: 'Status',
                    width: 100,
                    minWidth: 80,
                    pinnedLeft: false,
                    pinnedRight: false,
                    cellEditableCondition:false,
                    headerCellClass: 'hdr_cntr',
                    cellTemplate:
                             `<div class="ui-grid-cell-contents row_col_grid_cell market" style="text-align: center;padding: 0px;" ng-class="{'doc_edit': row.entity.edit == 'Y'}">
				<span class="status_circle" ng-class="{'status_y': row.entity.status == 'Y'}"></span>
                             </div>`
                },
		{
		    field: 'FYE',
		    displayName: 'FYE',
		    width: 100,
		    minWidth: 80,
		    pinnedLeft: false,
		    pinnedRight: false,
		    cellEditableCondition:false,
		    headerCellClass: 'hdr_cntr',
		    cellTemplate:
			     `<div class="ui-grid-cell-contents row_col_grid_cell market" style="text-align: center;padding: 0px;" ng-class="{'doc_edit': row.entity.edit == 'Y'}">
						{{COL_FIELD}}
			     </div>`
		},
		{
		    field: 'Year',
		    displayName: 'Year',
		    width: 100,
		    minWidth: 80,
		    pinnedLeft: false,
		    pinnedRight: false,
		    cellEditableCondition:false,
		    headerCellClass: 'hdr_cntr',
		    cellTemplate:
			     `<div class="ui-grid-cell-contents row_col_grid_cell market" style="text-align: center;padding: 0px;" ng-class="{'doc_edit': row.entity.edit == 'Y'}">
						{{COL_FIELD}}
			     </div>`
		},
		{
                    field: 'periodtype',
                    displayName: 'Period Type',
                    width: 100,
                    minWidth: 80,
                    pinnedLeft: false,
                    pinnedRight: false,
                    cellEditableCondition:false,
                    headerCellClass: 'hdr_cntr',
                    cellTemplate:
                             `<div class="ui-grid-cell-contents row_col_grid_cell market" style="text-align: center;padding: 0px;" ng-class="{'doc_edit': row.entity.edit == 'Y'}">
                                                {{COL_FIELD}}
                             </div>`
                },
		];
		return gridOptions_columnDef; 
	}
	/***********************************/
	$scope.cl_bk_get_doc_cmp = function(res){
		$scope.config.parent_scope.ps = false;
		if(res['message'] == 'done'){
			$scope.doc.columnDefs = gridOptionsDoccolumnDefs_func();
			$scope.doc.columnDefs.unshift(doc_check_1);
			res['data'].forEach(function(e){ 
				e["checked"] = "Y";
			});
			$scope.doc.data = res["data"];
			$scope.process_doc.data.forEach(function(r){
				r["checked"] = "N";
				res['data'].forEach(function(e){
					if(e.d == r.d){
						r["checked"] = "Y";	
					}
				})	
			});	
		}else{
			tasAlert.show(res['message'], 'error', 1000);
		}
	}
	/***********************************/
	$scope.get_doc_cmp = function(obj){
		if(obj){
			$scope.cmp_detls_view = obj;
			if("edit" in $scope.cmp_detls_view && $scope.cmp_detls_view["edit"] == "Y"){
				$scope.process_doc.data.forEach(function(r){
					r["checked"] = "N";
					$scope.cmp_detls_view['edit_data'].forEach(function(e){
						if(e.d == r.d){
							r["checked"] = "Y";	
						}
					})	
				});	
				$scope.doc.data = $scope.cmp_detls_view['edit_data']; 
			}else{
				var post_data = {"cmd_id": 4,"project_id": $scope.config.parent_scope.slcted_indus_dic['project_id'],"crid": obj['crid']};
				$scope.config.parent_scope.ps = true;
				tasService.ajax_request(post_data, 'POST', $scope.cl_bk_get_doc_cmp);
			}
		}else{
			$scope.doc.columnDefs = gridOptionsDoccolumnDefs_func();
			$scope.doc.columnDefs.unshift(doc_check_1);
			$scope.doc.data = [];
		}
	}
	/***********************************/
	var process_check_1 ={
		field: '#',
                displayName: '#',
                width: 30,
		pinnedLeft: true,
                cellEditableCondition:false,
		'headerCellTemplate':`
			<div class="ui-grid-header-cell" style="padding: 0px; cursor: pointer;">
                        <div class="ui-grid-cell-contents"  style="padding-right: 4px;">
                                <div class="demo_check" ng-class="{'active': grid.appScope.process_slc_all == 'Y'}" ng-click="grid.appScope.process_all_check(grid.appScope.process_slc_all)"></div>
                        </div>
                </div>`,
		cellTemplate:
		`<div class="ui-grid-cell-contents" style="padding: 0px; cursor: pointer;">
                        <div class="ui-grid-cell-contents">
				<div class="demo_check" ng-class="{'active': row.entity.checked == 'Y'}" ng-click="grid.appScope.process_check(row.entity)"></div>
                        </div>
                </div>`
          };	
	/***********************************/
	var cmp_name =	{
		    field: 'Company',
		    displayName: 'Company Name',
		    width: 100,
		    minWidth: 80,
		    pinnedLeft: false,
		    pinnedRight: false,
		    cellEditableCondition:false,
		    headerCellClass: 'hdr_cntr',
		    cellTemplate:
			     `<div class="ui-grid-cell-contents row_col_grid_cell market" style="text-align: center;padding: 0px;">
						{{COL_FIELD}}
			     </div>`
		};
	/***********************************/
	$scope.process_doc = {
		enableRowSelection: true, rowHeight:30, enableFiltering:true, noUnselect : false, enableSorting:false,
		showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false,
		enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false,
		columnDefs:[],
		onRegisterApi: function (gridApi) {
		    $scope.processDoc = gridApi;
		}
    	} 
	/***********************************/
	$scope.clbk_process_doc = function(res){
  		$scope.config.parent_scope.ps = false;
		if(res["message"] == "done"){
			var colDef = [];
			var getcolDef = gridOptionsDoccolumnDefs_func();
			getcolDef.forEach(function(r,inx){
				if(inx ==0){
					colDef.push(process_check_1);
				}
				if(inx == 1){
					colDef.push(cmp_name)
				}
				colDef.push(r)
			});	
			$scope.process_doc.columnDefs = colDef;//gridOptionsDoccolumnDefs_func();
			$scope.process_doc.data = res['data'];
		}else{
			tasAlert.show(res['message'], 'error', 1000);
			$scope.process_doc.columnDefs = [];
			$scope.process_doc.data = res['data'];
		}
		$scope.get_doc_cmp($scope.config.parent_scope.slcted_indus_dic['info'][0]);
	}
	/***********************************/
	$scope.doc_check = function(obj){
		var arr = [];
		var flg ="Y";
		if('checked' in obj && obj['checked'] == "Y"){
			flg = "N";
		}
		obj['checked'] = flg;
		obj['edit'] = "Y";
		$scope.doc_slc_all = "N";
		$scope.cmp_detls_view["edit"] = "Y";
		var Rows = $scope.ApiDoc.core.getVisibleRows($scope.ApiDoc.grid);
		Rows.forEach(function(r){
				arr.push(r.entity)
		})
		$scope.cmp_detls_view["edit_data"] = arr;
	}
	/***********************************/
	$scope.doc_slc_all = "Y";
	$scope.doc_all_check = function(flg){
		var arr =[]
		var Rows = $scope.ApiDoc.core.getVisibleRows($scope.ApiDoc.grid);
		var ch_flg = "N";
		if(flg == "N"){
			ch_flg = "Y";
		}
		Rows.forEach(function(r){
			r.entity['checked'] = ch_flg;
			arr.push(r.entity)
		})
		$scope.doc_slc_all = ch_flg;
		$scope.cmp_detls_view["edit_data"] = arr;
	}
	/***********************************/
	$scope.process_slc_all = "N";
	$scope.process_all_check = function(flg){
		var Rows = $scope.processDoc.core.getVisibleRows($scope.processDoc.grid);
		var ch_flg = "N";
		if(flg == "N"){
			ch_flg = "Y";
		}
		Rows.forEach(function(r){
			r.entity['checked'] = ch_flg;
		})
		$scope.process_slc_all = ch_flg;
	}
	/***********************************/
	$scope.process_check = function(obj){
		var flg ="Y";
		if('checked' in obj && obj['checked'] == "Y"){
			flg = "N";
		}
		obj['checked'] = flg;
		$scope.process_slc_all = "N";
	}
	/***********************************/
	$scope.duplicate_obj = function(arr,comp,arrCon){
		var unique = arr.map(function(e){
			return e[comp];
		})
		.map(function(e,i,final){
			if(!(final.indexOf(e) === i && i)){
				if(arrCon in arr[i]){
					var conarr = arr[i][arrCon].concat(arr[final.indexOf(e)][arrCon]);
					var new_docs = $scope.duplicate_arr(conarr);
					arr[final.indexOf(e)][arrCon] = new_docs;
				}
			}
			return final.indexOf(e) === i && i
		})
		.filter(function(e){return arr[e]}).map(function(e){ return arr[e]});
		return unique;
	}
	/***********************************/
	$scope.duplicate_arr = function(arr){
		let unique = [];
		arr.forEach(function(i){
			if($.inArray(i, unique) === -1){
				unique.push(i)
			}
		});
		return unique;
		
	}
	/***********************************/
	$scope.process_doc_save = function(){
		var Rows = $scope.processDoc.core.getVisibleRows($scope.processDoc.grid);
		Rows.forEach(function(r){
			if('checked' in r.entity && r.entity['checked'] == "Y"){
				var obj = angular.copy(r.entity);
				$scope.doc.data.push(obj);
			}
		});
		$scope.cmp_detls_view["edit"] = "Y";
		$scope.cmp_detls_view["edit_data"] = $scope.remove_duplicate_obj($scope.doc.data,'d');
		$scope.doc.data = $scope.cmp_detls_view["edit_data"];
	}
	/***********************************/
	$scope.add_new = {};
	$scope.add_new_company = function(){
		if($scope.add_new['cmp_name']){
			var emp = {};
			emp["company_name"] = $scope.add_new['cmp_name'];
			emp["crid"] = "new";
			$scope.config.parent_scope.slcted_indus_dic['info'].unshift(emp);
			 $scope.add_new['cmp_name'] = '';
		}else{
                        tasAlert.show('Input field Empty', 'warning', 1000)
                }
	}
	/***********************************/
	window.allowDrop = function(ev){
	  ev.preventDefault();
	}

	window.drag = function(ev) {
	  	ev.dataTransfer.setData('text', ev.target.id);
	}

	window.drop = function(ev) {
		var data = ev.dataTransfer.getData("text");
		var ind = data.split('_')[1];
		var obj = $scope.alv_cmp[ind];
		obj['drag'] = 'Y';
		$scope.config.parent_scope.slcted_indus_dic['info'].push(obj);
		$scope.alv_cmp.splice(ind,1)
		$scope.$apply(function(){
			$scope.config.parent_scope.slcted_indus_dic['info'];
		})
	}
	/***********************************/
	$scope.remove_company = function(obj,index){
		var post_data = {"cmd_id": 24,"project_id":$scope.config.parent_scope.slcted_indus_dic['project_id'],"crid": obj["crid"]};
     		$scope.config.parent_scope.ps = true;
	 	tasService.ajax_request(post_data, 'POST', $scope.remove_company_cb);
	}
	/***********************************/
	$scope.remove_company_cb = function(res){
		$scope.config.parent_scope.ps = false;
		if(res["message"] == "done"){
			$scope.get_doc_cmp($scope.config.parent_scope.slcted_indus_dic['info'][0]);
			$scope.config.parent_scope.slcted_indus_dic['info'].splice(index,1); 
		}else{
			tasAlert.show(res['message'], 'error', 1000);
		}
		
	}
	/***********************************/
	$scope.save_all = function(){
		var all_data =[];
		$scope.config.parent_scope.slcted_indus_dic['info'].forEach(function(r){
			var docs = [];
			var emp ={};
			if("edit" in r && r["edit"] == "Y"){
				if("edit_data" in r && r["edit_data"].length){
					r["edit_data"].forEach(function(dc){
						if("checked" in dc && dc["checked"] == "Y"){
							docs.push(dc.d)
						}
					});
				}
				emp["comp_name"] = r["company_name"];
				emp["crid"] = r["crid"];
				emp["docs"] = docs;
				all_data.push(emp);
				r["edit"] = "N";
			}
		})
		if(all_data.length){
			var post_data = {"cmd_id": 23,"project_id":$scope.config.parent_scope.slcted_indus_dic['project_id'],"data": all_data,"user": "demo"};
			if($scope.config.parent_scope.slcted_indus_dic['project_id'] == 37){
				post_data["systemip"]= "172.16.20.52";
			}
			$scope.config.parent_scope.ps = true;
			tasService.ajax_request(post_data, 'POST', $scope.save_all_cb);
		}
		else{
			tasAlert.show('You are not Edit any Company', 'warning', 1000);
		}
	}
  	/***********************************/
	$scope.save_all_cb = function(res){
		$scope.config.parent_scope.ps = false;
		if(res["message"] == "done"){
                        $scope.modules.scope.init_func();
		}else{
                       tasAlert.show(res['message'], 'error', 1000);
                }
	}
	/***********************************/
	$scope.remove_duplicate_obj = function(arr,comp){
		let unique = arr.map(function(e){
			return e[comp];
		})
		.map(function(e,i,final){
			return final.indexOf(e) === i && i
		})
		.filter(function(e){return arr[e]}).map(function(e){ return arr[e]});
		return unique;
	}
	/***********************************/
	$scope.avcmp = false;
	$scope.showHide = function(){
		 $scope.avcmp = !$scope.avcmp;
	}
	/***********************************/
	$scope.proconfig_select = function(opt){
		$scope.tab_slt = opt;
		var post_data = {"cmd_id": 11}
    		$scope.config.parent_scope.ps = true;
		tasService.ajax_request(post_data, 'POST', $scope.cb_all_company);
		var post_data = {"cmd_id": 21,"project_id": $scope.config.parent_scope.slcted_indus_dic['project_id'],"db_name": $scope.config.parent_scope.slcted_indus_dic['db_name']};
		if($scope.config.parent_scope.slcted_indus_dic['project_id'] == 37){
			post_data["systemip"] = "172.16.20.52";
		}
		$scope.config.parent_scope.ps = true;
		tasService.ajax_request(post_data, 'POST', $scope.clbk_process_doc);
	}
	/***********************************/
	$scope.cb_all_company = function(res){
		$scope.config.parent_scope.ps = false;
		if(res['message'] == 'done'){
			$scope.alv_cmp = [];
			res['data'].forEach(function(r){
				var match = true;
				$scope.config.parent_scope.slcted_indus_dic['info'].forEach(function(r2){
					if(r['company_name'] == r2['company_name']){
						match = false;	
					}
				});
				if(match){
					$scope.alv_cmp.push(r)
				}
			})
		}else{
			tasAlert.show(res['message'], 'error', 1000);
		}
	}
	/***********************************/
	$scope.userconfig_select = function(opt){
		$scope.tab_slt = opt;
		var post_data = {"cmd_id": 27}
		$scope.config.parent_scope.ps = true;
		tasService.ajax_request(post_data, 'POST', $scope.get_user_cb);
		var post_data_2 = {"cmd_id": 28}
		$scope.config.parent_scope.ps = true;
		tasService.ajax_request(post_data_2, 'POST', $scope.getAllproject_cb);
	}
	/***********************************/
	$scope.get_user_cb = function(res){
		$scope.config.parent_scope.ps = false;
		if(res["message"] == "done"){
			$scope.users = res['data'];
			if($scope.users.length){
				$timeout(function(){
					$scope.user_select($scope.users[0]);
				});
			} 
		}else{
                       tasAlert.show(res['message'], 'error', 1000);
                }
	}
	/***********************************/
	$scope.getAllproject_cb = function(res){
		$scope.config.parent_scope.ps = false;
		if(res["message"] == "done"){
			$scope.allProject = res['data'];
			if($scope.allProject.length){
				$scope.project_slction($scope.allProject[0]);	
			} 
		}else{
                       tasAlert.show(res['message'], 'error', 1000);
                }

	}
	/***********************************/
	$scope.project_slction = function(arg){
		$scope.slcted_project = arg;
		for(var i=0;i < $scope.slcted_user['project'].length;i++){
			if($scope.slcted_user['project'][i]["project_id"] == $scope.slcted_project["project_id"]){
				$scope.slct_cmp_show($scope.slcted_user['project'][i],'2');
				break;
			}
		}
		$scope.slc_all_cmp = "N";
	}
	/***********************************/
	$scope.user_select = function(obj){
		$scope.slcted_user = obj;
		if("edit" in obj && obj["edit"]=="Y"){
			$scope.chk_cmp = {};
			$scope.slcted_user["project"].forEach(function(r){
				r['info'].forEach(function(s){
					if('usr_slt' in s &&  s['usr_slt'] == 'Y'){
						var t = r["project_id"]+"_"+s.crid;
                                        	$scope.chk_cmp[t] = "Y";
					}	
				});
			});
			$scope.allProject.forEach(function(mr){
				mr["info"].forEach(function(ms){
					ms["usr_slt"] = "N";
				});	
			});
			$scope.slct_cmp_show($scope.slcted_user["project"][0])				
		}else{
			var post_data = {"cmd_id": 30, "uid": obj["uid"]};
			$scope.config.parent_scope.ps = true;
			tasService.ajax_request(post_data, 'POST', $scope.getuse_cmp_list);
		}
	}
	/***********************************/
	$scope.getuse_cmp_list = function(res){
		$scope.config.parent_scope.ps = false;
		if(res["message"] == "done"){
			$scope.chk_cmp = {};
			res['data'].forEach(function(r){
				r.usr_slt = ["Y"];
				r['info'].forEach(function(s){
					s['usr_slt'] = "Y";
					var t = r["project_id"]+"_"+s.crid;
					$scope.chk_cmp[t] = "Y";		
				})
			})
			if($scope.allProject){
				$scope.allProject.forEach(function(mr){
					mr["info"].forEach(function(ms){
						ms["usr_slt"] = "N";
					});	
				});
			}
			$scope.slcted_user["project"] = res['data'];
			$scope.slct_cmp_show($scope.slcted_user["project"][0]);
		}else{
                       tasAlert.show(res['message'], 'error', 1000);
                }
		
	}	
	/***********************************/
	$scope.slct_cmp_show = function(obj,agc){
		$scope.user_slcted_project = obj;
		if(agc != 2 && $scope.allProject && obj){
			for(var i=0;i<$scope.allProject.length;i++){
				if($scope.allProject[i]["project_id"] == obj["project_id"]){
					$scope.project_slction($scope.allProject[i],agc);
					break;
				}
			}
		}
	}
	/***********************************/
	$scope.slc_all_cmp = "N";
	$scope.uslcted_all_cmp = function(flg){
		var ch_flg = "N";
		if(flg == "N"){
			ch_flg = "Y";
		}
		if($scope.user_slcted_project && $scope.user_slcted_project["project_id"] == $scope.slcted_project["project_id"]){
			$scope.slcted_project['info'].forEach(function(r){
				r['usr_slt'] = ch_flg;
				var push = true;
				$scope.user_slcted_project['info'].find(function(e){
					if(e.crid == r.crid){
						push = false;
					}
				})
				if(push){
					 $scope.user_slcted_project['info'].push(r)
				}	
			});
		}else{
			$scope.slcted_project["info"].forEach(function(sl){
				sl['usr_slt'] = "Y";	
			});	
			var cpy = angular.copy($scope.slcted_project);
			cpy['usr_slt'] = "Y";
			$scope.slcted_user["project"].push(cpy);
			$scope.slct_cmp_show(cpy);
		}
		$scope.slc_all_cmp = ch_flg;
		$scope.slcted_user["edit"] = "Y";
	}	
	/***********************************/
	$scope.user_slct_cmp = function(obj, prt_sc){
		$scope.slcted_user["edit"] = "Y";
		if('usr_slt' in obj && obj['usr_slt'] == "Y"){
			obj['usr_slt'] = "N";
			if(prt_sc == 'prt'){
				obj['info'].forEach(function(unslt){
					unslt['usr_slt'] = "N";
				});
			}

		}else{
			obj['usr_slt'] = "Y";
			if(prt_sc == 'prt'){
				obj['info'].forEach(function(unslt){
					unslt['usr_slt'] = "Y";
				});
				return
			}
			var main_push = true;
			$scope.slcted_user["project"].forEach(function(r){
				if(r.project_id == $scope.slcted_project["project_id"]){
					var push = true;
					 main_push = false;
					r["info"].forEach(function(e){
						if(e['crid'] == obj["crid"]){
							push = false;
						}
					});
					if(push){
						r["info"].push(obj);
					}
					$scope.slct_cmp_show(r);
				}
			});
			if(main_push){
				var cpy = angular.copy($scope.slcted_project);
				cpy["info"] = [];
				cpy["info"].push(obj);
				cpy['usr_slt'] = "Y";
				$scope.slcted_user["project"].push(cpy);
				$scope.slct_cmp_show(cpy);
			}	
				
		}
	}
	/***********************************/
	$scope.user_cmp_save = function(){
		var sv_data = [];
		$scope.users.forEach(function(ob){
			if("project" in ob){
				ob["project"].forEach(function(ech){
					var obj = {};
					obj["info"] = [];
					ech["info"].forEach(function(cm){
						if(cm.usr_slt == 'Y'){	
							obj["info"].push(cm.crid);
						}
					});
					obj["project_id"] = ech["project_id"];
					obj["uid"] = ob["uid"]; 
					obj["un"]  = ob["un"];
					sv_data.push(obj);
				});
			}
		});
		if(sv_data.length){
		var post_data = {"cmd_id": 29,"data": sv_data,"user": "demo"};
			$scope.config.parent_scope.ps = true;
			tasService.ajax_request(post_data, 'POST', $scope.user_save_cb);
		}else{
			tasAlert.show('You are not Changed anything', 'warning', 1000);
		}
	}
	/***********************************/
	$scope.user_save_cb = function(res){
		$scope.config.parent_scope.ps = false;
		if(res["message"] == "done"){
			tasAlert.show("Saved","success",1000);
			$timeout(function(){
				$scope.userconfig_select('user');
			},1010)
		}else{
                       tasAlert.show(res['message'], 'error', 1000);
		}	
	}
	/***********************************/
	/***********************************/
	/***********************************/
	/***********************************/
});
app.directive('cmpConfig',function(){
	return {
		restrict: 'AE',
		template:`<div class="admincnfg">
				<div class="cnfg_bdy">
					<div class="tas_tab">
						<div class="tab_slct" ng-click="tab_select('module')" ng-class="{'active': tab_slt == 'module'}">Module</div>
						<div class="tab_slct" ng-click="proconfig_select('project')" ng-class="{'active': tab_slt == 'project'}">Project</div>
						<div class="tab_slct" ng-click="userconfig_select('user')" ng-class="{'active': tab_slt == 'user'}">User</div>
						<div class="cnfig_close" ng-click="pop_close()"><i class="fa fa-reply" style="font-size: 14px;color: #000;"></i></div>
						<div class="pull-right" style="margin-right: 5px;">
							<button class="btn btn-sm smbtn m-0 stmpd" ng-click="save_all()" ng-if="tab_slt == 'project'" >Save</button>
							<button class="btn btn-sm smbtn m-0 stmpd" ng-click="user_cmp_save()" ng-if="tab_slt == 'user'" >Save</button>
						</div>
					</div>
					<div class="cmp_edit" ng-if="tab_slt == 'project'">
						<div class="cmp_list">
							<div class="cmp_prj_add">
								<div class="add_icon" ng-click="show_input()"><i class="fa" ng-class="{'fa-plus-circle': !infield,'fa-minus-circle': infield}"></i></div>
								<div class="add_txt">
									<span ng-click="show_input()" ng-show="!infield">Add Company</span>
									<input type="text" class="form-control add_prjt_input"  placeholder="Company Name" ng-show="infield" id="cmp_fcus" style="margin: 0;height: 26px;" ng-model="add_new['cmp_name']" ng-keyup="$event.keyCode== 13 && add_new_company()">
									<button class="btn btn-sm smbtn m-0 pull-right" style="padding:4px 9px !important;" ng-show="infield" ng-click="add_new_company()">Add</button>
								</div>
							</div>
							<div class="list_of_cmp" ng-class="{'list_of_cmp_change': !avcmp}" id="div1" ondrop="drop(event)" ondragover="allowDrop(event)">
								<div class="cmp_data" ng-repeat="e_data in config.parent_scope.slcted_indus_dic['info'] track by $index" ng-class="{'active':e_data['company_name'] == cmp_detls_view['company_name'],'eidt_cmp': e_data['edit'] == 'Y'}" ng-click="get_doc_cmp(e_data)">
									<div class="cmp_top_con">
										<div class="cmp_left_logo">
											<img src="src/images/comp_dummy.png" class=" img-responsive" style="width: 100%;height: 100%;user-select: none;">
										</div>
										<div class="cmp_name ellipsis">
											<span>{{e_data['company_name']}}</span>
										</div>
										<div class="cmp_delete">
											<span class="fa fa-trash-o del_over" ng-click="remove_company(e_data, $index);$event.stopPropagation();"></span>
										</div>
									</div>
								</div>		
							</div>
							<div class="avle_cmp" ng-class="{'avle_cmp_change': !avcmp}">
								<div class="mtr_card__header" style="background: #fff;">
									<div class="mtr_card__title">Companies</div>
									<div class="mtr_card__title">
										<input type="text" placeholder="Comapny Name" class="form-control filter_input" ng-model="av_cmp_flt['company_name']" ng-show="avcmp">
									</div>
									<div class="pull-right mr-2" style="margin-top: 2px;">
										<button class="btn btn-sm smbtn m-0" ng-click="showHide()"><i class="fa" ng-class="{'fa-arrow-down': avcmp,'fa-arrow-up': !avcmp}"></i></button>
									</div>
								</div>
								<div class="avl_cmp_body" ng-show="avcmp">
									<div class="cmp_data" ng-repeat="cmp in alv_cmp | filter:av_cmp_flt track by $index" draggable="true" ondragstart="drag(event)" id="drag_{{$index}}">
										<div class="cmp_top_con" style="position: relative;">
											<div class="cmp_left_logo">
												<img src="src/images/comp_dummy.png" class=" img-responsive" style="width: 100%;height: 100%;user-select: none;">
											</div>
											<div class="cmp_name ellipsis">
												<span>{{cmp['company_name']}}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!-- -->
						</div>
						<div class="cmp_add_ft">
							<div class="cmp-doc">
								<div class="mtr_card__header">
									<div class="mtr_card__title">Configured Documents</div>
								</div>
								<div class="doc_body">
									<div class="ui-grid" ui-grid="doc"></div>
								</div>
							</div>
							<div class="new-doc">
								<div class="mtr_card__header">
									<div class="mtr_card__title">Processed Documents</div>
									<div class="pull-right" style="margin-top: 2px;">
										<button class="btn btn-sm smbtn m-0" ng-click="process_doc_save()">Add</button>
									</div>
								</div>
								<div class="doc_body">
									<div class="ui-grid" ui-grid="process_doc"></div>
								</div>
	
							</div>
						</div>
					</div>
					<!-- -->
					<div class="cmp_edit user_edit" ng-if="tab_slt == 'user'">
						<div class="cmp_list" style="background: #fff;">
							<div class="mtr_card__header">
								<div class="mtr_card__title">User List</div>
							</div>
							<div class="usr_list">
								<div class="usr_flt">
									<input type="text"  class="form-control usr_input" ng-mmdel="" placeholder="Search User Name" ng-model="user_flt['un']"> 
								</div>
								<ul class="vertical-nav-menu metismenu">
									<li class="list_items" ng-repeat="usl in users | filter:user_flt | orderBy :sort_cnfig track by $index" ng-class="{'active': usl.uid == slcted_user.uid}" ng-click="user_select(usl)">
									<div class="item_indicator" ng-class="{'config_d': usl['d_flg'] == 'D','config_nd': usl['d_flg'] == 'ND'}"></div>
									<div class="item_content">
										<div class="usr_img">
											<img src="src/images/user.png" class="img-response" style="width: 70%;height: 100%;" ng-class="{'user_edited': usl['edit'] == 'Y'}">
										</div>
										<div class="user_name">{{usl['un']}}</div>
									</div>
									</li>	
								</ul>
							</div>	
						</div>
						<!-- -->
						<div class="cmp_add_ft">
							<div class="cmp-doc" style="background: transparent;">
								<div class="prt_list">
									<div class="mtr_card__header">
										<div class="mtr_card__title">Project</div>
									</div>
									<div class="cp_list">
										<div class="cmp_data" ng-repeat="pjt in slcted_user['project']" ng-click="slct_cmp_show(pjt)" ng-class="{'active': user_slcted_project['project_id'] == pjt['project_id']}">
											<div class="cmp_top_con">
												<div class="demo_check" ng-class="{'active': pjt.usr_slt == 'Y'}" ng-click="user_slct_cmp(pjt,'prt');$event.stopPropagation();" style="float: left;margin-top: 10px;"></div>
												<div class="prj_logo">
													<i class="fa fa-ravelry" aria-hidden="true"></i>
												</div>	
												<div class="cmp_name ellipsis">
													{{pjt['project_name']}}
												</div>
											</div>	
										</div>
									</div>
								</div>
								<div class="cmpt_list">
									<div class="mtr_card__header">
										<div class="mtr_card__title">Company</div>
									</div>
									<div class="cp_list">
										<div class="cmp_data" ng-repeat="cml in user_slcted_project['info']">
											<div class="cmp_top_con">
												<div class="demo_check" ng-class="{'active': cml.usr_slt == 'Y'}" ng-click="user_slct_cmp(cml)" style="float: left;margin-top: 10px;"></div>
												<div class="cmp_left_logo">
													<img src="src/images/comp_dummy.png" class="img-response" style="width: 100%;height: 100%;user-select: none;">
												</div>	
												<div class="cmp_name ellipsis">
													{{cml['company_name']}}
												</div>
											</div>	
										</div>
									</div>
								</div>
							</div>
							<!-- -->
							<div class="new-doc">
								<div class="mtr_card__header">
									<div class="cmp_all_chk">
										<div class="al_txt">All</div> <div class="demo_check" ng-class="{'active': slc_all_cmp == 'Y'}" ng-click="uslcted_all_cmp(slc_all_cmp)" style="float: left;margin-top: 3px;"></div> 
									</div>
									<div class="dropdown pull-right">
										<div class="header-icon waves-effect dropdown-toggle header_icon_change" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
											<i class="fa fa-file" aria-hidden="true"></i>
											<span class="text-dark">{{slcted_project['project_name']}}</span>
										</div>
										<div class="dropdown-menu dropdown-menu-tas drp_left">
											<div class="md-form md-form-tas" style="margin: 5px 23px;">
												<input class="form-control" type="text" placeholder="Search" aria-label="Search" ng-model="flt_prjt['project_name']" style="font-size: 14px;" autofocus>
											</div>
											<div class="dropdown-item-tas-full">
			<div class="dropdown-item-tas waves-effect" ng-repeat="comp in allProject | filter:flt_prjt" ng-click="project_slction(comp)" ng-class="{'drp_active': slcted_project['project_id'] == comp['project_id']}" title="{{comp['company_name']}}">{{comp['project_name']}}</div>
											</div>
										</div>
									</div>
								</div>
								<div class="lst_cmp">
									<div class="cmp_data" ng-repeat="cml in slcted_project['info']">
										<div class="cmp_top_con">
											<div class="demo_check" ng-class="{'active': cml.usr_slt == 'Y' || chk_cmp[slcted_project['project_id']+'_'+cml['crid']] == 'Y'}" ng-click="user_slct_cmp(cml)" style="float: left;margin-top: 10px;"></div>
											<div class="cmp_left_logo">
												<img src="src/images/comp_dummy.png" class="img-response" style="width: 100%;height: 100%;user-select: none;">
											</div>	
											<div class="cmp_name ellipsis">
												{{cml['company_name']}}
											</div>
										</div>	
									</div>
								</div>

							</div>
							<!-- -->
						</div>
					</div>	
				<div class="cmp_edit" ng-if="tab_slt == 'module'">
					<module-info config="modules"></module-info>
				</div>
			</div>
			<div class="prog_bar ng-hide" ng-show="ps">
				<div class="spinner">
				  <div class="rect1"></div>
				  <div class="rect2"></div>
				  <div class="rect3"></div>
				  <div class="rect4"></div>
				  <div class="rect5"></div>
				</div>
			</div>
			<style>
.admincnfg{width: 100%;height: 100%;box-shadow:0 0.46875rem 2.1875rem rgba(4,9,20,0.03), 0 0.9375rem 1.40625rem rgba(4,9,20,0.03), 0 0.25rem 0.53125rem rgba(4,9,20,0.05), 0 0.125rem 0.1875rem rgba(4,9,20,0.03)}
.config_sectiop{float: left; width: 100%; height: 100%; background: #f1f4f6; padding: 10px;}
.admincnfg .cnfig_close{float: right;padding: 0 10px;border-left: 1px solid #ddd;}
.admincnfg .cnfg_bdy{ height: 100%; width: 100%;}
.admincnfg .cnfg_bdy .tas_tab{ width: 100%; height: 30px; margin-bottom: 3px; background: #fff; line-height: 30px;-webkit-border-top-left-radius: .35rem; border-top-left-radius: .35rem; -webkit-border-top-right-radius: .35rem; border-top-right-radius: .35rem;}
.admincnfg .tas_tab .tab_slct{ float: left; padding: 0 10px; font-weight: 500; background: #fff; border-right: 1px solid #ddd; }
.admincnfg .tas_tab .tab_slct.active { background: #5e8aaf; color: #fff; box-shadow: 0 2px 1px 0 rgba(0,0,0,.16), 0 2px 8px 0 rgba(0,0,0,.12);}
.admincnfg .tas_tab .tab_slct:first-child{border-top-left-radius: 5px; }
.admincnfg .tas_tab .tab_slct.active:first-child{border-top-left-radius: 0px; }
.admincnfg .smbtn{background: #33b5e5;color: #fff;font-weight: 600; padding: 5px 9px!important;}
.admincnfg .stmpd { padding: 6px 11px !important;}
.admincnfg .cmp_edit{width: 100%;height:calc(100% - 33px);}
.admincnfg .cmp_edit .cmp_list{float: left;width: 35%;height: 100%;}
.admincnfg .cmp_list .list_of_cmp{width: 100%; height: calc(50% - 40px);overflow: hidden;overflow-y: auto;margin-bottom: 10px;transition: all 0.3s ease;-webkit-transition: all 0.3s ease;-moz-transition: all 0.3s ease;-o-transition: all 0.3s ease;-ms-transition: all 0.3s ease;}
.admincnfg .cmp_data{margin-bottom: 4px;background: #fff;width: calc(100% - 5px);box-shadow: 0 0rem 1rem rgba(4, 9, 20, 0), 0 0.1rem 0.4rem rgba(4,9,20,0.03), 0 0.2rem 0.5rem rgba(4, 9, 20, 0), 0 0.125rem 0.1em rgba(4,9,20,0.03);margin-right: 5px;float: left;border-radius: .25rem;border-left: 5px solid #ffffff;}
.admincnfg .cmp_left_logo{float: left;padding: 5px 7px;background: none!important;border-radius: 28px;width: 60px;}
.admincnfg .cmp_data .cmp_name{float: left;width:calc(100% - 90px);padding: 14px 0px;color: #344751;}
.admincnfg .cmp_edit .cmp_add_ft{width: calc(65% - 10px);margin-left: 10px; height: 100%;float: left;}
.admincnfg .cmp_add_ft .cmp-doc{width: 100%;height:calc(50% - 6px);float: left;margin-bottom: 10px;background: #fff;}
.admincnfg .cmp_add_ft .new-doc{width: 100%;height:calc(50% - 6px);float: left;background: #fff;}
.admincnfg .cmp_list .cmp_prj_add{width: calc(100% - 5px);float: left;height:30px;margin-bottom: 5px;line-height: 25px;background: #fff;}
.admincnfg .cmp_prj_add .add_icon{width: 30px; float: left;height: 100%;padding: 5px;}
.admincnfg .cmp_prj_add .add_icon i{margin-right: 0;color: #95b4ce;font-size: 18px;}
.admincnfg .cmp_prj_add .add_txt{width: calc(100% - 30px);float: left; padding: 3px 5px;}
.admincnfg .cmp_data.active{font-weight: bold;border-left: 5px solid #95b4ce;}
.admincnfg .mtr_card__header {background-color: rgba(0,0,0,.03);border-bottom: 1px solid #dfdfdf;height: 30px;}
.admincnfg .mtr_card__header .mtr_card__title {line-height: 30px;padding-left: 10px;font-size: 14px;color: #3F51B5;font-weight: bold;float: left;}
.admincnfg .cmp-doc .doc_body, .new-doc .doc_body{width: 100%;height: calc(100% - 30px);}
.admincnfg .status_circle{background: #d7d8d8;width: 10px;height: 10px;position: relative;display: inline-block;border-radius: 10px;margin-right: 0px;}
.admincnfg .status_y{background: #42AA6A;}
.admincnfg .doc_body [ui-grid="doc"], .doc_body [ui-grid="process_doc"]{height: 100%;width: 100%;}
.admincnfg .smbtn{background: #33b5e5;color: #fff;font-weight: 600; padding: 5px 9px!important;}
.admincnfg .cmp_list .avle_cmp{width: 100%;height: calc(50% - 5px);}
.admincnfg .avle_cmp .avl_cmp_body{width: 100%;height: calc(100% - 30px);overflow: hidden;overflow-y: auto;}
.admincnfg .hdr_cntr {text-align: center !important;font-weight: 500;color: #333;background: #ffffff;font-size: 12px;border-color: #e4e4e4;}
.admincnfg .hdr_cntr input[type="text"].ui-grid-filter-input {border: 1px solid #e4e4e4;}
.admincnfg .hdr_cntr input[type="text"].ui-grid-filter-input:focus {border: 1px solid #42a5f5;outline: none;}
.admincnfg .hdr_cntr .ui-grid-invisible, .hdr_act .ui-grid-invisible {display: none;}
.admincnfg .ui-grid-cell, [ui-grid-group-columns] .ui-grid-cell {overflow: hidden;float: left;background-color: inherit;border: none;border-right: 1px solid;border-color: #e4e4e4;box-sizing: border-box;border-bottom: 1px solid #e4e4e4;}
.admincnfg .ui-grid-row:nth-child(even) .ui-grid-cell {background-color: #fff !important;}
.admincnfg .ui-grid-row:nth-child(odd):hover .ui-grid-cell{background: #dae8f1 !important;}
.admincnfg .ui-grid-row:nth-child(even):hover .ui-grid-cell{background: #dae8f1 !important;}
.admincnfg .ui-grid-row:nth-child(odd):hover .ui-grid-cell .row_col_grid_cell{font-weight:bold !important;}
.admincnfg .ui-grid-row:nth-child(even):hover .ui-grid-cell .row_col_grid_cell{font-weight:bold !important;}
.admincnfg .row_col_grid_cell {position: relative;color: #333;padding: 0px;line-height: 35px;padding-left: 10px;font-size: 12px;font-weight: normal;padding-right: 3px;}
.admincnfg .ui-grid-cell-contents:focus {outline: none;}
.admincnfg .del_over{display: none;font-size: 16px;margin-left: 2px;color: #f44336;padding: 2px 4px;background: #ffecec;}
.admincnfg .cmp_data:hover .del_over{display: inline;border: 1px solid #f1c0c0;border-radius: 3px;}
.admincnfg .eidt_cmp{background:#ecf1f4;border-left: 1px solid rgba(0,0,0,.03);}
.admincnfg .stting{margin-right: 15px;border-radius: 3px;font-size: 16px;padding: 4px 5px;margin-top: -7px;background: rgba(120, 156, 173, 0.2);color: #333333;border: 1px solid #c8d1d6;box-shadow: 0 0px 0px 0 rgba(0,0,0,.16), 0 2px 7px 0 rgba(0,0,0,.12);}
.admincnfg .cmp_list .list_of_cmp_change{height: calc(100% - 75px);transition: all 0.3s ease;-webkit-transition: all 0.3s ease;-moz-transition: all 0.3s ease;-o-transition: all 0.3s ease;-ms-transition: all 0.3s ease;}
.admincnfg .cmp_list .avle_cmp_change{height:30px;}
.admincnfg .cmp_data .cmp_delete{width: 30px;padding: 13px 0px;float: left;}
.admincnfg .doc_edit{background: #e9ecee}
.admincnfg .user_edit .cmp-doc .prt_list{width: 50%;height: 100%;float: left;background: #fff;}
.admincnfg .user_edit .cmp-doc .cmpt_list{width: calc(50% - 10px);height: 100%;float: left;margin-left: 10px;background: #fff;}
.admincnfg .header-icon.header_icon_change{height: 29px;line-height: 29px;}
.admincnfg .new-doc .lst_cmp{width: 100%; height: calc(100% - 30px);overflow: hidden;overflow-y: auto; padding: 2px;background: #f1f4f6;}
.admincnfg .user_edit .usr_list{width: 100%;height: calc(100% - 30px);}
.admincnfg .usr_list .usr_flt{width: 100%;height: 40px;padding: 5px;}
.admincnfg .usr_list .usr_input{height: 30px;font-size: 13px;}
.admincnfg .usr_list .usr_input:focus{box-shadow: none;border-color: transparent;box-shadow: 0 0 0 0.1rem rgba(149, 180, 206, 0.6) !important;-webkit-box-shadow: 0 0 0 0.1rem rgba(149, 180, 206, 0.6) !important;}
.admincnfg .usr_list .vertical-nav-menu{ margin: 0; padding: 0; position: relative; list-style: none; float: left; width: 100%; }
.admincnfg .usr_list .metismenu{height: calc(100% - 40px);overflow: hidden;overflow-y: auto;padding: 0 5px;}
.admincnfg .vertical-nav-menu .list_items{padding: 10px 10px 10px 25px;position: relative; height: 50px;border-bottom: 1px solid #dfdfdf;}
.admincnfg .list_items .item_indicator{position: absolute;height:25px;width: 4px;border-radius: .3rem;left: 10px;top: 12px;opacity: .6;}
.admincnfg .list_items .item_indicator.config_d{background: #00c851;}
.admincnfg .list_items .item_indicator.config_nd{background: #9E9E9E;}
.admincnfg .list_items .item_content{float: left; width: 100%; height: 100%; position: relative; }
.admincnfg .list_items .usr_img{width: 45px;float: left;height: 100%;}
.admincnfg .list_items .user_name{width: calc(100% - 45px);float: left;padding-top: 8px;text-transform: capitalize;}
.admincnfg .vertical-nav-menu .list_items.active{background-color: #eaf0f2;color: #343a40;font-weight: 600;border-radius: 5px;}
.admincnfg .prt_list .cp_list, .admincnfg .cmpt_list .cp_list{width: 100%;height: calc(100% - 30px);overflow: hidden;overflow-y: auto;}
.admincnfg .drp_active { font-weight: bold; color: #3F51B5; }
.admincnfg .stmpd{padding: 6px 11px !important;}
.admincnfg .prj_logo {float: left; padding: 11px 7px; width: 50px; text-align: center; }
.admincnfg .prj_logo i{font-size: 18px;color: #09a7bb;}
.admincnfg .usr_img .user_edited{border: 2px solid #3F51B5; border-radius: 100%; animation: editor 1s;}
.admincnfg .cmp_all_chk{ float: left; line-height: 30px; }
.admincnfg .cmp_all_chk .al_txt{padding:0 5px;float: left;font-weight: bold;}
.admincnfg .slt_user span{color: #344751; font-size: 13px;font-weight: 500;padding-left: 2px;}
.admincnfg .slt_user img{width: 25px; height: 25px; border: 2px solid #c3c3c3; border-radius: 100%; }
.admincnfg .drp_left{transform: translate3d(-110px, -220px, 0px);}
@-webkit-keyframes editor{
	0%{border: none;}
	25%{border-top: 2px solid #3F51B5;}
	50%{border-top: 2px solid #3F51B5;border-right: 2px solid #3F51B5;}
	75%{border-top: 2px solid #3F51B5;border-right: 2px solid #3F51B5;border-bottom: 2px solid #3F51B5;}
	100%{border-top: 2px solid #3F51B5;border-right: 2px solid #3F51B5;border-bottom: 2px solid #3F51B5;border-left: 2px solid #3F51B5;}
}
			</style>`,
		controller: 'Configuration',
		scope: {
			'config': '='
		},
		link: function (scope, elm, attrs, controller) {

		},
	}
});

