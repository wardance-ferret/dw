'use strict';

/*usage:  node -e 'require("./test_update_config.js").test()'*/

function discover() {
/*note: vars get initialized, comma-delimited style */

var fs = require('fs'),
	path = require('path'),
	appPath = path.resolve(__dirname, '..'),
	outputPath = path.resolve(__dirname, '../../common/models'),
	modelNames = [],
	files = [],
	fileName = outputPath+'/',
        changeCase = require('change-case'),
	schemaPromises,
	extend = require('extend'),
	results,
	file = fs.readFileSync(appPath+'/model-config.json'),
	lingo = require('lingo'),
	sourceSchemas,
	sourceSite = "iecho_unm",
        targetSchemas, 
	mysqlSource = require(appPath+'/datasources.json'),
	DataSource = require('loopback-datasource-juggler').DataSource,
	dataSource = new DataSource('mysql', mysqlSource.iechoDS),
	modelConfig = JSON.parse(file.toString()),
	str = require('string'),
	tableBase = {
	    'base' : 'PersistedModel',
	    'idInjection' : false,
	    'validations' :[],
            'relations' : {},
	    'acls' : [],
	    'methods': {}
	};

	//everything is initialized.
        //console.log(mysqlSource);

	return dataSource.discoverModelDefinitions({owner: sourceSite, all:true
	}).then(function(models,err){
                if (err) {
			console.error(err);
			return(err);
		}
		models.forEach(function(model){
                	console.log('filename: '+model.name);
			modelNames.push(model.name);	
		});
   		schemaPromises = modelNames.map(modelName => dataSource.discoverSchema(modelName));
		results = Promise.all(schemaPromises);
		return results;
	}).then(function(schemas) {
		sourceSchemas = schemas;
                //console.log(sourceSchemas);
		if (schemas && schemas instanceof Array) {
			schemas.forEach(function(schema){
				if (schema && schema.options && schema.options.mysql){
					let camelName = changeCase.lowerCaseFirst(schema.options.mysql.table),
					name = str(camelName).dasherize();
					schema.fileName = fileName + sourceSite + '_' + name + '.json';
                                        console.log('filename: '+schema.fileName);
					schema.name = sourceSite + '_' + schema.options.mysql.table;
					extend(true, schema, tableBase);		
				}		
			});
		 }

		results = Promise.all(schemaPromises);
		return results;

        }).then(function(){
		if(sourceSchemas && sourceSchemas instanceof Array){

			sourceSchemas.forEach(function(schema){

				if (schema.fileName){
					if (fileName && !fs.existsSync(fileName)){
						fs.mkdirSync(fileName);
						

					}	

					fs.writeFileSync(schema.fileName, JSON.stringify(schema));

				}
				modelConfig[schema.name] = {
					'dataSource' : 'iechoDS',
					'public' : true
				};				
			});
			fs.writeFileSync(appPath+'/model-config.json', JSON.stringify(modelConfig));


		}

	});


}


module.exports.test = function(app) {
	return discover();
};


