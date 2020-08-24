var app = angular.module("tas.source_setup", []);
app.controller("source_setup", function($scope, $rootScope, $http, $timeout, $location, $filter, $sce, $compile, uiGridTreeBaseService,tasService,tasAlert){
	$scope.Object = Object;
   	$scope.config.scope = $scope;
	window.source_scope = $scope;
	$scope.enable_source_flg = false;
	$scope.active_tabs_view = '1';
	$scope.enable_source_data = function(){
		$scope.enable_source_flg = !$scope.enable_source_flg;
		
	}
	$scope.switch_source_tabs = function(view){
		$scope.active_tabs_view = view;
	}
	/**********************************************/
	$scope.source_cb = function(res){
		
		if(res['message']=='done'){
			$scope.config.parent_scope.ips = false;
			$scope.enable_source_flg = false;
			$scope.link = "";
			$scope.config.parent_scope.comp_click_func($scope.config.parent_scope.slcted_comp_dic)
		}
		else{
				tasAlert.show(res['message'], 'warning', 1000);	
		}
	}	
	/***********************************************/
	$scope.url_save = function(){
		var project_id = $scope.config.parent_scope.slcted_comp_dic['monitor_id'];
		if($scope.active_tabs_view == '1'){

			if($scope.link){
				var post_data = {'cmd_id': 6,'link': $scope.link,'project_id': project_id,'user_id': 21};
				tasService.ajax_request(post_data, 'POST', $scope.source_cb);
			}
			else{
				tasAlert.show('Please enter url', 'warning', 1000);	
			}
		}
		else{
			if($scope.username && $scope.password && $scope.filepath ){
				var post_data = {'cmd_id': 6, 'username': $scope.username,'password':$scope.password,'filepath': $scope.filepath,'project_id': project_id};
				$scope.config.parent_scope.ips = true;
                                tasService.ajax_request(post_data, 'POST', $scope.source_cb);
			}
			else{
				tasAlert.show('Please enter empty fields', 'warning', 1000);
			}	
		}
	}

})
app.directive('tasSource', function(){
    return {
            template :`<div class="src_bk_cover" ng-click="enable_source_data();" ng-if="enable_source_flg"></div>
	<div class="source_div_cvr" ng-class="{'show_cvr_div':enable_source_flg}">
	 	<button class="btn btn-xs btn-info source_icn" ng-class="{'icn_css':enable_source_flg}" title="Source / FTP Setup" ng-click="enable_source_data();" id="" ><i class="fa fa-cog" aria-hidden="true"></i></button>
		 <div class="source_div">
			 <div style="float: left; height: 100%; width: 100%; padding: 6px; box-shadow: 0 0 10px 0 rgba(0,0,0,.2); ">
                            <div style="float:left;height:30px;width:100%;background:#f1f1f1;">
                                <ul class="tabs">
                                    <li class="tab-link" ng-click="switch_source_tabs('1')" data-tab="URL" ng-class="{'current':active_tabs_view=='1'}">URL</li>
                                    <li class="tab-link" ng-click="switch_source_tabs('2')" data-tab="FTP"  ng-class="{'current':active_tabs_view=='2'}">FTP</li>
                                </ul>
                            </div>
			    <div id="document_source">
			   	<form class="form" ng-show="active_tabs_view=='1'"> 
					<div class="form-group">
                                		<label for="lang"> <b>URL </b>  </label> </br>
                                		<input type="text" class="form-control" placeholder="Link" ng-model="link"> 
                            			
                            		</div>
				</form>
			   	<form class="form" ng-show="active_tabs_view=='2'"> 
					<div class="form-group">
                                		<label for="lang"> <b>UserName </b>  </label> </br>
                                		<input  class="form-control" placeholder="UserName"> 
                            			
                            		</div>
					<div class="form-group">
                                		<label for="lang"> <b>Password </b>  </label> </br>
                                		<input  class="form-control" placeholder="Password"> 
                            			
                            		</div>
					<div class="form-group">
                                		<label for="lang"> <b>FilePath </b>  </label> </br>
                                		<input type="text" class="form-control" placeholder="Filepath" ng-model="filepath"> 
                            			
                            		</div>
				</form>
				<a class="btn btn-block download-button" ng-click="url_save()">Submit</a>
			</div>
                        </div>
		 </div>
	</div>
	<style>
		.source_div_cvr { position: absolute; right: -404px; top: 0px; height: calc(100% - 40px); width: 404px; transition: .5s ease-in-out; }
		.source_div_cvr #document_source{ float:left; width: 100%; margin-top: 10px; padding: 5px 10px; }
		.source_div_cvr #document_source form input{ background:#f9f9f9; font-size: 13px; height: auto; }
		.source_div_cvr #document_source form input:focus{ background: #f9f9f9; box-shadow: none; }
		.source_div_cvr .source_icn{ height: 27px; margin: 2px; padding: 2px 8px; width: 30px; z-index: 999; margin-top: 429px; margin-left: -67px; transition: .3s ease-in-out; }
		.show_cvr_div{ right:0px !important; z-index: 999 !important; }
		.icn_css{ margin-left:-30px !important; }
		.source_div{ position:relative; height:100%; width:100%; overflow:hidden; padding: 0px 2px; top: -457px; background: #fff !important; }
		.source_div_cvr{ z-index: 1; box-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12); }
		.source_div .tabs { margin: 0px; padding: 0px; list-style: none; height: 100%; width:100%; }
		.source_div ul.tabs li { background: none; color: #2E516B; display: inline-block; padding: 6px 15px; cursor: pointer; height: 100%; width:49.5%; text-align:center; border-radius: 3px; }
		.source_div ul.tabs li.current{ background: #95b4ce !important; color: #fff; font-weight: 500; }
		.source_div .form-check-inline{ display:block; }
		.meta_data_div .meta_data_input{ margin-bottom:0px !important; padding:2px !important; font-size:14px !important; line-height:8px !important; height: 30px; }
		.meta_data_div table td{ padding:3px !important; }
		.meta_data_div{ width:100%; max-height:320px; overflow: auto; }
		.add_meta_div{ height: 20px; padding: 2px; }
		.source_div_cvr .form-check-label{ width:25%; padding-bottom:5px; }
		.source_div_cvr label{ width:100%; }
		.download-button { background: #dae8f1 !important; color: #2E516B !important; font-weight: 600; }
		.src_bk_cover{position: absolute;width: 100%; top: 0px; background-color: rgba(0, 0, 0, 0.3); height: 100% !important;z-index: 100;}	
	</style>
			`,
	    controller: 'source_setup',
            scope     : {
                        'config':'='
            },
            link: function (scope, elm, attrs, controller) {
        
            }
	}
});

