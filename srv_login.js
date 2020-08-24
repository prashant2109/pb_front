var setting = require('./settings');
var vdb_name  = setting['vdb_name'];
const PythonShell = require('python-shell');

exports.authenticate =  function(name, pass, fn) {
    var istr = name + ':$:' +pass;
    var data = {'cmd_id':20, 'istr': istr};
    var options = {
        mode: 'json',
        pythonPath: 'python',
        pythonOptions: [],
        scriptPath: setting['pysrcPath'],
        args: [JSON.stringify(data)]
    };
    PythonShell.run("web_api.py", options, function (err, res) {
	var res = res[0][0];
        if (res) {
            if (res['message'] != 'done') {
                fn(res);
            } else {
                return fn(null, res);
            }
        } else {
            fn(new Error('cannot find user'));
        }
    });
}
