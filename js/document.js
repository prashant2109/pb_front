"use strict";
app.controller("DocumentCntrl", function($scope, $rootScope, $http, $timeout, $location, $filter, $sce, tasAlert, tasService){
	$scope.Object = Object;
	$scope.menu_showing = {};
	$scope.configuration = {parent_scope: $scope}
	/***********************************/
	$scope.bk_get_menu = function(res){
		$scope.ps = false;
		$scope.side_menu_list = res['data'];
	}
	/**********************************/
	$scope.cl_bk_init_func = function(res){
		$scope.ps = false;
		if(res['message'] == 'done'){
			$scope.gbl_cmp_data = res['data'];
			if($scope.gbl_cmp_data.length){
				$scope.slt_cmp($scope.gbl_cmp_data[0])
			}
		}else{
			tasAlert.show(res['message'], 'error', 1000);
		}
		var post_data = {'cmd_id': 33}
		$scope.ps = true;
		tasService.ajax_request(post_data, 'POST',$scope.bk_get_menu);
	}
	/***********************************/
	$scope.init_func = function(){
		var post_data = {'cmd_id': 2, 'user': sessionStorage["user_id"]};
                $scope.ps = true;
                tasService.ajax_request(post_data, 'POST', $scope.cl_bk_init_func);
		$('#body_wrapper').show();
	};
	$scope.init_func();
	/***********************************/
	$scope.editorOption = false;
	$scope.slt_cmp = function(obj){
		$scope.add_in_show = true;
		$scope.slct_all_checkbox = false;
		sessionStorage['slcted_indus_p_id']= obj['project_id'];
		$scope.slcted_indus_dic = obj;
		$scope.editorOption = false;
		$scope.click_save_data();
		setTimeout(function(){
			$scope.cmp_details($scope.slcted_indus_dic["info"][0]);
		});	
	}
	/***********************************/
	$scope.cmp_details_view = {};
	$scope.cmp_details = function(obj){
		sessionStorage['slcted_comp_c_id']= obj['company_id'];
		$scope.cmp_details_view = obj;
	}
	/***********************************/
	$scope.side_menu_click_func = function(menu, mmenu_k){
		sessionStorage['project_info']= JSON.stringify(menu);
		sessionStorage['mmenu_k']= mmenu_k;
		window.location.href = '/monitor';
	}
	/***********************************/
	$scope.cb_save_data = function(res){
		$scope.ps = false;
		if(res['message']){
			if(res['message'] == 'done'){
				$scope.menu_showing = res['data'];
			}else{
				tasAlert.show(res['message'], 'error', 1000);
			}
		}
	}
	/***********************************/
	$scope.click_save_data = function(res){
		var post_data = {'cmd_id': 9,'project_id': $scope.slcted_indus_dic['project_id']};	
		$scope.ps = true;
                tasService.ajax_request(post_data, 'POST', $scope.cb_save_data);
	}
	/***********************************/
	$scope.cb_npc_func = function(res){
		$scope.ps = false;
		if(res['message']){
			if(res['message']=='done'){
				tasAlert.show(res['message'], 'success', 1000);
				if('project_id' in res){
					$scope.new_slcted_indus_dic['project_id'] = res['project_id'];
					$scope.add_in_show = false;
					$scope.gbl_cmp_data.push($scope.new_slcted_indus_dic);
					$scope.slt_cmp($scope.new_slcted_indus_dic);
					$scope.new_slcted_indus_dic = {};	
				}
			}else{
				tasAlert.show(res['message'], 'error', 1000);
			}
		}
	}
	/***********************************/
	$scope.add_new_save = function(){
		var getMenuCheck_list = []
		if(!$scope.add_in_show){
			var sl = [];
			$scope.new_slcted_indus_dic['info'].forEach(function(r){
                        	if(r['flg']){
					sl.push(r);
				}
                	});
			if($scope.new_slcted_indus_dic['project_name'] == undefined || $scope.new_slcted_indus_dic['project_name'] == ""){
				tasAlert.show('Please enter project name.', 'warning', 1000);
				return;
			}else if(!(sl.length)){
				tasAlert.show('Please select company.', 'warning', 1000);
                                return;
			}
			if(!(Object.keys($scope.menu_showing).length)){
                                tasAlert.show('Nothing is selected from Project Builder Menu.', 'warning', 1000);
                                return;
                        }
			pc_data = angular.copy($scope.new_slcted_indus_dic);
			pc_data['info'] = sl;
			var post_data = {'cmd_id': 12, 'data': $scope.menu_showing, 'pc_data': pc_data};
        	        $scope.ps = true;
	                tasService.ajax_request(post_data, 'POST', $scope.cb_npc_func);	
		}else{
			if(!(Object.keys($scope.menu_showing).length)){
				tasAlert.show('Nothing is selected.', 'warning', 1000);
				return;
			}
			//iterate(visible, $scope.side_menu_list, []);
			$scope.ps = true;
			var post_data = {'cmd_id': 8, 'project_id': $scope.slcted_indus_dic['project_id'], 'data': $scope.menu_showing};
			tasService.ajax_request(post_data, 'POST', $scope.cb_new_save);
		}
	}
	/***********************************/
	/*function iterate(visible, ar, p_ar){
		ar.forEach(function(r){
			if(r.visible[$scope.slcted_indus_dic.project_id]){
				visible[r.k]	= 'Y'
				p_ar.forEach(function(p){
					if(!(p in visible)){
						visible[p] ="N"	
					}
				})
			}
			var child	= r.submenu || []
			if(child.length)
				iterate(visible, child, p_ar.concat([r.k]));
		})
	}*/
	/***********************************/
	$scope.cb_new_save = function(res){
		$scope.ps = false;
		if(res['message']){
			if(res['message'] == 'done'){
				$scope.slt_cmp($scope.slcted_indus_dic);
			}else{
				tasAlert.show(res['message'], 'error', 1000);
			}
		}
	}
	/***********************************/
	$scope.add_in_show = true;
	$scope.ch_op_cm_all = false;
	$scope.div_height = function(){
		$scope.new_slcted_indus_dic = {'project_id': 'new', 'project_name': '', 'desc': '', 'db_name': '', 'info': []};
		$scope.add_in_show = !$scope.add_in_show;
		if($scope.add_in_show){
			$scope.editorOption = false;
			$scope.slcted_indus_dic = $scope.old_slcted_indus_dic;
			$scope.slt_cmp($scope.slcted_indus_dic);
		}else{
			if($scope.slcted_indus_dic['project_id'] !='new'){
				$scope.old_slcted_indus_dic =  $scope.slcted_indus_dic;
			}
			$scope.slcted_indus_dic =  $scope.new_slcted_indus_dic;
			$scope.editorOption = true;
			$timeout(function(){
                        	var getInput = document.querySelector("#newProject");
                        	getInput.focus();
                	});
			$scope.menu_showing = {};
			$scope.side_menu_list.forEach(function(r){
				$scope.menu_showing[r['k']] = 'Y';
                        	var chld = r.submenu || [];
				chld.forEach(function(c){
					$scope.menu_showing[c['k']] = 'Y';
				})
                	});
			$scope.ps = true;
			var post_data = {'cmd_id': 11};
			tasService.ajax_request(post_data, 'POST', $scope.cb_all_company);
		}
	}
	/***********************************/
	$scope.cb_all_company = function(res){
		$scope.ps = false;
		if(res['message']){
			if(res['message'] == 'done'){
				$scope.new_slcted_indus_dic['info'] = res['data'];
				$scope.ch_op_cm_all = true;
			}else{
				tasAlert.show(res['message'], 'error', 1000);
			}
		}
	}
	/***********************************/
	$scope.checked_option = function(obj, p_obj= {}){
		var flg = 'Y';
		if((obj['k'] in $scope.menu_showing) && $scope.menu_showing[obj['k']] == 'Y')
			flg = 'N';
		$scope.menu_showing[obj['k']] = flg;
		if(Object.keys(p_obj).length){
                        if(!(p_obj['k'] in $scope.menu_showing))
                        	$scope.menu_showing[p_obj['k']] = 'N';
		}
	}
	/***********************************/
	$scope.menu_sec_show_func = function(r){
		var child = r.submenu || [];
		if(r['k'] in $scope.menu_showing){
			if($scope.menu_showing[r['k']] == 'Y'){
				return true;
			}else if($scope.menu_showing[r['k']] == 'N' && child.length){
				for(var a=0, a_l=child.length; a<a_l; a++){
					var c = child[a];
					if(c['k'] in $scope.menu_showing && $scope.menu_showing[c['k']] == 'Y'){
						return true;		
					}
                                }
			}
		}	
		return false;
	}
	/***********************************/
	$scope.checked_option_comp = function(r){
		r['flg'] = !r['flg'];
	}
	/***********************************/
	$scope.checked_option_comp_all = function(){
		$scope.ch_op_cm_all = !$scope.ch_op_cm_all;
		$scope.new_slcted_indus_dic['info'].forEach(function(r){
			r['flg'] = $scope.ch_op_cm_all;
		});
	}
	/***********************************/
	$scope.cmp_edit = false;
	$scope.cmp_edit_option = function(){
		$scope.cmp_edit = true;
		$timeout(function(){
			$scope.configuration.scope.tab_select();
		})
	}
	/***********************************/
});
