<?php
	include ('bf_properties.php');
	// Fetching Values From URL
	$title = $_POST['story_title'];
	$abs = $_POST['abstract'];
	$url = $_POST['url'];
	$text = $_POST['text'];
	$lat = $_POST['lat'];
	$lng = $_POST['lng'];

	$connection = new mysqli($db_host,$db_id,$db_pwd,$db_name); // Establishing Connection with Server..
	if ($connection->connect_errno) {
    	echo "Failed to connect to MySQL: (" . $connection->connect_errno . ") " . $connection->connect_error;
    }
    else {
    	echo "Connected to db\n";
    }
	$query = $connection->query("INSERT INTO page(title,abstract,story_text,url,lat,lng) VALUES ('$title','$abs','$text','$url','$lat','$lng')"); //Insert Query
	if ($query){
		echo $text;
		echo "Form Submitted succesfully";
	}
	else{
		echo "Form not submitted";
	}
	$connection->close(); // Connection Closed
?>