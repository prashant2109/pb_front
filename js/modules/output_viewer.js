var app = angular.module("tas.outputView", []);
app.controller("OutputViewController", function($scope, $rootScope, $http, $timeout, $location, $filter, $sce, $compile, uiGridConstants, uiGridTreeBaseService, tasService){
	"use strict";
	$scope.Object = Object;
   	$scope.config.scope = $scope;
	/******************************/
	$scope.hard_code        = 'N';
	$scope.mapstatuscolors = {'0':'B','1':'G','All':'Gy'};
	var prev_sel_hc_bc =[];
	/******************************/
	$scope.refOptions = {
		id: 'opviewiframe',
		htmlRef: true,
		pdfRef: false,
		html_type: 'html',
		active: 'html',
		toolBar: false,
		title: '',
		dropDown: false,
		path: 'src/no_ref_found.html',
		pno_list:  [],
		selected_pno: 1,
		parent_scope:  $scope,
		options: {zoom: false, clear: true, multiselect: true},
		ref: [
			{
				bbox: [[]],
				coord: [],
				bg :"rgba(243, 230, 88, 0.3)",
                                border : "2px solid rgb(244, 67, 54)",
				c_name: '',
				clr_flg: true,
				x: '',
				d: '',
				t: '',
				pno: '',
				xml_list: []
			}
		    ]
		    
	}
	/******************************/
	var subheaderTemplate = `<div role="rowgroup" class="ui-grid-header">
				    <div class="ui-grid-top-panel">
					<div class="ui-grid-header-viewport">
					    <div class="ui-grid-header-canvas">
						<div class="ui-grid-header-cell-wrapper" ng-style="colContainer.headerCellWrapperStyle()">
						    <div role="row"  class="ui-grid-header-cell-row">
							<div class="ui-grid-header-cell ui-grid-clearfix" ng-if="col.colDef.category === undefined"
							     ng-repeat="col in colContainer.renderedColumns track by col.uid"
							     ui-grid-header-cell
							     col="col"
							     render-index="$index">
							</div>
							<div class="ui-grid-header-cell ui-grid-clearfix ui-grid-category main_headers" style="text-align:center;" ng-repeat="cat in grid.options.category"
							 ng-if="cat.visible &&
							 (colContainer.renderedColumns | filter:{ colDef:{category: cat.name} }).length > 0">
								<div style="font-size: 12px;border-bottom: 1px solid #e0e7ed !important;padding: 2px;color: #3f6ad8;">{{cat.name}}</div>
								<div class="ui-grid-header-cell ui-grid-clearfix" title="{{cat.name}}" sub_h=""
							     		ng-repeat="col in colContainer.renderedColumns | filter:{ colDef:{category: cat.name} }"
							     		ui-grid-header-cell
							     		col="col"
							     		render-index="$index">
								</div>
							</div>
						    </div>
						</div>
					    </div>
					</div>
				    </div>
				</div>`;
	
	/******************************/
    	var treeheaderTemplate =  `
                            <div ng-class="{ 'sortable': sortable }">
                               <div style="float: left;color: #000;cursor: pointer;width: 26px;height: 100%;text-align: center;padding-left: 4px;padding-top: 6px;" ng-click="grid.appScope.expandAllFunc(grid.treeBase.expandAll,grid.api)" ng-if="grid.options.enableExpandAll">
                                 <i  ng-class="{'fa fa-minus ': grid.treeBase.numberLevels > 0 && grid.treeBase.expandAll, 'fa fa-plus': grid.treeBase.numberLevels > 0 && !grid.treeBase.expandAll}" style="color:#293238;"></i> &nbsp;
                               </div>
                               <div role="button" tabindex="0" ng-keydown="handleKeyDown($event)" class="ui-grid-cell-contents ui-grid-header-cell-primary-focus" col-index="renderIndex" style="border-left: 1px solid #ddd;">
                                  <span class="ui-grid-header-cell-label ng-binding" ui-grid-one-bind-id-grid="col.uid + '-header-text'">{{col['displayName']}}</span>
                                       <div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">
                                          <input type="text" class="ui-grid-filter-input" ng-model="colFilter.term"/>
                                          <div class="ui-grid-filter-button" ng-click="colFilter.term = null">
                                            <i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i>
                                          </div>
                                       </div>
                                </div>
                          </div>`;
	/******************************/
	$scope.topgridOptions = { 
                enableFiltering:true,
		enableSorting: false,
		columnDefs: [],
		showTreeExpandNoChildren:false,
		enableColumnMenus:false,
		enableRowHeaderSelection: false,
		showTreeRowHeader: false,
		multiSelect: false ,
		enableHorizontalScrollbar:0,
		enableVerticalScrollbar:1,
                onRegisterApi: function (gridApi) {
			$scope.topgridApi = gridApi;
                        gridApi.cellNav.on.navigate($scope,function(newRowCol, oldRowCol){
                                if(newRowCol['col']['field'] == 'treeBaseRowHeaderCol')
                                        return;
				$($scope.mainelement).find(".graphcontainer").html("");
                                $scope.topgridRow  = newRowCol['row']['entity'];
				var colname = newRowCol['col']['field'];
				if(colname != 'taxonomy')
                                        colname = gridApi.grid.columns[1].name;
				$scope.topgridOptions['activecolumn']      = colname;
				$scope.getbottomgridInfo();
                        })
                }
        }
	/******************************/
	$scope.bottomgridOptions = {
                enableFiltering:true,
		enableSorting: false,
		columnDefs: [],
		showTreeExpandNoChildren:false,
		enableColumnMenus:false,
		enableRowHeaderSelection: false,
		enableHorizontalScrollbar:1,
		enableVerticalScrollbar:1,
		headerTemplate: subheaderTemplate,
                onRegisterApi: function (gridApi) {
			$scope.bottomgridApi = gridApi;
                        gridApi.cellNav.on.navigate($scope,function(newRowCol, oldRowCol){
				var tempnewRowCol = newRowCol.row.entity;
                                var colname = newRowCol['col']['name'];
                                if(colname == 'taxonomy')
                                        colname = gridApi.grid.columns[1].name;
				if(oldRowCol != null){
					var tempoldRowCol = oldRowCol.row.entity;
					var activeperiodic = tempoldRowCol['activecol'];
					delete tempoldRowCol['activecol']
				}
				tempnewRowCol['activecol'] = colname;
				$scope.downgridRow = tempnewRowCol;
                		if(JSON.stringify(tempnewRowCol) != JSON.stringify(tempoldRowCol)){
                        		$scope.getgraphinfo(tempnewRowCol);
				}
				var docid = tempnewRowCol['doc_id'];
				if($scope.topgridRow['gtype'] == 3){
					docid = tempnewRowCol[colname+'_docid'];
				}
				var docslst = $scope.docsDict;
				var doctype = 'HTML';
				docslst.forEach(function(ech_doc){
					if(ech_doc['d'] == docid){
						doctype = ech_doc['doc_type'];
					}
				});
				if(doctype == 'HTML')
                			$scope.loadhtml();
				else{
					$scope.loadPdf()
				}
                        })
                }
        }
	/******************************/
	$scope.loadData = function(){
		$scope.topgridOptions['columnDefs']    = [];
                $scope.topgridOptions['data']          = [];
		$scope.bottomgridOptions['columnDefs'] = [];
		$scope.bottomgridOptions['data']       = [];
		$scope.graph_show                      = false;
		$scope.refOptions['path']              = 'src/no_ref_found.html';
		$scope.ProjectID                       = $scope.config.parent_scope.slcted_indus_dic['project_id'];
		$scope.WorkspaceID                     = $scope.config.parent_scope.slcted_indus_dic['ws_id'] || 1;
		$scope.BatchName                       = $scope.config.parent_scope.slcted_comp_dic['company_id'];
		$scope.dbName                          = $scope.config.parent_scope.slcted_indus_dic['db_name'];
		$scope.docsDict                        = $scope.config.parent_scope.slcted_comp_dic.info || [];
		$scope.docs                            = $scope.config['docs']||[];
		var input               = {'project_id':$scope.ProjectID,'ws_id':$scope.WorkspaceID,'user_id':sessionStorage['user_id'],'batch_name':$scope.BatchName,'db_name':$scope.dbName,'doc_lst':$scope.docs,'oper_flag':($scope.config['cmd_dict']||{})['loadDatainput']}
                $scope.config.parent_scope.ps               = true;
		tasService.ajax_request({path:$scope.config['host'],'data':[{"oper_flag":($scope.config['cmd_dict']||{})['loadData'],input:input,'flag':$scope.hard_code}],'cmd_id':22 }, 'POST', $scope.cb_topgriddata);
	}
	/******************************/
	$scope.cb_topgriddata = function(response){
		$scope.config.parent_scope.ps               = false;
		if((Object.prototype.toString.call(response) == '[object Object]')&&(response.hasOwnProperty('data'))){
                         var res_hdr_lst = response['data'][0][1];
			 res_hdr_lst['headerCellTemplate'] = treeheaderTemplate;
			 res_hdr_lst['cellTemplate'] = `
					<div style="float:left;" class="ui-grid-tree-base-row-header-buttons level_blocks" ng-repeat="l_id in [].constructor(row.entity['$$treeLevel']) track by $index" ng-if="grid.treeBase.numberLevels > 0">&nbsp;</div>
			 	 		<div ng-if="grid.treeBase.numberLevels > 0" style="float:left;color: #000;padding-top: 10px;cursor: pointer;height: 100%;" class="ui-grid-tree-base-row-header-buttons level_blocks"  s="{{row.treeLevel}}" ng-class="{'ui-grid-tree-base-header': row.treeLevel > -1}" ng-click="grid.appScope.toggleTreeView(row, $event,grid);$event.stopPropagation();$event.preventDefault();"><i class="" ng-class="{'fa fa-minus': ( ( grid.options.showTreeExpandNoChildren && row.treeLevel > -1 ) || ( row.treeNode.children && row.treeNode.children.length > 0 ) ) && row.treeNode.state === 'expanded', 'fa fa-plus': ( ( grid.options.showTreeExpandNoChildren && row.treeLevel > -1 ) || ( row.treeNode.children && row.treeNode.children.length > 0 ) ) && row.treeNode.state === 'collapsed'}" ng-style="{'padding-left1': grid.options.treeIndent * row.treeLevel + 'px'}" level1="{{row.entity.level_id}}" header="{{row.entity.header == 'Y'}}"></i> &nbsp;</div>
			 			<div class="ui-grid-cell-contents ui-grid-with-border" style="vertical-align:middle;" attr="{{row.entity.$$treeLevel}}" ng-class='{"active_rowcell":grid.appScope.topgridRow["sn"]==row.entity["sn"],"active_cell":((grid.appScope.topgridRow["sn"]==row.entity["sn"])&&(grid["options"]["activecolumn"]==col.name))}'><span class="graph_taxo">{{row.entity.taxonomy}}</span>
                                        		<span class="graph_disp">
                                                		<img ng-if="row.entity.gtype == '1'" class="status_img" src="src/images/line.png" style="width:20px"/>
                                                		<img ng-if="row.entity.gtype == '0'" class="status_img" src="src/images/timeline.png" style="width:20px"/>
                                                		<img ng-if="row.entity.gtype == '2'" style="opacity: 0.7;width:22px" class="status_img" src="src/images/nochart.png" />
                                                		<img ng-if="row.entity.gtype == '3'"  style="opacity: 0.35;width:20px" class="status_img" src="src/images/grid.png"/>
                                       	 		</span>
                                        	</div>
                          		</div>`
                        var colorTypes = [
				{ value :'All','desc':'All'},
                                { value: '1','desc':'Data Present'},
                                { value: '0','desc':'No Data'}
                        ];
			var sl_dict = {"width":"50","enableFiltering":true,"displayName":"Status","name":"dstatus","cellTooltip":true,"headerCellClass":"kve_header","enableCellEdit":false,"cellClass":"grid-align_center icon_cell","cellTemplate": "<div class=\"ui-grid-cell-contents ui-grid-with-border\" ng-class='{\"active_rowcell\":grid.appScope.topgridRow[\"sn\"]==row.entity[\"sn\"],\"active_cell\":((grid.appScope.topgridRow[\"sn\"]==row.entity[\"sn\"])&&(grid[\"options\"][\"activecolumn\"]==col.name))}'><span class=\"icon_{{grid.appScope.mapstatuscolors[COL_FIELD]}}\" title=\"{{COL_FIELD=='1'?'Data Present':'No Data'}}\"></span></div>"};
			sl_dict['filterHeaderTemplate'] = `<div class="ui-grid-filter-container hdr_cntr" ng-repeat="colFilter in col.filters"><div>
				<div class="dropdown">
					<div class="dropdown-toggle" data-toggle="dropdown" style="padding: 0px 2px;color: #232323;">                   
                                        	<span  class="icon_{{grid.appScope.mapstatuscolors[colFilter.term || 'All']}} pull-left" style="margin-top:2px"></span>
                                    	</div>
					<div class="dropdown-menu dropdown-menu-right dropdown-menu-tas grid-dropdown-menu">
						<div class="" ng-repeat="option in colFilter.selectOptions track by $index" ng-click="(colFilter.term = option.value) ; (colFilter.value = option.value)" title="{{option.name}}">
                                            		<span class="icon_{{grid.appScope.mapstatuscolors[option.value]}} pull-left icon" title="{{option['desc']}}"></span>
                                            		<span ng-class="{act: colFilter['term'] == option['value']}" ng-bind-html="option['desc']"></span>
                                       	 	</div>
					</div>
				</div>
			`; 
                        sl_dict['filter']= { selectOptions: colorTypes, type: uiGridConstants.filter.SELECT,term: null,condition: function(term, value, row, column){
                                                var colname = column.name;
                                                return (((term)== 'All')||(row.entity[colname]== term));
				}
			}
                        $scope.topgridOptions['columnDefs']  = [res_hdr_lst,sl_dict];
                        var tmp_data    = response['data'][1]
                        var rs_data     = []
                        tmp_data.forEach(function(each,cnt){
                                each['sn']= cnt+1;
                                if(each['level']){
                                        var ss = (each['level']||"").split('.')
                                        each['$$treeLevel'] = (ss.length-1)
                                }else{
                                        each['$$treeLevel'] = 0
                                }
                                rs_data.push(each)
                        })
                        $scope.topgridOptions['data']        = rs_data;
                        $timeout(function (){
                                $scope.topgridApi.treeBase.expandAllRows();
                                $scope.topgridApi.cellNav.scrollToFocus($scope.topgridOptions.data[0],$scope.topgridOptions.columnDefs[0])
                        },100);
		}else{
			$scope.topgridOptions['columnDefs']  = []
	                $scope.topgridOptions['data']        = []
		}
	}
	/******************************/
	$scope.getbottomgridInfo  = function(){
                $scope.config.parent_scope.ps              = true
		$scope.bottomgridOptions['columnDefs']     = []
                $scope.bottomgridOptions['data']           = []
                $scope.refOptions['path']                  = "src/no_ref_found.html";
                var company_id                             = ''
                var input                                  = {'project_id':$scope.ProjectID,'ws_id':$scope.WorkspaceID,'user_id':sessionStorage['user_id'],'batch_name':$scope.BatchName,'db_name':$scope.dbName,'doc_lst':$scope.docs,'g_type':$scope.topgridRow['gtype']||'','doc_id':'','taxonomy':$scope.topgridRow['taxonomy']||'','c_n':$scope.topgridRow['c_n']||'','s_n':$scope.topgridRow['s_n']||'','level':$scope.topgridRow['level']||'','oper_flag':($scope.config['cmd_dict']||{})['getbottomgridInfoinput']};
                if(input['g_type'] != 3){
                	tasService.ajax_request({path:$scope.config['host'],'data':[{"oper_flag":($scope.config['cmd_dict']||{})['getbottomgridInfo'],'cmp': company_id,'input': input,'flag':$scope.hard_code}],'cmd_id':22}, 'POST', $scope.cb_get_bottom_datawithgraph);
                }else{
                	tasService.ajax_request({path:$scope.config['host'],'data':[{"oper_flag":($scope.config['cmd_dict']||{})['getbottomgridInfo'],'cmp': company_id,'input': input,'flag':$scope.hard_code}],'cmd_id':22}, 'POST', $scope.cb_get_bottom_data);
                }
        }
	/******************************/
	$scope.cb_get_bottom_data = function(response){
                $scope.config.parent_scope.ps       = false;
                if((Object.prototype.toString.call(response) == '[object Object]') && response.hasOwnProperty('data')){
                        response['data'][0].forEach(function(ech){
				ech['cellTemplate'] = `<div class="ui-grid-cell-contents ui-grid-with-border"  ng-class='{"active_rowcell":grid.appScope.downgridRow["sn"]==row.entity["sn"],"active_cell":((grid.appScope.downgridRow["sn"]==row.entity["sn"])&&(grid.appScope.downgridRow["activecol"]==col.name))}' title="{{COL_FIELD}}">{{COL_FIELD}}</div>`
                                if(ech['name'] != 'taxonomy'){
                                        ech['minWidth'] = 100;
                                        ech['width'] = '*';
                                }else{
					ech['cellTemplate'] = `<div class="ui-grid-cell-contents"  ng-class='{"active_rowcell":grid.appScope.downgridRow["sn"]==row.entity["sn"],"active_cell":((grid.appScope.downgridRow["sn"]==row.entity["sn"])&&(grid.appScope.downgridRow["activecol"]==col.name))}'><span class="taxo_txt" title="{{row.entity.taxonomy}}">{{row.entity.taxonomy}}</span><span class="taxo_graph"><img ng-if="row.entity.gtype == '1'" class="status_img" src="src/images/line.png"/><img ng-if="row.entity.gtype == '0'" class="status_img" src="src/images/timeline.png"/><img ng-if="row.entity.gtype == '2'" style="opacity: 0.5;" class="status_img" src="src/images/nochart.png"/><img ng-if="row.entity.gtype == '3'" style="opacity: 0.5;" class="status_img" src="src/images/grid.png"/></span></div>`;
					ech['enableFiltering'] = true;
				}
                        });
			var res = response['data'][1].map(function(ech,cnt){ech['sn']=cnt;return ech});
                        $scope.bottomgridOptions['columnDefs']     = response['data'][0]
                        $scope.bottomgridOptions['data']           = res;
                        $scope.bottomgridOptions['rowHeight']      = (response['data'][2]||1)*30;
                        $scope.bottomgridOptions['category']       = response['data'][3];
                        $timeout(function(){
                                if($scope.bottomgridOptions['data'].length){
                                        var cellFocus = $scope.bottomgridOptions.columnDefs[1]
                                        $scope.bottomgridApi.cellNav.scrollToFocus($scope.bottomgridOptions['data'][0], cellFocus)
                                }else{
					$scope.graph_show         = false;
					$scope.refOptions['path'] = "src/no_ref_found.html";
				}
                        })

                }else{
			$scope.refOptions['path']                  = "src/no_ref_found.html";
                        $scope.bottomgridOptions['columnDefs']     = []
                        $scope.bottomgridOptions['data']           = []
                }
	}
	/******************************/
	$scope.cb_get_bottom_datawithgraph = function(response){
		$scope.config.parent_scope.ps       = false;
                if($scope.topgridRow['gtype'] == 2)
                        $scope.graph_show = false;
                else
                        $scope.graph_show = true;
                if((Object.prototype.toString.call(response) == '[object Object]') && response.hasOwnProperty('data')){
                        response['data'][0].forEach(function(ech){
				ech['cellTemplate'] = `<div class="ui-grid-cell-contents"  ng-class='{"active_rowcell":grid.appScope.downgridRow["sn"]==row.entity["sn"],"active_cell":((grid.appScope.downgridRow["sn"]==row.entity["sn"])&&(grid.appScope.downgridRow["activecol"]==col.name))}' title="{{COL_FIELD}}">{{COL_FIELD}}</div>`
                                if(ech['name'] != 'taxonomy'){
                                        ech['minWidth'] = 100;
                                        ech['width'] = '*';
				}else{
                                        ech['cellTemplate'] = `<div class="ui-grid-cell-contents" ng-class='{"active_rowcell":grid.appScope.downgridRow["sn"]==row.entity["sn"],"active_cell":((grid.appScope.downgridRow["sn"]==row.entity["sn"])&&(grid.appScope.downgridRow["activecol"]==col.name))}'><span class="taxo_txt" title="{{row.entity.taxonomy}}">{{row.entity.taxonomy}}</span><span class="taxo_graph"><img ng-if="row.entity.gtype == '1'" class="status_img" src="src/images/line.png"/><img ng-if="row.entity.gtype == '0'" class="status_img" src="src/images/timeline.png"/><img ng-if="row.entity.gtype == '2'" style="opacity: 0.5;" class="status_img" src="src/images/nochart.png"/><img ng-if="row.entity.gtype == '3'" style="opacity: 0.5;" class="status_img" src="src/images/grid.png"/></span></div>`
					ech['enableFiltering'] = true;
                                }
                        });
			var res = response['data'][1].map(function(ech,cnt){ech['sn']=cnt;return ech});
                        $scope.bottomgridOptions['columnDefs']     = response['data'][0]
                        $scope.bottomgridOptions['data']           = res;
                        $scope.bottomgridOptions['category']       = {};
                        if($scope.topgridRow['gtype'] !=  0){
                                $scope.create_responsegraph(response['data'][2])
                        }else{
                                $scope.create_responsebubblegraph(response['data'][4],response['data'][3],response['data'][2])
                        }
			$timeout(function(){
                                if($scope.bottomgridOptions['data'].length){
                                        var cellFocus = $scope.bottomgridOptions.columnDefs[1];
                                        $scope.bottomgridApi.cellNav.scrollToFocus($scope.bottomgridOptions['data'][0], cellFocus)
                                }else{
					$scope.graph_show = false;
					$scope.refOptions['path'] = "src/no_ref_found.html";
				}

                        })
                }else{
			$scope.refOptions['path']                  = "src/no_ref_found.html";
                        $scope.bottomgridOptions['columnDefs']     = []
                        $scope.bottomgridOptions['data']           = []
                }
	}
	/******************************/
	$scope.create_responsegraph = function(dummy_json){
                dummy_json['credits']= {
                        enabled: false
                }
                dummy_json['tooltip']['valueSuffix'] = ''
                $($scope.mainelement).find('.graphcontainer').highcharts(dummy_json);
        }
	/******************************/
	$scope.create_responsebubblegraph = function(dummy_json1,dummy_json,dummy_json2){
		prev_sel_hc_bc = [];
           	var get_org_ph = dummy_json2['xAxis']['categories'] || [];
           	var res_phs = get_org_ph;
           	var dat = [];
           	var dat2 = [];
           	res_phs.forEach(function (ech,idx){
                	if(dummy_json[ech] != undefined){
                        	dummy_json[ech].forEach(function (sech,sidx){
                                        dat.push({ pointPlacement: -0.25, 'name':'Earnings Release',"x":(idx-0.13),"y":sidx+1,"z":10,"tmp":sech,"prd":ech,"color":"#29B5C6"})
                        	})
                	}
                	if(dummy_json1[ech] != undefined){
                        	dummy_json1[ech].forEach(function (sech,sidx){
                                        dat2.push({pointPlacement: 0.25,'name':"Transcript","x":(idx+0.13),"y":sidx+1,"z":10,"tmp":sech,"color":"#e4a54e","prd":ech})
                        	})
                	}

           	})
		if(dat.length == 1){
                        dat[0]['pointPlacement']=0;
                        dat[0]['x']=0;
           	}
           	if(dat2.length == 1){
                        dat2[0]['pointPlacement']=0;
                        dat2[0]['x']=0;
           	}
           	var tmp_ser = [];
            	if(dat.length){
                	tmp_ser.push({name:"Earnings Release",data: dat,color:"#29B5C6"});
            	}
            	if(dat2.length){
                	tmp_ser.push({name:"Transcript",data: dat2,color:"#e4a54e"});
            	}
		if(!tmp_ser.length)
			$scope.graph_show = false;
	    	$($scope.mainelement).find('.graphcontainer').highcharts({
			previouspoint:[],
			chart: {
			    	type: 'bubble',
			    	zoomType: 'x'
			},
			title:{
			    	text:""
			},
			credits: {enabled: false},
			exporting:{enabled:false},
			legend: {
			    	enabled:true
			},
			xAxis: {
				startOnTick: true,
				endOnTick:true,
				type: "category",
				categories:res_phs,
				allowDecimals:true,
			    	//min:0,
			    	max:(res_phs.length-1),
			    	title: {
					text: 'Period'
			    	}
			},
			yAxis: {
			    	title: {
					text: 'Occurrences'
			    	},
			},
			plotOptions:{
			    	bubble:{
					minSize:5,
					maxSize:10,
			    	},
			    	series:{
					allowPointSelect: true,
					marker: {
						states: {
					    		select: {
								fillColor: 'red',
								lineWidth: 0
					    		}	
						}
					},
					point:{
				    		events:{
							select: function(e){
								e.preventDefault();
								if(prev_sel_hc_bc.length){
									prev_sel_hc_bc[0].update({color:prev_sel_hc_bc[1]});
								}
								prev_sel_hc_bc= [this,this.color];
								this.update({
									color: 'green'
								});
								$scope.reversepointdata(e.target)
							}
				    		}
					}
			    	}
			},
			series: tmp_ser,
			tooltip:{
				headerFormat: '',
				pointFormat:"{point.tmp}",
			}
            	});
        }
	/******************************/
	$scope.reversepointdata = function (trg){
		return;
        }
	/******************************/
	$scope.loadhtml = function(){
		var project_id     = $scope.ProjectID;
                var ws_id          = $scope.WorkspaceID;
                var row         = angular.copy($scope.downgridRow);
		var docid       = row['doc_id'];
                var page        = row['page_no'];
                var xmlids      = row['xlm_ids'];
                var charidx     = row['char_idx'];
                if($scope.topgridRow['gtype'] == 3){
                        var activecol   = row['activecol'];
                        docid           = row[activecol+'_docid'];
                        page            = row[activecol+'_page'];
                        xmlids          = row[activecol+'_xml'];
                        charidx         = row[activecol+'_chr'];
                }
		if((docid != undefined) && (page != undefined)){
			var temp = "/ref_path/"+project_id+"/"+ws_id+"/pdata/docs/"+docid+"/html/"+docid+"_slt.html"
			$scope.refOptions['ref'][0]['c']        = (charidx ||"").split("$"); 
			$scope.refOptions['ref'][0]['x']        = xmlids;
			$scope.refOptions['ref'][0]['xml_list'] = (xmlids ||"").split("$");
			$scope.refOptions['ref'][0]['p_no']     = page;
			$scope.refOptions['html_type']          = 'html';
			$scope.refOptions['active']             = 'html';
			$scope.refOptions['path']               = temp;
         	        $scope.refOptions.scope.iframe_page_no_change($scope.refOptions);

		}else{
			$scope.refOptions['path'] = "src/no_ref_found.html";
		}
	}
	/******************************/
	$scope.loadPdf = function(){
		var docid    = $scope.downgridRow['doc_id'];
		var page     = $scope.downgridRow['page_no'];
		var bbox     = $scope.downgridRow['bbox'] || [];
		var xmlids   = $scope.downgridRow['xlm_ids'];
		var charidx  = $scope.downgridRow['char_idx'];
		if($scope.topgridRow['gtype'] == 3){
			var active_col = $scope.downgridRow['activecol'];	
			docid          = $scope.downgridRow[active_col+'_docid'];
			page           = $scope.downgridRow[active_col+'_page'];
			xmlids         = $scope.downgridRow[active_col+'_xml'] || '';
			bbox           = $scope.downgridRow[active_col+'_bbox'] || [];
			charidx       = $scope.downgridRow[active_col+'_chr'] || [];
		}
		if((page!=undefined)&&(page != null)&&(String(page)!='')&&(docid != null)&&(docid != undefined)&&(String(docid)
!='')){
			var project_id     = $scope.ProjectID;
			var ws_id          = $scope.WorkspaceID;
			$scope.refOptions['ref'][0]['bbox'] = bbox;
			$scope.refOptions['ref'][0]['pno']  = page;
			$scope.refOptions['ref'][0]['c']        = (charidx || "").split('$');
			$scope.refOptions['ref'][0]['x']        = xmlids;
			$scope.refOptions['ref'][0]['xml_list'] = (xmlids || "").split('$');
			$scope.refOptions['ref'][0]['p_no']     = page;
			$scope.refOptions['html_type']      = 'pdf';
			if(bbox.length){
				$scope.refOptions['active']         = 'pdf';
				var temp_path                       =  "/pdf_canvas/viewer.html?file=/ref_path/"+project_id+"/"+ws_id+"/pdata/docs/"+docid+"/pages/"+page+".pdf#disableAutoFetch=true&disableStream=true&zoom=75"
				$scope.refOptions['path']           = temp_path;
			}else{
				$scope.refOptions['active']         = 'html';
				$scope.refOptions['path']           = "/ref_path/"+project_id+"/"+ws_id+"/pdata/docs/"+docid+"/html/"+page+".html";
			}
                        $scope.refOptions.scope.iframe_page_no_change($scope.refOptions);
		}else{
			$scope.refOptions['html_type']   = 'html';
			$scope.refOptions['active']      = 'html';
			$scope.refOptions['path']        = 'src/no_ref_found.html';
		}
        }
	/******************************/
	$scope.getgraphinfo = function(row){
		if($scope.topgridRow['gtype'] == 2){
                        $scope.graph_show = false;
			return;
		}
                $scope.config.parent_scope.ps       = true;
                var company_id                      = '';
                var input                           = {'project_id':$scope.ProjectID,'ws_id':$scope.WorkspaceID,'user_id':sessionStorage['user_id'],'batch_name':$scope.BatchName,'db_name':$scope.dbName,'doc_lst':$scope.docs,'g_type':row['gtype']||'','doc_id':'','taxonomy':row['taxonomy']||'','c_n':row['c_n']||'','s_n':row['s_n']||'','level':row['level']||'','oper_flag':($scope.config['cmd_dict']||{})['getgraphinfoinput'],'s_type':'1','ptaxonomy':[$scope.topgridRow['c_n'],$scope.topgridRow['s_n'],$scope.topgridRow['taxonomy']]};
                tasService.ajax_request({path:$scope.config['host'],'data':[{"oper_flag":($scope.config['cmd_dict']||{})['getgraphinfo'],'cmp': company_id,'input': input,'flag':$scope.hard_code}],'cmd_id':22}, 'POST', $scope.getgraphcgidata);
	}
	/******************************/
	$scope.getgraphcgidata    = function(response){
                $scope.config.parent_scope.ps       = false;
                $scope.graph_show                   = true;
		if((Object.prototype.toString.call(response) == '[object Object]')&&(response.hasOwnProperty('data'))){
                        if($scope.downgridRow['gtype'] !=  0){
                                $scope.create_responsegraph(response['data'][2])
                        }else{
                                $scope.create_responsebubblegraph(response['data'][4],response['data'][3],response['data'][2])
                        }
                }else{
                }
        }
	/******************************/
	$scope.toggleTreeView = function(row, evt, grid){
               uiGridTreeBaseService.toggleRowTreeState(grid.api.grid, row, evt);
    	}
	/******************************/
	$scope.expandAllFunc = function(flg,gridApi){
               if(!flg)
                        gridApi.treeBase.expandAllRows();
               else
                        gridApi.treeBase.collapseAllRows();
    	}
	/******************************/
})
app.directive('tasOutputView', function(){
    return {
            template :	`<div class="outputviewer">
				<div class="leftpart">
					<div class="lefttoppart">
						<div class="griddiv" ui-grid="topgridOptions" ui-grid-cellNav ui-grid-auto-resize ui-grid-selection ui-grid-tree-view></div>
					</div>
					<div class="leftbottompart">
						<div class="griddiv" ui-grid="bottomgridOptions" ui-grid-pinning ui-grid-cellNav ui-grid-auto-resize></div>
					</div>
				</div>
				<div class="rightpart">
					<div class="righttoppart" ng-hide="!graph_show">
						<div class='graphcontainer'>

						</div>
                                        </div>
                                        <div class="rightbottompart" ng-class="{'full_div':(!graph_show)}">
 						<ref-div config="refOptions"></ref-div> 
                                        </div>
				</div>
	   		</div>
	    		<style>
				.outputviewer{float:left;width:100%;height:100%;}
				.outputviewer .leftpart{float:left;width:50%;height:100%;}
				.outputviewer .rightpart{float:left;width:50%;height:100%;}
				.outputviewer .lefttoppart{float:left;width:calc(100% - 5px);height:calc(50% - 5px);margin: 0px 5px 5px 0px;box-shadow: 0px 5px 5px 3px #ccc;background: #fff}
				.outputviewer .righttoppart{float:left;width:calc(100% - 0px);height:calc(50% - 5px);margin: 0px 0px 5px 0px;box-shadow: 0px 5px 5px 0px #ccc;background: #fff}
				.outputviewer .leftbottompart{float:left;width:calc(100% - 5px);height:calc(50% - 0px);margin: 0px 5px 0px 0px;box-shadow: 0px 5px 5px 3px #ccc;background: #fff}
				.outputviewer .rightbottompart{float:left;width:calc(100% - 0px);height:calc(50% - 0px);margin: 0px 0px 0px 0px;box-shadow: 0px 5px 5px 0px #ccc;background: #fff}
				.outputviewer .full_div{height:100% !important;margin:0px !important}
				.outputviewer .griddiv{float:left;width:calc(100% - 0px) !important;height:calc(100% - 0px) !important;}	
				.outputviewer .graphcontainer{float:left;width:calc(100% - 0px);height:calc(100% - 0px);background: #fff;overflow:auto !important;}
				.outputviewer .grid-align_center {text-align: center;}
				.outputviewer .graph_disp{float:right;margin-right:10px;margin-top:-2px}
				.outputviewer .griddiv .ui-grid-header-cell,.griddiv .ui-grid-header-cell .ui-grid-cell-contents {background: #fff !important;text-align: center;font-weight: 500;color:#333 !important;}
				.outputviewer .griddiv .ui-grid-header-cell .ui-grid-cell-contents{white-space: nowrap !important;font-size: 12px;}
				.outputviewer .griddiv [role="columnheader"] .ui-grid-cell-contents {height: 18px !important;line-height: 14px !important;text-align: center !important;}
				.outputviewer .griddiv .ui-grid-header-cell {border: none !important;border-right-color: currentcolor;border-right-style: none;border-right-width: medium;border-right: 1px solid #e0e7ed !important;}
				.outputviewer .griddiv .ui-grid-cell-contents {font-size: 12px; line-height: 18px !important;}
				.outputviewer .graph_taxo {float: left;margin-left: 2px;}
				.outputviewer .griddiv .ui-grid-cell-contents {border-color: #fff !important;box-sizing: border-box;}
				.outputviewer .griddiv .ui-grid-pinned-container.ui-grid-pinned-container-left .ui-grid-cell:last-child{border-color: #e4e5e6;}
				.outputviewer .griddiv .ui-grid-row:nth-child(2n+1) .ui-grid-cell{background-color: #fff;border-bottom: 1px solid #e4e5e6 !important;}
				.outputviewer .graph_taxo{font-weight:500;}
				.outputviewer .griddiv .ui-grid-render-container-body .ui-grid-cell-contents[attr="0"] .graph_taxo{color:#7db2d9!important;color:#293238!important;}
				.outputviewer .griddiv .ui-grid-render-container-body .ui-grid-cell-contents[attr="1"] .graph_taxo{color:#4a7192!important;}
				.outputviewer .griddiv .ui-grid-render-container-body .ui-grid-cell-contents[attr="2"] .graph_taxo{color:#92a8ba!important;}
				.outputviewer .griddiv .ui-grid-render-container-body .ui-grid-cell-contents[attr="3"] .graph_taxo{color:#92a8ba!important;}
				.outputviewer .griddiv .ui-grid-render-container-body .ui-grid-cell-contents[attr="4"] .graph_taxo{color:#92a8ba!important;}
				.outputviewer .griddiv .ui-grid-render-container-body .ui-grid-cell-contents[attr="5"] .graph_taxo{color:#92a8ba!important;}
				.outputviewer .taxo_graph{float:right;}
				.outputviewer .taxo_txt{float:left;max-width:calc(100% - 28px);white-space: nowrap;overflow: hidden;text-overflow: ellipsis;color:#3f6ad8 !important;}
				.outputviewer .griddiv .ui-grid-render-container-body .ui-grid-viewport {overflow-x: auto !important;overflow-y: auto !important;}
				.outputviewer .taxo_info_imp {font-weight: 500 !important;}
				.outputviewer .griddiv .ui-grid-invisible{display: none;}
				.outputviewer .griddiv .ui-grid-header-cell {height: 23px !important;}
				.outputviewer .griddiv{border-left:none !important;}
				.outputviewer .griddiv .ui-grid-focuser:focus{box-shadow: none !important;}
				.outputviewer .lefttoppart .ui-grid-header-cell .ui-grid-tree-base-row-header-buttons {line-height:35px;}
				.outputviewer .griddiv .ui-grid-header-cell input{border: 1px solid #DFE6F2 !important;padding: 1px 7px !important;border-radius: 2px;margin: 0px !important;font-size: 11px;color: #abacad !important;}
				.outputviewer .ui-grid .ui-grid-tree-base-row-header-buttons.level_blocks{float: left;width: 26px;border-right: 1px solid #ddd;height: 100%;text-align: center;}
				.outputviewer .ui-grid-row .ui-grid-cell-contents ,.ui-grid-row .ui-grid-tree-base-row-header-buttons {background:#fff !important;}
				.outputviewer .icon_G{float:left;width:10px;border-radius:10px;height:10px;background:#9c3;}
				.outputviewer .icon_B{float:left;width:10px;border-radius:10px;height:10px;background:#00b4f0;}
				.outputviewer .icon_Gy{float:left;width:10px;border-radius:10px;height:10px;background:#ddd;}
				.outputviewer .ui-grid .grid-dropdown{padding:2px 5px !important;border:1px solid #ddd;color:#333;margin:0px;box-shadow: none;border: none;background: #fff;}
				.outputviewer .lefttoppart .ui-grid  .ui-grid-top-panel,.lefttoppart .ui-grid .ui-grid-header-viewport{overflow: visible !important;}
				.outputviewer .ui-grid .grid-dropdown-menu{min-width:120px;padding:5px;margin:0px;width: 150px;}
				.outputviewer .ui-grid .grid-dropdown-menu div{width:100%;height:25px;padding:0px 15px;line-height: 25px;border-bottom: 1px solid #ececec;text-align: inherit;white-space: nowrap;font-size: 13px;line-height: 22px;cursor: pointer;    font-weight: 400;}
				.outputviewer .lefttoppart .griddiv .icon_cell{display: table;}
				.outputviewer .lefttoppart .griddiv .icon_cell .ui-grid-cell-contents{display: table-cell;vertical-align: middle;padding-left:calc(50% - 5px);}
				.outputviewer .ui-grid-row .ui-grid-cell-contents.active_rowcell{background: #dae8f1 !important;border-color: #dae8f1 !important;}
				.outputviewer .ui-grid-row .ui-grid-cell-contents.active_rowcell.active_cell{background:#fff !important;border:2px solid black !important;font-weight:bold !important}
				.outputviewer .ui-grid .grid-dropdown-menu div .icon{margin-right:10px !important;margin-top:6px !important;}
				.outputviewer .griddiv .ui-grid-cell-contents{color:#333 ;}
				.outputviewer .ui-grid-with-border{border:2px solid #fff !important;}

	    		</style>`,
	    controller: 'OutputViewController',
            scope     : {
                        'config':'='
            },
            link: function (scope, elm, attrs, controller) {
			scope.mainelement = elm;
            }
	}
});
