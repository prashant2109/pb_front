"use strict";
var app = angular.module("tas.schedule_module", []);
app.controller("schedule",function($http,$scope,$timeout,tasAlert,tasService){
	$scope.config.scope = $scope;
	/****************************************/
	$scope.minutes = ["Every Minute","Even Minutes","Odd Minutes","Every 5 Minutes","Every 15 Minutes","Every 30 Minutes"];
	$scope.hours = ["Every Hour", "Even Hours", "Odd Hours" ,"Every 6 Hours", "Every 12 Hours"];
	$scope.days = ["Every Day", "Even Days", "Odd Days", "Every 5 Days", "Every 10 Days", "Every 15 Days"];
	$scope.weekdays = ["Every Weekday", "Monday-Friday", "Weekend Days"];
	$scope.months = ["Every Month", "Even Months", "Odd Months", "Every 4 Months", "Every Half Year"]
	/****************************************/
	/*******************************/
	$scope.mins = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
	/*******************************/
	$scope.hrs = ['midnight','1am','2am','3am','4am','5am','6am','7am','8am','9am','10am','11am','Noon','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm'];
	$scope.tbhrs =[1,2,3,4,5,6,7,8,9,10,11,12]
	$scope.dy = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]
	/*******************************/
	$scope.wkdy = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
	$scope.mnt = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
	/*******************************/
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var date = new Date();
	$scope.date = ""+$scope.wkdy[date.getDay()]+", "+ date.getDay()+ " " +months[date.getMonth()]+", "+date.getFullYear();
	/*******************************/
	$scope.demo_data = [{"Project_id":1,"sc_time":{"1":"1 pm ","5":"5 am"}},{"Project_id":2,"sc_time":{"3":"3 pm","8":"8 pm"}},{"Project_id":3,"sc_time":{"1":"1 am","4":"4 am","9":"9 am","12":"12 pm","6":"6 pm"}}]
	
	/*******************************/
	$scope.current_min = $scope.minutes[0];
	$scope.current_hrs = $scope.hours[0];
	$scope.current_days = $scope.days[0];
	$scope.current_week = $scope.weekdays[0];
	$scope.current_month = $scope.months[0];
	/*******************************/
	$scope.min_formula = {'Every Minute':'*','Even Minutes':'*/2','Odd Minutes':'1-59/2','Every 5 Minutes':'*/5','Every 15 Minutes':'*/15','Every 30 Minutes':'*/30'};
	$scope.hrs_formula = {'Every Hour':'*','Even Hours':'*/2','Odd Hours':'1-23/2','Every 6 Hours':'*/6','Every 12 Hours':'*/12'};
	$scope.day_formula ={'Every Day':'*','Even Days':'*/2','Odd Days':'1-31/2','Every 5 Days':'*/5','Every 10 Days':'*/10','Every 15 Days':'*/15'};
	$scope.weekdays_formula = {'Every Weekday':'*','Monday-Friday':'1-5','Weekend Days':'0,6'}
	$scope.month_formula ={'Every Month':'*','Even Months':'*/2','Odd Months':'1-11/2','Every 4 Months':'*/4','Every Half Year':'*/6'}	
	/*******************************/
	$scope.min_formula['select'] = $scope.mins[0];
	$scope.hrs_formula['select'] = 0;
	$scope.day_formula['select'] = $scope.dy[0];
	$scope.weekdays_formula['select'] = 0;
	$scope.month_formula['select'] = 1;
	/*******************************/
	$scope.redio_select = function(opt,val){
		if(opt =="mint"){
			$scope.current_min = val;
		}
		else if(opt == "hrs"){
			$scope.current_hrs = val
		}
		else if(opt == "days"){
			$scope.current_days = val
		}
		else if(opt == "week"){
			$scope.current_week = val;
		}
		else if(opt == "month"){
			$scope.current_month = val;
		}
	}
	/*******************************/
	$scope.savecron_cb = function(res){
		if(res['message']=='done'){
			$scope.config.parent_scope.ips = false;
		}
		else{
			tasAlert.show(res['message'], 'warning', 1000);	
		}
	}
	/*******************************/
	$scope.cronsubmit = function(){
		var slct_link = $scope.config.parent_scope.slct_ind_link['link']; 
		var project_id = $scope.config.parent_scope.slcted_comp_dic['monitor_id'];
		if($scope.start_date && $scope.end_date){
			var getcrontab = "" + $scope.min_formula[$scope.current_min]+" "+ $scope.hrs_formula[$scope.current_hrs] +" "+  $scope.day_formula[$scope.current_days]+" "+ $scope.weekdays_formula[$scope.current_week] +" "+ $scope. month_formula[$scope.current_month]
			var crontab = getcrontab || "* * * * *";	
			var post_data ={"cmd_id":13,"user_id": 21,"project_id" : project_id,"1": "5","2": $scope.start_date,"3": $scope.end_date,"4": "N","5": 1,"8": "N","9": crontab,'title': encodeURIComponent(slct_link)}
			$scope.config.parent_scope.ips = true;
                        tasService.ajax_request(post_data, 'POST', $scope.savecron_cb);	
		}
		else{
			tasAlert.show("Fill the Empty Field", 'error', 1000);
		}
			
	}
});
app.directive('schedule', function(){
	return {
		restrict: 'AE',
		template:`<div class="form_top">
				<div class="tbl_left">
					<div class="cln_div">
						<div id="calendar"></div>
					</div>
				</div>
				<div class="se_data">
					<div class="stend">
						<div class="start_date form-inline d-inline-flex">
							<label class="mr-2">Start Time</label>
								<div class="input-group date pr-3" id="start_time">
									<input type="text" class="form-control in-height datepickerbutton" style="height: 30px;" ng-model="start_date">
									<div class="input-group-append input-group-addon datepickerbutton">
										<span class="input-group-text">
										<i class="fa fa fa-calendar-check-o"></i>
										</span>
									</div>
								  </div >

							<label class="mr-2">End Time</label>
								<div class="input-group date" id="end_time">
									<input type="text" class="form-control in-height input-group-addon datepickerbutton" style="height: 30px;" ng-model="end_date">
									<div class="input-group-addon input-group-append datepickerbutton">
										<span class="input-group-text">
										<i class="fa fa fa-calendar-check-o"></i>
										</span>
									</div>
								</div>
							</div>
							<div class="pull-right d-inline-flex">
								<button class="btn btn-sm smbtn m-0" ng-click="cronsubmit()">Submit</button>
							</div>
					</div> 
					<div class="mn_div">
						<div class="fm_head">
							Minutes
						</div>
						<div class="fm_body">
							<div class="row m-0">
								<div class="col-8 p-0">
									<div  ng-repeat="x in  minutes track by $index" class="lis">
										<div class="radio" ng-click="redio_select('mint',x)" ng-class="{'rad_act': current_min == x}"></div>{{x}}
									</div>
								</div>
								<div class="col-4 p-0">
										<div class="radio mt-2" ng-click="redio_select('mint','select')" ng-class="{'rad_act': current_min == 'select'}" style="float: left"></div>
							<label class="mt-2 sldr"><select ng-model="min_formula['select']" ng-options="x for x in mins" class="w-100" size="10"></select></label>
								</div>
							</div>		
						</div>
					</div>
					<div class="mn_div">
						<div class="fm_head">
							Hours
						</div>
						<div class="fm_body">
							<div class="row m-0">
								<div class="col-7 p-0">
									<div  ng-repeat="x in hours track by $index" class="lis">
										<div class="radio" ng-click="redio_select('hrs',x)" ng-class="{'rad_act': current_hrs == x}"></div>{{x}}
									
									</div>
								</div>
								<div class="col-5 p-0">
									<div class="radio mt-2" ng-click="redio_select('hrs','select')" ng-class="{'rad_act': current_hrs == 'select'}" style="float: left"></div>
									<label class="mt-2 sldr"><select ng-model="hrs_formula['select']" ng-options="+(ind) as x for (ind,x) in hrs " class="w-100" size="10"></select></label>
								</div>
							</div>		
						</div>
					</div>
					<div class="mn_div">
						<div class="fm_head">
							Days
						</div>
						<div class="fm_body">
							<div class="row m-0">
								<div class="col-8 p-0">
									<div  ng-repeat="x in days track by $index" class="lis" >
										<div class="radio" ng-click="redio_select('days',x)" ng-class="{'rad_act': current_days == x}"></div>{{x}}
</div>
								</div>
								<div class="col-4 p-0">
									<div class="radio mt-2" ng-click="redio_select('days','select')" ng-class="{'rad_act': current_days == 'select'}" style="float: left"></div>
									<label class="mt-2 sldr"><select ng-model="day_formula['select']" ng-options="x for x in dy" class="w-100" size="10"></select></label>
								</div>
							</div>		
						</div>
					</div>
					<div class="mn_div">
						<div class="fm_head">
							Weekday
						</div>
						<div class="fm_body">
							<div class="row m-0">
								<div class="col-8 p-0 ">
									<div  ng-repeat="x in  weekdays track by $index" class="lis">
										<div class="radio" ng-click="redio_select('week',x)" ng-class="{'rad_act': current_week == x}"></div>{{x}}
									</div>
								</div>
								<div class="col-4 p-0">
									<div class="radio mt-2" ng-click="redio_select('week','select')" ng-class="{'rad_act': current_week == 'select'}" style="float: left"></div>
									<label class="mt-2 sldr"><select ng-model="weekdays_formula['select']" ng-options="+(ind) as x for (ind,x) in wkdy" class="w-100 md_selection" size="8"></select></label>
								</div>
							</div>		
						</div>
					</div>
					<div class="mn_div">
						<div class="fm_head">
							Months	
						</div>
						<div class="fm_body">
							<div class="row m-0">
								<div class="col-8 p-0">
									<div  ng-repeat="x in months track by $index" class="lis">
										<div class="radio" ng-click="redio_select('month',x)" ng-class="{'rad_act': current_month == x}"></div>{{x}}

							</div>
								</div>
								<div class="col-4 p-0">
									<div class="radio mt-2" ng-click="redio_select('month','select')" ng-class="{'rad_act': current_month == 'select'}" style="float: left"></div>
									<label class="mt-2 sldr"><select ng-model="month_formula['select']" ng-options="+(ind)+1 as x for (ind,x) in mnt" class="w-100 md_selection" size="10"></select></label>
								</div>
							</div>		
						</div>
					</div>
					
						<!-- -->
				</div>
			</div>
			<style>
				.in-height{height: auto;font-size: 13px;}
				.in-height:focus{box-shadow: none;}
				.form_top .se_data{width:100%;height:calc(50% - 10px);float:left;background:#fff;box-shadow:0 .4rem 2rem rgba(4,9,20,0.03),0 .9rem .40625rem rgba(4,9,20,0.03),0 .2rem .5rem rgba(4,9,20,0.05),0 .125rem .1em rgba(4,9,20,0.03);border-width:0;padding:7px 5px 0;}
.se_data form label{font-weight:700;padding-top:5px;text-align:right}
.smbtn{background:#33b5e5;color:#fff;font-weight:600;padding:6px 10px!important}
.form_top .tbl_left{float:left;width:100%;height:calc(50% - 0px);margin-bottom:10px;background:#e9ecf4;overflow:hidden;overflow-y:auto;position:relative;box-shadow:0 .4rem 2rem rgba(4,9,20,0.03),0 .9rem .40625rem rgba(4,9,20,0.03),0 .2rem .5rem rgba(4,9,20,0.05),0 .125rem .1em rgba(4,9,20,0.03);border-width:0}
.se_data select.in-height{padding:.375rem .5rem .375rem .1rem}
.cln_div{width:100%;height:100%;margin:auto;background:#fff;padding:0 15px 10px}
.cln_div .cln_header{width:100%;height:40px}
.cln_header .cln_lf_hd,.cln_header .cln_rht_hd{width:50%;float:left;height:100%}
.cln_header .cln_lf_hd{font-size:18px}
.cln_div .cln_data{width:100%;height:calc(100% - 40px)}
.cln_div .cln_data table th,.cln_div .cln_data table td{padding:.5rem;text-align:center}
.cln_data .has_data{background:#dae8f1;color:#000;font-weight:700;text-align:center;border-radius:4px}
.fm_head{width:100%;height:27px;font-weight:700;background:#dae8f1;color:#343a40;text-align:center;line-height:27px}
select option{padding:1px 8px;color:#414f61}
.fm_body{min-height:190px}
.fm_body_se{border:2px solid #ddd;border-top:none}
.mn_div{width:calc(100% / 5 - 10px);margin:0 5px 8px;float:left;box-shadow: 2px 5px 10px 0px rgba(0,0,0,.16), 0px 2px 2px 0 rgba(0,0,0,.12);}
.md_selection option{padding:1px 4px}
.sch_slt{width:300px;float:right}
.lis{color:#343a40;padding:6px 7px;padding-right:0!important}
.radio{width:19px;min-height:auto;position:relative;display:inline-block}
.radio.rad_act:before{border-color:#55a2d4!important}
.radio:before{border:2px solid #e9eaec;width:15px;height:15px;content:"";display:inline-block;margin-right:10px;border-radius:50%;vertical-align:bottom;background:#fff;color:transparent;cursor:pointer;transition:all .2s ease-in-out}
.radio.rad_act:after{background:#55a2d4!important}
.radio:after{width:7px;height:7px;position:absolute;top:50%;bottom:50%;margin:auto;left:4px;content:"";display:inline-block;margin-right:10px;border-radius:50%;vertical-align:bottom;background:#fff;color:transparent;cursor:pointer;transition:all .2s ease-in-out}
.stend{width:100%;float:left;padding:0 10px;margin-bottom:7px}
.form_top{width:100%;height:calc(100% - 35px)}
.start_date label{font-weight:700}
.sldr{max-width:calc(100% - 20px)}
#calendar{width:90%;margin:auto}
.fc-basic-view .fc-body .fc-row{height:50px!important}
#calendar .fc-toolbar.fc-header-toolbar{padding-top:9px;margin-bottom:5px}
			</style>`,
		controller: 'schedule',
		scope: {
			'config': '='
		},
		link: function (scope, elm, attrs, controller) {
			var sdtp = $("#start_time").datetimepicker();
			sdtp.on("dp.change", function (e){
	                        var start_date = moment(e.date).format("YYYY-MM-DD HH:mm:ss")
				scope.start_date = start_date;
	                        scope.$apply();
	                });

			var edtp = $("#end_time").datetimepicker();
			edtp.on("dp.change", function (e){
	                        var end_date = moment(e.date).format("YYYY-MM-DD HH:mm:ss")
				scope.end_date = end_date;
	                        scope.$apply();
	                });

			$('#calendar').fullCalendar({
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay,listWeek'
				},
				navLinks: true,
				eventLimit: true,
				height:'parent',
    			});
			
		},
	}
			
})
