<?php
	include ('bf_properties.php');

	$connection = new mysqli($db_host,$db_id,$db_pwd,$db_name); // Establishing Connection with Server..
	if ($connection->connect_errno) {
    	echo "Failed to connect to MySQL: (" . $connection->connect_errno . ") " . $connection->connect_error;
    }
	$query = $connection->query("SELECT * FROM page"); //Insert Query
	if ($query){
		//$row=mysqli_fetch_array($query,MYSQLI_BOTH);
		$emparray = array();
    	while($row =mysqli_fetch_assoc($query))
    	{
        	$emparray[] = $row;
    	}
    	echo json_encode($emparray);
	}
	else{
		echo "Unable to retrieve data";
	}
	$connection->close(); // Connection Closed
?>