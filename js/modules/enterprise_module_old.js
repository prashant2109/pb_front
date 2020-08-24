"use strict";
var app = angular.module("tas.enterprise",[]);
app.controller("Enterprise",function($http, $scope, $timeout, tasAlert, tasService){
	$scope.Object = Object;
	$scope.config.scope = $scope;
	/******************************************/
	$scope.enterprise_data = function(){
		var file = "Datamodel_" + $scope.config.parent_scope.slcted_indus_dic["project_name"] + ".xlsx";
		var data = {c_flag: $scope.config.cmd_dict['getEtp'], name: file};
		var post_data = {cmd_id: 22, data: [data], path: $scope.config.host, method: 'WEB'};
		$scope.config.parent_scope.ps = true;
		tasService.ajax_request(post_data, 'POST', $scope.cb_enterprise_data); 
	}
	/******************************************/
	$scope.cb_enterprise_data = function(res){
		$scope.config.parent_scope.ps = false;
		if(res["message"] == "done"){
			var data = res["data"];
			try{
				myDiagram.div = null;
				myOverview.div = null;	
			}
			catch(err){
			}
			var id = "myDiagramDiv";
			var ovid = "myOverviewDiv";
			window.init(id, ovid, data);
		}else{
			tasAlert.show(res['message'], 'error', 1000);
		}
	}
	/******************************************/
});
app.directive('enterpriseData',function(){
	return {
		restrict: 'AE',
		template:`<div class="enps">
				<div id="myDiagramDiv"></div>
				<div id="myOverviewDiv"></div>	
			</div>

			<style>
				enterprise-data{width: 100%;height: 100%;overflow: hidden;}
				.enps{width: 100%;height: 100%;position: relative;}
				.enps #myDiagramDiv { width: 100%; height: 100%; }
				.enps #myOverviewDiv { position: absolute; width: 200px; height: 100px; background: #fff; top: 5px; left: 10px; z-index: 5; border: 1px solid rgb(221, 221, 221); -webkit-tap-highlight-color: rgba(255, 255, 255, 0); cursor: auto; }
			<style>`,
		controller: 'Enterprise',
		scope: {
			'config': '='
		},
		link: function (scope, elm, attrs, controller) {

		},
	}
});
