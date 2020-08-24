let deal_id = sessionStorage['toc_company_id'];
var project_id = sessionStorage['project_id'] || '';
var company_name = sessionStorage['company_name']|| '';
var model_number = sessionStorage['model_number'] || '';
var user = sessionStorage['user_id'] || '';
var industry_type = sessionStorage["industry_type"] || '';

app.service('tasService', function($http, tasAlert){
    this.ajax_request = function(post_data, method, callback_success, callback_error){
	var default_data = {'deal_id':deal_id, 'company_name': company_name, 'project_id': project_id, 'model_number': model_number, 'industry_type': encodeURIComponent(industry_type), 'user':user}
	post_data = Object.assign(default_data, post_data);
        var sorted_post_data = Object.keys(post_data).sort().reduce(function (acc, key) {
                        acc[key] = post_data[key];
                        return acc;
                         }, {});
        console.log('CGI', JSON.stringify(sorted_post_data));
        data = 'full_data='+JSON.stringify(sorted_post_data);
        var url = '/post_method';
        if(!method){
            method    = 'POST';
        }
        if(method=='GET'){
            url ='/get_method';
        }
        $http({
            url: url,
            method: method,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        }).then(function(response){
            var rdata = response.data;
	    if(rdata.length == 0){
		console.log('CGI NOT PRESENT');
		tasAlert.show('ERROR: '+ post_data['cmd_id'] + ' CGI NOT PRESENT.', 'error', 2000);
		callback_success(eval(rdata));
	        return;	
	    }
	    if(!(Array.isArray(rdata))){
                tasAlert.show('TASERROR in CGI '+ post_data['cmd_id'] + ' (Not in JSON format).', 'error', 2000);
                callback_success(eval(rdata));
                return;
            }else if('TASERROR' in rdata[0]){
                console.log('ERROR HERE', rdata[0]['TASERROR']);
                if(rdata[0]['TASERROR'])
                    console.log('Error - ', JSON.stringify(rdata[0]['TASERROR'], null, '\t'));
		    tasAlert.show('TASERROR in CGI '+ post_data['cmd_id'], 'error', 2000);
            }
            callback_success(eval(rdata[0]));
        }, function(error){
	    tasAlert.show('TASERROR in CGI '+ post_data['cmd_id']+' - '+ error, 'error', 2000);
	    var err_dic = {'message': 'error'};
            callback_success(err_dic);
	    return;
        });
    }

    this.redis_request = function(post_data, method, callback_success, callback_error){
        var default_data = {'deal_id':deal_id, 'company_name': company_name, 'project_id': project_id, 'model_number': model_number, 'user':user, 'industry_type':encodeURIComponent(industry_type)};
        if(post_data['cmd_id'] != 2)
                post_data = Object.assign(default_data, post_data);
        var sorted_post_data = Object.keys(post_data).sort().reduce(function (acc, key) {
                                acc[key] = post_data[key];
                                return acc;
                        }, {});
        console.log('Redis-CGI', JSON.stringify(sorted_post_data));
        data = 'full_data='+JSON.stringify(sorted_post_data);
        var url = '/redis_post';
        if(!method){
            method    = 'POST';
        }
        if(method=='GET'){
            url ='/get_method';
        }
        $http({
            url: url,
            method: method,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        }).then(function(response){
            var rdata = response.data;
            if(rdata.length == 0){
                console.log('CGI NOT PRESENT');
                tasAlert.show('ERROR: '+ post_data['get_key'] + ' CGI NOT PRESENT.', 'error', 2000);
                callback_success(eval(rdata));
                return;
            }
            if(!(Array.isArray(rdata))){
                callback_success(eval(rdata));
                return;
            }else if('TASERROR' in rdata[0]){
                console.log('ERROR HERE', rdata[0]['TASERROR']);
                if(rdata[0]['TASERROR'])
                    console.log('Error - ', JSON.stringify(rdata[0]['TASERROR'], null, '\t'));
                    tasAlert.show('TASERROR in CGI '+ post_data['cmd_id'], 'error', 2000);
            }
            callback_success(eval(rdata[0]));
        }, function(error){
            tasAlert.show('TASERROR in CGI '+ post_data['get_key']+' - '+ error, 'error', 2000);
            var err_dic = {'message': 'error'};
            callback_success(err_dic);
            return;
        });
    }

    this.socket_request = function(emit_key, post_data){
        var default_data = {'user':user, 'uid': uid, 'role': role, 'super_user': super_user}
        post_data = Object.assign(post_data, default_data);
        console.log('SOCKET', emit_key, JSON.stringify(post_data));
        socket.emit(emit_key, post_data);
    }
});
