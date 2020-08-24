app.controller("ModulesCntrl", function($scope, $rootScope, $http, $timeout, $location, $filter, $sce, tasAlert, tasService, uiGridConstants, uiGridTreeBaseService){
	$('#body_wrapper').show();
	$scope.Object = Object;
        var socket = io.connect();
	$scope.font_list = font_list;
	/***********************************/
	$scope.do_resize = function(){
        	$timeout(function(){
                	window.dispatchEvent(new Event('resize'));
        	});
    	}
	/***********************************/
	$scope.bind_html_func = function(value){
		return $sce.trustAsHtml(value);
    	}
	/***********************************/
	$scope.logout_func = function(){
		window.location.href = "/login";
	}
	/***********************************/
	$scope.remove_drag_func = function(){
		var cols = document.querySelectorAll('#drg_sec .mtr_card__list_group_item');
		[].forEach.call(cols, function(col) {
			col.removeAttribute('draggable');
			col.removeEventListener('dragstart', handleDragStart, false);
			col.removeEventListener('dragenter', handleDragEnter, false);
			col.removeEventListener('dragover', handleDragOver, false);
			col.removeEventListener('dragleave', handleDragLeave, false);
  			col.removeEventListener('dragend', handleDragEnd, false);
			col.style.opacity = '1';
			col.classList.add('waves-effect');
			col.removeAttribute('drop');
			col.removeEventListener('drop', handleDrop, false);
		});
	}
	/***********************************/
	$scope.add_drag_func = function(){
		var cols = document.querySelectorAll('#drg_sec .mtr_card__list_group_item');
		[].forEach.call(cols, function(col) {
			col.setAttribute('draggable', 'true');
			col.addEventListener('dragstart', handleDragStart, false);
			col.addEventListener('dragenter', handleDragEnter, false);
			col.addEventListener('dragover', handleDragOver, false);
			col.addEventListener('dragleave', handleDragLeave, false);
  			col.addEventListener('dragend', handleDragEnd, false);
			col.setAttribute('drop', 'true');
			col.classList.remove('waves-effect');
			col.addEventListener('drop', handleDrop, false);
		});
		var drop_div = document.getElementById('drop_div_id');
		drop_div.setAttribute('drop', 'true');
		drop_div.addEventListener('drop', handleDrop, false);
	}
	/***********************************/
	$scope.side_menu_active = true;
	$scope.inp_m_fltr = '';
	$scope.m_list = [];
	$scope.module_map_idx_dic = {};
	$scope.cl_bk_init_func = function(res){
		$scope.ps = false;
		if(res['message']){
			if(res['message'] == 'done'){
				$scope.m_list = res['data'];
				$scope.m_list.forEach(function(r, i){
					$scope.module_map_idx_dic[r['k']] = i;
				});
			}else{
				tasAlert.show(res['message'], 'error', 1000);
			}
		}
	}
	/***********************************/
	$scope.init_func = function(){
		var post_data = {'cmd_id': 25};
		$scope.ps = true;
		tasService.ajax_request(post_data, 'POST', $scope.cl_bk_init_func);
	}
	$scope.init_func();
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
		$scope.ps = false;
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
                $scope.ps = true;
                tasService.ajax_request(post_data, 'POST', $scope.cl_bk_module_save_func);
        }
	/***********************************/
	$scope.module_edit_flg = false;
	$scope.module_click_func = function(m){
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
				$scope.add_drag_func();
			}, 100);
		}else{
			$scope.remove_drag_func();
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
		console.log($scope.icons_list)	
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
	var dragSrcEl = null;
	function handleDragStart(e) {
		this.style.opacity = '1';
		dragSrcEl = this;
  		e.dataTransfer.effectAllowed = 'move';
  		e.dataTransfer.setData('text/html', this.innerHTML);	
		console.log(dragSrcEl);
	}
	/***********************************/
	function handleDragOver(e) {
  		if (e.preventDefault) {
    			e.preventDefault();
		}
		e.dataTransfer.dropEffect = 'move';
		return false;		
	}
	/***********************************/
	function handleDragEnter(e) {
		this.classList.add('over');
	}
	/***********************************/
	function handleDragLeave(e) {
  		if (e.preventDefault) {
    			e.preventDefault();
		}
  		this.classList.remove('over');
	}
	/***********************************/
	function handleDrop(e){
		console.log(dragSrcEl);
		if (e.stopPropagation) {
    			e.stopPropagation();
		}
		if (dragSrcEl != this) {
			dragSrcEl.innerHTML = this.innerHTML;
    			this.innerHTML = e.dataTransfer.getData('text/html');	
		}
		return false;
		
	}
	/***********************************/
	function handleDragEnd(e){
  		if (e.preventDefault) {
    			e.preventDefault();
		}
		/*[].forEach.call(cols, function (col) {
    			col.classList.remove('over');
  		});*/
	}
	/***********************************/
	/***********************************/
	/***********************************/
	/***********************************/
});
