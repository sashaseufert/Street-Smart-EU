<?php
/*
	Sasha Seufert
	June 4th, 2018
	This program parses the datafile into a multidimensional assosiative JSON array (string datatype). This string is then passed on from the server to the client for use.
	
	Requires the following GET parameters:
		[none]
	Returns
		Datafile as multidimensional JSON array, of a string datatype.
*/

//Declare variables
$dataFilePath = "DataFile.sasha";
$parsedFile;
$dataFile;

//Open datafile and read to $parsedFile
$parsedFile = file_get_contents($dataFilePath);

//Split the datafile into an array of records by country seperator: "-----...x90"
$parsedFile = explode("------------------------------------------------------------------------------------------", $parsedFile);

//Get rid of first whitespace element
array_shift($parsedFile);

//Convert indexed array to associative array
$temp;
$speedLimitTemp;
for($i = 0; $i < sizeof($parsedFile); $i++) {
	$parsedFile[$i] = explode("\n", $parsedFile[$i]); //Split fields by newline
	array_shift($parsedFile[$i]); //Remove first empty element
	
	$country = strtolower($parsedFile[$i][0]);  //Country converted to lower case for assosiative array
	array_shift($parsedFile[$i]);
	$motorcycleLimit = JSON_decode($parsedFile[$i][15]); 
	$carLimit = JSON_decode($parsedFile[$i][16]);
	$carAndCaravanLimit = JSON_decode($parsedFile[$i][17]);
	$data = array	( //Build assosiative array
						"flag" => $parsedFile[$i][0],
						"documents" => $parsedFile[$i][1],
						"sideOfTheRoad" => $parsedFile[$i][2],
						"reqHeadlightDeflectors" => $parsedFile[$i][3],
						"reqWarningTriangle" => $parsedFile[$i][4],
						"reqJacket" => $parsedFile[$i][5],
						"reqFireExtinguisher" => $parsedFile[$i][6],
						"drivingAge" => $parsedFile[$i][7],
						"reqHelmets" => $parsedFile[$i][8],
						"daytimeHeadlights" => $parsedFile[$i][9],
						"priority" => $parsedFile[$i][10],
						"hornCurfew" => $parsedFile[$i][11],
						"seatbelts" => $parsedFile[$i][12],
						"children" => $parsedFile[$i][13],
						"snowChains" => $parsedFile[$i][14],
						"speedLimits" => array(
							"motorcycle" => array(
								"urban" => $motorcycleLimit[0],
								"rural" => $motorcycleLimit[1],
								"motorway" => $motorcycleLimit[2]
								),
							"car" => array(
								"urban" => $carLimit[0],
								"rural" => $carLimit[1],
								"motorway" => $carLimit[2]
								),
							"carAndCaravan" => array(
								"urban" => $carAndCaravanLimit[0],
								"rural" => $carAndCaravanLimit[1],
								"motorway" => $carAndCaravanLimit[2]
								)
							),
						"onTheSpotFines" => $parsedFile[$i][18],
						"parking" => $parsedFile[$i][19],
						"alcoholLimit" => $parsedFile[$i][20],
						"signDifferences" => JSON_decode($parsedFile[$i][21]),
						"units" => $parsedFile[$i][22],
						"notes" => $parsedFile[$i][23]
					);
	$temp[$country] = $data; //Assign data to country in assosiative array
}
$parsedFile = $temp; //Transfer temporary to parsed

echo JSON_encode($parsedFile); //Return the parsed data

?>