var app = angular.module("informationUnits", ['ui.grid', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.edit', 'ui.grid.treeView', 'ui.grid.resizeColumns', 'ui.grid.expandable', 'ui.grid.pagination', 'ui.grid.selection'])
app.controller("information_units", function($scope,  $rootScope, $http, $timeout, $location, $filter, $sce, tasAlert, tasService, uiGridTreeBaseService){
    $scope.Object = Object
    $scope.config.scope = $scope
    $scope.project_id = ''
    $scope.selceted_doc_name = ''
    $scope.host = $scope.config['host']
    $scope.cmd_ids = $scope.config['cmd_dict'];
    /***********************************/ 
    $scope.fm_head	= [{'n':'Table','k':'ty'},{'n':'Description','k':'t'},{'n':'Year','k':'ph'},{'n':'Operation','k':'op'},{'n':'Value','k':'v'}]
    /***********************************/ 
    $scope.annual_report = [{'n':'All','k':'All'},{'n':'Annual','k':'FY'},{'n':'Half Year','k':'H'},{'n':'Quarter Year','k':'Q'}]
    /***********************************/ 
    $scope.annual_report_copy = [{'n':'All','k':'All'},{'n':'Annual','k':'FY'},{'n':'Half Year','k':'H'},{'n':'Quarter Year','k':'Q'}]
    /***********************************/
    $scope.sub_taps = [{'n': 'Reference','lk':'doc_id'}, {'n':'Formula','lk':'f_val'},{'n':'Re-statement','lk':'re_stated'},{'n': 'Graph View','lk':'i'},{'n':'Sentences','lk':'s_sent'}]
    /***********************************/
    $scope.exhustive_changes  = [{'v':'List','i':'fa fa-list-alt'},{'v':'Split','i':'fa fa-th-large'},{'v':'Taxonomy','i':'fa fa-bar-chart'}];
    /***********************************/
    $scope.fon_icon_typs = []
    /***********************************/
    $scope.fm_val		= []	
    /***********************************/
    $scope.sen_icons  = {'Tables':'fa fa-table', 'Sentences-Table Descriptions':'fa fa-table','Sentences Additional':'fa fa-align-left', 'Entity':'fa fa-th-list', 'Foot-Notes':'fa fa-sticky-note-o', 'Key Value':'fa fa-th-list'}
    /***********************************/
    $scope.sel_types = ["Tables", "Sentences-Table Descriptions", "Sentences Additional", "Entity", "Foot-Notes", "Key Value"]
    /***********************************/
    $scope.refOptionsToc ={
             id: 'iframe_info',
             htmlRef: true,
             pdfRef: true,
             html_type: 'pdf',
             active: 'pdf',
             toolBar: false,
             title: '',
             dropDown: true,
             path: 'src/no_ref_found.html',
             pno_list:  [],
             selected_pno: 1,
             parent_scope:  $scope,
             ref: [{
                bbox: [[]],
                coord: [],
                bg: '',
                border: '',
                c_name: '',
                clr_flg: '',
                x: '',
                d: '',
                t: '',
                pno: '',
                xml_list: [],
                c: []
              }]
    }
    /***********************************/
     $scope.sl_exhustive_tap	= {}
    /***********************************/
     $scope.pop_up_flags = false
     $scope.close_pop_up = function(){
            $scope.pop_up_flags = false
            $scope.do_resize()
     }
     /***********************************/
     $scope.change_exhustive_tap	= function(t){
            $scope.sel_id = ''
            $scope.sl_sub_tap ={}
            $scope.available_dicts = {}
            $scope.sen_val ={}            
            $scope.sen_head =[]
            $scope.sl_exhustive_tap	= {}
            $scope.sl_exhustive_tap	= t
            $scope.change_rtaps_exhaustive($scope.sl_exhaustive_grid['t'], $scope.exhaustive_input[0],$scope.exhaustive_input[1],$scope.exhaustive_input[2],$scope.exhaustive_input[3],'YY')
      }
     /***********************************/
      $scope.sl_period_type = {'t':{}}
      var do_not_consider_ph	= {'S.No':1,"Description":1}
      $scope.filter_periodic_years	= function(r){
                $scope.annual_report = $scope.annual_report_copy
		if(r){
			$scope.sl_period_type['t']	= r;	
		}
		$scope.gridDataCompanyInfo['columnDefs'].forEach(function(each){
			if(each['displayName'] in do_not_consider_ph) return
			if($scope.sl_period_type['t']['n'] == 'All'){
				each['visible'] = true
			}else{
				var term =  $scope.sl_period_type['t']['k']
				if(each['displayName'].indexOf(term) != -1){
					each['visible'] = true
				}else{
					each['visible'] = false
				}
			}
		})
		$scope.gridApi.core.refresh()
      }
      /***********************************/
        $scope.sl_exhaustive_grid	= {} 
        $scope.exhaustive_input 	= []
	$scope.exhaustive_taps		= []	
	$scope.exhaustive_taps_copy		= []	
	$scope.selected_cmp_id		= {}
        $scope.sel_type = []
        $scope.sel_data_key  =[]
        $scope.icon_dicts = [] 
        $scope.selected_grid_header = ''
        $scope.show_exhaustive_view     = function(a,b,c,d){
                 if(!$scope.sl_exhustive_tap['v']){
                        $scope.sl_exhustive_tap = $scope.exhustive_changes[0]
                 }
                 var c_data     = [] 
                 $scope.selected_cmp_id  = a
                 $scope.exhaustive_input = [a,b,c,d]
                 a['aorder'].forEach(function(each){
                        if(a['taps_temp'] && a['taps_temp'][each]){
                                c_data  = c_data.concat(a['taps_temp'][each])
                        }
                 })
                 $scope.sel_data_key = a['taps_temp']
                 $scope.selected_grid_header    = a['aorder'][0] || $scope.config.tabs[0]
                 $scope.exhaustive_taps         = c_data
                 $scope.exhaustive_taps_copy    = c_data
     
                 $scope.change_exhaustive_dropdown($scope.exhaustive_taps[0])
        }
	/***********************************/
        $scope.change_exhaustive_dropdown	= function(r){
                $scope.selected_drop_down = ''
                $scope.exhaustive_taps = $scope.exhaustive_taps_copy
                $scope.pop_up_flags = false
                $scope.available_dicts = {}
                $scope.sel_id = ''
                $scope.sel_type[0] = r
		$scope.sl_exhaustive_grid['t']	= r
		$scope.change_rtaps_exhaustive($scope.sl_exhaustive_grid['t'], $scope.exhaustive_input[0],$scope.exhaustive_input[1],$scope.exhaustive_input[2],$scope.exhaustive_input[3])
	}
	/***********************************/
         $scope.slcmp_info  ={}
         $scope.sel_taxo_data ={}
         $scope.taxonomy_map  ={}
         $scope.change_rtaps_exhaustive	= function(v,data,t,ttt,source_type){
                $scope.sl_period_type = {'t':{}}
                $scope.sel_row['sel'] ={}
	        $scope.prev_temp_view = source_type;
         	$scope.Show_cmp_view = false
                $scope.sl_first_taxo	= {}
                $scope.sl_taxo_info     = {}
                $scope.er_cnts_index = {};
	        db	= 0
	        if(ttt){
	           db = 5
	        }
	        $scope.slcmp_info['cmd_info']	= data
	        $scope.sl_model			= data
	        $scope.sl_tap			= v;
                $scope.config.parent_scope.ps   = true;
                $scope.gridDataCompanyInfo.columnDefs =[]
                $scope.gridDataCompanyInfo.data =[]
	        if ($scope.sl_exhustive_tap['v'] == 'Split'){
                   var col_dat = {"oper_flag":$scope.cmd_ids.split_cmd,'CompanyID': $scope.slcmp_info['cmd_info']['CompanyID'],'Table_Type': '','UserID': $scope.user_id ,user_id: $scope.user_id,'db':db, 'tables':$scope.config.tabs}
                   var data = {'path': $scope.host, 'data': [col_dat],  'cmd_id' :$scope.cmd_ids.cgi_cmd}
                   tasService.ajax_request(data, 'POST', $scope.cl_bk_converation_pdata)
        	}else  if($scope.sl_exhustive_tap['v'] == 'List'){
                   if ( v != undefined){
                      var col_dat = {"oper_flag":$scope.cmd_ids.list_cmd,'CompanyID': $scope.slcmp_info['cmd_info']['CompanyID'],'Table_Type': $scope.sl_tap['table_type'],'UserID': $scope.user_id ,user_id: $scope.user_id,'db':db,'source_type':source_type, 'type':$scope.config.tabs}
                      var data = {'path': $scope.host, 'data': [col_dat],  'cmd_id' : $scope.cmd_ids.cgi_cmd}
                      tasService.ajax_request(data, 'POST', $scope.cl_bk_converation_pdata)
                    }
                   $scope.config.parent_scope.ps   = false;
                   //tasService.ajax_request(data, 'POST', $scope.cl_bk_converation_pdata)
                }else if($scope.sl_exhustive_tap['v'] == 'Taxonomy'){
                   var col_dat = {"oper_flag":$scope.cmd_ids.texo_1_cmd, 'CompanyID': $scope.slcmp_info['cmd_info']['CompanyID'], 'Table_Type':'', 'UserID': $scope.user_id , user_id: $scope.user_id, 'db':db, 'tables':$scope.config.tabs}
                   var data = {'path': $scope.host, 'data': [col_dat],  'cmd_id' :$scope.cmd_ids.cgi_cmd}
                   $scope.config.parent_scope.ps  = true;
                   tasService.ajax_request(data, 'POST', function(res){
                   $scope.config.parent_scope.ps  = false;
                          $scope.gridDataCompanyInfo.columnDefs =[]
                          $scope.gridDataCompanyInfo.data =[]
                          $scope.data_lists=[]
                          $scope.data_lists = res['data']['data']
                          $scope.taxonomy_map = res['data']['map']
                          $scope.sel_taxo_data = res['data']
                          $scope.change_taxo_view($scope.data_lists[0]) 
                          $scope.se_row_data['sel'] = $scope.data_lists[0]
                   })
	        }
	 }
 
	/***********************************/
         $scope.filter_taxo = {}
         $scope.search_like_taxo = function(){
               $scope.gridDataCompanyInfo.columnDefs =[]
               $scope.gridDataCompanyInfo.data =[]
               if(!$scope.filter_taxo['t']){
			return;
                }
               var col_dat = {"oper_flag":$scope.cmd_ids.texo_grid_cmd, 'CompanyID': $scope.slcmp_info['cmd_info']['CompanyID'], 'Table_Type': $scope.sl_tap['table_type'], 'UserID': $scope.user_id , user_id: $scope.user_id, 'taxo': $scope.filter_taxo['t'],'like':'1'}
               var data = {'path': $scope.host, 'data': [col_dat],  'cmd_id' :$scope.cmd_ids.cgi_cmd}
                   $scope.config.parent_scope.ps  = true;
                   tasService.ajax_request(data, 'POST', function(res){
                   $scope.config.parent_scope.ps  = false;
                   tasService.ajax_request(data, 'POST', $scope.cl_bk_converation_pdata)
                   })
         }
	/***********************************/
         $scope.change_taxo_view = function(d){
		$scope.sl_taxonomy_lst = d;
                var table_lst	= $scope.taxonomy_map[$scope.sl_taxonomy_lst];
                var col_dat = {"oper_flag":$scope.cmd_ids.texo_grid_cmd,'CompanyID': $scope.slcmp_info['cmd_info']['CompanyID'],'table_types': table_lst,'taxo': $scope.sl_taxonomy_lst}
                var data = {'path': $scope.host, 'data': [col_dat],  'cmd_id' :$scope.cmd_ids.cgi_cmd}
                tasService.ajax_request(data, 'POST', $scope.cl_bk_converation_pdata)
	}
	/***********************************/
        $scope.sl_exhustive_tap ={}
        $scope.move_direct = function(company_id){
               $scope.sl_period_type = {'t':{}}
               if(!$scope.sl_exhustive_tap['v']){
                        $scope.sl_exhustive_tap = $scope.exhustive_changes[0]
                 }
               //$scope.project_id = $scope.config.parent_scope.slcted_indus_dic['project_id']
               $scope.project_id = $scope.config.parent_scope.slcted_comp_dic['model_id']
               $scope.selceted_doc_name = $scope.config.parent_scope.slcted_rca_dic.t.doc_name       
               
               var post_data = {'CompanyID': company_id, 'oper_flag':$scope.cmd_ids.grid_type_cmd, 'tables': $scope.config.tabs}
               var data = {'path': $scope.host, 'data': [post_data],  'cmd_id' : $scope.cmd_ids.cgi_cmd}
               $scope.config.parent_scope.ps  = true;
               tasService.ajax_request(data, 'POST', function(res){ 
                         $scope.config.parent_scope.ps  = false;
                         $scope.show_exhaustive_view(res,[],"ttt","Project Update")
                })
        }
	/***********************************/
        $scope.cl_bk_converation_pdata  	= function(response){
               $scope.config.parent_scope.ps  = false; 
	       if(response['data']){
			$scope.sl_pgrid         	= {}
			$scope.main_grid_full_res_data  = response['data'];
			var res_phdata = response['data']['phs'] || [];
                        var tt_data 			= $scope.make_grid_header(res_phdata,1)	
                        $scope.gridDataCompanyInfo.columnDefs = tt_data
                        $scope.gridDataCompanyInfo.data = response['data']['data']
                        $timeout(function(){
                               $scope.gridApi.treeBase.expandAllRows()
                               $scope.cellhighlights(response['data']['data'][0],'Description')
			})
	       }else{tasAlert.show(res['message'], 'error', '');}
	}
	/***********************************/
        $scope.gridDataCompanyInfo = {
               rowHeight:35, enableFiltering:true, noUnselect : false, enableSorting:false, showTreeExpandNoChildren:false, enableHorizontalScrollbar: 1, showTreeRowHeader: false, enableRowHeaderSelection: false, enableGroupHeaderSelection: false, enableColumnMenus: false, columnDefs:[],
               onRegisterApi: function (gridApi) {
                 $scope.gridApi = gridApi;
               }                           
        }  
	/***********************************/
	$scope.expandAllFunc = function(flg){
               if(!flg)
                        $scope.gridApi.treeBase.expandAllRows();
               else
                        $scope.gridApi.treeBase.collapseAllRows();
               $scope.setExpandedROwsComp()
    	}
    	/***********************************/
    	$scope.toggleRow3 = function(row, evt){
               uiGridTreeBaseService.toggleRowTreeState($scope.gridApi.grid, row, evt);
               //$scope.setExpandedROwsComp()
    	}
    	/***********************************/
        $scope.setExpandedROwsComp = function(){
               var rows = $scope.gridApi.grid.rows
               var expanded_rows = rows.filter(function (el) { if(el.entity.hasChild && el.treeNode.state == "expanded") return el; }) || []
               var expanded_rows_index = []
               if (expanded_rows.length){
                  expanded_rows_index = expanded_rows.map(function (el) { return $scope.gridOptions.data.indexOf(el.entity) }) || []
               }
               sessionStorage['expanded_rows_index'] = JSON.stringify(expanded_rows_index)
        }

        /***********************************/
    	$scope.repeat_cell_func = function(id){
               id = id['$$treeLevel']
	       if(id ==0  ){
        	   return [];
    	       }else{
        	   var data = [];
        	   for(var a=0, a_l=id; a<a_l; a++){
            			data.push(a);
        	   }
        	  return data;
    	       }
    	}
        /***********************************/
        $scope.make_grid_header = function(new_ph_lists){
               var gridOptions_comp_data = []
               for(var data=0,d_l = new_ph_lists.length; data<d_l; data++){
                  sdicts ={}
                  sdicts['field'] = new_ph_lists[data]['k']
                  sdicts['displayName'] = new_ph_lists[data]['k']
                  sdicts['pinnedRight'] = false
                  sdicts['cellEditableCondition'] = false
                  sdicts['headerCellClass'] = 'hdr_cntr'
                  if ( new_ph_lists[data]['k'] == 'Description'){
                     sdicts['width'] = '*'
                     sdicts['minWidth'] = 500 
                     sdicts['pinnedLeft'] = true
                     sdicts['headerCellTemplate']= `
			    <div ng-class="{ 'sortable': sortable }">
			       <div style="float: left;color: #000;cursor: pointer;width: 26px;height: 100%;text-align: center;padding-left: 4px;padding-top: 6px;" ng-click="grid.appScope.expandAllFunc(grid.treeBase.expandAll)" ng-if="grid.options.enableExpandAll">
			         <i  ng-class="{'fa fa-minus': grid.treeBase.numberLevels > 0 && grid.treeBase.expandAll, 'fa fa-plus': grid.treeBase.numberLevels > 0 && !grid.treeBase.expandAll}" style="color:#293238;"></i> &nbsp;
		  	       </div>
			       <div role="button" tabindex="0" ng-keydown="handleKeyDown($event)" class="ui-grid-cell-contents ui-grid-header-cell-primary-focus" col-index="renderIndex">
			          <span class="ui-grid-header-cell-label ng-binding" ui-grid-one-bind-id-grid="col.uid + '-header-text'">Description</span>
			       </div>
			       <div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">
			          <input type="text" class="ui-grid-filter-input" ng-model="colFilter.term"/>
			          <div class="ui-grid-filter-button" ng-click="colFilter.term = null">
			            <i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i>
			          </div>
			       </div>
			  </div>`,
                     sdicts['cellTemplate'] = `
			  <div style="float:left;" class="ui-grid-tree-base-row-header-buttons slt_box_of_tgle slt_box_of_tgle_{{l_id}}" ng-repeat="l_id in grid.appScope.repeat_cell_func(row.entity)" ng-if="grid.treeBase.numberLevels > 0">&nbsp;</div>
			  <div ng-if="grid.treeBase.numberLevels > 0" style="float:left;color: #000;padding-top: 10px;cursor: pointer;height: 100%;" class="ui-grid-tree-base-row-header-buttons slt_box_of_tgle slt_box_of_tgle_{{row.entity.$$treeLevel}}" ng-class="{'ui-grid-tree-base-header': row.treeLevel > -1}" ng-click="grid.appScope.toggleRow3(row, $event);$event.stopPropagation();$event.preventDefault();"><i class="slt_icon" ng-class="{'fa fa-minus': ( ( grid.options.showTreeExpandNoChildren && row.treeLevel > -1 ) || ( row.treeNode.children && row.treeNode.children.length > 0 ) ) && row.treeNode.state === 'expanded', 'fa fa-plus': ( ( grid.options.showTreeExpandNoChildren && row.treeLevel > -1 ) || ( row.treeNode.children && row.treeNode.children.length > 0 ) ) && row.treeNode.state === 'collapsed'}"  level1="{{row.entity.level_id}}" header="{{row.entity.header == 'Y'}}"></i> &nbsp;</div>
                          <div class="ui-grid-cell-contents row_col_grid_cell data column_data_desc" ng-class="{'active': grid.appScope.sel_row['sel']['sn'] == row.entity.sn, 'active_cell':grid.appScope.sel_id ==  row.entity.sn+'_'+col.field, 'has_senten':(COL_FIELD.s_sent && (COL_FIELD.s_sent.length > 0))}" ng-click="grid.appScope.cellhighlights(row.entity,col.field)" id="{{row.entity.sn+'_'+col.field}}" >
                              <div class="ui_grid_cell_text" title="{{COL_FIELD['value']}}">
                                 {{COL_FIELD['value']}}
                              </div>
                              <div class="ui_grid_cell_image" title="Graph View">
                               <!--  <span class="lc_btn_grp" ng-click="grid.appScope.grp_view_func(row.entity, 'Description');$event.stopPropagation();" title="Graph view"><img src="src/images/line.png" style="width: 22px;"></span>-->
                                 <span class="lc_btn_grp" ng-click="grid.appScope.cellhighlights(row.entity,col.field, 'graph');$event.stopPropagation();" title="Graph view"><img src="src/images/line.png" style="width: 22px;"></span>
                              </div>
                              <div class="ui_grid_cell_texo" ng-if="(grid.getCellValue(row, col).scale || grid.getCellValue(row, col).currency)">
                                 <div class="ui_grid_cell_texo1" title="{{COL_FIELD['scale']+', '+COL_FIELD['currency']}}">
                                     {{COL_FIELD['scale']+', '+COL_FIELD['currency']}}
                                 </div>
                              </div>
                          </div>`
                  }else{
                     sdicts['pinnedLeft' ] = false
                     sdicts['width'] = 100
                     sdicts['cellTemplate'] = `<div class="ui-grid-cell-contents row_col_grid_cell data column_data" ng-class="{'active': grid.appScope.sel_row['sel']['sn'] == row.entity.sn, 'active_cell':grid.appScope.sel_id ==  row.entity.sn+'_'+col.field, 'has_senten':(COL_FIELD.s_sent && (COL_FIELD.s_sent.length > 0)) ,'multi_val': ( row.entity[col['field']]['value'] &&  row.entity[col['field']]['value'].indexOf('<br>') != -1), 'has_formula':COL_FIELD.f_col == 'Y'}" ng-click="grid.appScope.cellhighlights(row.entity,col.field)" id="{{row.entity.sn+'_'+col.field}}" title="{{COL_FIELD['value']}}" ng-bind-html ="COL_FIELD['value']">
                                               </div>`
                  }
                  sdicts['filters']=[{
                        condition: function(term, value, row, column){
                              if(column.field in row.entity){
                                    var c_val   = (row.entity[column.field]['value']||'').toLocaleLowerCase()
                                    var t_val   = term.toLocaleLowerCase().replace(/[\\]/g,'')
			            return (c_val.indexOf(t_val) != -1)
                              }else{
                                   return false
                              }
                        }
                  }];

           gridOptions_comp_data.push(sdicts)
        }
       return gridOptions_comp_data 
       //$scope.gridDataCompanyInfo.columnDefs = gridOptions_comp_data
     }
    /***********************************/ 
     $scope.sl_pgrid	     = {}
     $scope.sl_ph_view	= ''
     $scope.sel_row = {'sel':{}}
     $scope.sel_id = ''
     $scope.sel_row_data = {}
     $scope.sel_ph_data =''
     $scope.cellhighlights = function(row,ph,ind,down){
            $timeout(function(){$scope.refOptionsToc.scope.clear_pdf_highlight("iframe_info");})
            $scope.sel_sen['sel_row']={}
            $scope.sel_row_data = row
            $scope.sel_ph_data = ph
            $scope.available_dicts = {}
            $scope.sen_val ={}
            $scope.sen_head =[] 
            $scope.sl_pgrid		= row
            $scope.pop_up_flags = true
            $scope.sel_id = String(row['sn'])+'_'+ph
            $scope.sl_sub_tap = $scope.sub_taps[0]
            $scope.sel_row['sel'] = row
            var sel_data = row[ph]||{}
            if (sel_data == undefined || sel_data == ''){               
                     $scope.refOptionsToc.path = 'src/no_ref_found.html'
                     $timeout(function(){$scope.refOptionsToc.scope.iframe_page_no_change($scope.refOptionsToc) });
                     return
            }

            if(sel_data['f_col'] == 'Y'){
                        $scope.fm_val   = sel_data['f_val'];
                        $scope.available_dicts['Formula'] = true
            }else{
                        $scope.fm_val   = []
                        $scope.available_dicts['Formula'] = false
            }

            if(sel_data['re_stated'] == 'Y'){
                        $scope.re_stat   = sel_data['re_stated'];
                        $scope.available_dicts['Re-statement'] = true
            }else{
                        $scope.re_stat   = []
                        $scope.available_dicts['Re-statement'] = false
            }



            if( ph =='Description'){$scope.available_dicts['Graph View'] = true}
            else{$scope.available_dicts['Graph View'] = false}
            if (sel_data['s_sent'] &&  (sel_data['s_sent'].length > 0)){
               $scope.available_dicts['Sentences'] = true
               $scope.sen_head = ['Description'];
               $scope.sen_val = sel_data['s_sent'];
            }
            else{$scope.available_dicts['Sentences'] = false}
            if(sel_data['hf'] == 'html'){
               $scope.highlight_html_data(row,ph,ind,down)
            }else{
               if (sel_data['page_no'] == undefined || sel_data['page_no'] == ''){
                  $scope.refOptionsToc.path = 'src/no_ref_found.html'
               }else{
                  $timeout(function(){
			var dic_vals ={}
			dic_vals['bbox'] = sel_data['coord'];
			dic_vals['bg'] = 'rgba(243, 230, 88, 0.407843);';
			dic_vals['border'] =  ['2px', 'solid', 'red'].join(' ');
			dic_vals['coord'] = sel_data['p_coord']
			dic_vals['clr_flg'] = true;
			dic_vals['p_pno'] = 1
			$scope.refOptionsToc['ref'] = [dic_vals]
			$scope.refOptionsToc.selected_pno = sel_data['page_no']
			$scope.refOptionsToc.path = '/pdf_canvas/viewer.html?file='+ "/ref_path/"+$scope.project_id+"/1/pdata/docs/"+sel_data['doc_id']+"/pages/"+sel_data['page_no']+".pdf"
			$scope.refOptionsToc.scope.iframe_page_no_change($scope.refOptionsToc)
                  });
               }
            }
       if (ind == 'graph'){
               $scope.grp_view_func(row, 'Description')
               return
            }
     }
    /***********************************/
     $scope.highlight_html_data = function(row,ph,ind,down) {
           if (row[ph]['page_no'] == undefined || row[ph]['page_no'] == ''){
              $scope.refOptionsToc.path = 'src/no_ref_found.html'
           }else{
            $timeout(function(){
              $scope.refOptionsToc.html_type = 'html'
              $scope.refOptionsToc.active = 'html'  
              var htmml_path = "ref_path/"+$scope.project_id+"/1/pdata/docs/"+row[ph]['doc_id']+"/html/"+row[ph]['doc_id']+"_slt.html"
              $scope.refOptionsToc.path = htmml_path
              var cordss = row[ph]['coord']
              var xml_lists =[]
              var id_lists = []
              for (var v=0, v_l=cordss.length; v<v_l; v++){
                var ech_val = cordss[Number(v)].split('~');
                if(ech_val.length == 1){
                  ech_val= [ech_val[0],"0_0"];
                }
                xml_lists.push(ech_val[0])
                id_lists.push(ech_val[1])
              }
              sdicts = {}
              sdicts['c'] = id_lists
              sdicts['xml_list'] = xml_lists
              sdicts['bbox'] = [[]]
              sdicts['coord'] = []
              sdicts['bg'] ='rgba(243, 230, 88, 0.407843)';
       	      sdicts['border']=  ['1px', 'solid', 'red'].join(' ');
	      sdicts['c_name']= ''
	      sdicts['clr_flg'] =true;
	      sdicts['x']= ''
              $scope.refOptionsToc['ref'] =  [sdicts];
              $scope.refOptionsToc.page_no = row[ph]['page_no'];
              $scope.refOptionsToc.scope.iframe_page_no_change($scope.refOptionsToc)
            });
           }
     }
    /***********************************/
     $scope.sl_sub_tap  ={}
     $scope.change_sub_taps	= function(v){
	   $scope.sl_sub_tap	= v;
	   $scope.its_frm_grp_view = false;
           $scope.fl_lc_selection	= ''
	   if(v['n'] == 'Formula'){
		//$scope.lc_data_hl(1,$scope.fm_val[0], 0)	
		//return
	   }else if(v['n'] == 'Re-statement'){
		//$scope.lc_data_hl(1,$scope.lc_info_data[0], 0)	
	   }else if(v['n'] == 'Traceback'){
		//$scope.get_xml_ids();
           }else if(v['n'] == 'Reference'){
                $scope.cellhighlights($scope.sel_row_data , $scope.sel_ph_data)
	   }else if(v['n'] == 'Graph View'){
                $scope.its_frm_grp_view = true;
                $scope.grp_view_func($scope.sl_pgrid, 'Description');
	   }else if(v['n'] == 'Sentences'){                       
		$timeout(function(){
		  var dom = document.querySelector('.formulatable tbody tr:first-child')
		  if(dom)
			dom.click()
		})
          }
    }
    /***********************************/
     $scope.grp_view_func = function(row, k){
            $scope.cell_active_l_chnge_val = null;
	    $scope.load_chart_graph(row, $scope.main_grid_full_res_data['phs'], 'graph_view-canvas');
	    $scope.sl_sub_tap = {'n': 'Graph View'};
            $scope.its_frm_grp_view = true;
     }
    /***********************************/
     $scope.load_chart_graph     = function(row, phs, ID, flg){
            var data            = []
            var map_data        = {}
            var all_key         = {}
            var tmpd            = row
            var type            = flg == 'spike'?'line':'bar';
	    for (var i=0,l=phs.length;i<l;i++){
                ph_row   = phs[i];
                k = ph_row['k'];
                if(!tmpd[k] || !tmpd[k]['value'] || k == 'Description') continue
                map_data[Number(k.slice(2))] = 1
                all_key[k.slice(0, 2)] = 1
            }
            var year            = Object.keys(map_data)
            year.sort(function(a,b) {
                return b > a
            })
            var od_idc  = {'Q1':8,'Q2':7,'H1':6,'Q3':5 ,'M9':4,'Q4':3,'H2':2,'FY':1}
            var all_keys_order = Object.keys(all_key)
            all_keys_order.sort(function(a,b){
                return (od_idc[a] - od_idc[b])
            })
            var data = []
            var temp = [k]
            var st = 1;
            for(var j=0 ,lk = all_keys_order.length;j<lk;j++){
                var k = all_keys_order[j]
                temp = []
                temp1 = []
                for(var i=0,l=year.length;i<l;i++){
                    var th  = k+year[i]
                    if(th in tmpd){
                        var num = tmpd[th]['value'];
                        if(tmpd[th]['value'].charAt(0) == '('){
                                num = '-'+tmpd[th]['value'].slice(1,-1);
                        }
                        temp.push(Number((''+num).replace(/,/g, '')))
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
                    var dom = document.getElementById(ID);
                    dom.parentNode.innerHTML    = '<canvas id="'+ID+'"></canvas>';
                    // $scope.highlight_graph(ID, data, type, year, 'Y');
                    window.load_canvas_chart(ID, data, type, year, 'Y');
           });
        }
    /***********************************/
     window.chartColors = {
        c0: 'rgb(33, 118, 181)',
        c1: 'rgb(255, 99, 132)',
        c2: 'rgb(248, 127, 14)',
        c3: 'rgb(144, 237, 125)',
        c4: 'rgb(247, 163, 92)',
        c5: 'rgb(128, 133, 233)',
        c6: 'rgb(139, 85, 75)',
        c7: 'rgb(228, 118, 195)',
        c8: 'rgb(255, 99, 132)',
        c9: 'rgb(255, 159, 64)',
        c10: 'rgb(255, 205, 86)',
        c11: 'rgb(75, 192, 192)',
        c12: 'rgb(54, 162, 235)',
        c13: 'rgb(153, 102, 255)',
        c14: 'rgb(231,233,237)',
        c15: 'rgb(46, 160, 45)',
        c16: 'rgb(214, 40, 40)',
        c17: 'rgb(148, 102, 189)',
    };

    /***********************************/
     function handleClick(c){
	var activePoints = this.getElementsAtEventForMode(c, 'point', this.options);
	if(activePoints.length>0){
        	var firstPoint = activePoints[0];
        	var label = this.data.labels[firstPoint._index];
                var value = this.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
		window.clicked_bar_data_func(this.data.datasets, firstPoint._datasetIndex, firstPoint._index);	
	}
}
    /***********************************/
      window.load_canvas_chart = function(iD, data, type, labels, flg, title, dropid){
            var ks  = Object.keys(window.chartColors)
            var l   = ks.length;
            var c_ix = 0
            if (0 && dropid)
                c_ix    = order_d[dropid]
                c_ix    += c_ix?1:0
            data    = data.map(function(val){
                            val.backgroundColor = window.chartColors['c'+c_ix];
                            val.borderColor = window.chartColors['c'+c_ix];
                            val.pointBackgroundColor    =  (c_ix < l)?window.chartColors['c'+(c_ix+1)]:window.chartColors['c0'];
                            c_ix    += 1;
                            if(c_ix == l)
                                c_ix = 0
                            return val
                        });
             var option = {
                 tooltips: {
                     mode: 'index',
                     intersect: false,
                     bodyFontFamily: "Gotham SSm A,Gotham SSm B,sans-serif",
                 },
                 legend: {
                     labels: {
                         fontFamily: "Gotham SSm A,Gotham SSm B,sans-serif",
                     }
                 },
                 scales: {
                     xAxes: [{
                         maxBarThickness: 50,
                         ticks: {
                             fontFamily: "Gotham SSm A,Gotham SSm B,sans-serif",
                         },
                     }],
                     yAxes: [{
                         ticks: {
                             fontFamily: "Gotham SSm A,Gotham SSm B,sans-serif",
                         },
                     }]
                 },
		 onClick: handleClick
             }
            if(title != undefined){
                option['title'] = {
                                display: true,
                                text: title

                                }
                option['scales']['xAxes'][0]['barPercentage']  = 1.0;
            }
            if (!flg)
                option  = spark
            var ctx = document.getElementById(iD);
            var mychart = new Chart(ctx, {
                type: type,
                data: {
                    labels: labels,
                    datasets: data
                },
                options: option,
            });
     }
    /***********************************/
     $scope.fl_lc_selection	= ''
     $scope.lc_data_hl   = function(evnt,data,index){
     }
    /***********************************/
     $scope.se_row_data={'sel':{}}
     $scope.display_data = function(type){
            $scope.sel_id = ''
            $scope.sl_sub_tap ={}
            $scope.available_dicts = {}
            $scope.sen_val ={}
            $scope.sen_head =[]
            $scope.se_row_data['sel'] = type
            $scope.sel_row['sel'] ={}
            $scope.change_taxo_view(type)
    }
    /***********************************/
     $scope.sel_sen = {'sel_row': {}}
     $scope.sen_data_hl = function(event_data,info, vind){
           $scope.sel_sen['sel_row'] = info
           var  xml_lists =[]
           var id_lists =[]
           var cordss = info['bbox']
           if (info['page_no'] == undefined || info['page_no'] == ''){
                           $scope.refOptionsToc.path = 'src/no_ref_found.html'
           }else {
              if (info['hf'] == 'html'){
                 //for ( v in cordss){
		 for(var v=0, v_l= cordss.length; v<v_l; v++){
                   var ech_val = cordss[v].split('~');
                   if(ech_val.length == 1){
                      ech_val= [ech_val[0],"0_0"];
                   }
                   xml_lists.push(ech_val[0])
                   id_lists.push(ech_val[1])
                 }
                 var htmml_path = "ref_path/"+$scope.project_id+"/1/pdata/docs/"+info['doc_id']+"/html/"+info['doc_id']+"_slt.html"
                 $scope.refOptionsToc.path = htmml_path
                 sdicts = {}
                 sdicts['c'] =  id_lists
                 sdicts['xml_list'] = xml_lists
                 sdicts['bbox'] = [[]]
                 sdicts['coord'] = []
                 sdicts['bg'] ='rgba(243, 230, 88, 0.407843)';
                 sdicts['border']=  ['1px', 'solid', 'red'].join(' ');
                 sdicts['c_name']= ''
                 sdicts['clr_flg'] =true;
                 sdicts['x']= ''
                 $scope.refOptionsToc['ref'] =  [sdicts];
                 $scope.refOptionsToc.page_no = info['page_no'];  
              }else if(info['hf'] == 'pdf'){
                 var dic_vals ={}
                 dic_vals['bbox']    = cordss;
                 dic_vals['bg']      = 'rgba(243, 230, 88, 0.407843);';
                 dic_vals['border']  = ['2px', 'solid', 'red'].join(' ');
                 dic_vals['coord']   = info['p_coord']
                 dic_vals['clr_flg'] = true;
                 dic_vals['p_pno']   = 1
                 $scope.refOptionsToc['ref'] = [dic_vals]
                 $scope.refOptionsToc.selected_pno = info['page_no']
                 $scope.refOptionsToc.path = '/pdf_canvas/viewer.html?file='+ "/ref_path/"+$scope.project_id+"/1/pdata/docs/"+info['doc_id']+"/pages/"+info['page_no']+".pdf"
              }
           }
          $scope.refOptionsToc.scope.iframe_page_no_change($scope.refOptionsToc);
     }
    /***********************************/
     $scope.do_resize = function(){         
            $timeout(function(){
                    window.dispatchEvent(new Event('resize'));
            });
     }
    /***********************************/
    $scope.filterRow = {};
    $scope.filterRow['val'] = '';
    $scope.entered_data = ''
    $scope.selected_drop_down = ''
    $scope.filterRowFunc = function(sel) {
        if (sel == 'year'){
           $scope.annual_report = $filter('filter')($scope.annual_report_copy, $scope.entered_data, undefined);
        }
        else if(sel == 'drop_d'){
          
           $scope.exhaustive_taps = $filter('filter')($scope.exhaustive_taps_copy, $scope.selected_drop_down, undefined);
        }
    };
    /***********************************/
})
app.directive('informationsUnits', function(){
        return {
                restrict: 'AE',
                template:`
                  <div class="info_units">
                    <script type="text/ng-template" id = "headers.html">
                        <div   class="content_class">
                               <div  ng-repeat="tap in sub_taps"  class="header_class" ng-click="change_sub_taps(tap)" ng-class="{active: sl_sub_tap['n'] == tap['n'], 'display_class': available_dicts[tap['n']]== false}" title="{{tap['n']}}">
                                     <a>{{tap['n']}}</a>
                               </div>
                        </div>
			 <div class="content_class1" ng-if="0">
			    <div   class="header_class2">
				doc_name: {{selceted_doc_name}}
			    </div>
			</div>
			<div class="content_class2">
			     <div class="close_button" ng-click="close_pop_up()">
				 <i class="fa fa-angle-down" aria-hidden="true"></i>
			     </div>
			</div>
                    </script>

                    <script type ="text/ng-template" id="Reference.html">
                          <ref-div config="refOptionsToc"> </ref-div>
                    </script>

                    <script type ="text/ng-template" id="Formula.html">
                          <div class="grp_contents">
			      <table class="table_data data">
		                  <thead>
				       <tr>
					   <th ng-repeat="v in fm_head">{{v['n']}}</th>
				       </tr>
				  </thead>
				  <tbody>
					<tr ng-click="sen_data_hl($event,info, vind)" class="make_bold"  ng-repeat="info in fm_val" ng-class="{active: sel_sen['sel_row']['row_id'] == info['row_id']}">
					    <td style="text-align: left;" ng-bind-html="info['label']" title="{{info['label']}}"></td>
					</tr>
				  </tbody>
		              </table>
		          </div>
			  <div class="doc_display">
			       <ref-div config="refOptionsToc"> </ref-div>
		          </div>
                    </script>

                    <script type ="text/ng-template" id="Sentences.html">
                            <div class="grp_contents">
				  <table class="table_data data">
				    <thead>
				       <tr>
					   <th ng-repeat="v in sen_head">{{v}}</th>
				       </tr>
				    </thead>
				    <tbody>
					<tr ng-click="sen_data_hl($event,info, vind)" class="make_bold" ng-init="vind = $index" ng-repeat="info in sen_val"  ng-class="{active: sel_sen['sel_row']['row_id'] == info['row_id']}">
					    <td style="text-align: left;" ng-bind-html="info['label']" title="{{info['label']}}"></td>
					</tr>
				    </tbody>
				  </table>

			    </div>
			    <div class="doc_display">
			         <ref-div config="refOptionsToc"> </ref-div>
			    </div>
                    </script>

                    <script type ="text/ng-template" id="Graphview.html">
                             <div class="grp_contents">
				   <div class="graph_container">
				     <canvas id="graph_view-canvas"></canvas>
				   </div>
			     </div>
			     <div class="doc_display">
				  <ref-div config="refOptionsToc"> </ref-div>
			     </div>

                    </script>

                    <div class="tas_container_routes" > 
                        <div class="view_container" style="height:100%;">  
                             <div class="gridview_report_header">
                                 <div class="cc_ts">
                                       <div  ng-repeat="v in exhustive_changes" class="main_hdr_list_box">
                                            <div class="main_hdr_list" ng-click="change_exhustive_tap(v)" ng-class="{'active': sl_exhustive_tap['v'] == v['v']}" title="{{v['v']}}" >
                                                   <a class="">
                                                    <span class="{{v['i']+' Adijust_icons'}}"></span>&nbsp;&nbsp{{v['v']}}</a>
                                            </div>
                                       </div>
                                 </div>
                                 <div class="drop"> 
                                   <div class="dropdown pull-left" style="width: 150px;color: white;">
                                      <div class="header-icon waves-effect dropdown-toggle header-icon-sec" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 30px;line-height: 30px;color: #ffffff;background: #96b1c6;">
                                        <div class="header_icon_txt">{{sl_period_type['t']['n']||'Select Period'}}</div>
                                      </div>
                                   <div class="dropdown-menu dropdown-menu-tas" style="width: auto;">
                                      <div class="md-form md-form-tas" style="margin: 5px 15px;">
                                                <input class="form-control" type="text" placeholder="Search" aria-label="Search" ng-model="entered_data" style="font-size: 14px;" autofocus ng-keyup="enter($event)" ng-change="filterRowFunc('year')">
                                      </div>
                                      <div class="dropdown-item-tas waves-effect" style="padding: .25rem 0px .25rem 1rem;" ng-repeat="rw in annual_report  track by $index" ng-class="{active: sl_period_type['t']['n']==rw['n']}"ng-click="filter_periodic_years(rw)">{{rw['n']}}</div>
                                   </div>
                                 </div>
                                   
                                 <div class="dropdown pull-left" style="width: calc(350px - 150px);color: white;">
                                   <div class="header-icon waves-effect dropdown-toggle header-icon-sec" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 30px;line-height: 30px;color: #ffffff;background: #96b1c6;">
                                        <div class="header_icon_txt">{{sel_type[0]['table_type']}}</div>
                                   </div>
                                   <div class="dropdown-menu dropdown-menu-tas" style="width: auto;">
                                        <div class="md-form md-form-tas" style="margin: 5px 15px;">
                                                <input class="form-control" type="text" placeholder="Search" aria-label="Search" ng-model="selected_drop_down" style="font-size: 14px;" autofocus ng-change="filterRowFunc('drop_d')">
                                        </div>
                                        <div class="dropdown-item-tas waves-effect" style="padding: .25rem 0px .25rem 1rem;" ng-repeat="rw in exhaustive_taps track by $index" ng-class="{active: sel_type[0]['table_type'] == rw['table_type']}" ng-click="change_exhaustive_dropdown(rw)">{{rw['table_type']}}</div>
                                   </div>
                                 </div>
                               </div>
                             </div>
                                 <div class="data_div" ng-if="sl_exhustive_tap['v'] == 'List'">
                                   <div class="data_div_table" ng-class="{active: pop_up_flags ==  false}">
                                      <div class="grid_sel_div">
                                            <div class="topic_cvr" ng-repeat="tb_class  in selected_cmp_id['aorder'] track by $index" >
		                                 <div class="pheader ls_v_header" aria-expanded="true"  data-toggle="collapse" data-target="{{'#New_sec_level_sub_'+$index+ sind}}" >
                                                  
					           <!--<i class="level_icon_2 fa {{hc_cate[tb_class]}} fa-file-text-o"   aria-hidden="true" style="float:left"></i><div class="pn make_inline mt3p" title="{{tb_class}}">{{RCA_table_change[tb_class]||tb_class}}</div>-->
					           <i class="level_icon_2 fa {{hc_cate[tb_class]}} {{sen_icons[tb_class]}}" ng-class="{'fa-file-text-o': sen_icons[tb_class] == undefined}"   aria-hidden="true" style="float:left"></i><div class="pn make_inline mt3p" title="{{tb_class}}">{{RCA_table_change[tb_class]||tb_class}}</div>
		                                 </div>
		<div class="subloop_an collapse" aria-expanded="false"  id="{{'New_sec_level_sub_'+$index+sind}}" ng-class="{show : tb_class == selected_grid_header}">
		       <div class="tap make_inlinelevel_n table_typecl ls_vw" ng-repeat="tap in selected_cmp_id['taps_temp'][tb_class]"  ng-click="change_exhaustive_dropdown(tap)" ng-class="{'active': sl_exhaustive_grid['t']['table_type'] == tap['table_type'] }" title="{{tap['table_type']}}"><i class="fa fa-database sel_data"></i> <span>{{tap['table_type']}}</span>  
		       </div>
		</div>
	    </div>
                                      </div>
                                      <div class="table_data_display">
                                           <div ui-grid="gridDataCompanyInfo"  class="grid_user"  ui-grid-auto-resize ui-grid-resize-columns ui-grid-tree-view ui-grid-pinning style="width:100%; height:100%" ></div>
                                      </div>
                                   </div>
                                    <div class="pdf_div" ng-class="{active: pop_up_flags}">
                                         <div class="pdata_sidebar"> 
									<div class="frheader">
                                                                                <ng-include src="'headers.html'"></ng-include>
									</div>
                                                                       <div class="frbody" ng-if="sl_sub_tap['n'] == 'Reference'">
                                                                                <ng-include src="'Reference.html'"></ng-include>
                                                                        </div>
                                                                        <div class="frbody" ng-if="sl_sub_tap['n'] == 'Formula'">
                                                                                <ng-include src="'Formula.html'"></ng-include>
                                                                        </div>

                                                                        <div class="frbody" ng-if="sl_sub_tap['n'] == 'Sentences'">
                                                                                <ng-include src="'Sentences.html'"></ng-include>
                                                                                        
                                                                        </div>
                                                                        <div class="frbody" ng-if="sl_sub_tap['n'] == 'Graph View'">
                                                                                <ng-include src="'Graphview.html'"></ng-include>
                                                                        </div>
								</div>
                                   </div>
                                   </div>
                                 <div class="data_div" ng-if="sl_exhustive_tap['v'] == 'Split'">
                                      <div class="contnet_div">
                                          <div ui-grid="gridDataCompanyInfo"  class="grid_user"  ui-grid-auto-resize ui-grid-resize-columns ui-grid-tree-view ui-grid-pinning  gridDataCompanyInfo style="width:100%; height:100%" ></div>
                                      </div>
                                      <div class="contnet_div_pdf">
                                           <div class="pdata_sidebar">
                                             <div class="frheader">
                                                                                        <div   class="content_class">
                                                                                            <div  ng-repeat="tap in sub_taps"  class="header_class" ng-click="change_sub_taps(tap)" ng-class="{active: sl_sub_tap['n'] == tap['n'],  'display_class': available_dicts[tap['n']]== false}" title="{{tap['n']}}">
                                                                                                <a>{{tap['n']}}</a>
                                                                                            </div>
                                                                                         </div>
                                             </div>        
                                             <div class="frbody" ng-if="sl_sub_tap['n'] == 'Reference'">
                                                                 <ng-include src="'Reference.html'"></ng-include>
                                             </div>
                                             <div class="frbody" ng-if="sl_sub_tap['n'] == 'Formula'">
                                                                 <ng-include src="'Formula.html'"></ng-include>
                                             </div>
                                             <div class="frbody" ng-if="sl_sub_tap['n'] == 'Sentences'">
                                                                 <ng-include src="'Sentences.html'"></ng-include>
                                             </div>
                                             <div class="frbody" ng-if="sl_sub_tap['n'] == 'Graph View'">
                                                                 <ng-include src="'Graphview.html'"></ng-include> 
                                             </div>
 
                                           </div>
                                      </div>
                                 </div>
                                 <div class="data_div" ng-if="sl_exhustive_tap['v'] == 'Taxonomy'">
                                        
                                       <div class="contnet_div_taxo">
                                                <div class="sel_div">
                                                      <div class="serach_div">
                                                       <div class="pull-left" style="width: calc(100% - 65px);height: 50px ">
							<input type="text" ng-model="filter_taxo['t']" class="pull-right serarech_taxonomy" placeholder="Seacrh Taxonomy"/>                                             </div>
                                                       <div class="pull-right" style="width: 65px; height: 50px ">
                                                         <button class="pull-left"  style="padding: 6.7px 10px;margin-top: 10px; background-color: #84a6c3 !important; border-radius:3px; box-shadow: none !important; color: white; border:none; height: 30px;"ng-click="search_like_taxo()">Search</button>
                                                       </div>
                                                      </div>
                                                      <div class="table_contents_div">  
                                                        <table class="table_data">
                                                         <tr ng-repeat="data in data_lists | filter:filter_taxo['t'] track by $index" class="row_data" ng-class="{active: se_row_data['sel'] == data}">
                                                              <td class="table_data_contents" ng-click="display_data(data)">
                                                                 <div class="row" style = "width:calc(100% - 40px);float:left;" title="{{data}}">
                                                                  <i class ="fa fa-database" style="width:20px; float:left; height:20px; font-size: 13px; margin-left:10px; color: #343a40; opacity:0.3"></i>
                                                                  <span style="font-size: 13px; margin-left:4px; font-family: Roboto,sans-serif !important; width: calc(100% - 40px); color: #343a40;">{{data}}</span>
                                                                 </div>
                                                                  <div class="pull-right counticon badge" title="{{taxonomy_map[data].length}}">{{taxonomy_map[data].length}}</div>
                                                              </td>
                                                         </tr>
                                                      </table>
                                                     </div>
                                                </div> 
                                                <div class="grid_div">
                                                     <div ui-grid="gridDataCompanyInfo"  class="grid_user"  ui-grid-auto-resize ui-grid-resize-columns ui-grid-tree-view ui-grid-pinning gridDataCompanyInfo style="width:100%; height:100%"  ></div>
                                                     
                                                </div>
                                      </div>
                                      <div class="contnet_div_pdf">
                                                       <!--<ref-div config="refOptionsToc"> </ref-div>-->
                                                       <div class="pdata_sidebar">
                                                                        <div class="frheader">
                                                                                        <div   class="content_class">
                                                                                            <div  ng-repeat="tap in sub_taps"  class="header_class" ng-click="change_sub_taps(tap)" ng-class="{active: sl_sub_tap['n'] == tap['n'],  'display_class': available_dicts[tap['n']]== false}" title="{{tap['n']}}">
                                                                                                <a>{{tap['n']}}</a>
                                                                                            </div>
                                                                                         </div>
                                                                                        <!-- <div class="content_class1">
                                                                                               doc_name: {{selceted_doc_name}}
                                                                                        </div>-->
                                             </div>        
                                             <div class="frbody" ng-if="sl_sub_tap['n'] == 'Reference'">
                                                                 <ng-include src="'Reference.html'"></ng-include>
                                             </div>
                                             <div class="frbody" ng-if="sl_sub_tap['n'] == 'Formula'">
                                                                 <ng-include src="'Formula.html'"></ng-include>
                                             </div>
                                             <div class="frbody" ng-if="sl_sub_tap['n'] == 'Sentences'">
                                                                 <ng-include src="'Sentences.html'"></ng-include>
                                             </div>
                                             <div class="frbody" ng-if="sl_sub_tap['n'] == 'Graph View'">
                                                                 <ng-include src="'Graphview.html'"></ng-include>
                                             </div>
                                                      </div>
 
                                      </div>

                                      </div>
                                 </div>
                         </div>

                 </div>
	</div>
        </div>
        <style>
         .info_units{width: 100%;  height: calc(100% - 30px); margin-top: 30px; background-color: white;}
         .info_units .tas_container_routes{width: calc(100% - 6px); height: calc(100%  - 6px); border: 1px solid black ; margin: 3px 3px; border: 1px solid #ddd;}
         .info_units .gridview_report_header{height: 30px;width: 100%; border-bottom: 1px solid #ddd;}
         .info_units .cc_ts{float: left; height: 100%; width: calc(100% - 350px) }
         .info_units .drop{float: right; width: 350px; height: 100%;}
         .info_units .c1_drop .dropdown { width: calc(100% - 4px);height: 100%;}
         .info_units .dropdown { position: relative;}
         .info_units .c1_drop .dropdown-toggle {background: #f4f7fa;border: none;color: #3276b1;width: 100%;height: 100%;border-right: 1px solid #e6e6e6;border-left: 1px solid #e6e6e6;border-radius: 0px;}
         .info_units .dropdown-menu {position: absolute;top: 100%;left: 0;z-index: 1000;display: none;float: left;min-width: 160px;padding: 5px 0;margin: 2px 0 0; list-style: none;font-size: 14px;background-color: #fff;border: 1px solid #ccc;border: 1px solid rgba(0,0,0,.15);border-radius: 4px;-webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);box-shadow: 0 6px 12px rgba(0,0,0,.175);background-clip: padding-box;}
         .info_units .dropdown-menu-tas.show {display: block;max-height: 400px !important;overflow: auto;border-radius: 0px;width: 330px;}
         .info_units .drop_down_container{font-family: Roboto,sans-serif;font-size: 13px; color: #76838f; letter-spacing: 0.34px;word-spacing: 0.5px;}
         .info_units .main_hdr_list_box{width:auto; height:100%; position: relative; float: left;}
         .info_units .main_hdr_list{min-width:60px; height:100%; float:left; position:relative; border-left:0px ; width:auto; padding: 6px 12px; color: #76838f; cursor: pointer; font-weight: 500;}
         .info_units .main_hdr_list.active {background: #84a6c3 !important;font-size: 13px;   padding: 6px 12px !important;box-shadow: 0px 0px 3px #8ca1ad;border: 1px solid rgb(150, 173, 194) !important; color: #fff !important;font-weight: 500;}
         .info_units .header_icon_txt{float: left;height: 100%;text-align: left;margin-right: 10px;color: white !important;width: calc(100% - 22px);white-space: nowrap;-ms-text-overflow: ellipsis;-o-text-overflow: ellipsis;text-overflow: ellipsis;overflow: hidden;font-weight: 500;}
	 .info_units .data_div{width: 100%; height:  calc(100% - 35px); position:relative; }
	 .info_units .data_div_table{width: calc(100% - 6px); height: calc(50% - 6px); position:relative; border: 1px solid #ddd; margin: 3px 3px;}
	 .info_units .data_div_table.active{width: calc(100% - 6px); height: calc(100% - 6px); position:relative; border: 1px solid #ddd; margin: 3px 3px;}
	 .info_units .pdf_div.active{width: calc(100% - 6px); height: calc(100% - 50% - 6px); position:relative; border: 1px solid #ddd;  margin: 3px 3px; top: 0px}
	 .info_units .pdf_div{position: fixed; top:-2000px;}
	 .info_units .grid_sel_div{position: relative; height:100%; width: 25%; float: left; overflow:auto;}
	 .info_units .table_data_display{position: relative; height:100%; width: calc( 100% - 25%); float: left;}
	 .info_units .ls_v_header {padding: 7px 5px;padding-left: 15px;}
	 .info_units .pheader .st_icon{display:inline-block; margin:0px 3px;}
         .info_units .add_icon{display: inline-block;width: 20px;height: 20px;background: white;padding: 3px;border-radius: 2px;}
	 .info_units .pheader .pn{display:inline-block;color: #343a40;}
         .info_units .tas_sidebar .sfooter{height:30px; width:100%;}
	 .info_units .pdata{padding-left:18px;padding-top: 6px;}
	 .info_units .pheader{cursor:pointer;}
	 .info_units .pd_container{padding-left:22px;}
	 .info_units .level_icon_2{color: #343a40 !important;float: left; padding: 4px; border-radius: 2px; font-weight: 599;margin-right: 7px;border-top-right-radius: 8px;opacity:0.5}
         .info_units .mt3p{margin-top: 3px;}
	 .info_units .level_2.openeduu{color: #16b0db;}
	 .info_units .frheader ul{border-bottom: 2px solid #b3c2cc;border-top: 2px solid #b3c2cc;}
         .info_units .like_panel.ful_panel{height:calc(100% - 10px) !important;}
         .info_units [ui-grid="node_values_grid"] .ui-grid-cell-focus,[ui-grid="node_template_grid"] .ui-grid-cell-focus{background: none !important;}
	 .info_units [ui-grid="node_values_grid"] .act_proup,[ui-grid="node_template_grid"] .act_proup{ background: #c9f4f3 !important;}
	 .info_units .pname{cursor:pointer;}
         .info_units .subloop{padding-left:28px;color:#5a585a;}
         .info_units .subloop_an {padding-left: 43px; color: #5a585a; width: 99%;opacity: 0.7}
         .info_units .pdata_sidebar{height:100%;width:100%;}
         .info_units .frheader{position: relative;height: 30px;background: #fff;width: 100%;border-bottom: 1px solid #ddd;;}
         .info_units .fa.sel_data{padding: 8px 8px 8px 8px;}
         .info_units .content_class{position: relative;width: 450px; height: 100%;float: left;}
         .info_units .content_class1{position: relative;width: calc(100% - 550px);height: 100%;float: left;}
         .info_units .content_class2{position: relative;width:  100px;height: 100%;float: right;}
         .info_units .close_button {float: right; position: relative;width: 40px;height: 100%;background-color: #96b1c6 !important;color: white !important;font-size: 20px;text-align: center;line-height: 30px;border-left: 1px solid #d6c4c4;}
         .info_units .header_class{position: relative;float: left;width: 40px;}
         .info_units .header_class{min-width:60px; height:100%; float:left; position:relative; border-left:0px ; width:auto; padding: 6px 12px; color: #76838f; cursor: pointer; font-weight: 500;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;}
         .info_units .header_class2{min-width:60px; height:100%; float:left; position:relative; border-left:0px ; width:100%; padding: 6px 12px; color: #76838f; cursor: pointer; font-weight: 500;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;}
         .info_units .ls_vw i{color: #76838f;padding-right: 7px;}
         .info_units .ls_vw.active i{color: #3f6ad8 !important;}
         .info_units .ls_vw.active{background: #dae8f1;color: #3f6ad8;font-weight:bold}
         .info_units .header_class.active.Availablity{background: #84a6c3 !important;color: green;}
         .info_units .header_class.active{background: #84a6c3 !important; color: white;}
         .info_units .header_class.display_class{display: none;}
         .info_units .ui-grid-cell-contents.active{background: #dae8f1 !important;}
         .info_units .frbody{ position: relative;width:100%;height: calc(100% - 30px);}
         .info_units .contnet_div{position:relative;float:left;width: calc(50% - 6px);height: calc(100% - 6px);border: 1px solid #ddd;margin: 3px 3px 3px 3px;}
         .info_units .contnet_div_pdf{position:relative;float:left;width: calc(100% - 50% - 6px);height: calc(100% - 6px); border: 1px solid #ddd;margin: 3px 3px 3px 3px;}
         .info_units .contnet_div_taxo{position: relative;width:50%;height: 100%;float:left;}
         .info_units .sel_div{position: relative;height: calc(50% - 6px);width: calc(100% - 6px);margin: 3px 3px 3px 3px;border: 1px solid #ddd;}
         .info_units .grid_div{position: relative;height: calc(100% - 50% - 6px); width: calc(100% - 6px);margin: 3px 3px 3px 3px;border: 1px solid #ddd;}
         .info_units .table_data{position: relative;width:100%;}
         .info_units .serach_div{position: relative;width:100%;height: 50px;border-bottom: 1px solid #ddd;}
         .info_units .table_contents_div{position: relative;width:100%;height : calc(100% - 50px);overflow: auto;}
         .info_units .table_data_contents{padding-left: 10px; padding-top: 10px;padding-bottom: 10px;letter-spacing: 0.34px;word-spacing: 0.5px;font-size: 12px; font-weight: normal;}
         .info_units .row_data{border-bottom: 1px solid #ddd;}
         .info_units .row_data.active{background : #dae8f1 !important;}
         .info_units .ui-grid-pinned-container.ui-grid-pinned-container-left .ui-grid-cell:last-child {background-color: white;border-right-color: 1px solid #ddd !important;}
         .info_units .ui-grid-pinned-container.ui-grid-pinned-container-left .ui-grid-cell:last-child {border-right-color: 1px solid #ddd !important;}
         .info_units .ui-grid-cell.ui-grid-coluiGrid-00EZ.ui-grid-row-header-cell{border-right-color: 1px solid #ddd !important;}
	 .info_units .ui-grid-row.ui-grid-tree-header-row{ border-right-color: 1px solid #ddd !important;}
         .info_units .row-grid-header-cell-row{background-color: white !important;}
	 .info_units .ui-grid-top-panel{background-color: white !important;}
	 .info_units .ui-grid-pinned-container{border-right: 1px solid #e4e4e4;}
	 .info_units .ui-grid-pinned-container.ui-grid-pinned-container-left .ui-grid-header-cell:last-child {border-right: 1px solid #e4e4e4;}
         .info_units .ui-grid-pinned-container.ui-grid-pinned-container-left .ui-grid-cell:last-child {border-right-color: #e4e4e4 !important;}
         .info_units .serarech_taxonomy{margin-right: 5px; margin-top: 10px;height: 30px;width: 200px;  border: 1px solid #ddd;border-radius:5px;padding-left: 5px; opacity: 0.7;}
         .info_units .counticon{width: 15px; height: 14px; display: inline-block;border-radius: 2px;color: white;text-align: center;margin-right:5px; padding-top: 3px;background-color: #84a6c3;}
         .info_units .ui-grid-row .ui-grid-cell.ui-grid-row-header-cell{border-bottom:solid 1px #e4e4e4 !important}
         /*.ui-grid-cell-contents.row_col_grid_cell.data.active_cell{border: 2px solid black !important;background-color: white !important; font-weight: bold !important;}*/
         .info_units .ui_grid_cell_text{text-overflow: ellipsis;overflow: hidden;white-space: nowrap; float: left;height: 100%;width: calc(100% - 100px);  position: relative; color: #343a40; font-size: 13px;line-height: 31px;}
         .info_units .ui_grid_cell_image{width: 30px;height:100%;float: right;position: relative;} 
         .info_units .ui_grid_cell_texo{position: relative;width: 50px;height:100%;float: right;}
         .info_units .ui_grid_cell_texo1 {width: 50px;float: right;font-size: 10px;background: rgb(235, 246, 246);color: #68999F;padding: 2px 1px;border-radius: 2px; margin: 5px 2.5px;height: 18px; line-height: normal !important;overflow: hidden;text-overflow: ellipsis;text-align: center;border: 1px solid #d0f5f5;}
         .info_units .lc_btn_grp {float: right; position: relative; right: 5px; background: #fff; color: white; top: 4px; cursor: pointer;height: 21px;width: 21px;line-height: 19px;text-align: center;border-radius: 2px;margin-left: 0px;}
         .info_units .grp_contents{position: relative;width: 50%;height: 100%;float: left;border-right: 1px solid #ccc;}
         .info_units .doc_display{position: relative; width: calc(100% - 50%); height: 100%; float: left;}
         .info_units .graph_container{ width: 100%;height: 80%;margin-top: 20px;position: relative;}
         .info_units .has_senten:before {content: "";display: block; width: 0;height: 0;border-top: 12px solid transparent;border-bottom: 12px solid transparent;border-left: 15px solid #f95a1d;position: absolute;top: -16px; left:0px}
         .info_units .act_sen {background: #e0f1fb;}
         .info_units .Availablity{ color: green;}
         /*.table_data.data th {font-size:20px;height: 50px;padding: 8px;background: #ebf5f6;color: rgb(79, 145, 194) !important;border-bottom: none !important; border: 1px solid #ddd;font-weight: 500;}*/
         .info_units .table_data.data th {background: #ffffff;color: #3f6ad8; !important;border-bottom: none !important; border: 1px solid #ddd;font-weight: 500; text-align: center; height: 40px;}
         .info_units .table_data.data td{border: 1px solid #ddd;color: #343434; padding: 8px;}
         .info_units .grid_user .ui-grid-row:nth-child(odd):hover .ui-grid-cell{ background: white !important; font-weight:normal !important;}
         .info_units .grid_user .ui-grid-row:nth-child(even):hover .ui-grid-cell{background: white !important; font-weight:normal !important;}
         .info_units .grid_user .ui-grid-row:nth-child(odd):hover .ui-grid-cell .row_col_grid_cell{font-weight:normal !important;}
         .info_units .grid_user .ui-grid-row:nth-child(even):hover .ui-grid-cell .row_col_grid_cell{font-weight:normal !important;}
         .info_units .grid_user .ui-grid-row .ui-grid-cell-contents.row_col_grid_cell.data.active_cell{border: 2px solid black !important;background-color: white !important; font-weight: bold !important;}
         .info_units .make_bold.active{background-color:#dae8f1 !important;}
         .info_units .grid_user.hdr_cntr{padding-bottom: 5px;}
         .info_units .row_col_grid_cell.column_data{text-align: right; color:#333; border: 2px solid rgba(82, 123, 149, 0) !important;  font-size: 13px;line-height: 31px;}
         .info_units .row_col_grid_cell.column_data_desc{color: #333; border: 2px solid rgba(82, 123, 149, 0) !important; font-size: 13px;}
         .info_units .slt_box_of_tgle {width: 26px;border-right: 1px solid #ddd;height: 100%;text-align: center;}
         .info_units .grid_user .slt_box_of_tgle {width: 26px;border-right: 1px solid #ddd;height: 100%;text-align: center;}
         .info_units .grid_user .hdr_cntr {font-weight:500;}
         .info_units .grid_user.ui-grid-cell-contents {font-weight:900;}
         .info_units .grid_user .ui-grid-cell{border-color: #ececec !important}
         .info_units .multi_val:after { content: "";position: absolute;bottom: 0px !important;padding: 0px !important;margin-bottom: 0px !important;margin-right: 0px;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 8px solid #F0AA1B;border-left: 8px solid transparent;right: 0px;}
         .info_units .ui-grid-cell-contents.has_formula{color: #ffa500;}
         .info_units .table_typecl.ls_vw{text-overflow: ellipsis;overflow: hidden;white-space: nowrap;}
         .info_units .dropdown-item-tas.active{background: #dae8f1;}
         /*.grid_user .ui-grid-cell{border-color: #ddd !important}*/
        </style>`,
                controller: 'information_units',
                scope: {
                        'config': '='
                },
                link: function (scope, elm, attrs, controller) {
                    //scope.init_func('ALL'); 	
                },
}
});

