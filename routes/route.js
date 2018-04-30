"use strict" 

let express = require('express');
let router = express.Router();

let connection = require('../db_connections/connection.js');

//welcome router 
router.get("/",(req,res)=>{
	res.send(`Welcome to the movie api`);
});


//Create movie route

router.post("/createMovie", (req,res)=>{
	let data = req.body;
	let insert_query = `insert into moviesdata
							  (movie_name,
							   movie_year,
							   movie_genere,
							   movie_director,
							   movie_image)
							values
							   ('${data.movie_name}',
							   	'${data.movie_year}',
							   	'${data.movie_genere}',
							   	'${data.movie_director}',
							   	'${data.movie_image}'
							    )`
    //check if record already exist in table 

    let check_query = `select * from moviesdata
    				   where movie_name = '${data.movie_name}'`;

    

    async function executeSQL(){

    	let record = await connection.query(check_query);
    	if(record.length == 0){
    		await connection.query(insert_query);
    		res.send(data.movie_name+" is successfully added in database");
    	}
    	else if(record.length > 0){
    		res.send(data.movie_name+" is already exist in database");
    	}
   
    }

    executeSQL();
 
});


//Get all the movie records 

router.get("/getMovies",(req,res)=>{
	let get_query = `select * 
					 from moviesdata`;




	connection.query(get_query, (err,rows)=>{
			if(err){
				//set http header 500 and send response 
				res.status(500).send("Internal Server Error");	
			}
			else{
				//send data in json format 
				res.setHeader('Content-Type', 'application/json');
	   			res.status(200).send(JSON.stringify(rows));
			}
		});
});

//get individual movie record 

router.get("/getMovie/:name([a-zA-Z0-9_\']{1,20})", (req,res)=>{
	let movie_name = req.params.name;
	let get_query = `select * 
					 from moviesdata
					 where movie_name = '${movie_name}'`;
	
	connection.query(get_query, (err,rows)=>{
		if(err){
			
			res.status(500).send("Internal Server Error");	
		}
		else{
			if(rows.length == 0){
				res.status(500).send("Record does not exist");	
			}
			else if (rows.length > 0){
				res.setHeader('Content-Type', 'application/json');
				res.status(200).send(JSON.stringify(rows));
			}
		}
	});
	
});


//Update route

router.put("/updateMovie", (req,res)=>{
	let data = req.body;
	
	let update_query = `update moviesdata
						set 
							movie_year = '${data.movie_year}',
							movie_genere = '${data.movie_genere}',
							movie_director = '${data.movie_director}',
							movie_image = '${data.movie_image}'

						where movie_name = '${data.movie_name}'
						`;
	

	connection.query(update_query, (error,data)=>{
		if(error){
			console.log(error);
			res.send("error has occured...");
		}
		else{
			console.log(data);
			res.send("Movie Record is successfully updated....");
		}
	});

});


//Delte route

router.delete("/deleteMovie/:name([a-zA-Z0-9_\']{1,20})", (req,res)=>{
	let movie_name=req.params.name;

	let delete_query = `
			delete from moviesdata
			where movie_name = '${movie_name}';
	`;


	connection.query(delete_query, (err,rows)=>{
		if(err){
			res.status(500).send("Internal Server Error");
		}
		else{
			res.status(200).send(movie_name+" is successfully removed...");
		}
	});

	
	
	
});


module.exports = router;
