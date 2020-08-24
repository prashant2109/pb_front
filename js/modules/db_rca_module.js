"use strict";
var app = angular.module("tas.dbrca", ['ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.treeView', 'ui.grid.resizeColumns', 'ui.grid.expandable', 'ui.grid.pagination', 'ui.grid.selection','ui.grid.pinning','ui.grid.autoResize','tas.reference']);
app.controller("DbRca",function($http,$scope,$timeout,tasAlert,tasService,uiGridConstants,uiGridTreeBaseService){
	$scope.Object = Object
	$scope.config.scope = $scope;
	/******************************************/
	$scope.table_data1 = {
		htmlRef: true,
		pdfRef: true,
		path:'src/no_page_found.html',
		active:'html',
		id: 'dbrca',
		html_type: 'pdf',
		selected_pno: null,
		pno_filter: {'val': ''},
		parent_scope: $scope,
		toolBar: false,
		ref:[],
		pno_list:  [1],
		options: {zoom: true, clear: true, multiselect: true},
    	};
	/******************************************/
	$scope.node_template_grid = {
		enableFiltering: true,
		enableSorting: false,
		showTreeRowHeader: false,
		showTreeExpandNoChildren: false,
		enableColumnMenus: false,
		enableRowSelection: true,
    		enableSelectAll: true,
		columnDefs: [],
		data:[],
                onRegisterApi: function (gridApi) {
                        $scope.node_temp_api = gridApi
                }
        };
	/******************************************/
        $scope.create_level_template = function(res_hed,data){
		var grid_head = res_hed;
		var last_id = grid_head.length > 0 ? grid_head[grid_head.length - 1][0] : 0;
		grid_head  = grid_head.concat([['A.F','avail_flg'],['C.F','rca_flg']])
		
		data.forEach(function(r,index){
			r["level"] = r['level'] - 1;
			r["$$treeLevel"] = r['level'];
			r["rsn"] = index;
		});
		var grid_data = data;
		
		var colorTypes = [
			{value: '', bg: 'A', label: 'All', name: 'All'},
                        {value: 'g', bg: 'G', label: 'Green',name: 'All Components Found'},
                        {value: 'o', bg: 'O', label: 'Orange',name:'Some Components Found'},
                        {value: 'r', bg: 'R', label: 'Red',name: 'No Components Found'},
                ];
		var avg_flg = [
			{value: '', bg: 'A', label: 'All', name: 'All'},
			{value: 'g', bg: 'G', label: 'Green',name: 'Conforming to past data'},
			{value: 'o', bg: 'O', label: 'Orange',name: 'Not conforming to past data'},
		];

		var gridOptionsColumnDefs = [
			{
				field:"taxo",
				displayName: "Taxonomy",
				minWidth:  200,
				width: 250,
				pinnedLeft: true,
				enableFiltering: true,
				headerCellTemplate: `
              <div ng-class="{ 'sortable': sortable }">
              <div style="float: left;color: #000;cursor: pointer;width: 25px;height: 100%;text-align: center;padding-left: 4px;padding-top: 6px;line-height: 35px;" ng-click="grid.appScope.toggleAllRows(grid.treeBase.expandAll)" ng-if="grid.options.enableExpandAll">
                <i  ng-class="{'fa fa-minus i_con': grid.treeBase.numberLevels > 0 && grid.treeBase.expandAll, 'fa fa-plus i_con': grid.treeBase.numberLevels > 0 && !grid.treeBase.expandAll}"></i> &nbsp;
              </div>
              <div role="button" tabindex="0" ng-keydown="handleKeyDown($event)" class="ui-grid-cell-contents ui-grid-header-cell-primary-focus" col-index="renderIndex" style="border-left: 1px solid #ddd;">
                <span class="ui-grid-header-cell-label" ui-grid-one-bind-id-grid="col.uid + '-header-text'" title="{{phs[0]['n']}}">Taxonomy</span>
              
              <div ng-if="colFilter.type !== 'select'" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">
                  <input type="text" class="ui-grid-filter-input" ng-model="colFilter.term"/>
                  <div class="ui-grid-filter-button" ng-click="colFilter.term = null">
                  <i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i>
                  </div>
              </div>
              </div>
	      </div>`,
        visible: true,
        cellEditableCondition:false,
        enableSorting : false,
	cellTemplate:   `<div  class="ui-grid-cell-contents " style="padding:0px;" ng-class="{'active': row['entity']['rsn'] == grid.appScope.curntRow['rsn']}">
                        <div style="float:left;" class="ui-grid-tree-base-row-header-buttons slt_box_of_tgle slt_box_of_tgle_{{l_id}}"   ng-repeat="l_id in grid.appScope.repeat_cell_func(row.entity.level)" ng-class="{sel_row: (grid.appScope.sel_tr_sn == row.entity.sn && l_id==0), new_row_full_hglt: grid.appScope.row_chck_dic[row.entity.t_id] == true}">&nbsp;</div>
                        <div style="float:left;color: #000;padding-top: 10px;cursor: pointer;" class="ui-grid-tree-base-row-header-buttons slt_box_of_tgle slt_box_of_tgle_{{row.entity.level_id}}" ng-class="{'ui-grid-tree-base-header': row.treeLevel > -1, new_row_full_hglt: grid.appScope.row_chck_dic[row.entity.t_id] == true}" ng-click="grid.appScope.toggleRow(row, $event);$event.stopPropagation();$event.preventDefault();"><i ng-class="{'fa fa-minus i_con': ( ( grid.options.showTreeExpandNoChildren && row.treeLevel > -1 ) || ( row.treeNode.children && row.treeNode.children.length > 0 ) ) && row.treeNode.state === 'expanded', 'fa fa-plus i_con': ( ( grid.options.showTreeExpandNoChildren && row.treeLevel > -1 ) || ( row.treeNode.children && row.treeNode.children.length > 0 ) ) && row.treeNode.state === 'collapsed'}" ng-style="{'padding-left1': grid.options.treeIndent * row.treeLevel + 'px'}"></i> &nbsp;</div>
                    
                    <div class="slt_row_col_grid_cell slt_row_col_grid_cell_desc slt_rm_pd"  ng-right-click="grid.appScope.context_taxo_add($event)"  ng-class="{slt_sel_td: grid.appScope.sel_td_rid === row.entity['sn'], slt_pd_lft_30: row.entity['indent_left'],'active': row['entity']['rsn'] == grid.appScope.curntRow['rsn']}" level1="{{row.entity.level}}">
                    <span class="slt_ad_spn_sec slt_topic" title="{{COL_FIELD}}" ng-class="{level_0_class: row.entity.level==0,level_1_class:row.entity.level==1,level_2_class:row.entity.level>=2}">{{COL_FIELD}}</span>
                    </div>
            </div>`,
        	headerCellClass: 'hdr_cntr',
		filters: [{
		    condition: function(term, value, row, column){
			term = term.toLowerCase();
			if (!term) {
				return true;
			}
			if(column.field in row.entity){
				var id = row.entity[column.field].toLowerCase();
				if(String(id).includes(term))
					return true;
			}else{
				return false;
			}
		    }
		}]
          }
	];
	var head_flg =`<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div>
				<div class="dropdown">
					<div class="dropdown-toggle" data-toggle="dropdown" style="padding: 0px 2px;color: #232323;text-align: right;">                   
                                        	<span class="r_flag_{{colFilter['term'].toUpperCase() || 'A'}} pull-left"></span>
                                    	</div>
					<div class="dropdown-menu dropdown-menu-right dropdown-menu-tas filter_af">
						<div class="filter_af_div" ng-repeat="option in colFilter.selectOptions track by $index" ng-click="(colFilter.term = option.value) ; (colFilter.value = option.value)" title="{{option.name}}">
                                            <span class="af_cir r_flag_{{option['bg']}} pull-left"></span>
                                            <span ng-class="{act: colFilter['term'] == option['value']}">{{option['name']}}</span>
                                       	 	</div>
					</div>
				</div>
			`; 
	grid_head.forEach(function(rw){
            var fld = rw[0];
            var dis = rw[1];
            var template_value ="<div class=\"ui-grid-cell-contents grid-cell-text \" ng-class=\"{'act_proup':row.entity['csel']==col.name,'val_p':(row['entity'][col.name]||[]).length,'active': row['entity']['rsn'] == grid.appScope.curntRow['rsn']}\" style='text-align:left;' ng-click='grid.appScope.get_lineitem_values(row.entity,col.name,col.displayName,col)'><div  class='in_cell' ng-if=\"row.entity['value_flg'] =='table' && row.entity[col.name].length\" title='Table'>  <i class=\"fa fa-table tbl_ic\"></i></div><div class='in_cell' ng-if=\"row.entity['value_flg'] == 'value'\" title='{{COL_FIELD[0]}}' ng-bind-html=\"COL_FIELD[0]\"></div></div>";
	    var template_flg ="<div class=\"ui-grid-cell-contents grid-cell-text\" ng-class=\"{'active': row['entity']['rsn'] == grid.appScope.curntRow['rsn']}\"><div class='flg_flt'><span class=\"r_flag_{{COL_FIELD.toUpperCase()}}\"></span></div></div>"; 
	    if(rw[1] == 'rca_flg'){
		var dic = {field: rw[1],displayName: rw[0],'cellTemplate': template_flg,width:50,filter: { selectOptions: avg_flg, type: uiGridConstants.filter.SELECT},'pinnedRight':true,enableSorting : false,headerCellClass:'hide_sort',filterHeaderTemplate:head_flg} 
	    }else if(rw[1] == 'avail_flg'){
		var dic = {field: rw[1],displayName: rw[0],'cellTemplate': template_flg,width:50,filter: { selectOptions: colorTypes, type: uiGridConstants.filter.SELECT},'pinnedRight':true,enableSorting : false,headerCellClass:'hide_sort',filterHeaderTemplate:head_flg} 

	    }
	    else{
		var pinning = false;
		var cell_class = "";
		if(rw[0] == last_id ){
			pinning = true;	
			cell_class = "last_docid_col";
		}
            	var dic = {
                                field:  String(fld),
                                displayName: dis,
                                minWidth:  120,
                                pinnedRight: pinning,
                                enableFiltering:true,
                                visible: true,
                                cellEditableCondition:false,
                                enableSorting : false,
                                cellTemplate: template_value,
                                headerCellClass: 'hdr_cntr',
				cellClass : cell_class,
                                filters: [{
                                        condition: function(term, value, row, column){
                                            term = term.toLowerCase();
                                            if (!term) {
                                            return true;
                                            }
                                            if(column.field in row.entity){
                                                var id = row.entity[column.field].toString().toLowerCase();
                                                if(String(id).includes(term))
                                                return true;
                                            }else{
                                            return false;
                                            }
                                        }
                                    }]
                            };
		}
                    gridOptionsColumnDefs.push(dic);
        });
				
		$scope.node_template_grid['columnDefs'] = gridOptionsColumnDefs;
                $scope.node_template_grid['data'] = grid_data;
		$timeout(function(){
			$scope.node_temp_api.treeBase.expandAllRows();
			if(grid_head.length){
				var for_stop = false;
				for(var i=0;i<grid_data.length;i++){
					for(var j=0;j<grid_head.length;j++){
						var fld = grid_head[j][0];
						if(fld != "A.F" && fld != "C.F" && grid_data[i][fld][0] != ""){
							var dispaly = grid_head[j][1];
							for_stop = true;
							break;
						}
					}
					if(for_stop){
						$scope.get_lineitem_values(grid_data[i],fld,dispaly)
						break;
					}
				}
			}
		});	
	}
	/******************************************/
   	$scope.repeat_cell_func = function(id){
		if(id == 0){
			return [];
		}
		else{
			var data = [];
			for(var a=0, a_l=id; a<a_l; a++){
				data.push(a);
			}
			return data;
		}
   	} 
	/******************************************/
	$scope.toggleRow = function( row,evt ){
    		uiGridTreeBaseService.toggleRowTreeState($scope.node_temp_api.grid, row, evt);
      	};

	$scope.toggleAllRows = function(flg){
		if(!flg)
                    $scope.node_temp_api.treeBase.expandAllRows();
            	else
                    $scope.node_temp_api.treeBase.collapseAllRows();
	}
	/******************************************/
	$scope.get_rca = function(prt, cmp){
		var docs = [];
		cmp["info"].forEach(function(r){
			docs.push(r.d);
		});
		var data = {"oper_flag": $scope.config.cmd_dict['getRca'], "event id": prt['project_id'], "CompanyID":cmp['company_id'], "ws_id":"1", "doc_ids": docs};
		var post_data = {cmd_id: 22, data: [data], path: encodeURIComponent($scope.config.host), method: "POST"};
		$scope.config.parent_scope.ps = true;
		tasService.ajax_request(post_data, 'POST', $scope.clbk_get_rca);	
	}
	/******************************************/
	$scope.clbk_get_rca = function(res){
		$scope.config.parent_scope.ps = false;
		if(res["message"] == "done"){
			var headers = res['data']['docs'] || [];
			var data = res['data']['results'] || [];
			$scope.create_level_template(headers, data);	
		}else{
			$scope.node_template_grid['data'] = [];
			tasAlert.show(res["message"],"error",1000);
		}
	}
	/******************************************/
	$scope.node_values_grid = {
                enablePinning:true,
                enableFiltering:true,
                enableRowSelection: true,
                enableSorting: false,
		columnDefs: [],
		showTreeExpandNoChildren:false,
		enableColumnMenus:false,data:[],
                rowHeight:'auto',
                onRegisterApi: function (gridApi) {
                        $scope.node_values_api = gridApi
                }
        };	
	/******************************************/
	var temp_prev_row = '';
	/******************************************/
	$scope.get_lineitem_values = function(row, colname, dispname, col){
		$scope.curntRow = row;
		if(temp_prev_row)
			temp_prev_row['csel'] = '';
		temp_prev_row = row;
		row['csel'] = colname;
		var res_values = row[colname] || [];
		$scope.enable_ref_values = false;
		$timeout(function(){	
			$scope.do_resize();
		});
		if(!res_values.length){
				$scope.table_data1.scope.clear_table_highlight($scope.table_data1['id']);
				return;
		}else{
			if(row["value_flg"] == "value"){
				row['docid'] = colname;
				if(row[colname][0] !=''){
					$scope.map_highlight_data(row[colname],colname,colname,row);
					return;	
				}
				$scope.table_data1.scope.clear_table_highlight($scope.table_data1['id']);
				$scope.sltRow = {};
				$scope.table_data1.path ="";
				return
			}
				
		}
		$scope.enable_ref_values = true;
		var template ="<div class=\"ui-grid-cell-contents grid-cell-text \" ng-class=\"{'act_proup':row['entity']['csel']==col.name,'val_p':(COL_FIELD).length,'active': row.entity.rsn == grid.appScope.sltRow['rsn']}\" ng-click=\"grid.appScope.map_highlight_data(COL_FIELD,row.entity.docid,col.field,row.entity)\" style=\"text-align:left;\"title=\"{{(COL_FIELD[0]||'')}}\" ng-bind-html=\"COL_FIELD[0] | trusted1\"></div>"
		var template1 ="<div class=\"ui-grid-cell-contents grid-cell-text taxo_labl \" ng-class=\"{'act_proup':row['entity']['csel']==col.name,'active':  row.entity.rsn == grid.appScope.sltRow['rsn']}\" style=\"text-align:left;\"title=\"{{(COL_FIELD||'')}}\">{{COL_FIELD}}</div>"
		var  coldefs = [];
		var rwdata = [];
		res_values.forEach(function(ar,index){
			var col = "val_"+index;
			if(index == 0){
				coldefs.push({field:"taxo",displayName: "Taxonomy",width:'*',cellTemplate:template1,'minWidth':'100',});
			}else{
				coldefs.push({field:col,displayName: dispname,width:'*',cellTemplate:template,'minWidth':'100',});		
			}	
		})
		var rs_slice = res_values.slice(1)
		res_values[0].forEach(function(arr,mind){
			var tmp = {};
			rs_slice.forEach(function(each,index){
					var col = "val_"+(index+1);
					tmp['taxo'] = arr;
					tmp[col] = each[mind];
					tmp['rsn'] = mind;
					tmp['docid'] = colname; 
			})	
			
				rwdata.push(tmp);

		});
		$scope.node_values_grid['columnDefs'] = coldefs;
		$scope.node_values_grid['data'] = rwdata;
		$timeout(function(){
			if(rwdata.length){
				var hig = false;
				for(var i=0;i<rwdata.length;i++){
					var fld;
					for(fld in rwdata[i]){
						if(fld.match("val")){
							hig = true;
							break;	
						}
					}
					if(hig){
						$scope.map_highlight_data(rwdata[i][fld],colname,fld,rwdata[i]);
						break;
					}
				}
			}
			$timeout(function(){	
				$scope.do_resize();
			});
		});
	}
	/******************************************/
	$scope.do_resize	= function(){
		$timeout(function(){
			window.dispatchEvent(new Event('resize'));
		})	
	}
	/******************************************/
	var tmp_subprevrow = '';
	var tmp_doc_type ="";
        $scope.map_highlight_data = function (data,docid,colname,row_data){
		var templ ="";
		$scope.sltRow = row_data;
		if(colname){
			if(tmp_subprevrow)
                        	tmp_subprevrow['csel'] = '';
                	tmp_subprevrow = row_data;
			row_data['csel'] = colname;
		}
		if(data['4'] == "pdf"){	
			templ = '/ref_path/'+$scope.config.parent_scope.slcted_indus_dic['project_id']+'/1/pdata/docs/'+docid+'/html/'+data['3']+".html";
		}
		else{
			templ = '/ref_path/'+$scope.config.parent_scope.slcted_indus_dic['project_id']+'/1/pdata/docs/'+docid+'/html/'+docid+"_slt.html";
		}
		$scope.table_data1.path = templ;
		var node = [];
		var xml_list = [];
		var c = [];
		var ref = {};
		ref['pno'] = data['3'];
		var xl = data['2'].split("$");
		var c_split = data['1'].split("$");
		xl.forEach(function(d){
			xml_list.push(d)
		});
		c_split.forEach(function(csp){
			c.push(csp);
		});
		ref['c'] = c;
		ref['xml_list'] = xml_list;
		$scope.table_data1.html_type = data['4'];
		$scope.table_data1.active = 'html';
		node.push(ref);
		$scope.table_data1.ref = node;
		$scope.table_data1.scope.clear_table_highlight($scope.table_data1['id']);
		$scope.table_data1.scope.iframe_page_no_change($scope.table_data1);
        }
	/******************************************/
	/******************************************/
});
app.directive('builderRca',function(){
	return {
		restrict: 'AE',
		template:`<div class="db_rca">
			<div class="nav_divide1">
				<div class="like_panel adjustheight_panel_new full_panel" ng-class="{'full_panel': !enable_ref_values}">
					<div class="ss_grid ui-grid slt_grid_div " ui-grid="node_template_grid" ui-grid-cellnav ui-grid-pinning ui-grid-auto-resize ui-grid-resize-columns ui-grid-tree-view></div>
				</div>
				<div class="map_info_rel_proup_mbtm_cvr review_taxo_values_div" ng-if="enable_ref_values">
					<div class="ui-grid" ui-grid="node_values_grid" ui-grid-pinning ui-grid-auto-resize></div>
				</div>
			</div>
			<div class="nav_divide2">
				<div class="nav_proup_frame_hdr_cvr">
					<div class="next_prev">
						<div class="lgb_drp_cvr">
						</div>
						<div class="company_lbl_cvr1">
							<!--div class="next_prev pull-right" style="width:186px;line-height: 35px;">
								<div class="nxt_prv"><i class="fa fa-chevron-left"></i></div>
								<div class="nxt_prv" style="border: none;">     
								Page No<select ng-options="pno for pno in nav_proup_page_opt" ng-model="$parent.$parent.$parent.sl_nav_proup_page_opt" s='{{$parent.$parent.$parent.sl_nav_proup_page_opt}}' class="form-control fmctrl" style="width:50px;display: inline-block;" ng-change="change_nav_proup_page(sl_nav_proup_page_opt)"></select>
								</div>
								<div class="nxt_prv" style="border-right: none;"><i class="fa fa-chevron-right"></i></div>         
							</div -->
							<div class="next_prev pull-right" style="width: 100px;">
                               					<span class="nav_doc_id_lbl">Doc Id:</span> <span class="nav_doc_id_disp">{{sltRow['docid']}}</span><select ng-options="doc for doc in nav_proup_docs_opt" style="display:none;" ng-model="$parent.$parent.sl_nav_proup_doc_opt" class="form-control fmctrl" style="width:80px;display: inline-block;" ></select>
							</div>
						</div>
					</div>
				</div>
				<div class="nav_proup_frame_cvr">
					<ref-div config="table_data1"></ref-div>
				</div>
			</div>
		</div>
		<style>
			.db_rca{width: 100%;height: 100%;}
			.db_rca .nav_divide1 {width: 60%;height: 100%;float: left;}
			.db_rca .like_panel.adjustheight_panel_new {height: calc(70% - 5px);}
			.db_rca .like_panel {width: calc(100% - 5px);background: white;height: 50%;margin: 0 5px 5px 0px;}
			.db_rca .nav_divide1 .ui-grid {border: 1px solid #fff !important;}
			.db_rca .ss_grid {height: calc(100% - 4px) !important;}
			.db_rca .ui-grid-render-container {border: 1px solid #ececec;}
			.db_rca .nav_divide1 .ui-grid-header-cell {border: none !important;border-right: 1px solid #e0e7ed !important;color: #333 !important;background: #fff !important;}
			.db_rca .nav_divide1 .ui-grid-header-cell .ui-grid-cell-contents {color: #333 !important;white-space: nowrap !important;font-size: 12px;font-weight: 500;text-align: center;}
			.db_rca .ui-grid-canvas {background: #fff;}
			.db_rca .ui-grid-tree-header-row {font-weight: 500 !important;}
			.db_rca .nav_divide1 .ui-grid-row:nth-child(2n+1) .ui-grid-cell, .project_data_view_grid .ui-grid-row:nth-child(2n) .ui-grid-cell {border-bottom: 1px solid #e4e5e6 !important;}
			.db_rca .ui-grid-cell, .ui-grid-cell-contents {border-color: #ececec;box-sizing: border-box;}
			/*.db_rca .nav_divide1 .ui-grid-render-container-body .ui-grid-cell-contents {color: #138092;}*/
			.db_rca .act_proup {background: #c9f4f3;font-weight: bold !important;text-shadow: none !important;}
			.db_rca .nav_divide1 .ui-grid-pinned-container.ui-grid-pinned-container-right .ui-grid-cell:first-child {box-sizing: border-box;border-left: 1px solid;border-width: 1px;border-left-color: #eaeaea;}
			.db_rca .nav_divide1 [ui-grid='node_template_grid'] .ui-grid-row .last_docid_col {background: #f7fff5 !important;}
			.db_rca .r_flag_G {background: #42AA64;border-radius: 40px;cursor: pointer;display: block;opacity: 0.7;border-radius: 60px;width: 10px;height: 10px;margin: 0px auto !important;}
			.db_rca .r_flag_R {background: #F58073;border-radius: 40px;cursor: pointer;display: block;opacity: 0.7;border-radius: 60px;width: 10px;height: 10px;margin: 0px auto !important;}
			.db_rca .r_flag_O {background: #f3b647;border-radius: 40px;cursor: pointer;display: block;opacity: 0.7;border-radius: 60px;width: 10px;height: 10px;margin: 0px auto !important;}
			.db_rca .review_taxo_values_div {height: 30% !important;}
			.db_rca .map_info_rel_proup_mbtm_cvr {float: left;width: calc(100% - 5px);border: 1px solid #ddd;margin: 0px 5px 5px 0px;background: white;}
			.db_rca .review_taxo_values_div .ui-grid {float: left;width: calc(100% - 0px) !important;height: calc(100% - 0px) !important;}
			.db_rca .nav_divide2 {width: 40%;height: calc(100% - 0px);float: left;border-left: 1px solid #ddd;background: white;}
			.db_rca .nav_proup_frame_hdr_cvr {float: left;width: 100%;height: 35px;border-bottom: 1px solid #ddd;}
			.db_rca .next_prev{width: 100%;height: 100%;}
			.db_rca .lgb_drp_cvr {float: left;width: 110px;height: 100%;}
			.db_rca .lgd_drp {height: 100%;float: left;width: 100%;}
			.db_rca .lgd_drp .lb_bt{line-height: 35px;padding: 0 10px;font-weight: 400;border-right: 1px solid #ddd;}
			.db_rca .lgd_drp .lb_bt:after{float: right;margin-top: 15px;}
			.db_rca .next_prev a {text-decoration: none;display: inline-block;padding: 4px 8px;background-color: #5bc0de;color: white;cursor: pointer;border-radius: 2px;margin: 2px;}
			.db_rca .nav_proup_frame_hdr_cvr .next_prev a {background: #f6f4f4 !important;}
			.db_rca .company_lbl_cvr1 {float: left;width: calc(100% - 110px);height: 100%;}
			.db_rca .nav_doc_id_lbl {float: left;padding: 3px 7px;margin: 7px 0px;}
			.db_rca .nav_doc_id_disp {float: left;padding: 3px 3px;margin: 7px 0px;font-weight: bold;color: #33a3d6;}
			.db_rca .fmctrl{height:25px;padding:0px 4px;margin-left:5px;border-radius:2px}
			.db_rca .fmctrl:focus{box-shadow:none;border-color:#ced4da}
			.db_rca .nav_proup_frame_hdr_cvr .next_prev a i{color:#97ceea!important}
			.db_rca .nav_proup_frame_cvr{height:calc(100% - 35px)!important;width:100%;overflow:hidden}
			.db_rca .legend_table th{background:#dae8f1!important;padding:6px 9px!important;border-right:1px solid #efefef!important;font-size:14px;color:#343a40!important;font-weight:700;font-size: 12px;}
			.db_rca .legend_Green{margin:4px auto;background:#42AA64;border-radius:40px;width:.8em;height:.8em;cursor:pointer;display:block;opacity:.7}
			.db_rca .legend_Orange{margin:4px auto;background:#f3b647;border-radius:40px;width:.8em;height:.8em;cursor:pointer;display:block;opacity:.7}
			.db_rca .legend_Red{margin:4px auto;background:#F58073;border-radius:40px;width:.8em;height:.8em;cursor:pointer;display:block;opacity:.7}
			.db_rca .dropdown-menu table tbody tr td{word-break:break-all;max-width:400px;text-overflow:ellipsis;overflow:hidden;font-size: 12px;}
			.db_rca .legend_table.table{margin:0;border:0}
			.db_rca .legend_table td:nth-child(1){width:50px}
			.db_rca .legend_table td{padding:8px 5px!important;border:none!important;border-bottom:1px solid #efefef!important;border-right:1px solid #efefef!important;background:#fff;font-size:13px;font-weight:400}
			.db_rca .lgb_drp_cvr .dropdown-menu li a{padding:2px 1px;display:block;margin:0}
			.db_rca .nxt_prv{width:auto;float:left;height:100%;padding:0 10px;border-left:1px solid #ddd;border-right:1px solid #ddd}
			.db_rca .nav_divide1 .ui-grid-cell-contents.grid-cell-text{color:#333;font-weight:400;border: 2px solid transparent;font-size: 12px;}
			.db_rca .slt_grid_div .slt_box_of_tgle{width:26px;border-right:1px solid #ddd;height:100%;text-align:center;padding-left:4px}
			.db_rca .slt_grid_div .slt_row_col_grid_cell_desc{background-color:#fff;position:relative;padding:0;padding-left:8px;text-align:left!important;border:2px solid rgba(82,123,149,0)!important;padding-right:0;height:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;overflow:hidden}
			.db_rca .slt_grid_div .ui-grid-cell, .db_rca .slt_grid_div [ui-grid-group-columns] .ui-grid-cell{overflow:hidden;float:left;background-color:inherit;border:none;border-right:1px solid;border-color:#e4e4e4;box-sizing:border-box;border-bottom:1px solid #e4e4e4;font-size:12px;font-weight:400;color:#111}
			.db_rca .slt_grid_div .slt_ad_spn_sec{overflow:hidden;float:left;white-space:nowrap;-ms-text-overflow:ellipsis;-o-text-overflow:ellipsis;text-overflow:ellipsis;width:calc(100% - 5px);padding-top:5px;height:100%;font-weight:500;}
			.db_rca .rmc_dropdown_item_tas:hover{background:#eaeaea;color:#05698c!important;font-weight:700}
			.db_rca .rmc_dropdown_item_tas{display:block;width:100%;padding:.25rem 0 .25rem 1.5rem;clear:both;font-weight:400;text-align:inherit;white-space:nowrap;background-color:transparent;border:0;font-size:13px;line-height:22px;border-bottom:1px solid #ececec;cursor:pointer;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}
			.db_rca .rmcticn_3{height:100%!important;line-height:35px!important}
			.db_rca .drp-header span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:inline-block;width:97%;float:left}
			.db_rca .flg_y{background:#b8e8b8}
			.db_rca .grd .type_ng{width:100%;height:30px;margin-bottom:3px}
			.db_rca .type_ng .type_slct{line-height:30px;padding:0 10px}
			.db_rca .type_slct.active{background:#455a64;font-weight:700;color:#fff;border-radius:2px}
			.db_rca .grd .gr_data{width:100%;height:calc(100% - 33px)}
			.db_rca .slt_row_cell{border:2px solid #2575b9;background:#c9dbea;font-weight:700}
			.db_rca .tbl_ic{color:#3f6ad8 !important;font-size:14px!important}
			.db_rca .ui-grid-cell-contents.grid-cell-text.taxo_labl {font-weight: 500;color: #3f6ad8 !important;}
			.db_rca .ss_grid .ui-grid-row:hover .ui-grid-cell, .db_rca [ui-grid="node_values_grid"] .ui-grid-row:hover .ui-grid-cell{background: none !important;}
			.db_rca .nav_divide1 [ui-grid='node_template_grid'] .ui-grid-row:hover .last_docid_col{background: #f7fff5 !important;}
			.db_rca .ui-grid-cell-contents.active {background: #dae8f1 !important;}
			.db_rca .slt_row_col_grid_cell.active {background: #dae8f1 !important;}	
			.db_rca [ui-grid="node_values_grid"] .act_proup, .db_rca [ui-grid="node_template_grid"] .act_proup {border: 2px solid black !important;background-color: white !important;}
			.db_rca [ui-grid="node_template_grid"] .ui-grid-cell-focus{background: none;}
			.db_rca .hide_sort .ui-grid-invisible{display: none;}
			.db_rca .like_panel.full_panel{height: calc(100% - 0px);}
			.db_rca .ss_grid .ui-grid-render-container-right .ui-grid-header-viewport{overflow: visible !important;}
			.db_rca .ss_grid .ui-grid-top-panel {overflow: visible;}
			.db_rca .dropdown-menu.dropdown-menu-tas.filter_af {min-width: 40px !important;width: 210px !important;height: auto;padding: 5px;}
			.db_rca .filter_af_div{display:block;width:100%;padding:.15rem .5rem;clear:both;font-weight:400;text-align:inherit;white-space:nowrap;background-color:transparent;border:0;font-size:13px;line-height:22px;border-bottom:1px solid #ececec;cursor:pointer}
			.db_rca .filter_af_div .af_cir{margin-top: 5px !important; margin-right: 10px !important;}
			.db_rca .filter_af_div .act{font-weight: 500;}
			.db_rca .r_flag_A{background: #cdcfd5;border-radius: 40px;cursor: pointer;display: block;opacity: 0.7;border-radius: 60px;width: 10px;height: 10px;margin: 0px auto !important;}
			.db_rca .nav_divide1 .ui-grid-cell-contents.grid-cell-text .in_cell{width: 100%; height: 100%; text-overflow: ellipsis !important; white-space: nowrap; overflow: hidden; }
			.db_rca .nav_divide1 .ui-grid-cell-contents.grid-cell-text .flg_flt{padding-top: 2px;}
			.db_rca .slt_grid_div .slt_row_col_grid_cell_desc[level1="0"]{color:#7db2d9!important;color:#293238!important;}
			.db_rca .slt_grid_div .slt_row_col_grid_cell_desc[level1="1"]{color:#4a7192!important;}
			.db_rca .slt_grid_div .slt_row_col_grid_cell_desc[level1="2"]{color:#92a8ba!important;}
			.db_rca .slt_grid_div .slt_row_col_grid_cell_desc[level1="3"]{color:#92a8ba!important;}
			.db_rca .slt_grid_div .slt_row_col_grid_cell_desc[level1="4"]{color:#92a8ba!important;}
			.db_rca .slt_grid_div .slt_row_col_grid_cell_desc[level1="5"]{color:#92a8ba!important;}
		</style>`,
		controller: 'DbRca',
		scope: {
			'config': '='
		},
		link: function (scope, elm, attrs, controller) {

		},
	}
});
