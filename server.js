var http = require("http");
var fs = require('fs');
var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var winston = require('winston');
var ps = require('python-shell');
var redis = require('redis');
var redisClient = redis.createClient();
var pysrcPath = './pysrc/';
var srv_login = require('./core/srv_login');
var setting = require('./core/settings');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
  name: 'pbmain_session',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'secret_word'
}));
app.use(function(req, res, next) { res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); next();});

//frontend routes
app.set('view engine', 'ejs');
app.set('views', __dirname + '/core/views');
app.use("/src", express.static(__dirname + "/core"));
app.use("/pdf_canvas", express.static(__dirname + "/core/pdf_canvas/web/"));
app.use("/build", express.static(__dirname + "/core/build"));
app.use("/var_html_path", express.static("/var/www/html/"));
app.use("/ref_path", express.static("/var/www/html/WorkSpaceBuilder_DB_demo/"));
app.use("/reference_path", express.static("/var/www/html/WorkSpaceBuilder_DB_demo/"));

//app.use("/new_iframe", express.static(setting.input_output.new_iframe));

//backend ajax api
var logger_err = winston.createLogger({
    transports: [
        new(winston.transports.File)({
            filename:'error.log',
            handleExceptions: true,
            prettyPrint:true
        })
    ],exitOnError:false
});

function getDateTime(){
    return (new Date()).getTime();
}

//callback:http://172.16.20.229:7777/status_update?project_id=56&company_id=1&doc_id=10
app.get('/status_update', function(req, res){
    var input_data	= {'project_id':req.query['project_id'], 'company_id':req.query['company_id'], 'doc_id':req.query['doc_id'],"cmd_id":1, 'status':req.query['status'] || 'Y', 'user':req.query['user'] || 'demo'}
    var options = {
        mode: 'json',
        pythonPath: 'python',
        pythonOptions: [],
        scriptPath: pysrcPath,
        args: [JSON.stringify(input_data)]
    };
    ps.run("status_update.py", options, function (err, data) {
        console.log(err, 'data ', data)
        console.log(err);
        if (data && data[0]){
            if(data[0][0]['message'] == 'done'){
             io.emit('doc_status', input_data); 		
            }
            res.send(data[0]);
            if('TASERROR' in data[0][0]){
                logger_err.log('info', {'user': user['user_name'], 'CGI': input_data, 'access_date': Date().toString()});
            }
        }else{
            console.log("web_api.py" + ' - no data');
            logger_err.error(data, err);
            res.send([{TASERROR:err}]);
        }
    });
});


app.post('/post_method', function(req, res){
    console.log('post_method ', req.body['full_data'])
    var input_data    = req.body['full_data'];
    var dateTime = getDateTime();
    var options = {
        mode: 'json',
        pythonPath: 'python',
        pythonOptions: [],
        scriptPath: pysrcPath,
        args: [input_data]
    };
    ps.run("web_api.py", options, function (err, data) {
        console.log(err)
        if (data){
            res.send(data[0]);
            if('TASERROR' in data[0][0]){
            	logger_err.log('info', {'user': user['user_name'], 'CGI': input_data, 'access_date': Date().toString()});
            }
        }else{
            console.log("web_api.py" + ' - no data');
            logger_err.error(data, err);
            res.send([{TASERROR:err}]);
        }
    });
});

app.get('/get_method',function(req, res){
    input_data = eval(req.query);
    var options = {
        mode: 'json',
        pythonPath: 'python',
        pythonOptions: [],
        scriptPath: pysrcPath,
        args: [JSON.stringify(input_data)]
    };
    ps.run("web_api.py", options, function (err, data) {
        console.log(err)
        if (data){
            res.send(data[0]);
            if('TASERROR' in data[0][0]){
            	logger_err.log('info', {'user': user['user_name'], 'CGI': input_data, 'access_date': Date().toString()});
            }
        }else{
            console.log("web_api.py" + ' - no data found');
            logger_err.error(data, err);
            res.send([{TASERROR:err}]);
        }
    });
});

//backend redis api
redisClient.on('connect', function() {
    console.log('Redis client connected');
});

app.post('/redis_post', function(req, res){
    console.log('redis_post ', req.body['full_data']);
    var input_data    = req.body['full_data'];
    var dateTime = getDateTime();
    input_data = JSON.parse(input_data);
    redisClient.get(input_data['get_key'], function (err, data) {
        if (data){
            res.send(data);
        }else{
            res.send([{TASERROR:err}]);
        }
    });
});


var server = http.createServer(app).listen(setting.webPort, function(){
  console.log('Express server listening on port ' +  setting.webPort);
});
server.timeout = 3600000;

//Socket Section
var io = require('socket.io')(server);
var ss = require('socket.io-stream');

io.sockets.on('connection', function(socket) {

    //backend socket api
    socket.on('request_data', function(tdata) {
        var options = {
            mode: 'json',
            pythonPath: 'python',
            pythonOptions: [],
            scriptPath: pysrcPath,
            args: [JSON.stringify(tdata)]
        };
        ps.run("web_api.py", options, function (err, data) {
            if (data){
               socket.broadcast.emit(tdata['callback'], data[0]);
                if('TASERROR' in data[0][0]){
                    logger_err.log('info', {'user': user['user_name'], 'CGI': input_data, 'access_date': Date().toString()});
                }
            }else{
                logger_err.error(data, err);
                socket.broadcast.emit(tdata['callback'], [{TASERROR:err}]);
            }
        });
    });

});

//frontend routes
app.get('/', function(req, res){
    res.render('login');
});

app.get('/login', function(req, res){
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  req.session.destroy();
  res.render('login');
});

app.post('/login', function(req, res){
  srv_login.authenticate(req.body.username, req.body.password, function(err, user){
    if (user) {
      req.session.regenerate(function(){
        req.session.user = user;
        res.redirect('/document');
      });
    } else {
      req.session.error = 'Authentication failed';
      res.redirect('/login');
    }
  });
});

app.get('/document', function(req, res){
  //res.render('document', {user_name:'', user_id:'', user_role:''});
  //return;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if (req.session && req.session.user) {
    var user_id = req.session.user['user_id'];
    var user_passwd = req.session.user['user_passwd'];
    srv_login.authenticate(req.session.user.user_id, req.session.user.user_passwd, function(err, user){
        if (user) {
            var user_name = req.session.user['user_name'] || '';
            logger_err.log('info', {'user': user['user_name'], 'Page': 'Document Page', 'access_date': Date().toString()});
            var user_role = user['user_role']
            res.render('document', {user_name:user_name, user_id:user_id, user_role:user_role});
        }else{
            res.redirect('/login');
        }
    });
  }else{
    res.redirect('/login');
  }
});

app.get('/monitor', function(req, res){
  //res.render('monitor', {user_name:'', user_id:'', user_role:''});
  //return;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if (req.session && req.session.user) {
    var user_id = req.session.user['user_id'];
    var user_passwd = req.session.user['user_passwd'];
    srv_login.authenticate(req.session.user.user_id, req.session.user.user_passwd, function(err, user){
        if (user) {
            var user_name = req.session.user['user_name'] || '';
            logger_err.log('info', {'user': user['user_name'], 'Page': 'Document Page', 'access_date': Date().toString()});
            var user_role = user['user_role']
            res.render('monitor', {user_name:user_name, user_id:user_id, user_role:user_role});
        }else{
            res.redirect('/login');
        }
    });
  }else{
    res.redirect('/login');
  }
});

app.get('/modules', function(req, res){
  //res.render('modules', {user_name:'', user_id:'', user_role:''});
  //return;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if (req.session && req.session.user) {
    var user_id = req.session.user['user_id'];
    var user_passwd = req.session.user['user_passwd'];
    srv_login.authenticate(req.session.user.user_id, req.session.user.user_passwd, function(err, user){
        if (user) {
            var user_name = req.session.user['user_name'] || '';
            logger_err.log('info', {'user': user['user_name'], 'Page': 'Document Page', 'access_date': Date().toString()});
            var user_role = user['user_role']
            res.render('modules', {user_name:user_name, user_id:user_id, user_role:user_role});
        }else{
            res.redirect('/login');
        }
    });
  }else{
    res.redirect('/login');
  }
});

app.get('/demo', function(req,res){
  res.render('demo');
});

app.get('*', function(req, res) {
    res.redirect('/src/no_page_found.html');
});

