var path = require('path');
var fs = require('fs');
var app = require(path.resolve(__dirname, '../server'));
var outputPath = path.resolve(__dirname, '../../common/models');

var dataSource = app.dataSources.iechoDS;

//todo: get tables for the schema
//param table name and schema and check for table existence
//see also:  http://stackoverflow.com/questions/26128285/loopback-discoverandbuildmodels-not-generating-models

function schemaCB(err, schema) {
	  if(schema) {
		   console.log("Auto discovery success: " + schema.name);
		   var outputName = outputPath + path.sep +schema.name + '.json';
		    fs.writeFile(outputName, JSON.stringify(schema, null, 2), function(err) {
				if(err) {
					console.log(err);
				} else {
					console.log("JSON saved to " + outputName);
				}
			});
	}
	if(err) {
		console.error('sorry there was a prob'+err);
		return;
	}
	return;
};


function finalCB(err) {
	if (err) {
		console.error('sorry, there was a prob finding schemas');
		return;
	}
    return;
}

dataSource.discoverModelDefinitions({limit:5},function(err, models){
	if (err) {
		console.log(err);
		return err;
	}
    models.forEach(function(def){
		console.log(def.name);
   	    //dataSource.discoverSchema(def.name,{schema:'iecho_unm'},schemaCB);
	});
});
