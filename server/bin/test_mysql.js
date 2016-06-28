var mysql = require("mysql");

var conn = mysql.createConnection({
 	host: "localhost",
	user: "user",
	password: "password",
	database: "database"
});

conn.connect(function(err){
   if (err) {
	 console.log('error connecting to db');
	 return;
   }

   console.log('connection established!');

});

conn.end(function(err){
	
});

