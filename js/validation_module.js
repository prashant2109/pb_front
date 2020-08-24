var app = angular.module("tas.validation", ['ui.grid', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.edit', 'ui.grid.treeView', 'ui.grid.resizeColumns', 'ui.grid.expandable', 'ui.grid.pagination', 'ui.grid.selection'])
app.controller("validation", function($scope,  $rootScope, $http, $timeout, $location, $filter, $sce, tasAlert, tasService, tasIframe){
        $scope.Object = Object;
        $scope.config.scope = $scope;
        $('#body_wrapper').show();
	$scope.deal_id = sessionStorage['toc_company_id'];
	$scope.project_id = sessionStorage['project_id'];
	$scope.company_name = sessionStorage['company_name'];
	$scope.org_company_name = sessionStorage["org_company"] || "";
	$scope.comp_data = JSON.parse(sessionStorage['comp_data']);
	$scope.from_merge = sessionStorage['from_merge'] || '';
	$scope.doc_id_dic = {'d': ''};
	$scope.machine_id   = sessionStorage['machine_id'] || '122';
	$scope.deltastorage = 'deltastorage';
	$scope.htmlstorage  = 'htmlstorage';
	$scope.model_number = sessionStorage['model_number'];
	$scope.template_name = sessionStorage['template'] || '';
	$scope.cell_eid_avl = false;
	$scope.new_pdf_download_path = 'new_pdf_download_path';
	if($scope.machine_id == '122'){
		$scope.deltastorage = 'deltastorage_new';
		$scope.htmlstorage  = 'htmlstorage_new';
		$scope.new_pdf_download_path = 'new_pdf_download_path_new';
	}
	/***********************************/
        $scope.line_item_pos_list = [{'k': 'Unset'}, {'k': 'H'}, {'k': 'T'}, {'k': 'P'}, {'k': 'N'}, {'k': 'S'}];
	$scope.line_item_pos_dic = {'val': $scope.line_item_pos_list[0]['k']};
	/***********************************/
    	$scope.filterRow = {};
    	$scope.filterRow['val'] = '';
    	$scope.filterRowFunc = function() {
        	$scope.comp_data = $filter('filter')(JSON.parse(sessionStorage['comp_data']), $scope.filterRow['val'], undefined);
    	};
	/***********************************/
	$scope.tas_alert_section_close = function(){
        	tasAlert.hide();
    	}
	/***********************************/
	$scope.gridOptions = {
		rowHeight:30, enableGridMenu: false, enableFiltering:true, enableColumnMenus: false, columnDefs: [], 
		onRegisterApi: function (gridApi) { 
			$scope.grid23Api = gridApi;
		}
	};
	/***********************************/
    	$scope.gridOptions = {
		rowHeight:30,
		enableGridMenu: false,
		enableFiltering:true,
		enableColumnMenus: false,
		columnDefs: [],
		onRegisterApi: function (gridApi) {
		   $scope.grid23Api = gridApi;
		   gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {    
			    $scope.$apply(function(){
				if(colDef['field'] == 't_l'){
					if($scope.old_cell_val == rowEntity['t_l']){
					}else{
					    if(rowEntity['new_entry']){
						$scope.save_new_entry(rowEntity)
					    }else{
						$scope.save_edit_info(rowEntity) 
					    }
					}
				}else{
					if($scope.old_cell_cl_val == rowEntity[colDef['field']]['v']){
					}else{
						$scope.save_edit_cell_cl_info(rowEntity, colDef['field']);
					}
				}             
			    })
			})
		    }
    	};
	/***********************************/
	$scope.formula_grid   = {
		rowHeight:30, enableFiltering:false, noUnselect : false, enableSorting:false, showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false, enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false, columnDefs:[],
		onRegisterApi: function (gridApi) {
		$scope.formula_view   = gridApi;
		gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
			    $scope.$apply(function(){
			    });
			})
		}
    	}
	/***********************************/
	$scope.gridOptionsDoc = {
		rowHeight:35, enableFiltering:true, noUnselect : false, enableSorting:false, showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false, enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false, columnDefs:[],
		onRegisterApi: function (gridApi) {
		    $scope.gridApiDoc = gridApi;
		}
	}
	/***********************************/
	$scope.gridOptionsAvl = {
		rowHeight:35, enableFiltering:true, noUnselect : false, enableSorting:false, showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false, enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false, columnDefs:[],
		onRegisterApi: function (gridApi) {
		    $scope.gridApiAvl = gridApi;
		}
	}
	/***********************************/
	$scope.gridOptionsGrp = {
                rowHeight:35, enableFiltering:true, noUnselect : false, enableSorting:false, showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false, enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false, columnDefs:[],
                onRegisterApi: function (gridApi) {
                    $scope.gridApiGrp = gridApi;
                }
        }
	/***********************************/
	$scope.gridOptionsAvlAll = {
                rowHeight:35, enableFiltering:true, noUnselect : false, enableSorting:false, showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false, enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false, columnDefs:[],
                onRegisterApi: function (gridApi) {
                    $scope.gridApiAvlAll = gridApi;
                }
        }
	/***********************************/
	$scope.gridOptionsSpike = {
                rowHeight:35, enableFiltering:true, noUnselect : false, enableSorting:false, showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false, enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false, columnDefs:[],
                onRegisterApi: function (gridApi) {
                    $scope.gridApiSpike = gridApi;
                }
        }
	/***********************************/
	$scope.gridOptionsSubGrp = {
                rowHeight:35, enableFiltering:true, noUnselect : false, enableSorting:false, showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false, enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false, columnDefs:[],
                onRegisterApi: function (gridApi) {
                    $scope.gridApiSubGrp = gridApi;
                }
        }
	/***********************************/
	function gridOptionsDoc_columnDefs_func(){
		var seq_coldef = [
		    { field: 'd', displayName:'Doc Id', enableSorting: true, width:'50', pinnedLeft:true,  headerCellClass: 'hdr_cntr', cellTemplate:
			`<div class="ui-grid-cell-contents row_col_grid_cell mn_cell" title="{{COL_FIELD}}">{{COL_FIELD}}</div>`
		    },
		    { field: 'n', displayName:'Doc Name', enableSorting: true, width:'200', pinnedLeft:true,  headerCellClass: 'hdr_cntr', cellTemplate:
			`<div class="ui-grid-cell-contents row_col_grid_cell mn_cell" title="{{COL_FIELD}}">{{COL_FIELD}}</div>`
		    }
		];
		$scope.doc_clasy_res['phs'].forEach(function(rw){
			width = (parseInt(rw['ml'])* 60) || 180;
			if(width == 60)
				width = 60
			var nw_dic = { field: rw['n'], displayName:rw['n'], enableSorting: false, enableFiltering:true, width:width, minWidth: '60',  headerCellClass: 'hdr_cntr', pinnedLeft:false, cellEditableCondition:false,  
		    headerCellTemplate: `
				      <div ng-class="{ 'sortable': sortable, entre_col_sel_cls: grid.appScope.slcted_sys_clfed_dic['`+rw+`']}">
					  <div role="button" tabindex="0" ng-keydown="handleKeyDown($event)" class="ui-grid-cell-contents ui-grid-header-cell-primary-focus" col-index="renderIndex" ng-click="grid.appScope.sys_clfd_selc_col_func('`+rw+`')">
						<span class="ui-grid-header-cell-label ng-binding" ui-grid-one-bind-id-grid="col.uid + '-header-text'">`+rw['n']+`</span>
					  </div>
					  <div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">
					      <input type="text" class="ui-grid-filter-input" ng-model="colFilter.term"/>
					      <div class="ui-grid-filter-button" ng-click="colFilter.term = null">
						  <i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i>
					      </div>
					  </div>
				      </div>`,
		    cellTemplate:
				`<div class="ui-grid-cell-contents row_col_grid_cell" style="padding: 0px;">
					<div ng-repeat="pg in row.entity['tinfo']['`+rw["n"]+`'] track by $index" class="seq_full_span">{{pg['t']}}</div>
				</div>`
			}
			seq_coldef.push(nw_dic);
		});
		return seq_coldef;
	}
	/***********************************/
	$scope.cl_bk_doc_func = function(res){
		$scope.ps = false;
		console.log(res);
		if(res['message'] == 'done'){
			$scope.doc_clasy_res = res;
			$scope.gridOptionsDoc.data = res['data'];
			$scope.gridOptionsDoc.columnDefs = gridOptionsDoc_columnDefs_func(); 
		}
	}
	/***********************************/
        function gridOptionsError_columnDefs_func(){
		var seq_coldef = [
                    { field: 'emsg', displayName:'Description', enableSorting: true, width:'*', pinnedLeft:false,  headerCellClass: 'hdr_cntr', cellTemplate:
                        `<div class="ui-grid-cell-contents row_col_grid_cell_errr" ng-click="grid.appScope.get_rgt_data_func(row.entity)" ng-class="{'avf_flg_brder': row.entity.etype=='Availability', 'active': [grid.appScope.clicked_lft_row_dic['emsg'], grid.appScope.clicked_lft_row_dic['etype']].join('_')== [row.entity.emsg, row.entity.etype].join('_')}">
				<div class="mn_cell_1" title="{{COL_FIELD}}" ng-bind-html="COL_FIELD | trusted1"></div>
				<div class="mn_cell_2" title="{{row.entity.etype}}">{{row.entity.etype}}</div>
			</div>`
                    },
		]
		return seq_coldef;
	}
	/***********************************/
        function gridOptionsAvlAll_columnDefs_func(){
		var seq_coldef = [
                    { field: 'sn', displayName:'S.No', enableSorting: true, width:'50', pinnedLeft:false,  headerCellClass: 'hdr_cntr', cellTemplate:
                        `<div class="ui-grid-cell-contents row_col_grid_cell doc_pno_div" ng-class="{active : grid.appScope.slcted_doc_pno_idx_key == row.entity.sn, brk_row:  row.entity.break=='Y'}">
				{{COL_FIELD}}
			</div>`
                    },
		    { field: 'txt', displayName:'Text', enableSorting: true, width:'*', pinnedLeft:false,  headerCellClass: 'hdr_cntr', cellTemplate:
                        `<div class="ui-grid-cell-contents row_col_grid_cell row_col_grid_cell_desc doc_pno_div" ng-class="{active: grid.appScope.slcted_doc_pno_idx_key == row.entity.sn, brk_row:  row.entity.break=='Y'}" ng-click="grid.appScope.get_ref_full_data_func(row.entity, '')">
				<div class="title" ng-bind-html="COL_FIELD | trusted1" ng-class="{'font-weight-bold': row.entity.break=='Y'}"></div>
				<div class="kpi_avl_frml_bx">
					<div class="kpi_avl_frml_inr_bx rsts_G waves-effect" ng-if="row.entity.pdf" ng-click="grid.appScope.get_ref_full_data_func(row.entity, 'pdf')">{{row.entity.pdf}}</div>
					<div class="kpi_avl_frml_inr_bx rsts_Y waves-effect" ng-if="row.entity.table" ng-click="grid.appScope.get_ref_full_data_func(row.entity, 'table')">{{row.entity.table}}</div>
				</div>
                        </div>`
                    }
		]
		return seq_coldef;
	}
	/***********************************/
    	$scope.period_drp_dwn = [
                            {'pt_label': '', 'pt': ''},
                            {'pt_label': 'FY', 'pt': 'FY'},
                            {'pt_label': 'H1', 'pt': 'H1'},
                            {'pt_label': 'H2', 'pt': 'H2'},
                            {'pt_label': 'Q1', 'pt': 'Q1'},
                            {'pt_label': 'Q2', 'pt': 'Q2'},
                            {'pt_label': 'Q3', 'pt': 'Q3'},
                            {'pt_label': 'Q4', 'pt': 'Q4'},
                            {'pt_label': 'M9', 'pt': 'M9'},
                            {'pt_label': 'CY', 'pt': 'CY'},
                            {'pt_label': 'FYESD', 'pt': 'FYESD'},
                            {'pt_label': 'H1ESD', 'pt': 'H1ESD'},
                            {'pt_label': 'H2ESD', 'pt': 'H2ESD'},
                            {'pt_label': 'Q1ESD', 'pt': 'Q1ESD'},
                            {'pt_label': 'Q2ESD', 'pt': 'Q2ESD'},
                            {'pt_label': 'Q3ESD', 'pt': 'Q3ESD'},
                            {'pt_label': 'Q4ESD', 'pt': 'Q4ESD'},
                            {'pt_label': 'M9ESD', 'pt': 'M9ESD'},
                            {'pt_label': 'CYESD', 'pt': 'CYESD'},
                            {'pt_label': 'PY', 'pt': 'PY'},
                            {'pt_label': 'CUY', 'pt': 'CUY'}

    	];
	$scope.reporting_drp_dwn = [{'p':'', 'p_label': ''}];
	var reporting_drp_id = 1;
	for(var i= 1900; i<= 2050; i++){
		var new_obj = {'p':String(i), 'p_label': String(i)};
		$scope.reporting_drp_dwn.push(new_obj);
		reporting_drp_id++;
	}
	$scope.currency_drp_dwn = [
		{'c': '', 'c_label': ''},
		{'c': 'EUR', 'c_label': 'EUR'},
		{'c': 'USD', 'c_label': 'USD'},
		{'c': 'INR', 'c_label': 'INR'},
		{'c': 'JPY', 'c_label': 'JPY'},
		{'c': 'GBP', 'c_label': 'GBP'},
		{'c': 'AUD', 'c_label': 'AUD'},
		{'c': 'COP', 'c_label': 'COP'},
		{'c': 'NOK', 'c_label': 'NOK'},
		{'c': 'HKD', 'c_label': 'HKD'},
		{'c': 'RMB', 'c_label': 'RMB'},
		{'c': 'BRL', 'c_label': 'BRL'},
		{'c': 'SEK', 'c_label': 'SEK'},
		{'c': 'SGD', 'c_label': 'SGD'},
		{'c': 'KRW', 'c_label': 'KRW'},
		{'c': 'CAD', 'c_label': 'CAD'},
		{'c': 'MYR', 'c_label': 'MYR'},
		{'c': 'SEN', 'c_label': 'SEN'},
		{'c': 'RUB', 'c_label': 'RUB'},
		{'c': 'THB', 'c_label': 'THB'},
		{'c': 'IDR', 'c_label': 'IDR'},
		{'c': 'PHP', 'c_label': 'PHP'},
		{'c': 'CHF', 'c_label': 'CHF'},
		{'c': 'MXN', 'c_label': 'MXN'},
		{'c': 'TWD', 'c_label': 'TWD'},
		{'c': 'TRY', 'c_label': 'TRY'},
		{'c': 'ORE', 'c_label': 'ORE'},
		{'c': 'PENCE', 'c_label': 'PENCE'},
		{'c': 'CENTS', 'c_label': 'CENTS'},
		{'c': 'MSRMT', 'c_label': 'MSRMT'},
		{'c': 'ZAR', 'c_label': 'ZAR'},
		{'c': 'CLP', 'c_label': 'CLP'},
		{'c': 'SAR', 'c_label': 'SAR'},
		{'c': 'PLN', 'c_label': 'PLN'},
	];
	$scope.n_type_drp_dwn = [
		{'vt':'', 'vt_label': ''},
		{'vt':'NUM', 'vt_label': 'NUM'},
		{'vt':'MNUM', 'vt_label': 'MNUM'},
		{'vt':'BNUM', 'vt_label': 'BNUM'},
		{'vt':'Percentage', 'vt_label': 'Percentage'},
		{'vt':'Measurement', 'vt_label': 'Measurement'},
		{'vt':'Time', 'vt_label': 'Time'},
		{'vt':'Distance', 'vt_label': 'Distance'},
		{'vt':'Ratio', 'vt_label': 'Ratio'},
		{'vt':'Other', 'vt_label': 'Other'}
	];
	$scope.scale_drp_dwn = [
		{'s': '', 's_label': ''},
		{'s': '1', 's_label': '1'},
		{'s': 'TH/KILO', 's_label': 'TH/KILO'},
		{'s': 'TH', 's_label': 'TH'},
		{'s': 'KILO', 's_label': 'KILO'},
		{'s': 'TENTHOUSAND', 's_label': 'TENTHOUSAND'},
		{'s': 'Mn/Ton', 's_label': 'Mn/Ton'},
		{'s': 'Ton', 's_label': 'Ton'},
		{'s': 'Lakhs', 's_label': 'Lakhs'},
		{'s': 'Crore', 's_label': 'Crore'},
		{'s': 'Mn', 's_label': 'Mn'},
		{'s': 'Bn', 's_label': 'Bn'},
		{'s': 'Tn', 's_label': 'Tn'},
		{'s': 'Times', 's_label': 'Times'},
		{'s': 'Hours', 's_label': 'Hours'},
		{'s': 'KilogramMn', 's_label': 'KilogramMn'},
		{'s': 'KilogramTH', 's_label': 'KilogramTH'},
		{'s': 'GallonMn', 's_label': 'GallonMn'},
		{'s': 'GallonTH', 's_label': 'GallonTH'},
		{'s': 'PerGallon', 's_label': 'PerGallon'},
		{'s': 'PerGallonMn', 's_label': 'PerGallonMn'},
		{'s': 'PerGallonTH', 's_label': 'PerGallonTH'},
		{'s': 'Kilometre', 's_label': 'Kilometre'},
		{'s': 'KilometreBn', 's_label': 'KilometreBn'},
		{'s': 'tonne kilometre', 's_label': 'tonne kilometre'},
		{'s': 'PerKilometre', 's_label': 'PerKilometre'},
		{'s': 'KilometreMn', 's_label': 'KilometreMn'},
		{'s': 'KilometreTH', 's_label': 'KilometreTH'},
		{'s': 'Miles', 's_label': 'Miles'},
		{'s': 'PerMiles', 's_label': 'PerMiles'},
		{'s': 'MilesMn', 's_label': 'MilesMn'},
		{'s': 'MilesTH', 's_label': 'MilesTH'},
		{'s': 'MilesTonneMn', 's_label': 'MilesTonneMn'},
		{'s': 'TonnesMn', 's_label': 'TonnesMn'},
		{'s': 'TonnesTH', 's_label': 'TonnesTH'},
		{'s': 'Liter', 's_label': 'Liter'},
		{'s': 'LiterMn', 's_label': 'LiterMn'},
		{'s': 'LiterBn', 's_label': 'LiterBn'},
		{'s': 'LiterTH', 's_label': 'LiterTH'},
		{'s': 'KilometreTonneTH', 's_label': 'KilometreTonneTH'},
		{'s': 'KilometreTonneMn', 's_label': 'KilometreTonneMn'},
		{'s': 'PerTonneMiles', 's_label': 'PerTonneMiles'},
		{'s': 'PerTonne', 's_label': 'PerTonne'},
		{'s': 'MilesPerGallon', 's_label': 'MilesPerGallon'},
		{'s': 'PerLitre', 's_label': 'PerLitre'},
		{'s': 'PerBarrel', 's_label': 'PerBarrel'},
		{'s': 'PoundsTH', 's_label': 'PoundsTH'},
		{'s': 'PoundsMN', 's_label': 'PoundsMN'},
		{'s': 'OuncesTH', 's_label': 'OuncesTH'},
		{'s': 'OuncesMN', 's_label': 'OuncesMN'},
		{'s': 'BarrelsMN', 's_label': 'BarrelsMN'},
		{'s': 'BarrelsTH', 's_label': 'BarrelsTH'},
		{'s': 'PerPound', 's_label': 'PerPound'},
		{'s': 'PerOunce', 's_label': 'PerOunce'},
		{'s': 'Metric tonnes', 's_label': 'Metric tonnes'},
		{'s': 'PerTonneKilometer', 's_label': 'PerTonneKilometer'},
		{'s': 'Barrels', 's_label': 'Barrels'},
		{'s': 'tonne kilometreMn', 's_label': 'tonne kilometreMn'},
		{'s': 'Per Kilogram', 's_label': 'Per Kilogram'},
		{'s': 'Tonnekilometre Bn', 's_label': 'Tonnekilometre Bn'},
		{'s': '1/100', 's_label': '1/100'},
		{'s': '100', 's_label': '100'},
		{'s': '1000', 's_label': '1000'},
		{'s': '1/1000', 's_label': '1/1000'}
	];
	$scope.month_drp_dwn = [];
	for(var i= 0; i<= 12; i++){
		if(i==0){
			var new_obj = {'m':'', 'm_label': ''};
		}else{
			var new_obj = {'m':String(i), 'm_label': String(i)};
		}
		$scope.month_drp_dwn.push(new_obj);
	}
	/***********************************/
        $scope.bbox_dict = {};
	$scope.call_back_load_data_next = function(res){
		$scope.ps = false;
        	$scope.bbox_dict = {};
	        if(res['message'] != "done"){
        	    tasAlert.show(res['message'], 'error', '');
            	    return;
        	}
        	$scope.bbox_dict = res['data'];
    	}
	/***********************************/
	$scope.side_menu_fltr_dic = {};
	/***********************************/
	$scope.side_menu_full_list = [];
	$scope.side_menu_key_idx_map_dic = {};
	$scope.cl_bk_init_func = function(res){
                $scope.ps = false;
		$scope.side_menu_key_idx_map_dic = {};
		$scope.main_tt_slced_dic = {};
                console.log(res);
                if(res['message'] == 'done'){
			$scope.side_menu_full_list = res['data'];
			$scope.side_menu_full_list.forEach(function(row, idx){
				$scope.side_menu_key_idx_map_dic[row['k']] = idx;
			});
			var post_data = {'cmd_id': 138};
			$scope.meta_data_list = [];
                        tasService.ajax_request(post_data, 'POST', function(res){
				if(res['message']=='done'){
					$scope.meta_data_list = res['data'];
				}
			});
			/*var post_data = {'cmd_id': 5};
			$scope.ps = true;
		        tasService.ajax_request(post_data, 'POST', $scope.call_back_load_data_next);*/
			var get_key = ['DB', $scope.project_id, $scope.deal_id, 'ERRORDATA',  'BBOX'].join('_');
                        var post_data = {'get_key': get_key}; 
			tasService.redis_request(post_data, 'POST', $scope.call_back_load_data_next);
                }
        }
	/***********************************/
	$scope.init_func = function(key){
		var post_data = {'cmd_id': 164, 'key': key};
		$scope.ps = true;
		tasService.ajax_request(post_data, 'POST', $scope.cl_bk_init_func);
	};
	/***********************************/
	$scope.mt_list_all = [];
	$scope.cl_bk_get_tt_list_func = function(res){
		$scope.ps = false;
		if(res['message'] == 'done'){
			console.log(res);
			$scope.mt_list_all = res['mt_list_all'];
			$scope.init_func('ALL');
		}else{
			tasAlert.show(res['message'], 'error', 1000);
		}
        }
	/***********************************/
	$scope.get_tt_list_func = function(){
            var post_data = {'cmd_id': 6};
            tasService.ajax_request(post_data, 'POST', $scope.cl_bk_get_tt_list_func);
    	}
	/***********************************/
        $scope.seve_selected_data = function(){
                console.log($scope.grp_grid.scope.row_chck_dic)
                if (Object.keys($scope.grp_grid.scope.row_chck_dic).length == 0){ 
                      	tasAlert.show('Select Data.', 'warning', 1000);
			return;
		}           
		console.log($scope.grp_grid.scope.t_id_and_t_l_map);
		var f_l = [];
		for(var t in $scope.grp_grid.scope.row_chck_dic){
			var d = $scope.grp_grid['data']['data'][$scope.grp_grid.scope.t_id_and_t_l_map[t]];
			var dic = {};
			if('rpinfo' in d || 'opinfo' in d){
				dic['rpinfo'] = d['rpinfo'] || [];
				dic['opinfo'] = d['opinfo'] || [];
				f_l.push(dic);
			}
		}
		console.log(f_l);
		var post_data = {'cmd_id': 203, 'data': f_l};
		$scope.ps = true;
		tasService.ajax_request(post_data, 'POST', function(res){
			$scope.ps = false;
			if(res['message']){
				if(res['message']=='done'){
					tasAlert.show(res['message'], 'data', 1000);
				}else{
					tasAlert.show(res['message'], 'error', 1000);
				}
			}
		});
        }
	/***********************************/
	$scope.get_tt_list_func();
	/***********************************/
	$scope.get_grp_err_flg = 'ALL';
	$scope.tally_flag = false;			
        $scope.accept_flag = false;
	$scope.get_grp_err_func = function(flg,tal=''){
		if(tal){
			$scope.get_grp_err_flg = 'TALLY';
			var kkey = 'TALLY';
                        $scope.accept_flag = true;
		}else{
                        $scope.accept_flag = false;
			$scope.tally_flag = false;
			if(flg==true){
				$scope.get_grp_err_flg = 'GROUP';
				var kkey = 'GROUP';
			}else{

				$scope.get_grp_err_flg = 'ALL';
				var kkey = 'ALL';
			}	
               }
		$scope.chart_graph_comp_ph_dic = {};
		$scope.slcted_pt_doc_row_key = null;
		$scope.slcted_pt_doc_cell_key = null;
		let iframe_dom = document.querySelector('#iframe2');
		if(iframe_dom)
			iframe_dom.setAttribute('src', 'src/no_ref_found.html');
		$scope.cell_eid_avl = false;
		$scope.gridOptionsSubGrp.data = [];
		$scope.gridOptionsSubGrp.columnDefs = [];
		$scope.gridOptionsGrp.data = [];
		$scope.gridOptionsGrp.columnDefs = [];
		$scope.actve_full_tab = null;
                $scope.actve_full_tab_dic = null;
                $scope.slcted_pt_doc_row_key = null;
                $scope.slcted_pt_doc_cell_key = null;
                $scope.ref_grp_idx = {};
		$scope.gridOptionsSpike.data = [];
		$scope.gridOptionsSpike.columnDefs = [];
		$scope.init_func(kkey);
	}
	/***********************************/
	function gridOptionsAvl_columnDefs_func(){
		var seq_coldef = [
		    { field: 'sn', displayName:'S.No', enableSorting: true, width:'50', pinnedLeft:true,  headerCellClass: 'hdr_cntr', cellTemplate:
			`<div class="ui-grid-cell-contents row_col_grid_cell" title="{{COL_FIELD}}" ng-class="{row_active: grid.appScope.slcted_pt_doc_row_key == [row.entity.t_id, row.entity.t_l].join('_')}">{{COL_FIELD}}</div>`
		    },
		    { field: 't_l', displayName:'Period Type', enableSorting: true, width:'100', pinnedLeft:true,  headerCellClass: 'hdr_cntr', cellTemplate:
			`<div class="ui-grid-cell-contents row_col_grid_cell mn_cell" title="{{COL_FIELD}}" ng-class="{row_active: grid.appScope.slcted_pt_doc_row_key == [row.entity.t_id, row.entity.t_l].join('_')}" ng-bind-html="COL_FIELD | trusted1"></div>`
		    }
		];
		$scope.doc_avl_res['phs'].forEach(function(rw){
			width = (parseInt(rw['ml'])* 60) || 180;
			if(width == 60)
				width = '*'
			var nw_dic = { field: rw['n'], displayName:rw['n'], enableSorting: false, enableFiltering:true, width:width, minWidth: '60',  headerCellClass: 'hdr_cntr', pinnedLeft:false, cellEditableCondition:false,  
		    headerCellTemplate: `
				      <div ng-class="{ 'sortable': sortable, entre_col_sel_cls: grid.appScope.slcted_sys_clfed_dic['`+rw+`']}">
					  <div role="button" tabindex="0" ng-keydown="handleKeyDown($event)" class="ui-grid-cell-contents ui-grid-header-cell-primary-focus" col-index="renderIndex" ng-click="grid.appScope.sys_clfd_selc_col_func('`+rw+`')">
						<span class="ui-grid-header-cell-label ng-binding" ui-grid-one-bind-id-grid="col.uid + '-header-text'">`+rw['n']+`</span>
					  </div>
					  <div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">
					      <input type="text" class="ui-grid-filter-input" ng-model="colFilter.term"/>
					      <div class="ui-grid-filter-button" ng-click="colFilter.term = null">
						  <i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i>
					      </div>
					  </div>
				      </div>`,
		    cellTemplate:
				`<div class="ui-grid-cell-contents row_col_grid_cell" style="padding: 0px;" ng-class="{row_active: grid.appScope.slcted_pt_doc_row_key == [row.entity.t_id, row.entity.t_l].join('_')}">
					<div ng-repeat="pg in row.entity['`+rw["k"]+`'] track by $index" class="seq_full_span" ng-class="{avf_flg: pg['avf']=='Y', active: grid.appScope.slcted_pt_doc_cell_key == [row.entity.t_l, '`+rw["k"]+`', pg['t']].join('_')}" ng-click="grid.appScope.cell_click_func(pg, '`+rw["k"]+`', row.entity)">{{pg['t']}}</div>
				</div>`
			}
			seq_coldef.push(nw_dic);
		});
		return seq_coldef;
	}
	/***********************************/
	$scope.ph_csv_config_chck = {'pt': false, 'p': false, 'vt': false, 'c': false, 's': false, 'm': false};
    	$scope.siipbb_t_th_chck_func = function(key, flg){
        	$scope.ph_csv_config_chck[key] = !flg;
    	}
	/***********************************/
	$scope.ph_csv_config_table_flg_fnl = false;
	$scope.ph_csv_config_shw_dic = {};	
	$scope.hdr_cl_active_key = null;
	$scope.slcted_data_lost_dic = {};
	$scope.sys_hdr_selc_col_func = function(k, n, g, ev){
		if(ev && ev.altKey){
			if($scope.actve_full_tab_dic['k'] == 'DBDL'){
				if(!(n in $scope.slcted_data_lost_dic)){
					$scope.slcted_data_lost_dic[n] = {'phs': [],  'tids':{}};
				}
				if($scope.slcted_data_lost_dic[n]['phs'].includes(k)){
					$scope.slcted_data_lost_dic[n]['phs'].splice($scope.slcted_data_lost_dic[n]['phs'].indexOf(k), 1);
					$scope.slcted_data_lost_dic[n] = {'phs': [],  'tids':{}};
				}else{
					$scope.slcted_data_lost_dic[n] = {'phs': [],  'tids':{}};
					$scope.slcted_data_lost_dic[n]['phs'].push(k);
					$scope.gridOptionsGrp.data.forEach(function(row){
						if(k in row && row[k]['data_overlap']=='Y'){
							$scope.slcted_data_lost_dic[n]['tids'][row['t_id']] = k;
						}
					});
				}
			}	
		}else if(ev && ev.ctrlKey){
				$scope.hdr_cl_active_key = k;
				$scope.ph_csv_config_shw_dic = {};
				$scope.ph_csv_config = {'pt': '', 'p': '', 'vt': '', 'c': '', 's': '', 'm': ''};
				$scope.ph_csv_config_chck = {'pt': false, 'p': false, 'vt': false, 'c': false, 's': false, 'm': false};
				for(cl in {'pt':1, 'p':1, 'c': 1, 's':1, 'vt': 1}){
					$scope.ph_csv_config_shw_dic[cl] = 1;
					$scope.ph_csv_config_chck[cl] = false;
				}
				$scope.frm_csv = false;
				$scope.ph_csv_config_table_flg_fnl = true;
		}else{
			if(!(n in $scope.slcted_data_lost_dic)){
				$scope.slcted_data_lost_dic[n] = {'phs': [],  'tids':{}};
			}
			if($scope.slcted_data_lost_dic[n]['phs'].includes(k)){
				$scope.slcted_data_lost_dic[n]['phs'].splice($scope.slcted_data_lost_dic[n]['phs'].indexOf(k), 1);	
			}else{
				$scope.slcted_data_lost_dic[n]['phs'].push(k);
			}
		}
		//console.log($scope.slcted_data_lost_dic);
		$scope.grp_grid.scope.slcted_data_lost_dic = $scope.slcted_data_lost_dic;
		$scope.grp_grid.scope.hdr_cl_active_key =  $scope.hdr_cl_active_key;
	}
	/***********************************/
	$scope.ph_csv_config_table_cls_fnl = function(){
		$scope.frm_csv = false;
		$scope.ph_csv_config_table_flg_fnl = false;
		$scope.ph_csv_config_shw_dic = {};	
		$scope.hdr_cl_active_key = null;
		$scope.grp_grid.scope.hdr_cl_active_key =  $scope.hdr_cl_active_key;
	}
	/***********************************/
   	$scope.ph_clas_config_save_fnl_func = function(){
		var rids       = [];
		var r_key_list = {};
		if(!$scope.frm_csv){
			for (var  j = 0; j < $scope.grp_grid['data'].data.length; j++) {
				var ful_row = $scope.grp_grid['data'].data[j];
				if($scope.hdr_cl_active_key in ful_row){
					var kkk =  ful_row[$scope.hdr_cl_active_key];
					r_key_list[kkk['r_key']]	 = j;
				}
			}
			var post_data = {'cmd_id': 177, 'keys': Object.keys(r_key_list)};
                        $scope.ps = true;
                        tasService.ajax_request(post_data, 'POST', function(res){
				$scope.ps = false;
				for (var k in r_key_list){
					var j	= r_key_list[k]		
					$scope.grp_grid['data'].data[j][$scope.hdr_cl_active_key]	= Object.assign($scope.grp_grid['data'].data[j][$scope.hdr_cl_active_key], res['data'][k])
					delete $scope.grp_grid['data'].data[j][$scope.hdr_cl_active_key]['r_key']
				}
				$scope.ph_clas_config_save_fnl_func_after_redis();
			});
		}
	}
	/***********************************/
   	$scope.ph_clas_config_save_fnl_func_after_redis = function(){
		var dic = $scope.ph_csv_config;
		angular.forEach(dic, function(val, key){
			if(!$scope.ph_csv_config_chck[key])	
				delete dic[key];
		});
		var rids = [];
		if(!$scope.frm_csv){
			for (var  j = 0; j < $scope.grp_grid['data'].data.length; j++) {
				var ful_row = $scope.grp_grid['data'].data[j];
				if($scope.hdr_cl_active_key in ful_row){
						var res =  ful_row[$scope.hdr_cl_active_key];
						var rid_key = [res['t'], res['x']].join(':$$:'); 
						rids.push(rid_key);
				}
			}
		}else{
			rids = Object.keys($scope.WMergeAcross_grp_dic['data'] || {});	
		}
		if(rids.length == 0 || !(Object.keys(dic).length)){
			tasAlert.show('Nothing to config.', 'warning', 1000);
			return;
		}
		var post_data = {'cmd_id': 42, 'type': 'ROW', 'data':dic, 'r_ids': rids, "stype":'ROW', 'table_type': $scope.selected_grp_dic['table_type'], 'grpid': $scope.selected_grp_dic['grpid']};
		$scope.ps = true;
		tasService.ajax_request(post_data, 'POST', function(res){
			$scope.ps = false;
			if(res['message'] == 'done'){
				tasAlert.show(res['message'], 'success', 1000);
				$scope.usr_save_update_func(dic, 'PH_CSV');	
			}else{
				tasAlert.show(res['message'], 'error', '');
			}
		});
	}
	/***********************************/
	 $scope.stingify_obj = function(obj){
                return JSON.stringify(obj)
    	}
	/***********************************/
    	$scope.toggleCheckerAll_dic = {'val': false};
    	$scope.toggleCheckerAll = function(flg){
		$scope.row_chck_dic = {};
		flg = !flg;
		$scope.toggleCheckerAll_dic['val'] = flg
		if(flg){
			var filteredRows = $scope.gridApiGrp.core.getVisibleRows($scope.gridApiGrp.grid);
			for (var  i = 0; i < filteredRows.length; i++) {
			    var tid = filteredRows[i]['entity']['t_id'];
			    $scope.row_chck_dic[tid] = flg;
			}
		}
    	}
	/***********************************/
	var gridOptionsColumnSn_all = `
                <div class="ui-grid-header-cell ui-grid-clearfix" style="padding: 0px; cursor: pointer;background-color: #f0f0ee;">
                        <div class="ui-grid-cell-contents" ng-click="grid.appScope.toggleCheckerAll(grid.appScope.toggleCheckerAll_dic['val'])" style="padding-right: 4px;">
                                <div class="ui-grid-selection-row-header-buttons ui-grid-icon-ok" ng-class="{'ui-grid-row-selected': grid.appScope.toggleCheckerAll_dic['val']}">&nbsp;</div>
                        </div>
                </div>`;
	/***********************************/
	$scope.row_chck_dic = {};
	$scope.row_chck_dic_func = function(id){
        	if(id in $scope.row_chck_dic)
                	delete $scope.row_chck_dic[id];
        	else
                	$scope.row_chck_dic[id] = true;
    	}
	/***********************************/
	function gridOptionsGrp_columnDefs_func(phs, v_flg=true){
		var t_l_width = 300;
		var t_l_dis_name = 'Description';
		if($scope.actve_full_tab_dic['k']=='Group'){
			t_l_width = 100;
			t_l_dis_name = 'PH';
		}else if($scope.actve_full_tab_dic['k']=='VGHPATTERN'){
			 t_l_width = 100;
		}	
		var seq_coldef = [
		    {
                field: 'sn',
                displayName: '#',
                width: 30,
                pinnedLeft: true,
                cellEditableCondition:false,
		visible: v_flg,
                'headerCellTemplate':gridOptionsColumnSn_all,
                cellTemplate:
                `<div class="ui-grid-cell-contents" style="padding: 0px; cursor: pointer;background-color: #f0f0ee;" ng-click="grid.appScope.row_chck_dic_func(row.entity.t_id)">
                        <div class="ui-grid-cell-contents">
                                <div class="ui-grid-selection-row-header-buttons ui-grid-icon-ok" ng-class="{'ui-grid-row-selected': grid.appScope.row_chck_dic[row.entity.t_id]}" style="user-select: none;">&nbsp;
                                </div>
                        </div>
                </div>`
          },
		    { field: 'sn', displayName:'S.No',  visible: v_flg, enableSorting: true, width:'50', pinnedLeft:true,  headerCellClass: 'hdr_cntr', cellEditableCondition:false, cellTemplate:
			`<div class="ui-grid-cell-contents row_col_grid_cell mn_grp_sec_{{row.entity.clr}}" title="{{COL_FIELD}}" ng-class="{row_active: grid.appScope.slcted_pt_doc_row_key == [row.entity.t_id, row.entity.t_l].join('_'),  match_active: row.entity.match == 'Y', new_row_full_hglt: grid.appScope.row_chck_dic[row.entity.t_id] == true, empty_row_clr_bg: row.entity.empty_row=='Y'}">{{COL_FIELD}}</div>`
		    },
		    { field: 't_l', displayName:t_l_dis_name,  visible: v_flg, enableSorting: true, width:t_l_width, pinnedLeft:true,  headerCellClass: 'hdr_cntr', cellEditableCondition:false, cellTemplate:
			`<div class="ui-grid-cell-contents row_col_grid_cell mn_cell" 
				title="{{row.entity['t_l']+'\n'+row.entity['t_id'] + '\nTaxo: '+row.entity['taxo']}}" 
				ng-class="{row_active: grid.appScope.slcted_pt_doc_row_key == [row.entity.t_id, row.entity.t_l].join('_'), active: grid.appScope.slcted_pt_sub_doc_cell_key == [row.entity.sn, row.entity.t_l].join('_'), new_row_full_hglt: grid.appScope.row_chck_dic[row.entity.t_id] == true, empty_row_clr_bg: row.entity.empty_row=='Y', frml_reslt_show: grid.appScope.frml_clr_dic[row.entity.t_id] == 'RES' && grid.appScope.formula_check_hgt_chck_func(row.entity), frml_oprtr_show: grid.appScope.frml_clr_dic[row.entity.t_id] == 'OPR' && grid.appScope.formula_check_hgt_chck_func(row.entity), 'row_bold': row.entity.f == 'Y', desc_clr_red: row.entity.clr == 'R'}" 
				ng-click="grid.appScope.cell_grp_click_func(row.entity, 't_l')">
			<div ng-bind-html="COL_FIELD | trusted1" class="row_col_grid_cell_desc_title"></div>
			<div style="width: 20px; float: left;border-left: 1px solid #e0e0e0;text-align: center;" ng-if="row.entity['th_flg'] != ''">{{row.entity['th_flg']}}</div>
			</div>`
		    }
		];
		phs.forEach(function(rw){
			width = (parseInt(rw['ml'])* 60) || 180;
			min_wdth= 90;
			max_wdth= 150;
			hdr_class = 'hdr_cntr';
			var ml_avl = false;
			var grp = rw['g'] || (rw['k'].split('-')[0]);
			if(width == 60)
				width = '*'
			if(rw['k']=='EMPTY'){
				width = 3;
				 min_wdth= 3;
                        	max_wdth= 3;
				hdr_class = 'hdr_cntr bordr_lft_rgt';
			}
			if('ml' in rw){
				ml_avl = true;
				width = (parseInt(rw['ml'])* 60) || 180;
        	                min_wdth= width;
	                        max_wdth= width;
			}
			var pin_lft = false;
			if('pin_left' in rw && rw['pin_left']=='Y')
				pin_lft = true;
			var nw_dic = { field: rw['k'], displayName:rw['n'], group: grp, enableSorting: false, enableFiltering:true, width:'*', minWidth: min_wdth,  maxWidth: max_wdth, headerCellClass: hdr_class, pinnedLeft:pin_lft, cellEditableCondition:false, 
		    headerCellTemplate:`<div class="ui-grid-cell-contents hdr_grp_clr_{{'`+rw['clr']+`'}}" style="text-align: center;" ng-click="grid.appScope.sys_hdr_selc_col_func('`+rw['k']+`', '`+rw['n']+`', '`+rw['g']+`', $event)" ng-class="{ entre_col_sel_cls: grid.appScope.slcted_sys_clfed_dic['`+rw+`'], hdr_cl_active:grid.appScope.hdr_cl_active_key=='`+rw['k']+`' || grid.appScope.slcted_data_lost_dic['`+rw['n']+`']['phs'].includes('`+rw['k']+`'), 'chck_sum_err': '`+rw['c_s']+`' == 'Y'}" title="`+rw['n']+`">
						`+rw['n']+`
						<span class="pull-right" style="color: #ff3547;cursor: pointer;" ng-if="'`+rw['k']+`' !='EMPTY' && '`+rw['re_compute']+`' =='Y'" ng-click="grid.appScope.grp_db_col_upd_func('`+rw['k']+`', '`+rw['n']+`', '`+rw['g']+`', $event);$event.stopPropagation();"><i class="fa fa-refresh" aria-hidden="true"></i></span>
					</div>`,
		    /*headerCellTemplate: `
				      <div ng-class="{ 'sortable': sortable, entre_col_sel_cls: grid.appScope.slcted_sys_clfed_dic['`+rw+`'], hdr_cl_active:grid.appScope.hdr_cl_active_key=='`+rw['k']+`'}">
					  <div role="button" tabindex="0" ng-keydown="handleKeyDown($event)" class="ui-grid-cell-contents ui-grid-header-cell-primary-focus" col-index="renderIndex" ng-click="grid.appScope.sys_hdr_selc_col_func('`+rw['k']+`')">
						<span class="ui-grid-header-cell-label ng-binding" ui-grid-one-bind-id-grid="col.uid + '-header-text'" title="`+rw['n']+`">`+rw['n']+`</span>
					  </div>
					  <div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">
					      <input type="text" class="ui-grid-filter-input" ng-model="colFilter.term"/>
					      <div class="ui-grid-filter-button" ng-click="colFilter.term = null">
						  <i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i>
					      </div>
					  </div>
				      </div>`,*/
		    cellTemplate:
				`<div class="ui-grid-cell-contents row_col_grid_cell" style="padding: 0px;" ng-class="{row_active: grid.appScope.slcted_pt_doc_row_key == [row.entity.t_id, row.entity.t_l].join('_'), 'bordr_lft_rgt': '`+rw["k"]+`' == 'EMPTY', new_row_full_hglt: grid.appScope.row_chck_dic[row.entity.t_id]==true, empty_row_clr_bg: row.entity.empty_row=='Y'}">
					<div  ng-if="!(`+ml_avl+`)" class="seq_full_span spke_clr_{{row.entity['`+rw['k']+`'].clr}} hdr_grp_clr_{{row.entity['`+rw['k']+`']['clr']}}" ng-class="{active: grid.appScope.slcted_pt_doc_cell_key == [row.entity.t_id, '`+rw["k"]+`'].join('_'), data_overlap_red: row.entity['`+rw["k"]+`']['data_overlap'] == 'Y', cel_cl_active: grid.appScope.slcted_data_lost_dic['`+rw['n']+`']['tids'][row.entity['t_id']]=='`+rw["k"]+`', ee_expr_str_cell_done: row.entity['`+rw["k"]+`']['f'] == 'Y', frml_reslt_show: grid.appScope.frml_clr_dic_cell['`+rw["k"]+`'][row.entity.t_id] == 'RES' && grid.appScope.formula_check_hgt_chck_func(row.entity), frml_oprtr_show: grid.appScope.frml_clr_dic_cell['`+rw["k"]+`'][row.entity.t_id] == 'OPR' && grid.appScope.formula_check_hgt_chck_func(row.entity), chck_sum_cls: row.entity['`+rw["k"]+`']['c_s'], row_bold: row.entity['`+rw["k"]+`']['f'] == 'Y'}" ng-click="grid.appScope.cell_grp_click_func(row.entity, '`+rw["k"]+`', false, $event, '`+rw["n"]+`')" style="width: 100%;text-align: right;padding-right: 5px;" title="{{row.entity['`+rw["k"]+`']['v']+'\n'+grid.appScope.stingify_obj(row.entity['`+rw["k"]+`']['phcsv'])+'\n'+row.entity['`+rw["k"]+`']['expr_str'] +'\n V.T:'+grid.appScope.stingify_obj(row.entity['`+rw["k"]+`']['vt'])}}">
					{{row.entity['`+rw["k"]+`']['v']}} <sub style="color: #F44336;" ng-if="row.entity['`+rw["k"]+`']['c_s']" title="{{row.entity['`+rw["k"]+`']['c_s']}}">{{row.entity['`+rw["k"]+`']['c_s']}}</sub>
						<span class="d_table_td_ref_span" ng-if="0 && row.entity['`+rw["k"]+`']['eid']">G</span>
					</div>
					<div ng-if="`+ml_avl+`" ng-repeat="cell_dic in row.entity['`+rw["k"]+`'] track by $index" class="seq_full_span hdr_grp_clr_{{cell_dic['clr']}}" ng-class="{active: grid.appScope.slcted_pt_doc_cell_key == [row.entity.sn, '`+rw["k"]+`', '`+rw["g"]+`', cell_dic['v']].join('_'), data_overlap_red: cell_dic['data_overlap'] == 'Y', cel_cl_active: grid.appScope.slcted_data_lost_dic['`+rw['n']+`']['tids'][row.entity['t_id']]=='`+rw["k"]+`', ee_expr_str_cell_done: row.entity['`+rw["k"]+`']['f'] == 'Y', frml_reslt_show: grid.appScope.frml_clr_dic_cell['`+rw["k"]+`'][row.entity.t_id] == 'RES' && grid.appScope.formula_check_hgt_chck_func(row.entity), frml_oprtr_show: grid.appScope.frml_clr_dic_cell['`+rw["k"]+`'][row.entity.t_id] == 'OPR' && grid.appScope.formula_check_hgt_chck_func(row.entity), chck_sum_cls: row.entity['`+rw["k"]+`']['c_s'], row_bold: cell_dic['f_col']}" ng-click="grid.appScope.cell_grp_ind_click_func(row.entity, cell_dic, '`+rw["k"]+`', '`+rw["n"]+`', '`+rw["g"]+`')" title="{{cell_dic['v']+'\n'+grid.appScope.stingify_obj(cell_dic['phcsv'])+'\n'+cell_dic['expr_str'] +'\n V.T:'+grid.appScope.stingify_obj(cell_dic['vt'])}}">
					{{cell_dic['v']}} <sub style="color: #F44336;" ng-if="cell_dic['c_s']" title="{{cell_dic['c_s']}}">{{cell_dic['c_s']}}</sub>
						<span class="d_table_td_ref_span" ng-if="0 && cell_dic['eid']">G</span>
					</div>
				</div>`
			}
			seq_coldef.push(nw_dic);
		});
		return seq_coldef;
	}
/***********************************/
	/***********************************/
	function gridOptionsAvl_columnDefs_func(){
		var seq_coldef = [
		    { field: 'sn', displayName:'S.No', enableSorting: true, width:'50', pinnedLeft:true,  headerCellClass: 'hdr_cntr', cellTemplate:
			`<div class="ui-grid-cell-contents row_col_grid_cell" title="{{COL_FIELD}}" ng-class="{row_active: grid.appScope.slcted_pt_doc_row_key == [row.entity.t_id, row.entity.t_l].join('_')}">{{COL_FIELD}}</div>`
		    },
		    { field: 't_l', displayName:'Period Type', enableSorting: true, width:'100', pinnedLeft:true,  headerCellClass: 'hdr_cntr', cellTemplate:
			`<div class="ui-grid-cell-contents row_col_grid_cell mn_cell" title="{{COL_FIELD}}" ng-class="{row_active: grid.appScope.slcted_pt_doc_row_key == [row.entity.t_id, row.entity.t_l].join('_')}" ng-bind-html="COL_FIELD | trusted1"></div>`
		    }
		];
		$scope.doc_avl_res['phs'].forEach(function(rw){
			width = (parseInt(rw['ml'])* 60) || 180;
			if(width == 60)
				width = '*'
			var nw_dic = { field: rw['n'], displayName:rw['n'], enableSorting: false, enableFiltering:true, width:width, minWidth: '60',  headerCellClass: 'hdr_cntr', pinnedLeft:false, cellEditableCondition:false,  
		    headerCellTemplate: `
				      <div ng-class="{ 'sortable': sortable, entre_col_sel_cls: grid.appScope.slcted_sys_clfed_dic['`+rw+`']}">
					  <div role="button" tabindex="0" ng-keydown="handleKeyDown($event)" class="ui-grid-cell-contents ui-grid-header-cell-primary-focus" col-index="renderIndex" ng-click="grid.appScope.sys_clfd_selc_col_func('`+rw+`')">
						<span class="ui-grid-header-cell-label ng-binding" ui-grid-one-bind-id-grid="col.uid + '-header-text'">`+rw['n']+`</span>
					  </div>
					  <div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">
					      <input type="text" class="ui-grid-filter-input" ng-model="colFilter.term"/>
					      <div class="ui-grid-filter-button" ng-click="colFilter.term = null">
						  <i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i>
					      </div>
					  </div>
				      </div>`,
		    cellTemplate:
				`<div class="ui-grid-cell-contents row_col_grid_cell" style="padding: 0px;" ng-class="{row_active: grid.appScope.slcted_pt_doc_row_key == [row.entity.t_id, row.entity.t_l].join('_')}">
					<div ng-repeat="pg in row.entity['`+rw["k"]+`'] track by $index" class="seq_full_span" ng-class="{avf_flg: pg['avf']=='Y', active: grid.appScope.slcted_pt_doc_cell_key == [row.entity.t_l, '`+rw["k"]+`', pg['t']].join('_')}" ng-click="grid.appScope.cell_click_func(pg, '`+rw["k"]+`', row.entity)">{{pg['t']}}</div>
				</div>`
			}
			seq_coldef.push(nw_dic);
		});
		return seq_coldef;
	}
	/***********************************/
	$scope.ph_csv_config_chck = {'pt': false, 'p': false, 'vt': false, 'c': false, 's': false, 'm': false};
    	$scope.siipbb_t_th_chck_func = function(key, flg){
        	$scope.ph_csv_config_chck[key] = !flg;
    	}
	/***********************************/
	$scope.ph_csv_config_table_flg_fnl = false;
	$scope.ph_csv_config_shw_dic = {};	
	$scope.hdr_cl_active_key = null;
	$scope.slcted_data_lost_dic = {};
	$scope.sys_hdr_selc_col_func = function(k, n, g, ev){
		if(ev && ev.altKey){
			if($scope.actve_full_tab_dic['k'] == 'DBDL'){
				if(!(n in $scope.slcted_data_lost_dic)){
					$scope.slcted_data_lost_dic[n] = {'phs': [],  'tids':{}};
				}
				if($scope.slcted_data_lost_dic[n]['phs'].includes(k)){
					$scope.slcted_data_lost_dic[n]['phs'].splice($scope.slcted_data_lost_dic[n]['phs'].indexOf(k), 1);
					$scope.slcted_data_lost_dic[n] = {'phs': [],  'tids':{}};
				}else{
					$scope.slcted_data_lost_dic[n] = {'phs': [],  'tids':{}};
					$scope.slcted_data_lost_dic[n]['phs'].push(k);
					$scope.gridOptionsGrp.data.forEach(function(row){
						if(k in row && row[k]['data_overlap']=='Y'){
							$scope.slcted_data_lost_dic[n]['tids'][row['t_id']] = k;
						}
					});
				}
			}	
		}else if(ev && ev.ctrlKey){
				$scope.hdr_cl_active_key = k;
				$scope.ph_csv_config_shw_dic = {};
				$scope.ph_csv_config = {'pt': '', 'p': '', 'vt': '', 'c': '', 's': '', 'm': ''};
				$scope.ph_csv_config_chck = {'pt': false, 'p': false, 'vt': false, 'c': false, 's': false, 'm': false};
				for(cl in {'pt':1, 'p':1, 'c': 1, 's':1, 'vt': 1}){
					$scope.ph_csv_config_shw_dic[cl] = 1;
					$scope.ph_csv_config_chck[cl] = false;
				}
				$scope.frm_csv = false;
				$scope.ph_csv_config_table_flg_fnl = true;
		}else{
			if(!(n in $scope.slcted_data_lost_dic)){
				$scope.slcted_data_lost_dic[n] = {'phs': [],  'tids':{}};
			}
			if($scope.slcted_data_lost_dic[n]['phs'].includes(k)){
				$scope.slcted_data_lost_dic[n]['phs'].splice($scope.slcted_data_lost_dic[n]['phs'].indexOf(k), 1);	
			}else{
				$scope.slcted_data_lost_dic[n]['phs'].push(k);
			}
		}
		//console.log($scope.slcted_data_lost_dic);
		$scope.grp_grid.scope.slcted_data_lost_dic = $scope.slcted_data_lost_dic;
		$scope.grp_grid.scope.hdr_cl_active_key =  $scope.hdr_cl_active_key;
	}
	/***********************************/
	$scope.ph_csv_config_table_cls_fnl = function(){
		$scope.frm_csv = false;
		$scope.ph_csv_config_table_flg_fnl = false;
		$scope.ph_csv_config_shw_dic = {};	
		$scope.hdr_cl_active_key = null;
		$scope.grp_grid.scope.hdr_cl_active_key =  $scope.hdr_cl_active_key;
	}
	/***********************************/
   	$scope.ph_clas_config_save_fnl_func = function(){
		var rids       = [];
		var r_key_list = {};
		if(!$scope.frm_csv){
			for (var  j = 0; j < $scope.grp_grid['data'].data.length; j++) {
				var ful_row = $scope.grp_grid['data'].data[j];
				if($scope.hdr_cl_active_key in ful_row){
					var kkk =  ful_row[$scope.hdr_cl_active_key];
					r_key_list[kkk['r_key']]	 = j;
				}
			}
			var post_data = {'cmd_id': 177, 'keys': Object.keys(r_key_list)};
                        $scope.ps = true;
                        tasService.ajax_request(post_data, 'POST', function(res){
				$scope.ps = false;
				for (var k in r_key_list){
					var j	= r_key_list[k]		
					$scope.grp_grid['data'].data[j][$scope.hdr_cl_active_key]	= Object.assign($scope.grp_grid['data'].data[j][$scope.hdr_cl_active_key], res['data'][k])
					delete $scope.grp_grid['data'].data[j][$scope.hdr_cl_active_key]['r_key']
				}
				$scope.ph_clas_config_save_fnl_func_after_redis();
			});
		}
	}
	/***********************************/
   	$scope.ph_clas_config_save_fnl_func_after_redis = function(){
		var dic = $scope.ph_csv_config;
		angular.forEach(dic, function(val, key){
			if(!$scope.ph_csv_config_chck[key])	
				delete dic[key];
		});
		var rids = [];
		if(!$scope.frm_csv){
			for (var  j = 0; j < $scope.grp_grid['data'].data.length; j++) {
				var ful_row = $scope.grp_grid['data'].data[j];
				if($scope.hdr_cl_active_key in ful_row){
						var res =  ful_row[$scope.hdr_cl_active_key];
						var rid_key = [res['t'], res['x']].join(':$$:'); 
						rids.push(rid_key);
				}
			}
		}else{
			rids = Object.keys($scope.WMergeAcross_grp_dic['data'] || {});	
		}
		if(rids.length == 0 || !(Object.keys(dic).length)){
			tasAlert.show('Nothing to config.', 'warning', 1000);
			return;
		}
		var post_data = {'cmd_id': 42, 'type': 'ROW', 'data':dic, 'r_ids': rids, "stype":'ROW', 'table_type': $scope.selected_grp_dic['table_type'], 'grpid': $scope.selected_grp_dic['grpid']};
		$scope.ps = true;
		tasService.ajax_request(post_data, 'POST', function(res){
			$scope.ps = false;
			if(res['message'] == 'done'){
				tasAlert.show(res['message'], 'success', 1000);
				$scope.usr_save_update_func(dic, 'PH_CSV');	
			}else{
				tasAlert.show(res['message'], 'error', '');
			}
		});
	}
	/***********************************/
	 $scope.stingify_obj = function(obj){
                return JSON.stringify(obj)
    	}
	/***********************************/
    	$scope.toggleCheckerAll_dic = {'val': false};
    	$scope.toggleCheckerAll = function(flg){
		$scope.row_chck_dic = {};
		flg = !flg;
		$scope.toggleCheckerAll_dic['val'] = flg
		if(flg){
			var filteredRows = $scope.gridApiGrp.core.getVisibleRows($scope.gridApiGrp.grid);
			for (var  i = 0; i < filteredRows.length; i++) {
			    var tid = filteredRows[i]['entity']['t_id'];
			    $scope.row_chck_dic[tid] = flg;
			}
		}
    	}
	/***********************************/
	var gridOptionsColumnSn_all = `
                <div class="ui-grid-header-cell ui-grid-clearfix" style="padding: 0px; cursor: pointer;background-color: #f0f0ee;">
                        <div class="ui-grid-cell-contents" ng-click="grid.appScope.toggleCheckerAll(grid.appScope.toggleCheckerAll_dic['val'])" style="padding-right: 4px;">
                                <div class="ui-grid-selection-row-header-buttons ui-grid-icon-ok" ng-class="{'ui-grid-row-selected': grid.appScope.toggleCheckerAll_dic['val']}">&nbsp;</div>
                        </div>
                </div>`;
	/***********************************/
	$scope.row_chck_dic = {};
	$scope.row_chck_dic_func = function(id){
        	if(id in $scope.row_chck_dic)
                	delete $scope.row_chck_dic[id];
        	else
                	$scope.row_chck_dic[id] = true;
    	}
	/***********************************/
	function gridOptionsGrp_columnDefs_func(phs, v_flg=true){
		var t_l_width = 300;
		var t_l_dis_name = 'Description';
		if($scope.actve_full_tab_dic['k']=='Group'){
			t_l_width = 100;
			t_l_dis_name = 'PH';
		}else if($scope.actve_full_tab_dic['k']=='VGHPATTERN'){
			 t_l_width = 100;
		}	
		var seq_coldef = [
		    {
                field: 'sn',
                displayName: '#',
                width: 30,
                pinnedLeft: true,
                cellEditableCondition:false,
		visible: v_flg,
                'headerCellTemplate':gridOptionsColumnSn_all,
                cellTemplate:
                `<div class="ui-grid-cell-contents" style="padding: 0px; cursor: pointer;background-color: #f0f0ee;" ng-click="grid.appScope.row_chck_dic_func(row.entity.t_id)">
                        <div class="ui-grid-cell-contents">
                                <div class="ui-grid-selection-row-header-buttons ui-grid-icon-ok" ng-class="{'ui-grid-row-selected': grid.appScope.row_chck_dic[row.entity.t_id]}" style="user-select: none;">&nbsp;
                                </div>
                        </div>
                </div>`
          },
		    { field: 'sn', displayName:'S.No',  visible: v_flg, enableSorting: true, width:'50', pinnedLeft:true,  headerCellClass: 'hdr_cntr', cellEditableCondition:false, cellTemplate:
			`<div class="ui-grid-cell-contents row_col_grid_cell mn_grp_sec_{{row.entity.clr}}" title="{{COL_FIELD}}" ng-class="{row_active: grid.appScope.slcted_pt_doc_row_key == [row.entity.t_id, row.entity.t_l].join('_'),  match_active: row.entity.match == 'Y', new_row_full_hglt: grid.appScope.row_chck_dic[row.entity.t_id] == true, empty_row_clr_bg: row.entity.empty_row=='Y'}">{{COL_FIELD}}</div>`
		    },
		    { field: 't_l', displayName:t_l_dis_name,  visible: v_flg, enableSorting: true, width:t_l_width, pinnedLeft:true,  headerCellClass: 'hdr_cntr', cellEditableCondition:false, cellTemplate:
			`<div class="ui-grid-cell-contents row_col_grid_cell mn_cell" 
				title="{{row.entity['t_l']+'\n'+row.entity['t_id'] + '\nTaxo: '+row.entity['taxo']}}" 
				ng-class="{row_active: grid.appScope.slcted_pt_doc_row_key == [row.entity.t_id, row.entity.t_l].join('_'), active: grid.appScope.slcted_pt_sub_doc_cell_key == [row.entity.sn, row.entity.t_l].join('_'), new_row_full_hglt: grid.appScope.row_chck_dic[row.entity.t_id] == true, empty_row_clr_bg: row.entity.empty_row=='Y', frml_reslt_show: grid.appScope.frml_clr_dic[row.entity.t_id] == 'RES' && grid.appScope.formula_check_hgt_chck_func(row.entity), frml_oprtr_show: grid.appScope.frml_clr_dic[row.entity.t_id] == 'OPR' && grid.appScope.formula_check_hgt_chck_func(row.entity), 'row_bold': row.entity.f == 'Y', desc_clr_red: row.entity.clr == 'R'}" 
				ng-click="grid.appScope.cell_grp_click_func(row.entity, 't_l')">
			<div ng-bind-html="COL_FIELD | trusted1" class="row_col_grid_cell_desc_title"></div>
			<div style="width: 20px; float: left;border-left: 1px solid #e0e0e0;text-align: center;" ng-if="row.entity['th_flg'] != ''">{{row.entity['th_flg']}}</div>
			</div>`
		    }
		];
		phs.forEach(function(rw){
			width = (parseInt(rw['ml'])* 60) || 180;
			min_wdth= 90;
			max_wdth= 150;
			hdr_class = 'hdr_cntr';
			var ml_avl = false;
			var grp = rw['g'] || (rw['k'].split('-')[0]);
			if(width == 60)
				width = '*'
			if(rw['k']=='EMPTY'){
				width = 3;
				 min_wdth= 3;
                        	max_wdth= 3;
				hdr_class = 'hdr_cntr bordr_lft_rgt';
			}
			if('ml' in rw){
				ml_avl = true;
				width = (parseInt(rw['ml'])* 60) || 180;
        	                min_wdth= width;
	                        max_wdth= width;
			}
			var pin_lft = false;
			if('pin_left' in rw && rw['pin_left']=='Y')
				pin_lft = true;
			var nw_dic = { field: rw['k'], displayName:rw['n'], group: grp, enableSorting: false, enableFiltering:true, width:'*', minWidth: min_wdth,  maxWidth: max_wdth, headerCellClass: hdr_class, pinnedLeft:pin_lft, cellEditableCondition:false, 
		    headerCellTemplate:`<div class="ui-grid-cell-contents hdr_grp_clr_{{'`+rw['clr']+`'}}" style="text-align: center;" ng-click="grid.appScope.sys_hdr_selc_col_func('`+rw['k']+`', '`+rw['n']+`', '`+rw['g']+`', $event)" ng-class="{ entre_col_sel_cls: grid.appScope.slcted_sys_clfed_dic['`+rw+`'], hdr_cl_active:grid.appScope.hdr_cl_active_key=='`+rw['k']+`' || grid.appScope.slcted_data_lost_dic['`+rw['n']+`']['phs'].includes('`+rw['k']+`'), 'chck_sum_err': '`+rw['c_s']+`' == 'Y'}" title="`+rw['n']+`">
						`+rw['n']+`
						<span class="pull-right" style="color: #ff3547;cursor: pointer;" ng-if="'`+rw['k']+`' !='EMPTY' && '`+rw['re_compute']+`' =='Y'" ng-click="grid.appScope.grp_db_col_upd_func('`+rw['k']+`', '`+rw['n']+`', '`+rw['g']+`', $event);$event.stopPropagation();"><i class="fa fa-refresh" aria-hidden="true"></i></span>
					</div>`,
                   cellTemplate:
				`<div class="ui-grid-cell-contents row_col_grid_cell" style="padding: 0px;" ng-class="{row_active: grid.appScope.slcted_pt_doc_row_key == [row.entity.t_id, row.entity.t_l].join('_'), 'bordr_lft_rgt': '`+rw["k"]+`' == 'EMPTY', new_row_full_hglt: grid.appScope.row_chck_dic[row.entity.t_id]==true, empty_row_clr_bg: row.entity.empty_row=='Y'}">
					<div  ng-if="!(`+ml_avl+`)" class="seq_full_span spke_clr_{{row.entity['`+rw['k']+`'].clr}} hdr_grp_clr_{{row.entity['`+rw['k']+`']['clr']}}" ng-class="{active: grid.appScope.slcted_pt_doc_cell_key == [row.entity.t_id, '`+rw["k"]+`'].join('_'), data_overlap_red: row.entity['`+rw["k"]+`']['data_overlap'] == 'Y', cel_cl_active: grid.appScope.slcted_data_lost_dic['`+rw['n']+`']['tids'][row.entity['t_id']]=='`+rw["k"]+`', ee_expr_str_cell_done: row.entity['`+rw["k"]+`']['f'] == 'Y', frml_reslt_show: grid.appScope.frml_clr_dic_cell['`+rw["k"]+`'][row.entity.t_id] == 'RES' && grid.appScope.formula_check_hgt_chck_func(row.entity), frml_oprtr_show: grid.appScope.frml_clr_dic_cell['`+rw["k"]+`'][row.entity.t_id] == 'OPR' && grid.appScope.formula_check_hgt_chck_func(row.entity), chck_sum_cls: row.entity['`+rw["k"]+`']['c_s'], row_bold: row.entity['`+rw["k"]+`']['f'] == 'Y'}" ng-click="grid.appScope.cell_grp_click_func(row.entity, '`+rw["k"]+`', false, $event, '`+rw["n"]+`')" style="width: 100%;text-align: right;padding-right: 5px;" title="{{row.entity['`+rw["k"]+`']['v']+'\n'+grid.appScope.stingify_obj(row.entity['`+rw["k"]+`']['phcsv'])+'\n'+row.entity['`+rw["k"]+`']['expr_str'] +'\n V.T:'+grid.appScope.stingify_obj(row.entity['`+rw["k"]+`']['vt'])}}">
					{{row.entity['`+rw["k"]+`']['v']}} <sub style="color: #F44336;" ng-if="row.entity['`+rw["k"]+`']['c_s']" title="{{row.entity['`+rw["k"]+`']['c_s']}}">{{row.entity['`+rw["k"]+`']['c_s']}}</sub>
						<span class="d_table_td_ref_span" ng-if="0 && row.entity['`+rw["k"]+`']['eid']">G</span>
					</div>
					<div ng-if="`+ml_avl+`" ng-repeat="cell_dic in row.entity['`+rw["k"]+`'] track by $index" class="seq_full_span hdr_grp_clr_{{cell_dic['clr']}}" ng-class="{active: grid.appScope.slcted_pt_doc_cell_key == [row.entity.sn, '`+rw["k"]+`', '`+rw["g"]+`', cell_dic['v']].join('_'), data_overlap_red: cell_dic['data_overlap'] == 'Y', cel_cl_active: grid.appScope.slcted_data_lost_dic['`+rw['n']+`']['tids'][row.entity['t_id']]=='`+rw["k"]+`', ee_expr_str_cell_done: row.entity['`+rw["k"]+`']['f'] == 'Y', frml_reslt_show: grid.appScope.frml_clr_dic_cell['`+rw["k"]+`'][row.entity.t_id] == 'RES' && grid.appScope.formula_check_hgt_chck_func(row.entity), frml_oprtr_show: grid.appScope.frml_clr_dic_cell['`+rw["k"]+`'][row.entity.t_id] == 'OPR' && grid.appScope.formula_check_hgt_chck_func(row.entity), chck_sum_cls: row.entity['`+rw["k"]+`']['c_s'], row_bold: cell_dic['f_col']}" ng-click="grid.appScope.cell_grp_ind_click_func(row.entity, cell_dic, '`+rw["k"]+`', '`+rw["n"]+`', '`+rw["g"]+`')" title="{{cell_dic['v']+'\n'+grid.appScope.stingify_obj(cell_dic['phcsv'])+'\n'+cell_dic['expr_str'] +'\n V.T:'+grid.appScope.stingify_obj(cell_dic['vt'])}}">
					{{cell_dic['v']}} <sub style="color: #F44336;" ng-if="cell_dic['c_s']" title="{{cell_dic['c_s']}}">{{cell_dic['c_s']}}</sub>
						<span class="d_table_td_ref_span" ng-if="0 && cell_dic['eid']">G</span>
					</div>
				</div>`
			}
			seq_coldef.push(nw_dic);
		});
		return seq_coldef;
	}
	/***********************************/
	$scope.formula_check_hgt_chck_func = function(rw){
		if('t_grpid' in rw){
			if($scope.t_grpid){
				if(rw['t_grpid'] == $scope.t_grpid){
					return true;
				}else{
					return false;
				}
			}else
				return true;
		}else
			return true;
	}
	/***********************************/
	function gridOptionsSubGrp_columnDefs_func(phs){
		var t_l_width = 100;
		var t_l_dis_name = 'PH';
		if($scope.actve_full_tab_dic['k']=='WPH' || $scope.actve_full_tab_dic['k']=='DBDL'){
			t_l_width = 300;
		}	
		var seq_coldef = [
		    { field: 'sn', displayName:'S.No', enableSorting: true, width:'50', pinnedLeft:true,  headerCellClass: 'hdr_cntr', cellTemplate:
			`<div class="ui-grid-cell-contents row_col_grid_cell" title="{{COL_FIELD}}" ng-class="{row_active: grid.appScope.slcted_pt_sub_doc_row_key == [row.entity.sn, row.entity.t_l].join('_'),  match_active: row.entity.match == 'Y'}">{{COL_FIELD}}</div>`
		    },
		    { field: 't_l', displayName:t_l_dis_name, enableSorting: true, width:t_l_width, pinnedLeft:true,  headerCellClass: 'hdr_cntr', cellTemplate:
			`<div class="ui-grid-cell-contents row_col_grid_cell mn_cell" title="{{COL_FIELD}}" ng-class="{row_active: grid.appScope.slcted_pt_sub_doc_row_key == [row.entity.sn, row.entity.t_l].join('_')}" ng-bind-html="COL_FIELD | trusted1"></div>`
		    }
		];
		phs.forEach(function(rw){
			width = (parseInt(rw['ml'])* 60) || 180;
			min_wdth= 90;
			max_wdth= 150;
			hdr_class = 'hdr_cntr';
			if(width == 60)
				width = '*'
			if(rw['k']=='EMPTY'){
				width = 3;
				 min_wdth= 3;
                        	max_wdth= 3;
				hdr_class = 'hdr_cntr bordr_lft_rgt';
			}
			var nw_dic = { field: rw['n'], displayName:rw['n'], enableSorting: false, enableFiltering:true, width:'*', minWidth: min_wdth,  maxWidth: max_wdth, headerCellClass: hdr_class, pinnedLeft:false, cellEditableCondition:false,  
		    headerCellTemplate: `
				      <div ng-class="{ 'sortable': sortable, entre_col_sel_cls: grid.appScope.slcted_sys_clfed_dic['`+rw+`']}">
					  <div role="button" tabindex="0" ng-keydown="handleKeyDown($event)" class="ui-grid-cell-contents ui-grid-header-cell-primary-focus" col-index="renderIndex" ng-click="grid.appScope.sys_clfd_selc_col_func('`+rw+`')">
						<span class="ui-grid-header-cell-label ng-binding" ui-grid-one-bind-id-grid="col.uid + '-header-text'" title="`+rw['n']+`">`+rw['n']+`</span>
					  </div>
					  <div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">
					      <input type="text" class="ui-grid-filter-input" ng-model="colFilter.term"/>
					      <div class="ui-grid-filter-button" ng-click="colFilter.term = null">
						  <i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i>
					      </div>
					  </div>
				      </div>`,
		    cellTemplate:
				`<div class="ui-grid-cell-contents row_col_grid_cell" style="padding: 0px;" ng-class="{row_active: grid.appScope.slcted_pt_sub_doc_row_key == [row.entity.sn, row.entity.t_l].join('_'), 'bordr_lft_rgt': '`+rw["k"]+`' == 'EMPTY'}">
					<div class="seq_full_span" ng-class="{active: grid.appScope.slcted_pt_sub_doc_cell_key == [row.entity.sn, '`+rw["k"]+`'].join('_'), data_overlap_red: row.entity['`+rw["k"]+`']['data_overlap'] == 'Y', cid_ky_prsn: row.entity['`+rw["k"]+`']['eid']}" ng-click="grid.appScope.cell_grp_click_func(row.entity, '`+rw["k"]+`', true)" style="width: 100%;text-align: right;padding-right: 5px;">{{row.entity['`+rw["k"]+`']['v']}}</div>
				</div>`
			}
			seq_coldef.push(nw_dic);
		});
		return seq_coldef;
	}
	/***********************************/
	function gridOptionsSpike_columnDefs_func(){
		var seq_coldef = [
		    { field: 'sn', displayName:'S.No', enableSorting: true, width:'50', pinnedLeft:false,  headerCellClass: 'hdr_cntr', cellTemplate:
			`<div class="ui-grid-cell-contents row_col_grid_cell spke_clr_{{row.entity.clr}} hdr_grp_clr_{{row.entity['clr']}}" title="{{COL_FIELD}}" ng-class="{row_active11: grid.appScope.slcted_spk_pt_doc_row_key == [row.entity.sn, row.entity.t_l].join('_')}">{{COL_FIELD}}</div>`
		    },
		    { field: 't_l', displayName:'Description', enableSorting: true, width:'*', pinnedLeft:false,  headerCellClass: 'hdr_cntr', cellTemplate:
			`<div class="ui-grid-cell-contents row_col_grid_cell mn_cell" title="{{COL_FIELD}}" ng-class="{row_active: grid.appScope.slcted_spk_pt_doc_row_key == [row.entity.sn, row.entity.t_l].join('_')}" ng-bind-html="COL_FIELD | trusted1" ng-click="grid.appScope.spke_click_func(row.entity)"></div>`
		    }
		];
		return seq_coldef;
	}
	/***********************************/
	$scope.cl_bk_get_rgt_data_func = function(res){
		$scope.ref_doc_list = [];
		var iframe_dom = document.getElementById('iframe2');
		if(iframe_dom)
			iframe_dom.setAttribute('src', 'src/no_ref_found.html');
		$scope.slcted_doc_pno_idx_key = null;
		$scope.gridOptionsAvlAll.data = [];
		$scope.gridOptionsAvlAll_res = {};
		$scope.ref_grp_list = [];
		$scope.ref_grp_idx = {};
		$scope.ps = false;
		$scope.cell_eid_avl = false;
		console.log(res);
		if(res['message']){
			if(res['message']=='done'){
				if($scope.actve_full_tab_dic['k']=='MT'){
					console.log('input details')		
					$scope.doc_avl_res = res;
					$scope.gridOptionsAvl.columnDefs = gridOptionsAvl_columnDefs_func();
					$scope.gridOptionsAvl.data = res['data'];
				}
			}else{
				tasAlert.show(res['message'], 'error', 1000);
			}
		}
	}
	/***********************************/
	$scope.actve_full_tab = null;
        $scope.get_rgt_data_func = function(idx, row){
		$scope.clicked_lft_row_dic = row;
		$scope.actve_full_tab = [$scope.side_menu_full_list[idx]['k'], row['k']].join('$$');
		$scope.actve_full_tab_dic = $scope.side_menu_full_list[idx];
		$scope.slcted_pt_doc_row_key = null;
		$scope.slcted_pt_doc_cell_key = null;
		$scope.ref_grp_idx = {};
		if($scope.actve_full_tab_dic['k']!='MT'){
			$scope.ref_grp_list = $scope.clicked_lft_row_dic['idata'];
			$scope.ref_grp_list.forEach(function(row, idxx){
			    $scope.ref_grp_idx[row['k']] = idxx;
			});
			$scope.load_ismenu_grp_ref_func($scope.ref_grp_list[0], row, idx);
			return;
                }
		var post_data = {'cmd_id': 165, 'etype': $scope.actve_full_tab_dic['k'], 'idata': row['idata']};
                $scope.ps = true;
                tasService.ajax_request(post_data, 'POST', $scope.cl_bk_get_rgt_data_func);
        }
	/***********************************/
 	$scope.do_resize = function(){
        	$timeout(function(){
                	window.dispatchEvent(new Event('resize'));
        	});
    	}
	/***********************************/
        $scope.doc_list_flg = true;
	$scope.doc_list_func = function(){
        	$scope.doc_list_flg = !$scope.doc_list_flg;
		$timeout(function(){
                	$scope.do_resize();
        	});
    	}
	/***********************************/
	$scope.toggle_btm_sec_dic = {'k': 'down'};
    	$scope.toggle_btm_sec_btn_func = function(){
		if($scope.toggle_btm_sec_dic['k'] == 'down')
			$scope.toggle_btm_sec_dic['k'] = 'up';
		else
			$scope.toggle_btm_sec_dic['k'] = 'down';
		$timeout(function(){
			$scope.do_resize();
		});
    	}
	/***********************************/
	$scope.gridOptionsAvlAll.data  = [];
        $scope.cl_bk_cell_click_func = function(res){
		$scope.ps = false;
		console.log(res);
		if(res['message']){
			if(res['message']=='done'){
				$scope.gridOptionsAvlAll_res =res;
				$scope.gridOptionsAvlAll.columnDefs = gridOptionsAvlAll_columnDefs_func();
				$scope.gridOptionsAvlAll.data = res['data'];
                        }else{
	
                        }		
		}
	}
	/***********************************/
	$scope.slcted_pt_doc_row_key = null;
	$scope.slcted_pt_doc_cell_key = null;
        $scope.cell_click_func = function(cel, ph, rw){
		$scope.frml_clr_dic = {};
	        $scope.frml_clr_dic_cell = {};
		$scope.slcted_pt_doc_row_key = [rw.t_id, rw.t_l].join('_');
		$scope.slcted_pt_doc_cell_key = [rw.t_l, ph, cel['t']].join('_');
		$scope.ref_doc_list = [];
		var iframe_dom = document.getElementById('iframe2');
		if(iframe_dom)
			iframe_dom.setAttribute('src', 'src/no_ref_found.html');
		$scope.slcted_doc_pno_idx_key = null;
		$scope.gridOptionsAvlAll.data = [];
		if('avf' in cel && cel['avf'] == 'Y'){
			var iph = [rw['t_l'], ph].join('');
	                var post_data = {'cmd_id': 4, 'etype': $scope.clicked_lft_row_dic['etype'], 'idata': $scope.clicked_lft_row_dic['idata'], 'esubtype': $scope.clicked_lft_row_dic['esubtype'], 'iph': iph};
        	        $scope.ps = true;
                	tasService.ajax_request(post_data, 'POST', $scope.cl_bk_cell_click_func);
		}else{
			$scope.table_id = cel['t'];	
			tasIframe.tableHighlight('iframe2', cel['t'], [], 'parent_iframe_tag', false);
		}
        }
	/***********************************/
	$scope.cell_grp_ind_click_func = function(rw, cel, k, n, g){
		$scope.slcted_pt_doc_cell_key = [rw.sn, k, g, cel['v']].join('_');
		$scope.slcted_pt_doc_row_key = [rw.t_id, rw.t_l].join('_');
		if($scope.mn_tbl_pdf_btn_flg=='table'){
			var xml_list_cld = [];
			tasIframe.clearTableHighlight('iframe2');
				let iframe_dom = document.querySelector('#iframe2');
				if(!iframe_dom)
					return;
				let doc_path = iframe_dom.getAttribute('src') || '';
				let temp = "src/iframe_track_v2.html?"+'/'+$scope.deltastorage+'/'+$scope.project_id+'_'+$scope.deal_id+"/Table_Htmls/"+cel['t']+'.html';
				if(doc_path != temp){
					time = 1000;
				}
			if(!cel['t']){
				return;
			}		
			$scope.table_id = cel['t'];	
			tasIframe.tableHighlight('iframe2', cel['t'], [cel['x']], 'parent_iframe_tag', false);
		}else{
			var p_num = 0;
		    	if('x' in cel){
			    	xml = cel['x'].split(':@:');
			    	p_num = xml[0].split('_')[1].split('#')[0].split('@')[0];
		    	}
		    	$scope.p_num = p_num;
		    	$scope.doc_id = cel['d'];
		    	var info = [];
		    	var bbox = cel['bbox'] || [];
		    	if($scope.doc_id in $scope.bbox_dict && $scope.p_num in $scope.bbox_dict[$scope.doc_id])
				info =  $scope.bbox_dict[$scope.doc_id][$scope.p_num];
			if(!cel['d']){
                        	return;
			}
			tasIframe.pdfHighlight('iframe2', $scope.doc_id, $scope.p_num, bbox, info, 'parent_iframe_tag', true, '', 200);
		}
        }
	/***********************************/
	$scope.get_cell_data_from_redis_func = function(rw, ph, callback){
		var post_data = {'get_key': rw[ph]['r_key']};
		tasService.redis_request(post_data, 'POST', function(res){
			rw[ph] = Object.assign(rw[ph], res);
			delete rw[ph]['r_key'];
			callback()
		});	
		
	}
	/***********************************/
	$scope.get_cell_data_func = function(rw, ph, sub=false, ev, n){
		var post_data = {'get_key': rw[ph]['r_key']};
		tasService.redis_request(post_data, 'POST', function(res){
			console.log(res)
			rw[ph] = Object.assign(rw[ph], res);
			delete rw[ph]['r_key'];
			$scope.cell_grp_click_func(rw, ph, sub=false, ev, n);
		});	
		
	}
	/***********************************/
	$scope.db_row_highlight	= function(c_scope, attributes, p_data, m_attributes){
		for(var k in p_data){
			$scope[k]	= p_data[k]
		}
		if($scope.mn_tbl_pdf_btn_flg == 'db'){
			attributes.forEach(function(k){
				$scope.db_grid['scope'][k]	= c_scope[k];
			});
		}else if($scope.mn_tbl_pdf_btn_flg == 'formula'){
			$scope.formula_grid.columnDefs = formula_grid_columnDefs_func(); 
			$scope.formula_grid.data = $scope.formula_data;
		}
		m_attributes.forEach(function(k){
                	$scope[k]      = c_scope[k];
		});	
	}
	/***********************************/
	parent.highlight_pdf = function(){

	}
	/***********************************/
	$scope.highlight	= function(rw, ph, cel){
		if(!(ph in rw))
			return;
		if($scope.mn_tbl_pdf_btn_flg=='table'){
				var p_num = 0;
				if('x' in cel){
					xml = cel['x'].split(':@:');
					p_num = xml[0].split('_')[1].split('#')[0];
				}
				$scope.p_num = p_num;
				$scope.doc_id = cel['d'];
				var xml_list_cld = [];
				let time = 0;
				tasIframe.clearTableHighlight('iframe2');
				if('tids' in rw && $scope.actve_full_tab_dic['k']=='R_CHECKSUM'){
					$scope.gridOptionsGrp.data.forEach(function(row){
						if(rw['tids'].includes(String(row['t_id']))){
							if(ph in row){
								var slt_rw = row[ph];
								if(cel['x'] !=slt_rw['x'])
									xml_list_cld.push(slt_rw['x']);
							}
						}
					});
					let iframe_dom = document.querySelector('#iframe2');
					if(!iframe_dom)
						return;
					let doc_path = iframe_dom.getAttribute('src') || '';
					let temp = "src/iframe_track_v2.html?"+'/'+$scope.deltastorage+'/'+$scope.project_id+'_'+$scope.deal_id+"/Table_Htmls/"+cel['t']+'.html';
					if(doc_path != temp){
						time = 1000;
					}
				}			
				if(!cel['t']){
					return;
				}	
				$scope.table_id = cel['t'];	
	               		tasIframe.tableHighlight('iframe2', cel['t'], [cel['x']], 'parent_iframe_tag', false);
				$timeout(function(){
               				tasIframe.tableHighlight('iframe2', cel['t'], xml_list_cld, 'child_iframe_tag', false);
				}, time);
		}else{
			var p_num = 0;
		    	if('x' in cel){
			    	xml = cel['x'].split(':@:');
			    	p_num = xml[0].split('_')[1].split('#')[0].split('@')[0];
		    	}
		    	$scope.p_num = p_num;
		    	$scope.doc_id = cel['d'];
		    	var info = [];
		    	var bbox = cel['bbox'] || [];
		    	if($scope.doc_id in $scope.bbox_dict && $scope.p_num in $scope.bbox_dict[$scope.doc_id])
				info =  $scope.bbox_dict[$scope.doc_id][$scope.p_num];
			if(!cel['d']){
                        	return;
			}
			tasIframe.pdfHighlight('iframe2', $scope.doc_id, $scope.p_num, bbox, info, 'parent_iframe_tag', true, '', 200);
		}
	}

	/***********************************/
	$scope.frml_sec_hghlt = function(res_bbox, opr_bbox, res_t_xml, opr_t_xml){
		var info = [];
		if($scope.doc_id in $scope.bbox_dict && $scope.p_num in $scope.bbox_dict[$scope.doc_id])
			info =  $scope.bbox_dict[$scope.doc_id][$scope.p_num];
		if($scope.mn_tbl_pdf_btn_flg=='pdf' && opr_bbox.length){
			$timeout(function(){
				tasIframe.clearPdfHighlight('iframe2');
				tasIframe.pdfHighlight('iframe2', $scope.doc_id, $scope.p_num, res_bbox, info, 'res_iframe_tag', false, '', 200);
				tasIframe.pdfHighlight('iframe2', $scope.doc_id, $scope.p_num, opr_bbox, info, 'child_iframe_tag', false, '', 200);
			}, 500);
		}else if($scope.mn_tbl_pdf_btn_flg=='table' && opr_t_xml.length){
			$timeout(function(){
				tasIframe.clearTableHighlight('iframe2');
				tasIframe.tableHighlight('iframe2', $scope.table_id, res_t_xml, 'res_iframe_tag', false);
				tasIframe.tableHighlight('iframe2', $scope.table_id, opr_t_xml, 'child_iframe_tag', false);
			}, 500);
			
		}
	}
	/***********************************/
	$scope.cell_grp_click_func = function(rw, ph, sub=false, ev, n){
		if(!(ph in rw)){
			return;
		}
		$scope.frml_clr_dic = {};
		$scope.frml_clr_dic_cell = {};
	        var cel = {};
		if(ph=='t_l'){
	        	cel = rw;
		}else{
			if('r_key' in rw[ph]){
	                        $scope.get_cell_data_func(rw, ph, sub=false, ev, n);
                        	return;
                	}
	        	cel = rw[ph];
		}
		if(!sub){
               		$scope.slcted_pt_doc_cell_key = [rw.t_id, ph].join('_');
               		$scope.slcted_pt_doc_row_key = [rw.t_id, rw.t_l].join('_');
			$scope.slcted_pt_sub_doc_cell_key = null;
               		$scope.slcted_pt_sub_doc_row_key = null;
			if(0 && 'eid' in cel){
				$scope.gridOptionsSubGrp.columnDefs = [];
				$scope.gridOptionsSubGrp.data = [];
				$scope.cell_eid_avl = true;
				var get_key = ['DB', $scope.project_id, $scope.deal_id, 'ERRORDATA',  cel['eid']].join('_');
				var post_data = {'get_key': get_key};
				$scope.ps = true;
				tasService.redis_request(post_data, 'POST', function(res){
					$scope.ps = false;
					console.log(res)
					if(res['message']){
						if(res['message'] == 'done'){
							$scope.gridOptionsSubGrp.columnDefs = gridOptionsSubGrp_columnDefs_func(res['phs']);
							$scope.gridOptionsSubGrp.data = res['data'];
						}else{
							tasAlert.show(res['message'], 'error', 1000);
						}
					}
				});		
			}else{
				$scope.cell_eid_avl = false;
			}

			if(ev && ev.ctrlKey){
				if(!(n in $scope.slcted_data_lost_dic)){
					$scope.slcted_data_lost_dic[n] = {'phs': [], 'tids':{}};
				}
				if(rw['t_id'] in $scope.slcted_data_lost_dic[n]['tids'] && $scope.slcted_data_lost_dic[n]['tids'][rw['t_id']] == ph){
					delete $scope.slcted_data_lost_dic[n]['tids'][rw['t_id']];
				}else{
					$scope.slcted_data_lost_dic[n]['tids'][rw['t_id']] = ph;
					if(!($scope.slcted_data_lost_dic[n]['phs'].includes(ph))){
						$scope.slcted_data_lost_dic[n]['phs'].push(ph);
					}
				}
			}
		}else{
			$scope.slcted_pt_sub_doc_cell_key = [rw.sn, ph].join('_');
               		$scope.slcted_pt_sub_doc_row_key = [rw.sn, rw.t_l].join('_');
		}
		if($scope.mn_tbl_pdf_btn_flg=='table'){
				var p_num = 0;
				if('x' in cel){
					xml = cel['x'].split(':@:');
					p_num = xml[0].split('_')[1].split('#')[0];
				}
				$scope.p_num = p_num;
				$scope.doc_id = cel['d'];
				var xml_list_cld = [];
				let time = 0;
				tasIframe.clearTableHighlight('iframe2');
				if('tids' in rw && $scope.actve_full_tab_dic['k']=='R_CHECKSUM'){
					$scope.gridOptionsGrp.data.forEach(function(row){
						if(rw['tids'].includes(String(row['t_id']))){
							if(ph in row){
								var slt_rw = row[ph];
								if(cel['x'] !=slt_rw['x'])
									xml_list_cld.push(slt_rw['x']);
							}
						}
					});
					let iframe_dom = document.querySelector('#iframe2');
					if(!iframe_dom)
						return;
					let doc_path = iframe_dom.getAttribute('src') || '';
					let temp = "src/iframe_track_v2.html?"+'/'+$scope.deltastorage+'/'+$scope.project_id+'_'+$scope.deal_id+"/Table_Htmls/"+cel['t']+'.html';
					if(doc_path != temp){
						time = 1000;
					}
				}			
				if(!cel['t']){
					return;
				}		
				$scope.table_id = cel['t'];	
	               		tasIframe.tableHighlight('iframe2', cel['t'], [cel['x']], 'parent_iframe_tag', false);
				$timeout(function(){
               				tasIframe.tableHighlight('iframe2', cel['t'], xml_list_cld, 'child_iframe_tag', false);
				}, time);
		}else{
			var p_num = 0;
		    	if('x' in cel){
			    	xml = cel['x'].split(':@:');
			    	p_num = xml[0].split('_')[1].split('#')[0].split('@')[0];
		    	}
		    	$scope.p_num = p_num;
		    	$scope.doc_id = cel['d'];
		    	var info = [];
		    	var bbox = cel['bbox'] || [];
		    	if($scope.doc_id in $scope.bbox_dict && $scope.p_num in $scope.bbox_dict[$scope.doc_id])
				info =  $scope.bbox_dict[$scope.doc_id][$scope.p_num];
			if(!cel['d']){
                        	return;
			}
			tasIframe.pdfHighlight('iframe2', $scope.doc_id, $scope.p_num, bbox, info, 'parent_iframe_tag', true, '', 200);
		}
		var form_key    = 'f_col';
		$scope.frml_rids = null;
		$scope.formula_grid.data = [];
		$scope.t_grpid = null;
		if(form_key in cel){
			if('t_grpid' in rw)
				 $scope.t_grpid = rw['t_grpid'];
			var formula_data = cel[form_key][0];
			formula_data.forEach(function(row){
				if(!(row['k'] in $scope.frml_clr_dic_cell))
					$scope.frml_clr_dic_cell[row['k']] = {}
				if(row['operator'] == '='){
					$scope.frml_rids = row['rid'];
					$scope.frml_clr_dic[row['taxo_id']] = 'RES';
					$scope.frml_clr_dic_cell[row['k']][row['taxo_id']] = 'RES';

				}else{
					$scope.frml_clr_dic[row['taxo_id']] = 'OPR';
					$scope.frml_clr_dic_cell[row['k']][row['taxo_id']] = 'OPR';
				}
			});
			if($scope.mn_tbl_pdf_btn_flg == 'formula'){
				$scope.formula_grid.columnDefs = formula_grid_columnDefs_func(); 
				$scope.formula_grid.data = formula_data;
			}
		}
        }
	/***********************************/
	$scope.toggle_btm_ref_flg = true;
        $scope.toggle_btm_ref_btn_func = function(){
		$scope.toggle_btm_ref_flg = !$scope.toggle_btm_ref_flg;
		$timeout(function(){
                        $scope.do_resize();
                });
	}
	/***********************************/
	$scope.fltr_grid_key = null;
    	$scope.fltr_grid_func = function(key){
		var full_data = angular.copy($scope.gridOptionsAvlAll_res.data); 
		if($scope.fltr_grid_key == key){
		    $scope.gridOptionsAvlAll.data = full_data;
		    $scope.fltr_grid_key = null;
		}else{
		    $scope.fltr_grid_key = key;
		    var fltr_data = [];
		    full_data.forEach(function(row){
			if(row[key]){
				fltr_data.push(row);
			}
		    });
		    $scope.gridOptionsAvlAll.data = fltr_data;
		}
	}
	/***********************************/
	$scope.doc_pno_ref_change_func = function(pos){
		var rw = {};
		if(pos == 'prev'){
		    rw = $scope.ref_doc_list[$scope.selected_doc_pno_idx['key'] - 1]
		}else if(pos == 'next'){
		    rw = $scope.ref_doc_list[$scope.selected_doc_pno_idx['key'] + 1];
		}
		$scope.load_doc_ref_func(rw);
    	}
	/***********************************/
	$scope.grp_ref_change_func = function(pos){
                var rw = {};
                if(pos == 'prev'){
                    rw = $scope.ref_grp_list[$scope.selected_grp_idx['key'] - 1]
                }else if(pos == 'next'){
                    rw = $scope.ref_grp_list[$scope.selected_grp_idx['key'] + 1];
                }
                $scope.load_grp_ref_func(rw);
        }
	/***********************************/
	$scope.usr_saved_get_func = function(){
                var post_data = {'cmd_id': 171, 'table_type': $scope.selected_grp_dic['table_type'], 'grpid': $scope.selected_grp_dic['grpid'], 'idata': $scope.selected_grp_dic['idata'], 'etype': $scope.actve_full_tab_dic['k']};
                tasService.ajax_request(post_data, 'POST', function(res){
                        $scope.ps = false;
			console.log(res);
                        if(res['message']){
                                if(res['message'] == 'done'){
					if($scope.actve_full_tab_dic['k']=='DBDL'){
						if(res['data'] != '')
							//$scope.grp_grid.scope.slcted_data_lost_dic = res['data'];
							$scope.slcted_data_lost_dic = res['data'];
					}
                                }else{
                                        tasAlert.show(res['message'], 'error', 1000);
                                }
                        }
                });
        }
	/***********************************/
	 $scope.operator_lst = [{"op":"Select Operator","operator_label":"Select Operator","ID":"1"}, {"op":"+","operator_label":"+","ID":"2"}, {"op":"-","operator_label":"-","ID":"3"}, {"op":"=","operator_label":"=","ID":"4"}, {"op":"*","operator_label":"*","ID":"5"}, {"op":"**","operator_label":"**","ID":"6"}, {"op":"/","operator_label":"/","ID":"7"}, {"op":"(","operator_label":"(","ID":"8"}, {"op":")","operator_label":")","ID":"9"}, {"op":"M","operator_label":"M","ID":"10"}, {"op":"avg","operator_label":"avg","ID":"11"}, {"op":"avg([","operator_label":"avg([","ID":"12"}, {"op":"])","operator_label":"])","ID":"13"}, {"op":",","operator_label":",","ID":"14"}, {"op":"and","operator_label":"and","ID":"15"}, {"op":"or","operator_label":"or","ID":"16"}, {"op":"not","operator_label":"not","ID":"17"}, {"op":"percentage([","operator_label":"percentage([","ID":"18"}];
	/***********************************/
	$scope.cnvt_sec_enbl_dsbl_func = function(){
        if($scope.table_type =='PassengerTransportation-Airline')
                return false;
        else
                return false;
    }
	/***********************************/
	$scope.formula_row_func = function(cel, ev){
		console.log(cel);
		$scope.frml_rw_hght_key = cel['taxo_id'];
		if($scope.mn_tbl_pdf_btn_flg=='table'){
				var p_num = 0;
				if('x' in cel){
					xml = cel['x'].split(':@:');
					p_num = xml[0].split('_')[1].split('#')[0];
				}
				$scope.p_num = p_num;
				$scope.doc_id = cel['d'];
				var xml_list_cld = [];
				let time = 0;
				tasIframe.clearTableHighlight('iframe2');
				$scope.table_id = cel['t'];	
	               		tasIframe.tableHighlight('iframe2', cel['t'], [cel['x']], 'parent_iframe_tag', false);
		}else{
			var p_num = 0;
		    	if('x' in cel){
			    	xml = cel['x'].split(':@:');
			    	p_num = xml[0].split('_')[1].split('#')[0].split('@')[0];
		    	}
		    	$scope.p_num = p_num;
		    	$scope.doc_id = cel['d'];
		    	var info = [];
		    	var bbox = cel['bbox'] || [];
		    	if($scope.doc_id in $scope.bbox_dict && $scope.p_num in $scope.bbox_dict[$scope.doc_id])
				info =  $scope.bbox_dict[$scope.doc_id][$scope.p_num];
			if(!cel['d']){
                        	return;
			}
			tasIframe.pdfHighlight('iframe2', $scope.doc_id, $scope.p_num, bbox, info, 'parent_iframe_tag', true, '', 200);
		}
	}
	/***********************************/
	function formula_grid_columnDefs_func(){
    		var formula_grid_columnDefs = [
                    { field: 'description', displayName:'Description', enableSorting: false, width:'*', pinnedLeft:false, cellTemplate:
                        `<div class="ui-grid-cell-contents row_col_grid_cell" ng-click="grid.appScope.formula_add_new_row_func(row.entity, $event)" ng-bind-html="COL_FIELD | trusted1" style="text-align:left;" ng-class="{not_exists_class: row.entity.not_exists=='Y', frml_cell_or_row_slct: grid.appScope.frml_cell_or_row_active == [row.entity['grid_id'], row.entity['grid_index']].join('_'), matched_frml_row: grid.appScope.frml_dic_hgt_tid[grid.appScope.slct_rw_avl_frml_key][row.entity['taxo_id']]}" title="{{COL_FIELD}}"></div>`
                    },
                    { field: 'ph', displayName:'PH', enableSorting: false, width:'70', pinnedLeft:false, cellTemplate:
                        `<div class="ui-grid-cell-contents row_col_grid_cell" ng-bind-html="COL_FIELD | trusted1" style="text-align:left;" ng-class="{not_exists_class: row.entity.not_exists=='Y'}" title="{{COL_FIELD}}"></div>`
                    },
                    { field: 'tt', displayName:'TableType', enableSorting: false, width:'100', pinnedLeft:false, cellTemplate:
                        `<div class="ui-grid-cell-contents row_col_grid_cell" ng-bind-html="COL_FIELD | trusted1" style="text-align:left;" ng-class="{not_exists_class: row.entity.not_exists=='Y'}" title="{{COL_FIELD}}"></div>`
                    },
                    { field: 'clean_value', displayName:'Value', enableSorting: false, width:'100', pinnedLeft:false, cellTemplate:
                        `<div class="ui-grid-cell-contents row_col_grid_cell" ng-bind-html="COL_FIELD | trusted1" ng-click="grid.appScope.formula_row_func(row.entity, $event)" ng-class="{active: grid.appScope.frml_rw_hght_key == row.entity.taxo_id}"></div>`
                    },
                    { field: 'conv_value.from_scale', displayName:'Scale', enableSorting: false, width:'100', pinnedLeft:false, visible: $scope.cnvt_sec_enbl_dsbl_func(), cellTemplate:
                        `<div class="ui-grid-cell-contents row_col_grid_cell">
                                <span title="{{row.entity['conv_value']['from_scale']}} &#8674; {{row.entity['conv_value']['to_scale']}}" ng-if="row.entity['conv_value']">{{row.entity['conv_value']['from_scale']}} &#8674; {{row.entity['conv_value']['to_scale']}}</span>
                        </div>`
                    },
                    { field: 'conv_value.v', displayName:'C. Value', enableSorting: false, width:'100', pinnedLeft:false, visible: $scope.cnvt_sec_enbl_dsbl_func(), cellTemplate:
                        `<div class="ui-grid-cell-contents row_col_grid_cell">
                                <span title="{{COL_FIELD}}" ng-if="row.entity['conv_value']">{{COL_FIELD}}</span>
                                <span title="{{row.entity.clean_value}}" ng-if="!row.entity['conv_value']">{{row.entity.clean_value}}</span>
                        </div>`
                    },
                    { field: 'operator', displayName:'Operator', 'headerCellClass': "kve_header", 'cellClass': 'grid-align_right', 'editDropdownOptionsArray':$scope.operator_lst, 'editableCellTemplate':'ui-grid/dropdownEditor', 'editDropdownIdLabel':'operator_label', 'editDropdownValueLabel':'operator_label', 'enableCellEditOnFocus': true, width:60,'cellEditableCondition':true
                    },
                    {
                      field: 'c', displayName: 'CSV', enableSorting: false, width:'70', pinnedLeft:false, cellEditableCondition:false, cellTemplate:
                            `<div class="ui-grid-cell-contents" title="({{[row.entity.c, row.entity.s, row.entity.vt].join(', ')+')\n'+grid.appScope.stingify_obj(row.entity['phcsv'])}}">
                                ({{[row.entity.c, row.entity.s, row.entity.vt].join(' ')}})
                             </div>`
                    },
                    {
                      field: 'd', displayName: 'CSV', enableSorting: false, width:'30', pinnedLeft:false, cellEditableCondition:false, cellTemplate:
                            `<div class="ui-grid-cell-contents" ng-click="grid.appScope.ph_csv_config_table_form(row.entity)" style="cursor: pointer; text-align: center;">
                                <span class="fa fa-pencil-square-o" style="color: #000;"></span>
                             </div>`
                    },
                    { field: 'd', displayName:'Del', enableSorting: false, width:'40', pinnedLeft:false, cellEditableCondition:false,  cellTemplate:
                        `<div class="ui-grid-cell-contents" style="text-align: center;">
                                <span class="frml_del_icon" ng-click="grid.appScope.formula_tag_row_delete(row.entity)" title="Delete">&times;</span>
                        </div>`
                    }
        	];
        	return formula_grid_columnDefs;
    	}
	/***********************************/
	$scope.cl_bk_redis_rght_data_func = function(res){
		$scope.wthout_grp_dic = {'f': false};
		$scope.ps = false;
		console.log(res);
		if(res['message']){
			if(res['message'] == 'done'){
				$scope.doc_grp_res = res;
				if($scope.actve_full_tab_dic['k']=='Spike' || $scope.actve_full_tab_dic['k']=='WMergeAcross'){
					$scope.gridOptionsSpike.columnDefs = gridOptionsSpike_columnDefs_func();
					$scope.gridOptionsSpike.data = res['data'];
					$scope.gridOptionsGrpMany = {};
				}else if($scope.actve_full_tab_dic['k']=='VGHPATTERN' || $scope.actve_full_tab_dic['k']=='CSV'){
                                        $scope.gridOptionsSpike.columnDefs = gridOptionsSpike_columnDefs_func();
                                        $scope.gridOptionsSpike.data = res['grps'];
					$scope.grp_grid['data'] = res;
					$scope.grp_grid.scope.ag_grid_load_data($scope.grp_grid['data']);
                                }else if($scope.actve_full_tab_dic['k']=='FORMULA_OVERLAP'){
					$scope.slct_rw_avl_frml_key = null;
					$scope.formula_sub_grid = {};
					$scope.formula_sub_slcted_dic = {};
					for(var a=0, a_l=$scope.doc_grp_res['grp'].length; a<a_l; a++){
					    var frm_data = $scope.doc_grp_res['grp'][a];
					    $scope.formula_grid[frm_data['taxo_ids']]   = {
						rowHeight:30, enableFiltering:false, noUnselect : false, enableSorting:false, showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false, enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false, columnDefs:[],
						onRegisterApi: function (gridApi) {
						    $scope.formula_view   = gridApi;
						   gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
							    $scope.$apply(function(){
							    });
							})
						    }
					    }
					    $scope.formula_grid[frm_data['taxo_ids']].columnDefs = formula_grid_columnDefs_func();
					    $scope.formula_grid[frm_data['taxo_ids']].data = $scope.doc_grp_res['data'][frm_data['taxo_ids']]['f_col'][0];
					}	
				}else if($scope.actve_full_tab_dic['k']=='Line-Item-Group'){
					$scope.WMergeAcross_grp_dic = res['data'];
					$scope.gridOptionsGrpMany = {};
					$scope.row_chck_dic = {};
					$scope.slcted_data_lost_dic = {};
					$scope.WMergeAcross_grp_dic.forEach(function(grp, idx){
						$scope.gridOptionsGrpMany[idx] = {
							rowHeight:35, enableFiltering:true, noUnselect : false, enableSorting:false, showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false, enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false, columnDefs:[],
							onRegisterApi: function (gridApi) {
							    $scope.gridApiGrpMany = gridApi;
							}
						}
						var dsb_flg = false;
						$scope.gridOptionsGrpMany[idx].columnDefs = gridOptionsGrp_columnDefs_func(grp['phs'], true);
						$scope.gridOptionsGrpMany[idx].data = grp['data'];
					});
                                }else{
					$scope.grp_grid['data'] = res;
					$scope.grp_grid.scope.ag_grid_load_data($scope.grp_grid['data']);
				}
				$scope.usr_saved_get_func();
			}else{
				tasAlert.show(res['message'], 'error', 1000);
			}
		}	
	}
	/***********************************/
	$scope.frml_dic_hgt_tid = {};
	$scope.ovrlp_sub_avl_frml_change_func = function(fk, idx){
		var frm_data_list = $scope.doc_grp_res['data'][fk]['f_col'][0];
		$scope.slct_sub_rw_avl_frml_key = ['sub', fk].join('_');
		console.log(frm_data_list, $scope.slct_sub_rw_avl_frml_key)
		$scope.frml_dic_hgt_tid = {}; 
		$scope.frml_dic_hgt_tid[$scope.slct_rw_avl_frml_key] = {}; 
		frm_data_list.forEach(function(row){
			$scope.frml_dic_hgt_tid[$scope.slct_rw_avl_frml_key][row['taxo_id']] = 1;
		});
                if(frm_data_list.length)
			$scope.frml_lst_hgt_func(frm_data_list)
	}
	/***********************************/
	$scope.frml_lst_hgt_func = function(formula_data){
			$scope.frml_clr_dic = {}
			$scope.frml_clr_dic_cell = {}
                        var res_bbox = [];
                        var opr_bbox = [];
                        var res_t_xml = [];
                        var opr_t_xml = [];
                        formula_data.forEach(function(row){
                                if(!(row['k'] in $scope.frml_clr_dic_cell))
                                        $scope.frml_clr_dic_cell[row['k']] = {}
                                if(row['operator'] == '='){
                                        $scope.doc_id = row['d'];
					var p_num = 0;
					if('x' in row){
						xml = row['x'].split(':@:');
						p_num = xml[0].split('_')[1].split('#')[0];
					}
					$scope.p_num = p_num;
                                        $scope.table_id = row['t'];
                                        $scope.frml_rids = row['rid'];
                                        $scope.frml_clr_dic[row['taxo_id']] = 'RES';
                                        $scope.frml_clr_dic_cell[row['k']][row['taxo_id']] = 'RES';
                                        var bbbx = row['bbox'] || [[]];
                                        bbbx.forEach(function(bb){
                                                res_bbox.push(bb);
                                        });
                                        if('x' in row)
                                                res_t_xml.push(row['x'])
                                }else{
                                        $scope.frml_clr_dic[row['taxo_id']] = 'OPR';
                                        $scope.frml_clr_dic_cell[row['k']][row['taxo_id']] = 'OPR';
                                        var bbbx = row['bbox'] || [[]];
                                        bbbx.forEach(function(bb){
                                                opr_bbox.push(bb);
                                        });
                                        if('x' in row)
                                                opr_t_xml.push(row['x'])
                                }
                        });
                                $scope.frml_sec_hghlt(res_bbox, opr_bbox, res_t_xml, opr_t_xml);
			$scope.db_row_highlight($scope, ['frml_clr_dic_cell', 'frml_clr_dic'], {}, []);
        }
	/***********************************/
	$scope.formula_sub_grid = {};
	$scope.formula_sub_slcted_dic = {};
	$scope.ovrlp_avl_frml_change_func = function(fk, idx){
		var frm_data = fk;
		$scope.formula_sub_slcted_dic = fk;
		$scope.slct_rw_avl_frml_key = fk['taxo_ids'];	
		$scope.slct_sub_rw_avl_frml_key = null;
		$scope.frml_dic_hgt_tid = {};
		for(var a=0, a_l=fk['overlap'].length; a<a_l; a++){
		    var frm_data = fk['overlap'][a];
		    $scope.formula_sub_grid[frm_data]   = {
			rowHeight:30, enableFiltering:false, noUnselect : false, enableSorting:false, showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false, enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false, columnDefs:[],
			onRegisterApi: function (gridApi) {
			    $scope.formula_sub_view   = gridApi;
			    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
				    $scope.$apply(function(){
				    });
				})
			    }
		    }
		    $scope.formula_sub_grid[frm_data].columnDefs = formula_grid_columnDefs_func();
		    $scope.formula_sub_grid[frm_data].data = $scope.doc_grp_res['data'][frm_data]['f_col'][0];
		}
		var formula_data = $scope.doc_grp_res['data'][fk['taxo_ids']]['f_col'][0] || [];
                if(formula_data.length)
			$scope.frml_lst_hgt_func(formula_data)
	}
	/***********************************/
        $scope.load_ismenu_grp_ref_func = function(row={}, mn_data, mn_idx){
		console.log('mn_data',mn_data);
		if(mn_data){
			$scope.gridOptionsGrpMany = {};
			$scope.WMergeAcross_grp_dic = {};
			$scope.slcted_spk_pt_doc_row_key = {};
			$scope.frml_clr_dic = {};
		        $scope.frml_clr_dic_cell = {};
			$scope.gridOptions.data = [];
        	        $scope.gridOptions.columnDefs = [];
			$scope.gridOptionsGrp.data = [];
                        $scope.gridOptionsGrp.columnDefs = [];
	                $scope.g_grid_data = {};
			$scope.row_chck_dic = {};
			$scope.slcted_data_lost_dic ={};
			$scope.clicked_lft_row_dic = mn_data;
	                $scope.actve_full_tab = [$scope.side_menu_full_list[mn_idx]['k'], mn_data['k']].join('$$');
	                $scope.actve_full_sub_tab = [$scope.side_menu_full_list[mn_idx]['k'], mn_data['k'], (String(row['k']) || null)].join('_');
                	$scope.actve_full_tab_dic = $scope.side_menu_full_list[mn_idx];
			$scope.ref_grp_idx = {};
			if($scope.actve_full_tab_dic['k']!='MT'){
				$scope.ref_grp_list = $scope.clicked_lft_row_dic['idata'];
				$scope.ref_grp_list.forEach(function(rw, idxx){
        	    			$scope.ref_grp_idx[rw['k']] = idxx;
                		});
				$scope.selected_grp_dic = row;
				var idata = row['idata'];
				console.log('idata', idata);
				$scope.chart_graph_comp_ph_dic = {};
				$scope.slcted_pt_doc_row_key = null;
				$scope.slcted_pt_doc_cell_key = null;
				let iframe_dom = document.querySelector('#iframe2');
				if(iframe_dom)
				        iframe_dom.setAttribute('src', 'src/no_ref_found.html');
				$scope.cell_eid_avl = false;
				$scope.gridOptionsSubGrp.data = [];
				var get_key = ['DB', $scope.project_id, $scope.deal_id, 'ERRORDATA', idata].join('_');
				var post_data = {'get_key': get_key};
				$scope.ps = true;
				if($scope.get_grp_err_flg!='TALLY'){
					tasService.redis_request(post_data, 'POST', $scope.cl_bk_redis_rght_data_func);		
				}else if($scope.get_grp_err_flg=='TALLY'){
					var post_data = {'cmd_id': 166, 'idata': idata};
                			tasService.ajax_request(post_data, 'POST',  $scope.cl_bk_redis_rght_data_func);
				}
			}
		}
	}
	/***********************************/
        $scope.load_grp_ref_func = function(row, mn_data, mn_idx){
		if(mn_data){
			$scope.clicked_lft_row_dic = mn_data;
	                $scope.actve_full_tab = [$scope.side_menu_full_list[mn_idx]['k'], mn_data['k']].join('$$');
                	$scope.actve_full_tab_dic = $scope.side_menu_full_list[mn_idx];
		}
		$scope.selected_grp_dic = row;
                $scope.selected_grp_idx = {'key': $scope.ref_grp_idx[row['k']]};
		var get_key = ['DB', $scope.project_id, $scope.deal_id, 'ERRORDATA', row['idata']].join('_');
		var post_data = {'get_key': get_key};
                $scope.ps = true;
		$scope.slcted_data_lost_dic ={};
                tasService.redis_request(post_data, 'POST', $scope.cl_bk_redis_rght_data_func);
	}
	/***********************************/
	$scope.doc_path     = 'src/no_ref_found.html';
    	$scope.return_trust = function(url){
		if($scope.doc_path){
		    return $sce.trustAsResourceUrl(url);
		}else{
		    return 'src/no_ref_found.html';
		}
    	}
	/***********************************/
	$scope.load_doc_ref_func = function(rw){
		$scope.selected_doc_pno_dic = rw;
		$scope.selected_doc_pno_idx = {'key': $scope.ref_doc_pno_idx[[rw['d'], rw['pno']].join('_')]};
		if('d' in rw && 'pno' in rw){
			 var bbox = [];
			 var info = [];
			 $scope.p_num = rw['pno'];
			 $scope.doc_id = rw['d'];
			 tasIframe.pdfHighlight('iframe2', rw['d'], rw['pno'], bbox, info, 'parent_iframe_tag', true, '', $scope.slcted_doc_pno_idx_rw['txt'], 200);
		}
	}
	/***********************************/
        $scope.doc_pno_ref_filter_dic = {'val': ''};
        $scope.grp_ref_filter_dic = {'val': ''};
	/***********************************/
        $scope.grpHeaderFilter_inp_func = function(data, txt=''){
            if(!data)
                return [];
            return data.filter(function(tv){ return (String(tv['d'] || '').toLocaleLowerCase().includes(txt.toLocaleLowerCase()) || String(tv['pno'] || '').toLocaleLowerCase().includes(txt.toLocaleLowerCase()))});
        }
	/***********************************/
	$scope.grpAlHeaderFilter_inp_func = function(data, txt=''){
            if(!data)
                return [];
            return data.filter(function(tv){ return (String(tv['n'] || '').toLocaleLowerCase().includes(txt.toLocaleLowerCase()))});
        }
	/***********************************/
	$scope.slcted_doc_pno_idx_key = null;
	$scope.slcted_doc_pno_idx_rw = {};
	$scope.get_ref_full_data_func = function(row, key){
		if(!('sn' in row)){
			return;
		}
		$scope.slcted_doc_pno_idx_key = row.sn;
		$scope.slcted_doc_pno_idx_rw = row;
		$scope.ref_doc_list = [];
		$scope.ref_doc_pno_idx = {};
		if('ref' in row){
			$scope.ref_doc_list = row['ref'];
			$scope.ref_doc_list.forEach(function(row, idxx){
	                    $scope.ref_doc_pno_idx[[row['d'], row['pno']].join('_')] = idxx;
                	});
			$scope.load_doc_ref_func($scope.ref_doc_list[0]);
		}
        }
	/***********************************/
	$scope.side_menu_tgle_func = function(idx){
		var dic = $scope.side_menu_full_list[idx];
		dic['f'] = !dic['f'];
	}
	/***********************************/
	$scope.mn_tbl_pdf_btn_flg = 'table';
	$scope.selected_grp_dic = {};
	$scope.mn_tbl_pdf_btn_func = function(k){
		$scope.mn_tbl_pdf_btn_flg = k;
		$scope.gridOptions.data = [];
		$scope.gridOptions.columnDefs = [];
		$scope.g_grid_data = {};
		if($scope.mn_tbl_pdf_btn_flg == 'db'){
			if(Object.keys($scope.selected_grp_dic).length){
				var get_key = ['DB', $scope.project_id, $scope.deal_id, 'ERRORDATA', $scope.selected_grp_dic['table_type'], ($scope.selected_grp_dic['grpid']|| '')].join('_');
                                var post_data = {'get_key': get_key};
                                $scope.ps = true;
                                tasService.redis_request(post_data, 'POST', $scope.cl_bk_get_db_func);
				/*var post_data = {'cmd_id': 170, 'table_type': $scope.selected_grp_dic['table_type'], 'grpid': $scope.selected_grp_dic['grpid']};
		                $scope.ps = true;
        		        tasService.ajax_request(post_data, 'POST', $scope.cl_bk_get_db_func);*/
			}
		}
	}
	/***********************************/
        $scope.db_grid = {
		'data':{},
		'id':1,
		'sideBar': true,
		'connection': function(myscope){
			console.log(myscope);
		},
		'hide_columns': {'sn': 1},
		'parent_scope':$scope,
		'cellEvent': function(row, col){
		}
	}
	/***********************************/
        $scope.grp_grid = {
                'data':{},
                'id':2,
                'sideBar': true,
                'parent_scope':$scope,
                'highlight': $scope.highlight,
                'db_row_highlight': $scope.db_row_highlight,
		'hide_columns': {'parent_txt': 1},
        }
	/***********************************/
	$scope.cl_bk_get_db_func = function(res){
		$scope.ps = false;
		console.log(res);
		if(res['message']){
			if(res['message']=='done'){
				$scope.g_grid_data = res;
				$scope.db_grid['data'] = res;
				$scope.db_grid.scope.ag_grid_load_data($scope.db_grid['data']);
			}else{
				tasAlert.show(res['message'], 'error', 1000);	
			}
		}
	}
	/***********************************/
	$scope.load_chart_graph     = function(row, phs, domid, flg){
            var data            = []
            var map_data        = {}
            var all_key         = {}
            var tmpd            = row
            var type            = flg == 'spike'?'line':'bar';//$scope.filter_sub_division in $scope.spike_graph ? 'line' : 'bar'
	    var ph_ks_d	        = {}	
            for (var i=0,l=phs.length;i<l;i++){
                ph_row   = phs[i];
                k = ph_row['k'];
                n = ph_row['n'];
                if(!tmpd[k] || !tmpd[k]['v'] || k == 'desc') continue
		ph_ks_d[n]	= k //(ph_ks_d[n] || []).concat([k])
                map_data[Number(n.slice(-4))] = 1
                all_key[n.slice(0, -4)] = 1
                /*map_data[Number(ph_row['dph'][1])] = 1
                all_key[ph_row['dph'][0]] = 1*/
            }
            var year            = Object.keys(map_data)
            year.sort(function(a,b) {
                return b > a
            })
            var od_idc  = {'Q1':8,'Q2':7,'H1':6,'Q3':5 ,'M9':4,'Q4':3,'H2':2,'FY':1}
            var all_keys_order = Object.keys(all_key)
            all_keys_order.sort(function(a,b){
                return (od_idc[b] - od_idc[a])
            })
            var data = []
            var temp = [k]
            var st = 1;
            for(var j=0 ,lk = all_keys_order.length;j<lk;j++){
                var k = all_keys_order[j]
                temp = []
                temp1 = []
                for(var i=0,l=year.length;i<l;i++){
			var th	=  ph_ks_d[k+year[i]] || []
							if(th in tmpd && 'v' in tmpd[th]){
								var num = tmpd[th]['v'];
								if(tmpd[th]['v'].charAt(0) == '('){
										num = '-'+tmpd[th]['v'].slice(1,-1);
								}
								temp.push(Number((''+num).replace(/[,%]/g, '')))
								temp1.push( tmpd[th])
							}else{
								temp1.push( tmpd[th])
								temp.push(0)
							}
                }
		 data.push({
                        label: k,
                        fill: false,
                        stack: 'Stack '+st,
                        borderwidth: 1,
                        data: temp,
                        data_h: temp1,
                        })
                st  += 1
            }

	   $timeout(function(){
                   var prnt_dom = document.querySelector('.main_cntnt_dv_tp_innr_rgh');
                   var prnt_dom_height = (prnt_dom.clientHeight) - 50;
                   $('.frml_canvas_grp').css({'height': prnt_dom_height+'px'});
                   var dom_Id = 'graph_view_comp-'+domid;
                   var dom = document.getElementById('canvas-cont-'+domid);
                   dom.innerHTML='<canvas id="'+dom_Id+'" class="graph_canvas_class"></canvas>';
			console.log(dom_Id, data, type, year)
                   window.load_canvas_chart(dom_Id, data, type, year, 'Y');
           });
        }
	/***********************************/
	$scope.grd_crete_func = function(vr, id){
		var nw_grd = [vr, id].join('_');
		return nw_grd;
	}
	/***********************************/
	$scope.chart_graph_comp_ph_dic = {};
	$scope.WMergeAcross_grp_dic = {};
	$scope.gridOptionsGrpMany = {};
	$scope.spke_click_func = function(full_dic){
		$scope.WMergeAcross_grp_dic = full_dic;
		$scope.slcted_spk_pt_doc_row_key = [full_dic.sn, full_dic.t_l].join('_');
		$scope.slcted_pt_doc_row_key = null;
		$scope.slcted_pt_doc_cell_key = null;
		console.log(full_dic);
		if($scope.actve_full_tab_dic['k']=='Spike'){
			$scope.chart_graph_comp_ph_dic = full_dic['ptype'] || {};
			for(var dom_id in $scope.chart_graph_comp_ph_dic){
				row = full_dic['ptype'][dom_id];
				console.log(row);
				$scope.load_chart_graph(row['data'], row['phs'], dom_id);
			}
		}else if($scope.actve_full_tab_dic['k']=='WMergeAcross'){
			$scope.gridOptionsGrpMany = {};
			$scope.row_chck_dic = {};
			$scope.slcted_data_lost_dic = {};
			/*$scope.grp_many_grid = [];
			$scope.WMergeAcross_grp_dic['grp'].forEach(function(grp, idx){
				var grp_name = ['grp_many_grid', idx].join('_');
				var grid = {
					'data':{},
					'id':'many'+idx,
					'sideBar': false,
					'parent_scope':$scope,
					'hide_columns': {'sn': 1, 't_l': 1, 'parent_txt': 1},
					'highlight': $scope.highlight,
					'db_row_highlight': $scope.db_row_highlight,
				}
				grp['message'] = 'done';
				grid['data'] = grp;
				grid['data']['data'] = [grp['data']];
				$scope.grp_many_grid.push(grid)
			});*/
			$scope.WMergeAcross_grp_dic['grp'].forEach(function(grp, idx){
				$scope.gridOptionsGrpMany[idx] = {
					rowHeight:35, enableFiltering:true, noUnselect : false, enableSorting:false, showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false, enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false, columnDefs:[],
					onRegisterApi: function (gridApi) {
					    $scope.gridApiGrpMany = gridApi;
					}
				}
				grp['data']['t_l'] = $scope.WMergeAcross_grp_dic['t_l'] || '';
				var fll_dt = [grp['data']];
				var dsb_flg = false;
				if($scope.actve_full_tab_dic['k']=='VGHPATTERN'){
					fll_dt = grp['data'];
					dsb_flg = true;
				}
				$scope.gridOptionsGrpMany[idx].columnDefs = gridOptionsGrp_columnDefs_func(grp['phs'], dsb_flg);
				$scope.gridOptionsGrpMany[idx].data = fll_dt;
			});
		}else if($scope.actve_full_tab_dic['k']=='VGHPATTERN'){
			$scope.gridOptionsGrpMany = {};
			$scope.row_chck_dic = {};
			$scope.slcted_data_lost_dic = {};
		}else if($scope.actve_full_tab_dic['k']=='CSV'){
                                $scope.ph_csv_config_shw_dic = {};
                                $scope.ph_csv_config = {'vt': '', 'c': '', 's': ''};
                                $scope.ph_csv_config_chck = {'pt': false, 'p': false, 'vt': false, 'c': false, 's': false, 'm': false};
                                for(cl in {'c': 1, 's':1, 'vt': 1}){
                                        $scope.ph_csv_config_shw_dic[cl] = 1;
					if(cl in $scope.WMergeAcross_grp_dic){
						$scope.ph_csv_config[cl] = $scope.WMergeAcross_grp_dic[cl];
						$scope.ph_csv_config_chck[cl] = true;
					}
                                }
				$scope.frm_csv = true;
                                $scope.ph_csv_config_table_flg_fnl = true;
		}
	}
	/***********************************/
	$scope.bar_clicked_comp_name = '';
    	parent.clicked_bar_data_func = function(data, datsetIdx, dataIdx){
		var dic = data[datsetIdx];
		var bar_data = {};
		if('data_h' in dic){
			bar_data = dic['data_h'][dataIdx];
		}
		if('comp_name' in bar_data)
			$scope.bar_clicked_comp_name = bar_data['comp_name'];
		else
			$scope.bar_clicked_comp_name = '';
		$scope.pdf_highight_func(bar_data);
    	}
	/***********************************/
	$scope.pdf_highight_func = function(row, frame='iframe2', color='parent_iframe_tag'){
		var cel = row;
		if($scope.mn_tbl_pdf_btn_flg=='table'){
			$scope.table_id = cel['t'];	
               		tasIframe.tableHighlight('iframe2', cel['t'], [cel['x']], 'parent_iframe_tag', true);
		}else{
			var p_num = 0;
		    	if('x' in cel){
			    	xml = cel['x'].split(':@:');
			    	p_num = xml[0].split('_')[1].split('#')[0].split('@')[0];
		    	}
		    	$scope.p_num = p_num;
		    	$scope.doc_id = cel['d'];
		    	var info = [];
		    	var bbox = cel['bbox'] || [];
		    	if($scope.doc_id in $scope.bbox_dict && $scope.p_num in $scope.bbox_dict[$scope.doc_id])
				info =  $scope.bbox_dict[$scope.doc_id][$scope.p_num];
			tasIframe.pdfHighlight('iframe2', $scope.doc_id, $scope.p_num, bbox, info, 'parent_iframe_tag', true, '', 200);
		}
    	}
	/***********************************/
	$scope.grp_ismenu_inp_func = function(data, txt=''){
            if(!data)
                return [];
	    var rtrn_data = []; 
            rtrn_data = data.filter(function(tv){ return (String(tv['n'] || '').toLocaleLowerCase().includes(txt.toLocaleLowerCase()))});
 	    return rtrn_data;
        }
    	/***********************************/
    	$scope.only_one_func = function(data){
		if(data.length == 1)
			return true;
		else
			return false;
    	}
    	/***********************************/
    	$scope.only_one_ins_func = function(data, txt=''){
		if(!data)
			return false;
		var rtrn_data = [];
		rtrn_data = data.filter(function(tv){ return (String(tv['n'] || '').toLocaleLowerCase().includes(txt.toLocaleLowerCase()))});
		if(rtrn_data.length == 1)
			return true;
		else
			return false;
    	}
    	/***********************************/
    	$scope.filter_function = function(txt='', event, pnodeId, prnt_div_class){
		var pnode = document.getElementById(pnodeId);
		if(event){
			if(event.keyCode == 13){
				var all_list_dom = pnode.querySelectorAll("."+prnt_div_class) || [];
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
		var all_list_dom = pnode.querySelectorAll("."+prnt_div_class) || [];
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
	$scope.usr_save_update_func = function(data, action){
		var post_data = {'cmd_id': 172, 'table_type': $scope.selected_grp_dic['table_type'], 'grpid': $scope.selected_grp_dic['grpid'], 'idata': $scope.selected_grp_dic['idata'], 'etype': $scope.actve_full_tab_dic['k'], 'data': data, 'action': action};
                $scope.ps = true;
                tasService.ajax_request(post_data, 'POST', function(res){
			$scope.ps = false;		
			if(res['message']){
				if(res['message'] == 'done'){
					tasAlert.show(res['message'], 'success', 1000);
				}else{
					tasAlert.show(res['message'], 'error', 1000);
				}
                	}
		});
	}
    	/***********************************/
	$scope.dbdl_full_save_func = function(){	
		if(!(Object.keys($scope.grp_grid.scope.slcted_data_lost_dic).length)){
			tasAlert.show('Nothing to save.', 'warning', 1000);
			return;
		}
		cflg    = confirm('Are you sure you want to save?');
	        if(!cflg)
        	    return;
		var post_data = {'cmd_id': 168, 'table_type': $scope.selected_grp_dic['table_type'], 'grpid': $scope.selected_grp_dic['grpid'], 'data': $scope.grp_grid.scope.slcted_data_lost_dic};
		$scope.ps = true;
		tasService.ajax_request(post_data, 'POST', $scope.cl_bk_bdl_full_save_func);
	}
	/***********************************/
	$scope.cl_bk_bdl_full_save_func = function(res){
		$scope.ps = false;
		if(res['message']){
			if(res['message'] == 'done'){
				$scope.usr_save_update_func($scope.grp_grid.scope.slcted_data_lost_dic, 'COL_SELECT');	
			}else{
				tasAlert.show(res['message'], 'error', 1000);
			}
		}
	}
	/***********************************/
	$scope.lposs_rmv_poss_func = function(){
		var target_taxo = '';
		var id_list = $scope.grp_grid.data.data.filter(function(row){ return  row['t_id'] in $scope.grp_grid.scope.row_chck_dic;}).map(function(row){ 
			var t_l_txo = row['t_l'].split(/\s+/).join('');
			if(t_l_txo.length>target_taxo.length)
				target_taxo = t_l_txo;
			return row['t_id'];
			});	
		var list = [];
		id_list = Object.keys($scope.grp_grid.scope.row_chck_dic);
		if(id_list.length == 0){
			tasAlert.show('Please select rows.', 'warning', 1000);
			return;
		}
		cflg    = confirm('Are you sure you want to remove from possibilty?');
                if(!cflg)
                    return;
		$scope.usr_save_update_func(id_list, 'REMOVE_POS');	
	}
	/***********************************/
	$scope.lposs_full_merge_func = function(){
		var target_taxo = '';
		var id_list = $scope.grp_grid.data.data.filter(function(row){ return  row['t_id'] in $scope.grp_grid.scope.row_chck_dic;}).map(function(row){ 
			var t_l_txo = row['t_l'].split(/\s+/).join('');
			if(t_l_txo.length>target_taxo.length)
				target_taxo = t_l_txo;
			return row['t_id'];
			});	
		var list = [];
		id_list = Object.keys($scope.grp_grid.scope.row_chck_dic);
		/*var list = Object.keys($scope.selected_table);
		list = list.map(function(row){return row.split(' ')[0]});*/
		if(id_list.length == 0){
			tasAlert.show('Please select rows to merge.', 'warning', 1000);
			return;
		}
		cflg    = confirm('Are you sure you want to merge?');
                if(!cflg)
                    return;
		var post_data = {'cmd_id': 9, 'table_type': $scope.selected_grp_dic['table_type'], 'grpid': $scope.selected_grp_dic['grpid'], 't_ids': id_list, 'st_ids': list, 'taxo_flg':1, 'target_taxo': encodeURIComponent(target_taxo)};
                $scope.ps = true;
                tasService.ajax_request(post_data, 'POST', function(res){
			$scope.ps = false;
			if(res['message']){
				if(res['message']=='done'){
					$scope.usr_save_update_func(id_list, 'MERGE');	
				}else{
					tasAlert.show(res['message'], 'error', 1000);
				}
			}
		});
	}
	/***********************************/
	$scope.gen_ind_tt_func = function(sm){
		var post_data = {'cmd_id': 169, 'table_types': [sm['n']]};
                $scope.ps = true;
                tasService.ajax_request(post_data, 'POST', $scope.cl_bk_gen_ind_tt_func);
	}
	/***********************************/
	$scope.gen_ful_tt_func = function(){
		cflg    = confirm('Are you sure you want to generate-all?');
                if(!cflg)
                    return;
		var post_data = {'cmd_id': 169, 'table_types': []};
                $scope.ps = true;
                tasService.ajax_request(post_data, 'POST', $scope.cl_bk_gen_ind_tt_func);
	}
	/***********************************/
	$scope.cl_bk_gen_ind_tt_func = function(res){
		$scope.ps = false;
		if(res['message']){
			if(res['message']=='done'){
				tasAlert.show(res['message'], 'success', 1000);	
                		//$scope.get_grp_err_flg = !$scope.get_grp_err_flg;
				$scope.get_grp_err_func($scope.get_grp_err_flg);
			}else{
				tasAlert.show(res['message'], 'error', 1000);	
			}
		}
	}
	/***********************************/
	$scope.grp_header_dic = {};
	$scope.grp_header_list = [];
    	function gridOptionsColumn_func(flg){
		$scope.gridOption_pos_key  = arguments[1] || '';
		var gridOption_pos_key_var = arguments[1] || ''; 
		var grid_full_data = $scope.g_grid_data;
		if($scope.gridOption_pos_key == 'Sub')
			grid_full_data = $scope.g_grid_data_sub;
		$scope.row_chck_dic = {};
		var parent_show = true;
		if($scope.g_grid_data['taxo_flg'] && $scope.gridOption_pos_key == ''){
			parent_show = false;
		}
		$scope.toggleCheckerAll_dic['val'] = false;
		var gridOptionsColumnDefs = [
		  {
			field: 'sn',
			displayName: '#',
			width: 30,
			pinnedLeft: true,
			cellEditableCondition:false,
			'headerCellTemplate':gridOptionsColumnSn_all,
			cellTemplate:
			`<div class="ui-grid-cell-contents" style="padding: 0px; cursor: pointer;background-color: #f0f0ee;" ng-click="grid.appScope.row_chck_dic_func(row.entity.t_id)">
				<div class="ui-grid-cell-contents">
					<div class="ui-grid-selection-row-header-buttons ui-grid-icon-ok" ng-class="{'ui-grid-row-selected': grid.appScope.row_chck_dic[row.entity.t_id]}" style="user-select: none;">&nbsp;
					</div>
				</div>
			</div>`
                  },	
		  {
		    field: 't_l',
		    displayName: 'Description',
		    minWidth: 300,
		    pinnedLeft: true,
		    cellEditableCondition:true,
		    filters: [{
			    condition: function(term, value, row, column){
				    term = term.toLocaleLowerCase();
				    if (!term) {
					return true;
				    }
				    if(column.field in row.entity){
					    var id = row.entity['t_id'];
					    var lbl = row.entity[column.field];
					    if(String(id).includes(term) || lbl.toLocaleLowerCase().includes(term))
						return true;
				    }else{
					return false;
				    }
			    }
			}],
		    editableCellTemplate: '<input type="text" class="form-control" ng-input="row.entity.t_l" ng-model="row.entity.t_l" ui-grid-editor ng-focus="grid.appScope.update_old_cell_value(row.entity)">',
		    cellTemplate:
			 `<div class="ui-grid-cell-contents row_col_grid_cell_desc waves-effect" ng-click="grid.appScope.get_highlights_new(row.entity, '','', 'label', 'MT', $event, '`+gridOption_pos_key_var+`')" ng-class="{row_active: grid.appScope.slcted_pt_doc_row_key == [row.entity.t_id, row.entity.t_l].join('_'), active: grid.appScope.cell_active_val == row.entity['x']+'_'+row.entity['t'], missrow_flg :row.entity['missing'] == 'Y', missrow_i_flg :row.entity['missing'] == 'I', 'row_bold': row.entity['f'] == 'Y', 'row_lchange': row.entity['lchange'] == 'Y', row_merge_class: row.entity['merge'] == 'Y', new_row_full_hglt: row.entity['new_row'] == 'Y', new_row_full_hglt: grid.appScope.row_chck_dic[row.entity.t_id] == true, full_row_click_hight: grid.appScope.row_slct_cell_t_id_row == row.entity.t_id, col_merged_cls:grid.appScope.err_dup_taxo.includes(row.entity.t_id), frml_reslt_show: grid.appScope.frml_clr_dic[row.entity.t_id] == 'RES', frml_oprtr_show: grid.appScope.frml_clr_dic[row.entity.t_id] == 'OPR', ph_drved_clas_cell_comp: !row.entity['dbf'] && grid.appScope.g_grid_data['taxo_flg'], p_poss_clr : grid.appScope.kpi_avl_frml_dic[row.entity.t_id]}" title="{{row.entity['t_l']+'\n'+row.entity['t_id'] + '\nTaxo: '+row.entity['taxo']}}"> 		   
			  <div class="title title_wdth_{{grid.appScope.kpi_avl_frml_dic_lght_func(grid.appScope.kpi_avl_frml_dic[row.entity.t_id])}}">{{row.entity['t_l'] | trusted1}}</div>
			  <div class="kpi_avl_frml_bx" ng-if="grid.appScope.kpi_avl_frml_dic[row.entity.t_id]" ng-click="grid.appScope.kpi_avl_frml_click_func(row.entity, '','', 'label', 'MT', $event, '`+gridOption_pos_key_var+`');$event.stopPropagation();">
				<div class="kpi_avl_frml_inr_bx grn" ng-if="grid.appScope.kpi_avl_frml_dic[row.entity.t_id]['G']">{{grid.appScope.kpi_avl_frml_dic[row.entity.t_id]['G']}}</div>
				<div class="kpi_avl_frml_inr_bx org" ng-if="grid.appScope.kpi_avl_frml_dic[row.entity.t_id]['O']">{{grid.appScope.kpi_avl_frml_dic[row.entity.t_id]['O']}}</div>
				<div class="kpi_avl_frml_inr_bx red" ng-if="grid.appScope.kpi_avl_frml_dic[row.entity.t_id]['R']">{{grid.appScope.kpi_avl_frml_dic[row.entity.t_id]['R']}}</div>
			  </div>
			  <div style="width: 20px; float: left;border-left: 1px solid #e0e0e0;text-align: center;" ng-if="row.entity['th_flg'] != ''">{{row.entity['th_flg']}}</div>
			  <span class="lc_btn" ng-if="row.entity['lchange'] == 'Y' && row.entity['new_row'] != 'Y'" ng-click="grid.appScope.lchange_decs_func(row.entity)">LC</span>
			  <span class="lc_btn" ng-if="grid.appScope.from_merge == 'Y'" ng-click="grid.appScope.pos_decs_func(row.entity)">P</span>
			  <span class="lc_btn um" ng-if="row.entity['merge'] == 'Y' && row.entity['new_row'] != 'Y'" ng-click="grid.appScope.row_unmerge_func(row.entity.t_id)" style="display: none !important;">UM</span>
			  <span class="lc_btn add" ng-click="grid.appScope.add_new_line_item(row.entity)" title="Add new lineitem" style="display: none !important;"><i class="fa fa-plus" aria-hidden="true"></i></span>	
			  <span class="lc_btn" ng-if="row.entity['new_row'] == 'Y'" ng-click="grid.appScope.clr_new_row_cell(row.entity, '', 'label')" title="Clear" style="background: #F44336;">C</span>
			  <span class="lc_btn del" ng-if="row.entity['new_row'] == 'Y'" ng-click="grid.appScope.del_new_row_cell(row.entity)" title="Delete">&times;</span>
			</div>`
		  },
		{
			field: 'parent_txt',
			displayName: 'Parent',
			width: 100,
			pinnedLeft: true,
			pinnedRight: false,
			visible: parent_show,
			cellEditableCondition:false,
			cellTemplate:
			 `<div class="ui-grid-cell-contents" title="{{row.entity.parent_txt}}" ng-class="{new_row_full_hglt: grid.appScope.row_chck_dic[row.entity.t_id] == true, full_row_click_hight: grid.appScope.row_slct_cell_t_id_row == row.entity.t_id, row_active: grid.appScope.slcted_pt_doc_row_key == [row.entity.t_id, row.entity.t_l].join('_')}" ng-bind-html="row.entity.parent_txt |  trusted1">
			</div>`
		  },
			];
		  if(flg){
			$scope.grp_header_dic = {};
			$scope.grp_header_list = [];
		  }
		  var prev_ph = '';
		  $scope.prev_flg = [];
		  grid_full_data['phs'].forEach(function(row){
			var fld = row['k'];
			var grp = row['g'] || (row['k'].split('-')[0]);
			var dp  = row['n'];
			var pinned_Right = false;
			if('pin_right' in row && row['pin_right'] == 'Y')	
				pinned_Right = true;
			if($scope.actve_ph_drvtn || $scope.show_output_flg){
				if(prev_ph == '' || dp.slice(2) != prev_ph){
					prev_ph = dp.slice(2);
					if(!($scope.prev_flg.includes(dp)))
						$scope.prev_flg.push(dp);
				}
			}
			var ph_cell_temp = `<div class="ui-grid-cell-contents row_col_grid_cell waves-effect" ng-click="grid.appScope.get_highlights_new(row.entity, col.colDef,'', '', 'MT', $event, '`+gridOption_pos_key_var+`')" ng-class="{'m_Y_status': row.entity['`+fld+`']['m'] == 'Y', 'row_bold': row.entity['`+fld+`']['g_f'] == 'Y' || row.entity['`+fld+`']['ng_f'] == 'Y' , new_row_full_hglt: row.entity['new_row'] == 'Y', new_row_full_hglt: grid.appScope.row_chck_dic[row.entity.t_id] == true, full_row_click_hight: grid.appScope.row_slct_cell_t_id_row == row.entity.t_id, re_stated_cell : row.entity['`+fld+`']['re_stated'], col_merged_cls:(grid.appScope.merged_ph_overlap_col.includes('`+fld+`') && grid.appScope.selected_merged_t_ids.includes(row.entity.t_id)) || (grid.appScope.merged_ph_overlap_rid.includes(row.entity['`+fld+`']['rid']) && grid.appScope.selected_merged_t_ids.includes(row.entity.t_id)) || grid.appScope.err_dup_taxo_dic[row.entity.t_id]['`+fld+`'], ph_drved_clas_cell: grid.appScope.ph_grp_drved_t_id[row.entity.t_id]['`+fld+`'] == 'N', ph_drved_clas_cell_err: row.entity['`+fld+`']['pce'], expr_str_cell_done: row.entity['`+fld+`']['fv'] == 'Y', expr_str_cell_frml_done: grid.appScope.ph_grp_drved_t_id[row.entity.t_id]['`+fld+`'] == 'Y' || row.entity['`+fld+`']['ph-poss'] == 'Y', frml_reslt_show: grid.appScope.frml_clr_dic_cell['`+fld+`'][row.entity.t_id] == 'RES' || grid.appScope.frml_clr_dic_cell_s['`+fld+`'][row.entity.t_id] == 'RES', frml_reslt_show_err: grid.appScope.frml_clr_dic_cell_s['`+fld+`'][row.entity.t_id] == 'RES_E', frml_oprtr_show: grid.appScope.frml_clr_dic_cell['`+fld+`'][row.entity.t_id] == 'OPR' || grid.appScope.frml_clr_dic_cell_s['`+fld+`'][row.entity.t_id] == 'OPR', ph_grp_drved_t_id_save_del: grid.appScope.ph_grp_drved_t_id_saved[row.entity.t_id]['`+fld+`'] == 'N', red_clr_txt: row.entity['`+fld+`']['c_s'], parent_lbl_bg: '`+dp+`' == 'Parent' && grid.appScope.g_grid_data['taxo_flg'], 'text-left': grid.appScope.g_grid_data['taxo_flg'], ph_flg: row.entity['`+fld+`'] && row.entity['`+fld+`']['ph_f'] && row.entity['`+fld+`']['ph_f'] != '', yr_wise_filter: (grid.appScope.prev_flg.includes('`+dp+`') && (grid.appScope.actve_ph_drvtn || grid.appScope.show_output_flg)) || (grid.appScope.prev_flg.includes('`+fld+`') && !grid.appScope.actve_ph_drvtn && !grid.appScope.show_output_flg && !grid.appScope.taxo_enbl_flg['val']), selcted_cell_err_cls: grid.appScope.err_cell_tbl_xml_dic[row.entity.t_id]['`+fld+`'], sign_change_cell: row.entity['`+fld+`']['sign_change'] == 'Y', 'edited_cell': row.entity['`+fld+`']['edited']=='Y', copied_cell_clr: row.entity['`+fld+`']['copied']=='Y', dnc_cell_clr:row.entity['`+fld+`']['dnc']=='Y', row_active: grid.appScope.slcted_pt_doc_row_key == [row.entity.t_id, row.entity.t_l].join('_'),  active:grid.appScope.slcted_pt_doc_cell_key == [row.entity.t_id, '`+fld+`'].join('_')}" style="text-align: right;" title="{{row.entity['`+fld+`']['v']+'\n'+grid.appScope.stingify_obj(row.entity['`+fld+`']['phcsv'])+'\n'+row.entity['`+fld+`']['expr_str'] +'\n V.T:'+grid.appScope.stingify_obj(row.entity['`+fld+`']['vt'])}}">{{row.entity['`+fld+`']['v']}} <sub style="color: #F44336;" ng-if="row.entity['`+fld+`']['c_s']" title="{{row.entity['`+fld+`']['c_s']}}">{{row.entity['`+fld+`']['c_s']}}</sub>
						<span title="Group" class="d_table_td_ref_span" ng-if="row.entity['`+fld+`'] && row.entity['new_row'] != 'Y'" ng-click="grid.appScope.grp_shw_func(row.entity['`+fld+`']['g']);" style="display:none !important;">G</span>
						<span title="Formula" class="d_table_td_ref_span" ng-if="row.entity['`+fld+`']['f_col']" ng-click="grid.appScope.frml_shw_func(row.entity['`+fld+`']['f_col']);">F</span>
						<span title="Group" class="d_table_td_ref_span" ng-if="row.entity['new_row'] == 'Y'" ng-click="grid.appScope.clr_new_row_cell(row.entity['`+fld+`'], ['`+fld+`'], '');" style="background:red; color: #fff;">C</span>
						<span title="Re Stated" class="d_table_td_ref_span re_stated" ng-if="row.entity['`+fld+`']['re_stated']" ng-click="grid.appScope.re_stated_show_func(row.entity['`+fld+`'], ['`+fld+`']);">R</span>
						<span title="Delete" class="d_table_td_ref_span" ng-if="row.entity['`+fld+`'] && row.entity['`+fld+`']['copied'] == 'Y'" ng-click="grid.appScope.copied_cell_del_func('`+fld+`', row.entity);" style="right: 0px;left: unset;background: #F44336;">D</span>
						<span title="Revert" class="d_table_td_ref_span" ng-if="row.entity['`+fld+`'] && row.entity['`+fld+`']['dnc'] == 'Y'" ng-click="grid.appScope.dnc_cell_revrt_func('`+fld+`', row.entity);" style="right: 0px;left: unset;background: #F44336;">D</span>
					    </div>`;
			if(flg){
				var min_width = 90;
				if(!parent_show)
					min_width = 150;
				var dic = {
					field:  fld,
					displayName: dp,
					group: grp,
					minWidth:  min_width,
					enableFiltering:false,
					visible: true,
					pinnedRight: pinned_Right,
					cellEditableCondition:function(src){
						if('editable' in src.row.entity && src.row.entity['editable'] == 'Y'){
							return true;
						}
						return false;
					},
					editableCellTemplate: `<input type="text" class="form-control" ng-input="row.entity['`+fld+`']['v']" ng-model="row.entity['`+fld+`']['v']" ui-grid-editor ng-focus="grid.appScope.update_old_cell_cl_value(row.entity, '`+fld+`')">`,
					enableSorting : false,
					headerCellTemplate:`<div class="ui-grid-cell-contents" style="text-align: center;" ng-click="grid.appScope.col_ph_k_slct_dic_func('`+fld+`')" ng-class="{col_ph_k_slct_clss: grid.appScope.col_ph_k_slct_dic['`+fld+`'], yr_wise_filter: (grid.appScope.prev_flg.includes('`+dp+`') && (grid.appScope.actve_ph_drvtn || grid.appScope.show_output_flg)) || (grid.appScope.prev_flg.includes('`+fld+`') && !grid.appScope.actve_ph_drvtn && !grid.appScope.show_output_flg && !grid.appScope.taxo_enbl_flg['val'])}">`+dp+`</div>`,
					cellTemplate: ph_cell_temp
				    };
				if(!(grp in $scope.grp_header_dic)){
				    $scope.grp_header_dic[grp] = true;
				    $scope.grp_header_list.push({'n': grp, 'f': true});
				}
			}else{
			    var dic = {
				field:  fld,
				displayName: dp,
				group: grp,
				minWidth: 90,
				enableFiltering:false,
				visible: $scope.grp_header_dic[grp] || false,
				cellEditableCondition:function(src){
					if('editable' in src.row.entity && src.row.entity['editable'] == 'Y'){
						return true;
					}
					return false;				
				},
				enableSorting : false,
				editableCellTemplate: `<input type="text" class="form-control" ng-input="row.entity['`+fld+`']['v']" ng-model="row.entity['`+fld+`']['v']" ui-grid-editor ng-focus="grid.appScope.update_old_cell_cl_value(row.entity, '`+fld+`')" ng-if="">`,
				headerCellTemplate:`<div class="ui-grid-cell-contents" style="text-align: center;" ng-click="grid.appScope.col_ph_k_slct_dic_func('`+fld+`')" ng-class="{col_ph_k_slct_clss: grid.appScope.col_ph_k_slct_dic['`+fld+`'], yr_wise_filter: (grid.appScope.prev_flg.includes('`+dp+`') && (grid.appScope.actve_ph_drvtn || grid.appScope.show_output_flg)) || (grid.appScope.prev_flg.includes('`+fld+`') && !grid.appScope.actve_ph_drvtn && !grid.appScope.show_output_flg && !grid.appScope.taxo_enbl_flg['val'])}">`+dp+`</div>`,
				cellTemplate:ph_cell_temp
			    };
			}
			gridOptionsColumnDefs.push(dic);
		  });
		return gridOptionsColumnDefs;
    	}
	/***********************************/
	$scope.grp_db_col_upd_func = function(k, n, g, ev){
		var post_data = {'cmd_id': 173, 'table_type': $scope.selected_grp_dic['table_type'], 'grpid': $scope.selected_grp_dic['grpid'], 'idata': $scope.selected_grp_dic['idata'], 'etype': $scope.actve_full_tab_dic['k'], 'iph': [g], 'data': $scope.grp_grid.scope.slcted_data_lost_dic};
                $scope.ps = true;
                tasService.ajax_request(post_data, 'POST', function(res){
                        $scope.ps = false;
                        if(res['message']){
                                if(res['message'] == 'done'){
                                        tasAlert.show(res['message'], 'success', 1000);
					$scope.grp_grid['data'].data.forEach(function(row){
						if(k in row){
							delete row[k];
						}
						if(row['t_id'] in res['data']){
							var res_dic = res['data'][row['t_id']];
							angular.forEach(res_dic, function(vall, keyy){
								row[keyy] = vall;
							});
						}
					});
                                        $scope.grp_grid.scope.ag_grid_load_data($scope.grp_grid['data'], true);	
                                }else{
                                        tasAlert.show(res['message'], 'error', 1000);
                                }
                        }
                });
	}
	/***********************************/
    	$scope.save_line_item_pos_func = function(){
		var id_list =  $scope.grp_grid.data.data.filter(function(row){ return  row['t_id'] in $scope.grp_grid.scope.row_chck_dic;});
		if(id_list.length == 0){
			tasAlert.show('Please select row to update.', 'warning', 1000);
			return;
		}
		var t_ids = [];
		for(var a=0; a<id_list.length; a++){
			var row = id_list[a];
			if($scope.line_item_pos_dic['val'] == 'T'){
				if(row['f'] && row['f'] == 'Y'){
					t_ids.push(row['t_id']);
				}else{
					tasAlert.show("\'"+row['t_l']+"\' not applicable for \'T'\.", 'warning', '');
					return;
				}
			}else if($scope.line_item_pos_dic['val'] == 'H'){
				if(!('da' in row)){
					t_ids.push(row['t_id']);
				}else{
					tasAlert.show("\'"+row['t_l']+"\' not applicable for \'H'\.", 'warning', '');
					return;
				}
			}else if($scope.line_item_pos_dic['val'] == 'S'){
				if(row['f'] && row['f'] == 'Y'){
					t_ids.push(row['t_id']);
				}else{
					tasAlert.show("\'"+row['t_l']+"\' not applicable for \'S'\.", 'warning', '');
					return;
				}
			}else{
				t_ids.push(row['t_id']);
			}
		}
		var val_flg = $scope.line_item_pos_dic['val'];
		if(val_flg == 'Unset')
			val_flg = ''
		var post_data = {'cmd_id':57, 'table_type': $scope.selected_grp_dic['table_type'], 'grpid': $scope.selected_grp_dic['grpid'], 'idata': $scope.selected_grp_dic['idata'], 'etype': $scope.actve_full_tab_dic['k'], 't_ids': t_ids, 'key': val_flg};
		$scope.ps = true;
		tasService.ajax_request(post_data, 'POST', function(res){
			$scope.ps = false;
			if(res['message'] == 'done'){
				tasAlert.show(res['message'], 'success', 1000);
				//$scope.grp_grid.scope.set_row_val_func('th_flg', t_ids, val_flg);
				$scope.grp_grid.data.data.map(function(row){
                                        if(t_ids.includes(row['t_id'])){
                                                row['th_flg'] = val_flg;
                                        }
                                });
				$scope.grp_grid.scope.ag_grid_load_data($scope.grp_grid['data']);
				$scope.grp_grid.scope.row_chck_dic = {};
				var id_dic = {};
				t_ids.forEach(function(rw){
					id_dic[rw] = val_flg;
				});
				$scope.usr_save_update_func(id_dic, 'SIGN_CHANGE');	
			}else{
				tasAlert.show(res['message'], 'error', '');
			}		
		});
    	}
    	/***********************************/
	$scope.del_frml_func = function(t_id, grid='main'){
		var rid = '';
		var frm_list = [];
		if(grid =='sub'){
			if(t_id in $scope.formula_sub_grid){
				frm_list = $scope.formula_sub_grid[t_id]['data'];
			}
		}else{
			if(t_id in $scope.formula_grid){
                                frm_list = $scope.formula_grid[t_id]['data'];
                        }
		}
		if(frm_list.length){
			rid = frm_list[0]['rid'] || '';
		}
		cflg    = confirm('Are you sure you want to delete?');
                if(!cflg)
                    return;
		var post_data = {'cmd_id': 33, 'table_type': $scope.selected_grp_dic['table_type'], 'grpid': $scope.selected_grp_dic['grpid'], 'idata': $scope.selected_grp_dic['idata'], 'etype': $scope.actve_full_tab_dic['k'], 'grps': [], 'df': 1, 'type': 'FORMULA', 'rids': [rid]};
	        $scope.ps = true;
		tasService.ajax_request(post_data, 'POST', function(res){
			$scope.ps = false;
			if(res['message']){
				if(res['message'] == 'done'){
					if(grid =='sub'){
						delete $scope.formula_sub_grid[t_id];
						$scope.slct_sub_rw_avl_frml_key = null;
					}else{
						delete $scope.formula_grid[t_id];
						$scope.slct_rw_avl_frml_key = null;
	                                        $scope.formula_sub_grid = {};	
						$scope.slct_sub_rw_avl_frml_key = null;
					}
					tasAlert.show(res['message'], 'success', 1000);
				}else{
					tasAlert.show(res['message'], 'error', 1000);
				}
			}
		});
	}
	/***********************************/
    	$scope.frme_chck_cf_enbl = {'val': false}
    	$scope.frml_save_func = function(df, rid){
		var list = [];
		var rids = [];
		var grpid = '';
		var type = 'FORMULA';
		$scope.form_edit_flg = false;
		if(!df){
			if($scope.formula_grid.data.length  == 0){
				tasAlert.show('Nothing to save.', 'warning', 1000);
				return;
			}
			var dic = {};
			var ph = '';
			dic['f'] = '';
			var f_list = [];
			var f_str = [];
			$scope.formula_grid.data.forEach(function(row){
					if(row['operator'] == '='){
						ph = row['ph'];
						if($scope.frme_chck_cf_enbl['val']){
							dic['ph'] = ph+'^'+($scope.frme_chck_cf_enbl['row']?1:0);
						}else{
							dic['ph'] = ph;
						}
						dic['tids'] = {};
						dic['tids'][encodeURIComponent(row['taxo_id'])] = {};
						if(type != 'PTYPEFORMULA'){
							dic['tids'][encodeURIComponent(row['taxo_id'])][row['k']] = [];
						}else{
							var ph_keyy = ph.slice(0,-4);
							dic['tids'][encodeURIComponent(row['taxo_id'])][ph_keyy] = [];
						}
						dic['rid'] = row['rid']?row['rid']:'new';
					}
					var op_type = 't';
					if(!('taxo_id' in row) || row['taxo_id'] == ''){
						row['taxo_id'] = row['clean_value'];	
						op_type = 'v';
					}

					if($scope.frme_chck_cf_enbl['val']){
						var f = encodeURIComponent(row['taxo_id'])+'^'+row['k']+'^'+row['ph']+'@@'+encodeURIComponent(row['operator'])+'@@'+row["tt"]+'@@'+row["grpid"]+'@@'+op_type+'@@'+row["c"]+'@@'+row["s"]+'@@'+row["vt"]+'@@'+row['ph'];
						dic['row'] = $scope.frme_chck_cf_enbl['row']?1:0;

					}else{
						var f = encodeURIComponent(row['taxo_id'])+'@@'+encodeURIComponent(row['operator'])+'@@'+row["tt"]+'@@'+row["grpid"]+'@@'+op_type+'@@'+row["c"]+'@@'+row["s"]+'@@'+row["vt"]+'@@'+row['ph'];
					}
					f_list.push(f);
			});
			dic['f'] = f_list.join('$$');
			list.push(dic);
		}else{
			rids.push(rid);
			$scope.formula_grid.data = [];
			$scope.frml_rids = null;
			$scope.frml_clr_dic_cell = {};	
			$scope.frml_clr_dic_cell_s = {};	
		}
		var post_data = {'cmd_id': 33, 'table_type': $scope.selected_grp_dic['table_type'], 'grpid': $scope.wthout_grp_dic['f']?'':$scope.selected_grp_dic['grpid'], 'idata': $scope.selected_grp_dic['idata'], 'etype': $scope.actve_full_tab_dic['k'], 'df': df, 'type': type, 'rids': rids, 'grps': list};
		$scope.ps = true;
		tasService.ajax_request(post_data, 'POST', function(res){
			$scope.ps =false;
			if(res['message']){
				if(res['message']=='done'){
					tasAlert.show(res['message'], 'success', 1000);
				}else{
					tasAlert.show(res['message'], 'error', 1000);
				}
			}
		});
    	}
	/***********************************/
	$scope.selected_table   = {}
    	$scope.filter_table = function(t){
		if (t in $scope.selected_table)
		    delete $scope.selected_table[t]
		else
		    $scope.selected_table[t]  = true;
    	}
	/***********************************/
    	$scope.row_split_func = function(){
		var list= [];
		/*angular.forEach($scope.grp_grid.scope.slcted_data_lost_dic, function(val, key){
			if('phs' in val){
				var phs_list = val['phs'];
				phs_list.forEach(function(ph){
					var ph_s = ph.split('-')[0];
					if(!(list.includes(ph_s)))
						list.push(ph_s);
				});
			}
		});*/
		var list = Object.keys($scope.selected_table);
	        list = list.map(function(row){return row.split(' ')[0]});	
		console.log(list)
		if($scope.actve_full_tab_dic['k'] == 'WMergeAcross'){
			$scope.row_chck_dic = {};
			if('t_id' in $scope.WMergeAcross_grp_dic){
				$scope.row_chck_dic[$scope.WMergeAcross_grp_dic['t_id']] = 1;
			}
		}
		var id_list =  Object.keys($scope.row_chck_dic);
		if(id_list.length == 0){
		      tasAlert.show('Please select row to unmerge.', 'warning', 1000);
		      return;
		}
		if(list.length == 0){
		      tasAlert.show('Please select table to unmerge.', 'warning', 1000);
		      return;
		}
		var dtime = '';
		console.log(list, id_list)
		cflg    = confirm('Are you sure you want to save?');
                if(!cflg)
                    return;
		var post_data = {'cmd_id': 16, 'table_type': $scope.selected_grp_dic['table_type'], 'grpid': $scope.selected_grp_dic['grpid'], 'idata': $scope.selected_grp_dic['idata'], 'etype': $scope.actve_full_tab_dic['k'], 't_ids': id_list, 'st_ids': list, 'dtime': dtime, 'taxo_flg': 1};
		$scope.ps = true;
		tasService.ajax_request(post_data, 'POST', $scope.cl_bk_row_split_func);			
    	}
    	/***********************************/
	$scope.cl_bk_row_split_func = function(res){
		$scope.ps = false;
		if(res['message'] != 'done'){
			tasAlert.show(res, 'error')
		}else{
			tasAlert.show(res['message'], 'success', 1000);
			return;
			var s	= res['s']
			var sd	= res['sd']
			var d	= res['d']
			var table_ids = res['table_ids'];
			var dd	= {'t_id':d}
			for(var i=0, l=$scope.gridOptions.data.length;i < l;i++){
				if($scope.gridOptions.data[i]['t_id'] in sd){
					for (k in $scope.gridOptions.data[i]){
						if (k in {'t_l':1, 'x':1, 'd':1, 't':1, 'bbox':1})
							dd[k]	= $scope.gridOptions.data[i][k]	
						else if(k.split('-')[0] in table_ids){
							dd[k]	= $scope.gridOptions.data[i][k]	
							delete $scope.gridOptions.data[i][k]
						}
					}
				}	
			}
			$scope.gridOptions.data.splice(i, 0, dd)
			$scope.selected_table = {};
			$scope.row_chck_dic = {};
			$scope.gridOptions.data.map(function(row){
				row['order'] = res['order_d'][row['t_id']]
			})
			$scope.gridOptions.data.sort(function(a, b){
				return res['order_d'][a['t_id']] - res['order_d'][b['t_id']];
			})
		}
    	}
    	/***********************************/
	$scope.dbdl_full_complete_func = function(){
		cflg    = confirm('Are you sure you want to make it as completed?');
                if(!cflg)
                    return;
		var post_data = {'cmd_id': 175, 'table_type': $scope.selected_grp_dic['table_type'], 'grpid': $scope.selected_grp_dic['grpid'], 'idata': $scope.selected_grp_dic['idata'], 'etype': $scope.actve_full_tab_dic['k'], 'dn_st': 'Y'};
                $scope.ps = true;
                tasService.ajax_request(post_data, 'POST', function(res){
			$scope.ps = false;
			if(res['message']){
				if(res['message']=='done'){
					tasAlert.show(res['message'], 'success', 1000);
				}else{
					tasAlert.show(res['message'], 'error', 1000);
				}
			}
		});
	}
	/***********************************/
	$scope.show_pdfview = '';
    	$scope.show_pdfview = false;
    	$scope.show_pdfview_fun = function(){
		if($scope.doc_id == undefined || $scope.doc_id == ''){
			tasAlert.show('Please select cell.', 'warning', 1000);
			return;
		}
		$scope.show_pdfview = !$scope.show_pdfview;
		if($scope.show_pdfview){
		    $scope.docpath_object   = "/pdf_canvas/viewer.html?file=/"+$scope.new_pdf_download_path+"/"+ $scope.project_id+"_common/data/"+$scope.deal_id+"/input/"+$scope.doc_id+".pdf?#page="+$scope.p_num;
		}else
		    $scope.docpath_object   = '';
    	}
	/***********************************/
	$scope.wthout_grp_dic = {'f' :false};
	/***********************************/
	$scope.row_merge_poss_func = function(){
		console.log($scope.WMergeAcross_grp_dic)
		if(!('sn' in $scope.WMergeAcross_grp_dic)){
			tasAlert.show('Please select label.', 'warning', 1000);
			return;
		}
		var main_grp_data = $scope.doc_grp_res['data'][$scope.WMergeAcross_grp_dic['sn'] - 1];
		var main_dic = {};
		for(var b=0, b_l=main_grp_data['grp'].length; b<b_l;b++){
			var main_phs = main_grp_data['grp'][b]['phs'];
			var main_data = main_grp_data['grp'][b]['data'];
			for(var p=0, p_l=main_phs.length; p<p_l;p++){
				var cl = main_phs[p];
				if(cl['k'] in main_data && 'clr' in main_data[cl['k']]){
					var sign_key = [b, cl['k'], main_data[cl['k']]['clr']].join('~');
					main_dic[sign_key] = 1;
				}
			}
		}
		var data = $scope.doc_grp_res['data'];
		var sub_dic = {};
		for(var a=0, a_l=data.length;a<a_l;a++){
			//if(($scope.WMergeAcross_grp_dic['sn'] - 1) != a){
				sub_dic[a] = {};
				var sub_grp_data = data[a];
				for(var b=0, b_l=sub_grp_data['grp'].length; b<b_l;b++){
					var main_phs = sub_grp_data['grp'][b]['phs'];
					var main_data = sub_grp_data['grp'][b]['data'];
					for(var p=0, p_l=main_phs.length; p<p_l;p++){
						var cl = main_phs[p];
						if(cl['k'] in main_data && 'clr' in main_data[cl['k']]){
							var sign_key = [b, cl['k'], main_data[cl['k']]['clr']].join('~');
							sub_dic[a][sign_key] = 1;
						}
					}
				}
			//}
		}
		console.log(main_dic, sub_dic);
	}
	/***********************************/
	$scope.main_tt_slced_dic = {};
	$scope.main_tabs_sub_clck_func = function(row){
		$scope.main_tt_slced_dic = row;
		var get_key = ['DB', $scope.project_id, $scope.deal_id, 'ERRORDATA', row['k'], (row['grpid']|| '')].join('_');
                var post_data = {'get_key': get_key};
                $scope.ps = true;
		tasService.redis_request(post_data, 'POST', function(res){
			$scope.ps = false;
			console.log(res);
			if(res['message']){
				if(res['message'] == 'done'){
					$scope.grp_grid['data'] = res;
                                        $scope.grp_grid.scope.ag_grid_load_data($scope.grp_grid['data']);
				}else{
					tasAlert.show(res['message'], 'error', 1000);
				}
			}
		});
        }
	/***********************************/
        // $scope.validate_pop_up_tab = false
    $scope.display_validate_popup = function(objs){ 
           $scope.config.parent_scope.display_validate_popup(objs)
    }
	/***********************************/
	/***********************************/
	/***********************************/


})

app.directive('validatedData', function(){
        return {
                restrict: 'AE',
                template:`

<div class="sec_header_box">
	<div class="pull-left main_tab_menu waves-effect" ng-click="doc_list_func()" ng-class="{active: doc_list_flg}">
          <div class="toggle-icon">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>
        </div>
	<div class="main_tab_box pull-left">
		<div class="fltr_btn pull-left waves-effect" ng-click="get_grp_err_func(false)" ng-class="{active: get_grp_err_flg=='ALL'}">Availability</div>
		<div class="fltr_btn pull-left waves-effect" ng-click="get_grp_err_func(true)" ng-class="{active: get_grp_err_flg=='GROUP'}">Computation</div>
		<div class="fltr_btn pull-left waves-effect" ng-click="get_grp_err_func(true,'tally')" title="Tally" ng-class="{active: get_grp_err_flg=='TALLY'}"> Tally </div>		
		<div class="fltr_btn pull-left waves-effect" ng-click="gen_ful_tt_func()" title="Generate-All"><i class="fa fa-retweet" aria-hidden="true"></i></div>
		<div class="slcted_item_path" ng-if="!doc_list_flg">
			<span class="slcted_item_path_1" ng-if="actve_full_tab_dic" title="{{actve_full_tab_dic['n']}}">{{actve_full_tab_dic['n']}}</span><span class="slcted_item_path_2" ng-if="clicked_lft_row_dic" title="{{clicked_lft_row_dic['n']}}"> / {{clicked_lft_row_dic['n']}}</span><span class="slcted_item_path_3" ng-if="selected_grp_dic" title="{{selected_grp_dic['n']}}"> / <span style="color: #d9ebff;font-weight: bold;">{{selected_grp_dic['n']}}</span></span>
		</div>
	</div>
	<div class="pull-right">
		       <div class="fltr_btn pull-left waves-effect" ng-click="seve_selected_data()" title="Accept"  ng-if="accept_flag"> Accept </div>		
			<div class="btn btn-sm btn-outline pull-left btn-sm-sec main-tab" style="padding: 0px !important;height: 25px;width: 110px;text-align: left;" ng-if="actve_full_tab_dic['k'] == 'Sign_Change' || actve_full_tab_dic['k'] == 'Sign_Change_Pattern'">
                                <select ng-model="line_item_pos_dic['val']" style="height: 100%;width: 60px;border: 0px;font-size: 13px;background: #e1e1e1;float: left;">
                                        <option ng-repeat="pos in line_item_pos_list">{{pos['k']}}</option>
                                </select>
                                <div style="float: left;line-height: 21px;text-align: center;width: calc(100% - 60px);background: #acff4b !important;" ng-click="save_line_item_pos_func()">SAVE</div>
                        </div>
                        <div class="btn btn-sm btn-outline waves-effect pull-left btn-sm-sec main-tab active" ng-click="dbdl_full_save_func()" ng-if="actve_full_tab_dic['k'] == 'DBDL'" title="Save">Save</div>
                        <div class="btn btn-sm btn-outline waves-effect pull-left btn-sm-sec main-tab" ng-click="lposs_rmv_poss_func()" ng-if="actve_full_tab_dic['k'] == 'LPOSS'" title="Remove Possibility">Rmv Pos</div>
                        <div class="btn btn-sm btn-outline waves-effect pull-left btn-sm-sec main-tab" ng-click="lposs_full_merge_func()" ng-if="actve_full_tab_dic['k'] == 'LPOSS'" title="Merge">Merge</div>
                        <div class="btn btn-sm btn-outline waves-effect pull-left btn-sm-sec main-tab" ng-click="row_merge_poss_func()" ng-if="actve_full_tab_dic['k'] == 'WMergeAcross' || actve_full_tab_dic['k'] == 'WMerge'" title="Possibility">Possi</div>
                        <div class="btn btn-sm btn-outline waves-effect pull-left btn-sm-sec main-tab" ng-click="row_split_func()" ng-if="actve_full_tab_dic['k'] == 'WMergeAcross' || actve_full_tab_dic['k'] == 'WMerge'" title="UnMerge">UnMerge</div>
			<div class="pull-left" style="margin-left: 16px;" ng-if="0 && (actve_full_tab_dic['k']=='Group' || actve_full_tab_dic['k']=='WPH')">
			    <div class="header-icon sec waves-effect pull-left" style="height: 39px;line-height: 39px;" ng-click="grp_ref_change_func('prev')" ng-class="{disable_btn: selected_grp_idx['key'] == 0}"><i class="fa fa-chevron-left" aria-hidden="true"></i></div>
			    <div class="dropdown pull-left" style="width: 250px;">
				<div class="header-icon sec waves-effect dropdown-toggle header-icon-sec" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="padding: 0px 10px 0px 5px;text-align: right;height: 39px;line-height: 39px;">
				    <div class="header_icon_txt" title="{{selected_grp_dic['n']}}"><span>{{selected_grp_dic['n']}}</span></div>
				</div>
				<div class="dropdown-menu dropdown-menu-tas main_drp_dwn" style="min-width: 252px;width: 252px;">
					<div class="md-form md-form-tas" style="margin: 5px 23px;">
						<input class="form-control" type="text" placeholder="Search" aria-label="Search" ng-model="grp_ref_filter_dic['val']" style="font-size: 14px;" autofocus>
					</div>
					<div class="dropdown-item-tas waves-effect" ng-repeat="rw in grpAlHeaderFilter_inp_func(ref_grp_list, grp_ref_filter_dic['val']) track by $index" title="{{rw['n']}}" ng-click="load_grp_ref_func(rw)" ng-class="{act: selected_grp_dic['k'] == rw['k']}">{{rw['n']}}</div>
				</div>
			    </div>
			    <div class="header-icon sec waves-effect pull-left" style="height: 39px;line-height: 39px;"  ng-click="grp_ref_change_func('next')" ng-class="{disable_btn: selected_grp_idx['key'] == ref_grp_list.length-1}"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>
			</div>
			<!-- search -->
			<div class="waves-effect pull-left">
			      <input type="text" placeholder="Search" class="header_search"/>	
			</div>
			<!-- ./search -->
			<div class="btn btn-sm btn-success waves-effect pull-left btn-sm-sec main-tab" ng-click="dbdl_full_complete_func()"  title="Complete" style="background-color: #33b5e5!important;color: #fff!important;border: 2px solid #03A9F4 !important;">Complete</div>
			<div class="dropdown pull-left" style="width: auto; min-width: 200px;">
                                <div class="header-icon waves-effect dropdown-toggle header-icon-sec" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 40px;border-right: 1px solid #76a3c9;line-height: 40px;background: #5586b1;border-left: 1px solid #76a3c9;font-size: 13px;color: white;text-align: right;"><div class="header_icon_txt_tt">{{main_tt_slced_dic['l']}}</div></div>
                                <div class="dropdown-menu dropdown-menu-tas" style="width: auto !important;">
                                        <div class="dropdown-item-tas waves-effect" ng-repeat="tabs_sub in mt_list_all track by $index" ng-click="main_tabs_sub_clck_func(tabs_sub)">
                                                <div style="float: left;white-space: nowrap;-ms-text-overflow: ellipsis;-o-text-overflow: ellipsis;text-overflow: ellipsis;overflow: hidden;width: auto;height: 22px;" title="{{tabs_sub['l']}}">{{tabs_sub['l']}}</div>
                                        </div>
                                </div>
                        </div>
			<div class="waves-effect main_tab_btn pull-left main_tab_sub_sub_btn1" ng-click="display_validate_popup('Y')" title="Close" style="background: #5687b1;width: 40px;text-align: center;"><div class= close-button><span class="close-pop">x</span></div></div>	
			<div class="waves-effect main_tab_btn pull-left main_tab_sub_sub_btn1" ng-click="show_pdfview_fun()" title="PDF View" style="background: #5687b1;width: 40px;text-align: center;"><i class="fa fa-file-pdf-o"></i></div>	
	</div>
</div>
<div class="main_cntnt_sec">
	<div class="main_cntnt_lft" ng-class="{wdth0: !doc_list_flg}" style="overflow: auto;">
		<div class="lft_err_sec_ful">
			<ul class="side_nav">
				<li class="nav-header">Navigation</li>
				<li ng-repeat="menu in side_menu_full_list track by $index" ng-init="parntIdx=$index">
					<div class="float_main_menu" ng-class="{'active': menu['f'], actve_tab: menu['k']==actve_full_tab.split('$$')[0]}" ng-click="side_menu_tgle_func($index)">
						<i class="float_sub_menu_lft fa fa-th-large" aria-hidden="true"></i> 
						<div class="float_sub_menu_txt" ng-class="{actve_tab: menu['k']==actve_full_tab.split('$$')[0]}" title="{{menu['n']}}">{{menu['n']}}</div>
						<i class="float_sub_menu_caret fa fa-chevron-right" aria-hidden="true" ng-if="!menu['f']"></i>
						<i class="float_sub_menu_caret fa fa-chevron-down" aria-hidden="true" ng-if="menu['f']"></i>
						<div ng-click="$event.stopPropagation()">
							<!--input type="text" ng-show="menu['f']" class="float_sub_menu_ipt" ng-model="side_menu_fltr_dic[menu['k']]" ng-keyup="filter_function(side_menu_fltr_dic[menu['k']], event, ['side_sub_menu', menu['k']].join('_'), 'txo_list_pop_f_lft_bli')"-->
							<input type="text" ng-show="menu['f']" class="float_sub_menu_ipt" ng-model="side_menu_fltr_dic[menu['k']]">
						</div>
					</div>
					<ul class="side_sub_menu" ng-show="menu['f']" id="side_sub_menu_{{menu['k']}}">
						<li ng-repeat="smenu in menu['sl']" ng-class="{active: actve_full_tab == [menu['k'], smenu['k']].join('$$'), only_one: only_one_func(menu['sl'])}">
		                                        <div class="side_sub_menu_txt smenu" ng-click="get_rgt_data_func(parntIdx, smenu)">
								<span class="side_sub_menu_txt_inr_rfr pull-right" ng-click="gen_ind_tt_func(smenu);$event.stopPropagation();"><i class="fa fa-retweet" aria-hidden="true"></i></span>
								<div class="side_sub_menu_txt_inr status_flg_{{smenu['status_flg']}}" title="{{smenu['n']}}">{{smenu['n']}}</div>
							</div>
							<ul class="side_sub_menu iside_sub">
		                                                <li ng-repeat="ismenu in grp_ismenu_inp_func(smenu['idata'], side_menu_fltr_dic[menu['k']])" ng-class="{active: actve_full_sub_tab == [menu['k'], smenu['k'], ismenu['k']].join('_'), only_one: only_one_ins_func(smenu['idata'], side_menu_fltr_dic[menu['k']])}" class="txo_list_pop_f_lft_bli {{ismenu['clr']}}">
                                                        		<div class="side_sub_menu_txt" ng-click="load_ismenu_grp_ref_func(ismenu, smenu, parntIdx)">
										<div class="side_sub_menu_txt_inr status_flg_{{ismenu['status_flg']}}" title="{{ismenu['n']}}">{{ismenu['n']}}</div>
									</div>
                                                		</li>
                                        		</ul>
						</li>
					</ul>
				</li>
			</ul>	
		</div>
	</div>
	<div class="main_cntnt_rgh" ng-class="{wdth100: !doc_list_flg}">
		<div class="main_cntnt_dv">
			<div class="main_cntnt_dv_tp" ng-class="{'incr_height': toggle_btm_sec_dic['k'] == 'up'}">
				<div class="main_cntnt_dv_tp_innr" ng-if="actve_full_tab_dic['k']=='MT'" style="overflow: hidden;">
					<div class="grid_div grid_div_doc grid_div_avl" ui-grid="gridOptionsAvl" ui-grid-pinning ui-grid-resize-columns style="border-top: 0px solid #cadbea;border-left:0px solid #dddfe6;"></div>
				</div>
				<div class="main_cntnt_dv_tp_innr" ng-if="actve_full_tab_dic['k']!='MT' && actve_full_tab_dic['k']!='Spike' && actve_full_tab_dic['k']!='CSV' && actve_full_tab_dic['k']!='FORMULA_OVERLAP' && actve_full_tab_dic['k']!='WMergeAcross' && actve_full_tab_dic['k']!='VGHPATTERN' && actve_full_tab_dic['k']!='CSV'" style="overflow: hidden;">
					<!--div class="grid_div grid_div_doc grid_div_grp" ui-grid="gridOptionsGrp" ui-grid-pinning ui-grid-resize-columns style="height:100%;border-top: 0px solid #cadbea;border-left:0px solid #dddfe6;"></div-->
 					<tasgrid-div config="grp_grid"></tasgrid-div>	
				</div>
				<div class="main_cntnt_dv_tp_innr" ng-if="actve_full_tab_dic['k']=='WMergeAcross' || actve_full_tab_dic['k']=='VGHPATTERN' || actve_full_tab_dic['k']=='CSV'" style="overflow: hidden;">
                                        <div class="main_cntnt_dv_tp_innr_lft" style="overflow: hidden;">
                                                <div class="grid_div grid_div_doc grid_div_grp" ui-grid="gridOptionsSpike" ui-grid-pinning ui-grid-resize-columns style="height:100%;border-top: 0px solid #cadbea;border-left:0px solid #dddfe6;"></div>
                                        </div>
					<div class="main_cntnt_dv_tp_innr_rgh" ng-if="actve_full_tab_dic['k']=='VGHPATTERN' || actve_full_tab_dic['k']=='CSV'">
 						<tasgrid-div config="grp_grid"></tasgrid-div>	
					</div>
                                        <div class="main_cntnt_dv_tp_innr_rgh" style="overflow: auto;" ng-if="actve_full_tab_dic['k']=='WMergeAcross'">
						<div class="cslb_tble_grp" ng-repeat="gp in WMergeAcross_grp_dic['grp']" ng-if="0">
							<table class="cslb_tble">
								<thead>
									<tr class="cslb_tble_tr">
										<th class="cslb_tble_th sn">S.No</th>
										<th class="cslb_tble_th" ng-repeat="ph in gp['phs']">{{ph['n']}}</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="cslb_tble_td">1</td>
										<td class="cslb_tble_td" ng-repeat="ph in gp['phs']"  ng-click="cell_grp_click_func(gp['data'], ph['k'], true, $event, ph['n'])"  ng-class="{active: slcted_pt_doc_cell_key == ['0', ph['k']].join('_'), expr_str_cell_done: gp['data'][ph['k']]['f'] == 'Y', row_bold: gp['data'][ph['k']]['f_col']}">
											{{gp['data'][ph['k']]['v']}}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="cslb_tble_grp" ng-repeat="gp in WMergeAcross_grp_dic['grp'] track by $index" style="overflow: hidden;height:120px;" ng-init="grpIdx = $index">
							<div class="grid_div grid_div_doc grid_div_grp grid_div_frml" ui-grid="gridOptionsGrpMany[grpIdx]" ui-grid-pinning ui-grid-resize-columns ui-grid-group-columns style="height:100%;border-top: 0px solid #cadbea;border-left:0px solid #dddfe6;"></div>
 							<!--tasgrid-div config="gp"></tasgrid-div-->	
                                                </div>
                                        </div>
                                </div>
				<div class="main_cntnt_dv_tp_innr" ng-if="actve_full_tab_dic['k']=='Spike'" style="overflow: hidden;">
					<div class="main_cntnt_dv_tp_innr_lft" style="overflow: hidden;">
						<div class="grid_div grid_div_doc grid_div_grp" ui-grid="gridOptionsSpike" ui-grid-pinning ui-grid-resize-columns style="height:100%;border-top: 0px solid #cadbea;border-left:0px solid #dddfe6;"></div>
					</div>	
					<div class="main_cntnt_dv_tp_innr_rgh">
						<!--canvas id="graph_view-canvas"></canvas-->
						<div class="lsmt_l_fft" id="lsmt_l_fft_fll_top">
							<div class="frml_grp_sec" style="width: 50%;" ng-repeat="(ph, fl_data) in chart_graph_comp_ph_dic track by $index" id="cnvs_grp_id_{{ph}}" ng-class="{'rdc_grp_hgt': toggle_btm_sec_dic['k'] == 'up'}">
								<div class="frml_title" style="position: sticky;top: 0px;z-index: 5;"><b>{{ph}}</b></div>
								<div class="frml_canvas_grp" id="{{'canvas-cont-'+ph}}">
									 <canvas id="graph_view_comp-{{ph}}"></canvas>
								</div>
							</div>
						</div>	
					</div>	
                                </div>
				<div class="main_cntnt_dv_tp_innr" ng-if="0 && actve_full_tab_dic['k']=='CSV'" style="overflow: hidden;">
                                        <div class="main_cntnt_dv_tp_innr_lft">

                                        </div>
                                        <div class="main_cntnt_dv_tp_innr_rgh">

                                        </div>
                                </div>
				 <div class="main_cntnt_dv_tp_innr" ng-if="actve_full_tab_dic['k']=='FORMULA_OVERLAP'" style="overflow: hidden;">
                                        <div class="main_cntnt_dv_tp_innr_lft" style="width:50%;overflow:hidden;border-right: 2px solid #c7dcf2;">
						<div class="d_table_div_box_btm" style="overflow-y: auto;">
							<div class="d_table_div_frml" ng-repeat="fk in doc_grp_res['grp'] track by $index">
								<div class="frml_kpi_header" ng-click="ovrlp_avl_frml_change_func(fk, $index)" ng-class="{active: slct_rw_avl_frml_key == fk['taxo_ids']}">
									<div class="frml_kpi_header_txt">{{doc_grp_res['data'][fk['taxo_ids']]['t_l']}}</div>
                                                                        <div class="btn btn-sm btn-outline waves-effect pull-right btn-sm-sec" style="background: #ff8c83 !important;color: #fff !important;padding: 1px 8px !important;margin: 4px 5px !important;" ng-click="del_frml_func(fk['taxo_ids']);$event.stopPropagation();">Del</div>
								</div>
								<div style="width:100%; float:left;height:auto;">
									<div class="grid_div grid_div_vgh grid_div_frml" ui-grid="formula_grid[fk['taxo_ids']]" ui-grid-pinning ui-grid-resize-columns ui-grid-group-columns ui-grid-edit></div>
								</div>
							</div>
						</div>
                                        </div>
                                        <div class="main_cntnt_dv_tp_innr_rgh" style="width:50%;overflow:hidden;">
						<div class="d_table_div_box_btm" style="overflow-y: auto;">
                                                        <div class="d_table_div_frml" ng-repeat="fk in formula_sub_slcted_dic['overlap'] track by $index">
                                                                <div class="frml_kpi_header" ng-click="ovrlp_sub_avl_frml_change_func(fk, $index)" ng-class="{active: slct_sub_rw_avl_frml_key == ['sub', fk].join('_')}">
                                                                        <div class="frml_kpi_header_txt">{{doc_grp_res['data'][fk]['t_l']}}</div>
                                                                        <div class="btn btn-sm btn-outline waves-effect pull-right btn-sm-sec" style="background: #ff8c83 !important;color: #fff !important;padding: 1px 8px !important;margin: 4px 5px !important;" ng-click="del_frml_func(fk, 'sub');$event.stopPropagation();">Del</div>
                                                                </div>
                                                                <div style="width:100%; float:left;height:auto;">
                                                                        <div class="grid_div grid_div_vgh grid_div_frml" ui-grid="formula_sub_grid[fk]" ui-grid-pinning ui-grid-resize-columns ui-grid-group-columns ui-grid-edit></div>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
			</div>
			<div class="main_cntnt_dv_btm" ng-class="{'reduce_height': toggle_btm_sec_dic['k'] == 'up'}">
				<div class="main_cntnt_dv_btm_tp">
					<div class="main_cntnt_dv_btm_btm_lft" ng-class="{ful_100_per: !toggle_btm_ref_flg}">
						<div class="toggle_btm_sec_btn waves-effect" ng-click="toggle_btm_sec_btn_func()">
							<i class="fa fa-chevron-down" aria-hidden="true" ng-if="toggle_btm_sec_dic['k'] == 'down'"></i>
							<i class="fa fa-chevron-up" aria-hidden="true" ng-if="toggle_btm_sec_dic['k'] == 'up'"></i>
						</div>
						<div class="mn_tbl_pdf_bx">
							<div class="mn_tbl_pdf_btn waves-effect" ng-class="{active: mn_tbl_pdf_btn_flg=='pdf'}" ng-click="mn_tbl_pdf_btn_func('pdf')">PDF</div>
							<div class="mn_tbl_pdf_btn waves-effect" ng-class="{active: mn_tbl_pdf_btn_flg=='table'}" ng-click="mn_tbl_pdf_btn_func('table')">TABLE</div>
							<div class="mn_tbl_pdf_btn waves-effect" ng-class="{active: mn_tbl_pdf_btn_flg=='db'}" ng-click="mn_tbl_pdf_btn_func('db')">DB</div>
							<div class="mn_tbl_pdf_btn waves-effect" ng-class="{active: mn_tbl_pdf_btn_flg=='formula'}" ng-click="mn_tbl_pdf_btn_func('formula')">Formula</div>
						</div>
						<div class="pull-left cnt_fl_bx" ng-if="gridOptionsAvlAll_res.data.length">	
							<div class="pull-left waves-effect cnt_b rsts_G" ng-click="fltr_grid_func('pdf')" ng-class="{active: fltr_grid_key == 'pdf'}">PDF</div>
							<div class="pull-left waves-effect cnt_b rsts_Y" ng-click="fltr_grid_func('table')" ng-class="{active: fltr_grid_key == 'table'}">TABLE</div>
						</div>
					</div>
					<div class="main_cntnt_dv_btm_btm_rgt" ng-class="{redc_0_per: !toggle_btm_ref_flg}">
						<div class="pull-right">
							<div class="d_table_div_box_top_cb" ng-if="mn_tbl_pdf_btn_flg=='formula'" ng-click="wthout_grp_dic['f']=!wthout_grp_dic['f']">
                                                                <div class="d_table_div_box_top_cb_c">
                                                                        <div class="ui-grid-selection-row-header-buttons ui-grid-icon-ok" ng-class="{'ui-grid-row-selected': wthout_grp_dic['f']}" style="user-select: none;">&nbsp;</div>
                                                                </div>
                                                                <div class="d_table_div_box_top_cb_t">Without-Grp</div>
                                                        </div>
							<div class="btn btn-sm btn-success waves-effect pull-left" ng-click="frml_save_func(0)" style="padding: 4px 10px;margin: 4px 5px;" ng-if="mn_tbl_pdf_btn_flg=='formula'">Save</div>
						</div>
						<div class="pull-left" style="margin-left: 16px;" ng-if="ref_doc_list.length">
						    <div class="header-icon sec waves-effect pull-left" ng-click="doc_pno_ref_change_func('prev')" ng-class="{disable_btn: selected_doc_pno_idx['key'] == 0}"><i class="fa fa-chevron-left" aria-hidden="true"></i></div>
						    <div class="dropdown pull-left" style="width: 150px;">
							<div class="header-icon sec waves-effect dropdown-toggle header-icon-sec" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="padding: 0px 10px 0px 5px;text-align: right;">
							    <div class="header_icon_txt"><span>d: {{selected_doc_pno_dic['d']}} - pno: {{selected_doc_pno_dic['pno']}}</span></div>
							</div>
							<div class="dropdown-menu dropdown-menu-tas main_drp_dwn" style="min-width: 152px;width: 152px;">
								<div class="md-form md-form-tas" style="margin: 5px 23px;">
									<input class="form-control" type="text" placeholder="Search" aria-label="Search" ng-model="doc_pno_ref_filter_dic['val']" style="font-size: 14px;" autofocus>
								</div>
								<div class="dropdown-item-tas waves-effect" ng-repeat="rw in grpHeaderFilter_inp_func(ref_doc_list, doc_pno_ref_filter_dic['val']) track by $index" ng-click="load_doc_ref_func(rw)" ng-class="{act: [selected_doc_pno_dic['d'], selected_doc_pno_dic['pno']].join('_') == [rw['d'], rw['pno']].join('_')}">d: {{rw['d']}} - pno: {{rw['pno']}}</div>
							</div>
						    </div>
						    <div class="header-icon sec waves-effect pull-left" ng-click="doc_pno_ref_change_func('next')" ng-class="{disable_btn: selected_doc_pno_idx['key'] == ref_doc_list.length-1}"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>
						</div>
					</div>	
				</div>	
				<div class="main_cntnt_dv_btm_btm" ng-if="actve_full_tab_dic['k']=='MT'">
					<div class="main_cntnt_dv_btm_btm_lft" ng-class="{ful_100_per: !toggle_btm_ref_flg}">
						<div class="grid_div grid_div_doc" ui-grid="gridOptionsAvlAll" ui-grid-pinning ui-grid-resize-columns style="border-top: 0px solid #cadbea;border-left:0px solid #dddfe6;"></div>	
					</div>
					<div class="main_cntnt_dv_btm_btm_rgt" ng-class="{redc_0_per: !toggle_btm_ref_flg}">
						<div class="main_cntnt_dv_btm_btm_rgt_lf">
							<div class="toggle_btm_sec_btn_ref waves-effect" ng-click="toggle_btm_ref_btn_func()">
								<i class="fa fa-chevron-left" aria-hidden="true" ng-if="!toggle_btm_ref_flg"></i>
								<i class="fa fa-chevron-right" aria-hidden="true" ng-if="toggle_btm_ref_flg"></i>
							</div>
						</div>
						<div class="main_cntnt_dv_btm_btm_rgt_rt">
							<iframe src="{{return_trust(doc_path)}}" class="iframe2" id="iframe2"></iframe>
						</div>			
					</div>
				</div>
				<div class="main_cntnt_dv_btm_btm" ng-if="actve_full_tab_dic['k']!='MT'">
					<div class="main_cntnt_dv_btm_btm_lft" ng-class="{ful_100_per: !toggle_btm_ref_flg}" ng-if="cell_eid_avl">
						<div class="grid_div grid_div_doc grid_div_grp" ui-grid="gridOptionsSubGrp" ui-grid-pinning ui-grid-resize-columns style="height:100%;border-top: 0px solid #cadbea;border-left:0px solid #dddfe6;"></div>
                                        </div>
                                        <div class="main_cntnt_dv_btm_btm_rgt" ng-class="{redc_0_per: !toggle_btm_ref_flg, ful_100_per_full: !cell_eid_avl}">
                                                <div class="main_cntnt_dv_btm_btm_rgt_lf" ng-if="cell_eid_avl">
                                                        <div class="toggle_btm_sec_btn_ref waves-effect" ng-click="toggle_btm_ref_btn_func()">
                                                                <i class="fa fa-chevron-left" aria-hidden="true" ng-if="!toggle_btm_ref_flg"></i>
                                                                <i class="fa fa-chevron-right" aria-hidden="true" ng-if="toggle_btm_ref_flg"></i>
                                                        </div>
                                                </div>
                                                <div class="main_cntnt_dv_btm_btm_rgt_rt" ng-class="{ful_100_per_full: !cell_eid_avl}">
							<div ng-if="mn_tbl_pdf_btn_flg != 'db' && mn_tbl_pdf_btn_flg != 'formula'" style="float: left;width: 100%;height: 100%;">
	                                                        <iframe src="{{return_trust(doc_path)}}" class="iframe2" id="iframe2"></iframe>
							</div>
							<div ng-if="mn_tbl_pdf_btn_flg == 'db'" style="float: left;width: 100%;height: 100%;overflow: hidden;">
								 <!--div class="grid_div grid_div_grp" ui-grid="gridOptions" ui-grid-pinning ui-grid-resize-columns ui-grid-group-columns ui-grid-edit></div-->
 								<tasgrid-div config="db_grid"></tasgrid-div>	
							</div>
							<div ng-if="mn_tbl_pdf_btn_flg == 'formula'" style="float: left;width: 100%;height: 100%;overflow: hidden;">
                                                                 <div class="grid_div grid_div_grp" ui-grid="formula_grid" ui-grid-pinning ui-grid-resize-columns ui-grid-group-columns ui-grid-edit></div>
                                                        </div>
                                                </div>
                                        </div>
				</div>
			</div>
		</div>
	</div>
</div>


       <div class="siip" ng-if="ph_csv_config_table_flg_fnl">
	     <div class="siipb" style="width: 800px; height: 300px;">
		<div class="siipbh">
			<div class="popup-close" ng-click="ph_csv_config_table_cls_fnl()">&times;</div>
			<div class="btn btn-sm btn-success waves-effect pull-left" ng-click="ph_clas_config_save_fnl_func()" style="padding: 4px 10px;margin: 4px 5px;">Save</div>
		</div>
		<div class="siipbb">
				<table class="siipbb_t">
					<thead>
						<tr>
							<th class="siipbb_t_th left" ng-click="siipbb_t_th_chck_func('pt', ph_csv_config_chck['pt'])" ng-if="ph_csv_config_shw_dic['pt']">
							    <div class="siipbb_t_th_chck">
								<div class="ui-grid-selection-row-header-buttons ui-grid-icon-ok" ng-class="{'ui-grid-row-selected': ph_csv_config_chck['pt']}" style="user-select: none;">&nbsp;</div>		
							    </div>
							    <div class="siipbb_t_th_txt">Period Type</div>
							</th>
							<th class="siipbb_t_th left" ng-click="siipbb_t_th_chck_func('p', ph_csv_config_chck['p'])" ng-if="ph_csv_config_shw_dic['p']">
							    <div class="siipbb_t_th_chck">
								<div class="ui-grid-selection-row-header-buttons ui-grid-icon-ok" ng-class="{'ui-grid-row-selected': ph_csv_config_chck['p']}" style="user-select: none;">&nbsp;</div>		
							    </div>
							    <div class="siipbb_t_th_txt">Period</div>
							</th>
							<th class="siipbb_t_th left" ng-click="siipbb_t_th_chck_func('vt', ph_csv_config_chck['vt'])" ng-if="ph_csv_config_shw_dic['vt']">
							    <div class="siipbb_t_th_chck">
								<div class="ui-grid-selection-row-header-buttons ui-grid-icon-ok" ng-class="{'ui-grid-row-selected': ph_csv_config_chck['vt']}" style="user-select: none;">&nbsp;</div>		
							    </div>
							    <div class="siipbb_t_th_txt">Value Type</div>
							</th>
							<th class="siipbb_t_th left" ng-click="siipbb_t_th_chck_func('c', ph_csv_config_chck['c'])" ng-if="ph_csv_config_shw_dic['c']">
							    <div class="siipbb_t_th_chck">
								<div class="ui-grid-selection-row-header-buttons ui-grid-icon-ok" ng-class="{'ui-grid-row-selected': ph_csv_config_chck['c']}" style="user-select: none;">&nbsp;</div>		
							    </div>
							    <div class="siipbb_t_th_txt">Currency</div>
							</th>
							<th class="siipbb_t_th left" ng-click="siipbb_t_th_chck_func('s', ph_csv_config_chck['s'])" ng-if="ph_csv_config_shw_dic['s']">
							    <div class="siipbb_t_th_chck">
								<div class="ui-grid-selection-row-header-buttons ui-grid-icon-ok" ng-class="{'ui-grid-row-selected': ph_csv_config_chck['s']}" style="user-select: none;">&nbsp;</div>		
							    </div>
							    <div class="siipbb_t_th_txt">Scale</div>
							</th>
						</tr>
					</thead>
					 <tbody>
						<tr class="lsmt_l_tr_ref">
							<td class="siipbb_t_td" ng-if="ph_csv_config_shw_dic['pt']">
								<select ng-model="ph_csv_config['pt']" class="siipbb_t_td_drp">
									<option ng-repeat="val in period_drp_dwn track by $index" value="{{val['pt']}}">{{val['pt']}}</option>
								</select>
							</td>
							<td class="siipbb_t_td" ng-if="ph_csv_config_shw_dic['p']">
								<select ng-model="ph_csv_config['p']" class="siipbb_t_td_drp">
									<option ng-repeat="val in reporting_drp_dwn track by $index" value="{{val['p']}}">{{val['p']}}</option>
								</select>
							</td>
							<td class="siipbb_t_td" ng-if="ph_csv_config_shw_dic['vt']">
								 <select ng-model="ph_csv_config['vt']" class="siipbb_t_td_drp">
									<option ng-repeat="val in n_type_drp_dwn track by $index" value="{{val['vt']}}">{{val['vt']}}</option>
								</select>
							</td>
							<td class="siipbb_t_td" ng-if="ph_csv_config_shw_dic['c']">
								 <select ng-model="ph_csv_config['c']" class="siipbb_t_td_drp">
									<option ng-repeat="val in currency_drp_dwn track by $index" value="{{val['c']}}">{{val['c']}}</option>
								</select>
							</td>
							<td class="siipbb_t_td" ng-if="ph_csv_config_shw_dic['s']">
								<select ng-model="ph_csv_config['s']" class="siipbb_t_td_drp">
									<option ng-repeat="val in scale_drp_dwn track by $index" value="{{val['s']}}">{{val['s']}}</option>
								</select>
							</td>
						</tr>
					 </tbody>
				</table>
			</div>
		</div>
	</div>
 <script type="text/ng-template" id="ui-grid-header-group-columns.html">
        <div
        role="rowgroup"
        class="ui-grid-header"> <!-- theader -->
          <div
          class="ui-grid-top-panel">
            <div
            class="ui-grid-header-viewport">
              <div
              class="ui-grid-header-canvas">
                <div
                class="ui-grid-header-group"
                ng-class="[
                  group.cssClass,
                  {
                    named: group.name,
                    unnamed: !group.name,
                  }
                ]"
                ng-repeat="group in colContainer.renderedColumnGroups track by $index">
                  <div
                  class="ui-grid-header-group-name ui-grid-cell-contents"
                  ng-if="group.name" ng-click="grid.appScope.filter_table(group.name)" ng-class="{selcted_t:grid.appScope.selected_table[group.name], top_hdr_sec: group.name==' '}" title="{{group.name}}">
                    {{group.name}}
                  </div>
                  <div
                  class="ui-grid-header-cell-wrapper">
                    <div
                    role="row"
                    class="ui-grid-header-cell-row">
                      <div
                      class="ui-grid-header-cell ui-grid-clearfix"
                      ng-class="{
                        'first-in-group': col.isFirstInGroup,
                        'last-in-group': col.isLastInGroup,
                      }"
                      ng-repeat="col in group.columns track by col.uid"
                      ui-grid-header-cell
                      col="col">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </script>

    <script type="text/ng-template" id="ui-grid-row-group-columns.html">
        <div
        ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid"
        ui-grid-one-bind-id-grid="rowRenderIndex + '-' + col.uid + '-cell'"
        class="ui-grid-cell"
        ng-class="{
          'ui-grid-row-header-cell': col.isRowHeader,
          'first-in-group': col.isFirstInGroup,
          'last-in-group': col.isLastInGroup,
        }"
        role="{{col.isRowHeader ? 'rowheader' : 'gridcell'}}"
        ui-grid-cell>
        </div>
    </script>

    <script type="text/ng-template" id="ui-grid-footer-group-columns.html">
        <div
        class="ui-grid-footer-panel ui-grid-footer-aggregates-row"> <!-- tfooter -->
          <div
          class="ui-grid-footer ui-grid-footer-viewport">
            <div
            class="ui-grid-footer-canvas">
              <div
              class="ui-grid-footer-cell-wrapper"
              ng-style="colContainer.headerCellWrapperStyle()">
                <div
                role="row"
                class="ui-grid-footer-cell-row">
                  <div
                  ui-grid-footer-cell
                  role="gridcell"
                  ng-repeat="col in colContainer.renderedColumns track by col.uid"
                  col="col"
                  render-index="$index"
                  ng-class="{
                    'first-in-group': col.isFirstInGroup,
                    'last-in-group': col.isLastInGroup,
                  }"
                  class="ui-grid-footer-cell ui-grid-clearfix">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

    </script>
	<div id="alert_section">
    <div id="alert_box">
            <div class="alert_text"></div>
            <div class="alert_close" ng-click="tas_alert_section_close()">&times;</div>
    </div>
</div>

<div class="prog_bar ng-hide" ng-show="ps">
     <div class="load">
	  <div class="lds-hourglass"></div>
     </div>
</div>


	
	<div class="modal" id="show_popupyu1" ng-class="{'in_open':show_pdfview}" style="z-index:1000000000000;">
                <div class="modal-dialog modal-lg" style="height:100%;overflow: hidden;width:90%;max-width: 90%;">
                    <div class="modal-content" style="height: calc(100% - 60px);overflow: hidden;">
                        <div class="modal-header" style="height:56px;">
                            <span class="modal-title" style="text-transform: uppercase;color: #012a3b;font-weight: bold;font-size: 14px;">Pdf View</span>
                            <button type="button" class="close" data-dismiss="modal" ng-click="show_pdfview_fun()" style="outline: none;">&times;</button>
                        </div>
                        <div class="modal-body" id="graph_view" style="height:calc(100% - 112px);">
                            <iframe style="width:100%;height:100%" src="{{docpath_object}}" id="doc_path_iframe"></iframe>
                        </div>
                        <div class="modal-footer" style="height:56px;">
                            <button type="button" class="btn btn-default btn-sm" data-dismiss="modal" ng-click="show_pdfview_fun()">Close</button>
                        </div>
                    </div>
                </div>
        </div>
	<style>
		.vali_body .main_tab_box{padding-left:0}
		.vali_body .main_tab_menu{font-size:17px;color:#fff;background:#5788b1;width:42px;text-align:center;height:40px;border-right:1px solid #76a3c9}
		.vali_body .fltr_btn{line-height:25px;margin-top:6px;height:28px;padding:0 10px;min-width:40px;margin-left:5px;text-align:center;font-size:12px;border:2px solid rgba(255,255,255,.2);cursor:pointer;user-select:none;color:rgba(255,255,255,.95)}
		.vali_body .fltr_btn:hover{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.25);}
		.vali_body .main_cntnt_sec{float:left;width:100%;height:calc(100% - 40px)}
		.vali_body .main_cntnt_lft{width:300px;float:left;height:100%;border-right:1px solid #dddfe6}
		.vali_body .main_cntnt_rgh{float:left;width:calc(100% - 300px);height:100%}
		.vali_body .main_cntnt_dv{float:left;width:100%;height:100%;overflow:hidden}
		.vali_body .seq_full_span{line-height:35px;float:left;height:34px;width:58px;text-align:center;border-right:1px solid #dfdfdf;cursor:pointer;white-space:nowrap;-ms-text-overflow:ellipsis;-o-text-overflow:ellipsis;text-overflow:ellipsis;overflow:hidden}
		.vali_body .seq_full_span:last-child{border-right:0 solid #dfdfdf}
		.vali_body .hdr_cntr{text-align:center!important;font-weight:500;color:#02223c;background:#fff;font-size:12px;border-color:#e4e4e4}
		.vali_body .hdr_cntr .ui-grid-invisible,.vali_body .hdr_act .ui-grid-invisible{display:none}
		.vali_body .ui-grid-cell-contents:focus{outline:none}
		.vali_body .hdr_cntr input[type="text"].ui-grid-filter-input{border:1px solid #e4e4e4}
		.vali_body .hdr_cntr input[type="text"].ui-grid-filter-input:focus{border:1px solid #42a5f5;outline:none}
		.vali_body .row_col_grid_cell{position:relative;color:#333;padding:0;line-height:35px;padding-left:10px;font-size:12px;font-weight:400;padding-right:3px}
		.vali_body .grid_div_avl .ui-grid-cell,.vali_body .grid_div_avl [ui-grid-group-columns] .ui-grid-cell{overflow:hidden;float:left;background-color:inherit;border:none;border-right:1px solid;border-color:#e4e4e4;border-right:2px solid;border-color:#cacbdb;box-sizing:border-box;border-bottom:1px solid #e4e4e4}
		.vali_body .grid_div_avl .ui-grid-pinned-container.ui-grid-pinned-container-left .ui-grid-header-cell:last-child{box-sizing:border-box;border-right:1px solid;border-width:0;border-right-color:#c3c3c3}
		.vali_body .grid_div_avl .ui-grid-pinned-container.ui-grid-pinned-container-left .ui-grid-cell:last-child{box-sizing:border-box;border-right:2px solid #cacbdb!important;border-width:1px;border-right-color:#d6d6d6}
		.vali_body .grid_div_grp .ui-grid-cell,.vali_body .grid_div_grp [ui-grid-group-columns] .ui-grid-cell{overflow:hidden!important;float:left!important;background-color:inherit!important;border:none;border-right:1px solid!important;border-color:#e4e4e4!important;border-right:1px solid!important;border-color:#cacbdb!important;box-sizing:border-box;border-bottom:1px solid #e4e4e4!important;border-top:0 solid #e0e0e0!important}
		.vali_body .grid_div_grp .ui-grid-pinned-container.ui-grid-pinned-container-left .ui-grid-header-cell:last-child{box-sizing:border-box;border-right:1px solid;border-width:0;border-right-color:#c3c3c3}
		.vali_body .grid_div_grp .ui-grid-pinned-container.ui-grid-pinned-container-left .ui-grid-cell:last-child{box-sizing:border-box;border-right:1px solid #cacbdb!important;border-width:1px;border-right-color:#d6d6d6}
		.vali_body .mn_cell{color:#3f51b5;font-weight:400;color:#012b3b}
		.vali_body .row_col_grid_cell_errr{border-left:8px solid #69719a;margin-left:8px;margin-top:8px;border-radius:4px;position:relative;color:#333;padding:0;line-height:26px;padding-left:14px;font-size:16px;font-weight:400;padding-right:3px;height:54px}
		.vali_body .mn_cell_1{color:#383d58;font-weight:500;white-space:nowrap;-ms-text-overflow:ellipsis;-o-text-overflow:ellipsis;text-overflow:ellipsis;overflow:hidden}
		.vali_body .mn_cell_2{font-size:13px;white-space:nowrap;-ms-text-overflow:ellipsis;-o-text-overflow:ellipsis;text-overflow:ellipsis;overflow:hidden}
		.vali_body .toggle-icon{display:block;position:relative;width:100%;-webkit-transition:margin 600ms;-moz-transition:margin 600ms;transition:margin 600ms;cursor:pointer;margin-top:11px;margin-left:5px}
		.vali_body .toggle-icon .bar{display:block;width:23px;height:3px;margin:5px;border-right:14px solid rgba(255,255,255,1);border-left:4px solid rgba(255,255,255,1);-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;-webkit-transition-property:-webkit-transform,margin,border-right-color,box-shadow;-moz-transition-property:-moz-transform,margin,border-right-color,box-shadow;transition-property:transform,margin,border-right-color,box-shadow;-webkit-transition-duration:600ms;-moz-transition-duration:600ms;transition-duration:600ms}
		.vali_body .toggle-icon .bar:nth-of-type(1){-webkit-transition:opacity 300ms;-moz-transition:opacity 300ms;transition:opacity 300ms}
		.vali_body .toggle-icon .bar:nth-of-type(2){-webkit-transform:rotate(-180deg);-moz-transform:rotate(-180deg);-ms-transform:rotate(-180deg);-o-transform:rotate(-180deg);transform:rotate(-180deg)}
		.vali_body .wdth0{width:0}
		.vali_body .wdth100{width:calc(100% - 2px)}
		.vali_body .avf_flg{background:#ffc107}
		.vali_body .avf_flg_brder{border-left:8px solid #ffc107}
		.vali_body .main_cntnt_dv_tp{float:left;width:100%;height:50%}
		.vali_body .main_cntnt_dv_btm{float:left;width:100%;height:50%}
		.vali_body .main_cntnt_dv_btm_tp{width:100%;height:30px;float:left;background:#c7dcf1}
		.vali_body .main_cntnt_dv_btm_btm{width:100%;height:calc(100% - 30px);float:left}
		.vali_body .toggle_btm_sec_btn{float:left;width:30px;line-height:30px;text-align:center;background:#5687b1;cursor:pointer;color:rgba(255,255,255,1);border-right:1px solid #c7dcf2}
		.vali_body .main_cntnt_dv_tp.incr_height{height:calc(100% - 30px)!important}
		.vali_body .row_col_grid_cell_errr.active{background:#d0d3da}
		.vali_body .grid_div_err .ui-grid-cell,.vali_body .grid_div_err [ui-grid-group-columns] .ui-grid-cell{border-bottom:0 solid #e4e4e4}
		.vali_body .ui-grid-row:nth-child(odd) .ui-grid-cell{background-color:#fff}
		.vali_body .main_cntnt_dv_btm_btm_lft{float:left;width:50%;height:100%}
		.vali_body .main_cntnt_dv_btm_btm_rgt{float:left;width:50%;height:100%}
		.vali_body .main_cntnt_dv_btm_btm_rgt_lf{height:100%;width:15px;float:left;background:#c7dcf1;border:0 solid #414e6a;border-top:0;border-bottom:0;margin-left:2px;position:relative}
		.vali_body .main_cntnt_dv_btm_btm_rgt_rt{float:left;overflow:hidden;width:calc(100% - 17px);height:100%}
		.vali_body .toggle_btm_sec_btn_ref{width:16px;position:absolute;top:0;bottom:0;height:30px;margin:auto;font-size:10px;left:-1px;line-height:30px;text-align:center;background:#5687b1;cursor:pointer;color:rgba(255,255,255,1)}
		.vali_body .main_cntnt_dv_btm_btm_lft.ful_100_per,.vali_body .ful_100_per{width:calc(100% - 17px)}
		.vali_body .ful_100_per_full{width:calc(100% - 0px)!important}
		.vali_body .main_cntnt_dv_btm_btm_rgt.redc_0_per{width:17px}
		.vali_body .kpi_avl_frml_bx{float:right;width:auto}
		.vali_body .row_col_grid_cell_desc.doc_pno_div .title{width:calc(100% - 60px);float:left;white-space:nowrap;-ms-text-overflow:ellipsis;-o-text-overflow:ellipsis;text-overflow:ellipsis;overflow:hidden}
		.vali_body .kpi_avl_frml_inr_bx{text-align:center;float:left;font-size:9px;width:auto;height:20px;background:lightgray;line-height:20px;margin-top:8px;margin-right:2px;color:#000;padding:0 3px;min-width:20px}
		.vali_body .cnt_b{line-height:19px;margin-top:4px;height:23px;padding:0 5px;min-width:40px;background:#e5e5e5;margin-left:5px;text-align:center;font-size:10px;border:2px solid #fff;cursor:pointer;user-select:none}
		.vali_body .cnt_b.active{border:2px solid #000}
		.vali_body .rsts_G{background:#a9f3a9}
		.vali_body .rsts_Y{background:#ffeb3b}
		.vali_body .disable_btn{cursor:not-allowed!important;pointer-events:none;opacity:.5;border-left:1px solid #677188!important}
		.vali_body .header-icon.sec{height:29px;width:auto;text-align:center;line-height:29px;padding:0 10px;color:#fff;background:#5586b1;border-left:1px solid #83b1d5}
		.vali_body .header-icon-sec.sec{text-align:right;width:auto;background:#5586b1;border-left:1px solid #83b1d5;font-size:13px;color:#fff;height:29px}
		.vali_body .header_icon_txt{float:left;width:calc(100% - 15px);text-align:left;font-weight:500;overflow:hidden;white-space:nowrap;-ms-text-overflow:ellipsis;-o-text-overflow:ellipsis;text-overflow:ellipsis}
		.vali_body .header-icon.sec i{font-size:13px;color:rgba(255,255,255,0.7)}
		.vali_body .header-icon.sec span{padding-left:3px;text-transform:none;color:#fff}
		.vali_body .dropdown-item-tas.act{font-weight:700}
		.vali_body .doc_pno_div.active,.vali_body .row_active{background:#d8edff}
		.vali_body .seq_full_span.active{border:2px solid #5485b1;line-height:31px}
		.vali_body .row_col_grid_cell.active{border:2px solid #5485b1;line-height:26px}
		.vali_body .brk_row{background:#eaeaea!important}
		.vali_body .side_nav{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;padding-left:0;margin-bottom:0;list-style:none}
		.vali_body .side_nav > li{position:relative;width:100%}
		.vali_body .side_nav > li.nav-header{margin:0;padding:15px 13px 3px;line-height:20px;font-size:12px;color:#889097;font-weight:600}
		.vali_body .side_nav > li:after,.vali_body .side_nav > li:before,.vali_body .side_nav > li > div:after,.vali_body .side_nav > li > div:before{content:'';clear:both;display:table}
		.vali_body .side_nav > li > div{padding:7px 13px;line-height:20px;color:#414e6a;display:block;text-decoration:none;position:sticky;top:0;z-index:4}
		.vali_body .side_nav > li.active > div{position:relative;z-index:10}
		.vali_body .side_nav .side_sub_menu{list-style-type:none;padding:5px 0 10px 30px;margin:0;position:relative;float:left;width:100%}
		.vali_body .side_nav .side_sub_menu > li{position:relative;float:left;width:100%}
		.vali_body .side_nav .side_sub_menu > li:after,.vali_body .side_nav .side_sub_menu > li:before{position:absolute;content:''}
		.vali_body .side_nav .side_sub_menu > li:before{left:-13px;top:0;bottom:0;width:2px}
		.vali_body .side_nav .side_sub_menu > li.has-sub > div:before,.vali_body .side_nav .side_sub_menu > li:before,.vali_body .side_nav .side_sub_menu > li > div:after{background:#dddfe5}
		.vali_body .side_nav .side_sub_menu > li:first-child:before{top:-14px}
		.vali_body .side_nav .side_sub_menu > li.only_one:first-child:before{top:-13px;height:26px!important}
		.vali_body .side_nav .side_sub_menu.iside_sub > li:first-child:before{top:-18px}
		.vali_body .side_nav .side_sub_menu.iside_sub > li.only_one:first-child:before{height:31px!important}
		.vali_body .side_nav .side_sub_menu > li > div{padding:5px 10px;display:block;color:#777;text-decoration:none;position:relative;cursor:pointer;float:left;width:100%}
		.vali_body .side_nav .side_sub_menu > li.active > div,.vali_body .side_nav .side_sub_menu > li.active > div:focus,.vali_body .side_nav .side_sub_menu > li.active > div:hover,.vali_body .side_nav .side_sub_menu > li > div:focus,.vali_body .side_nav .side_sub_menu > li > div:hover{color:#1bb5b5!important;font-weight:700}
		.vali_body .side_nav .side_sub_menu > li:after{left:0;width:6px;height:6px;border:1px solid #a9acb5;top:11px;border-radius:4px;margin-top:-2px;z-index:3;background:#fff}
		.vali_body .side_nav .side_sub_menu > li.grn:after,.vali_body .side_nav .side_sub_menu > li.G:after{border-color:#20ab59!important;background:#20ab59}
		.vali_body .side_nav .side_sub_menu > li.red:after,.vali_body .side_nav .side_sub_menu > li.R:after{border-color:red!important;background:red}
		.vali_body .side_nav .side_sub_menu > li.org:after,.vali_body .side_nav .side_sub_menu > li.O:after{border-color:orange!important;background:orange}
		.vali_body .side_nav .side_sub_menu > li.active:after{border-color:#00acac}
		.vali_body .side_nav .side_sub_menu > li > div:after{content:'';position:absolute;left:-11px;top:11px;width:11px;height:2px}
		.vali_body .side_nav .side_sub_menu > li:last-child:before{bottom:auto;height:13px}
		.vali_body .float_sub_menu_lft{float:left;margin-right:10px;width:14px;text-align:center;line-height:20px;font-size:14px}
		.vali_body .float_sub_menu_caret{display:block;float:right;width:20px;height:20px;line-height:22px;text-align:center;font-size:11px;border:none;color:#273142;opacity:.5}
		.vali_body .float_sub_menu_txt{float:left;color:#273142;opacity:.7;overflow:hidden;width:calc(100% - 50px);white-space:nowrap;-ms-text-overflow:ellipsis;-o-text-overflow:ellipsis;text-overflow:ellipsis}
		.vali_body .float_main_menu{cursor:pointer}
		.vali_body .float_main_menu:hover .float_sub_menu_txt,.vali_body .float_main_menu:hover .float_sub_menu_caret{opacity:1}
		.vali_body .float_main_menu.active{background:#dddfe5}
		.vali_body .float_main_menu.active .float_sub_menu_caret{opacity:.8}
		.vali_body .actve_tab{color:#05364c!important;font-weight:700;opacity:1}
		.vali_body .float_main_menu.actve_tab .float_sub_menu_caret{opacity:1;color:#05364c!important}
		.vali_body .nt_actve_class{transform:scaleY(0);transform-origin:top;transition:transform .26s ease}
		.vali_body .grp_actve_class{transform:scaleY(1);transform-origin:top;transition:transform .26s ease}
		.vali_body .side_sub_menu_txt_inr{overflow:hidden;white-space:nowrap;-ms-text-overflow:ellipsis;-o-text-overflow:ellipsis;text-overflow:ellipsis;position:relative;line-height:18px;float:left;max-width:calc(100% - 26px);}
		.vali_body .side_nav .side_sub_menu > li > div.side_sub_menu_txt.smenu{color:#427caf}
		.vali_body .row_col_grid_cell.match_active{background:#b6eab6!important}
		.vali_body .row_col_grid_cell.bordr_lft_rgt,.vali_body .bordr_lft_rgt{background:#ffa72d!important}
		.vali_body .mn_tbl_pdf_bx{float:left;width:auto}
		.vali_body .mn_tbl_pdf_btn{float:left;line-height:30px;padding:0 7px}
		.vali_body .mn_tbl_pdf_btn.active{background:#83b1d5;color:#fff}
		.vali_body .side_nav .side_sub_menu.iside_sub{list-style-type:none;padding:5px 0 10px 15px;float:left}
		.vali_body .main_cntnt_dv_tp_innr{float:left;width:100%;height:100%;overflow:auto}
		.vali_body .main_cntnt_dv_tp_innr_lft{width:400px;float:left;height:100%;border-right:1px solid #dddfe6}
		.vali_body .main_cntnt_dv_tp_innr_rgh{width:calc(100% - 400px);float:left;height:100%}
		.vali_body .slcted_item_path{float:left;line-height:40px;padding-left:10px;color:#fcfeff}
		.vali_body .slcted_item_path_1,.vali_body .slcted_item_path_2,.vali_body .slcted_item_path_3{max-width:120px;overflow:hidden;float:left;white-space:nowrap;-ms-text-overflow:ellipsis;-o-text-overflow:ellipsis;text-overflow:ellipsis;overflow:hidden;padding-right:5px}
		.vali_body #graph_view-canvas{max-height:100%!important;max-width:100%!important;width:auto!important;height:auto!important;margin:auto}
		.vali_body .lsmt_l_fft{overflow:auto;height:calc(100% - 0px);float:left;width:100%}
		.vali_body .frml_grp_sec{padding:10px;float:left;position:relative}
		.vali_body .frml_title{line-height:30px;height:30px;background:#ffe5c1;padding-left:10px;border:1px solid #ffdcac}
		.vali_body .graph_canvas_class{max-height:100%!important;max-width:100%!important;width:auto!important;height:auto!important;margin:auto}
		.vali_body .rdc_grp_hgt{height:50%}
		.vali_body .float_sub_menu_ipt{border:1px solid #dadadc;line-height:16px;width:100%;outline:none;padding-left:5px;font-size:12px;background:#f1f1f1}
		.vali_body .cid_ky_prsn{background:#ffffa2}
		.vali_body .hdr_cl_active,.vali_body .seq_full_span.hdr_cl_active{background:#a1eca1!important}
		.vali_body .cel_cl_active,.vali_body .seq_full_span.cel_cl_active{border:2px solid #dc3545!important}
		.vali_body .top_hdr_sec{padding:1px;background:#fea62e}
		.vali_body .fltr_btn.active{border:2px solid #fd9306;background:#ce7a00}
		.vali_body .new_row_full_hglt{background:#fff8bd}
		.vali_body .side_sub_menu_txt_inr_rfr{width:25px;height:auto;text-align:center;background:rgba(199,220,242,0.5);color:#ff3547!important;cursor:pointer;display:none}
		.vali_body .side_sub_menu_txt.smenu:hover .side_sub_menu_txt_inr_rfr{display:block}
		.vali_body .expr_str_cell_done,.vali_body .seq_full_span.expr_str_cell_done{background:#c1f5c1!important}
		.vali_body .d_table_td_ref_span{width:14px;height:14px;background:#2196f3;position:absolute;z-index:1;left:0;bottom:0;display:block;font-size:10px;color:#fff;text-align:center;line-height:14px;display:none;cursor:pointer}
		.vali_body .d_table_td_ref_span.grp{width:15px;height:15px;background:#2bbbad;position:absolute;z-index:1;left:0;top:0;display:block;font-size:8px;color:#fff;text-align:center;line-height:15px;cursor:pointer}
		.vali_body .row_col_grid_cell:hover .d_table_td_ref_span{display:block}
		.vali_body .lc_btn{position:absolute;right:5px;background:#009688;font-size:9px;color:#fff;display:none;top:6px;cursor:pointer;height:18px;width:18px;text-align:center;line-height:18px}
		.vali_body .row_col_grid_cell_desc:hover .lc_btn{display:block!important}
		.vali_body .row_bold{font-weight:700!important;color:#0872c9!important}
		.vali_body .row_col_grid_cell_desc{position:relative;padding:0;line-height:28px;padding-left:8px}
		.vali_body .row_col_grid_cell_desc .title{width:calc(100% - 20px);float:left;white-space:nowrap;-ms-text-overflow:ellipsis;-o-text-overflow:ellipsis;text-overflow:ellipsis;overflow:hidden}
		.vali_body .row_lchange{color:#009688!important;position:relative}
		.vali_body .lsmt_l_fft_heat_left{width:200px;height:calc(100% - 30px);float:left;border-right:2px solid #83b0d5;overflow:auto}
		.vali_body .lsmt_l_fft_heat_map{overflow:hidden;height:auto;float:left;width:calc(100% - 200px)}
		.vali_body .heat_map_tab_left{float:left;padding:10px 5px;width:100%;border-bottom:1px solid #d4dde6;font-weight:700;cursor:pointer;font-size:12px}
		.vali_body .heat_map_lg{width:16px;height:16px;background:#bcbcbc;margin-right:5px;display:inline-block;margin-top:7px;float:left;border-radius:3px}
		.vali_body .heat_map_lg_0{background:#f5ddf9!important}
		.vali_body .heat_map_lg_1{background:#fecb85!important}
		.vali_body .heat_map_lg_2{background:#4dffc9!important}
		.vali_body .heat_map_lg_3{background:#c1f5c1!important}
		.vali_body .heat_map_lg_4{background:#f6de14!important}
		.vali_body .heat_map_lg_5{background:#b0dcff!important}
		.vali_body .heat_map_lg_6{background:#dedede!important}
		.vali_body .heat_map_lg_7{background:#adbaff!important}
		.vali_body .heat_map_lg_8{background:#73f356!important}
		.vali_body .d_table_div_box_btm{width:100%;height:calc(100% - 0px);float:left;overflow:hidden}
		.vali_body .frml_kpi_header{width:100%;height:30px;float:left;background:#d6e4ef;line-height:30px;position:sticky;z-index:4;top:0;cursor:pointer;white-space:nowrap;-ms-text-overflow:ellipsis;-o-text-overflow:ellipsis;text-overflow:ellipsis;overflow:hidden}
		.vali_body .frml_kpi_header_txt{height:100%;float:left;padding-left:10px;width:calc(100% - 50px);overflow:hidden}
		.vali_body .grid_div_frml .ui-grid-render-container-body .ui-grid-viewport,.vali_body .grid_div_frml{height:auto!important}
		.vali_body .d_table_div_frml{height:auto;width:100%;float:left;margin-bottom:20px}
		.vali_body .frml_kpi_header.active{background:#ffcb85;cursor:pointer;color:#000}
		.vali_body .empty_row_clr_bg{background:#eaeaea}
		.vali_body .frml_oprtr_show,.vali_body .row_col_grid_cell.frml_oprtr_show{background:#ffe28b!important}
		.vali_body .row_col_grid_cell.frml_reslt_show,.vali_body .frml_reslt_show,.vali_body .row_col_grid_cell_desc.frml_reslt_show{background:#b4f16a!important}
		.vali_body .chck_sum_err{background:#ffc9c9}
		.vali_body .matched_frml_row,.vali_body .chck_sum_cls{background:#f7eed3}
		.vali_body .data_overlap_red{background:#ffc8c8}
		.vali_body .hdr_grp_clr_1{background:#c5cae9}
		.vali_body .hdr_grp_clr_2{background:#b2ebf2}
		.vali_body .hdr_grp_clr_3{background:#f9d2c4}
		.vali_body .hdr_grp_clr_4{background:#f4dbf9}
		.vali_body .hdr_grp_clr_5{background:#dcdcdc}
		.vali_body .hdr_grp_clr_6{background:#fff27b}
		.vali_body .cslb_tble_grp{float:left;width:calc(100% - 20px);margin:10px;border:2px solid #dedede;overflow:auto}
		.vali_body .cslb_tble{float:left;height:auto;border-collapse:collapse;max-width:calc(100% - 2px);width:auto}
		.vali_body .cslb_tble_th{color:#363c40;text-align:left;padding:0 6px;font-size:12px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;width:100px;position:sticky;top:0;z-index:4;height:30px;background:#f1efef;text-transform:uppercase;line-height:30px;font-weight:700;color:#19486e!important;max-width:100px;min-width:100px}
		.vali_body .cslb_tble_th.sn{width:70px;max-width:70px;min-width:70px}
		.vali_body .cslb_tble_tb_tr:hover,.vali_body .cslb_tble_tb_tr.active{background:#eaf2f9!important;font-weight:700}
		.vali_body .cslb_tble_tb_tr:hover .cslb_tble_td,.vali_body .cslb_tble_tb_tr.active .cslb_tble_td{font-weight:700!important}
		.vali_body .cslb_tble_th:after{content:'';position:absolute;left:0;bottom:0;width:100%;border-bottom:1px solid rgba(0,0,0,0.12)}
		.vali_body .cslb_tble_td{height:37px;color:#2c2c2c;text-align:left;padding:0 9px;line-height:37px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;font-weight:400;font-size:13px;border-right:1px solid #ddd}
		.vali_body .row_col_grid_cell_desc_title{width:calc(100% - 20px);float:left;white-space:nowrap;-ms-text-overflow:ellipsis;-o-text-overflow:ellipsis;text-overflow:ellipsis;overflow:hidden}
		.vali_body .row_col_grid_cell.spke_clr_G,.vali_body .spke_clr_G,.vali_body .mn_grp_sec_G{background:#bef1be!important}
		.vali_body .row_col_grid_cell.spke_clr_O,.vali_body .spke_clr_O,.vali_body .mn_grp_sec_O{background:#ffe3bc!important}
		.vali_body .row_col_grid_cell.spke_clr_R,.vali_body .spke_clr_R,.vali_body .mn_grp_sec_R{background:#ffa3a3!important}
		.vali_body .row_col_grid_cell.spke_clr_R,.vali_body .spke_clr_R{background:#ffa3a3!important;border:2px solid red!important;line-height:31px}
		.vali_body .desc_clr_red{color:#f44336}
		.vali_body .c0{color:#2176b5}
		.vali_body .c1{color:#ff6384}
		.vali_body .c2{color:#f87f0e}
		.vali_body .c3{color:#009485}
		.vali_body .c4{color:#673ab7}
		.vali_body .c5{color:#8085e9}
		.vali_body .c6{color:#8b554b}
		.vali_body .c7{color:#e476c3}
		.vali_body .c8{color:#57acf6}
		.vali_body .c9{color:#ff9f40}
		.vali_body .c10{color:#4bc0c0}
		.vali_body .c11{color:#f44336}
		.vali_body .c12{color:#9c27b0}
		.vali_body .c13{color:#00bcd4}
		.vali_body .c14{color:#4caf50}
		.vali_body .c15{color:#7cb342}
		.vali_body .c16{color:#b1a113}
		.vali_body .c17{color:#9e9e9e}
		.vali_body .c18{color:#c0392b}
		.vali_body .c19{color:#d5a2de}
		.vali_body .c20{color:#5bceba}
		.vali_body .c21{color:#8ed4a1}
		.vali_body .c22{color:#000}
		.vali_body .c23{color:#ec8982}
		.vali_body .c24{color:#8bb4d4}
		.vali_body .c25{color:#f5c2ce}
		.vali_body .c26{color:#90cbc5}
		.vali_body .c27{color:#4bc0c0}
		.vali_body .c28{color:#36a2eb}
		.vali_body .c29{color:#96f}
		.vali_body .c30{color:#e7e9ed}
		.vali_body .c31{color:#2ea02d}
		.vali_body .c32{color:#d62828}
		.vali_body .c33{color:#9466bd}
		.vali_body .hdr_grp_clr_0{background-color:#2176b5}
		.vali_body .hdr_grp_clr_7{background-color:#e476c3}
		.vali_body .hdr_grp_clr_8{background-color:#57acf6}
		.vali_body .hdr_grp_clr_9{background-color:#ff9f40}
		.vali_body .hdr_grp_clr_10{background-color:#4bc0c0}
		.vali_body .hdr_grp_clr_11{background-color:#f44336}
		.vali_body .hdr_grp_clr_12{background-color:#9c27b0}
		.vali_body .hdr_grp_clr_13{background-color:#00bcd4}
		.vali_body .hdr_grp_clr_14{background-color:#4caf50}
		.vali_body .hdr_grp_clr_15{background-color:#7cb342}
		.vali_body .hdr_grp_clr_16{background-color:#b1a113}
		.vali_body .hdr_grp_clr_17{background-color:#9e9e9e}
		.vali_body .hdr_grp_clr_18{background-color:#c0392b}
		.vali_body .hdr_grp_clr_19{background-color:#d5a2de}
		.vali_body .hdr_grp_clr_20{background-color:#5bceba}
		.vali_body .hdr_grp_clr_21{background-color:#8ed4a1}
		.vali_body .hdr_grp_clr_22{background-color:#ece3e3}
		.vali_body .hdr_grp_clr_23{background-color:#ec8982}
		.vali_body .hdr_grp_clr_24{background-color:#8bb4d4}
		.vali_body .hdr_grp_clr_25{background-color:#f5c2ce}
		.vali_body .hdr_grp_clr_26{background-color:#90cbc5}
		.vali_body .hdr_grp_clr_27{background-color:#4bc0c0}
		.vali_body .hdr_grp_clr_28{background-color:#36a2eb}
		.vali_body .hdr_grp_clr_29{background-color:#96f}
		.vali_body .hdr_grp_clr_30{background-color:#e7e9ed}
		.vali_body .hdr_grp_clr_31{background-color:#2ea02d}
		.vali_body .hdr_grp_clr_32{background-color:#d62828}
		.vali_body .hdr_grp_clr_33{background-color:#9466bd}
		.vali_body .hdr_grp_clr_51{background-color:#ffc8c8}
		.vali_body .hdr_grp_clr_52{background-color:#c1f5c1}
		.vali_body .hdr_grp_clr_53{background-color:#ffdc9b}
		.vali_body .modal.in_open{display:block;background:rgba(0,0,0,0.6);z-index:1000000000}
		.vali_body .side_sub_menu_txt_inr:before{content:"";position:absolute;width:10px;height:1px;top:0;right:0;border-bottom:0 solid #fff}
		.vali_body .side_sub_menu_txt_inr.status_flg_A:before{border-bottom:1px solid red}
		.vali_body .side_sub_menu_txt_inr.status_flg_D:before{border-bottom:1px solid green}
		.vali_body .side_sub_menu_txt_inr.status_flg_U:before{border-bottom:1px solid orange}
		.vali_body .d_table_div_box_top_cb{float:left;line-height:19px;width:auto;background:#e1e1e1;margin:4px 5px!important;padding-right:5px;-webkit-box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12);box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12);font-size:10px;border:2px solid #fff!important;cursor:pointer}
		.vali_body .d_table_div_box_top_cb_c{float:left;width:30px;text-align:center}
		.vali_body .d_table_div_box_top_cb_t{float:left;user-select:none;text-transform:uppercase}
		.vali_body .header_icon_txt_tt{display:block;float:left;width:calc(100% - 14px);padding-left:0;text-align:left;color:#000;font-weight:700;text-transform:initial;white-space:nowrap;-ms-text-overflow:ellipsis;-o-text-overflow:ellipsis;text-overflow:ellipsis;overflow:hidden}
		.vali_body .header-icon-sec .header_icon_txt_tt{color:#fff;font-weight:400}
		.vali_body .close-button{width:25px;height:25px;background:inherit;margin:auto}
		.vali_body .close-pop{font-size:20px;color:#fff}
	</style>

`,
         
         controller: 'validation',
                scope: {
                        'config': '='
                },
                link: function (scope, elm, attrs, controller) {
                    scope.init_func('ALL'); 	
                },
}
});

