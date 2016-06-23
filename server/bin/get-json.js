/*
todo:  order the scripts for the user so that the API for getting json from <datawarehouse>

the data warehouse

*/
//var loopback = require('loopback');
//var app = loopback();

function get_json(app){
	var fs = require('fs'),
	app = require('../server');
        path = require('path'),
	sourceFiles=[],
        sourcePath=path.resolve(__dirname,'../../common/models'),
        sourceSite='iecho_unm',
	sourceFileFilter='iecho_unm_',
        sourceFilenames=[];
	sourceFiles = fs.readdirSync(sourcePath);

	var rem = new RegExp(sourceSite+"_", "i");

        for (var i in sourceFiles){
                name = sourcePath + '/'+sourceFiles[i];
                var match = rem.exec(sourceFiles[i]);
                if (!fs.statSync(name).isDirectory() && !match){
                    sourceFilenames.push(name);
                }

        }

	//console.log(sourceFilenames);

        var model_name = 'iecho_unm_contacts';
        var Contact = app.models.iecho_unm_contacts;
	Contact.find({},function(err, persons){
		if(err) {
 			console.error('couldn\'t return '+model_name);
			return err;
		}		
		
	        console.log(persons);	

	});


}


module.exports.test = function(app) {
	return get_json(app);
}



