'use strict';


function discover() {
//don't understand why app is a param
/*note: vars get initialized, comma-delimited style */
var fs = require('fs'),
	path = require('path'),
	appPath = path.resolve(__dirname, '../server'),
	outputPath = path.resolve(__dirname, '../../common/models'),
	modelNames = [],
	files = [],
	fileName ='./models/',
        changeCase = require('change-case'),
	schemaPromises,
	extend = require('extend'),
	results,
	file = fs.readFileSync('./model-config.json'),
	lingo = require('lingo'),
	tableSchemas,
	mysqlSource = require('./datasources.json'),
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

	return dataSource.discoverModelDefinitions({owner: "iecho_unm", all:true
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
		tableSchemas = schemas;
                //console.log(tableSchemas);
		if (schemas && schemas instanceof Array) {
			schemas.forEach(function(schema){
				if (schema && schema.options && schema.options.mysql){
					let camelName = changeCase.lowerCaseFirst(schema.options.mysql.table),
					name = str(camelName).dasherize();
					schema.fileName = fileName + name + '.json';
                                        console.log('filename: '+schema.fileName);
					schema.name = schema.options.mysql.table;
					extend(true, schema, tableBase);		
				}		
			});
		 }

		results = Promise.all(schemaPromises);
		console.log('results: '+ results);	
		return results;
	}).then(function(){
		if (tableSchemas && tableSchemas instanceof Array)
		{
		        tableSchemas.forEach(function(schema){
		
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
			fs.writeFileSync('./model-config.json', JSON.stringify(modelConfig));
		}

	});

}


module.exports.test = function(app) {
	return discover(app);
};


