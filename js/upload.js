var app = angular.module("tas.upload", []);

app.controller("UploadController", function($scope, $rootScope, $http, $timeout, $location, $filter, $sce, $compile){
	$scope.Object = Object;
   	$scope.config.scope = $scope;
	window.upload_scope = $scope;
	$scope.enable_upload_flg = false;
	$scope.language_list = { en: "English", de: "German", es: "Spanish", fr: "French", ja: "Japanese", zh: "Chinese" }
	$scope.page_range_radio = '0';
	$scope.active_tabs_view = '1';
	$scope.selected_upload_language = 'en';
        $scope.tabsmap = {'1':'pdf','2':'html'};
	$scope.enable_upload_data = function(){
		$scope.enable_upload_flg = !$scope.enable_upload_flg;
		$scope.meta_data = [['FYE','12'],['Year','2019'],['Period Type','Q2']];
		document_upload.pdf_input.value = '';
	}
	$scope.get_stages_list = function(cb){
		var project_id = $scope.config.parent_scope.slcted_indus_dic['project_id'];
                var db_name = $scope.config.parent_scope.slcted_indus_dic['db_name'];
                var ws_id =  $scope.config.parent_scope.slcted_indus_dic['ws_id'] || 1;
		var crid = $scope.config.parent_scope.slcted_comp_dic['crid'];
		var vret_str = {'cmd_id':16,'project_id':project_id,'type':($scope.tabsmap[$scope.active_tabs_view]||'')};
                $scope.config.parent_scope.tasService.ajax_request(vret_str,'POST',cb);
	}
	$scope.switch_upload_tabs = function(view){
		$scope.active_tabs_view = view;
	}
        $scope.page_range_click = function(rn){
             if(rn == 0){
                $('#f_page').val('');
                $('#f_page').prop('disabled',true);
             }
             else if(rn == 1){
                $('#f_page').prop('disabled',false);
                $('#f_page').focus();
             }
        }
	$scope.validate_pages = function(event){
            var regex = new RegExp("^[0-9-, ]");
            var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
            if(!regex.test(key)){
                event.preventDefault();
                return false;
            }
        }
	
	$scope.add_new_meta_data = function(){
		var prev_exists = false;
		$scope.meta_data.forEach(function(ech){
			if(ech[0] == '')
				prev_exists = true;
		});
		if(prev_exists)
			return;
		$scope.meta_data.push(['','',true]);
	}
	$scope.cb_success_upload = function(response){
		$scope.get_stages_list($scope.cb_stages_lst);
	}
	$scope.cb_stages_lst = function(response){
			var stg_lst = response['data'] || [];
			var f_name = document_upload.pdf_input.value.split('\\').slice(-1)[0];
			//var stg_lst = [ "1", "2", "3", "4", "5", "6", "7", "8", "9" ] //stages list;
			var lang = $scope.selected_upload_language;
			var ocr = 'N'; //ocr /pdf
			var pdftype = '1' //Imgae mode
			var ocr_chk = /*$('#opt_ocr_chk_upload').find(":selected").val()*/ 'N';
			var lc = '0'; //loacal-0 cloud-1
			var pd = '1'; //production-1,development-0 debug
			var page_range_type = $scope.page_range_radio;
			var map_type = {'0':'All','1':'pages'};
			var page_range = '0';
			if(page_range_type == '1'){
				page_range = $scope.f_page;
				if(!page_range)
					page_range = '0';
			}
			var meta_data = {'Company':$scope.config.parent_scope.slcted_comp_dic['company_id']};
			$scope.meta_data.forEach(function(ech){
				if(ech[0]){
					meta_data[ech[0]] = ech[1];
				}
			});
			if('Period Type' in meta_data){
				meta_data['periodtype']	= meta_data['Period Type']
			}
			var file_name = f_name;
			var project_id = $scope.config.parent_scope.slcted_indus_dic['project_id'];
			var db_name = $scope.config.parent_scope.slcted_indus_dic['db_name'];
			var ws_id =  $scope.config.parent_scope.slcted_indus_dic['ws_id'] || 1;
			var crid = $scope.config.parent_scope.slcted_comp_dic['crid'];
			meta_data['rc_id'] = project_id;	
			if(project_id == 'FE'){
                                stg_lst  = ["1","6","7","8","9","11"];
                                project_id = "8";
                                db_name = 'AECN_CS_IFRS';
                    	}
			var p_type = 'n'
			var stage_lst = stg_lst.join('~')
			var vret_str = {'oper_flag':97030, 'file_name':file_name, 'stage_lst':stage_lst, 'project_id':project_id, 'db_name':db_name, 'ws_id':ws_id, 'meta_data':meta_data, 'lang':lang, 'ocr':ocr, 'pdftype':pdftype, 'selected_pages':page_range.toString(), 'ocr_chk':ocr_chk, 'lc':lc, 'pd':pd,'i_company_id':Number(crid),'cmd_id':5};
			//var vret_str = {'oper_flag':97026, 'file_name':file_name, 'stage_lst':stage_lst, 'project_id':project_id, 'db_name':db_name, 'p_type':p_type, 'ws_id':ws_id, 'meta_data':meta_data, 'lang':lang, 'ocr':ocr, 'pdftype':pdftype, 'selected_pages':page_range.toString(), 'ocr_chk':ocr_chk, 'lc':lc, 'pd':pd,'i_company_id':Number(crid),'cmd_id':5};
			//console.log(vret_str)
			/*var xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                var done = this.responseText
                                if(done == 'Done'){
					$scope.cb_upload('Done');
                                } else{
                                        alert('Error')
                                }
                            }
                        }
                        xhr.open('POST' , 'http://172.16.20.10:5008/tree_data' , true);
                        xhr.send(JSON.stringify(vret_str));*/
			$scope.config.parent_scope.ps = true;
                        $scope.config.parent_scope.tasService.ajax_request(vret_str,'POST',$scope.cb_upload);
	}
	$scope.upload_file_data = function(){
		if($scope.active_tabs_view == '1'){
			if(!document_upload.pdf_input.files.length){
				alert('No file is Selected');
				return;
			}
			var same_exists = false;
			var meta_data = {'Company':$scope.config.parent_scope.slcted_comp_dic['company_id'],'rc_id':$scope.config.parent_scope.slcted_indus_dic['project_id']};
                        $scope.meta_data.forEach(function(ech){
                                if(ech[0]){
					if(meta_data.hasOwnProperty(ech[0])){
						same_exists = true;
					}
                                        meta_data[ech[0]] = ech[1];
                                }
                        });
			if('Period Type' in meta_data){
				meta_data['periodtype']	= meta_data['Period Type']
			}
			if(same_exists){
				alert('Same Key Exists in Meta Data');
                                return;
			}
			var stream = document_upload.pdf_input.files[0];
			var f_name = document_upload.pdf_input.value.split('\\').slice(-1)[0];
			var formData = new FormData();
			var project_id = $scope.config.parent_scope.slcted_indus_dic['project_id'];
                    	var db_name = $scope.config.parent_scope.slcted_indus_dic['db_name'];
                    	var ws_id =  $scope.config.parent_scope.slcted_indus_dic['ws_id'] || 1;
			var id  = project_id.toString() + "$$" + ws_id.toString() + "$$" + f_name   ///upload_file_slt_new
			//var id  = f_name
			formData.append('uploads[]' , stream , id);
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
			    if (this.readyState == 4 && this.status == 200) {
				var done = this.responseText
				if(done == 'Done'){
					$scope.cb_success_upload();
				} else{
                    			alert('Error during uploading')
                		}
			    }
			}
			xhr.open('POST' , 'http://172.16.20.10:5008/upload_file_slt_new' , true);
        		xhr.send(formData);
		}else if($scope.active_tabs_view == '2'){
			$scope.url_process_ag();
		}
        }
	$scope.cb_upload = function(response){
		$scope.config.parent_scope.ps = false;
		console.log(response)
		 var message = response['message']
                var data = response['data']
                var ret = data[1].map(function(x) { return x[0]; });
                var reprocess_str = data[0]
                reprocess_str['oper_flag'] = 97026;
                reprocess_str['cmd_id'] = 19;
                reprocess_str['p_type'] = 'r'
                reprocess_str['doc_lst'] = ret.join('~')
                reprocess_str['doc_type'] = data[2]
                reprocess_str['demo_project_id'] = $scope.config.parent_scope.slcted_indus_dic['project_id']
                if(reprocess_str['file_name']){
                	delete reprocess_str['file_name']
                }
		$scope.config.parent_scope.ps = true;
		$scope.config.parent_scope.tasService.ajax_request(reprocess_str, 'POST',$scope.cb_process_cgi_10);
		var docidlist = ret;
		var project_id = $scope.config.parent_scope.slcted_indus_dic['project_id'];
		var crid = $scope.config.parent_scope.slcted_comp_dic['crid'];
		var db_name = $scope.config.parent_scope.slcted_indus_dic['db_name'];
		var demo_project_id	= project_id
		if(project_id == 'FE'){
                                project_id = "8";
                                db_name = 'AECN_CS_IFRS';
                }
		var vret_str = {'project_id':project_id,'i_company_id':Number(crid),'cmd_id':10,'doclist':docidlist,'db_name':db_name, 'demo_project_id':demo_project_id};
		$scope.config.parent_scope.tasService.ajax_request(vret_str, 'POST',$scope.cb_process_cgi);
	}
	$scope.cb_process_cgi_10 = function(response){
		console.log(response)	
	}	
	$scope.cb_process_cgi = function(response){
		$scope.config.parent_scope.ps = false;
                var message = response['message']
                alert(message);
		$scope.get_docs_lst();
	}
	$scope.get_docs_lst = function(){
		var project_id = $scope.config.parent_scope.slcted_indus_dic['project_id'];
                var crid = $scope.config.parent_scope.slcted_comp_dic['crid'];
                var db_name = $scope.config.parent_scope.slcted_indus_dic['db_name'];
		/*if(project_id == 'FE'){
                                project_id = "8";
                                db_name = 'AECN_CS_IFRS';
                }*/
                var vret_str = {'project_id':project_id,'cmd_id':4,'crid':Number(crid)};
                $scope.config.parent_scope.tasService.ajax_request(vret_str, 'POST',$scope.update_docs_lst);
	}
	$scope.update_docs_lst = function(response){
		if(response['message'] == 'done'){
			var data = response['data'];
			var crid = $scope.config.parent_scope.slcted_comp_dic['crid'];
			var project_id = $scope.config.parent_scope.slcted_indus_dic['project_id'];
			$scope.config.parent_scope.industry_type_list.forEach(function(ech_industry){
				if(ech_industry['project_id'] == project_id){
					var cm_info = ech_industry['info'];
					cm_info.forEach(function(ech_cmp,cmp_cnt){
						$scope.config.parent_scope.slcted_indus_dic['info'][cmp_cnt]['info'] = data;
						if(ech_cmp['crid'] == crid){
							ech_cmp['info'] = data;
							$scope.config.parent_scope.slcted_comp_dic['info'] = data;
						}
					});
				}
			});
			$timeout(function(){
			$scope.config.parent_scope.$apply()
			});
		}
	}
	$scope.cb_error_upload = function(response){
		$scope.config.parent_scope.ps = false;
		alert('Error');
	}
	$scope.url_process_ag = function(){
		//console.log('---')
		if(confirm('Do you want to Process..')){
			$scope.get_stages_list($scope.url_cb_stages_lst);
		}
                else{
                    $scope.input_link  = '';
                    return;
                }
	}
	$scope.url_cb_stages_lst = function(response){
		    var stg_lst = response['data'] || [];		
		    var same_exists = false;
		    var meta_data = {'Company':$scope.config.parent_scope.slcted_comp_dic['company_id']};
                    $scope.meta_data.forEach(function(ech){
                        if(ech[0]){
				if(meta_data.hasOwnProperty(ech[0])){
                                        same_exists = true;
                                }
                                meta_data[ech[0]] = ech[1];
                        }
                    });
			if('Period Type' in meta_data){
				meta_data['periodtype']	= meta_data['Period Type']
			}
		    if(same_exists){
                        alert('Same Key Exists in Meta Data');
                        return;
                    }
		    //var stg_lst = [ "1", "2", "3", "4", "5", "6", "7", "8", "9" ] //stages list;
		    var project_id = $scope.config.parent_scope.slcted_indus_dic['project_id'];
		    var db_name = $scope.config.parent_scope.slcted_indus_dic['db_name'];
		    var ws_id =  $scope.config.parent_scope.slcted_indus_dic['ws_id'] || 1;
		    var crid = $scope.config.parent_scope.slcted_comp_dic['crid'];
		    if(project_id == 'FE'){
				stg_lst  = ["1","6","7","8","9","11"];
				project_id = "8";
		    		meta_data['rc_id'] = project_id;	
		    		meta_data['company_name'] = 	$scope.config.parent_scope.slcted_comp_dic['company_name']
				db_name = 'AECN_CS_IFRS';
		    }
		    var p_type = 'n'
		    var url_name = $scope.input_link || '';
		    var vret_str = {'oper_flag':97030, 'url_name':encodeURIComponent(url_name),'stage_lst':stg_lst.join('~'),'project_id':project_id, 'db_name':db_name, 'ws_id':ws_id, 'meta_data':meta_data,'i_company_id':Number(crid),'cmd_id':5}
		  console.log(vret_str);
		   //return;
		   $scope.config.parent_scope.ps = true;
		   $scope.config.parent_scope.tasService.ajax_request(vret_str, 'POST',$scope.cb_upload);
    	}
})
app.directive('tasUpload', function(){
    return {
            template :`<div class="upload_div_cvr" ng-class="{'show_cvr_div':enable_upload_flg}">
	 	<button class="btn btn-xs btn-info upload_icn" ng-class="{'icn_css':enable_upload_flg}"title="Upload PDF / HTML" ng-click="enable_upload_data();" id="" ><i class="fa fa-upload" aria-hidden="true"></i></button>
		 <div class="upload_div">
			 <div style="float: left; height: 100%; width: 100%; padding: 6px; box-shadow: 0 0 10px 0 rgba(0,0,0,.2); ">
                            <div style="float:left;height:30px;width:100%;background:#d9e4f3;">
                                <ul class="tabs">
                                    <li class="tab-link" ng-click="switch_upload_tabs('1')" data-tab="PDF" ng-class="{'current':active_tabs_view=='1'}">PDF</li>
                                    <li class="tab-link" ng-click="switch_upload_tabs('2')" data-tab="HTML"  ng-class="{'current':active_tabs_view=='2'}">HTML</li>
                                    <!-- li class="tab-link" ng-click="switch_upload_tabs('3')" data-tab="TEXT"  ng-class="{'current':active_tabs_view=='3'}">TEXT</li -->
                                </ul>
                            </div>
			    <form id="document_upload">
					<div class="form-group">
                                		<label for="lang"> <b>Language: </b>  </label> </br>
                                		<select class="form-control" ng-change="change_language(selected_upload_language)" ng-model="selected_upload_language" ng-options="key as value for (key,value) in language_list"> </select>
                            			
                            		</div>
					<div class="form-group" ng-show="active_tabs_view=='1'">					    
						<label for="pdf_input"> <b>PDF File:</b>  </label> <br>
						<input type="file" name="pdf_input" id="pdf_input" class="" accept=".pdf" ng-model="pdf_input" />
					</div>
					<div class="form-group" ng-show="active_tabs_view=='2'">
						<label for="lik"> <b>Link:</b> </label>
						<input type="text" name="link" id="link" placeholder="Enter Pdf link here.." class="form-control" ng-model='input_link'>
					</div>		
					<div class="form-group" ng-show="active_tabs_view=='1'">
						<label> <b>Process Range:</b> </label>
						<div class="form-check-inline">
                                			<label class="form-check-label">
                                    				<input type="radio" class="form-check-input" ng-model="page_range_radio" name="page_range" value="0" ng-click="page_range_click(0)" checked="true">All
                                			</label>
							<label class="form-check-label">
                                    				<input type="radio" class="form-check-input" ng-model="page_range_radio"  name="page_range" value="1" ng-click="page_range_click(1)" >Pages
                                			</label>
							<label> 
								<input type="text" name="f_page" id="f_page" placeholder="Ex: 1,2,3.. or 1-3" class="form-control" ng-model="f_page" ng-keypress="validate_pages($event);"  disabled>
							</label>
                            			</div>
					</div>
					<div class='meta_data_div' ng-class='{"resize_meta_div":active_tabs_view!="1"}'>
						<table class='table'>
							<thead>
								<tr>
									<th class='table_header_new'>Key</th>		
									<th class='table_header_new'>Value
										<span class='float-right add_meta_div' ng-click='add_new_meta_data()' title='Add'>
                                                					<i class="fa fa-plus" aria-hidden="true"></i>
                                        					</span>
									</th>		
								</tr>
							</thead>
							<tbody>
								<tr ng-repeat='ech in meta_data'>
									<td class='td_data_new'><input class="mb-3 form-control form-control-lg meta_data_input" type="text" placeholder="" ng-model='ech[0]' ng-show='ech[2]'>
										<input class="mb-3 form-control form-control-lg meta_data_input" type="text" placeholder="" ng-model='ech[0]' ng-show='!ech[2]' readonly>
									</td>
									<td class='td_data_new'>
										<input class="mb-3 form-control form-control-lg meta_data_input" type="text" placeholder="" ng-model='ech[1]'>
									</td>
								</tr>		
							</tbody>
						</table>
					</div>
					<a class="btn btn-block btn-success" id="download-button" name="download-button" ng-click="upload_file_data()"> Upload  </a>
				</form>
                        </div>
		 </div>
	    </div>
	    <style>
		#document_upload {float: left;height: calc(100% - 35px);width: 100%;}
		.meta_data_div{width:100%;height:calc(67% - 100px);overflow: auto;}
		.meta_data_div th {position: sticky;top:0px;background:#fff;}
		#download-button {background: #7ac4aa !important;}
		#document_upload label {padding-top:7px;padding-left:10px;}
		#document_upload .form-group select ,#document_upload .form-group input{padding-top:5px;padding-left:10px; line-height: 14px !important;font-size: 13px;height: auto;margin-left: 2px;}
		#document_upload th {color: #4187b7 !important;padding: 8px 15px !important;border-top: 1px solid #f2f2f2;border-right: 1px solid #a4a0a0 !important;}
		#document_upload .td_data_new input {padding: 3px 12px !important;}
		#document_upload .td_data_new:nth-child(1) input {background: #ebf0f4 !important;  border: 1px solid #d9e4e8;color: #5d869d;}
		#document_upload .td_data_new:nth-child(2) input {background: #fff !important;  border: 1px solid #d9e4e8;color: #355b71;}
		.form-control:disabled, .form-control[readonly] {background-color: #f7f7f7;opacity: 1;border: 1px solid #f7f7f7;color: #fffafa;}
		.form-control:disabled::placeholder {opacity: 1;color: #cad0d7;}
		.upload_div_cvr {z-index: 5 !important;box-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12);}
		.checkbox {padding: 3px 0;min-height: auto;position: relative;width: 22px;}
		.checkbox input[type=checkbox] {margin: 0;display: none;width: 22px;}
		.checkbox input[type=checkbox]+.cr {padding-left: 0;margin-bottom: 0px;}
		.checkbox .cr {cursor: pointer;}
		.checkbox input[type=checkbox]+.cr:before {content: "\\e83f";width: 22px;height: 22px;display: inline-block;/*margin-right: 10px;*/border: 2px solid #e9eaec;border-radius: 3px;font-size: 15px;font-family: feather;font-weight: 400;line-height: 12px;vertical-align: bottom;text-align: center;background: #fff;color: transparent;cursor: pointer;transition: all .2s ease-in-out;position: absolute;left: 0px;top: 3px;z-index: 1;}
		.checkbox.checkbox-fill input[type=checkbox]+.cr:before {opacity: 0;content: "\\e840";font-size: 15px;background: 0 0;}
		.checkbox.checkbox-fill.checkbox-info input[type=checkbox]:checked+.cr:before {background: 0 0;color: #0288d1;border-color: transparent;}
		.checkbox.checkbox-info input[type=checkbox]:checked+.cr:before {background: #0288d1;border-color: #0288d1;color: #fff;}
		.checkbox.checkbox-fill input[type=checkbox]:checked+.cr:before {opacity: 1;background: 0 0;color: #1dd5d2;border-color: transparent;}
		.checkbox.checkbox-fill input[type=checkbox]:checked+.cr:after {opacity: 0;}
		.checkbox.checkbox-fill input[type=checkbox]+.cr:after {content: "";width: 15.5px;height: 16.5px;display: inline-block;margin-right: 10px;border: 2px solid #e9eaec;border-radius: 2px;vertical-align: bottom;text-align: center;background: 0 0;cursor: pointer;transition: all .2s ease-in-out;position: absolute;top: 3px;left: 3px;z-index: 1;}
		.mtr_card .mtr_card__header .mtr_card__img {line-height: 35px;padding-right: 10px;color: #3F51B5;float: right;cursor: pointer;}
		.btn-sx{margin: 0;padding: 2px 5px;margin-top: -2px;background: #33b5e5;border-radius: 3px;margin-right: 10px;}
		.mtr_card .mtr_card__header .mtr_card__all {line-height: 35px;padding-left: 10px;float: right;margin-right: 20px;}
		.upload_div_cvr {position: absolute;right: -404px;top: 0px;height: calc(100% - 40px);width: 404px;transition: .3s ease-in-out;}
		.upload_div_cvr .upload_icn{height: 27px;margin: 2px;padding: 2px 8px;width: 30px;margin-top: 25px;margin-left: -67px;}
		.show_cvr_div{right:0px !important;}
		.icn_css{margin-left:-30px !important;}
		.upload_div{position:relative;height:100%;width:100%;overflow:hidden;padding: 0px 2px;top: -53px;background: #fff !important;}
		.upload_div .tabs {margin: 0px;padding: 0px;list-style: none;height: 100%;width:100%;}
		.upload_div ul.tabs li {background: none;color: #2E516B;display: inline-block;padding: 6px 15px;cursor: pointer;height: 100%;width:49%;text-align:center;}
		.upload_div ul.tabs li.current{ background: #ADD8E6 !important;color: #2E516B;}
		.upload_div .form-check-inline{display:block;}
		.meta_data_div .meta_data_input{margin-bottom:0px !important;padding:2px !important;font-size:14px !important;line-height:8px !important;height: 30px;}
		.meta_data_div table td{padding:3px !important;}
		.meta_data_div{width:100%;overflow: auto;}
		.add_meta_div{height: 20px;padding: 2px;}
		.upload_div_cvr .form-check-label{width:25%;padding-bottom:5px;}
		.upload_div_cvr label{width:100%;}
		/*.resize_meta_div{max-height:calc(100% - 200px) !important;}*/	
	    </style>`,
	    controller: 'UploadController',
            scope     : {
                        'config':'='
            },
            link: function (scope, elm, attrs, controller) {
        
            }
	}
});
