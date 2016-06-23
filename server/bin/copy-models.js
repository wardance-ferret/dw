/*copy model definitions for a new data source*/
/* after the script is run, the server must be rebooted for the new routes to appear in explorer. */

/*usage:  node -e 'require("./copy_models.js").test()'*/

function copy() {
	//initializations
	var fs = require('fs'),
	path = require('path'),
        appPath = path.resolve(__dirname, '..'),
	configFile = fs.readFileSync(appPath+'/model-config.json'),
	sourceFiles=[],
	sourceFilenames=[],
	targetFiles=[],
	targetFilenames=[],
        sourcePath = path.resolve(__dirname, '../../common/models'),
	targetPath = path.resolve(__dirname,'../../common/models'),
	fileName = targetPath+'/';
        sourceModelNames=[],
	targetModelNames=[],
	sourceSite='iecho_unm',
        sourceModelConfig = JSON.parse(configFile.toString()),
        str = require('string');
 	
	sourceFiles = fs.readdirSync(sourcePath);

	var rem = new RegExp(sourceSite+"_", "i");

	for (var i in sourceFiles){
		name = sourcePath + '/'+sourceFiles[i];
                var match = rem.exec(sourceFiles[i]);
		if (!fs.statSync(name).isDirectory() && match){
		    sourceFilenames.push(name);
		}

	}		

	var rer = new RegExp(sourceSite+"_");

	for (var i in sourceFilenames){
           console.log(sourceFilenames[i]);
	    var file = fs.readFileSync(sourceFilenames[i]);	
            var targetFilename=sourceFilenames[i].replace(rer,'');
            console.log("targ:"+targetFilename);
	    var json=JSON.parse(file.toString());
	    json['properties']['original_id']=json['properties']['id'];
            if (json.hasOwnProperty('properties')){
		if (json['properties'].hasOwnProperty('id')){
			delete json['properties']['id'];
		}

	    } 
  
	    if (json.hasOwnProperty('name')){
		var original_name = json['name'];
		var new_name = original_name.replace(rer,'');
		json['name']=new_name;	
	    }

	    json['site_id']={"type":"String","required":true};	   	

	    sourceModelConfig[json['name']]= {
		'dataSource' : 'dwDS',
		'public' : true 
	    };	
	 
            fs.writeFileSync(targetFilename, JSON.stringify(json));
	}

	
	fs.writeFileSync(appPath+'/model-config.json',JSON.stringify(sourceModelConfig));	

	

}



module.exports.test = function(app) {
        return copy();
};





