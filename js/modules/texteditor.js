"use strict";
var app = angular.module("tas.textapplicator",[]);
app.controller("Applicator_1",function($http, $scope, $timeout, tasAlert,tasService){
     $scope.Object = Object;
     $scope.config.scope = $scope;
     $scope.tasService = {ajax_request:function(post_data, method, callback){
              var data = {"method":method, "path": encodeURIComponent($scope.config.host), "data":[post_data],"cmd_id": 22, "input": "full_data"};
              tasService.ajax_request(data, "POST", callback);
     }}
     /******************************************/
     $scope.catg_popup      = false;
     $scope.collapse        = false;
     $scope.dataBuilderShow = false;
     $scope.searchShow      = false;
     $scope.avShow          = false;
     $scope.sltgridshow     = false;
     $scope.applicator      = false;	
     $scope.searchPopShow   = false;
     $scope.tablepopup      = false;
     $scope.tabSelcted      = 'search';
     $scope.saveSlctAll     = "Y";
     $scope.lookupData      = [];
     $scope.searchDocid     = "";
     $scope.pagecounts      = {};
     $scope.taxoOptions1    = {};
     $scope.taxoOptions2    = {};
     $scope.taxoOptions3    = {};
     $scope.taxoOptions4    = {};
     $scope.avAll           = "N";
     $scope.taxo4checkedAll = 'Y';
     $scope.taxo2checkedAll = 'Y';
     $scope.filterCol       = {"data":[]};
     $scope.taxo4colFilter  = {"data":[]};
     $scope.catg_grid       = {'parent_scope':$scope};
     $scope.cmn_grp         = {};
     $scope.tabledatas      = {};
     $scope.across          = false;
    /*********************************************/
     $scope.clsfictintbl = {parent_scope:  $scope,options: {filter: true, arrow: false, icon: true}}
     $scope.referDoc = {parent_scope: $scope,id: 'iframe',path: 'src/iframe_ref_2.html?/src/no_ref_found.html',active: 'html',options: {zoom: true, clear: true, multiselect: true},htmlRef: true,"html_type": "pdf", "config_id": "docTest", "doc_type": "pdf", toolBar: true, dropDown: true,"group_duplicate": true};
     $scope.popref   = {parent_scope: $scope,id: 'iframepop',path: '/src/iframe_ref_2.html?/src/no_ref_found.html',active: 'html',options: {zoom: true, clear: true, multiselect: true},htmlRef: true,"html_type": "pdf", "config_id": "docTest", "doc_type": "pdf", toolBar: true, dropDown: true};
     $scope.popuptables = {"parent_scope": $scope,"grid_id": "tablepopup"};
     $scope.tablerefernce = {parent_scope: $scope,id: 'tablerefernce',path: '/src/iframe_ref_2.html?/src/no_ref_found.html',active: 'html',options: {zoom: true, clear: true, multiselect: true},htmlRef: true,"pdfRef": true,"html_type": "pdf", "config_id": "tablerefernce_1", "doc_type": "pdf", toolBar: true};
     /*********************************************/
     $scope.selctedProject  = {};
     $scope.selectedCompany = {};
     $scope.selectedDoc     = {};
     /*********************************************/
     $scope.assign = function(arg1,arg2,arg3){
           console.log(arg3)
           $scope.selctedProject  = {"db": arg1["db_name"], "pid": arg1["project_id"], "ws": 1};
           $scope.selectedCompany = {"id": arg2["company_id"]};
           $scope.selectedDoc     = {"doc_id": arg3["d"], "doc_type": arg3["doc_type"], "doc_name": arg3["doc_name"], "period": arg3["periodtype"]};
            var i = 1;
            var arr = [];
            while(i <= arg3["nop"]){
                arr.push(i);
                i++
            }
            $scope.pagecounts[arg3["d"]] = arr;
            //$scope.pagecounts = {"3":91,"4":70,"5":109,"6":91,"7":6,"8":61,"9":76,"10":77,"11":53,"12":113}
           /*$scope.selctedProject  = {"db": "AECN_INC", "pid": 34, "ws": 1};
           $scope.selectedCompany = {"id": "DNBFinancialCorp"};
           $scope.selectedDoc     = {"doc_id": 4329, "doc_type": arg3["doc_type"], "doc_name": arg3["doc_name"], "period": arg3["periodtype"]};*/
           $scope.slctionDoc($scope.selectedDoc);
     }
     /*********************************************/
      $scope.collapseToggle = function(){
            $scope.collapse = !$scope.collapse;
            $timeout(function(){
                 $scope.doResize();
            });
      }
     /*********************************************/
      $scope.grid_cb =  function (data){
            console.log('data', data)
            var get_ref_opt   = data['ref_opt'] || false;
            var get_col_data  = data['col'] || {};
            var get_re_data   = data['re'] || {};
            var get_ref_data  = data['ref'] || {};
            
            $scope.searchShow = false ;
            $scope.avShow     = false;
            $timeout(function(){
                  $scope.doResize();
            },300);

            var getRowIndex = get_col_data.grid.rows.findIndex(function(r) {return r.entity['cid'] == get_re_data["cid"]});
            $scope.taxoOptions1["rind"] = getRowIndex;
            $scope.taxoOptions1["cid"] = get_re_data["cid"];
            $scope.taxoOptions1.scope.selectedCell = data;

            $scope.rowMap = {};
            $scope.parent_row = get_col_data.grid.rows[getRowIndex];
            var taxoList = [];
      
             while($scope.parent_row.treeNode.parentRow != null){
                  $scope.parent_row = $scope.parent_row.treeNode.parentRow;
             }
             
            $scope.taxoListRecursion([$scope.parent_row.treeNode],taxoList)
            taxoList.forEach(function(t,index){
                  t["t_id"] = index + 1
            });
 
            $scope.referDoc.scope.drop_data_set(taxoList)
            $scope.taxo_list = taxoList;
            $scope.documentHighLight(get_ref_data, $scope.taxoOptions1.sel);
            if(get_col_data.field != 't' &&  get_ref_data['values'][$scope.taxoOptions1.sel] ){
                    if($scope.taxoOptions1["parentcid"] != $scope.parent_row.entity.cid){
                         $scope.taxoOptions1["parentcid"] = $scope.parent_row.entity.cid;
                         if($scope.dataBuilderShow)
                           $scope.getBuilder(false, false)

                         if($scope.catg_popup){
                            $scope.call_catg_data(false);
                          }
                    }
            }
       }
     /*********************************************/
      $scope.taxoListRecursion = function(arg, arr){
           arg.forEach(function(r){
                var ent = r.row.entity;
                var id  = ent.t.v + "_" + ent.cid;
                arr.push({"tdata":{'cn': ent.c_n, 'sn': ent.s_n, 't': ent.t.v}, "taxo": ent.t.v, "id": id,"dropdown": ($scope.lookupData[ent.t.v] || []).map(function(v){return [v['lcode'], v['ldesc']]})});
                $scope.rowMap[id] = r.row;
                if(r.children.length){
                    $scope.taxoListRecursion(r.children, arr);
                }
           });
      }
     /*********************************************/
     $scope.rootParentRecu_cat = function(arg,arr, done_d){
           arg.forEach(function(r){
		var key = r.row.entity.c_n+'$$'+r.row.entity.s_n+r.row.entity.t['v']
		if(key in done_d)return
		done_d[key]	= 1
                arr.push(r.row.entity);
                if(r.children.length){
                   $scope.rootParentRecu_cat(r.children, arr, done_d);
                }else{
                }
           });
      }

     /*********************************************/
     $scope.slt_data_frame = function(pageno, dic, value){
                var obj = {};
               console.log(dic);
                var pageno = Object.keys(dic["ref"])[0]; 
                var getObj = dic["ref"][pageno];
                obj['v'] = dic['v'];
                var xml_list = '';
                var chartse = '';
                for(var i in getObj){
                    pageno = i.split("_")[1];
                    xml_list += i + "$";
                    chartse += getObj[i] + "$"; 
                }
                obj["c"] = chartse;
                obj["x"] = xml_list;
                obj['pno'] = pageno;
                if(dic["c_c"] || dic["c_desc"]){
                     obj["lcode"] = dic["c_c"];
                     obj["ldesc"] = dic["c_desc"];
                }
                
                if($scope.applicator){
                       obj["d"] = $scope.taxoOptions4["uid"].split("_")[0];
                       var rowLength = $scope.taxoOptions4.grid_data.length;
                       for(var i=0; i < rowLength; i++){
                            if($scope.taxoOptions4.grid_data[i]["t"]["v"] == value){
                                  var newDicKey = $scope.taxoOptions4["uid"];
                                  var newobj = {"v": dic["v"]};
                                  $scope.taxoOptions4.grid_data[i][newDicKey] = newobj;
                                  obj["rid"] = i+1;
                                  var grid_key = i+ 1 + "_" + newDicKey;
                                  var values = {"values": [obj]};
                                  $scope.taxoOptions4.grid_map_data[grid_key] =  values;
                                  $scope.taxoOptions4.grid_map_data[grid_key]["edit"] = "Y";
                                  break;
                            }
                       }
                }else{ 
                       if(!$scope.dataBuilderShow){
                             if(!value){
                                 var rowIndex = $scope.findObjectIndexOfArray($scope.taxoOptions1.grid_data,{"cid": $scope.taxoOptions1.cid},"cid");
                                  if(rowIndex < 0){
                                      tasAlert.show("Select Any One Cell","warning", 1000);
                                      return
                                  }
                                  $scope.taxoOptions1.grid_data[rowIndex].values.v = [dic["v"]];
                                  $scope.taxoOptions1.grid_data[rowIndex]["edit"] = "Y";
                                  var map_data = $scope.taxoOptions1.grid_data[rowIndex]["cid"] + "_values"
                             }else{
                                  var id = dic["id"];
                                  $scope.rowMap[id].entity.values.v	= [dic["v"]]
                                  $scope.rowMap[id].entity["edit"]      = "Y";
                                  var map_data = $scope.rowMap[id].entity.cid + "_values"; 
                             }
                                  obj["d"] = $scope.referDoc["d"] || $scope.selectedDoc["doc_id"];
                                  $scope.taxoOptions1.grid_map_data[map_data].values	= [obj];
                                  $scope.taxoOptions1.grid_map_data[map_data]["edit"] = "Y";
                                  $scope.taxoOptions1.scope.selectedCell.col.grid.rows.forEach(function(r){
                                      if(r.entity.edit == "Y"){
                                         $scope.recur(r.treeNode);
                                      } 
                                  });
                       } 
                }
           if($scope.dataBuilderShow && $scope.avShow && !$scope.applicator){
                var row    = $scope.taxoOptions2["grid_data"][$scope.taxoOptions2["cid"] - 1];
                var seq    = row["seq"];
                var s_para = row["s_para"];
                var postData = {"oper_flag": 617,"pid": $scope.selctedProject["pid"], "db": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"], "doc_id": $scope.searchDocid, "x": obj["x"], "c": obj["c"],"seq": seq, "s_para": s_para};
                $scope.config.parent_scope.ps = true;
                $scope.tasService.ajax_request(postData, "POST", $scope.taxoListSave);
           }
           $scope.referDoc.scope.txo_list_pop_cls();
     }
     /*********************************************/
      $scope.recur = function(arg){
           arg.row.entity.edit = "Y";
           if(arg.parentRow != null){
              $scope.recur(arg.parentRow.treeNode);
           }
      }
     /*********************************************/
      $scope.taxoListSave = function(res){
           $scope.config.parent_scope.ps = false;
           if(res["message"] == "done"){
               tasAlert.show(res["message"], "success", 500);
               $timeout(function(){
                   $scope.getBuilder(false, true); 
               }, 500);
           }else{
               tasAlert.show(res['message'], 'error', 1000);
           }
      }
     /*********************************************/
      $scope.getDataCb = function(res){
           $scope.config.parent_scope.ps = false;
           $scope.taxoOptions1.scope.selectedCell = "";
           $scope.referDoc.path = "src/iframe_ref_2.html?/src/no_ref_found.html";
           if(res["message"] == "done"){
                  res['col_def'].forEach(function(r){
                     if(!("v_opt" in r)){
                          r['ce'] = false;
                          r["ct"] = "<div class=\"ui-grid-cell-contents grid-cell-text slt_{{COL_FIELD['SLT']}}\" ng-class=\"{'act_row': row.entity.cid == grid.appScope.selectedCell['re']['cid'],'act_cell': (row.entity.cid + '_' + col.field) == grid.appScope.selectedCell['re']['cid']+'_'+ col.field, 'edit_cl': grid.appScope.gconfig.grid_map_data[row.entity.cid + '_' + col.field]['edit'] == 'Y'}\" ng-click=\"grid.appScope.grid_val_call(row.entity,col)\"><div class=\"cell_leaf_value ellipsis\" ng-repeat=\"mrval in COL_FIELD['v'] track by $index\" title=\"{{mrval}}\" ng-click=\"grid.appScope.gconfig['sel']=$index;\" ><div  ng-bind-html=\"mrval\" class=\"mrval ellipsis\"></div><div ng-if=\"mrval\" class=\"d-vl\" ng-click=\"grid.appScope.gconfig.parent_scope.deleteValue(row.entity, $index);$event.stopPropagation();\" title=\"Delete value\"><i class=\"fa fa-trash\"></i></div></div><span class=\"vl-flg\" title=\"{{grid.appScope.gconfig.grid_map_data[row.entity.cid + '_values']['values'][$index]['lcode']}}\" ng-if=\"grid.appScope.gconfig.grid_map_data[row.entity.cid + '_values']['values'][$index]['lcode']\">{{grid.appScope.gconfig.grid_map_data[row.entity.cid + '_values']['values'][$index]['lcode']}}</span></div>";
                     }else{
                           r["cls"] = "dubmake";
                           r["ad"]  = "<div class=\"dublicate\"><span ng-if=\"row.treeNode.children.length\" ng-click=\"grid.appScope.gconfig.parent_scope.dublicate(row);$event.stopPropagation();\"><i class=\"fa fa-clone\"></i></span><span class=\"tree-del\" ng-click=\"grid.appScope.gconfig.parent_scope.treeCellDelete(row);$event.stopPropagation();\" title=\"Delete Row\"><i class=\"fa fa-trash\"></i></span></div>";
                     } 
                  });
                 $scope.taxoOptions1 = Object.assign($scope.taxoOptions1,{"sel":"",'grid_id':'taxo_grid','grid_map_data':res['map'],'grid_cb':'grid_cb','grid_data': res['data'],'grid_coldef': res['col_def'] ,'parent_scope':$scope,'ref_opt':true});
                 $scope.taxoOptions1.scope.init_grid($scope.taxoOptions1);

                 var postData2 = {"oper_flag": 607,"db_name": $scope.selctedProject["db"],"project_id": $scope.selctedProject["pid"]};
                 $scope.config.parent_scope.ps = true;
                 $scope.tasService.ajax_request(postData2, "POST", $scope.getLookup);
                 
                 $timeout(function(){
                      for(var j = 0; j < res["data"].length; j++){
                           var loopBreak = false;
                           for(var k = 0 ; k < res["data"][j].values["v"].length; k++){
                                if(res["data"][j].values["v"][k]){
                                     loopBreak = true;
                                     $scope.taxoOptions1.sel = k;
                                     break;
                                 }
                            }
                            if(loopBreak){
                                 $scope.taxoOptions1.scope.grid_val_call(res["data"][j], $scope.taxoOptions1.scope.grids_data_api.grid.columns[2]);
                                 break;
                             }
                       }
                       $timeout(function(){ 
                              $scope.taxoOptions1.scope.grids_data_api.core.scrollTo($scope.taxoOptions1.scope.grids_data.data[j],$scope.taxoOptions1.scope.grids_data.columnDefs[1]);
                       });
                  });
                      
           }else{
                 tasAlert.show(res['message'], 'error', 1000);
           }
      }
     /*********************************************/
      $scope.dublicate = function(row){
             var index       = $scope.findObjectIndexOfArray($scope.taxoOptions1.grid_data, row.entity, "cid");
             var nrow        = angular.copy($scope.taxoOptions1.grid_data[index])
             var nrowid          = 'N_'+(new Date()).getTime()
             nrow['cid']     = nrowid
             nrow['rid']     = nrowid
             nrow['values']  = {'v':''}
             nrow['grpid']     = -1;
             nrow['p_grpid']   = -1;
             $scope.taxoOptions1.grid_map_data[nrowid+'_values'] = {'values':[{'d': '', 'c': '', 'pno': '', 'v': '', 'x': '', 'new_row': 1}]}
             $scope.taxoOptions1.grid_map_data[nrowid+'_t'] = {};
		 
             var levelId = row.entity["$$treeLevel"];
             var n_ar = [nrow]
             var last_index_array = index
             console.log(row,index)

             for(var a=index+1, a_l = $scope.taxoOptions1.grid_data.length; a<a_l; a++){
                    var nrow = angular.copy($scope.taxoOptions1.grid_data[a]);
                    //console.log('nrow ', a, nrow)
                    if(nrow['$$treeLevel'] > levelId){
                          var nrow        = angular.copy(nrow)
                          nrowid          = 'N_'+((new Date()).getTime())+'_'+a;
                          nrow['cid']     = nrowid;
                          nrow['rid']     = nrowid;
                          nrow['values']  = {'v':[]}
                          $scope.taxoOptions1.grid_map_data[nrowid+'_values'] = {'values':[{'d': '', 'c': '', 'pno': '', 'v': '', 'x': '', 'new_row': 1}]};
                          $scope.taxoOptions1.grid_map_data[nrowid+'_t']      = {};
                          nrow['grpid']     = -1;
                          nrow['p_grpid']   = -1;
                          n_ar.push(nrow)
                          last_index_array  = a
                     }else{
                          break;
                     }
             }
             $scope.taxoOptions1.grid_data = $scope.addNewArrayAt($scope.taxoOptions1.grid_data, last_index_array+1, n_ar);
             $timeout(function(){
                      $scope.taxoOptions1.scope.grid_val_call($scope.taxoOptions1.grid_data[last_index_array+1], $scope.taxoOptions1.scope.grids_data_api.grid.columns[2]);
                      $scope.taxoOptions1.scope.grids_data_api.treeBase.expandRowChildren($scope.taxoOptions1.scope.grids_data_api.grid.rows[last_index_array+1]);
             });
        }
        $scope.addNewArrayAt = function(arr, idx, newArr) {
              Array.prototype.splice.apply(arr, [idx, 0].concat(newArr));
              return arr;
        }
     /*********************************************/
      $scope.doResize = function(){
           $timeout(function(){
               window.dispatchEvent(new Event('resize'));
           });
      }
     /*********************************************/
      $scope.searchToggle = function(){
           $scope.searchShow = !$scope.searchShow;
           if($scope.avShow){
               $scope.avShow = false;
               $scope.searchShow = false;
           }
           $timeout(function(){
               $scope.doResize();
           },300);
      }
     /*********************************************/
      $scope.searchHere = function(){
           if($scope.searchText["text"]){
               $scope.suggestionData = [];
               var postData = {"oper_flag": 605, "pid": $scope.selctedProject["pid"], "doc_id": $scope.searchDocid,"text": encodeURIComponent($scope.searchText["text"]),"f":1};
               /*if($scope.avShow){
                   postData["doc_id"] = $scope.taxoOptions2["uid"];
               }*/
               $scope.config.parent_scope.ps = true;
               $scope.tasService.ajax_request(postData, "POST", $scope.resultSearch);
           }else{
                tasAlert.show("Search field is Empty","warning", 1000);
           }
      }
     /*********************************************/
      var searchColdef = [{
               k: 'k',
               n: 'S.No',
               type: 'SL',
               ct:`<div class="ui-grid-cell-contents row_col_grid_cell text-center" ng-class="{'act_row': row.entity.k == grid.appScope.gconfig.k}">{{COL_FIELD}}</div>`,
               fc:[{
                     noTerm: true,
	             condition: function(term, value, row, column){
                            if(!term)
                                return true
                            var srhed_val = (term.toLowerCase()).replace(/\\/g,'');
                            var rwdata = String((value||{}) || "").toLowerCase();
                            return (rwdata.indexOf(srhed_val) != -1)
                     }
               }]
           },
           {
               k: 'text',
               n: 'Text',
               width: '*',
               ct:`<div class="ui-grid-cell-contents row_col_grid_cell cell-border" ng-click="grid.appScope.gconfig.parent_scope.getHighlightData(row.entity);" title="{{COL_FIELD}}" ng-class="{'active': row.entity.k == grid.appScope.gconfig.k}">{{COL_FIELD}}</div>`, 
               fc:[{
                     noTerm: true,
	             condition: function(term, value, row, column){
                          if(!term)
                             return true
                          var srhed_val = (term.toLowerCase()).replace(/\\/g,'')
                          var rwdata = String((value||{}) || "").toLowerCase();
                          return (rwdata.indexOf(srhed_val) != -1)
                      }
               }]
           }
             ];
     /*********************************************/
      var ctch = "<div class=\"ui-grid-cell-contents\" style=\"padding: 0px; cursor: pointer;\" ng-click=\"grid.appScope.gconfig.parent_scope.colParaids[grid.appScope.gconfig.parent_scope.searchDocid + '@' + row.entity.paraid] != row.entity.paraid && grid.appScope.gridCheck(row.entity)\"><div class=\"checkBox\"><span ng-if=\"row.entity.checked != 'Y' \"><svg viewBox=\"0 0 50 50\"><path d=\"M 39 4 L 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 11 C 46 7.101563 42.898438 4 39 4 Z M 42 39 C 42 40.699219 40.699219 42 39 42 L 11 42 C 9.300781 42 8 40.699219 8 39 L 8 11 C 8 9.300781 9.300781 8 11 8 L 39 8 C 40.699219 8 42 9.300781 42 11 Z\"></path></svg></span><span ng-if=\" row.entity.checked == 'Y' \"><svg viewBox=\"0 0 24 24\" fill=\"#33b5e5\"><path d=\"M 5 3 C 3.897 3 3 3.897 3 5 L 3 19 C 3 20.103 3.897 21 5 21 L 19 21 C 20.103 21 21 20.103 21 19 L 21 9.2421875 L 19 11.242188 L 19.001953 19 L 5 19 L 5 5 L 16.757812 5 L 18.757812 3 L 5 3 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z\"></path></svg></span></div></div>";
      var ct1 = `<div class="ui-grid-cell-contents row_col_grid_cell text-center" ng-class="{'act_row': row.entity.k == grid.appScope.gconfig.k, 'paramatch': grid.appScope.gconfig.parent_scope.colParaids[grid.appScope.gconfig.parent_scope.searchDocid + '@' + row.entity.paraid] == COL_FIELD}">{{COL_FIELD}}</div>`;
      var ct2 =`<div class="ui-grid-cell-contents row_col_grid_cell cell-border" ng-click="grid.appScope.gconfig.parent_scope.getHighlightData(row.entity);" title="{{COL_FIELD}}" ng-class="{'act_cell': row.entity.k == grid.appScope.gconfig.k}">{{COL_FIELD}}</div>`;
      var fc = [{
                     noTerm: true,
	             condition: function(term, value, row, column){
                          if(!term)
                             return true
                          var srhed_val = (term.toLowerCase()).replace(/\\/g,'')
                          var rwdata = String((value||{}) || "").toLowerCase();
                          return (rwdata.indexOf(srhed_val) != -1)
                      }
               }]
      var avlColdef = [{"v_opt": 3,'ct': ctch},{"k": "k","type":"SL","n":"S.No","ct": ct1, "fc": fc},{"k":"paraid","type":"SL","n":"Para ID", "ct": ct1, "fc": fc},{"k":"text","n":"Text", "ct": ct2, "fc": fc}]
     /*********************************************/
      $scope.resultSearch = function(res){
            $scope.config.parent_scope.ps = false;
            $scope.searchSping = false;
            if(res["message"] == "done"){
                $scope.taxoOptions3['grid_map_data'] = res['map'];
                $scope.taxoOptions3['grid_data']     = res['data'];
                $scope.taxoOptions3['grid_coldef']   = searchColdef;
                if($scope.avShow){
                      $scope.taxoOptions3["grid_coldef"] = avlColdef;
                }
		$scope.taxoOptions3.scope.init_grid($scope.taxoOptions3);
               
                if(!$scope.avShow && !$scope.applicator){
            	     $scope.referDoc.scope.iframe_page_no_change($scope.referDoc);
                     var snippet = "<style>.full_dic { font-size: 13px; line-height: normal; width: 100%; font-family: 'Roboto', sans-serif; color: #012b3b; background: #ffffff; position: relative; width: calc(100% - 18px); margin: 6px; border: 1px solid #b5ddff; }.header-pno { line-height: 30px; color: #333; background: #e4eaf2; border-color: #e4e4e4; font-weight: 700; padding-left: 5px; } .body-html { padding: 5px; line-height: 20px; }</style>" + res["snippet"];
                      $timeout(function(){
                              $scope.referDoc.scope.create_search_html_func(snippet,$scope.referDoc);
                              $scope.referDoc["snippet"] = "loaded"; 
                              if(res["data"].length){
                                    $scope.getHighlightData(res["data"][0]);
                              } 
                      });
                }else{
                     if(res["data"].length){
                          $scope.getHighlightData(res["data"][0]);
                     } 

                }
                
            }else{
                 tasAlert.show(res["message"],"error", 1000);
            }
      }
     /*********************************************/
       $scope.arrindexfind = function(element){
              return element['k'] ==  this.k;
       }
     /*********************************************/
      $scope.searchText = {};
      $scope.autosuggestion = function(event){
           if((event.keyCode == 40 || event.keyCode == 38 || event.keyCode == 13)){
                   if($scope.suggestionData){ 
                   var length = $scope.suggestionData.length;
                   }
                   if($scope.keyupSelection){
                        var index =  $scope.suggestionData.findIndex($scope.arrindexfind,$scope.keyupSelection);
                   }else{
                        var index = -1;
                   }

                   if(event.keyCode == 38){
                        index = index - 1;
                   }else if(event.keyCode == 40){
                       index = index + 1;
                   }

                   if(0 <= index && index < length && (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13)){
                         var myDiv = document.querySelector('.sugg-list');
                         var prnt_height = myDiv.offsetHeight;
                         var child = document.querySelector('.move');

                         if(child){
                              var scrl_height = child.offsetTop;
                              var scrol_mins = prnt_height - child.offsetHeight;
                              if(scrl_height > 148 || 0 < myDiv.scrollTop){
                                  scrl_height = scrl_height - child.offsetHeight;
                                  myDiv.scrollTo(0,scrl_height);
                               }
                         }

                         $scope.keyupSelection = angular.copy($scope.suggestionData[index]);
                         if(event.keyCode == 13){
                              $scope.selectionSuggtion($scope.keyupSelection);
                         }
                    }else{
                        if(event.keyCode == 13){
                                $scope.searchHere();
                        }
                    }

             }else{
                if($scope.searchText['text']){
                       $scope.searchSping = true;
                       var postData = {"oper_flag": 605, "pid": $scope.selctedProject["pid"], "doc_id": $scope.searchDocid,"text": encodeURIComponent($scope.searchText['text'])};
                       /*if($scope.avShow){
                           postData["doc_id"] = $scope.taxoOptions2["uid"];
                       }*/
                       $scope.tasService.ajax_request(postData, "POST", $scope.autosuggestionCb);
                }
           }
      }
     /*********************************************/
      $scope.autosuggestionCb = function(res){
           $scope.searchSping = false;
           $scope.suggestionData = res["data"]; 
      }
     /*********************************************/
      $scope.selectionSuggtion = function(obj){
            $scope.searchSping = true;
            $scope.searchText = obj;
            $scope.keyupSelection = {};
            $scope.suggestionData = [];
            $scope.searchHere();
      }
     /*********************************************/
      $(document).bind('click',function(event){
              var elm = document.querySelector(".sugg-list");
              if(elm){
                   $scope.$apply(function(){
                       $scope.suggestionData = [];
                   });
              }
       })
     /*********************************************/
      $scope.getHighlightData = function(data){
            //$scope.slcrSearch = data
            $scope.taxoOptions3["k"] = data.k;
            console.log(data)
            if($scope.avShow || $scope.applicator){
                var pno = data.xml_id[0][0].split("_")[1];
                var d   = data["d"];
                $scope.referDoc.path = 'src/iframe_ref_2.html?/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' + d + '/html/' + pno + '.html';
                $scope.referDoc.pno_list = $scope.pagecounts[d];
                $scope.referDoc.selected_pno = pno;
            }
            $scope.referDoc.ref = [];
            var nodes = [];
            var ref = {};
            ref["xml_list"] = [];
            data.xml_id.forEach(function(r){
                 if($scope.avShow || $scope.applicator){
                     var re = {};
                     re["c"] = [];
                     re["x"] = r[0];
                     re["c"].push(r[1] + "_" + r[2]);
                     nodes.push(re);
		 }else{
                    ref["xml_list"].push(r[0]);
                 }
            });
            nodes.push(ref);
            $scope.referDoc.ref = nodes;
            $scope.referDoc.scope.clear_table_highlight($scope.referDoc['id']);
            $scope.referDoc.scope.iframe_page_no_change($scope.referDoc);
      }
     /*********************************************/
      $scope.selectionText = function(e){
      }
     /*********************************************/
      $scope.cbBuilderData = function(res){
            $scope.config.parent_scope.ps = false;
            if(res["message"] == "done"){
		    $scope.seq = res['map']['SEQ'];
                    var tmp = {};
                    res['col_def'].forEach(function(r,index){
                         if(index != 0){
                             r["w"] = 300;
                             r["ct"] = "<div class=\"ui-grid-cell-contents grid-cell-text white-space delCls\" ng-class=\"{'act_row': row.entity.cid == grid.appScope.gconfig['cid'], 'act_cell': (row.entity['cid'] + '_' + col.field) == grid.appScope.gconfig['cid'] + '_' + grid.appScope.gconfig['uid'],'pass-text':  COL_FIELD['poss'], 'usraddtxt': row.entity[col.field]['user_add'] == 'Y'}\"  ng-click=\"grid.appScope.gconfig['sel']=$index;grid.appScope.grid_val_call(row.entity,col)\"><div class=\"cell_leaf_value \" data-ng-bind-html=\"COL_FIELD['v'] | trusted1\" title=\"{{COL_FIELD['s_pid'] + '\n' + grid.appScope.gconfig['grid_map_data'][row.entity.cid +'_'+ col.field]['para_id']}}\" ng-mouseup=\"grid.appScope.gconfig.parent_scope.selectionText($event)\"></div><span class=\"fa fa-trash-o del-val\" ng-click=\"grid.appScope.gconfig.parent_scope.deleteuseradded(row.entity,col.field);$event.stopPropagation();\" ng-if=\"COL_FIELD['v']\"></span></div>";
                             r["ht"] = "<div role=\"columnheader\" ng-class=\"{ 'sortable': sortable, 'ui-grid-header-cell-last-col': isLastCol}\" ui-grid-one-bind-aria-labelledby-grid=\"col.uid + '-header-text ' + col.uid + '-sortdir-text'\" aria-sort=\"{{col.sort.direction == asc ? 'ascending' : ( col.sort.direction == desc ? 'descending' : (!col.sort.direction ? 'none' : 'other'))}}\"><div role=\"button\" tabindex=\"0\" ng-keydown=\"handleKeyDown($event)\" class=\"ui-grid-cell-contents ui-grid-header-cell-primary-focus\" col-index=\"renderIndex\" title=\"TOOLTIP\"  ng-class=\"{'selct-col': grid.appScope.gconfig.selectedCol[col.name] == 1, 'divide_flg': col.colDef.config_data['divident_flg'] == 'Y'}\" ng-click=\"grid.appScope.gconfig.parent_scope.slctcolbuilder(col)\"><span class=\"ui-grid-header-cell-label\" ui-grid-one-bind-id-grid=\"col.uid + '-header-text'\">{{ col.displayName CUSTOM_FILTERS }}</span> <span ui-grid-one-bind-id-grid=\"col.uid + '-sortdir-text'\" ui-grid-visible=\"col.sort.direction\" aria-label=\"{{getSortDirectionAriaLabel()}}\"><i ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\" title=\"{{isSortPriorityVisible() ? i18n.headerCell.priority + ' ' + ( col.sort.priority + 1 )  : null}}\" aria-hidden=\"true\"></i> <sub ui-grid-visible=\"isSortPriorityVisible()\" class=\"ui-grid-sort-priority-number\">{{col.sort.priority + 1}}</sub></span></div><div role=\"button\" tabindex=\"0\" ui-grid-one-bind-id-grid=\"col.uid + '-menu-button'\" class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" ng-click=\"toggleMenu($event)\" ng-keydown=\"headerCellArrowKeyDown($event)\" ui-grid-one-bind-aria-label=\"i18n.headerCell.aria.columnMenuButtonLabel\" aria-haspopup=\"true\"><i class=\"ui-grid-icon-angle-down\" aria-hidden=\"true\">&nbsp;</i></div><div ui-grid-filter></div></div>";
                            tmp[r.k] = 1;
                         }
                    });
                    $scope.taxoOptions2["selectedCol"] = tmp;
                     $scope.taxoOptions2 = Object.assign($scope.taxoOptions2,{'grid_id':'taxo_grid','grid_map_data':res['map'],'grid_cb':'grid_cb_2','grid_data': res['data'],'grid_coldef': res['col_def'] ,"stack": res["stack"], 'parent_scope':$scope,'ref_opt':true, 'row_height': 175});
                  $scope.taxoOptions2.scope.init_grid($scope.taxoOptions2);

                 $timeout(function(){
                      for(var i=0;i < res["data"].length;i++){
                          var loopBreak = false;
                          for(var x in res["data"][i]){
                               if( res["data"][i][x]["v"]){
                                    loopBreak = true;
                                    break;
                               }
                          }
                          if(loopBreak){
                              var colind = res["col_def"].index("k", x);
                              $scope.taxoOptions2.scope.grid_val_call(res["data"][i], $scope.taxoOptions2.scope.grids_data_api.grid.columns[colind+1]);  
                              break;
                          }
                       }
                      $timeout(function(){
                          $scope.taxoOptions2.scope.grids_data_api.core.scrollTo($scope.taxoOptions2.scope.grids_data.data[i], $scope.taxoOptions2.scope.grids_data.columnDefs[colind]);
                      });
                 }); 
            }else{
                tasAlert.show(res["message"], "error", 1000);
            }

      }  
     /*********************************************/
       $scope.getBuilder = function(arg, rsh){
              if(arg)
                $scope.dataBuilderShow = !$scope.dataBuilderShow;

              if(!$scope.dataBuilderShow)
                 $scope.sltgridshow = false;

              if(($scope.taxoOptions1.scope.selectedCell && $scope.taxoOptions1.scope.selectedCell.ref) && ($scope.dataBuilderShow)){
                        $scope.avShow = true;
                        var xml = []; 
                        var c = [];
                         for(var z in $scope.rowMap){
                             var key = $scope.rowMap[z].entity.cid + "_values";
                              $scope.taxoOptions1.grid_map_data[key]["values"].forEach(function(y){
                                  if(y.x != "" && y.c != ""){
                                      xml.push(y.x)
                                      c.push(y.c)
                                  }
                              }); 
                         }
                          xml = xml.join("#");
                          c = c.join("#");
                          if(c && xml){
                                 var postData = {"oper_flag": 606, "pid": $scope.selctedProject["pid"], "db": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"], "doc_id": $scope.selectedDoc["doc_id"], "x": xml, "c": c,"taxo_lst": $scope.taxo_list.map(function(r){r=r.tdata;return [r.cn, r.sn, r.t]})};
                                 $scope.config.parent_scope.ps = true;
                                 if(rsh)
                                   $scope.tasService.ajax_request(postData, "POST", $scope.builderRefersh);
                                 else
                                    $scope.tasService.ajax_request(postData, "POST", $scope.cbBuilderData);
                          }else{
                               tasAlert.show("No data", "warning", 1000);
                               $scope.taxoOptions2 = Object.assign($scope.taxoOptions2,{'grid_id':'taxo_grid','grid_map_data': {},'grid_cb':'grid_cb_2','grid_data': [],'grid_coldef': [] ,'parent_scope':$scope,'ref_opt':true});
                               $scope.taxoOptions2.scope.init_grid($scope.taxoOptions2);
                          }
                    }
            $timeout(function(){
                 $scope.doResize();
            },400);
       }
     /*********************************************/
      $scope.taxoOptions3 = {'grid_id':'searchGridid','grid_cb': 'getHighlightData','parent_scope':$scope,'ref_opt':true, "row_height": 30};
      $scope.grid_cb_2 =  function (data){
             console.log('data',data);
             var get_ref_opt   = data['ref_opt'] || false;
             var get_col_data  = data['col'] || {};
             var get_re_data   = data['re'] || {};
             var get_ref_data  = data['ref'] || {};
             $scope.referDoc['d_path'] = '/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' + get_col_data.field + '/sieve_input/' + get_col_data.field + '.pdf';

	     var c_field = data['col']['field'];	
             $scope.searchShow = false;
             $timeout(function(){
                 $scope.doResize();
            },300);

                  
 
             if(get_col_data.field != 's'){
                    $scope.taxoOptions2['cid'] = get_re_data['cid']; 
                    $scope.taxoOptions2['uid'] = get_col_data.field;
                    $scope.searchDocid         = $scope.taxoOptions2['uid'];
                  
                    $scope.colParaids = {};
                    for(var s in $scope.taxoOptions2['grid_map_data']){
                          var para = $scope.taxoOptions2['grid_map_data'][s]["para_id"];
                          var dk   = $scope.searchDocid + "@" + para;
                          $scope.colParaids[dk] = para;
                    }
     
                    var chPass = get_re_data[get_col_data['field']];
	            var paraid = (get_re_data[c_field] || {})['poss'] || ""; 
 
                    if(chPass && 'poss' in chPass && chPass['pass'] != ''){
                             $scope.avShow = true;
                             $scope.searchShow = false;
                    }

                    //if(!Object.keys(get_ref_data).length){			 
			 if(paraid){
			     var postData = {"oper_flag": 609, "pid": $scope.selctedProject["pid"], "db": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"], "doc_id": get_col_data.field, "para_ids": paraid};
			     $scope.config.parent_scope.ps = true;
			     $scope.tasService.ajax_request(postData, "POST", $scope.paraCallBack);
                        return
             		 }
                    //}

                    if("snippet" in $scope.referDoc && $scope.referDoc["snippet"] == "loaded"){
                          $scope.referDoc.path = ""; 
                          $scope.referDoc.scope.iframe_page_no_change($scope.referDoc);
                           $scope.referDoc["snippet"] = "doc";
                   }
                   
                   if(Object.keys(get_ref_data).length){
                       var pno = get_ref_data['x'][0][0].split('_')[1]; 
                       var d   =  get_ref_data.d;
                   }else{
                       var pno = 1;
                       var d   = c_field;
                   }
                    $scope.referDoc.path = 'src/iframe_ref_2.html?/var_html_path/WorkSpaceBuilder_DB_demo/'+$scope.selctedProject["pid"]+'/1/pdata/docs/'+ d +'/html/'+ pno +'.html';
                    $scope.referDoc.pno_list = $scope.pagecounts[d];
                    $scope.referDoc["d"]     = d;
                    $scope.referDoc.selected_pno = pno; 
                   
                    var nodes = [];
                    get_ref_data['x'].forEach(function(r,ind){
                           var obj={};
                           obj['x'] = r[0];
                           obj['c'] = [];
                           obj['c'].push([r[1],r[2]].join("_"));
                           obj['clr_flg'] = 0,
                           nodes.push(obj);
                    }); 
                    $scope.referDoc.ref = nodes;
                    $scope.referDoc.scope.clear_table_highlight($scope.referDoc['id']);
                    $scope.referDoc.scope.iframe_page_no_change($scope.referDoc);
             }
       }
     /*********************************************/
      $scope.paraCallBack = function(res){
            console.log('res', res);
            $scope.config.parent_scope.ps = false;
            //if(res["message"] == "done"){
                   res['col_def'].unshift({"v_opt": 3});
                   $scope.taxoOptions3['grid_map_data'] = res['map'];
                   $scope.taxoOptions3['grid_cb']       = 'grid_cb_3';
                   $scope.taxoOptions3['grid_data']     = res['data'];
                   $scope.taxoOptions3['grid_coldef']   = res['col_def'];
                   $scope.taxoOptions3.scope.init_grid($scope.taxoOptions3);
                   $timeout(function(){
                        for(var x = 0; x < res["data"].length; x++){
                              if(res["data"][x]["paraid"]["v"] != ""){
                                    $scope.taxoOptions3.scope.grid_val_call(res["data"][0],$scope.taxoOptions3.scope.grids_data_api.grid.columns[4]);
                                    break;
                              }
                        }
                   })
              /*}else{
                tasAlert.show(res["message"], "error", 1000);  
              }*/
       }
     /*********************************************/
     $scope.para_id = '';	
     $scope.grid_cb_3 = function(data){
	 console.log('data', data);
	 $scope.para_id = data['re']['paraid']['v'];
         var get_ref_opt   = data['ref_opt'] || false;
         var get_col_data  = data['col'] || {};
         var get_re_data   = data['re'] || {};
         var get_ref_data  = data['ref'] || {};

	 if(get_col_data.field != 's'){
		$scope.taxoOptions3['cid'] = get_re_data['cid'];
                $scope.taxoOptions3['uid'] = get_re_data['cid'] + "_" + get_col_data.field;

		//var pno = get_ref_data['x'][0][0].split('_')[1];
		var pno = get_ref_data.pno;
                $scope.referDoc.path = 'src/iframe_ref_2.html?/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' + get_ref_data.d + '/html/' + pno + '.html';
                 $scope.referDoc['d_path'] = '/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' +  get_ref_data.d + '/sieve_input/' +  get_ref_data.d + '.pdf';
                $scope.referDoc["d"] = get_ref_data.d;
                $scope.referDoc.pno_list = $scope.pagecounts[get_ref_data.d];
                var nodes = [];
                get_ref_data['x'].forEach(function(r){
                        var obj={};
                        obj['x'] = r[0];
                        obj['c'] = [];
                        obj['c'].push([r[1],r[2]].join("_"));
                        obj['clr_flg'] = 0,
                        nodes.push(obj);
                });
                $scope.referDoc.ref = nodes;
                $scope.referDoc.selected_pno = pno;
                $scope.referDoc.scope.clear_table_highlight($scope.referDoc['id']);
                $scope.referDoc.scope.iframe_page_no_change($scope.referDoc);
	 }
     }		 
     /*********************************************/
     $scope.click_add = function(){
	    var parids = [];
            $scope.taxoOptions3.grid_data.forEach(function(r){
                if("checked" in r && r["checked"] == "Y" && "paraid" in r){
                    if(!r["paraid"]["v"] && r["paraid"])
                         parids.push(r["paraid"]);
                    else 
                     parids.push(r["paraid"]["v"]);
                }
            })
            if(!parids.length){
                  tasAlert.show("Selected any one Paraid", "warning", 1000);
                  return
            }
           var row = $scope.taxoOptions2["grid_data"][$scope.taxoOptions2["cid"] - 1];
           var seq = row["seq"];
           var s_para = row["s_para"]
           var postData = {"oper_flag": 612, "pid": $scope.selctedProject["pid"], "db": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"],"doc_id": $scope.taxoOptions2["uid"],"para_ids": parids, "seq": seq, "wid": $scope.selctedProject["ws"],"s_para": s_para};
	   $scope.config.parent_scope.ps = true;
	   $scope.tasService.ajax_request(postData, "POST", $scope.paraCb);
     }		
     /*********************************************/
      $scope.paraCb = function(res){
           $scope.config.parent_scope.ps = false;
           if(res["message"] == "done"){
               tasAlert.show(res["message"], "success", 500);
               $timeout(function(){
                   $scope.getBuilder(false, true); 
               }, 500);
           }else{
               tasAlert.show(res['message'], 'error', 1000);
           }
      }
     /*********************************************/
       $scope.findObjectIndexOfArray = function(arr, obj, key){
	   var val   = obj[key]
           return arr.findIndex(function(element){
                       return element[key] == val;
                  });
       }
    /*******************************************/
     $scope.getLookup = function(res){
           $scope.config.parent_scope.ps = false;
           if(res["message"] == "done"){
                $scope.lookupData = res["data"];
           }else{
                tasAlert.show(res['message'], 'error', 1000);
           }
     }
    /*******************************************/
     $scope.slctionDoc = function(obj){
            $scope.applicator         = false;
            $scope.dataBuilderShow    = false;
            $scope.searchShow         = false;
            $scope.avShow             = false;

            $scope.searchDocid        = obj["doc_id"];
            sessionStorage["docId"]   = obj["doc_id"];
            $scope.referDoc.pno_list  = []
            $scope.referDoc['d_path'] = '/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' + obj["doc_id"] + '/sieve_input/' + obj["doc_id"] + '.pdf';
            for(var i = 1; i <= Number(obj["page_count"]); i++ ){
                $scope.referDoc.pno_list.push(i);
            }
            var postData = {"oper_flag": 604,"doc_id": obj["doc_id"],"project_id": $scope.selctedProject["pid"],"agent_id": 1,"mgmt_id": 1,"cmd_id": $scope.selectedCompany["id"],"ws_id": $scope.selctedProject["ws"],"db_name": $scope.selctedProject["db"],"main_key": 0,"tab_key": 0,"tb_username": "sunil"};
            $scope.config.parent_scope.ps = true;
            $scope.tasService.ajax_request(postData, "POST", $scope.getDataCb);
     }
    /*******************************************/
     $scope.slt_app_data = function(){
               var sobj = {};
               var rows = $scope.taxoOptions2.grid_data;
               $scope.taxoOptions2.grid_coldef.forEach(function(r){
                   if(r.k != "s" && $scope.taxoOptions2["selectedCol"][r.k] == 1){
                        rows.forEach(function(p){
                            for(var sq in p["seq"]){
                                var mk = p.cid + "_" + r["k"];
                                //if(mk in $scope.taxoOptions2.grid_map_data){
		                    if(!(sobj.hasOwnProperty(sq))){
			                sobj[sq] = {};
				    }
				    if(!(sobj[sq].hasOwnProperty(r["k"]))){
				        sobj[sq][r['k']] = [];
				    }
                                    if(mk in $scope.taxoOptions2.grid_map_data){
                                    sobj[sq][r['k']].push($scope.taxoOptions2.grid_map_data[mk]["para_id"]);
                                    }
                                //}   
                            }
                        });
                   }
               });
          return sobj;
     }
    /*******************************************/
     $scope.getApplicator = function(arg){
          $timeout(function(){$scope.doResize()});
          if($scope.taxoOptions2.grid_coldef && $scope.taxoOptions2.grid_coldef.length){
               if(arg)
	           $scope.applicator = !$scope.applicator;
               $scope.searchShow = false ;
               $scope.avShow     = false;
               $scope.catg_popup = false;
               $timeout(function(){$scope.doResize()});
               if(!$scope.applicator){
                   $scope.avShow       = true;
                   $scope.searchDocid  = $scope.taxoOptions2["uid"];
                   $scope.taxoOptions4 =  Object.assign($scope.taxoOptions4,{'grid_id':'taxo_grid','grid_map_data': {},'grid_cb':'grid_cb_4','grid_data': [],'grid_coldef': [] ,'parent_scope':$scope,'ref_opt':true});
                   $scope.taxoOptions4.scope.init_grid($scope.taxoOptions4);
                   return
               }

               var sobj = $scope.slt_app_data();
               if(Object.keys(sobj).length){
                  var postData = {"oper_flag": 619, "pid": $scope.selctedProject["pid"], "db": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"], 'taxo_lst':$scope.taxo_list.map(function(r){r=r.tdata;return [r.cn, r.sn, r.t]}),"seqs": sobj};
                 if (event.ctrlKey) {
                     postData["cc"] = "N"; 
                 }
                  $scope.config.parent_scope.ps = true;
                  $scope.tasService.ajax_request(postData, "POST", $scope.runApplicatorCB);
               }
         }else{
              tasAlert.show("No data", 'warning', 1000);
         }
     }
    /*******************************************/
     $scope.runApplicatorCB = function(res){
        $scope.config.parent_scope.ps = false;
        if(res["message"] == "done"){
             var tmp = {};
             res['col_def'].forEach(function(r){
                 if(!("v_opt" in r)){
                     r["ht"] = "<div role=\"columnheader\" ng-class=\"{ 'sortable': sortable, 'ui-grid-header-cell-last-col': isLastCol}\" ui-grid-one-bind-aria-labelledby-grid=\"col.uid + '-header-text ' + col.uid + '-sortdir-text'\" aria-sort=\"{{col.sort.direction == asc ? 'ascending' : ( col.sort.direction == desc ? 'descending' : (!col.sort.direction ? 'none' : 'other'))}}\"><div role=\"button\" tabindex=\"0\" ng-keydown=\"handleKeyDown($event)\" class=\"ui-grid-cell-contents ui-grid-header-cell-primary-focus \" col-index=\"renderIndex\" title=\"TOOLTIP\"  ng-class=\"{'selct-col': grid.appScope.gconfig.selectedCol[col.name] == 1, 'divide_flg': col.colDef.config_data['databuilder'] == 'Y', 'even': col.colDef.config_data.class == 'even' && grid.appScope.gconfig.selectedCol[col.name] == 1, 'odd' : col.colDef.config_data.class == 'odd' && grid.appScope.gconfig.selectedCol[col.name] == 1,'rejectcl': col.colDef.config_data['rj'] == 'Y' && grid.appScope.gconfig.selectedCol[col.name] == 0}\"  ng-click=\" grid.appScope.gconfig.parent_scope.slctionofCol(col)\"><span class=\"ui-grid-header-cell-label\" ui-grid-one-bind-id-grid=\"col.uid + '-header-text'\">{{ col.displayName CUSTOM_FILTERS }}</span> <span ui-grid-one-bind-id-grid=\"col.uid + '-sortdir-text'\" ui-grid-visible=\"col.sort.direction\" aria-label=\"{{getSortDirectionAriaLabel()}}\"><i ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\" title=\"{{isSortPriorityVisible() ? i18n.headerCell.priority + ' ' + ( col.sort.priority + 1 )  : null}}\" aria-hidden=\"true\"></i> <sub ui-grid-visible=\"isSortPriorityVisible()\" class=\"ui-grid-sort-priority-number\">{{col.sort.priority + 1}}</sub></span></div><div role=\"button\" tabindex=\"0\" ui-grid-one-bind-id-grid=\"col.uid + '-menu-button'\" class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" ng-click=\"toggleMenu($event)\" ng-keydown=\"headerCellArrowKeyDown($event)\" ui-grid-one-bind-aria-label=\"i18n.headerCell.aria.columnMenuButtonLabel\" aria-haspopup=\"true\"><i class=\"ui-grid-icon-angle-down\" aria-hidden=\"true\">&nbsp;</i></div><div ui-grid-filter></div></div>";
                   r["ct"] = "<div class=\"ui-grid-cell-contents grid-cell-text slt_{{COL_FIELD['SLT']}}\" ng-class=\"{'act_row':row.entity['cid'] == grid.appScope.gconfig['cid'] ,'act_cell':(row.entity['cid']+'_'+ col.field) ==  grid.appScope.gconfig['cid'] + '_' + grid.appScope.gconfig['uid'],'delCls': COL_FIELD['v'], 'edit_cl': grid.appScope.gconfig.grid_map_data[row.entity.cid + '_' + col.field]['edit'] == 'Y', 'slt_txt': COL_FIELD['SLT'] == 'Y', 'dup_txt': COL_FIELD['duplicate'] == 'Y'}\" ng-click=\"grid.appScope.grid_val_call(row.entity,col)\" title=\"{{COL_FIELD['v']}}\"><div class=\"cell_leaf_value\" ><div class=\"\" ng-bind-html=\"COL_FIELD['v']\"></div><span class=\"fa fa-trash-o del-val-a\" ng-if=\"COL_FIELD['v']\" ng-click=\"grid.appScope.gconfig.parent_scope.deleteCellVal(row.entity,col.field);$event.stopPropagation();\"></span></div><span class=\"vl-flg\" style=\"padding: 0\"><span class=\"mrefdata\" ng-click=\"grid.appScope.gconfig.parent_scope.pshighlight(COL_FIELD['mrefdata']);;$event.stopPropagation();\" ng-if=\"COL_FIELD['mrefdata'].length\" title=\"{{COL_FIELD['mrefdata']}}\">{{COL_FIELD['mrefdata'][0][0]}}</span><span title=\"{{grid.appScope.gconfig.grid_map_data[row.entity.cid + '_' +col.field]['values'][0]['lcode']}}\" ng-if=\"grid.appScope.gconfig.grid_map_data[row.entity.cid + '_' + col.field]['values'][0]['lcode']\" style=\"padding: 0 4px;\">{{grid.appScope.gconfig.grid_map_data[row.entity.cid + '_' +col.field]['values'][0]['lcode']}}</span></span></div>";

                     if("rj" in r && r["rj"] == 'Y')
                        tmp[r.k] = 0; 
                     else
                        tmp[r.k] = 1; 
                 }
             });
                    
             $scope.taxoOptions4["selectedCol"] = tmp;	
	     $scope.taxoOptions4 = Object.assign($scope.taxoOptions4,{'grid_id':'taxo_grid','grid_map_data':res['map'],'grid_cb':'grid_cb_4','grid_data': res['data'],'grid_coldef': res['col_def'],'stack': res['stack'] ,'parent_scope':$scope,'ref_opt':true, "row_height": 30});
	     $scope.taxoOptions4.scope.init_grid($scope.taxoOptions4);
              $timeout(function(){
                    var colDef = res["col_def"];
                    for(var i = 1; i < colDef.length; i++){
                         var clfld = colDef[i]["k"];
                         var loopBreak = false;
                         for(var j = 0; j < res["data"].length; j++){
                              if(clfld in res["data"][j]  && res["data"][j][clfld]["v"] != ""){
                                  loopBreak = true;
                                  break;
                              }
                         }
                         if(loopBreak){
                              $scope.taxoOptions4.scope.grid_val_call(res["data"][j], $scope.taxoOptions4.scope.grids_data_api.grid.columns[i+1]);
                             $timeout(function(){
                                 $scope.taxoOptions4.scope.grids_data_api.core.scrollTo($scope.taxoOptions4.scope.grids_data.data[j], $scope.taxoOptions2.scope.grids_data.columnDefs[i]);
                             });
                              break;
                         }
                    }
              });
        }else{
            tasAlert.show(res['message'], 'error', 1000);
            $scope.taxoOptions4 =  Object.assign($scope.taxoOptions4,{'grid_id':'taxo_grid','grid_map_data': {},'grid_cb':'grid_cb_4','grid_data': [],'grid_coldef': [] ,'parent_scope':$scope,'ref_opt':true});
            $scope.taxoOptions4.scope.init_grid($scope.taxoOptions4);
        }
     }
    /*******************************************/
     $scope.deleteCellVal = function(row,field){
          var getMapKey = row["cid"] + "_" + field;
          $scope.taxoOptions4.grid_map_data[getMapKey]["values"][0]["v"] = ""; 
          $scope.taxoOptions4.grid_map_data[getMapKey]["values"][0]["c"] = ""; 
          $scope.taxoOptions4.grid_map_data[getMapKey]["values"][0]["x"] = ""; 
          row[field]["v"] = "";
     }
    /*******************************************/
    $scope.grid_cb_4 = function(data){
	console.log('cb4_data',data);
            var get_ref_opt   = data['ref_opt'] || false;
            var get_col_data  = data['col'] || {};
            var get_re_data   = data['re'] || {};
            var get_ref_data  = data['ref'] || {};

            $scope.avShow     = false;
            $timeout(function(){$scope.doResize()});

            var getRowIndex = get_re_data["cid"] - 1;
            $scope.parent_row = get_col_data.grid.rows[getRowIndex];
            var taxoList = [];

            $scope.taxoOptions4.sel = 0;
            var colFiled = get_col_data.field;
            var call = true;
            if("uid" in $scope.taxoOptions4 && colFiled ==  $scope.taxoOptions4["uid"]){
                call = false;
            } 
            $scope.taxoOptions4["cid"] = get_re_data['cid'];
            $scope.taxoOptions4["uid"] = get_col_data.field;	
            $scope.searchDocid = $scope.taxoOptions4.uid.split("_")[0];
         
            if(get_col_data.colDef.config_data.hasOwnProperty("av_para")){
                 var col_para = get_col_data.colDef.config_data["av_para"][0];
                 var postData = {"oper_flag": 609, "pid": $scope.selctedProject["pid"], "db": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"], "doc_id": $scope.searchDocid, "para_ids": col_para};
                
                    if(!(colFiled in get_re_data && get_re_data[colFiled]["v"])){
                            $scope.searchShow = true;
                    } 
                
                 if($scope.searchShow && call){
                    $scope.config.parent_scope.ps = true;
                    $scope.tasService.ajax_request(postData, "POST", $scope.paraCallBack);
                    return  
                 }
            }else{
                $scope.searchShow = false;
            }
            if(get_col_data.colDef.config_data["ext"] == "N"){
                 $scope.referDoc.pno_list = [];
                 var index = $scope.findObjectIndexOfArray($scope.compDocs.data, {"k": $scope.searchDocid}, "k"); 
                 var pgcnt = $scope.compDocs.data[index]["page_count"];
                 for(var i= 1;i <= pgcnt;i++){
                    $scope.referDoc.pno_list.push(i);
                 }
                    $scope.referDoc.selected_pno = $scope.referDoc.pno_list[0];
                    $scope.page_num_change($scope.referDoc.pno_list[0]);
            }
           // $scope.documentHighLight(get_ref_data);
           var vls  = (get_ref_data["values"] || [])[$scope.taxoOptions4.sel] || {};
            var pno  = vls["pno"] || 1;
            var dcid = vls["d"] || $scope.searchDocid;

            if("snippet" in $scope.referDoc && $scope.referDoc["snippet"] == "loaded"){
                  $scope.referDoc.path = ""; 
                  $scope.referDoc.scope.iframe_page_no_change($scope.referDoc);
                  $scope.referDoc["snippet"] = "doc";
            }
	
            if(pno){ 
                   $scope.referDoc.path = 'src/iframe_ref_2.html?/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' + dcid + '/html/' + pno + '.html';
                   $scope.referDoc['d_path'] = '/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' + dcid + '/sieve_input/' + dcid + '.pdf';
                   $scope.referDoc.pno_list = $scope.pagecounts[dcid];
            }
            var nodes = [];
            get_ref_data["values"].forEach(function(r){
                   var x = r.x.split(/[\$,\#]+/);
                   var c = r.c.split(/[\$,\#]+/);
                   x.forEach(function(w,inx){
                       if(!w){
                           return
                       }
                       var obj = {};
                       obj["c"] = [];
                       obj["c"].push(c[inx]);
                       obj["x"] = w;
                       nodes.push(obj); 
                   });
             }); 
             $scope.referDoc.ref = nodes;
             $scope.referDoc.selected_pno = pno;
             $scope.referDoc.scope.clear_table_highlight($scope.referDoc['id']);
             $scope.referDoc.scope.iframe_page_no_change($scope.referDoc);
    } 		
    /*******************************************/
     $scope.selectionCol = function(col,all){
        var flg = 1;
        var allFlg = "Y";
        var visible = true;
        if(all == "all"){
                 if($scope.taxo4checkedAll == 'Y'){
                      flg = 0;
                      var allFlg= "N";
                      visible = false;
                 }
                 $scope.taxo4colFilter["data"].forEach(function(s){
                      $scope.taxoOptions4["selectedCol"][s["k"]] = flg;
                 });
                 $scope.taxoOptions4.scope.grids_data.columnDefs.forEach(function(v){
                      var cfld = v.field;
                      if(v.config_data.pin != "pinnedLeft"){
                          if($scope.taxoOptions4["selectedCol"][cfld]){
                               v["visible"] = true;
                          }else{
                               v["visible"] = false;
                          }
                      } 
                 });
                 $scope.taxo4checkedAll = allFlg;
                 $scope.stackappct.forEach(function(s){
                     s.checked = allFlg;
                 });
        }else{
                var field = col.k;
                if(field in $scope.taxoOptions4["selectedCol"] && $scope.taxoOptions4["selectedCol"][field] == 1){
                      flg = 0;
                      visible = false;
                }
                 var colIndex = $scope.findObjectIndexOfArray($scope.taxoOptions4.grid_coldef,col,"k");
                $scope.taxoOptions4.scope.grids_data.columnDefs[colIndex]["visible"] = visible;
                $scope.taxoOptions4["selectedCol"][field] = flg;
        }
        $scope.taxoOptions4.scope.grids_data_api.core.refresh();
        $scope.doResize();
     }
    /*******************************************/
     $scope.txo_list_pop_flg ={};
     $scope.taxo_list = [];
     $scope.txo_list_pop_cls = function(){
            $scope.txo_list_pop_flg['k'] = false;
     }
    /*******************************************/
     $scope.txo_pop_save_func = function(){
            $scope.txo_list_pop_flg['k'] = false;
     }
    /*******************************************/
     $scope.add_tas_na_text = function(){
          $scope.main_input_txtarea = 'TAS-NA';
     }
    /*******************************************/
     $scope.taxo_li_movr_func = function(tl, idx){
           $scope.txo_list_pop_side_flg = false;
           $scope.txo_list_pop_f_lft_t_id = tl;
           $scope.side_txo_list = [];
           if(tl['dropdown'].length){
                  $scope.side_txo_list = tl['dropdown'];
                  $scope.txo_list_pop_side_flg = true;
           }
     }
    /*******************************************/
     $scope.txo_pop_list_save_func = function(falg=false,value){
           var getSltObj = $scope.rangeSelection;
           var dic = {};
           dic["v"] = getSltObj["v"];
           var obj = {};
           var obj2 = {}
           obj[getSltObj["x"]] = [getSltObj["c"]]
           obj2[getSltObj["pno"]] = obj;
           dic["ref"] = obj2; 
           console.log(dic)
           $scope.slt_data_frame(getSltObj["pno"], dic, value["taxo"]);
     }
    /*******************************************/
     $scope.saveGrid = function(){
            var obj = {};
            var gridData = [];
            var colData  = [];
            var mapData  = {};
            var gridmap  = $scope.taxoOptions4.grid_map_data;
            var rowData  = $scope.taxoOptions4.grid_data;
            if($scope.applicator){
                 $scope.taxoOptions4.grid_coldef.forEach(function(r){
                      var cfld = r.k;
                      if(r.v_opt != 1){
                            var cobj  = {};
                            cobj["k"] = cfld;
                            cobj["S"] = $scope.taxoOptions4.selectedCol[cfld];
                            colData.push(cobj); 
                      }
                 });
                 rowData.forEach(function(row){
                     var treeObj = {};
                     treeObj["treeLevel"] = row["$$treeLevel"];
                     treeObj["c_n"]       = row["c_n"];
                     treeObj["cid"]       = row["cid"];
                     treeObj["s_n"]       = row["s_n"];
                     treeObj["t"]         = row["t"];
                     treeObj["rid"]       = row["rid"];
                     gridData.push(treeObj);
                 });
                 colData.forEach(function(cd){
                     var cfld = cd.k;
                     rowData.forEach(function(row){
                          var cid = row.cid;
                          var mkey = cid + "_" + cfld;
                          if(mkey in gridmap){
                             mapData[mkey] = gridmap[mkey]; 
                          }
                     });     
                 });
                 
                 var postData = {"oper_flag": 610, "pid": $scope.selctedProject["pid"], "db": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"], "docId": $scope.selectedDoc["doc_id"],'col_def':  colData, "map": mapData, "wid": $scope.selctedProject["ws"],"row_data": gridData};

            }else{
                 obj["colDef"]  = $scope.taxoOptions1.grid_coldef;
                 obj["mapData"] = $scope.taxoOptions1.grid_map_data;
                 var rowData    = $scope.taxoOptions1.grid_data;
                 rowData.forEach(function(row){
                       if(row.edit == "Y"){
                            var treeObj = {};
                            treeObj["level_id"]  = row["$$treeLevel"];
                            treeObj["c_n"]       = row["c_n"];
                            treeObj["cid"]       = row["cid"];
                            treeObj["s_n"]       = row["s_n"];
                            treeObj["t"]         = row["t"]["v"];
                            treeObj["grpid"]     = row["grpid"];
                            treeObj["p_grpid"]   = row["p_grpid"];
                            treeObj["values"]    = $scope.taxoOptions1["grid_map_data"][row.cid + "_values"]["values"];
                            treeObj["values"].forEach(function(ur){
                                      ur["v"] = encodeURIComponent(ur["v"]);
                            });
                            gridData.push(treeObj);
                       }
                 });

                 var postData = {"oper_flag": 91012, "project_id": $scope.selctedProject["pid"], "db_name": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"], "docid": $scope.selectedDoc["doc_id"], "ws_id": $scope.selctedProject["ws"], "data": gridData,"tb_username": "tas"};

            }

            console.log(postData)
            if(gridData.length){
                $scope.config.parent_scope.ps = true;
                $scope.tasService.ajax_request(postData, "POST", $scope.saveCb);
            }else{
                tasAlert.show("No Data", "warning", 1000);
            } 
     }
    /*******************************************/
     $scope.saveCb = function(res){
           $scope.config.parent_scope.ps = false;
           if(res["message"] == "done"){
            if($scope.applicator){
                 tasAlert.show(res['message'],  "success", 500);
                 $timeout(function(){
                    $scope.getApplicator(false);
                 },600);
            }else{
                 tasAlert.show(res['message'],  "success", 500);
                 $timeout(function(){
                      $scope.refreshGrid();
                 },600);
            }
           }else{
               tasAlert.show(res['message'], 'error', 1000);
           }
     }
    /*******************************************/
    $scope.page_num_change = function(pageno){
         console.log(pageno)
         $scope.referDoc.path = 'src/iframe_ref_2.html?/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' + $scope.searchDocid + '/html/' + pageno + '.html';
    }
    /*******************************************/
     $scope.onlyAvailability = function(flgCh){
         var flg = "N"; 
         if(flgCh == "N"){
            flg = "Y";
         }
         $scope.avAll = flg;
         var data = $scope.taxoOptions2.scope.grids_data.data; 
         var length = data.length;
         var col = $scope.taxoOptions2.scope.grids_data.columnDefs;
         col.forEach(function(r){
              if(r.field != "s" && !r.pinnedLeft){
                  var visible = false;
                  for(var x = 0; x < length; x++){
                      if(r.field in data[x] && 'poss' in data[x][r.field] && data[x][r.field]["poss"]){
                           visible = true; 
                           break;
                      }
                  }
                  
                  if(!visible && $scope.avAll == "Y"){
                       r.visible = false;
                  }else{
	               r.visible = true;
                  } 
               }
         });;
         $scope.taxoOptions2.scope.grids_data_api.core.refresh();
         $scope.doResize(); 
     }
    /*******************************************/
     $scope.taxo2_selectionCol = function(col,all){
        var flg = 1;
        var visible = true;
        var allFlg = "Y";
        if(all == "all"){
                if($scope.taxo2checkedAll == 'Y'){
                      flg = 0;
                      var allFlg= "N"
                      visible = false;
                 }
                 $scope.filterCol["data"].forEach(function(s){
                      var fld = s.k;
                      if($scope.selectedDoc["doc_id"] != fld){
                         $scope.taxoOptions2["selectedCol"][fld] = flg;
                      }
                 });
                 $scope.taxoOptions2.scope.grids_data.columnDefs.forEach(function(v){
                       var cfld = v.field;
                       if(v.config_data.pin != "pinnedLeft"){
                          if($scope.taxoOptions2["selectedCol"][cfld]){
                               v["visible"] = true;
                          }else{
                               v["visible"] = false;
                          }
                       }
                 });
                $scope.taxo2checkedAll = allFlg;
                $scope.stackitems.forEach(function(s){
                     s.checked = allFlg;
                });
        }else{
                var field = col.k;
                if(field in $scope.taxoOptions2["selectedCol"] && $scope.taxoOptions2["selectedCol"][field] == 1 && col.pin != "pinnedLeft"){
                     flg = 0;
                     visible = false;
                }
                var colIndex = $scope.findObjectIndexOfArray($scope.taxoOptions2.grid_coldef,col,"k");
                $scope.taxoOptions2.scope.grids_data.columnDefs[colIndex]["visible"] = visible;
                $scope.taxoOptions2["selectedCol"][field] = flg; 
        }
        $scope.taxoOptions2.scope.grids_data_api.core.refresh();
        $scope.doResize(); 
     }
    /*******************************************/
     $scope.deleteValue = function(arg,index){
          if(confirm("Do you want to Delete")){
               var key = arg["cid"] + "_values";
               var arr = $scope.taxoOptions1.grid_map_data[key]["values"][index]["rid"];
               if(!arr){
                    arg["values"]["v"] = "";
                    $scope.taxoOptions1.grid_map_data[key]["values"].splice(index,1);;
                    return ;
               }
               var postData = {"oper_flag":91015,"project_id": $scope.selctedProject["pid"], "db_name": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"], "docid": $scope.selectedDoc["doc_id"], "ws_id": $scope.selctedProject["ws"],"rids":[arr],"tb_username":"sunil"};
               $scope.config.parent_scope.ps = true;
               $scope.tasService.ajax_request(postData, "POST", $scope.deletedCb);
          }
     }
    /*******************************************/
     $scope.deletedCb = function(res){
           $scope.config.parent_scope.ps = false;
           console.log(res);
           if(res["ret_lst"][0]["message"] == "done"){
                $scope.refreshGrid();
                //$scope.slctionDoc($scope.selectedDoc);
           }else{
                tasAlert.show(res['message'], 'error', 1000);
           }
     }
    /*******************************************/
     $scope.newPop = function(xml, ch){
          if(xml && ch){
               $scope.searchPopShow = true;
               var taxo_list = $scope.referDoc.scope.taxo_list;
               $scope.doResize(); 
               var pno = xml.split("_")[1];
               $scope.popref.path = "src/iframe_ref_2.html?/var_html_path/WorkSpaceBuilder_DB_demo/" + $scope.selctedProject["pid"] + '/1/pdata/docs/' + $scope.selectedDoc["doc_id"] + '/html/' + pno + '.html';
               $scope.popref['d_path'] = '/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' + $scope.selectedDoc["doc_id"] + '/sieve_input/' +$scope.selectedDoc["doc_id"] + '.pdf';
               var node = [];
               var ref = {};
               ref["xml_list"] = [xml];
               ref["c"] = [ch];
               node.push(ref); 

               $scope.popref.ref = node;
               $scope.popref.selected_pno = pno;
               $timeout(function(){
                   $scope.popref.scope.drop_data_set($scope.taxo_list);
                   $scope.popref.scope.clear_table_highlight($scope.popref['id']);
                   $scope.popref.scope.iframe_page_no_change($scope.popref);
              });
          }
     }
    /*******************************************/
     $scope.searchPopClose = function(){
          $scope.searchPopShow = false;
     }
    /*******************************************/
     $scope.treeCellDelete = function(row){
        console.log(row);
         var rids = [];
        $scope.findChilderRecursion([row.treeNode], rids,$scope.taxoOptions1.grid_map_data);
        if(rids.length){
              var postData = {"oper_flag":91015,"project_id": $scope.selctedProject["pid"], "db_name": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"], "docid": $scope.selectedDoc["doc_id"], "ws_id": $scope.selctedProject["ws"],"rids": rids,"tb_username":"sunil"};
              $scope.config.parent_scope.ps = true;
              $scope.tasService.ajax_request(postData, "POST", $scope.deletedCb);
        }
        console.log(rids)
     }
    /*******************************************/
     $scope.findChilderRecursion = function(row, arr, grid_map){
           row.forEach(function(t){
                 var mapkey = t.row.entity.cid + "_values";
                 grid_map[mapkey].values.forEach(function(r){
                     if(r.rid) 
                        arr.push(r.rid);
                 });
		 grid_map[mapkey].values	= [{'v':'', 'x':'', 'c':''}]
		 t.row.entity.values	= {'v':[]}
                 if(t.children.length){
                    $scope.findChilderRecursion(t.children, arr,grid_map);
                 }
           }); 
         return arr;
     }
    /*******************************************/
     $scope.expandRecursion = function(row, arr){
             row.forEach(function(e,index){
                   var children = e.children;
                   if(e.state == "expanded"){
                        var rowIndex = $scope.findObjectIndexOfArray($scope.taxoOptions1.grid_data, e.row.entity,"cid");
                        arr.push(rowIndex);
                        if(children.length){
                             $scope.expandRecursion(children, arr);
                        }
                   }
             });
          return arr;
     }
    /*******************************************/
     $scope.refreshGrid = function(){
           $scope.expand_row = [];
           $scope.taxoOptions1.scope.grids_data_api.grid.treeBase.tree.forEach(function(e,index){
                  var children = e.children;
                    if(e.state == "expanded"){
                          var rowIndex = $scope.findObjectIndexOfArray($scope.taxoOptions1.grid_data, e.row.entity,"cid");
                          $scope.expand_row.push(rowIndex);
                          if(children.length){
                               $scope.expandRecursion(children, $scope.expand_row);
                          }
                    }
           });
           var postData = {"oper_flag": 604,"project_id": $scope.selctedProject["pid"], "db_name": $scope.selctedProject["db"], "cmp_id": $scope.selectedCompany["id"], "doc_id": $scope.selectedDoc["doc_id"], "ws_id": $scope.selctedProject["ws"],"agent_id": 1,"mgmt_id": 1,"main_key": 0,"tab_key": 0,"tb_username": "sunil"};
             $scope.config.parent_scope.ps = true;
             $scope.tasService.ajax_request(postData, "POST", $scope.refreshGridCb);
     }
    /*******************************************/
      $scope.refreshGridCb = function(res){
             $scope.config.parent_scope.ps = false;
             if(res["message"] == "done"){
                   $scope.taxoOptions1 = Object.assign($scope.taxoOptions1,{"sel":"",'grid_id':'taxo_grid','grid_map_data':res['map'],'grid_cb':'grid_cb','grid_data': res['data'],'grid_coldef': res['col_def'] ,'parent_scope':$scope,'ref_opt':true});
                   $scope.taxoOptions1.scope.grids_data_api.grid.options.data =  res['data'];
                   $timeout(function() {
                         $scope.expand_row.forEach(function(exp){
                              $scope.taxoOptions1.scope.grids_data_api.treeBase.expandRow($scope.taxoOptions1.scope.grids_data_api.grid.rows[exp]);
                         });
                         $timeout(function() {
                               if("rind" in $scope.taxoOptions1 && $scope.taxoOptions1.rind){
                                     $scope.taxoOptions1.scope.grids_data_api.core.scrollTo($scope.taxoOptions1.scope.grids_data.data[$scope.taxoOptions1.rind],$scope.taxoOptions1.scope.grids_data.columnDefs[1])
                               }
                         });
                    });
             }else{
                  tasAlert.show(res['message'], 'error', 1000);
             }
      }
    /*******************************************/
     $scope.deleteuseradded = function(row,field){
           if (confirm("Do you want to Delete")) {  
	       var parids = [];
               if(field in row){
                  parids.push(row[field]["pid"]);
               }
               var postData = {"oper_flag": 613, "pid": $scope.selctedProject["pid"], "db": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"],"doc_id": field,"para_ids": parids, "seq": row.seq, "wid": $scope.selctedProject["ws"], "s_para": row.s_para};
               console.log(postData)
	       $scope.config.parent_scope.ps = true;
	       $scope.tasService.ajax_request(postData, "POST", $scope.deleteuseraddedCb);
           }
     }
    /*******************************************/
     $scope.deleteuseraddedCb = function(res){
           $scope.config.parent_scope.ps = false;
           if(res["message"] == "done"){
               tasAlert.show(res["message"], "success", 500); 
               $timeout(function(){
                   $scope.getBuilder(false, true); 
               }, 500);
           }else{
                 tasAlert.show(res['message'], 'error', 1000);
           }
     }
    /*******************************************/
    $scope.add_column = function(){ 
       var new_col_def = []
       var curent_col_k = $scope.taxoOptions4.scope.gconfig['uid'];
       var dd = {}
       $scope.taxoOptions4['scope']['grids_data']['columnDefs'].forEach(function(v)	{
		if(v.hasOwnProperty('visible')){
       			dd[v.field] = v['visible']
		}else
       			dd[v.field] = true
	})
       $scope.taxoOptions4['grid_coldef'].forEach(function(each, index){
           var temp = angular.copy(each)
           new_col_def.push(temp)
           if(each['k'] == curent_col_k){ 
                 var timestamp = new Date().getUTCMilliseconds()
                 var clone_temo = angular.copy(each)
                 clone_temo['k'] = clone_temo['k']+"_"+timestamp
                 clone_temo['n'] = clone_temo['n'].replace(curent_col_k, clone_temo['k'])
	   	 dd[clone_temo['k']+"_"+timestamp]	= true
                 new_col_def.push(clone_temo) 
                 $scope.taxoOptions4['selectedCol'][clone_temo['k']] = 1
           } 
       })
       $scope.taxoOptions4['grid_coldef'] = new_col_def   
       var columnDefs = $scope.taxoOptions4['scope'].create_grid_header_def($scope.taxoOptions4.grid_coldef)
       columnDefs.forEach(function(v)	{
       			v.visible = dd[v.field]
	})
       $scope.taxoOptions4['scope']['grids_data']['columnDefs'] = columnDefs
	
       $timeout(function(){$scope.doResize()});
    }
	
    /* ---------------------------------------------------------------- */
    $scope.call_catg_data = function (arg){
         var unshfindex = $scope.taxoOptions1['grid_coldef'].index("v_opt", 3);
         if(arg)
             $scope.catg_popup= !$scope.catg_popup;
      
         if($scope.catg_popup){
               var catg_lst = [];
               var done_d = {};
               $scope.rootParentRecu_cat([$scope.parent_row.treeNode],catg_lst, done_d);
               var rst_dta = [];
               catg_lst.forEach(function (ech_rw){
                    ech_rw['checked']='N';
                    var tmp_dict = {};
                    tmp_dict['s_n'] = ech_rw.s_n;
                    tmp_dict['c_n'] = ech_rw.c_n;
                    tmp_dict['t'] = ech_rw.t.v;
                    tmp_dict['level_id'] = ech_rw['$$treeLevel'];
                    rst_dta.push(tmp_dict);
               });
               $scope.taxoOptions1.grid_data.forEach(function(r){
                   r["hide"] = "Y";
               });
               
               if(unshfindex == -1)
                  $scope.taxoOptions1['grid_coldef'].unshift({'v_opt':3,'sid':'hc'});
               $scope.taxoOptions1.scope.init_grid($scope.taxoOptions1);
               var postData = {"oper_flag": 615, "pid": $scope.selctedProject["pid"], "db": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"], "doc_id": $scope.selectedDoc["doc_id"],  'data':rst_dta};
               $scope.config.parent_scope.ps = true;
               $scope.tasService.ajax_request(postData, "POST", $scope.cataegegoryCb); 
         }else{
             if(unshfindex != -1)
                $scope.taxoOptions1['grid_coldef'].shift();
             $scope.taxoOptions1.scope.init_grid($scope.taxoOptions1) 
         }
    }
    /*******************************************/
     $scope.cataegegoryCb = function(res){
           $scope.config.parent_scope.ps = false;
           if(res['message'] == 'done'){
                 var x      = $scope.parent_row.entity.cid - 1;
                 var len    = $scope.taxo_list.length + x; 
                 for(; x < len; x++){
                     $scope.taxoOptions1["grid_data"][x]["hide"] = "N"; 
                 }
	        $scope.catg_grp_grid = res['data'];
	        $scope.catg_grp_map = res['map'];
           }
    }
    /*******************************************/
    $scope.call_dym_grd = function (grp_grd){
	var grp_key = grp_grd['k'];
	$scope.cmn_grp[grp_key]= {'grid_id':grp_key,'grid_map_data':$scope.catg_grp_map[grp_key]['map'],'table_cb':'catg_grp_cb','table_data': $scope.catg_grp_map[grp_key]['data'],'col_def': $scope.catg_grp_map[grp_key]['col_def'] ,'parent_scope':$scope}
	console.log($scope.cmn_grp[grp_key])
        $timeout(function (){
        	$scope.cmn_grp[grp_key].scope.init_table($scope.cmn_grp[grp_key]);
	})

    }
    $scope.catg_grp_cb = function (){
		console.log('hhiiiiiiiiiiiii')
    }
   /* ---------------------------------------------------------------- */
    /*******************************************/
     $scope.getusetable = function(arg){
        console.log(arg);
          $scope.tableposs = arg;
          var catg_lst = [];
	  var done_d = {}
	  $scope.rootParentRecu_cat([ $scope.parent_row.treeNode],catg_lst, done_d);
          var rst_dta = [];
	  catg_lst.forEach(function (ech_rw){
		ech_rw['checked']='N';
			var tmp_dict = {};
			tmp_dict['s_n'] = ech_rw.s_n;
			tmp_dict['c_n'] = ech_rw.c_n;
			tmp_dict['t'] = ech_rw.t.v;
			tmp_dict['level_id'] = ech_rw['$$treeLevel'];
			rst_dta.push(tmp_dict);
	   });
           if($scope.across){
               var docs = [];
               $scope.compDocs.data.forEach(function(d){
                   docs.push(d.k);
               });
               console.log(docs);
               var postData = {"oper_flag": 616, "pid": $scope.selctedProject["pid"], "db": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"],"doc_lst": docs,"data": rst_dta, "poss": arg["k"]}
           }else{
                var postData = {"oper_flag": 616, "pid": $scope.selctedProject["pid"], "db": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"],"doc_lst": [$scope.selectedDoc["doc_id"]],"data": rst_dta, "poss": arg["k"]};
           }
           $scope.config.parent_scope.ps = true;
           $scope.tasService.ajax_request(postData, "POST", $scope.getusetableCb);
     }
    /*******************************************/
     $scope.getusetableCb = function(res){
           $scope.config.parent_scope.ps = false;
           if(res["message"] == "done"){
                console.log("done", res);
                $scope.tablepopup = true;
                $scope.catg_popup = false;
                res['data'].forEach(function(e){
                     e["checked"] = "Y";
                });
                $scope.tabledatas["map"]  = res["map"];
                $scope.tabledatas["data"] = res["data"];
                $scope.clsfictintbl["data"] = res["table_types"];
                if(res["table_types"].length){
                   $timeout(function(){
                      $scope.clsfictintbl.scope.change(res["table_types"][0]);
                   });
                }
           }else{
                 tasAlert.show(res['message'], 'error', 1000);
           }
     }
    /*******************************************/
     $scope.tablepop_close = function(){
          $scope.tablepopup = false;
          $scope.catg_popup = true;
     }
    /*******************************************/
     $scope.tablepopCb = function(data, sltcol, pageCoord){
         var key = sltcol["re"]["cid"] + "_" + sltcol.col["k"];
         var highlightData  = data[key]["ref"] || [];
         $scope.tablerefernce["active"]  = "pdf"
         var pno = highlightData[0]["p"] || 1; 
         var d   = highlightData[0]["d"] || $scope.selectedDoc["doc_id"];
         $scope.tablerefernce.path = 'src/pdf_canvas/web/viewer.html?file=/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' + d + '/pages/' + pno + '.pdf';
         var nodes    = [];
         var page_cor = pageCoord[d][pno];
         highlightData.forEach(function(r){
              var obj = {};
              obj["pno"]  = r["p"]
              obj["bbox"] = r.bbox;
              obj["x"]    = r.x;
              obj["coord"] = page_cor;
              obj["clr_flg"] = true;
              nodes.push(obj); 
         });
         $scope.tablerefernce.ref = nodes;
         $scope.tablerefernce.selected_pno = pno;
         $scope.tablerefernce.scope.clear_table_highlight($scope.tablerefernce['id']);
         $scope.tablerefernce.scope.iframe_page_no_change($scope.tablerefernce); 
     }
    /*******************************************/
     $scope.saveTable = function(){
          var svdocs = [];
          var catg_lst = [];
	  var done_d = {}
	  $scope.rootParentRecu_cat([ $scope.parent_row.treeNode],catg_lst, done_d);
          var rst_dta = [];
	  catg_lst.forEach(function (ech_rw){
                 ech_rw['checked']='N';
                 var tmp_dict = {};
                 tmp_dict['s_n'] = ech_rw.s_n;
                 tmp_dict['c_n'] = ech_rw.c_n;
                 tmp_dict['t'] = ech_rw.t.v;
                 tmp_dict['level_id'] = ech_rw['$$treeLevel'];
                 rst_dta.push(tmp_dict);
	   });
           
           $scope.tabledatas['data'].forEach(function(e){
              if("checked" in e && e["checked"] == "Y"){
                 svdocs.push(e.k);
              }
           });
           if(svdocs.length){ 
                 var postData = {"oper_flag": 616, "pid": $scope.selctedProject["pid"], "db": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"],"doc_lst": svdocs,"data": rst_dta,"poss": $scope.tableposs["k"],"W": 1, "table_type": $scope.clsfictintbl.scope.selected["k"]};
                 $scope.config.parent_scope.ps = true;
                 $scope.tasService.ajax_request(postData, "POST", $scope.savetableCB);
           }else{
                tasAlert.show("No Data", "warning", 1000);
           }

     }
    /*******************************************/
     $scope.savetableCB = function(res){
           $scope.config.parent_scope.ps = false;
           if(res["message"] == "done"){
                console.log("done", res);
           }else{
                 tasAlert.show(res['message'], 'error', 1000);
           }
     }
    /*******************************************/
      $scope.acrosscheck = function(){
           $scope.across = !$scope.across;
      }
    /*******************************************/
     $scope.loadTables = function(arg){
         var key = arg['k'];
         $scope.popuptables[key] = {"grid_id": key, "grid_map_data": $scope.tabledatas["map"][key]["map"], "table_cb": "tablepopCb","table_data": $scope.tabledatas["map"][key]["data"], "col_def": $scope.tabledatas["map"][key]["col_def"], "parent_scope": $scope, "cb_param": [$scope.tabledatas["map"][key]["map"],$scope.tabledatas["map"][key]["page_cords"]]};
        $timeout(function(){
               $scope.popuptables[key].scope.init_table($scope.popuptables[key]);
        });
     } 
    /*******************************************/
     $scope.saveSlct = function(oper,obj){
          var flg = "Y";
          if(oper == "all"){
             if(obj == "Y")
               flg = "N";
             $scope.tabledatas['data'].forEach(function(e){
                e["checked"] = flg;
             });
             $scope.saveSlctAll = flg;
          }else{
              if(obj["checked"] == "Y")
                 flg = "N";
              obj["checked"] = flg;
          }
     }
    /*******************************************/
     $scope.slctionofCol = function(col){
          var flg = 1;
          var fld = col.field;
          if($scope.taxoOptions4["selectedCol"][fld]){
             flg = 0;
          }
          $scope.taxoOptions4["selectedCol"][fld] = flg;
     }
    /*******************************************/
     $scope.slctcolbuilder = function(col){
          var flg = 1;
          var fld = col.field;
          if($scope.taxoOptions2["selectedCol"][fld]){
             flg = 0;
          }
          $scope.taxoOptions2["selectedCol"][fld] = flg;
     }
    /*******************************************/
     $scope.dublicate_creation = function(){
            var index = $scope.taxoOptions1.grid_data.index('cid', $scope.taxoOptions1["cid"]);
            var row   = get_root_node($scope.taxoOptions1.scope.grids_data_api.grid.rows[index]);
            $scope.dublicate(row);
     }
    /*******************************************/
     $scope.getSlt = function(){
          $scope.sltgridshow = !$scope.sltgridshow;
          if(!$scope.sltgridshow){
              $timeout(function(){
                 $scope.doResize();
              });
              return;
          }
          var sobj = $scope.slt_app_data();
          if(Object.keys(sobj).length){
                var postData = {"oper_flag": 619, "pid": $scope.selctedProject["pid"], "db": $scope.selctedProject["db"], "cmp": $scope.selectedCompany["id"], 'taxo_lst':$scope.taxo_list.map(function(r){r=r.tdata;return [r.cn, r.sn, r.t]}),"seqs": sobj};
                $scope.config.parent_scope.ps = true;
                $scope.tasService.ajax_request(postData, "POST", $scope.getSltCB);
          }
     }
    /*******************************************/
    /*******************************************/
     $scope.sltgriddata = {};
     $scope.getSltCB = function(res){
          $scope.config.parent_scope.ps = false;
          if(res["message"] == "done"){
                res['col_def'].forEach(function(r){
                     if(!("v_opt" in r)){
                         r["ct"] = "<div class=\"ui-grid-cell-contents grid-cell-text\" ng-class=\"{'act_row':row.entity['cid'] == grid.appScope.gconfig['cid'] ,'act_cell':(row.entity['cid']+'_'+ col.field) ==  grid.appScope.gconfig['cid'] + '_' + grid.appScope.gconfig['uid'],'delCls': COL_FIELD['v'], 'edit_cl': grid.appScope.gconfig.grid_map_data[row.entity.cid + '_' + col.field]['edit'] == 'Y'}\" ng-click=\"grid.appScope.grid_val_call(row.entity,col)\" title=\"{{COL_FIELD['v']}}\"><span class=\"cell_leaf_value\" ng-bind-html=\"COL_FIELD['v']\"></span><span class=\"fa fa-trash-o del-val\" ng-if=\"COL_FIELD['v']\" ng-click=\"grid.appScope.gconfig.parent_scope.deleteCellVal(row.entity,col.field);$event.stopPropagation();\"></span></div>";
                     }
                });
                $scope.sltgriddata = Object.assign($scope.sltgriddata,{'grid_id':'taxo_grid','grid_map_data':res['map'],'grid_cb':'sltgrid_CB','grid_data': res['data'],'grid_coldef': res['col_def'] ,'parent_scope':$scope,'ref_opt':true, "row_height": 30});
	        $scope.sltgriddata.scope.init_grid($scope.sltgriddata);
                $timeout(function(){autocellSelect($scope.sltgriddata)});
          }else{
               tasAlert.show(res['message'], 'error', 1000);
          }
     } 
    /*******************************************/
     $scope.sltgrid_CB = function(data){
        console.log(data);
            var get_ref_opt   = data['ref_opt'] || false;
            var get_col_data  = data['col'] || {};
            var get_re_data   = data['re'] || {};
            var get_ref_data  = data['ref'] || {};
            $timeout(function(){$scope.doResize()});
           
            var getRowIndex = get_re_data["cid"] - 1;
            $scope.sltgriddata["cid"] = get_re_data['cid'];
            $scope.sltgriddata["uid"] = get_col_data.field;	
            //$scope.searchDocid = $scope.taxoOptions4.uid.split("-")[0];

            var pno = get_ref_data["values"][0]["pno"];
            var dcid = get_ref_data["values"][0]["d"];
            if(pno){ 
                   $scope.referDoc.path = 'src/iframe_ref_2.html?/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' + dcid + '/html/' + pno + '.html';
                   $scope.referDoc['d_path'] = '/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' + dcid + '/sieve_input/' + dcid + '.pdf';
                   $scope.referDoc.pno_list = $scope.pagecounts[dcid];
            }
            var nodes = [];
            get_ref_data["values"].forEach(function(r){
                   var x = r.x.split("$");
                   var c = r.c.split("$");
                   x.forEach(function(w,inx){
                       if(!w){
                           return
                       }
                       var obj = {};
                       obj["c"] = [];
                       obj["c"].push(c[inx]);
                       obj["x"] = w;
                       nodes.push(obj); 
                   });
             }); 
             $scope.referDoc.ref = nodes;
             $scope.referDoc.selected_pno = pno;
             $scope.referDoc.scope.clear_table_highlight($scope.referDoc['id']);
             $scope.referDoc.scope.iframe_page_no_change($scope.referDoc);
     }
    /*******************************************/
     $scope.builderRefersh = function(res){
           $scope.config.parent_scope.ps = false;
           if(res["message"] == "done"){
                 $scope.taxoOptions2 = Object.assign($scope.taxoOptions2,{'grid_id':'taxo_grid','grid_map_data':res['map'],'grid_cb':'grid_cb_2','grid_data': res['data'],'grid_coldef': res['col_def'] ,'stack': res['stack'],'parent_scope':$scope,'ref_opt':true, 'row_height': 175});
                 $scope.taxoOptions2.scope.grids_data_api.grid.options.data =  res['data'];
                 $scope.colParaids = {};
                 for(var s in $scope.taxoOptions2['grid_map_data']){
                      var para = $scope.taxoOptions2['grid_map_data'][s]["para_id"];
                      var dk   = $scope.searchDocid + "@" + para;
                      $scope.colParaids[dk] = para;
                 }
                 $timeout(function(){
                      $scope.taxoOptions2.scope.grids_data_api.core.refresh();
                 });
           }else{
                 tasAlert.show(res["message"], "error", 1000);
           }
     }
    /*******************************************/
     $scope.documentHighLight = function(data, mapind = 0){
           console.log("highLight", data);
           var refnData = data['values'] || [];
           
           if("snippet" in $scope.referDoc && $scope.referDoc["snippet"] == "loaded"){
                $scope.referDoc.path = ""; 
                $scope.referDoc.scope.iframe_page_no_change($scope.referDoc);
                $scope.referDoc["snippet"] = "doc";
           }
           
           var pno    = (refnData[mapind] || {})["pno"] || 1;
           var d      = (refnData[mapind] || {})["d"]   || $scope.selectedDoc["doc_id"];
           $scope.referDoc.pno_list = $scope.pagecounts[d];
           if($scope.selectedDoc["doc_type"] == "HTML"){
                 $scope.referDoc.path = "src/iframe_ref_2.html?/var_html_path/WorkSpaceBuilder_DB_demo/" + $scope.selctedProject["pid"] + "/1/pdata/docs/" + d + '/html/' + d + '_slt.html';
                 $scope.referDoc.selected_pno = d;
                 $scope.referDoc['d_path'] = "";
                 $scope.referDoc["doc_type"]= "html"
           }else{
                 $scope.referDoc.path = 'src/iframe_ref_2.html?/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' + d + '/html/' + pno + '.html';
                 $scope.referDoc.selected_pno = pno;
                 $scope.referDoc['d_path'] = '/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' + d + '/sieve_input/' + d + '.pdf';
                 $scope.referDoc["doc_type"]= "pdf"
           }
           $scope.referDoc["d"] = d;
           $scope.searchDocid   = d;
 
           var nodes = [];
           refnData.forEach(function(r){
                 var x = r.x.split("$");
                 var c = r.c.split("$");
                 x.forEach(function(w,inx){
                     if(!w){
                        return
                     }
                     var obj  = {};
                     obj["x"] = w;
                     obj["c"] = [];
                     obj["c"].push(c[inx]);
                     nodes.push(obj); 
                 });
           }); 
           $scope.referDoc.ref = nodes;
           $scope.referDoc.scope.clear_table_highlight($scope.referDoc['id']);
           $scope.referDoc.scope.iframe_page_no_change($scope.referDoc); 
     }
    /*******************************************/
     $scope.stackitems = [{"t": "Total Docs","b": "T", "checked": "Y", "n": "ph_c","k": "ph_c"}, {"t": "Data Exist","b": "D", "checked": "Y", "n": "DAV","k": "av"},{"t": "SLT Exist","b": "S", "checked": "Y","n": "slt_c", "k": "slt_docs"},{"t": "Availability","b": "A", "checked": "Y","n": "PC","k":"poss"},{"t": "Remaining","b": "R", "checked": "Y", "n":"remain","k": "remain_docs"}];
    /*******************************************/
     $scope.stackFilterBuilder = function(arg){
           var flg = "N";
           if(arg.checked == "N"){
               flg = "Y";
           }
           arg.checked = flg;
           var colDef = $scope.taxoOptions2.scope.grids_data.columnDefs;
           var stck   = $scope.taxoOptions2.stack;
           var arr    = [];
           var uniarr = [];
           $scope.stackitems.forEach(function(r){
                 if(r.checked == "Y"){
                       arr = arr.concat(stck[r['k']]);
                 }
           });
           arr.forEach(function(v){
               if(uniarr.indexOf(v) === -1){
                   uniarr.push(v);
               }
           });
           colDef.forEach(function(v){
                var cfld = v.field;
                if(v.config_data.pin != "pinnedLeft"){
                    if(uniarr.indexOf(cfld) != -1)
                        v["visible"] = true;
                    else
                        v["visible"] = false;
                }
           });
           $scope.taxoOptions2.scope.grids_data_api.core.refresh();
           $scope.doResize();
     }  
    /*******************************************/
     $scope.stackappct = [{"t": "Total Docs","b": "T", "checked": "Y", "n": "total_count","k": "total_count"}, {"t": "Data Exist","b": "D", "checked": "Y", "n": "av_c","k": "av"},{"t": "SLT Exist","b": "S", "checked": "Y","n": "db_c", "k": "db"},{"t": "Availability","b": "A", "checked": "Y","n": "poss_c","k":"poss"},{"t": "Remaining","b": "R", "checked": "Y", "n":"remain","k": "remain_docs"}];
    /*******************************************/
     $scope.stackFilterAppct = function(arg){
           var flg = "N";
           if(arg.checked == "N"){
               flg = "Y";
           }
           arg.checked = flg;
           var colDef = $scope.taxoOptions4.scope.grids_data.columnDefs;
           var stck   = $scope.taxoOptions4.stack;
           var arr    = [];
           var uniarr = [];
           $scope.stackappct.forEach(function(r){
                 if(r.checked == "Y"){
                       arr = arr.concat(stck[r['k']]);
                 }
           });
           arr.forEach(function(v){
               if(uniarr.indexOf(v) === -1){
                   uniarr.push(v);
               }
           });
           colDef.forEach(function(v){
                var cfld = v.field.split("_")[0];
                if(v.config_data.pin != "pinnedLeft"){
                    if(uniarr.indexOf(cfld) != -1)
                        v["visible"] = true;
                    else
                        v["visible"] = false;
                }
           });
           $scope.taxoOptions4.scope.grids_data_api.core.refresh();
           $scope.doResize();
     }
    /*******************************************/
     $scope.pshighlight = function(arg){
           var data = arg[0];
           var ss   = data[2][0];
           var x    = ss[0];
           var c    = ss[1] + "_" + ss[2];
           var obj = {"x": x, "pno": data[1], "c": [c], "d": data[0]};
           $scope.referDoc.pno_list = $scope.pagecounts[data[0]];
           $scope.referDoc.path = 'src/iframe_ref_2.html?/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' + data[0] + '/html_output/' + data[1] + '.html';
           $scope.referDoc['d_path'] = '/var_html_path/WorkSpaceBuilder_DB_demo/' + $scope.selctedProject["pid"] + '/1/pdata/docs/' + data[0] + '/sieve_input/' + data[1] + '.pdf';
           var nodes = [obj];
           $scope.referDoc.ref = nodes;
           $scope.referDoc.selected_pno =  data[1];
           $scope.referDoc.scope.clear_table_highlight($scope.referDoc['id']);
           $scope.referDoc.scope.iframe_page_no_change($scope.referDoc);
     }
    /*******************************************/
    /******************************************/
    /******************************************/
});
app.directive('textapplicator',function(){
    return {
        restrict: 'AE',
        template:`<div class="apt">
        <div class="prj-header">
             <div class="phl">
                  <div class="clsbtn btn pull-left waves-effect" ng-click="collapseToggle()"  ng-class="{'active': collapse}" style="margin-left: 3px;" title="{{collapse ? 'Split View' : 'Full View'}}" ng-if="!catg_popup && !applicator"><i class="fa fa-bars"></i></div> 
                  <div class="pull-left">
                        <div class="clsbtn btn pull-right waves-effect" ng-click="searchToggle()" style="margin-right: 4px;" ng-class="{'active': searchShow}" title="Search Data"><i class="fa fa-search"></i></div>
                        <div class="clsbtn btn pull-right waves-effect" ng-click="getBuilder(true)" ng-class="{'active': dataBuilderShow}" style="line-height: 22px;" title="Data Builder" ng-if="!applicator && !catg_popup"><span>Data Builder</span></div>
                        <div class="clsbtn pull-right waves-effect btn" ng-click="refreshGrid()" ng-class="" title="Refresh Data" ng-if="!collapse && !applicator"><i class="fa fa-refresh"></i></div>
                  </div>
                  <div class="pull-right">
		     <div class="btn btn-sv waves-effect waves-light" ng-class="{active: catg_popup == true}" ng-click="call_catg_data(true)" style="background: #47abd2;padding: 4px 5px 1px 5px;" ng-if="!applicator && !dataBuilderShow">
				<i class="fa fa-list-alt" aria-hidden="true" style=" font-size: 14px; "></i>
                     </div>
                     <div class="ampbtn btn btn-sv" ng-click="getApplicator(true)" title="Run Applicator" ng-class="{'ap_active': applicator}" ng-if="dataBuilderShow">Applicator</div>
                     <div class="btn btn-sv btn-success" ng-click="saveGrid()" title="Save Grid Data">Save</div>
                  </div>
             </div>
             <!--div class="phr" ng-class="{'w-50 ml-0': collapse}">
             </div-->
        </div>
        <div class="bdydata">
	     <div class="uni_div">
		  <!-- applicator div-->	
		  <div class="applicator_div" ng-class="{'d-none': !applicator}">
                        <div class="extr-header">
                             <div class="pull-left">
                                    <div class="slt_filter" ng-click="selectionCol('', 'all')" ng-class="{'active': taxo4checkedAll != 'Y'}">
                                         <i class="ui-grid-icon-cancel"></i>
                                    </div>
                                    <div class="maj_select" ng-repeat="items in stackappct track by $index" title="{{items['t']}}" ng-click="items['k'] == 'total_count' ? selectionCol('', 'all') : stackFilterAppct(items)">
                                             <div ng-class="{'svg-check' : items.checked == 'Y', 'svg-uncheck' : items.checked != 'Y'}" class="svg_cls">
                                                  <span class="check">
                                                       <svg viewBox="0 0 24 24"><path d="M 5 3 C 3.897 3 3 3.897 3 5 L 3 19 C 3 20.103 3.897 21 5 21 L 19 21 C 20.103 21 21 20.103 21 19 L 21 9.2421875 L 19 11.242188 L 19.001953 19 L 5 19 L 5 5 L 16.757812 5 L 18.757812 3 L 5 3 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z"></path></svg>
                                                   </span>
                                                   <span class="uncheck">
                                                        <svg viewBox="0 0 50 50"><path d="M 39 4 L 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 11 C 46 7.101563 42.898438 4 39 4 Z M 42 39 C 42 40.699219 40.699219 42 39 42 L 11 42 C 9.300781 42 8 40.699219 8 39 L 8 11 C 8 9.300781 9.300781 8 11 8 L 39 8 C 40.699219 8 42 9.300781 42 11 Z"></path></svg>
                                                   </span>
                                              </div>
                                          <label><span class="count {{items['b']}}" ng-bind="taxoOptions4['stack'][items['n']]"></span></label>
                                    </div>

                             </div>
                             <div class="pull-right">
                                  <div class="appl-close" ng-click="add_column()">
                                       <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                  </div>
                                  <div class="dropdown pull-left">
                                       <div class="colDefdd waves-effect pull-left" data-toggle="dropdown">
                                            <!--span class="fa fa-braille cl-col"></span-->
                                            <span><svg viewBox="0 0 48 48"><path fill="#90caf9" d="M6,42V6h36v36H6z M10,38h28V10H10V38z"></path><path fill="#90caf9" d="M24,41.5c-1.104,0-2-0.896-2-2V9c0-1.104,0.896-2,2-2s2,0.896,2,2v30.5C26,40.604,25.104,41.5,24,41.5z"></path><path fill="#90caf9" d="M39 21H9c-1.104 0-2-.896-2-2s.896-2 2-2h30c1.104 0 2 .896 2 2S40.104 21 39 21zM39 31H9c-1.104 0-2-.896-2-2s.896-2 2-2h30c1.104 0 2 .896 2 2S40.104 31 39 31z"></path><g><path fill="#43a047" d="M22,10v7H10v-7H22 M26,6H6v15h20V6L26,6z"></path></g></svg></span>
                                       </div>
                                       <div class="dropdown-menu dropdown-menu-colDef">
                                            <div class="col-flt">
                                                 <div class="d-flex">
                                                    <div><div class="ch checkBox" ng-class="{'active': taxo4checkedAll == 'Y'}" ng-click="selectionCol('','all');$event.stopPropagation();"><span ng-if="taxo4checkedAll == 'N'"><svg viewBox="0 0 50 50"><path d="M 39 4 L 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 11 C 46 7.101563 42.898438 4 39 4 Z M 42 39 C 42 40.699219 40.699219 42 39 42 L 11 42 C 9.300781 42 8 40.699219 8 39 L 8 11 C 8 9.300781 9.300781 8 11 8 L 39 8 C 40.699219 8 42 9.300781 42 11 Z"></path></svg></span><span ng-if="taxo4checkedAll == 'Y'"><svg viewBox="0 0 24 24" fill="#33b5e5"><path d="M 5 3 C 3.897 3 3 3.897 3 5 L 3 19 C 3 20.103 3.897 21 5 21 L 19 21 C 20.103 21 21 20.103 21 19 L 21 9.2421875 L 19 11.242188 L 19.001953 19 L 5 19 L 5 5 L 16.757812 5 L 18.757812 3 L 5 3 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z"></path></svg></span></div></div>
                                                    <input type="text" class="form-control" ng-model="colFilter['n']" placeholder="Search here">
                                                 </div>
                                            </div>
                                            <div class="dropdown-item-col ellipsis" ng-repeat="col in (taxo4colFilter['data'] = (taxoOptions4.grid_coldef | filter: colFilter))" ng-if="col.k != 't'"  ng-click="selectionCol(col);$event.stopPropagation();">
                                                <span class="d-inline-block">
                                                    <div class="ch checkBox"><span ng-if=" taxoOptions4.selectedCol[col.k] == 0"><svg viewBox="0 0 50 50"><path d="M 39 4 L 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 11 C 46 7.101563 42.898438 4 39 4 Z M 42 39 C 42 40.699219 40.699219 42 39 42 L 11 42 C 9.300781 42 8 40.699219 8 39 L 8 11 C 8 9.300781 9.300781 8 11 8 L 39 8 C 40.699219 8 42 9.300781 42 11 Z"></path></svg></span><span ng-if=" taxoOptions4.selectedCol[col.k] == 1"><svg viewBox="0 0 24 24" fill="#33b5e5"><path d="M 5 3 C 3.897 3 3 3.897 3 5 L 3 19 C 3 20.103 3.897 21 5 21 L 19 21 C 20.103 21 21 20.103 21 19 L 21 9.2421875 L 19 11.242188 L 19.001953 19 L 5 19 L 5 5 L 16.757812 5 L 18.757812 3 L 5 3 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z"></path></svg></span></div>

                                                </span>
                                                <span ng-bind-html="col.n" title="{{col.n}}" ng-class="{'divide_flg': col['databuilder'] == 'Y'}"></span>
                                            </div>
                                        </div>
                                   </div>
                                  <div class="appl-close" ng-click="getApplicator(true)">
                                       <i class="fa fa-reply"></i>
                                  </div>
                             </div>
                        </div>
                        <div class="appct-grid">
			      <grid-data gconfig="taxoOptions4" class="taxa"></grid-data>
                        </div>
		  </div> 	
		  <!-- applicator div-->	
		  <!-- grid div -->
	          <div class="gtop" ng-class="{'gtop-fullheight': !searchShow && (!avShow || !dataBuilderShow),'ng-hide': (collapse && !searchShow) || (dataBuilderShow && collapse ) ,'d-none': applicator}">
                       <div class="f-grid" ng-class="{'ng-hide': sltgridshow}">
                            <grid-data gconfig="taxoOptions1" class="taxa"></grid-data>
                       </div>
                       <div class="f-grid" ng-class="{'ng-hide': !sltgridshow}">
                            <grid-data gconfig="sltgriddata" class="taxa"></grid-data>
                       </div>
		  </div> 
		  <!-- ./grid div -->
		  <!-- right top grid -->	 
                  <div class="data-builder" ng-if="dataBuilderShow" ng-class="{'f-width':collapse,'d-none': applicator}">
                         <div class="extr-header">
                              <div class="pull-left">
                                    <div class="slt_filter" ng-click="taxo2_selectionCol('', 'all')" ng-class="{'active': taxo2checkedAll != 'Y'}">
                                         <i class="ui-grid-icon-cancel"></i>
                                    </div>
                                    <div class="maj_select" ng-repeat="items in stackitems track by $index" title="{{items['t']}}" ng-click="items['k'] == 'ph_c' ? taxo2_selectionCol('', 'all') : stackFilterBuilder(items)">
                                             <div ng-class="{'svg-check' : items.checked == 'Y', 'svg-uncheck' : items.checked != 'Y'}" class="svg_cls">
                                                  <span class="check">
                                                       <svg viewBox="0 0 24 24"><path d="M 5 3 C 3.897 3 3 3.897 3 5 L 3 19 C 3 20.103 3.897 21 5 21 L 19 21 C 20.103 21 21 20.103 21 19 L 21 9.2421875 L 19 11.242188 L 19.001953 19 L 5 19 L 5 5 L 16.757812 5 L 18.757812 3 L 5 3 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z"></path></svg>
                                                   </span>
                                                   <span class="uncheck">
                                                        <svg viewBox="0 0 50 50"><path d="M 39 4 L 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 11 C 46 7.101563 42.898438 4 39 4 Z M 42 39 C 42 40.699219 40.699219 42 39 42 L 11 42 C 9.300781 42 8 40.699219 8 39 L 8 11 C 8 9.300781 9.300781 8 11 8 L 39 8 C 40.699219 8 42 9.300781 42 11 Z"></path></svg>
                                                   </span>
                                              </div>
                                          <label><span class="count {{items['b']}}" ng-bind="taxoOptions2['stack'][items['n']]"></span></label>
                                    </div>
                              </div>
                              <div class="pull-right">
                                     <div class="sltbtn btn pull-left waves-effect" ng-click="getSlt()" ng-class="{'active': sltgridshow}">Slt</div> 
                                            <!--div class="avcheck">
                                                    <span class="pull-left"><div class="ch checkBox"  ng-click="onlyAvailability(avAll);$event.stopPropagation();"><span ng-if="avAll == 'N'"><svg viewBox="0 0 50 50"><path d="M 39 4 L 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 11 C 46 7.101563 42.898438 4 39 4 Z M 42 39 C 42 40.699219 40.699219 42 39 42 L 11 42 C 9.300781 42 8 40.699219 8 39 L 8 11 C 8 9.300781 9.300781 8 11 8 L 39 8 C 40.699219 8 42 9.300781 42 11 Z"></path></svg></span><span ng-if="avAll == 'Y'"><svg viewBox="0 0 24 24" fill="#fff"><path d="M 5 3 C 3.897 3 3 3.897 3 5 L 3 19 C 3 20.103 3.897 21 5 21 L 19 21 C 20.103 21 21 20.103 21 19 L 21 9.2421875 L 19 11.242188 L 19.001953 19 L 5 19 L 5 5 L 16.757812 5 L 18.757812 3 L 5 3 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z"></path></svg></span></div></span>
                                                    <span class="txt">Availability</span>
                                            </div -->
                                  <div class="dropdown pull-left">
                                       <div class="colDefdd waves-effect pull-left" data-toggle="dropdown">
                                            <!--span class="fa fa-braille cl-col"></span-->
                                            <span><svg viewBox="0 0 48 48"><path fill="#90caf9" d="M6,42V6h36v36H6z M10,38h28V10H10V38z"></path><path fill="#90caf9" d="M24,41.5c-1.104,0-2-0.896-2-2V9c0-1.104,0.896-2,2-2s2,0.896,2,2v30.5C26,40.604,25.104,41.5,24,41.5z"></path><path fill="#90caf9" d="M39 21H9c-1.104 0-2-.896-2-2s.896-2 2-2h30c1.104 0 2 .896 2 2S40.104 21 39 21zM39 31H9c-1.104 0-2-.896-2-2s.896-2 2-2h30c1.104 0 2 .896 2 2S40.104 31 39 31z"></path><g><path fill="#43a047" d="M22,10v7H10v-7H22 M26,6H6v15h20V6L26,6z"></path></g></svg></span>
                                       </div>
                                       <div class="dropdown-menu dropdown-menu-colDef">
                                            <div class="col-flt">
                                                 <div class="d-flex">
                                                    <div><div class="ch checkBox" ng-class="{'active': taxo2checkedAll == 'Y'}" ng-click="taxo2_selectionCol('','all');$event.stopPropagation();"><span ng-if="taxo2checkedAll == 'N'"><svg viewBox="0 0 50 50"><path d="M 39 4 L 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 11 C 46 7.101563 42.898438 4 39 4 Z M 42 39 C 42 40.699219 40.699219 42 39 42 L 11 42 C 9.300781 42 8 40.699219 8 39 L 8 11 C 8 9.300781 9.300781 8 11 8 L 39 8 C 40.699219 8 42 9.300781 42 11 Z"></path></svg></span><span ng-if="taxo2checkedAll == 'Y'"><svg viewBox="0 0 24 24" fill="#33b5e5"><path d="M 5 3 C 3.897 3 3 3.897 3 5 L 3 19 C 3 20.103 3.897 21 5 21 L 19 21 C 20.103 21 21 20.103 21 19 L 21 9.2421875 L 19 11.242188 L 19.001953 19 L 5 19 L 5 5 L 16.757812 5 L 18.757812 3 L 5 3 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z"></path></svg></span></div></div>
                                                    <input type="text" class="form-control" ng-model="taxo2colFilter['n']" placeholder="Search here">
                                                 </div>
                                            </div>
                                            <div class="dropdown-item-col ellipsis" ng-repeat="col in (filterCol['data'] = (taxoOptions2.grid_coldef | filter: taxo2colFilter))" ng-if="col.k != 's'"  ng-click="taxo2_selectionCol(col);$event.stopPropagation();">
                                                <span class="d-inline-block">
                                                    <div class="ch checkBox"><span ng-if="taxoOptions2.selectedCol[col.k] == 0"><svg viewBox="0 0 50 50"><path d="M 39 4 L 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 11 C 46 7.101563 42.898438 4 39 4 Z M 42 39 C 42 40.699219 40.699219 42 39 42 L 11 42 C 9.300781 42 8 40.699219 8 39 L 8 11 C 8 9.300781 9.300781 8 11 8 L 39 8 C 40.699219 8 42 9.300781 42 11 Z"></path></svg></span><span ng-if="taxoOptions2.selectedCol[col.k] == 1"><svg viewBox="0 0 24 24" fill="#33b5e5"><path d="M 5 3 C 3.897 3 3 3.897 3 5 L 3 19 C 3 20.103 3.897 21 5 21 L 19 21 C 20.103 21 21 20.103 21 19 L 21 9.2421875 L 19 11.242188 L 19.001953 19 L 5 19 L 5 5 L 16.757812 5 L 18.757812 3 L 5 3 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z"></path></svg></span></div>
                                                </span>
                                                <span ng-bind-html="col.n" title="{{col.n}}" ng-class="{'divide_flg': col['divident_flg'] == 'Y'}"></span>
                                            </div>
                                        </div>
                                   </div>
                                    
                              </div>
                         </div>
                         <div class="taxo-2">
                         <grid-data gconfig="taxoOptions2" class="taxa"></grid-data>
                         <div class="txo_list_pop_full" id="{{config['id']}}_txo_list_pop_full" ng-if="false">
					<div class="txo_list_pop_f_lft">
					    <div class="txo_list_pop_f_lft_t">
						<textarea class="txo_list_pop_f_lft_t_txtara" autocomplete="off" id="main_input_txt_option" ng-model="main_input_txtarea"></textarea> 
						<div class="txo_list_pop_f_lft_t_btn" id="main_input_TAS_NA" ng-click="add_tas_na_text()">TAS-NA</div>
					    </div>
					    <div class="txo_list_pop_f_lft_c">
						<div ng-click="txo_pop_save_func()" class="txo_list_pop_f_lft_c_sv">Save</div>
						<input type="text" class="txo_list_pop_f_lft_c_ipt" value="" ng-model="txo_list_pop_f_txt" id="txo_list_pop_f_lft_c_ipt" ng-keyup="filter_function(txo_list_pop_f_txt, event, config['id'] +'_txo_list_pop_full', 'txo_list_pop_f_lft_bli')">
						<div ng-click="txo_list_pop_cls()" class="txo_list_pop_f_lft_c_del">&times;</div>
					    </div> 
					    <div class="txo_list_pop_f_lft_b">
						<div class="txo_list_pop_f_lft_bli" ng-repeat="tl in taxo_list" ng-mouseover="taxo_li_movr_func(tl, $index);$event.stopPropagation();" ng-click="txo_pop_list_save_func(true, tl)" ng-class="{active: txo_list_pop_f_lft_t_id['t_id'] == tl['t_id']}">
						    {{tl['t_id']}} - {{tl['taxo']}}
						    <div class="txo_val_avl_div_prt" ng-if="doc_full_res['data'][tl['taxo']] && doc_full_res['data'][tl['taxo']][doc_full_res['data'][tl['taxo']].length - 1]['v'] != ''" ng-click="taxo_avl_srl_func(tl);$event.stopPropagation();">
							<div class="txo_val_avl_div"></div>
						    </div> 
						    <div class="kpi_drp_dwn_icn dropdown-toggle" ng-if="tl['dropdown'].length" style="float: right;float: right;position: absolute;right: 2px;top: 10px;">
							<span class="sr-only">Toggle Dropdown</span>
						    </div> 
						</div>
					    </div> 
					</div>
					<div class="txo_list_pop_side_fl" ng-if="txo_list_pop_side_flg">
					    <div class="txo_list_pop_side_fl_t">
						<input autocomplete="off" class="txo_list_pop_side_fl_t_ipt" value="" ng-model="txo_list_pop_side_f_txt" ng-keyup="filter_function(txo_list_pop_side_f_txt, event, 'txo_list_pop_full', 'txo_list_pop_side_fl_b_lst')" id="main_input_div_option">
					    </div>
					    <div class="txo_list_pop_side_fl_b">
						<div class="txo_list_pop_side_fl_b_lst" ng-repeat="sde in side_txo_list track by $index" title="{{sde[1]}}" ng-click="txo_pop_list_save_func(false, sde)">
						    {{sde[1]}}
						    <sub class="txo_list_pop_side_fl_b_lst_sub" title="{{sde[0]}}">{{sde[0]}}</sub>
						</div>
					    </div>
					</div>
				</div>  
                  </div>
                 </div>
		  <!-- ./right top grid -->	 
		  <!-- left bottom grid div -->
		  <div class="sbottom" ng-show="searchShow || (avShow && dataBuilderShow)">
                       <div class="tas-tab">
                           <div class="tab-slct waves-effect active" ng-if="!avShow">Serach Data</div>
                           <div class="tab-slct waves-effect active" ng-if="avShow">Availability</div>
			   	
                           <div class="clsbtn" ng-click="searchToggle();"><i class="fa fa-chevron-down"></i></div>
                     	   <div class="btn btn-sv btn-success pull-right" ng-click="click_add()" title="Add" style="margin-right:10px; margin-top:5px;" ng-if="avShow">Add</div>
                       </div>
                       <div class="stchresult">
                           <div class="serhere">
                               <div class="input-group" style="position: relative;">
                                    <input type="text" class="form-control srcinput" placeholder="Search" ng-model="searchText['text']" ng-keyUp="autosuggestion($event)">
                                    <div class="input-group-append" ng-click="searchHere()">
                                         <div class="srcbtn"><i class="fa fa-search text-grey" ng-class="{'fa-refresh fa-spin': searchSping}"></i></div>
                                    </div>
                                    <div class="auto-suggestion" ng-if="suggestionData.length">
                                          <ul class="sugg-list">
                                              <li class="sugg-items ellipsis" ng-repeat="item in suggestionData track by $index" ng-click="selectionSuggtion(item)" ng-class="{'move': keyupSelection['k'] == item['k']}">{{item["text"]}}</li>
                                          </ul>
                                    </div>
                               </div>    
                           </div>
                           <div class="srchresult-grid" ng-if="avShow || searchShow">
                                 <!--div class="ui-grid" ui-grid="searchGrid" ng-show="!avShow && searchShow"></div-->
                                 <grid-data gconfig="taxoOptions3" class="taxa"></grid-data> 
                           </div>
                       </div>
                       <!--div class="stchresult" ng-show="avShow">			    	
                              <grid-data gconfig="taxoOptions3" class="taxa"></grid-data> 
                       </div -->
		  </div>				 
		  <!-- ./left bottom grid div -->
		  <!-- ref div -->
                  <div class="ref-1" ng-class="{'ref-split': dataBuilderShow, 'ref-h-full':!searchShow && applicator, 'ref-ful' : collapse && (!searchShow && !avShow)}">
                         <div class="ref-full" ng-class="{'ref-half': searchPopShow}">
                              <ref-div config="referDoc"></ref-div>
                         </div>
                         <div class="ref-half" ng-if="searchPopShow">
                              <div class="cls_header">
                                   <div class="pull-right"><div class="appl-close" ng-click="searchPopClose()"><i class="fa fa-reply"></i></div></div>
                              </div>
                              <div class="searchref">
                                   <ref-div config="popref" ></ref-div>
                              </div>
                         </div>
			<div class="catg_con"  ng-show="catg_popup">
				<div class="cat_hdr">
                                     <div class="pull-right">
                                        <div class="pull-left"><div class="ch checkBox" ng-class="{'active': across == true}" ng-click="acrosscheck()"><span class="occ">Across </span><span ng-if="across == false"><svg viewBox="0 0 50 50"><path d="M 39 4 L 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 11 C 46 7.101563 42.898438 4 39 4 Z M 42 39 C 42 40.699219 40.699219 42 39 42 L 11 42 C 9.300781 42 8 40.699219 8 39 L 8 11 C 8 9.300781 9.300781 8 11 8 L 39 8 C 40.699219 8 42 9.300781 42 11 Z"></path></svg></span><span ng-if="across"><svg viewBox="0 0 24 24" fill="#33b5e5"><path d="M 5 3 C 3.897 3 3 3.897 3 5 L 3 19 C 3 20.103 3.897 21 5 21 L 19 21 C 20.103 21 21 20.103 21 19 L 21 9.2421875 L 19 11.242188 L 19.001953 19 L 5 19 L 5 5 L 16.757812 5 L 18.757812 3 L 5 3 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z"></path></svg></span></div></div>
					<div class="slt_drop_dwn_sec_cls" ng-click="call_catg_data(true)">&times;</div>
                                     </div>
				</div>
				<div class="cat_body">
					<div class="cat_cvr">
						<div class="tbl_cvr" ng-init="call_dym_grd(grp_tbl)"  ng-repeat="grp_tbl in catg_grp_grid">
							<div  class="tbl_hdr">
                                                             <div class="use-btn btn pull-left" ng-click="getusetable(grp_tbl)">Use</div>
                                                             <div ng-bind-html="grp_tbl['n']" class="pull-left" style="margin-top: 3px;"></div>
                                                        </div>
							<div  class="tbl_bdy">
								 <table-div config="cmn_grp[grp_tbl['k']]"   class="taxa"></table-div>	
							</div>
						</div>
                                        </div>
				</div>
	                  </div>

                  </div>
		  <!-- ./ref div -->
	     </div>		

        </div>
    </div>

<!-- popup -->
    <div class="modal tablepopup modal_show" ng-if="tablepopup">
        <div class="mymodal-backdrop" ng-click="tablepop_close()"></div>
        <div class="modal-dialog">
            <div class="modal-content hw-100">
                 <div class="modal-header">
		       <div class="modal-title">
                            <div class="pull-left">All Document</div>
                            <div class="pull-left">
                                 <div class="ch checkBox" ng-click="saveSlct('all',saveSlctAll)" style="margin-left: 5px;padding:0;"><span ng-if="saveSlctAll != 'Y'"><svg viewBox="0 0 50 50"><path d="M 39 4 L 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 11 C 46 7.101563 42.898438 4 39 4 Z M 42 39 C 42 40.699219 40.699219 42 39 42 L 11 42 C 9.300781 42 8 40.699219 8 39 L 8 11 C 8 9.300781 9.300781 8 11 8 L 39 8 C 40.699219 8 42 9.300781 42 11 Z"></path></svg></span><span ng-if="saveSlctAll == 'Y'"><svg viewBox="0 0 24 24" fill="#33b5e5"><path d="M 5 3 C 3.897 3 3 3.897 3 5 L 3 19 C 3 20.103 3.897 21 5 21 L 19 21 C 20.103 21 21 20.103 21 19 L 21 9.2421875 L 19 11.242188 L 19.001953 19 L 5 19 L 5 5 L 16.757812 5 L 18.757812 3 L 5 3 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z"></path></svg></span></div>
                            </div>
                       </div>
                       <div ng-click="tablepop_close()" class="close">
                            <i class="fa fa-reply" style="font-size: 14px;color: #000;"></i>
                       </div>
                       <div class="pull-right" style="margin-top: 3px;padding-right: 6px;">
                            <button class="btn btn-sm smbtn m-0" ng-click="saveTable()">Save</button>
                       </div>
                  </div>
                  <div class="modal-body">
                        <div class="tbl-left">
                             <div class="dropdn-tables">
                                   <div class="pull-left h-100">
                                         <drop-down config="clsfictintbl" class="h-100"></drop-down>
                                   </div> 
                             </div>
                             <div class="usr_flt">
                                  <input type="text" class="form-control usr_input" placeholder="Search Document" ng-model="user_flt['n']"> 
                             </div>
                             <div class="tables">
                             <div class="tbl_cvr" ng-repeat="tbl in tabledatas['data'] | filter: user_flt" ng-init="loadTables(tbl)">
                                  <div class="tbl_hdr">
                                        <div class="dctxt" ng-bind-html="tbl['n']"></div>
                                        <div class="pull-left">
                                              <div class="ch checkBox" ng-class="{'active': tbl['check'] == 'Y'}" ng-click="saveSlct('',tbl)"><span ng-if="tbl['checked'] != 'Y'"><svg viewBox="0 0 50 50"><path d="M 39 4 L 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 11 C 46 7.101563 42.898438 4 39 4 Z M 42 39 C 42 40.699219 40.699219 42 39 42 L 11 42 C 9.300781 42 8 40.699219 8 39 L 8 11 C 8 9.300781 9.300781 8 11 8 L 39 8 C 40.699219 8 42 9.300781 42 11 Z"></path></svg></span><span ng-if="tbl['checked'] == 'Y'"><svg viewBox="0 0 24 24" fill="#33b5e5"><path d="M 5 3 C 3.897 3 3 3.897 3 5 L 3 19 C 3 20.103 3.897 21 5 21 L 19 21 C 20.103 21 21 20.103 21 19 L 21 9.2421875 L 19 11.242188 L 19.001953 19 L 5 19 L 5 5 L 16.757812 5 L 18.757812 3 L 5 3 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z"></path></svg></span></div>
                                        </div> 
                                  </div>
                                  <div class="tbl_bdy">
                                       <table-div config="popuptables[tbl['k']]"></table-div>
                                  </div>
                                  </div>
                             </div>
                        </div>
                        <div class="tbl-right">
                             <ref-div config="tablerefernce"></ref-div> 
                        </div>
                  </div>
            </div>
        </div> 
        </div>
        <style>
.apt{width: 100%;height: 100%;}
.apt .bdydata{width: calc(100% - 4px);height: calc(100% - 34px);margin: 2px;background: #f1f4f6;}
.apt .bdydata .gleft{width: 50%;height: 100%;float: left;}
.apt .bdydata .refright{width: calc(50% - 5px);height: 100%;margin-left: 5px; float: left;}
.apt .bdydata .gleft .gtop{width: 100%;height: calc(50% - 2px);margin-bottom: 4px;transition: all 0.3s ease; -webkit-transition: all 0.3s ease; -moz-transition: all 0.3s ease; -o-transition: all 0.3s ease; -ms-transition: all 0.3s ease;}
.apt .bdydata .gleft .gtop-fullheight{height: 100%; margin-bottom: 0px;transition: all 0.3s ease; -webkit-transition: all 0.3s ease; -moz-transition: all 0.3s ease; -o-transition: all 0.3s ease; -ms-transition: all 0.3s ease;}
.apt .bdydata .gleft .sbottom{width: 100%;height: calc(50% - 2px);}
.apt .gleft .gbdy{width: 100%;height: calc(100% - 30px);background: #fff;}
.apt .sbottom .stchresult{width: 100%;height: calc(100% - 33px);background: #fff;}
.apt .stchresult .serhere{width: 50%;height: 40px;padding: 5px 10px;}
.apt .serhere .srcinput{height: 30px;font-size: 13px;}
.apt .serhere .srcinput:focus{ box-shadow: none; border-color: transparent; box-shadow: 0 0 0 0.1rem rgba(149, 180, 206, 0.6) !important; -webkit-box-shadow: 0 0 0 0.1rem rgba(149, 180, 206, 0.6) !important; }
.apt .serhere .srcbtn{padding: 0 10px; line-height: 30px;border-top-right-radius: .25rem; border-bottom-right-radius: .25rem;background: #6396c1;box-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12);}
.apt .serhere .srcbtn i{color: #fff;}
.apt .gbdy .taxa{width: 100%;height: 100%;}
.apt .tas-tab{width: 100%; height: 30px; margin-bottom: 3px; background: #fff;}
.apt .tas-tab .tab-slct:first-child { border-top-left-radius: 5px; }
.apt .tas-tab .tab-slct{ float: left; padding: 0 10px; font-weight: 500; background: #fff; border-right: 1px solid #ddd;line-height: 24px;margin-top: 2px; }
.apt .tas-tab .tab-slct.active{background: #5e8aaf; color: #fff; box-shadow: 0 2px 1px 0 rgba(0,0,0,.16), 0 2px 8px 0 rgba(0,0,0,.12);border-radius: 2px;}
.apt .tas-tab .clsbtn{ float: right; text-align: center; width: 25px; line-height: 23px; background: #6396c1; color: #fff; margin-right: 3px; border-radius: 2px;box-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12);margin-top: 4px;}
.apt .stchresult .srchresult-grid{width: 100%;height: calc(100% - 40px);}
.apt .refright .data-builder{width: 100%;height: 50%;background: #fff;margin-bottom: 4px;position: relative;}
.apt .phl .clsbtn{margin: 0;text-align: center; padding: 0 6px; background: #6396c1; margin-left: 6px; color: #fff;line-height: 20px;border-radius: 2px;font-weight: 500; text-transform: capitalize;margin-top: 3px;}
.apt .phl .clsbtn i{padding-top: 4px;}
.apt .phl .clsbtn.active{background: #fff; color: #288ad8;border: 2px solid #288ad8; line-height: 22px; margin-top: 1px; padding: 0 6px;}
.apt .refright .ref-1{width: 100%;height: 100%; padding: 0px 5px 0px 5px; background: #fff;}
.apt .refright .ref-split{width: 100%;height: calc(50% - 4px);}
.apt .ref-1 .refDocm{width: 100%;height: calc(100% - 30px);background: #fff;}
/***********auto suggestion**************/
.apt .serhere .auto-suggestion{position: absolute;width: 100%; height: 180px; background: #fff; top: 100%; z-index: 100; border-radius: 3px; border: 1px solid #ddd;left: 0;}
.apt .auto-suggestion .sugg-list{width: 100%;height: 100%;overflow: hidden;overflow-y: auto;}
.apt .auto-suggestion .sugg-list .sugg-items{padding: 7px 10px; list-style: none; cursor: pointer; border-bottom: 1px solid #ebebeb; display: block; }
.apt .sugg-list .sugg-items.move{background: #dae8f1; color: #343a40; font-weight: bold; border-radius: 3px;}
.apt .prj-header{width: 100%;height: 30px;line-height: 28px;}
.apt .prj-header .prjct-title{float: left; padding-left: 15px; font-size: 14px; font-weight: bold;}
.apt .cell-border.active{border: 2px solid black !important;background-color: white !important; font-weight: bold; height: 29px !important;line-height: 17px !important; padding: 5px 5px;}
.apt .white-space {white-space: normal !important;}
.apt .prj-header .phl, .prj-header .phr{width: 100%;height: 100%;float: left;border-bottom: 1px solid #dfdfdf;border-top: 1px solid #dfdfdf;background: #fff;}
.apt .prj-header .phr{width: calc(50% - 5px);margin-left: 5px;border-left: 1px solid #ddd;}
.apt .bdydata .ref-change{width: 100%;margin-left: 0;}
.apt .drop-prev {padding: 0 10px;border-left: 1px solid #ddd;}
.apt .drop-next {padding: 0 10px;border-left: 1px solid #ddd;}
.apt .flo_lef{ color: #0e0e0e; }
.apt .ref-1 ref-div{position: relative; float: left; width: 100%; height: 100%; }
.apt .ampbtn{padding: 0px 10px; margin: 0px; color: #fff; background: #33b5e5;}
.apt .dubmake .dublicate{float: right; color: #455a64;padding: 4px 5px; border-radius: 4px; line-height: normal;}
.apt .dublicate span {margin-right: 5px;}
.apt .dubmake .dublicate i{font-weight: bold; font-size: 14px;}
.apt .btn-sv {margin: 0; padding: 3px 8px; margin-right: 4px; font-weight: bold; background: #02d1f5; text-transform: capitalize;margin-top: -2px;font-size: 10px;}
.apt .ui-grid-cell-contents .vl-flg{position: absolute; right: 0px; bottom: 0; background: #3aa99f; color: #fff; font-size: 11px; font-weight: 500; text-align: center; line-height: 19px; padding: 0 4px;border-top-left-radius: 2px;}
.apt .ui-grid-cell-contents.pass-text{background: #ff908982 !important;}
.apt .uni_div{display:block;position:relative;float:left; width:100%; height: 100%;}
.apt .uni_div .gtop-fullheight{height: calc(100% - 1px)!important; margin-bottom: 1px; transition: all 0.3s ease; -webkit-transition: all 0.3s ease; -moz-transition: all 0.3s ease; -o-transition: all 0.3s ease; -ms-transition: all 0.3s ease; display: block; float: left;}
.apt .uni_div .gtop {display: block;	float: left; width: 50%; height: 50%; margin-bottom: 4px; transition: all 0.3s ease; -webkit-transition: all 0.3s ease; -moz-transition: all 0.3s ease; -o-transition: all 0.3s ease; -ms-transition: all 0.3s ease;}
.apt .uni_div .data-builder{width: calc(50% - 5px);height: 50%;background: #fff;margin-bottom: 4px;float: left; display: block;margin-left: 5px;}
.apt .uni_div .f-width{width: 100% !important;margin-left: 0;}	
.apt .uni_div .ref-1{width: calc(50% - 5px);height: 100%; float:right; display: block;margin-left: 5px;}
.apt .uni_div .ref-split{width: calc(50% - 5px);height: calc(50% - 5px);}
.apt .uni_div .ref-h-full{width: calc(100% - 5px);}
.apt .uni_div .ref-ful{width: 100% !important;}
.apt .bdydata .uni_div .sbottom{width: calc(50% - 2px);height: calc(50% - 4px);display: block;position: absolute; bottom: 1px;left: 1px;}
.apt .ap_active{background: #1ca1b8 !important;}
.apt .uni_div .applicator_div{display:block; float:left; width: 100%; height: 50%; margin-bottom: 5px;}
.apt .applicator_div .appct-grid{width: 100%; height: calc(100% - 30px);}
.apt .applicator_div .appl-close{float: left; background: #fff; line-height: 22px; padding: 0 6px; border-radius: 2px;box-shadow: 0 5px 11px 0 rgba(0,0,0,.18), 0 4px 15px 0 rgba(0,0,0,.15);margin-top: 3px;margin-left: 5px;}
.apt .all_delta_spans_0{ background:#F29F81; }
.apt .all_delta_spans_1{ background:#87D1F4; }
.apt .all_delta_spans_2{ background:#FACE92; }
.apt .all_delta_spans_3{ background:#95CB9C; }
.apt .all_delta_spans_4{ background:#C795BF }
.apt .all_delta_spans_5{ background:#D4E29C; }
.apt .selct-col{/*background: #7ecbd2;*/ background: #d8ecf6;}
.apt .selct-col .ui-grid-filter-input{background: #c9f3db;}
.apt .delCls{position: relative;}
.apt .del-val{position: absolute;display: none;top: 4px;right: 2px; padding: 2px 4px;border-radius: 3px;color: #f44336;border: 1px solid #f44336;background: #fbeded;z-index: 1;}
.apt .del-val-a{position: absolute;display: none;top: 4px;left: 2px; padding: 2px 4px;border-radius: 3px;color: #f44336;border: 1px solid #f44336;background: #fbeded;z-index: 1;}
.apt .delCls:hover .del-val{display: block;}
.apt .delCls:hover .del-val-a{display: block;}
.apt .extr-header{width: 100%;height: 30px;background: #fff;border-top: 1px solid #dfdfdf;}
.apt .colDefdd{height: 100%;padding: 2px;box-shadow: 0 5px 11px 0 rgba(0,0,0,.18), 0 4px 15px 0 rgba(0,0,0,.15); border-radius: 3px; margin-top: 1px;}
.apt .dropdown-menu-colDef{max-height: 250px !important; overflow: auto; border-radius: 0px; width: 250px;transform: translate3d(-220px, -67px, 0px);}
.apt .colDefdd svg {width: 20px;height: 20px; fill: #125373;}
.apt .col-flt{padding: 0 10px 5px 10px;border-bottom: 1px solid #e4e4e4;}
.apt .col-flt input{height: 25px;font-size: 13px;margin-top: 3px;}
.apt .col-flt input:focus {box-shadow: none;}
.apt .dropdown-menu-colDef .dropdown-item-col{padding: 2px 10px;font-size: 13px;border-bottom: 1px solid #ddd;}
.apt .ch.checkBox span{margin-right: 5px;}
.apt .data-builder .taxo-2{width: 100%;height: calc(100% - 30px);position: relative;}
.apt .cl-col{color: #02caed; font-size: 16px; font-weight: 600;}
.apt .avcheck{background: #02caed;float: left;padding: 0px 5px;box-shadow: 0 5px 11px 0 rgba(0,0,0,.18), 0 4px 15px 0 rgba(0,0,0,.15); margin-right: 7px; border-radius: 3px;margin-top: 2px;}
.apt .avcheck .txt{ color: #fff; font-weight: 500; line-height: 22px; }
.apt .avcheck .checkBox svg{height: 17px;}
.apt .mrval{width: calc(100% - 20px);float: left;}
.apt .d-vl{display: none;float: left;width: 20px;    padding: 1px 4px; border-radius: 3px; color: #f44336; border: 1px solid #f44336; line-height: normal;position: relative; z-index: 1;background: #fbeded;}
.apt .ui-grid-cell-contents:hover .d-vl{display: block;}
.apt .searchref{width: 100%;height: calc(100% - 30px);}
.apt .tree-del{padding: 1px 4px;display: none; border-radius: 3px; color: #f44336; border: 1px solid #f44336; line-height: normal;float: left;background: #fbeded;}
.apt .dublicate .tree-del i{font-size: 12px;font-weight:normal;}
.apt .flo_lef:hover .tree-del{display: block;}
.apt .cls_header{width: 100%;height: 27px;background: #fff;margin-bottom: 3px;}
.apt .cls_header .appl-close{float: left; background: #ffe1e1; color: red; line-height: 20px; padding: 0 5px; border-radius: 2px; box-shadow: 0 5px 11px 0 rgba(0,0,0,.18), 0 4px 15px 0 rgba(0,0,0,.15); margin-top: 3px; margin-right: 3px;}
.apt .flo_lef .tree_leaf{width: calc(100% - 55px);white-space: nowrap; overflow: hidden; text-overflow: ellipsis;display: block;float: left;}
.apt [gconfig="taxoOptions1"] .ui-grid-cell-contents {position: relative;}
.apt .ref-1 .ref-full{width: 100%;height: 100%;background: #fff;} 
.apt .ref-1 .ref-half{width: 100%;height: calc(50% - 2px);background: #fff;margin-bottom: 3px;}
.apt .edit_cl { background: #aad9d5; font-weight: bold; color: #333 !important; }
.apt .pdf{float: left;padding: 0 10px; color: #f59494;font-size: 18px;}
.apt .paramatch{background: #bbe9ed !important;}
.apt .phr drop-down{max-width: 200px;}
.apt .catg_con { position: absolute; z-index: 1111; width: 50%; height: 100%; top: 0px; background: #fff; }
.apt .cat_hdr { float:left; width:100%; height:27px; border-bottom:1px solid #ececec; }
.apt .cat_body { float:left; width:100%; height:calc(100% - 27px); overflow: auto; }
.apt .slt_drop_dwn_sec_cls { text-align: center; font-size: 21px; cursor: pointer; width: 27px; height: 27px; background-size: 10px 10px; color: rgba(244, 67, 54, 0.75); line-height: 25px; position: relative; float: right; border-left: 1px solid #e4e4e4; }
.apt .cat_left  { float:left; width:50%; height:100%; }
.apt .cat_right  { float:left; width:50%; height:100%; }
.apt .cat_cvr { float:left; width:100%; height:100%; }
.apt .tbl_cvr { float:left; padding:10px; width:100%; }
.apt .tbl_hdr { float: left; padding: 4px 10px 4px 10px; width: 100%; background: #eef2f5; font-weight: bold; }
.apt .tbl_bdy td { border-right:1px solid #ddd; }
.apt .tbl_bdy td:first-child { border-left:1px solid #ddd; }
.apt .tbl_bdy tr:first-child td { border-top:1px solid #ddd; }
.apt .tbl_bdy { padding: 10px 20px; float: left; border: 5px solid #eef2f5; width: 100%; border-top: 0px; }
.apt .tbl_bdy .csv_tbl_mod .csv_tbl_td .leaf_node { display: inline-block; font-weight: normal; margin: 2px 1px; padding: 5px 9px; font-size: 13px; box-shadow: inset 0 0 0 1px #797979 !important;}
.apt .use-btn{margin: 0; text-align: center; padding: 2px 6px; background: #33b5e5; margin-right: 6px; color: #fff; border-radius: 2px; font-weight: 500; text-transform: capitalize;font-size: 11px;}
.apt .modal_show{display: block;}
.apt .hw-100{width: 100%;height: 100%;}
.apt .mymodal-backdrop {position: fixed;top: 0;left: 0;z-index: 1040;width: 100vw;height: 100vh;background-color: #000;opacity: 0.5;}
.apt .tablepopup .modal-dialog{width: 99% !important; max-width: 100%;height: 97%;margin: 0.5rem auto;z-index: 1050;}
.apt .tablepopup .modal-header{padding: 0px;font-size: 16px;color: #3F51B5;font-weight: bold;height: 30px;display: block;}
.apt .tablepopup .modal-header .modal-title{display: inline-block;height: 100%;line-height: 29px;padding: 0px 10px;}
.apt .tablepopup .modal-header .close{float: right;display: inline-block;margin: 0;height: 100%;padding: 0 10px;line-height: 25px;border-left: 1px solid #ddd;opacity: 1;}
.apt .tablepopup .modal-body{padding: 3px;height: calc(100% - 30px); background: #f1f4f6;}
.apt .smbtn{background: #33b5e5;color: #fff;font-weight: 600; padding: 4px 9px!important;}
.apt .tablepopup .tbl-left{float: left;width: calc(50% - 3px);height: 100%; margin-right: 5px; overflow: hidden; overflow-y: auto; background: #fff;}
.apt .tablepopup .tbl-right{float: left;width: calc(50% - 2px);height: 100%;}
.apt .occ{font-weight: bold;}
.apt .tbl_hdr .dctxt{float: left;margin-right: 5px;margin-top: 4px;}
.apt .usr_flt { width: 50%; height: 35px; padding: 3px; float: left;border-bottom: 1px solid #ddd;}
.apt .usr_flt .usr_input {height: 28px; font-size: 12px;}
.apt .usr_flt .usr_input:focus { box-shadow: none; border-color: transparent; box-shadow: 0 0 0 0.1rem rgba(149, 180, 206, 0.6) !important; -webkit-box-shadow: 0 0 0 0.1rem rgba(149, 180, 206, 0.6) !important; }
.apt .tbl-left .tables{ width: 100%; height: calc(100% - 35px); overflow: hidden; overflow-y: auto; }
.apt .dropdn-tables {width: 50%; height: 35px; padding: 3px;float: left;border-bottom: 1px solid #ddd;}
.apt [role="columnheader"] .divide_flg, .dropdown-item-col .divide_flg{color: #25a0fd;}
.apt .extr-header .sltbtn{margin: 0; text-align: center; padding: 0 6px; background: #6396c1; margin-right: 6px; color: #fff; line-height: 22px; border-radius: 2px; font-weight: 500; margin-top: 3px; font-size: 12px;}
.apt .extr-header .sltbtn.active{background: #fff; color: #288ad8; border: 2px solid #288ad8;margin-top: 2px; padding: 0 6px;line-height: 19px;}
.apt [gconfig="taxoOptions4"] .ui-grid-cell-contents.slt_S{color: #49a356;}
.apt [gconfig="taxoOptions4"] .ui-grid-cell-contents.slt_A{color: #39c6de;}
.apt [gconfig="taxoOptions4"] .ui-grid-cell-contents.dup_txt{color: #ff6961;}
.apt .gtop .f-grid{width: 100%;height: 100%;}
.apt .even{background: #62abb7; color: #fff !important;}
.apt .odd{background: #f2dcbf;}
.apt [gconfig="taxoOptions2"] .ui-grid-cell-contents.usraddtxt{background: #e2f3e2 !important;}
.apt [gconfig="taxoOptions1"] .ui-grid-cell-contents.slt_S{color:#49a356;}
.apt [gconfig="taxoOptions1"] .ui-grid-cell-contents.slt_A{color: #39c6de;}
.apt .slt_filter { float: left; width: 36px; height: 24px; background: #f7f7f7; margin: 2px; border: 1px solid #ececec; }
.apt .slt_filter.active{border: 1px solid #6396c1; background: #ecf3f7;}
.apt .slt_filter .ui-grid-icon-cancel{background-repeat: no-repeat; padding: 6.5px; margin-top: 5px; float: left; margin-left: 11px;}
.apt .maj_select{ float: left; margin: 1px 3px; padding: 2px 5px; border: 1px solid #eaeaea; color: #797979; }
.apt .maj_select .svg_cls { display: inline-block; float: left; margin-top: 1px; opacity: 0.5; }
.apt .maj_select svg { width: 14px; height: 14px; }
.apt .maj_select .check, .apt .maj_select .uncheck{display: none;}
.apt .svg-check .check, .apt .svg-uncheck .uncheck{display: block;}
.apt .maj_select label { margin-top: 2px; float: left; margin-bottom: 2px !important; margin-left: 3px; }
.apt .maj_select .count { float: right; border-radius: 3px !important; opacity: 0.7; box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1), 0 2px 10px 0 rgba(0, 0, 0, 0.07); margin: 0px 5px; color: #fff; font-weight: 600; padding: 1px 10px; font-size: 10px;height: 15px;}
.apt .maj_select .count.T { background: #6396c1;}
.apt .maj_select .count.R { background: #cc190f;}
.apt .maj_select .count.D { background: #39c6de;}
.apt .maj_select .count.A { background: #e6938f;}
.apt .maj_select .count.S { background: #49a356;}
.apt .mrefdata{background: #505f8b; color: #fff; float: left;padding: 0 4px;}
.apt .ui-grid-tree-header-row{font-weight: normal !important;}
        <style>`,
        controller: 'Applicator_1',
            scope: {
                'config': '=',
            },
            link: function (scope, elm, attrs, controller) {
            },
    }
});
