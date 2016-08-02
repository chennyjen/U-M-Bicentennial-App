<?php
	
	// Fetching Values From URL
	//$story_title1 = $_POST['story_title'];
	//$slide_title1 = $_POST['slide_title'];
	// TODO: upload pic from media attribute-------------------------------------------------
	//$media = addslashes(file_get_contents($_FILES['media']['tmp_name'])); //SQL Injection defence!
	//$media_name = addslashes($_FILES['media']['name']);
	// --------------------------------------------------------------------------------------
	//$memo_text = $_POST['text'];
	$connection = new mysqli("mgoview-dev.cbiyxcehohhr.us-west-2.rds.amazonaws.com", "admin", "semIt0ne.","mgoview_dev"); // Establishing Connection with Server..
	file_put_contents("log.txt",$connection);
	if ($connection->connect_errno) {
    	echo "Failed to connect to MySQL: (" . $connection->connect_errno . ") " . $connection->connect_error;
    }
	//$slide_conn = mysql_connect("mgoview-dev.cbiyxcehohhr.us-west-2.rds.amazonaws.com", "chennjen","jenpass123");
	$query = $connection->query("INSERT INTO story(id,title,story_ref,last_update,category,map_id,lat,lng) VALUES (200,'story_title1','slide_title1s',NULL,NULL,NULL,NULL,NULL)"); //Insert Query
	if ($query){
		echo "Form Submitted succesfully";
	}
	else{
		echo "Form not submitted";
	}
	$query->close(); // Connection Closed
?>