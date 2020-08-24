var app = angular.module("tas.grid", ['ui.grid.exporter']);

app.controller('GridController', function($scope, $rootScope, $timeout, uiGridConstants, uiGridTreeBaseService) {
    if (!String.format) {
        String.format = function(format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined' ?
                    args[number] :
                    match;
            });
        };
    }
    $scope.gconfig.scope = $scope;
    $scope.gbl_grid_id = 1;
    $scope.grids_data = {
        onRegisterApi: function(gridApi) {
            $scope.grids_data_api = gridApi;
        }
    };
    $scope.get_int_id = function() {
        var ret_res = 'grid_con_' + $scope.gbl_grid_id;
        $scope.gbl_grid_id++;
        return ret_res;
    }
    $scope.init_grid = function(conf) {
        var get_grid_name = conf['grid_id'] == undefined ? $scope.get_int_id() : conf['grid_id'];
        var grids_header_data = $scope.create_grid_header_def(conf.grid_coldef || []);
        var grids_row_data = conf.grid_data || [];

        $scope.grids_data = Object.assign($scope.grids_data, {
            'id': get_grid_name,
            "enableFiltering": true,
            'enableSorting': false,
            'columnDefs': grids_header_data,
            'showTreeExpandNoChildren': false,
            'enableColumnMenus': false,
            'data': grids_row_data,
            'showTreeRowHeader': false,
        });

        if('row_height' in conf){
             $scope.grids_data['rowHeight'] = conf['row_height'];
        }

        $timeout(function() {
            $scope.do_resize();
	    $scope.grids_data_api.core.refresh();
	    $scope.grids_data_api.treeBase.expandAllRows(); 	
        },100)
    }
    $scope.do_resize = function() {
        $timeout(function() {
            try {
                window.dispatchEvent(new Event('resize'));
            } catch (e) {}
        })
    }
    $scope.grid_val_call = function(re, col) {
        var get_ref_vals = $scope.gconfig.grid_map_data[re['cid']+'_'+col.field] || {};
	var get_ref_opt = $scope.gconfig.ref_opt || false;
	var res_cb_data = {'re':re,'col':col,'ref':get_ref_vals,'ref_opt':get_ref_opt}
	$scope.sel_cel_temp = [re['cid'],col.field].join('_');
	$scope.sel_td_rid = re['rid'];
        $scope.gconfig.parent_scope[$scope.gconfig['grid_cb']](res_cb_data);
	
    }
    $scope.create_grid_header_def = function(hdrs) {
        var res_col_def = []
        hdrs.forEach(function(ech_hdr, ech_hdr_idx) {
	    var get_view_opt = ech_hdr['v_opt'] != undefined ? ech_hdr['v_opt'] : -1;
	    switch (get_view_opt) {
  		case 1:
			var htct = String.format(hdr_tree_cell_template, ech_hdr['cls'] || '',ech_hdr['ad'] || '')
			var tree_opt_dict = {
			    'field': String(ech_hdr['k']),
			    'displayName': ech_hdr['n'],
			    'cellTemplate': ech_hdr['ct'] || htct,
			    'enableFiltering': true,
			    'filters': ech_hdr['fc'] || tree_filters,
			    'headerCellTemplate': hdr_tree_template,
			    'minWidth': ech_hdr['mw'] || "300",
			    "width": '*',
			    "enableCellEdit": ech_hdr['ce'] || false,
			    'config_data':ech_hdr,
			    'hdr_ind': ech_hdr_idx,	
			};
			if(ech_hdr['pin'] != undefined)
				tree_opt_dict[ech_hdr['pin']] = true;
			res_col_def.push(tree_opt_dict)
			break;
  		case 2:
			var hfct = String.format(hdr_flag_cell_template, ech_hdr['cls'] || '',ech_hdr['ad'] ||'')
			var flag_opt_dict = {
			    'field': String(ech_hdr['k']),
			    'displayName': ech_hdr['n'],
			    'cellTemplate': hfct,
			    'filters': ech_hdr['fc'] || hdr_flag_filter_condition,
			    'headerCellTemplate': hdr_flag_filter_template,
			    'minWidth': ech_hdr['mw'] || "50",
			     "enableCellEdit": ech_hdr['ce'] || false,
			    'config_data':ech_hdr,
			    'width': '50',
			    'hdr_ind': ech_hdr_idx,	
			};
			if(ech_hdr['pin'] != undefined)
				flag_opt_dict[ech_hdr['pin']] = true;
			res_col_def.push(flag_opt_dict)
			break;
  		case 3:
			var hct = ech_hdr['ct'];
                        var head_tmpl = ech_hdr['ht'] || checkBoxHeaderTemplate;
			def_opt_dict	= {
			   "field": "#",
			   "displayName": "#",
			   "width": 30,
			   "pinnedLeft": true,
			   "cellEditableCondition":false,
			   "headerCellTemplate": head_tmpl,
			   "cellTemplate": hct || checkBoxCellTemplate, 
			}
			if (ech_hdr['mw'])
			    def_opt_dict['minWidth']	= ech_hdr['mw']
			res_col_def.push(def_opt_dict)
			break
  		 default:
			var hct = ech_hdr['ct'] != undefined ? ech_hdr['ct'] : String.format(hdr_cell_template, ech_hdr['cls'] || '',ech_hdr['ad'] ||'');
			var wid_asgn = ((ech_hdr['type'] || "") == "SL") ? "55" :  (ech_hdr['w'] != undefined)? ech_hdr['w'] :  "*";
			//var wid_asgn = "*";
			var def_opt_dict = {
			    'field': String(ech_hdr['k']),
			    'displayName': ech_hdr['n'],
			    'cellTemplate': hct,
			    "enableFiltering":true,
			    "enableCellEdit": ech_hdr['ce'] || false,
			    'filters': angular.copy(ech_hdr['fc'] || def_filter),
			    'config_data': angular.copy(ech_hdr),
			    "width": wid_asgn,
			    'hdr_ind': String(ech_hdr_idx),	
			}
			if (ech_hdr['mw'])
			    def_opt_dict['minWidth']	= ech_hdr['mw']
			if('ht' in ech_hdr){
				def_opt_dict['headerCellTemplate']= ech_hdr['ht'];
			}
			if(ech_hdr['pin'] != undefined)
				def_opt_dict[ech_hdr['pin']] = true;
			res_col_def.push(def_opt_dict)
            }
        });
        return res_col_def;
    }
    $scope.obj_key = function (obj){
	//console.log('obj',obj);
	return Object.keys(obj)
    }
    $scope.collspase_grid = function(row, evt) {
        uiGridTreeBaseService.toggleRowTreeState($scope.grids_data_api.grid, row, evt)
    }
    $scope.expandAllFunc = function(flg) {
        if (!flg)
            $scope.grids_data_api.treeBase.expandAllRows();
        else
            $scope.grids_data_api.treeBase.collapseAllRows();
    }
    var hdr_flag_filter_condition = [{
        selectOptions: [{
            value: '',
            'label': 'ALL'
        }, {
            value: 'G',
            label: "Green"
        }, {
            value: 'R',
            label: 'Red'
        }, {
            value: 'GR',
            label: 'Gray'
        }, {
            value: 'P',
            label: 'Purple'
        }, {
            value: 'O',
            label: 'Orange'
        }, {
            value: 'B',
            label: 'Blue'
        }],
        type: uiGridConstants.filter.SELECT,
	condition: function(term, value, row, column){return term == value['v'];}
    }];
    var tree_filters = [
        {noTerm: true,
	 condition: function(term, value, row, column){
                   if(!term)
                      return true
                   var srhed_val = (term.toLowerCase()).replace(/\\/g,'')
                   var rwdata = (value['v']||'').toLowerCase();
                   return (rwdata.indexOf(srhed_val) != -1)
             }
        }];

    var def_filter = [
        {noTerm: true,
	 condition: function(term, value, row, column){
                   if(!term)
                      return true
                   var srhed_val = (term.toLowerCase()).replace(/\\/g,'')
                   var rwdata = String((value||{})['v'] || "").toLowerCase();
                   return (rwdata.indexOf(srhed_val) != -1)
             }
        }];
    $scope.range_arr = function (val){
        var get_arr_rang = Array.apply(null, Array(Number(val))).map(function (_, i) {return i;});
        return get_arr_rang
    }

    $scope.check_parent = function (val){
        var get_cur_tl  = ($scope.grids_data['data'][val-1]|| {})['$$treeLevel'] || 0;
        var get_prev_tl = ($scope.grids_data['data'][val-2]|| {})['$$treeLevel'] || 0;
        var get_next_tl  = ($scope.grids_data['data'][val]|| {})['$$treeLevel'] || 0;
        if(get_cur_tl > get_prev_tl)
            return 1
        else if(get_cur_tl < get_next_tl)
            return 1
        return 0
    }
    /**********************************************/
     $scope.gridCheck = function(obj,allCheck){
          var flg ="Y";
          if("checked" in obj && obj['checked'] == "Y"){
                flg = "N";
          }
          obj['checked'] = flg;

     }
    /**********************************************/
     $scope.checkedAll = "N";
     $scope.gridCheckAll = function(flg){
          var chFlg = "N";
          var Rows = $scope.grids_data_api.core.getVisibleRows($scope.grids_data_api.grid);
          if(flg == "N"){
              chFlg = "Y";
          }
          Rows.forEach(function(r){
                r.entity['checked'] = chFlg;
          });
          $scope.checkedAll = chFlg; 
     }
    /**********************************************/
    /**********************************************/

    var checkBoxHeaderTemplate = "<div class=\"ui-grid-header-cell\" style=\"border-right: none;\"> <div class=\"ui-grid-cell-contents\" style=\"padding: 0px; cursor: pointer;text-align: unset !important;width: 30px;\"  ng-click=\"grid.appScope.gridCheckAll(grid.appScope.checkedAll)\"><div class=\"checkBox\" style=\"margin-top: 10px;\"><span ng-if=\"grid.appScope.checkedAll == 'N'\"><svg viewBox=\"0 0 50 50\"><path d=\"M 39 4 L 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 11 C 46 7.101563 42.898438 4 39 4 Z M 42 39 C 42 40.699219 40.699219 42 39 42 L 11 42 C 9.300781 42 8 40.699219 8 39 L 8 11 C 8 9.300781 9.300781 8 11 8 L 39 8 C 40.699219 8 42 9.300781 42 11 Z\"></path></svg></span><span ng-if=\"grid.appScope.checkedAll == 'Y' \"><svg viewBox=\"0 0 24 24\" fill=\"#33b5e5\"><path d=\"M 5 3 C 3.897 3 3 3.897 3 5 L 3 19 C 3 20.103 3.897 21 5 21 L 19 21 C 20.103 21 21 20.103 21 19 L 21 9.2421875 L 19 11.242188 L 19.001953 19 L 5 19 L 5 5 L 16.757812 5 L 18.757812 3 L 5 3 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z\"></path></svg></span></div></div></div>";

    var checkBoxCellTemplate = "<div class=\"ui-grid-cell-contents\" style=\"padding: 0px; cursor: pointer;\" ng-click=\"grid.appScope.gridCheck(row.entity)\"><div class=\"checkBox\" ng-if=\"row.entity.hide != 'Y'\"><span ng-if=\"row.entity.checked != 'Y' \"><svg viewBox=\"0 0 50 50\"><path d=\"M 39 4 L 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 11 C 46 7.101563 42.898438 4 39 4 Z M 42 39 C 42 40.699219 40.699219 42 39 42 L 11 42 C 9.300781 42 8 40.699219 8 39 L 8 11 C 8 9.300781 9.300781 8 11 8 L 39 8 C 40.699219 8 42 9.300781 42 11 Z\"></path></svg></span><span ng-if=\" row.entity.checked == 'Y' \"><svg viewBox=\"0 0 24 24\" fill=\"#33b5e5\"><path d=\"M 5 3 C 3.897 3 3 3.897 3 5 L 3 19 C 3 20.103 3.897 21 5 21 L 19 21 C 20.103 21 21 20.103 21 19 L 21 9.2421875 L 19 11.242188 L 19.001953 19 L 5 19 L 5 5 L 16.757812 5 L 18.757812 3 L 5 3 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z\"></path></svg></span></div></div>";
 
    var hdr_cell_template = "<div class=\"ui-grid-cell-contents grid-cell-text {0}\" ng-class=\"{'act_row':row.entity['cid'] == grid.appScope.gconfig['cid'] ,'act_cell':(row.entity['cid']+'_'+ col.field) == grid.appScope.gconfig['uid']}\"  ng-click=\"grid.appScope.grid_val_call(row.entity,col)\" title=\"{{COL_FIELD['v']}}\"><span class=\"cell_leaf_value\" ng-bind-html=\"COL_FIELD['v']\" ></span>{1}</div>";

    var hdr_tree_template = '<div ng-class="{ \'sortable\': sortable }" role="columnheader">' +
        '<div style="font-size: 12px;color: #000 !important;float: left;color: #000;cursor: pointer;width: 29px;height: 100%;text-align: center;padding-left: 4px;height:100%;line-height: 43px;border: none;" ng-click="grid.appScope.expandAllFunc(grid.treeBase.expandAll)" ng-if="grid.options.enableExpandAll">' +
        '<i  ng-class="{\'fa fa-minus\': grid.treeBase.numberLevels > 0 && grid.treeBase.expandAll, \'fa fa-plus\': grid.treeBase.numberLevels > 0 && !grid.treeBase.expandAll}" style="color:#000;font-size:10px;"></i> &nbsp;' +
        '</div>' +
        '<div role="button" tabindex="0" ng-keydown="handleKeyDown($event)" class="ui-grid-cell-contents ui-grid-header-cell-primary-focus" col-index="renderIndex" style="border-left: 1px solid #ddd;">' +
        '<span class="ui-grid-header-cell-label ng-binding" ui-grid-one-bind-id-grid="col.uid + \'-header-text\'">{{col.displayName}}</span>' +
        //'</div>' +
        '<div show="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters" style="padding:1px 10px;">' +
        '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term"/>' +
        '<div class="ui-grid-filter-button" ng-click="colFilter.term = null">' +
        '<i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i>' +
        '</div></div>' +
        '</div>' +
        '</div>'
    var hdr_tree_cell_template = "<div class=\"ui-grid-cell-contents without_padding {0}\" tmp2=\"{{$index}}\"   ng-class=\"{'act_row': row.entity['cid'] == grid.appScope.gconfig['cid'], 'act_cell':(row.entity['cid']+'_'+ col.field) == grid.appScope.gconfig['uid']}\"><div class=\"open_close\" ng-repeat=\"vt in  grid.appScope.range_arr(row['entity']['$$treeLevel']+1) track by $index\" >" +
        "<span ng-if=\"($last && (row.treeNode.children.length > 0))\" ng-click=\"grid.appScope.collspase_grid(row,$event);$event.stopPropagation();\" ng-class=\"{'fa fa-minus': ( ( grid.options.showTreeExpandNoChildren && row.treeLevel > -1 ) || ( row.treeNode.children && row.treeNode.children.length > 0 ) ) && row.treeNode.state === 'expanded', 'fa fa-plus': ( ( grid.options.showTreeExpandNoChildren && row.treeLevel > -1 ) || ( row.treeNode.children && row.treeNode.children.length > 0 ) ) && row.treeNode.state === 'collapsed'}\" style=\"color: #000;\"></span>" +
        "</div><div title=\"{{COL_FIELD['v']}}\" class=\"flo_lef\" level=\"{{row.entity['$$treeLevel']}}\" style=\"width:calc(100% - {{(row['entity']['$$treeLevel']+1)*30}}px)\" ng-click=\"grid.appScope.grid_val_call(row['entity'],col)\"> <span class=\"tree_leaf\"ng-bind-html=\"COL_FIELD['v']\"></span>{1}</div>" +
        "</div>";
    var hdr_flag_cell_template = "<div class=\"ui-grid-cell-contents flag_cell\" ng-class=\"{0}\" ng-click=\"grid.appScope.grid_val_call(row['entity'],col)\" >" +
        "<div title=\"{{COL_FIELD['v']}}\" class=\"avoid_20s\" ng-if=\"COL_FIELD\" ><span  class=\"legnd_icon icon_{{COL_FIELD['v']}}\"></span>{1}</div>" +
        "</div>";
    var hdr_flag_filter_template = '<div role="columnheader" ng-class="{ \'sortable\': sortable }">' +
        '<div class=\'cus_header_dv\'>' +
        '<div role="button" tabindex="0" ng-keydown="handleKeyDown($event)" class="ui-grid-cell-contents ui-grid-header-cell-primary-focus" col-index="renderIndex">' +
        '<span class="ui-grid-header-cell-label ng-binding" ui-grid-one-bind-id-grid="col.uid + \'-header-text\'">{{col.displayName}}</span>' +
        '</div>' +
        '<div class="ui-grid-filter-container" ng-style="col.extraStyle" ng-repeat="colFilter in col.filters" ng-class="{\'ui-grid-filter-cancel-button-hidden\' : colFilter.disableCancelFilterButton === true }"><div ng-if="colFilter.type !== \'select\'"><input type="text" class="ui-grid-filter-input ui-grid-filter-input-{{$index}}" ng-model="colFilter.term" ng-attr-placeholder="{{colFilter.placeholder || \'\'}}" aria-label="{{colFilter.ariaLabel || aria.defaultFilterLabel}}"><div role="button" class="ui-grid-filter-button" ng-click="removeFilter(colFilter, $index)" ng-if="!colFilter.disableCancelFilterButton" ng-disabled="colFilter.term === undefined || colFilter.term === null || colFilter.term === \'\'" ng-show="colFilter.term !== undefined && colFilter.term !== null && colFilter.term !== \'\'"><i class="ui-grid-icon-cancel" ui-grid-one-bind-aria-label="aria.removeFilter">&nbsp;</i></div></div><div ng-if="colFilter.type === \'select\'"><button class="btn btn-outline-primary dropdown-toggle btn-sm" type="button" data-toggle="dropdown" title="{{colFilter.term||\'\'}}" aria-haspopup="true" aria-expanded="false">' +
        '<span ng-show="!colFilter.term">All</span>' +
        '<span class="legnd_icon icon_G slct_icon" ng-show="colFilter.term == \'G\'"></span>' +
        '<span class="legnd_icon icon_O slct_icon" ng-show="colFilter.term == \'O\'"></span>' +
        '<span class="legnd_icon icon_R slct_icon" ng-show="colFilter.term == \'R\'"></span>' +
        '<span class="legnd_icon icon_B slct_icon" ng-show="colFilter.term == \'B\'"></span>' +
        '<span class="legnd_icon icon_P slct_icon" ng-show="colFilter.term == \'P\'"></span>' +
        '<span class="legnd_icon icon_GR slct_icon" ng-show="colFilter.term == \'GR\'"></span>' +
        '</button>' +
        '<div class="dropdown-menu legend_drop"><a class="dropdown-item" ng-repeat="option in colFilter.selectOptions" ng-click="colFilter.term = option.value" title="{{option.label}}" >' +
        '<span ng-show="option.value ==\'\'">All</span>' +
        '<span class="legnd_icon icon_G" ng-show="(option.value == \'G\')"></span>' +
        '<span class="legnd_icon icon_O" ng-show="(option.value == \'O\')"></span>' +
        '<span class="legnd_icon icon_R" ng-show="(option.value == \'R\')"></span>' +
        '<span class="legnd_icon icon_B" ng-show="(option.value == \'B\')"></span>' +
        '<span class="legnd_icon icon_P" ng-show="(option.value == \'P\')"></span>' +
        '<span class="legnd_icon icon_GR" ng-show="(option.value == \'GR\')"></span>' +
        '</a></div></div></div>' +

        '</div>' +
        '</div>';
	$scope.uigrid_load_css = "#ui-grid-twbs #ui-grid-twbs .form-horizontal .form-group:before,#ui-grid-twbs #ui-grid-twbs .form-horizontal .form-group:after,#ui-grid-twbs #ui-grid-twbs .btn-toolbar:before,#ui-grid-twbs #ui-grid-twbs .btn-toolbar:after,#ui-grid-twbs #ui-grid-twbs .btn-group-vertical>.btn-group:before,#ui-grid-twbs #ui-grid-twbs .btn-group-vertical>.btn-group:after {content: ' ';display: table;} #ui-grid-twbs #ui-grid-twbs .form-horizontal .form-group:after, #ui-grid-twbs #ui-grid-twbs .btn-toolbar:after, #ui-grid-twbs #ui-grid-twbs .btn-group-vertical>.btn-group:after { clear: both; } .ui-grid { box-sizing: content-box; -webkit-border-radius: 0px; -moz-border-radius: 0px; border-radius: 0px; -webkit-transform: translateZ(0); -moz-transform: translateZ(0); -o-transform: translateZ(0); -ms-transform: translateZ(0); transform: translateZ(0); border: 1px solid #d4d4d4;} .ui-grid-vertical-bar { position: absolute; right: 0; width: 0; } .ui-grid-header-cell:not(:last-child) .ui-grid-vertical-bar, .ui-grid-cell:not(:last-child) .ui-grid-vertical-bar { width: 1px; } .ui-grid-scrollbar-placeholder { background-color: transparent; } .ui-grid-header-cell:not(:last-child) .ui-grid-vertical-bar { background-color: #d4d4d4; } .ui-grid-cell:not(:last-child) .ui-grid-vertical-bar { background-color: #d4d4d4; } .ui-grid-header-cell:last-child .ui-grid-vertical-bar { right: -1px; width: 1px; background-color: #d4d4d4; } .ui-grid-clearfix:before, .ui-grid-clearfix:after { content: ''; display: table; } .ui-grid-clearfix:after { clear: both; } .ui-grid-invisible { visibility: hidden; } .ui-grid-contents-wrapper { position: relative; height: 100%; width: 100%; } .ui-grid-sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0; } .ui-grid-icon-button { background-color: transparent; border: none; padding: 0; } .ui-grid-top-panel-background { background-color: #ffffff; } .ui-grid-header { box-sizing: border-box;border-bottom: 1px solid #d4d4d4;} .ui-grid-top-panel { position: relative; overflow: hidden; font-weight: bold; background-color: #ffffff; -webkit-border-top-right-radius: -1px; -webkit-border-bottom-right-radius: 0; -webkit-border-bottom-left-radius: 0; -webkit-border-top-left-radius: -1px; -moz-border-radius-topright: -1px; -moz-border-radius-bottomright: 0; -moz-border-radius-bottomleft: 0; -moz-border-radius-topleft: -1px; border-top-right-radius: -1px; border-bottom-right-radius: 0; border-bottom-left-radius: 0; border-top-left-radius: -1px; -moz-background-clip: padding-box; -webkit-background-clip: padding-box; background-clip: padding-box; } .ui-grid-header-viewport { overflow: hidden; } .ui-grid-header-canvas:before, .ui-grid-header-canvas:after { content: ''; display: table; line-height: 0; } .ui-grid-header-canvas:after { clear: both; } .ui-grid-header-cell-wrapper { position: relative; display: table; box-sizing: border-box; height: 100%; } .ui-grid-header-cell-row { display: table-row; } .ui-grid-header-cell { position: relative; box-sizing: border-box; background-color: inherit; border-right: 1px solid; border-color: #d9dee1; display: table-cell; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; width: 0; } .ui-grid-header-cell:last-child { border-right: 0; } .ui-grid-header-cell .sortable { cursor: pointer; } .ui-grid-header-cell .ui-grid-sort-priority-number { margin-left: -8px; } .ui-grid-header .ui-grid-vertical-bar { top: 0; bottom: 0; } .ui-grid-column-menu-button { position: absolute; right: 1px; top: 0; } .ui-grid-column-menu-button .ui-grid-icon-angle-down { vertical-align: sub; } .ui-grid-header-cell-last-col .ui-grid-cell-contents, .ui-grid-header-cell-last-col .ui-grid-filter-container, .ui-grid-header-cell-last-col .ui-grid-column-menu-button, .ui-grid-header-cell-last-col+.ui-grid-column-resizer.right { margin-right: 13px; } .ui-grid-render-container-right .ui-grid-header-cell-last-col .ui-grid-cell-contents, .ui-grid-render-container-right .ui-grid-header-cell-last-col .ui-grid-filter-container, .ui-grid-render-container-right .ui-grid-header-cell-last-col .ui-grid-column-menu-button, .ui-grid-render-container-right .ui-grid-header-cell-last-col+.ui-grid-column-resizer.right { margin-right: 28px; } .ui-grid-column-menu { position: absolute; } .ui-grid-column-menu .ui-grid-menu .ui-grid-menu-mid.ng-hide-add, .ui-grid-column-menu .ui-grid-menu .ui-grid-menu-mid.ng-hide-remove { -webkit-transition: all 0.04s linear; -moz-transition: all 0.04s linear; -o-transition: all 0.04s linear; transition: all 0.04s linear; display: block !important; } .ui-grid-column-menu .ui-grid-menu .ui-grid-menu-mid.ng-hide-add.ng-hide-add-active, .ui-grid-column-menu .ui-grid-menu .ui-grid-menu-mid.ng-hide-remove { -webkit-transform: translateY(-100%); -moz-transform: translateY(-100%); -o-transform: translateY(-100%); -ms-transform: translateY(-100%); transform: translateY(-100%); } .ui-grid-column-menu .ui-grid-menu .ui-grid-menu-mid.ng-hide-add, .ui-grid-column-menu .ui-grid-menu .ui-grid-menu-mid.ng-hide-remove.ng-hide-remove-active { -webkit-transform: translateY(0); -moz-transform: translateY(0); -o-transform: translateY(0); -ms-transform: translateY(0); transform: translateY(0); } .ui-grid-menu-button .ui-grid-menu .ui-grid-menu-mid.ng-hide-add, .ui-grid-menu-button .ui-grid-menu .ui-grid-menu-mid.ng-hide-remove { -webkit-transition: all 0.04s linear; -moz-transition: all 0.04s linear; -o-transition: all 0.04s linear; transition: all 0.04s linear; display: block !important; } .ui-grid-menu-button .ui-grid-menu .ui-grid-menu-mid.ng-hide-add.ng-hide-add-active, .ui-grid-menu-button .ui-grid-menu .ui-grid-menu-mid.ng-hide-remove { -webkit-transform: translateY(-100%); -moz-transform: translateY(-100%); -o-transform: translateY(-100%); -ms-transform: translateY(-100%); transform: translateY(-100%); } .ui-grid-menu-button .ui-grid-menu .ui-grid-menu-mid.ng-hide-add, .ui-grid-menu-button .ui-grid-menu .ui-grid-menu-mid.ng-hide-remove.ng-hide-remove-active { -webkit-transform: translateY(0); -moz-transform: translateY(0); -o-transform: translateY(0); -ms-transform: translateY(0); transform: translateY(0); } .ui-grid-filter-container { position: relative; text-align: center; } .ui-grid-filter-container .ui-grid-filter-button { position: absolute; top: 0; bottom: 0; right: 0; } .ui-grid-filter-container .ui-grid-filter-button [class^='ui-grid-icon'] { display: none;position: absolute; top: 50%; line-height: 32px; margin-top: -16px; right: 10px; opacity: 0.66; } .ui-grid-filter-container .ui-grid-filter-button [class^='ui-grid-icon']:hover { opacity: 1; } .ui-grid-filter-container .ui-grid-filter-button-select { position: absolute; top: 0; bottom: 0; right: 0; } .ui-grid-filter-container .ui-grid-filter-button-select [class^='ui-grid-icon'] { position: absolute; top: 50%; line-height: 32px; margin-top: -16px; right: 0px; opacity: 0.66; } .ui-grid-filter-container .ui-grid-filter-button-select [class^='ui-grid-icon']:hover { opacity: 1; } input[type='text'].ui-grid-filter-input { box-sizing: border-box; padding: 0 18px 0 0; margin: 0; border: 0; width: 100%; border: 1px solid #d4d4d4; -webkit-border-top-right-radius: 0px; -webkit-border-bottom-right-radius: 0; -webkit-border-bottom-left-radius: 0; -webkit-border-top-left-radius: 0; -moz-border-radius-topright: 0px; -moz-border-radius-bottomright: 0; -moz-border-radius-bottomleft: 0; -moz-border-radius-topleft: 0; border-top-right-radius: 0px; border-bottom-right-radius: 0; border-bottom-left-radius: 0; border-top-left-radius: 0; -moz-background-clip: padding-box; -webkit-background-clip: padding-box; background-clip: padding-box; } input[type='text'].ui-grid-filter-input:hover { border: 1px solid #d4d4d4; } select.ui-grid-filter-select { padding: 0; margin: 0; border: 0; width: 90%; border: 1px solid #d4d4d4; -webkit-border-top-right-radius: 0px; -webkit-border-bottom-right-radius: 0; -webkit-border-bottom-left-radius: 0; -webkit-border-top-left-radius: 0; -moz-border-radius-topright: 0px; -moz-border-radius-bottomright: 0; -moz-border-radius-bottomleft: 0; -moz-border-radius-topleft: 0; border-top-right-radius: 0px; border-bottom-right-radius: 0; border-bottom-left-radius: 0; border-top-left-radius: 0; -moz-background-clip: padding-box; -webkit-background-clip: padding-box; background-clip: padding-box; } select.ui-grid-filter-select:hover { border: 1px solid #d4d4d4; } .ui-grid-filter-cancel-button-hidden select.ui-grid-filter-select { width: 100%; } .ui-grid-render-container { position: inherit; -webkit-border-top-right-radius: 0; -webkit-border-bottom-right-radius: 0px; -webkit-border-bottom-left-radius: 0px; -webkit-border-top-left-radius: 0; -moz-border-radius-topright: 0; -moz-border-radius-bottomright: 0px; -moz-border-radius-bottomleft: 0px; -moz-border-radius-topleft: 0; border-top-right-radius: 0; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; border-top-left-radius: 0; -moz-background-clip: padding-box; -webkit-background-clip: padding-box; background-clip: padding-box; } .ui-grid-render-container:focus { outline: none; } .ui-grid-viewport { min-height: 20px; position: relative; overflow-y: scroll; -webkit-overflow-scrolling: touch; } .ui-grid-viewport:focus { outline: none !important; } .ui-grid-canvas { position: relative; padding-top: 1px; } .ui-grid-row { clear: both; } .ui-grid-row:nth-child(odd) .ui-grid-cell { background-color: #fdfdfd; } .ui-grid-row:nth-child(even) .ui-grid-cell { background-color: #f3f3f3; } .ui-grid-row:last-child .ui-grid-cell { border-bottom-color: #d4d4d4; border-bottom-style: solid; } .ui-grid-no-row-overlay { position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: 10%; background-color: #f3f3f3; -webkit-border-top-right-radius: 0px; -webkit-border-bottom-right-radius: 0; -webkit-border-bottom-left-radius: 0; -webkit-border-top-left-radius: 0; -moz-border-radius-topright: 0px; -moz-border-radius-bottomright: 0; -moz-border-radius-bottomleft: 0; -moz-border-radius-topleft: 0; border-top-right-radius: 0px; border-bottom-right-radius: 0; border-bottom-left-radius: 0; border-top-left-radius: 0; -moz-background-clip: padding-box; -webkit-background-clip: padding-box; background-clip: padding-box; border: 1px solid #d4d4d4; font-size: 2em; text-align: center; } .ui-grid-no-row-overlay>* { position: absolute; display: table; margin: auto 0; width: 100%; top: 0; bottom: 0; left: 0; right: 0; opacity: 0.66; } .ui-grid-cell { overflow: hidden; float: left; background-color: inherit; border-right: 1px solid; border-color: #d4d4d4; box-sizing: border-box;} .ui-grid-cell:last-child { border-right: 0; } .ui-grid-cell-contents { height: 100%; line-height: 22px !important; text-overflow: ellipsis !important; padding: 5px 7px; color: #616161; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; white-space: nowrap; -ms-text-overflow: ellipsis; -o-text-overflow: ellipsis; overflow: hidden;} .ui-grid-cell-contents-hidden { visibility: hidden; width: 0; height: 0; display: none; } .ui-grid-row .ui-grid-cell.ui-grid-row-header-cell { background-color: #f0f0ee; border-bottom: solid 1px #d4d4d4; } .ui-grid-cell-empty { display: inline-block; width: 10px; height: 10px; } .ui-grid-footer-info { padding: 5px 10px; } .ui-grid-footer-panel-background { background-color: #f3f3f3; } .ui-grid-footer-panel { position: relative; border-bottom: 1px solid #d4d4d4; border-top: 1px solid #d4d4d4; overflow: hidden; font-weight: bold; background-color: #f3f3f3; -webkit-border-top-right-radius: -1px; -webkit-border-bottom-right-radius: 0; -webkit-border-bottom-left-radius: 0; -webkit-border-top-left-radius: -1px; -moz-border-radius-topright: -1px; -moz-border-radius-bottomright: 0; -moz-border-radius-bottomleft: 0; -moz-border-radius-topleft: -1px; border-top-right-radius: -1px; border-bottom-right-radius: 0; border-bottom-left-radius: 0; border-top-left-radius: -1px; -moz-background-clip: padding-box; -webkit-background-clip: padding-box; background-clip: padding-box; } .ui-grid-grid-footer { float: left; width: 100%; } .ui-grid-footer-viewport, .ui-grid-footer-canvas { display: flex; flex-direction: column; flex: 1 1 auto; height: 100%; } .ui-grid-footer-viewport { overflow: hidden; } .ui-grid-footer-canvas { position: relative; } .ui-grid-footer-canvas:before, .ui-grid-footer-canvas:after { content: ''; display: table; line-height: 0; } .ui-grid-footer-canvas:after { clear: both; } .ui-grid-footer-cell-wrapper { position: relative; display: table; box-sizing: border-box; height: 100%; } .ui-grid-footer-cell-row { display: table-row; } .ui-grid-footer-cell { overflow: hidden; background-color: inherit; border-right: 1px solid; border-color: #d4d4d4; box-sizing: border-box; display: table-cell; } .ui-grid-footer-cell:last-child { border-right: 0; } .ui-grid-menu-button { z-index: 2; position: absolute; right: 0; top: 0; background: #f3f3f3; border: 0; border-left: 1px solid #d4d4d4; border-bottom: 1px solid #d4d4d4; cursor: pointer; height: 32px; font-weight: normal; } .ui-grid-menu-button .ui-grid-icon-container { margin-top: 5px; margin-left: 2px; } .ui-grid-menu-button .ui-grid-menu { right: 0; } .ui-grid-menu-button .ui-grid-menu .ui-grid-menu-mid { overflow: scroll; } .ui-grid-menu { overflow: hidden; max-width: 320px; z-index: 2; position: absolute; right: 100%; padding: 0 10px 20px 10px; cursor: pointer; box-sizing: border-box; } .ui-grid-menu-item { width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .ui-grid-menu .ui-grid-menu-inner { background: #ffffff; border: 1px solid #d4d4d4; position: relative; white-space: nowrap; -webkit-border-radius: 0px; -moz-border-radius: 0px; border-radius: 0px; } .ui-grid-menu .ui-grid-menu-inner ul { margin: 0; padding: 0; list-style-type: none; } .ui-grid-menu .ui-grid-menu-inner ul li { padding: 0px; } .ui-grid-menu .ui-grid-menu-inner ul li button { color: #000000; min-width: 100%; padding: 8px; text-align: left; background: transparent; border: none; } .ui-grid-menu .ui-grid-menu-inner ul li button:hover, .ui-grid-menu .ui-grid-menu-inner ul li button:focus { background-color: #b3c4c7; } .ui-grid-menu .ui-grid-menu-inner ul li button.ui-grid-menu-item-active { background-color: #9cb2b6; } .ui-grid-menu .ui-grid-menu-inner ul li:not(:last-child)>button { border-bottom: 1px solid #d4d4d4; } .ui-grid-sortarrow { right: 5px; position: absolute; width: 20px; top: 0; bottom: 0; background-position: center; } .ui-grid-sortarrow.down { -webkit-transform: rotate(180deg); -moz-transform: rotate(180deg); -o-transform: rotate(180deg); -ms-transform: rotate(180deg); transform: rotate(180deg); } @font-face { font-family: 'ui-grid'; src: url('ui-grid.eot'); src: url('ui-grid.eot#iefix') format('embedded-opentype'), url('./fonts/ui-grid.woff') format('woff'), url('./ui-grid.ttf') format('truetype'), url('./ui-grid.svg?#ui-grid') format('svg'); font-weight: normal; font-style: normal; } [class^='ui-grid-icon']:before, [class*=' ui-grid-icon']:before { font-family: 'ui-grid'; font-style: normal; font-weight: normal; speak: none; display: inline-block; text-decoration: inherit; width: 1em; margin-right: .2em; text-align: center; font-variant: normal; text-transform: none; line-height: 1em; margin-left: .2em; } .ui-grid-icon-blank::before { width: 1em; content: ' '; } .ui-grid-icon-plus-squared:before { content: ''; } .ui-grid-icon-minus-squared:before { content: ''; } .ui-grid-icon-search:before { content: '\c352'; } .ui-grid-icon-cancel:before { content: '\c353'; } .ui-grid-icon-info-circled:before { content: '\c354'; } .ui-grid-icon-lock:before { content: '\c355'; } .ui-grid-icon-lock-open:before { content: '\c356'; } .ui-grid-icon-pencil:before { content: '\c357'; } .ui-grid-icon-down-dir:before { content: '\c358'; } .ui-grid-icon-up-dir:before { content: '\c359'; } .ui-grid-icon-left-dir:before { content: '\c35a'; } .ui-grid-icon-right-dir:before { content: '\c35b'; } .ui-grid-icon-left-open:before { content: '\c35c'; } .ui-grid-icon-right-open:before { content: '\c35d'; } .ui-grid-icon-angle-down:before { content: '\c35e'; } .ui-grid-icon-filter:before { content: '\c35f'; } .ui-grid-icon-sort-alt-up:before { content: '\c360'; } .ui-grid-icon-sort-alt-down:before { content: '\c361'; } .ui-grid-icon-ok:before { content: '\c362'; } .ui-grid-icon-menu:before { content: '\c363'; } .ui-grid-icon-indent-left:before { content: '\e800'; } .ui-grid-icon-indent-right:before { content: '\e801'; } .ui-grid-icon-spin5:before { content: '\ea61'; } .ui-grid[dir=rtl] .ui-grid-header-cell, .ui-grid[dir=rtl] .ui-grid-footer-cell, .ui-grid[dir=rtl] .ui-grid-cell { float: right !important; } .ui-grid[dir=rtl] .ui-grid-column-menu-button { position: absolute; left: 1px; top: 0; right: inherit; } .ui-grid[dir=rtl] .ui-grid-cell:first-child, .ui-grid[dir=rtl] .ui-grid-header-cell:first-child, .ui-grid[dir=rtl] .ui-grid-footer-cell:first-child { border-right: 0; } .ui-grid[dir=rtl] .ui-grid-cell:last-child, .ui-grid[dir=rtl] .ui-grid-header-cell:last-child { border-right: 1px solid #d4d4d4; border-left: 0; } .ui-grid[dir=rtl] .ui-grid-header-cell:first-child .ui-grid-vertical-bar, .ui-grid[dir=rtl] .ui-grid-footer-cell:first-child .ui-grid-vertical-bar, .ui-grid[dir=rtl] .ui-grid-cell:first-child .ui-grid-vertical-bar { width: 0; } .ui-grid[dir=rtl] .ui-grid-menu-button { z-index: 2; position: absolute; left: 0; right: auto; background: #f3f3f3; border: 1px solid #d4d4d4; cursor: pointer; min-height: 27px; font-weight: normal; } .ui-grid[dir=rtl] .ui-grid-menu-button .ui-grid-menu { left: 0; right: auto; } .ui-grid[dir=rtl] .ui-grid-filter-container .ui-grid-filter-button { right: initial; left: 0; } .ui-grid[dir=rtl] .ui-grid-filter-container .ui-grid-filter-button [class^='ui-grid-icon'] { right: initial; left: 10px; } .ui-grid-animate-spin { -moz-animation: ui-grid-spin 2s infinite linear; -o-animation: ui-grid-spin 2s infinite linear; -webkit-animation: ui-grid-spin 2s infinite linear; animation: ui-grid-spin 2s infinite linear; display: inline-block; } @-moz-keyframes ui-grid-spin { 0% { -moz-transform: rotate(0deg); -o-transform: rotate(0deg); -webkit-transform: rotate(0deg); transform: rotate(0deg); } 100% { -moz-transform: rotate(359deg); -o-transform: rotate(359deg); -webkit-transform: rotate(359deg); transform: rotate(359deg); } } @-webkit-keyframes ui-grid-spin { 0% { -moz-transform: rotate(0deg); -o-transform: rotate(0deg); -webkit-transform: rotate(0deg); transform: rotate(0deg); } 100% { -moz-transform: rotate(359deg); -o-transform: rotate(359deg); -webkit-transform: rotate(359deg); transform: rotate(359deg); } } @-o-keyframes ui-grid-spin { 0% { -moz-transform: rotate(0deg); -o-transform: rotate(0deg); -webkit-transform: rotate(0deg); transform: rotate(0deg); } 100% { -moz-transform: rotate(359deg); -o-transform: rotate(359deg); -webkit-transform: rotate(359deg); transform: rotate(359deg); } } @-ms-keyframes ui-grid-spin { 0% { -moz-transform: rotate(0deg); -o-transform: rotate(0deg); -webkit-transform: rotate(0deg); transform: rotate(0deg); } 100% { -moz-transform: rotate(359deg); -o-transform: rotate(359deg); -webkit-transform: rotate(359deg); transform: rotate(359deg); } } @keyframes ui-grid-spin { 0% { -moz-transform: rotate(0deg); -o-transform: rotate(0deg); -webkit-transform: rotate(0deg); transform: rotate(0deg); } 100% { -moz-transform: rotate(359deg); -o-transform: rotate(359deg); -webkit-transform: rotate(359deg); transform: rotate(359deg); } } #ui-grid-twbs #ui-grid-twbs .form-horizontal .form-group:before, #ui-grid-twbs #ui-grid-twbs .form-horizontal .form-group:after, #ui-grid-twbs #ui-grid-twbs .btn-toolbar:before, #ui-grid-twbs #ui-grid-twbs .btn-toolbar:after, #ui-grid-twbs #ui-grid-twbs .btn-group-vertical>.btn-group:before, #ui-grid-twbs #ui-grid-twbs .btn-group-vertical>.btn-group:after { content: ' '; display: table; } #ui-grid-twbs #ui-grid-twbs .form-horizontal .form-group:after, #ui-grid-twbs #ui-grid-twbs .btn-toolbar:after, #ui-grid-twbs #ui-grid-twbs .btn-group-vertical>.btn-group:after { clear: both; } .ui-grid-cell-focus { outline: 0; background-color: #b3c4c7; } .ui-grid-focuser { position: absolute; left: 0px; top: 0px; z-index: -1; width: 100%; height: 100%; } .ui-grid-focuser:focus { border-color: #66afe9; outline: 0; } .ui-grid-offscreen { display: block; position: absolute; left: -10000px; top: -10000px; clip: rect(0px, 0px, 0px, 0px); } .ui-grid-cell input { border-radius: inherit; padding: 0; width: 100%; color: inherit; height: auto; font: inherit; outline: none; } .ui-grid-cell input:focus { color: inherit; outline: none; } .ui-grid-cell input[type='checkbox'] { margin: 1px 0 0 6px; width: auto; } .ui-grid-cell input.ng-invalid { border: 1px solid #fc8f8f; } .ui-grid-cell input.ng-valid { border: 1px solid #d4d4d4; } .ui-grid-viewport .ui-grid-empty-base-layer-container { position: absolute; overflow: hidden; pointer-events: none; z-index: -1; } .expandableRow .ui-grid-row:nth-child(odd) .ui-grid-cell { background-color: #fdfdfd; } .expandableRow .ui-grid-row:nth-child(even) .ui-grid-cell { background-color: #f3f3f3; } .ui-grid-cell.ui-grid-disable-selection.ui-grid-row-header-cell { pointer-events: none; } .ui-grid-expandable-buttons-cell i { pointer-events: all; } .scrollFiller { float: left; border: 1px solid #d4d4d4; } .movingColumn { position: absolute; top: 0; border: 1px solid #d4d4d4; box-shadow: inset 0 0 14px rgba(0, 0, 0, 0.2); } .movingColumn .ui-grid-icon-angle-down { display: none; } #ui-grid-twbs #ui-grid-twbs .form-horizontal .form-group:before, #ui-grid-twbs #ui-grid-twbs .form-horizontal .form-group:after, #ui-grid-twbs #ui-grid-twbs .btn-toolbar:before, #ui-grid-twbs #ui-grid-twbs .btn-toolbar:after, #ui-grid-twbs #ui-grid-twbs .btn-group-vertical>.btn-group:before, #ui-grid-twbs #ui-grid-twbs .btn-group-vertical>.btn-group:after { content: ' '; display: table; } #ui-grid-twbs #ui-grid-twbs .form-horizontal .form-group:after, #ui-grid-twbs #ui-grid-twbs .btn-toolbar:after, #ui-grid-twbs #ui-grid-twbs .btn-group-vertical>.btn-group:after { clear: both; } .ui-grid-pager-panel { display: flex; justify-content: space-between; align-items: center; position: absolute; left: 0; bottom: 0; width: 100%; padding-top: 3px; padding-bottom: 3px; box-sizing: content-box; } .ui-grid-pager-container { float: left; } .ui-grid-pager-control { padding: 5px 0; display: flex; flex-flow: row nowrap; align-items: center; margin-right: 10px; margin-left: 10px; min-width: 135px; float: left; } .ui-grid-pager-control button, .ui-grid-pager-control span, .ui-grid-pager-control input { margin-right: 4px; } .ui-grid-pager-control button { height: 25px; min-width: 26px; display: inline-block; margin-bottom: 0; font-weight: normal; text-align: center; vertical-align: middle; touch-action: manipulation; cursor: pointer; background-image: none; border: 1px solid transparent; white-space: nowrap; padding: 6px 12px; font-size: 14px; line-height: 1.42857143; border-radius: 4px; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; color: #eeeeee; background-color: #f3f3f3; border-color: #cccccc; } .ui-grid-pager-control button:focus, .ui-grid-pager-control button:active:focus, .ui-grid-pager-control button.active:focus, .ui-grid-pager-control button.focus, .ui-grid-pager-control button:active.focus, .ui-grid-pager-control button.active.focus { outline: 5px auto -webkit-focus-ring-color; outline-offset: -2px; } .ui-grid-pager-control button:hover, .ui-grid-pager-control button:focus, .ui-grid-pager-control button.focus { color: #333333; text-decoration: none; } .ui-grid-pager-control button:active, .ui-grid-pager-control button.active { outline: 0; background-image: none; -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125); box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125); } .ui-grid-pager-control button.disabled, .ui-grid-pager-control button[disabled], fieldset[disabled] .ui-grid-pager-control button { cursor: not-allowed; opacity: 0.65; filter: alpha(opacity=65); -webkit-box-shadow: none; box-shadow: none; } a.ui-grid-pager-control button.disabled, fieldset[disabled] a.ui-grid-pager-control button { pointer-events: none; } .ui-grid-pager-control button:focus, .ui-grid-pager-control button.focus { color: #eeeeee; background-color: #dadada; border-color: #8c8c8c; } .ui-grid-pager-control button:hover { color: #eeeeee; background-color: #dadada; border-color: #adadad; } .ui-grid-pager-control button:active, .ui-grid-pager-control button.active, .open>.dropdown-toggle.ui-grid-pager-control button { color: #eeeeee; background-color: #dadada; border-color: #adadad; } .ui-grid-pager-control button:active:hover, .ui-grid-pager-control button.active:hover, .open>.dropdown-toggle.ui-grid-pager-control button:hover, .ui-grid-pager-control button:active:focus, .ui-grid-pager-control button.active:focus, .open>.dropdown-toggle.ui-grid-pager-control button:focus, .ui-grid-pager-control button:active.focus, .ui-grid-pager-control button.active.focus, .open>.dropdown-toggle.ui-grid-pager-control button.focus { color: #eeeeee; background-color: #c8c8c8; border-color: #8c8c8c; } .ui-grid-pager-control button:active, .ui-grid-pager-control button.active, .open>.dropdown-toggle.ui-grid-pager-control button { background-image: none; } .ui-grid-pager-control button.disabled:hover, .ui-grid-pager-control button[disabled]:hover, fieldset[disabled] .ui-grid-pager-control button:hover, .ui-grid-pager-control button.disabled:focus, .ui-grid-pager-control button[disabled]:focus, fieldset[disabled] .ui-grid-pager-control button:focus, .ui-grid-pager-control button.disabled.focus, .ui-grid-pager-control button[disabled].focus, fieldset[disabled] .ui-grid-pager-control button.focus { background-color: #f3f3f3; border-color: #cccccc; } .ui-grid-pager-control button .badge { color: #f3f3f3; background-color: #eeeeee; } .ui-grid-pager-control input { display: block; width: 100%; height: 34px; padding: 6px 12px; font-size: 14px; line-height: 1.42857143; color: #555555; background-color: #ffffff; background-image: none; border: 1px solid #cccccc; border-radius: 4px; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); -webkit-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; height: 30px; padding: 5px 10px; font-size: 12px; line-height: 1.5; border-radius: 3px; display: inline; height: 26px; width: 50px; vertical-align: top; } .ui-grid-pager-control input:focus { border-color: #66afe9; outline: 0; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, 0.6); box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, 0.6); } .ui-grid-pager-control input::-moz-placeholder { color: #999999; opacity: 1; } .ui-grid-pager-control input:-ms-input-placeholder { color: #999999; } .ui-grid-pager-control input::-webkit-input-placeholder { color: #999999; } .ui-grid-pager-control input::-ms-expand { border: 0; background-color: transparent; } .ui-grid-pager-control input[disabled], .ui-grid-pager-control input[readonly], fieldset[disabled] .ui-grid-pager-control input { background-color: #eeeeee; opacity: 1; } .ui-grid-pager-control input[disabled], fieldset[disabled] .ui-grid-pager-control input { cursor: not-allowed; } textarea.ui-grid-pager-control input { height: auto; } select.ui-grid-pager-control input { height: 30px; line-height: 30px; } textarea.ui-grid-pager-control input, select[multiple].ui-grid-pager-control input { height: auto; } .ui-grid-pager-control .ui-grid-pager-max-pages-number { vertical-align: bottom; } .ui-grid-pager-control .ui-grid-pager-max-pages-number>* { vertical-align: bottom; } .ui-grid-pager-control .ui-grid-pager-max-pages-number abbr { border-bottom: none; text-decoration: none; } .ui-grid-pager-control .first-bar { width: 10px; border-left: 2px solid #4d4d4d; margin-top: -6px; height: 12px; margin-left: -3px; } .ui-grid-pager-control .first-bar-rtl { width: 10px; border-left: 2px solid #4d4d4d; margin-top: -6px; height: 12px; margin-right: -7px; } .ui-grid-pager-control .first-triangle { width: 0; height: 0; border-style: solid; border-width: 5px 8.7px 5px 0; border-color: transparent #4d4d4d transparent transparent; margin-left: 2px; } .ui-grid-pager-control .next-triangle { margin-left: 1px; } .ui-grid-pager-control .prev-triangle { margin-left: 0; } .ui-grid-pager-control .last-triangle { width: 0; height: 0; border-style: solid; border-width: 5px 0 5px 8.7px; border-color: transparent transparent transparent #4d4d4d; margin-left: -1px; } .ui-grid-pager-control .last-bar { width: 10px; border-left: 2px solid #4d4d4d; margin-top: -6px; height: 12px; margin-left: 1px; } .ui-grid-pager-control .last-bar-rtl { width: 10px; border-left: 2px solid #4d4d4d; margin-top: -6px; height: 12px; margin-right: -11px; } .ui-grid-pager-row-count-picker { float: left; padding: 5px 10px; } .ui-grid-pager-row-count-picker select { display: block; width: 100%; height: 34px; padding: 6px 12px; font-size: 14px; line-height: 1.42857143; color: #555555; background-color: #ffffff; background-image: none; border: 1px solid #cccccc; border-radius: 4px; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); -webkit-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; height: 30px; padding: 5px 10px; font-size: 12px; line-height: 1.5; border-radius: 3px; height: 25px; width: 67px; display: inline; vertical-align: middle; } .ui-grid-pager-row-count-picker select:focus { border-color: #66afe9; outline: 0; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, 0.6); box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, 0.6); } .ui-grid-pager-row-count-picker select::-moz-placeholder { color: #999999; opacity: 1; } .ui-grid-pager-row-count-picker select:-ms-input-placeholder { color: #999999; } .ui-grid-pager-row-count-picker select::-webkit-input-placeholder { color: #999999; } .ui-grid-pager-row-count-picker select::-ms-expand { border: 0; background-color: transparent; } .ui-grid-pager-row-count-picker select[disabled], .ui-grid-pager-row-count-picker select[readonly], fieldset[disabled] .ui-grid-pager-row-count-picker select { background-color: #eeeeee; opacity: 1; } .ui-grid-pager-row-count-picker select[disabled], fieldset[disabled] .ui-grid-pager-row-count-picker select { cursor: not-allowed; } textarea.ui-grid-pager-row-count-picker select { height: auto; } select.ui-grid-pager-row-count-picker select { height: 30px; line-height: 30px; } textarea.ui-grid-pager-row-count-picker select, select[multiple].ui-grid-pager-row-count-picker select { height: auto; } .ui-grid-pager-row-count-picker .ui-grid-pager-row-count-label { margin-top: 3px; } .ui-grid-pager-count-container { float: right; margin-top: 4px; min-width: 50px; } .ui-grid-pager-count-container .ui-grid-pager-count { margin-right: 10px; margin-left: 10px; float: right; } .ui-grid-pager-count-container .ui-grid-pager-count abbr { border-bottom: none; text-decoration: none; } .ui-grid-pinned-container { position: absolute; display: inline; top: 0; } .ui-grid-pinned-container.ui-grid-pinned-container-left { float: left; left: 0; } .ui-grid-pinned-container.ui-grid-pinned-container-right { float: right; right: 0; } .ui-grid-pinned-container.ui-grid-pinned-container-left .ui-grid-header-cell:last-child { box-sizing: border-box; border-right: 1px solid; border-width: 1px; border-right-color: #dae8f0; } .ui-grid-pinned-container.ui-grid-pinned-container-left .ui-grid-cell:last-child { box-sizing: border-box; border-right: 1px solid; border-width: 1px; border-right-color: #e4e4e4; } .ui-grid-pinned-container.ui-grid-pinned-container-left .ui-grid-header-cell:not(:last-child) .ui-grid-vertical-bar, .ui-grid-pinned-container .ui-grid-cell:not(:last-child) .ui-grid-vertical-bar { width: 1px; } .ui-grid-pinned-container.ui-grid-pinned-container-left .ui-grid-header-cell:not(:last-child) .ui-grid-vertical-bar { background-color: #d4d4d4; } .ui-grid-pinned-container.ui-grid-pinned-container-left .ui-grid-cell:not(:last-child) .ui-grid-vertical-bar { background-color: #aeaeae; } .ui-grid-pinned-container.ui-grid-pinned-container-left .ui-grid-header-cell:last-child .ui-grid-vertical-bar { right: -1px; width: 1px; background-color: #aeaeae; } .ui-grid-pinned-container.ui-grid-pinned-container-right .ui-grid-header-cell:first-child { box-sizing: border-box; border-left: 1px solid; border-width: 1px; border-left-color: #aeaeae; } .ui-grid-pinned-container.ui-grid-pinned-container-right .ui-grid-cell:first-child { box-sizing: border-box; border-left: 1px solid; border-width: 1px; border-left-color: #aeaeae; } .ui-grid-pinned-container.ui-grid-pinned-container-right .ui-grid-header-cell:not(:first-child) .ui-grid-vertical-bar, .ui-grid-pinned-container .ui-grid-cell:not(:first-child) .ui-grid-vertical-bar { width: 1px; } .ui-grid-pinned-container.ui-grid-pinned-container-right .ui-grid-header-cell:not(:first-child) .ui-grid-vertical-bar { background-color: #d4d4d4; } .ui-grid-pinned-container.ui-grid-pinned-container-right .ui-grid-cell:not(:last-child) .ui-grid-vertical-bar { background-color: #aeaeae; } .ui-grid-pinned-container.ui-grid-pinned-container-first .ui-grid-header-cell:first-child .ui-grid-vertical-bar { left: -1px; width: 1px; background-color: #aeaeae; } .ui-grid-column-resizer { top: 0; bottom: 0; width: 5px; position: absolute; cursor: col-resize; } .ui-grid-column-resizer.left { left: 0; } .ui-grid-column-resizer.right { right: 0; } .ui-grid-header-cell:last-child .ui-grid-column-resizer.right { border-right: 1px solid #d4d4d4; } .ui-grid[dir=rtl] .ui-grid-header-cell:last-child .ui-grid-column-resizer.right { border-right: 0; } .ui-grid[dir=rtl] .ui-grid-header-cell:last-child .ui-grid-column-resizer.left { border-left: 1px solid #d4d4d4; } .ui-grid.column-resizing { cursor: col-resize; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } .ui-grid.column-resizing .ui-grid-resize-overlay { position: absolute; top: 0; height: 100%; width: 1px; background-color: #aeaeae; } .ui-grid-row-saving .ui-grid-cell { color: #848484 !important; } .ui-grid-row-dirty .ui-grid-cell { color: #610b38; } .ui-grid-row-error .ui-grid-cell { color: #ff0000 !important; } .ui-grid-row.ui-grid-row-selected>[ui-grid-row]>.ui-grid-cell { background-color: #c9dde1; } .ui-grid-disable-selection { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; cursor: default; } .ui-grid-selection-row-header-buttons { display: flex; align-items: center; height: 100%; cursor: pointer; } .ui-grid-selection-row-header-buttons::before { opacity: 0.1; } .ui-grid-selection-row-header-buttons.ui-grid-row-selected::before, .ui-grid-selection-row-header-buttons.ui-grid-all-selected::before { opacity: 1; } .ui-grid-tree-row-header-buttons.ui-grid-tree-header { cursor: pointer; opacity: 1; } .ui-grid-tree-header-row .ui-grid-cell.ui-grid-disable-selection.ui-grid-row-header-cell { pointer-events: all; } .ui-grid-cell-contents.invalid { border: 1px solid #fc8f8f; } .grid-align_center { text-align: center; } .ui-grid-row:nth-child(odd) .ui-grid-cell { background-color: #fff; border-bottom: 1px solid #e4e4e4; } .ui-grid-row:nth-child(even) .ui-grid-cell { background-color: #fff; border-bottom: 1px solid #e4e4e4; } .ui-grid-row:last-child .ui-grid-cell { border-bottom: 1px solid #e4e4e4; line-height: 31px !important; } div[ui-grid-filter=''] .ui-grid-filter-container { padding: 0px 2px 2px 2px !important; } [role='columnheader'] .ui-grid-cell-contents { height: auto !important; line-height: 14px !important; text-align: center !important; }";
	


});
app.directive('gridData', function() {
    return {
        restrict: 'AE',
        template: '<div class="grid_view_data">' +
            '<div class="grid_con">' +
            '<div class="grid" id="{{grids_data[\'id\']}}"  ui-grid="grids_data"  ui-grid-auto-resize="" ui-grid-tree-view="" ui-grid-pinning="" ui-grid-resize-columns="" ui-grid-edit="" ui-grid-exporter=""></div>' +
            '</div>' +
            '<style>' +
            '.ui-grid {float:left;width:calc(100% - 2px);height:calc(100% - 2px) !important;}' +
            '/*.ui-grid-render-container.ui-grid-render-container .ui-grid-top-panel , .ui-grid-render-container.ui-grid-render-container .ui-grid-header-viewport{overflow:inherit;} */' +
            '.ui-grid-cell-contents .open_close{width:30px;height:100%;float:left;border-right: 1px solid #ddd;font-size: 10px !important;padding:4px 6px;color: #8a8a8a; text-align: center;}' +
            '/*.ui-grid .btn-outline-primary.dropdown-toggle,.ui-grid .btn-outline-primary.dropdown-toggle{padding: 0px 3px !important;border: 1px solid #d9d9d9 !important;box-shadow: none !important;color: #879cae !important;margin: 1px 3px;}' +
            '.btn-outline-primary.dropdown-toggle span[class*="icon_"] {margin: 2px auto;float: left;}*/'+
	    '.ui-grid-render-container-body .ui-grid-header-canvas {height: inherit !important;}'+
            
	    '.ui-grid-cell-contents .avoid_20s {width: 100%;height: 100%;float: left;padding: 0px 3px;  }'+
	    '.flo_lef {float: left;height: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;padding: 3px 0px 0px 7px;}'+
	    '.ui-grid-cell-contents.without_padding {padding: 0px !important;}*/'+
            ' grid-data{float:left;width:100%;height:100%;overflow:hidden}' +
            '.grid_view_data{float:left;width:100%;height:100%;overflow:hidden}' +
            '.grid_con{float:left;width:calc(100% - 0px);height:calc(100% - 0px);}' +
	    '.ui-grid-icon-plus-squared {background-image: url("data:image/svg+xml,%0A%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 50 50\'%3E%3Cpath d=\'M 9 4 C 6.2545455 4 4 6.2545455 4 9 L 4 41 C 4 43.745455 6.2545455 46 9 46 L 41 46 C 43.745455 46 46 43.745455 46 41 L 46 9 C 46 6.2545455 43.745455 4 41 4 L 9 4 z M 9 6 L 41 6 C 42.654545 6 44 7.3454545 44 9 L 44 41 C 44 42.654545 42.654545 44 41 44 L 9 44 C 7.3454545 44 6 42.654545 6 41 L 6 9 C 6 7.3454545 7.3454545 6 9 6 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z\'%3E%3C/path%3E%3C/svg%3E");background-repeat: no-repeat;}'+
	    '.ui-grid-icon-minus-squared { background-size: 16px 14px; background-position: center; background-repeat: no-repeat; background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M 3 3 L 3 4 L 3 21 L 21 21 L 21 3 L 3 3 z M 5 5 L 19 5 L 19 19 L 5 19 L 5 5 z M 7 11 L 7 13 L 17 13 L 17 11 L 7 11 z\'%3E%3C/path%3E%3C/svg%3E"); opacity: 0.49; }'+
	    '.ui-grid-row .act_row {background:#e7edee;}'+
	    '.ui-grid-row .act_cell {background:#fff !important;border: 2px solid black !important;padding: 3px 7px; font-weight: bold;}'+
	    '/*.ui-grid-row, .ui-grid-cell {    height: auto !important;}'+
	    '.ui-grid-viewport .ui-grid-cell-contents { word-wrap: break-word; white-space: nowrap !important; }'+
	    '.ui-grid-row div[role="row"] { display: flex; align-content: stretch; }*/'+
	    '.ui-grid-icon-cancel { width: 10px; height: 10px; background: url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAxNzIgMTcyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMCwxNzJ2LTE3MmgxNzJ2MTcyeiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxnIGZpbGw9IiM2NjY2NjYiPjxwYXRoIGQ9Ik0yLjc5NSwwYy0xLjYzOTM3LDAuMzA5MDYgLTIuODIxODcsMS43NjAzMSAtMi43OTUsMy40NHYxMC4zMmMwLjAxMzQ0LDAuODg2ODggMC4zNDkzOCwxLjczMzQ0IDAuOTY3NSwyLjM2NWw1NC4wNzI1LDU3LjQwNXY2MC42M2MwLjAyNjg4LDEuMTk1OTQgMC42ODUzMSwyLjI5NzgxIDEuNzIsMi45MDI1bDM0LjQsMjAuNjRjMS4wNDgxMywwLjYwNDY5IDIuMzUxNTYsMC42MTgxMyAzLjQxMzEzLDAuMDEzNDRjMS4wNDgxMiwtMC41OTEyNSAxLjcyLC0xLjcwNjU2IDEuNzQ2ODcsLTIuOTE1OTR2LTgxLjI3bDUzLjUzNSwtNTYuODY3NWMwLjA0MDMxLC0wLjA0MDMxIDAuMDY3MTksLTAuMDY3MTkgMC4xMDc1LC0wLjEwNzVsMC40MywtMC40M2MwLjE2MTI1LC0wLjE2MTI1IDAuMzA5MDYsLTAuMzQ5MzcgMC40MywtMC41Mzc1YzAuMDgwNjMsLTAuMDY3MTkgMC4xNDc4MSwtMC4xMzQzNyAwLjIxNSwtMC4yMTVjMC4yMDE1NiwtMC40NDM0NCAwLjMwOTA2LC0wLjkxMzc1IDAuMzIyNSwtMS4zOTc1YzAsLTAuMDY3MTkgMCwtMC4xNDc4MSAwLC0wLjIxNWMwLjAxMzQ0LC0wLjE3NDY5IDAuMDEzNDQsLTAuMzYyODEgMCwtMC41Mzc1di05Ljc4MjVjMCwtMS44OTQ2OSAtMS41NDUzMSwtMy40NCAtMy40NCwtMy40NGgtMTQ0LjQ4Yy0wLjEwNzUsMCAtMC4yMTUsMCAtMC4zMjI1LDBjLTAuMTA3NSwwIC0wLjIxNSwwIC0wLjMyMjUsMHpNNi44OCw2Ljg4aDEzNy42djUuNTlsLTUzLjEwNSw1Ni4zM2gtMzEuMzlsLTUzLjEwNSwtNTYuMzN6TTYxLjkyLDc1LjY4aDI3LjUydjczLjFsLTI3LjUyLC0xNi40NDc1ek0xMTMuMTk3NSwxMDkuOTcyNWMtMC4xNDc4MSwwLjAyNjg4IC0wLjI5NTYyLDAuMDY3MTkgLTAuNDMsMC4xMDc1Yy0xLjI5LDAuMjI4NDQgLTIuMzI0NjksMS4xNjkwNiAtMi42ODc1LDIuNDE4NzVjLTAuMzYyODEsMS4yNjMxMyAwLjAxMzQ0LDIuNjA2ODggMC45Njc1LDMuNDkzNzVsMjUuMDQ3NSwyNS4wNDc1bC0yNS4wNDc1LDI1LjA0NzVjLTEuMzcwNjIsMS4zNzA2MyAtMS4zNzA2MiwzLjU3NDM4IDAsNC45NDVjMS4zNzA2MywxLjM3MDYzIDMuNTc0MzgsMS4zNzA2MyA0Ljk0NSwwbDI1LjA0NzUsLTI1LjA0NzVsMjUuMDQ3NSwyNS4wNDc1YzEuMzcwNjMsMS4zNzA2MyAzLjU3NDM4LDEuMzcwNjMgNC45NDUsMGMxLjM3MDYzLC0xLjM3MDYyIDEuMzcwNjMsLTMuNTc0MzcgMCwtNC45NDVsLTI1LjA0NzUsLTI1LjA0NzVsMjUuMDQ3NSwtMjUuMDQ3NWMxLjExNTMxLC0xLjAzNDY5IDEuNDEwOTQsLTIuNjc0MDYgMC43MzkwNiwtNC4wMzEyNWMtMC42NTg0NCwtMS4zNzA2MiAtMi4xNSwtMi4xMjMxMiAtMy42NDE1NiwtMS44ODEyNWMtMC43NjU5NCwwLjA4MDYzIC0xLjQ5MTU2LDAuNDMgLTIuMDQyNSwwLjk2NzVsLTI1LjA0NzUsMjUuMDQ3NWwtMjUuMDQ3NSwtMjUuMDQ3NWMtMC43MTIxOSwtMC43NjU5NCAtMS43NDY4NywtMS4xNTU2MiAtMi43OTUsLTEuMDc1eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+"); top: 20px !important; }'+
	'.ui-grid-icon-cancel:before { content: "" !important; }'+
        '/*.ui-grid-viewport .ui-grid-cell-contents{border-right: 1px solid #ddd;}*/'+
        '.checkBox{padding: 2px 0;min-height: auto;position: relative;width: 100%; height: 100%;text-align: center;}'+
        '.checkBox svg{width: 20px;height: 20px;}'+
        '.legnd_icon{margin: 5px auto;border-radius: 40px;cursor: pointer;display: block;opacity: 0.7; width: 10px; height: 10px;}'+
        '.icon_G{background: rgb(87, 203, 150);}.icon_O{background: #FF9307;}.icon_R{background: rgb(233, 139, 139);}'+
        '.icon_B{background: #4285f4;}.icon_P{background: #dd68dd;}.icon_GR{background: #cacaca;} .legnd_icon.slct_icon{margin: 2px auto;float: left;}'+
        '.legend_drop{min-width: 70px;fonr-size: 14px;}'+
            '</style>' +
            '</div>',
        controller: 'GridController',
        scope: {
            'gconfig': '='
        },
        link: function(scope, elm, attrs, controller) {
		if(!$("#uigrid_min_css").length)
			$('head').append('<style id="uigrid_min_css"></style>').find('#uigrid_min_css').html(scope.uigrid_load_css)
	}
    }
});
