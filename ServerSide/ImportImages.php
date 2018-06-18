<?php
/*
	Sasha Seufert
	June 4th, 2018
	Downloads all images by their URL in Datafile.txt into specified directory, then replaces the HTTP url with the local address in the data file.
	(This file will not be used by the client or retrieved by the client side)
	
	Requires the following GET parameters:
		filename 			- directory of the file to parse relative to the location of this file 
	Returns
		Error if applicable.
*/

//get GET parameters
$srcPath = $_GET["filename"];

//Verify files
if(!file_exists($srcPath))
	die("Data file does not exist");
if(!is_file($srcPath))
	die("Source directory is not a file");

//Create file instance
$dataFile = fopen($srcPath, "r");

//Create new temporary datafile
$tempFile = fopen($srcPath . ".temp","w+");

//Start reading lines
$count = 1;
while(!feof($dataFile)) {
	$currentLine = fgets($dataFile);
	if($count == 3) {
		$currentLine = importImage(rtrim($currentLine)) . "\n";
	}
	else if($count == 24) {
		$parsed = JSON_decode($currentLine);
		$newarr = $parsed;
		for($i = 0; $i < sizeof($parsed); $i++) {
			$newarr[$i][1] = importImage($parsed[$i][1]);
		}
		$currentLine = JSON_encode($newarr) . "\n";
	}
	else if($count == 26) {
		$count = 0;
	}
	fwrite($tempFile, $currentLine);
	$count++;
}

//Rename old datafile
rename($srcPath, $srcPath . ".backup");

//Functions

function importImage($url) {
	$image = file_get_contents($url);  //Download image on the web
	$extention = explode(".",$url);
	$extention = end($extention);
	$newImgDir;
	do { //Keep on generating random image names if there is already an existing name
		$newImgDir = "../media/images/" . rand(0,10000) . "." . $extention;
	}
	while(file_exists($newImgDir));
	$newImage = fopen($newImgDir, "w+"); //Create the image
	fwrite($newImage,$image); //Write to picture
	return $newImgDir;
}
?>
