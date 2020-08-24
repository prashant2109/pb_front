String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
};
var scope;
app.controller("MonitorCntrl", function($scope, $rootScope, $http, $timeout, $location, $filter, $sce, tasAlert, tasService, uiGridConstants, uiGridTreeBaseService){
        scope = $scope;
	$('#body_wrapper').show();
	$scope.menu_showing = {};
	$scope.show_alert_flg = false;
	$scope.filterRow_comp = '';
	$scope.Object = Object;
        var socket = io.connect();
	$scope.source_scope = {parent_scope: $scope};
	$scope.schedule_scope = {parent_scope: $scope};
	if(!('project_info' in sessionStorage)){
		sessionStorage['project_info'] = JSON.stringify({});
	}
	if(!('slcted_indus_p_id' in sessionStorage)){
                sessionStorage['slcted_indus_p_id'] = '';
        }
	if(!('slcted_comp_c_id' in sessionStorage)){
                sessionStorage['slcted_comp_c_id'] = '';
        }
	if(!('side_menu_active' in sessionStorage)){
		sessionStorage['side_menu_active'] = 1;
	}
	if(!('mmenu_k' in sessionStorage)){
		sessionStorage['mmenu_k'] = '';
	}
	$scope.side_menu_active =  parseInt(sessionStorage['side_menu_active']);
	$scope.side_menu_slcted_flg = JSON.parse(sessionStorage['project_info'] || '{}');
	$scope.side_mmenu_k = sessionStorage['mmenu_k'] || '';
	$scope.slcted_indus_dic = {};
	$scope.slcted_comp_dic = {};
	$scope.doc_view_enable = false;
	/***********************************/
	$scope.tas_alert_section_close = function(){
        	tasAlert.hide();
    	}
	/***********************************/
	$scope.information_scope = { 
		parent_scope: $scope,
		host: 'http://172.16.20.232:2061/tree_data?input=',
		cmd_dict: {split_cmd: 7024 , list_cmd: 199 , texo_1_cmd: 7025 , texo_grid_cmd: 7027, grid_type_cmd: 7031, cgi_cmd: 22},
		tabs: []
        };
        $scope.sel_types = {"all_tables": ["Tables"], "sen_table_desc": ["Sentences-Table Descriptions"], "sen_addit": ["Sentences Additional"], "other_txt_t_tble": ['Entity', 'Key Value'], "foot_notes": ["Foot-Notes"], 'exha_data': ["Tables", "Sentences-Table Descriptions", "Sentences Additional", 'Entity', 'Key Value', "Foot-Notes"], 'table_analys': ['Tables', 'Foot-Notes'], 'text_to_table': ['Sentences Additional', 'Sentences-Table Descriptions', 'Entity', 'Key Value']};
	/***********************************/
     	$scope.buider_rca = {
		parent_scope: $scope, 
		host: "http://172.16.20.232:2063/tree_data", 
		cmd_dict: {'getRca': 7030}
	};
	/***********************************/
         $scope.modeltraining = {
                parent_scope: $scope,
                host: "http://172.16.20.10:1122/post_method",
                flag: "demo"
         };
	/***********************************/
         $scope.modeltraining_1 = {
                parent_scope: $scope,
                host: "http://172.16.20.10:1122/post_method",
                flag: "demo"
         };
	/***********************************/
	$scope.outputviewOptions = {
		parent_scope : $scope,
		host: 'http://172.16.20.232:2058/tree_data?input=',
		cmd_dict: {'loadData': 228, 'loadDatainput': 97001, 'getbottomgridInfo': 229, 'getbottomgridInfoinput': 97002, 'getgraphinfo': 229, 'getgraphinfoinput': 97002},
		docs: []
	}
	/***********************************/
	$scope.enterprise = {
		parent_scope: $scope, 
		host: 'http://172.16.20.232/cgi-bin/UML/cgi_wrapper_data.py?inp_detail=',
		cmd_dict: {'getEtp': 2}
	};
	/***********************************/
	$scope.side_menu_list = []; //menu_list;
	/***********************************/
	$scope.side_menu_slcted_name_func = function(dic){
		if('full_name' in dic)
			return dic['full_name'];
		else
			return dic['n'] || '';
		return '';
	}
	/***********************************/
	$scope.slcted_rca_dic = {}
	$scope.change_rca_docs = function(doc){
		$scope.slcted_rca_dic['t'] = doc;
		$scope.review_prjct_click_func(doc);
	}
	/***********************************/
	$scope.refOptions = {
		id: 'ref_frame_id',
		htmlRef: true,
		pdfRef: false,
		htmlType: 'pdf',
		active: 'html',
		dropDown: true,
		path: 'src/no_ref_found.html',
		pno_list:  [1, 2, 3, 4, 5],
		selected_pno: 1,
		parent_scope:  $scope,
		options: {zoom: true, clear: true, multiselect: true},	
		ref	: {},
	} 
	/***********************************/
	//$scope.docs_grid_data = [];
	$scope.comp_sel_fun = false;
	$scope.comp_click_func = function(comp){
		$scope.comp_sel_fun = true;
		$scope.slcted_comp_dic = comp;
		sessionStorage['slcted_comp_c_id']= comp['company_id'];
		if('info' in $scope.slcted_comp_dic){
			$scope.all_docs['checked']	= true
			$scope.gridOptionsDoc.columnDefs = gridOptionsDoccolumnDefs_func();
			$scope.gridOptionsDoc.data = $scope.slcted_comp_dic['info'].map(function(r){r.checked=true;return r});
		}
		$scope.side_menu_click_func($scope.side_menu_slcted_flg, $scope.side_mmenu_k);
	}
	/***********************************/
	$scope.menu_showing_idx = 0;
	$scope.cb_get_slct_indus_func = function(res, flg, stat){
                $scope.ps = false;
		$scope.menu_showing_idx = 0;
                if(res['message']){
                        if(res['message'] == 'done'){
                                $scope.menu_showing = res['data'];
				if(flg){
					for(var a=0, a_l=$scope.side_menu_list.length; a<a_l;a++){
						var r_m = $scope.side_menu_list[a];
						if(stat){
							if(r_m['k'] in $scope.menu_showing && $scope.menu_showing[r_m['k']] == 'Y' && 'doc_view' in r_m && r_m['doc_view']){
                                                                $scope.menu_showing_idx = a;
                                                                break;
                                                        }
						}else{
							if(r_m['k'] in $scope.menu_showing && $scope.menu_showing[r_m['k']] == 'Y'){
								$scope.menu_showing_idx = a;
								break;
							}
						}
					}
					$scope.side_menu_click_func($scope.side_menu_list[$scope.menu_showing_idx]);		
				}else{
					$scope.comp_click_func($scope.slcted_comp_dic);
				}
                        }else{
                                tasAlert.show(res['message'], 'error', 1000);
                        }
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
        $scope.get_slct_indus_func = function(flg=false, stat=false){
                $scope.ps = true;
                var post_data = {'cmd_id': 9, 'project_id': $scope.slcted_indus_dic['project_id']};
                tasService.ajax_request(post_data, 'POST', function(res){
			$scope.cb_get_slct_indus_func(res, flg, stat);
		});
        }
	/***********************************/
	$scope.slct_indus_func = function(ind){
		$scope.comp_data = [];
		$scope.comp_c_id_idx_map = {};
		$scope.slcted_indus_dic = ind;
		sessionStorage['slcted_indus_p_id']= ind['project_id'];
		$scope.get_slct_indus_func(true);
		if('info' in ind){
			$scope.comp_data = ind['info'];
			$scope.comp_data.forEach(function(r, i){
				$scope.comp_c_id_idx_map[r['company_id']] = i;
			});
			if($scope.comp_data.length){
				$scope.comp_click_func($scope.comp_data[0]);
			}
		}
        }
	/***********************************/
	$scope.gridOptions = {
		rowHeight:35, enableFiltering:true, noUnselect : false, enableSorting:false, showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false, enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false, columnDefs:[],
		onRegisterApi: function (gridApi) {
		    $scope.gridApi = gridApi;
		}
    	}
	/***********************************/
        $scope.gridOptionsDoc = {
		enableRowSelection: true,
    rowHeight:35, enableFiltering:true, noUnselect : false, enableSorting:false, showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false, enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false, columnDefs:[],
		onRegisterApi: function (gridApi) {
		    $scope.gridApiDoc = gridApi;
		}
    	}
	/***********************************/
	$scope.all_docs	= {'checked':false}
     var gridOptionsColumnSn_all = `
                <div class="ui-grid-header-cell" style="padding: 0px; cursor: pointer;    background: #fff;width: 40px;border: 0px;height: 48px;">
                        <div class="ui-grid-cell-contents"  style="padding-right: 4px;">
			<div class="d-inline pull-left" style="margin-top: 8px;">
						<div class="checkbox checkbox-info checkbox-fill checkbox_doc">
							<input type="checkbox" ng-click="grid.appScope.toggleCheckerAll(false, grid.appScope.all_docs, '1')" id="all_dview"  title="{{grid.appScope.all_docs['checked']}}" checked>
							<label for="all_dview" class="cr"></label>	
						</div>
					</div>
                        </div>
                </div>`;
	/***********************************/
    $scope.toggleCheckerAll = function(flg, aa, bb){
	$scope.row_chck_dic = {};
	$scope.all_docs['checked'] = !$scope.all_docs['checked']
        	var filteredRows = $scope.gridApiDoc.core.getVisibleRows($scope.gridApiDoc.grid);
		for (var  i = 0; i < filteredRows.length; i++) {
		    var tid = filteredRows[i]['entity'];
		   tid['checked']	= $scope.all_docs['checked']
		}
    }
	/***********************************/
		var gridOptions_columnDef = [
	    {
			field: 'sn',
			displayName: 'S.No',
			width: 60,
			pinnedLeft: false,
			pinnedRight: false,
			cellEditableCondition:false,
			headerCellClass: 'hdr_cntr',
			cellTemplate:
			        `<div class="ui-grid-cell-contents row_col_grid_cell">
				        {{grid.appScope.gridOptions.data.indexOf(row.entity)+1}}
			        </div>`,
        },
		{
            field: 'sd',
            displayName: 'Source Date',
            width: '120',
            pinnedLeft: false,
            pinnedRight: false,
            cellEditableCondition:false,
			headerCellClass: 'hdr_cntr',
            cellTemplate:
                        `<div class="ui-grid-cell-contents row_col_grid_cell did" ng-class="{hold_status: row.entity.holdstatus, pub_stst_cl: row.entity.pub_sts=='Y'}">
			            	{{COL_FIELD}}
                        </div>`
        },
		{
            field: 'n',
            displayName: 'Headline',
            width: '*',
	    minWidth: 80,
            pinnedLeft: false,
            pinnedRight: false,
            cellEditableCondition:false,
			headerCellClass: 'hdr_cntr',
            cellTemplate:
                     `<div class="ui-grid-cell-contents row_col_grid_cell project" title="{{COL_FIELD}}">
			            	{{COL_FIELD}}
                     </div>`
        },
        {
            field: 'dtype',
            displayName: 'Format',
            width: 100,
            minWidth: 80,
            pinnedLeft: false,
            pinnedRight: false,
            cellEditableCondition:false,
            headerCellClass: 'hdr_cntr',
            cellTemplate:
                     `<div class="ui-grid-cell-contents row_col_grid_cell market" style="text-align: center;padding: 0px;">
                            <i class="fa" ng-class="{'fa-link': row['entity']['dtype'] == 'Link', 'fa-file-pdf-o': row['entity']['dtype'] == 'PDF'}" aria-hidden="true"></i>
                     </div>`
        },
        {
            field: 'link',
            displayName: 'Original Link',
            width: 100,
            minWidth: 80,
            pinnedLeft: false,
            pinnedRight: false,
            cellEditableCondition:false,
            headerCellClass: 'hdr_cntr',
            cellTemplate:
                     `<div class="ui-grid-cell-contents row_col_grid_cell market" style="text-align: center;padding: 0px;">
                     	 <a href="{{row.entity.link}}" target="_blank" title="{{row.entity.link}}"> <i class="fa fa-external-link" aria-hidden="true"></i></a>       
                     </div>`
        },
		{
            field: 'process',
            displayName: 'Process',
            width: '100',
            pinnedLeft: false,
            pinnedRight: false,
            cellEditableCondition:false,
			headerCellClass: 'hdr_cntr',
            cellTemplate:
                        `<div class="ui-grid-cell-contents row_col_grid_cell qa1 status_{{row.entity.qa1_s}}" style="text-align: center;padding: 0px;" ng-click='grid.appScope.processdocument(row.entity)'>
				<i class="fa fa-history" aria-hidden="true"></i>
                        </div>`
        },
	];
	/***********************************/
	$scope.gridOptions.columnDefs = gridOptions_columnDef;
	$scope.gridOptions.data = []; 
	/***********************************/
	function gridOptionsDoccolumnDefs_func(){
		var gridOptions_columnDef = [
			
			{
		field: '#',
                displayName: '#',
                width: 40,
		pinnedLeft: true,
                cellEditableCondition:false,
		headerCellClass: 'hdr_cntr',
		'headerCellTemplate':gridOptionsColumnSn_all,
		cellTemplate:
		`<div class="ui-grid-cell-contents" style="padding: 0px; cursor: pointer;">
                        <div class="ui-grid-cell-contents">
                               <div class="d-inline pull-left">
						<div class="checkbox checkbox-info checkbox-fill checkbox_doc">
							<input type="checkbox" id="ch_{{row.entity.d}}" ng-model="row.entity.checked"  title="{{row.entity}}">
							<label for="ch_{{row.entity.d}}" class="cr"></label>	
						</div>
					</div> 
                        </div>
                </div>`
          },	

		    {
				field: 'sn',
				displayName: 'S.No',
				width: 60,
				pinnedLeft: false,
				pinnedRight: false,
				cellEditableCondition:false,
				headerCellClass: 'hdr_cntr',
				cellTemplate:
					`<div class="ui-grid-cell-contents row_col_grid_cell docc">
						{{grid.appScope.gridOptionsDoc.data.indexOf(row.entity)+1}}
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
				`<div class="ui-grid-cell-contents row_col_grid_cell did docc" ng-class="{hold_status: row.entity.holdstatus, pub_stst_cl: row.entity.pub_sts=='Y'}">
						{{COL_FIELD}}
				</div>`
		},
			{
		    field: 'doc_name',
		    displayName: 'Doc Name',
		    width: '*',
		    minWidth: 80,
		    pinnedLeft: false,
		    pinnedRight: false,
		    cellEditableCondition:false,
				headerCellClass: 'hdr_cntr',
		    cellTemplate:
			     `<div class="ui-grid-cell-contents row_col_grid_cell project docc" title="{{COL_FIELD}}">
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
                             `<div class="ui-grid-cell-contents row_col_grid_cell market docc" style="text-align: center;padding: 0px;">
                                         <span ng-if="COL_FIELD == 'Y' || COL_FIELD == 'E'" class="stu_crcle stu_crcle_{{COL_FIELD}}"></span> 
                                         <span ng-if="COL_FIELD == 'N' || COL_FIELD == 'P'" class="stu_prcs" style="font-size: 15px;color: #2196F3;"><i class="fa fa-spinner fa-spin fa-pulse"></i></span> 
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
			     `<div class="ui-grid-cell-contents row_col_grid_cell market docc" style="text-align: center;padding: 0px;">
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
			     `<div class="ui-grid-cell-contents row_col_grid_cell market docc" style="text-align: center;padding: 0px;">
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
                             `<div class="ui-grid-cell-contents row_col_grid_cell market docc" style="text-align: center;padding: 0px;">
                                                {{COL_FIELD}}
                             </div>`
                },
		{
		    field: 'review',
		    displayName: 'Review',
		    width: '80',
		    pinnedLeft: false,
		    pinnedRight: false,
		    cellEditableCondition:false,
				headerCellClass: 'hdr_cntr',
		    cellTemplate:
				`<div class="ui-grid-cell-contents row_col_grid_cell review slct_grd_arw docc" ng-click="grid.appScope.review_prjct_click_func(row.entity)" style="text-align: center;padding: 0px;">
					<i class="fa fa-arrow-right review" aria-hidden="true"></i> 
            			</div>`
		},
		];
		return gridOptions_columnDef; 
	}
	/***********************************/
	$scope.do_resize = function(){
        	$timeout(function(){
                	window.dispatchEvent(new Event('resize'));
        	});
    	}
	/***********************************/
	
	$scope.side_menu_func = function(){
		$scope.side_menu_active = !$scope.side_menu_active;
                sessionStorage['side_menu_active'] = $scope.side_menu_active?1:0;
		$timeout(function(){
			$scope.do_resize();
		});
	}
	/***********************************/
	$scope.slct_yrs_func = function(row){
		if(!row)
			return;
		$scope.slcted_yrs_dic = row;
		Highcharts.chart('year_wise_chart_id', {
		  chart: {
		    type: 'column'
		  },
		  title: {
		    text: row['n']
		  },
		  subtitle: {
		    text: ''
		  },
		  xAxis: {
		    categories: row['categories'],
		    crosshair: true
		  },
		  yAxis: {
		    min: 0,
		    title: {
		      text: 'Documents'
		    }
		  },
		  tooltip: {
		    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		      '<td style="padding:0"><b>{point.y} </b></td></tr>',
		    footerFormat: '</table>',
		    shared: true,
		    useHTML: true
		  },
		  plotOptions: {
		    column: {
		      pointPadding: 0.2,
		      borderWidth: 0
		    }
		  },
		  series: row['series']
		});
		
	}
	/***********************************/
	$scope.slct_data_func = function(row){
		$scope.slcted_data_dic = row;
		$scope.gridOptions.data = [];
		if('uinfo' in row){
			$scope.gridOptions.data = Object.values(row['uinfo']);
			$scope.gridOptions.data = $scope.gridOptions.data.sort(function(a, b){return a['sn'] - b['sn'];});
		}
	}
	/***********************************/
	$scope.cl_bk_init_func = function(res){
		$scope.ps = false;
		if(res['message']){
			if(res['message']=='done'){
				$scope.monitor_res_dic = res;
				if('ysts' in $scope.monitor_res_dic && $scope.monitor_res_dic['ysts'].length){
					$scope.slcted_yrs_dic = $scope.monitor_res_dic['ysts'][0];
					 if($scope.side_menu_slcted_flg['k'] == 'crawling_monitoring'){
						$timeout(function(){
							$scope.slct_yrs_func($scope.slcted_yrs_dic);
						}, 100);
					}
				}
				if('data' in $scope.monitor_res_dic && $scope.monitor_res_dic['data'].length){
					$scope.slcted_data_dic =  $scope.monitor_res_dic['data'][0];
					$scope.slct_data_func($scope.slcted_data_dic);
				}
			}else{
				tasAlert.show(res['message'], 'error', 1000);
			}
		}
	}
	/***********************************/
	$scope.cl_bk_get_menu = function(res){
                $scope.ps = false;
		if(res['message']){
			if(res['message'] == 'done'){
                		$scope.side_menu_list = res['data'];
                		//$scope.side_menu_list = menu_list;
                		$scope.get_slct_indus_func();
			}
		}
        }
	/***********************************/
	$scope.get_side_menu_func = function(){
		var post_data = {'cmd_id': 33}
                $scope.ps = true;
                tasService.ajax_request(post_data, 'POST',$scope.cl_bk_get_menu);
	}
	/***********************************/
        $scope.industry_p_id_idx_map = {};
        $scope.comp_c_id_idx_map = {};
	$scope.get_comp_list_func = function(){
		var post_data = {'cmd_id': 2};
                $scope.ps = true;
                tasService.ajax_request(post_data, 'POST', function(res){
			$scope.ps = false;
			if(res['message']){
				if(res['message']=='done'){
					$scope.industry_type_list = res['data'];
					$scope.industry_type_list.forEach(function(r, i){
						$scope.industry_p_id_idx_map[r['project_id']] = i;
					});
					if(sessionStorage['slcted_indus_p_id'] != '')
						$scope.slcted_indus_dic = $scope.industry_type_list[$scope.industry_p_id_idx_map[sessionStorage['slcted_indus_p_id']]];
					else
						$scope.slcted_indus_dic = $scope.industry_type_list[0];	
        				$scope.comp_data = $scope.slcted_indus_dic['info'];
					$scope.comp_data.forEach(function(r, i){
                                                $scope.comp_c_id_idx_map[r['company_id']] = i;
                                        });
					if(sessionStorage['slcted_comp_c_id'] != '')
                                                $scope.slcted_comp_dic = $scope.comp_data[$scope.comp_c_id_idx_map[sessionStorage['slcted_comp_c_id']]];
                                        else
                                                $scope.slcted_comp_dic = $scope.comp_data[0];
					$scope.get_side_menu_func();
				}else{
					tasAlert.show(res['message'], 'error', 1000);
				}
			}
		});
	}
	$scope.get_comp_list_func();
	/***********************************/
	$scope.pre_taxo_path = '';
	$scope.selected_company_data = ''
	$scope.side_menu_click_func = function(menu, mmenu_k=menu['k']){
		$scope.side_menu_slcted_flg = menu;
		sessionStorage['project_info']= JSON.stringify(menu);
		sessionStorage['mmenu_k']= mmenu_k;
		$scope.doc_view_enable = false;
		$scope.side_mmenu_k = mmenu_k;
		if(menu.doc_view && $scope.slcted_indus_dic['project_id'] != 'FE'){
			$scope.all_docs['checked'] = true;
                        $scope.gridOptionsDoc.columnDefs = gridOptionsDoccolumnDefs_func();
			$scope.gridOptionsDoc.data = $scope.slcted_comp_dic['info'].map(function(r){r.checked=true;return r});
			return;
		}
		if($scope.side_menu_slcted_flg['k'] == 'crawling_monitoring'){
			$scope.slcted_data_dic = {};
			$scope.gridOptions.data = [];
			var post_data = {'cmd_id': 1, 'project_id': $scope.slcted_comp_dic['monitor_id']};
			$scope.ps = true;
			tasService.ajax_request(post_data, 'POST', $scope.cl_bk_init_func);
		}else if($scope.side_menu_slcted_flg['k'] == 'pre_taxo'){
				cmpy_list = [];
				$scope.slcted_indus_dic['info'].forEach(function(row){
					cmpy_list.push({'company_name':row['company_id'], 'disp_name':row['company_name']});	
				});
				var dic = [{'company_name': $scope.slcted_comp_dic['company_id'], 'project_id': $scope.slcted_indus_dic['project_id'], 'company_list': cmpy_list}];
			dic = JSON.stringify(dic);
			$scope.pre_taxo_path = 'http://172.16.20.10:4446/taxo_demo?input='+dic;
			$timeout(function(){
				var ifrm_dom = document.getElementById('pre_taxo_id');
		       		ifrm_dom.setAttribute('src', $scope.pre_taxo_path);
			}, 100);
		}else{
			$scope.pre_taxo_path = '';
			if($scope.side_menu_slcted_flg['k'] == 'slt'){
				var dic  = [{'project_id': $scope.slcted_indus_dic['project_id'], 'company_name': $scope.slcted_comp_dic['company_id'], 'doc_id': '14',  'dbname': $scope.slcted_indus_dic['db_name']}];
				dic = JSON.stringify(dic);
                        	$scope.pre_taxo_path = 'http://172.16.20.10:5008/slt_demo?input='+dic;
			}else if($scope.side_menu_slcted_flg['k'] == 'taxonomy_link'){
				$scope.pre_taxo_path = 'http://172.16.20.7/LinkBase_Builder_DEMO_270819/#/index?pid='+$scope.slcted_indus_dic['project_id']+'&cid='+$scope.slcted_comp_dic['company_id'];
			}else if($scope.side_menu_slcted_flg['k'] == 'data_models'){
				$timeout(function(){
					$scope.enterprise.scope.enterprise_data();
				});
				return;
			}else if($scope.side_menu_slcted_flg['k'] == 'search'){
				var cmp_map = {'Amazon':'Amazon','JPMorgan':'JP Morgan','AmericanAirlines':'American Airlines','GAPInc':'GAp Inc'}
				var dic  = [{'project_id': $scope.slcted_indus_dic['project_id'], 'company_name': cmp_map[$scope.slcted_comp_dic['company_name']]||$scope.slcted_comp_dic['company_name'], 'doc_id': '14'}];
                                dic = JSON.stringify(dic);
				$scope.pre_taxo_path = 'http://172.16.20.232:2061/searchv_demo?input='+dic;
			}else if($scope.side_menu_slcted_flg['k'] == 'ocr'){
				//$scope.pre_taxo_path = 'http://172.16.10.62:1100/documentreview?input=[{%22selected_docid%22:%22401%22,%22doc_name%22:%22script%22,%22from%22:%220%22,%22pages%22:%22all%22,%22page_count%22:%221%22}]';
				$scope.pre_taxo_path = 'http://172.16.10.62:1101/document_demo?input={}';
			}else if($scope.side_menu_slcted_flg['k'] == 'review_output' || $scope.side_menu_slcted_flg['k'] == 'data_builder_rca'){
				setTimeout(function(){
					$scope.buider_rca.scope.get_rca($scope.slcted_indus_dic, $scope.slcted_comp_dic);
				});
				return;
			}else if($scope.side_menu_slcted_flg['k'] == 'focused_extrc'){
				if($scope.slcted_indus_dic['project_id'] == "FE"){
					dic = {'deal_id':  $scope.slcted_comp_dic['deal_id'], 'company_name':  $scope.slcted_comp_dic['company_id'], 'project_id':$scope.slcted_comp_dic['model_number'], 'model_number':$scope.slcted_comp_dic['model_number'], 'industry_type':$scope.slcted_comp_dic['industry_type'], 'project_name':$scope.slcted_comp_dic['project_name'], 'reporting_type': ['Both']}
					dic = JSON.stringify(dic);
					$scope.pre_taxo_path = 'http://172.16.20.229:5566/review_demo?input='+dic;
				}else if( $scope.slcted_indus_dic['project_id'] == '39'){
					if($scope.slcted_comp_dic['company_id'] == 'Amazon'){
						$scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=FD&ProjectID=15&user_id=nitin&pid='+$scope.slcted_indus_dic['project_id'];
					}else if($scope.slcted_comp_dic['company_id'] == 'JPMorgan'){
						$scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=FD&ProjectID=16&user_id=nitin&pid='+$scope.slcted_indus_dic['project_id'];
					}else if($scope.slcted_comp_dic['company_id'] == 'AmericanAirlines'){
						$scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=FD&ProjectID=17&user_id=nitin&pid='+$scope.slcted_indus_dic['project_id'];
					}else if($scope.slcted_comp_dic['company_id'] == 'GAPInc'){
						$scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=FD&ProjectID=18&user_id=nitin&pid='+$scope.slcted_indus_dic['project_id'];
					}
				}else if( $scope.slcted_indus_dic['project_id'] == '40'){
					if($scope.slcted_comp_dic['company_id'] == 'HSBC-FixedIncome'){
						$scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=FD&ProjectID=21&user_id=nitin&pid='+$scope.slcted_indus_dic['project_id'];
					}else if($scope.slcted_comp_dic['company_id'] == 'HSBC-Liquidity'){
						$scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=FD&ProjectID=22&user_id=nitin&pid='+$scope.slcted_indus_dic['project_id'];
					}else if($scope.slcted_comp_dic['company_id'] == 'HSBC-Equity'){
						$scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=FD&ProjectID=23&user_id=nitin&pid='+$scope.slcted_indus_dic['project_id'];
					}else if($scope.slcted_comp_dic['company_id'] == 'HSBC-MultiAsset'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=FD&ProjectID=24&user_id=nitin&pid='+$scope.slcted_indus_dic['project_id']
                                        }else if($scope.slcted_comp_dic['company_id'] == 'UBS-Equity'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=FD&ProjectID=25&user_id=nitin&pid='+$scope.slcted_indus_dic['project_id']
                                        }else if($scope.slcted_comp_dic['company_id'] == 'WellsFargo-Equity'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=FD&ProjectID=26&user_id=nitin&pid='+$scope.slcted_indus_dic['project_id']
                                        }else if($scope.slcted_comp_dic['company_id'] == 'StateStreet-Equity'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=FD&ProjectID=27&user_id=nitin&pid='+$scope.slcted_indus_dic['project_id']
					}else if($scope.slcted_comp_dic['company_id'] == 'BlackRock-FixedIncome'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=FD&ProjectID=28&user_id=nitin&pid='+$scope.slcted_indus_dic['project_id']
					}
				}
			}else if($scope.side_menu_slcted_flg['k'] == 'output'){
				if($scope.slcted_indus_dic['project_id'] == "FE"){
                                	$scope.output_sclted_sub_click_func('op_view');
                       		} 
			}else if($scope.side_menu_slcted_flg['k'] == 'model_mapping_rca'){
				if($scope.slcted_indus_dic['project_id'] == 'FE'){
					var _did = $scope.slcted_comp_dic['info'].slice(-1)[0]['d'];
				 	$scope.pre_taxo_path = 'http://172.16.20.232:2062/projectv_demo?view=RCA&cid='+[$scope.slcted_comp_dic['company_id'], $scope.slcted_comp_dic['model_id'], _did].join('_')+'&pid='+$scope.slcted_comp_dic['rc_id']+'&user='+$scope.slcted_comp_dic['rc_user'];
				}else if($scope.slcted_indus_dic['project_id'] == '37'){
                                        dic = {'project_id':$scope.slcted_indus_dic['project_id'], 'crid':$scope.slcted_comp_dic['crid']}
                                        dic = JSON.stringify(dic);
                                        $scope.pre_taxo_path = 'http://172.16.20.52:7788/review_model_demo?input='+dic;
				}
			}else if($scope.side_menu_slcted_flg['k'] == 'edit_op_temp'){
				if( $scope.slcted_indus_dic['project_id'] == '39'){
                                        if($scope.slcted_comp_dic['company_id'] == 'Amazon'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=Modal&ProjectID=15&user_id=nitin';
                                        }else if($scope.slcted_comp_dic['company_id'] == 'JPMorgan'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=Modal&ProjectID=16&user_id=nitin';
                                        }else if($scope.slcted_comp_dic['company_id'] == 'AmericanAirlines'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=Modal&ProjectID=17&user_id=nitin';
                                        }else if($scope.slcted_comp_dic['company_id'] == 'GAPInc'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=Modal&ProjectID=18&user_id=nitin';
                                        }
                                }else if( $scope.slcted_indus_dic['project_id'] == '40'){
					if($scope.slcted_comp_dic['company_id'] == 'HSBC-Liquidity'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=Modal&ProjectID=22&user_id=nitin';
                                        }else if($scope.slcted_comp_dic['company_id'] == 'HSBC-FixedIncome'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=Modal&ProjectID=20&user_id=nitin';
                                        }else if($scope.slcted_comp_dic['company_id'] == 'BlackRock-FixedIncome'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=Modal&ProjectID=28&user_id=nitin';
                                        }else if($scope.slcted_comp_dic['company_id'] == 'HSBC-MultiAsset'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=Modal&ProjectID=24&user_id=nitin';
                                        }
					else if($scope.slcted_comp_dic['company_id'] == 'UBS-Equity'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=Modal&ProjectID=25&user_id=nitin';
                                        }else if($scope.slcted_comp_dic['company_id'] == 'WellsFargo-Equity'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=Modal&ProjectID=26&user_id=nitin';
                                        }else if($scope.slcted_comp_dic['company_id'] == 'StateStreet-Equity'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=Modal&ProjectID=27&user_id=nitin';
                                        }else if($scope.slcted_comp_dic['company_id'] == 'HSBC-Equity'){
                                                $scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=Modal&ProjectID=23&user_id=nitin';
                                        }
	
                                }else{
                                	//$scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=Modal&ProjectID=9&user_id=nitin';
                                	$scope.pre_taxo_path = 'http://172.16.20.232:2061/projectv_demo?view=Modal&ProjectID=1&user_id=tas';
				}
			}else if($scope.side_menu_slcted_flg['k'] == 'all_tables' || $scope.side_menu_slcted_flg['k'] == 'foot_notes' || $scope.side_menu_slcted_flg['k'] == 'sen_table_desc' || $scope.side_menu_slcted_flg['k'] == 'sen_addit' || $scope.side_menu_slcted_flg['k'] == 'other_txt_t_tble'){
				if($scope.selected_company_data == '' || $scope.comp_sel_fun == true){
					$scope.slcted_rca_dic['t'] = $scope.slcted_comp_dic['info'][0];
                                 	$scope.slcetd_doc_view_dic = $scope.slcted_comp_dic['info'][0];
					var temp_cmp_id = [$scope.slcted_comp_dic['company_id'], $scope.slcted_comp_dic['model_id'], $scope.slcted_comp_dic['info'][0]['d']].join('_');
                                 	//var temp_cmp_id = $scope.slcted_comp_dic['company_name']+"_"+$scope.slcted_indus_dic['project_id']+'_'+$scope.slcted_comp_dic['info'][0]['d'];
                              	}else{
					var temp_cmp_id = $scope.selected_company_data;
				}
                              	$scope.information_scope.tabs  = $scope.sel_types[$scope.side_menu_slcted_flg['k']]
		              	$scope.doc_view_enable = true;
                              	$timeout(function(){
                              		$scope.information_scope.scope.move_direct(temp_cmp_id);
                              	}, 200); 
				return;
                        }
                        $timeout(function(){
                                var ifrm_dom = document.getElementById('slt_frame_id');
				if(ifrm_dom)
	                                ifrm_dom.setAttribute('src', $scope.pre_taxo_path);
                        }, 100);
		}
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
	$scope.output_sclted_sub_menu = null;
	$scope.output_sclted_sub_click_func = function(ky){
		$scope.output_sclted_sub_menu = ky;
		$scope.pre_taxo_path = '';
		if($scope.slcted_indus_dic['project_id'] == "FE"){
			if($scope.output_sclted_sub_menu == 'op_view'){
				var compare_deal_ids = [[$scope.slcted_comp_dic['model_number'], $scope.slcted_comp_dic['deal_id']].join('_')];
				$scope.slcted_indus_dic['info'].forEach(function(row){
					if(row['deal_id'] !=$scope.slcted_comp_dic['deal_id'] && row['deal_id'] != '86' && row['deal_id'] != '88'){
						compare_deal_ids.push([row['model_number'], row['deal_id']].join('_'));
					}
				});
				dic = {'deal_id':  $scope.slcted_comp_dic['deal_id'], 'company_name':  $scope.slcted_comp_dic['company_id'], 'project_id':$scope.slcted_comp_dic['model_number'], 'model_number':$scope.slcted_comp_dic['model_number'], 'industry_type':$scope.slcted_comp_dic['industry_type'], 'project_name':$scope.slcted_comp_dic['project_name'], 'project_disp_list':$scope.slcted_comp_dic['project_name'], 'compare_deal_ids': compare_deal_ids, 'slcted_kpi_dic': {'time_series':'Y', 'k':'PassengerTransportation-Airline', 'l': 'KPIs(Airline Industry)', 'sheet_name': 'PassengerTransportation-Airline', 'pname': 'Airline', 'template_id':1, 't_ids':[]}, 'reporting_type': ['Both']}
				dic = JSON.stringify(dic);
				$scope.pre_taxo_path = 'http://172.16.20.229:5566/review_demo?input='+dic;
			}else{
				dic = {'deal_id':  $scope.slcted_comp_dic['deal_id'], 'company_name':  $scope.slcted_comp_dic['company_id'], 'project_id':$scope.slcted_comp_dic['model_number'], 'model_number':$scope.slcted_comp_dic['model_number'], 'industry_type':$scope.slcted_comp_dic['industry_type'], 'project_name':$scope.slcted_comp_dic['project_name']};
				dic = JSON.stringify(dic);
                                $scope.pre_taxo_path = 'http://172.16.20.229:7654/validation_demo?input='+dic;
			}	
		}
		$timeout(function(){
			var ifrm_dom = document.getElementById('slt_frame_id');
			if(ifrm_dom)
				ifrm_dom.setAttribute('src', $scope.pre_taxo_path);
		}, 100);
	}
	/***********************************/
	$scope.review_prjct_click_func = function(row){
		$scope.slcted_rca_dic['t'] = row
		$scope.slcetd_doc_view_dic = row;
		$scope.doc_view_enable = true;
                $scope.comp_sel_fun = false;
		if($scope.side_menu_slcted_flg['k'] == 'toc'){
			$scope.refOptions.pno_list	= []	
			for(var i=1; i<=Number(row['nop']);i++)
				$scope.refOptions.pno_list.push(i)
			$scope.refOptions.selected_pno = 1;
			var temp_path = 'ref_path/'+$scope.slcted_indus_dic['project_id']+'/1/pdata/docs/'+row.d+'/html/'+row.d+'_slt.html'
			if(row['doc_type'] != "HTML")
				temp_path = 'ref_path/'+$scope.slcted_indus_dic['project_id']+'/1/pdata/docs/'+row.d+'/html_output/'+$scope.refOptions.selected_pno+'.html'
			$scope.refOptions.path = temp_path;
			$timeout(function(){
				$scope.refOptions.scope.iframe_page_no_change($scope.refOptions);
			}, 100)
        	        $scope.pre_taxo_path = ''
		}else if($scope.side_menu_slcted_flg['k'] == 'inr_pre_taxo'){
                        var dic = [{'project_id': $scope.slcted_indus_dic['project_id'], 'analytics':'N' ,'company_name': row['d']}];
                        dic = JSON.stringify(dic);
                        $scope.pre_taxo_path = 'http://172.16.20.10:4446/taxo_demo?input='+dic;
                        $timeout(function(){
                                var ifrm_dom = document.getElementById('pre_taxo_id');
                                ifrm_dom.setAttribute('src', $scope.pre_taxo_path);
                        }, 100);
		}else if($scope.side_menu_slcted_flg['k'] == 'slt'){
                       $timeout(function(){
                           $scope.modeltraining.scope.assign($scope.slcted_indus_dic, $scope.slcted_comp_dic, row);
                       });
			/*var dic  = [{'project_id': $scope.slcted_indus_dic['project_id'], 'company_name': $scope.slcted_comp_dic['company_id'], 'doc_id': row['d'], 'doc_type': row['doc_type'], 'dbname': $scope.slcted_indus_dic['db_name']}];
	               	dic = JSON.stringify(dic);
        	        $scope.pre_taxo_path = 'http://172.16.20.10:5008/slt_demo?input='+dic;*/
		}else if($scope.side_menu_slcted_flg['k'] == 'ocr'){
			//$scope.pre_taxo_path = 'http://172.16.10.62:1100/documentreview?input=[{"selected_docid":'+ row['d']+',"doc_name":"'+row['doc_name']+'","from":"0","pages":"all","page_count":'+row['nop']+',"count":"0"}]';
			$scope.pre_taxo_path = 'http://172.16.10.62:1101/document_demo?input={}';
		}else if($scope.side_menu_slcted_flg['k'] == 'output'){
			if($scope.slcted_indus_dic['project_id'] == "60"){
				var doc_map_d	= {}
                                var deal_map	= {"91943":"5","91944":"1","13176555":"4","13176556":"6","13176557":"7","13176558":"2","13176559":"3"}
				var deal_d	= {}
				var doc_ids	= []
				$scope.slcted_indus_dic.info.forEach(function(pr){
					pr['info'].forEach(function(r){
						doc_map_d[r['old_doc_id']] = r['doc_name']
						var deal_id = deal_map[r['old_doc_id']]
						if(!(deal_id in deal_d))
							deal_d[deal_id]	= []
						deal_d[deal_id].push(r['old_doc_id'])
						doc_ids.push(r['old_doc_id'])
					});
				});
				var doc_str=doc_ids.join(',');
				$scope.pre_taxo_path = String.format('http://172.16.20.7/TAS-ABS/Source/html_view_demo.html?user_id={0}&doc_id={1}&deal_list={2}&doc_name_dict={3}&deal_and_doc={4}&docs_lst={5}&doc_strs={6}&DealView={7}', 'demo', row['old_doc_id'],JSON.stringify(Object.keys(deal_d)), JSON.stringify(doc_map_d), JSON.stringify(deal_d), JSON.stringify(doc_ids), doc_str, "DocView")
			
			}else if($scope.slcted_indus_dic['project_id'] != "FE"){
				/*var doc_lst = [row.d];
				$scope.outputviewOptions['docs'] = doc_lst; 
				$timeout(function(){
					$scope.outputviewOptions.scope.loadData();
				});*/
				 $timeout(function(){
                           		$scope.modeltraining_1.scope.assign($scope.slcted_indus_dic, $scope.slcted_comp_dic, row);
                       		});
				return;
			}
		}else if($scope.side_menu_slcted_flg['k'] == 'exha_data' || $scope.side_menu_slcted_flg['k'] == 'table_analys' || $scope.side_menu_slcted_flg['k'] == 'text_to_table'){
			temp_cmp_id = [$scope.slcted_comp_dic['company_id'], $scope.slcted_comp_dic['model_id'], row['d']].join('_');
                        $scope.selected_company_data = temp_cmp_id;
			$scope.information_scope.tabs = $scope.sel_types[$scope.side_menu_slcted_flg['k']];
			$timeout(function(){
	                        $scope.information_scope.scope.move_direct(temp_cmp_id);
                        }, 200);
			return;
		}else if($scope.side_menu_slcted_flg['k'] == 'all_tables' || $scope.side_menu_slcted_flg['k'] == 'foot_notes' || $scope.side_menu_slcted_flg['k'] == 'sen_table_desc' || $scope.side_menu_slcted_flg['k'] == 'sen_addit' || $scope.side_menu_slcted_flg['k'] == 'other_txt_t_tble'){
                        temp_cmp_id = [$scope.slcted_comp_dic['company_id'], $scope.slcted_comp_dic['model_id'], row['d']].join('_');
                        $scope.selected_company_data = temp_cmp_id;
                        $scope.information_scope.tabs  = $scope.sel_types[$scope.side_menu_slcted_flg['k']]
                        $timeout(function(){
                                $scope.information_scope.scope.move_direct(temp_cmp_id);
                        }, 200);
                        return;
		}else{
			$scope.doc_view_enable = false;
			return;
		}
		$timeout(function(){
                        var ifrm_dom = document.getElementById('slt_frame_id');
                        if(ifrm_dom)
                                ifrm_dom.setAttribute('src', $scope.pre_taxo_path);
                }, 100);
	}
	/***********************************/
        $scope.review_across = function (){
                $scope.doc_view_enable = true;
		if($scope.slcted_indus_dic['project_id'] == "FE"){
			 $scope.output_sclted_sub_click_func('op_view');
		}else{
			var doc_lst = [];
			var filteredRows = $scope.gridApiDoc.core.getVisibleRows($scope.gridApiDoc.grid);
			for (var i = 0; i < filteredRows.length; i++) {
			    var tid = filteredRows[i]['entity'];
				row = tid;
			    if(tid['checked'])
			     	 doc_lst.push(tid['d']);
			}
                	$scope.slcted_rca_dic['t'] = row
                	$scope.slcetd_doc_view_dic = row;
			var dic  = [{'ProjectID': $scope.slcted_indus_dic['project_id'], 'batch_name': $scope.slcted_comp_dic['company_id'], 'doc_lst': doc_lst, 'WorkSpaceID':1, 'db_name': $scope.slcted_indus_dic['db_name']}];
			dic = JSON.stringify(dic);
			if($scope.side_menu_slcted_flg['k'] == 'data_builder_rca'){
			 	$scope.pre_taxo_path = 'http://172.16.20.232:2063/projectv_demo?view=Review&nop=1'+'&cid='+$scope.slcted_comp_dic['company_id']+'&pid='+$scope.slcted_indus_dic['project_id'];//+'&data_type=1&doc_id='+row['d']
			}else{ 
				$scope.outputviewOptions['docs'] = doc_lst; 
				$timeout(function(){
					$scope.outputviewOptions.scope.loadData();
				});
				return;
			}
			$timeout(function(){
        	                var ifrm_dom = document.getElementById('slt_frame_id');
	                        if(ifrm_dom)
                	                ifrm_dom.setAttribute('src', $scope.pre_taxo_path);
                	}, 100);
         	}
        }
	/***********************************/
	$scope.refOptions.page_change = function(rw){
		row=$scope.slcetd_doc_view_dic;
		var temp_path = 'ref_path/'+$scope.slcted_indus_dic['project_id']+'/1/pdata/docs/'+row.d+'/html/'+row.d+'_slt.html'
		if(row['doc_type'] != "HTML")
			temp_path = 'ref_path/'+$scope.slcted_indus_dic['project_id']+'/1/pdata/docs/'+row.d+'/html_output/'+$scope.refOptions.selected_pno+'.html'
		$scope.refOptions.path	= temp_path;
	}
	/***********************************/
	$scope.tasService = tasService;
        $scope.upload_scope = {
		parent_scope: $scope
	};
	
	/**************Source Setup*********************/
	$scope.source_scope = {parent_scope: $scope};

	$scope.cmp_comp_data_flg = false;
        $scope.cmp_comp_flg = false;

        $scope.show_comp_view = function(){
                $scope.cmp_comp_data_flg = !$scope.cmp_comp_data_flg;
                $scope.cmp_comp_flg = !$scope.cmp_comp_flg;
        }
	/***********************************/
	$scope.processdocument = function(row){
		var doctype = row['dtype'] || '';
		var meta_data = row['meta_data'] || [];
		if(doctype == 'Link'){
			var link = row['link'] || '';
			if(link == '')
				return;
			$scope.upload_scope.scope.input_link = link;
			$scope.upload_scope.scope.meta_data  = meta_data;
			$scope.upload_scope.scope.enable_upload_data();
			$scope.upload_scope.scope.active_tabs_view = 2;
			//$scope.upload_scope.scope.url_process_ag();
		}else if(doctype == 'Pdf'){
			$upload_scope.scope.selected_upload_language = row['language'] || '';
			$scope.upload_scope.scope.f_page = '0';
			$scope.upload_scope.scope.meta_data  = meta_data;
		}
	}
	/***********************************/
	$scope.popup = false;
	$scope.mypop = function(obj,cls){
		var iframe = document.querySelector("#pop_iframe");
		if(cls == "close"){
			$scope.popup = false;
			$timeout(function(){
                                $scope.slct_yrs_func($scope.slcted_yrs_dic);
                        }, 100);
			iframe.setAttribute("src", "")
			return
		}	
		$scope.popup = true;
		$scope.ips = true;
		iframe.onload = function(){
			$scope.$apply(function(){
				$scope.ips = false;
			});
		}
		iframe.onerror = function(){
			$scope.$apply(function(){
				$scope.ips = false;
			});
		}
		$scope.slct_ind_link = obj ; 
		var dic = {"project_id": $scope.slcted_comp_dic['monitor_id'], "url": encodeURIComponent(obj["link"]),"url_id": obj['uid']};
		dic = JSON.stringify(dic);
		$scope.pop_url = "http://172.16.20.10:4009/training_page_new?data="+dic;
		iframe.setAttribute("src",$scope.pop_url)
	}
	/***********************************/
	$scope.scheduler = false;
	$scope.schedule_pop = function(obj,arg){
		 $scope.scheduler = true;
		if(arg){
			$scope.scheduler = false;
			$timeout(function(){
                        	$scope.slct_yrs_func($scope.slcted_yrs_dic);
			}, 100);
			return
		}
		$scope.slct_ind_link = obj ;
		var post_data = {"cmd_id": 18,"project_id": $scope.slcted_comp_dic['monitor_id']};
		$scope.ips = true;
		tasService.ajax_request(post_data, 'POST', function(res){
			if(res['message']=='done'){
				$scope.ips = false;
				$('#calendar').fullCalendar( 'removeEvents', function(e){ return !e.isUserCreated});
				$('#calendar').fullCalendar( 'addEventSource', res['data'])
			}else{
                                tasAlert.show(res['message'], 'error', 1000);
			}
		});
	}
	/***********************************/
	$scope.delete_url = function(obj){
                var post_data = {"cmd_id": 15, "project_id": $scope.slcted_comp_dic['monitor_id'], "url_id": obj['uid'], "user_id":"tas"}
                tasService.ajax_request(post_data, 'POST', function(res){
                        if(res['message']=='done'){
                                $scope.comp_click_func($scope.slcted_comp_dic);
                        }else{
                                tasAlert.show(res['message'], 'error', 1000);
                        }
                });
        }
	/***********************************/
	$scope.doc_updated_list = [];
	$scope.doc_updated_dic = {};
	socket.on('doc_status', function(msg){
		$scope.$apply(function(){
			$scope.show_alert_flg = true;
			$scope.doc_updated_dic = msg;
			var post_data = {"cmd_id": 4,"project_id": $scope.doc_updated_dic['project_id'], 'crid': $scope.doc_updated_dic['company_id'],"user_id":"tas"}
				tasService.ajax_request(post_data, 'POST', function(res){
				if(res['message']=='done'){
					var new_dic = msg || {};
					var slcted_indus_dic = $scope.industry_type_list[$scope.industry_p_id_idx_map[$scope.doc_updated_dic['project_id']]];
					new_dic['indus'] = slcted_indus_dic;
					var comp_data = slcted_indus_dic['info'];
					var slcted_comp_c_id = ''
					for(var a=0, a_l=comp_data.length; a<a_l; a++){
						var comp = comp_data[a];
						if(comp['crid'] == $scope.doc_updated_dic['company_id']){
							slcted_comp_c_id = comp['company_id'];
							new_dic['comp'] = comp;
							new_dic['read'] = false;
							comp['info'] = res['data'] || [];
							$scope.doc_updated_list.push(new_dic);
							$scope.industry_type_list[$scope.industry_p_id_idx_map[$scope.doc_updated_dic['project_id']]]['info'][$scope.comp_c_id_idx_map[slcted_comp_c_id]]['info'] = res['data'] || [];
							if(slcted_indus_dic['project_id'] == $scope.slcted_indus_dic['project_id']){
								$scope.slcted_indus_dic = $scope.industry_type_list[$scope.industry_p_id_idx_map[$scope.doc_updated_dic['project_id']]];
								if(comp['crid'] == $scope.slcted_comp_dic['crid']){
									$scope.slcted_comp_dic = comp;
									$scope.gridOptionsDoc.data = $scope.slcted_comp_dic['info'].map(function(r){r.checked=true;return r});
								}
							}
							break;
						}
					}						
				}else{
					tasAlert.show(res['message'], 'error', 1000);
				}
			});
		});
	})
	/***********************************/
	$scope.show_alert_pop_flg = false;
	$scope.show_alert_func = function(){
		$scope.show_alert_pop_flg = !$scope.show_alert_pop_flg;
		if($scope.show_alert_pop_flg){
			$scope.doc_updated_list.forEach(function(r){
				r['read'] = true;
			});
			$scope.show_alert_flg = false;
		}
        }
	/***********************************/
	$scope.cls_show_alert_func = function(){
		$scope.show_alert_pop_flg = false;
        }
	/***********************************/
	$scope.status_chck_change_func = function(doc){
		if(doc['project_id'] == $scope.slcted_indus_dic['project_id'] && doc['company_id'] == $scope.slcted_comp_dic['crid']){
                        $scope.cls_show_alert_func();
                }else{
			if('indus' in doc){
				$scope.slcted_indus_dic = doc['indus'];
				sessionStorage['slcted_indus_p_id']= $scope.slcted_indus_dic['project_id'];
				$scope.comp_data = $scope.slcted_indus_dic['info'];
				$scope.comp_data.forEach(function(r, i){
					$scope.comp_c_id_idx_map[r['company_id']] = i;
				});
				if('comp' in doc)
					$scope.slcted_comp_dic = doc['comp'];
				else
					$scope.slcted_comp_dic = $scope.comp_data[0];
				sessionStorage['slcted_comp_c_id']= $scope.slcted_comp_dic['company_id'];
				$scope.get_slct_indus_func(true, true);
				$scope.cls_show_alert_func();
			}
		}
        }
	/***********************************/
	$scope.validated_data = {
		parent_scope: $scope
	}
	/***********************************/
	/***********************************/
	/***********************************/
});
