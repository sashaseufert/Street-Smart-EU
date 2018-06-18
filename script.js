/*
	Sasha Seufert
	June 4th, 2018
	The javascript used for this project.
*/

/// GLOBALS
$countryData = null; //ALL country data, parsed by "ParseDataFile.php". The data is identical in value to the datafile.
$countries = null; //Array of countries that are supported
$originSelected = false; //Wether or not the user selected his/her country of origin
$selectingTravel = false; //Wether or not the user selected the countries of which are being travelled through
$origin = ""; //Country of origin
$countriesOfTravel = []; //Countries of travel

$(window).on("load", function() {//What to do when the document loads

	/// INTERACTIVE COMPASS
	$(window).on("mousemove", function(){ //When the mouse is moved... Recalculate the rotation of the compass.
		$arrow = $(".interactiveLogo:eq(0) .arrow"); //Compass arrow DOM object
		$compassPos = [$arrow.offset().left + $arrow.width()/2, $arrow.offset().top + $arrow.height()/2]; //Compass center position array
		$cursorPos = [event.pageX, event.pageY]; //Cursor position array
		$angleToCursor = -Math.atan(($cursorPos[0] - $compassPos[0]) / ($cursorPos[1] - $compassPos[1])) * (180/Math.PI); //Angle for the arrow to rotate to be pointing at cursor
		$(".interactiveLogo .arrow").css("transform", "translate(-27.5px, 9.5px) rotate(" + $angleToCursor + "deg)"); //Apply rotation transformation for calculated angle to cursor
	});
	
	/// DATAFILE
	$countryData = importData(); //Import the data
	
	/// INTERACTIVE MAP
	$(".interactiveMapContainer").load("media/interactive/InteractiveMap/map.svg", function(){ //Load interactive maps into divs with corresponding class  of "interactiveMapContainer"
		$countries = Object.keys($countryData); //Get array of countries that are supported (getting the keys of the associative array: 1st dimention)
		for($i = 0; $i < $countries.length; $i++) { //Iterate through every country array element
			$countries[$i] = $countries[$i].replace(/^\w|\s\w|-\w/g, function(x){return x.toUpperCase();}); //Capitalize every first word
			$mapID = $countries[$i].replace(/\s/, "_").replace(); //Replace spaces with underscores for the ID of the country on the interactive map
			$("select.origin, .countriesOfTravel").append("<option mapID='"+$mapID+"'>"+ $countries[$i] +"</option>");
			$country = $("#" + $mapID); //Country DOM object
			$country.addClass("supportedCountry"); //On the interactive maps, add the class "supportedCountry" to countries that the datafile includes
			$country.attr("country", $countries[$i]); //Add name attribute
		}
		
		var anim = null; //When a country on the interactive map is hovered, pulse the select box so the user knows what field the map corresponds to.
		$(".supportedCountry").hover(function(){ // When a supported country on the map is hovered
			if(!$originSelected) { //If a country of origin wasn't already selected
				$("select.origin").val($(this).attr("country")); //Show country name in the "select" field. (Once the user un-hovers, another event listener will revert the select box to its original value, if the user does not click)
				window.clearInterval(anim); //Clear animation
				anim = window.setInterval(function(){ //Pulse opacity of the textbox
					$("select.origin").css("opacity", Math.abs(Math.sin(new Date().getTime() / 250))); //Sine wave to follow for the opacity
				}, 30);
			}
		});
		$(".supportedCountry").on("mouseleave",function(){ //Stop pulsation of select box when country is unhovered
			if(!$originSelected) //If the country of origin is not yet selected
				$("select.origin option.default").attr("selected", "true"); //Set the value of the select box to the default "(Use the interactive map!)" option
			window.clearInterval(anim); //Clear animation
			$("select.origin").css("opacity", 1); //Reset opacity back to full
		});
		
		$(".supportedCountry").click(function(){ //If a supported country is clicked
			$("select.origin").val($(this).attr("country")); //Select country
			window.clearInterval(anim); //Clear animation
			$originSelected = true; //Set "the country of origin is selected" to true
			showContinueBtn(); //Show the continue button to proceed to picking the countries of travel
			if($selectingTravel) { //If the user is already selecting countries of travel
				if($(this).hasClass("countryOfTravel") && !$(this).hasClass("countryOfOrigin")) //If the country is already selected as a country of travel and it is not the country of origin
					removeCountry($(this).attr("country")); //Make it no longer a country of travel
				else if(!$(this).hasClass("countryOfOrigin")) //If the country clicked is not the country of origin
					addCountry($(this).attr("country")); //Add the country as a country of travel.
			}
		});
		
		$("select.origin").change(function(){ //If the country of origin "select" field is changed (either by the interactive map or the user)
			showContinueBtn(); //Show the continue button
			$originSelected = true; //Set "the country of origin is selected" to true
		});
		
		$("select.countriesOfTravel").change(function(){ //If the country of travel "select" field is changed (either by the interactive map or the user)
			addCountry($(this).val()); //Add the country of travel
		});
	}); 
});

/**
*	slide(index)
*	Switches to a certain slide div with an animation
*	@param index - index (starting at 0) of the slide div to switch to
*/
function slide(index) {
	$(".slide:lt("+index+")").css({"position": "absolute", "z-index" : "1000"}); //Change position to absolute for slide
	$(".slide:lt("+index+")").animate({bottom : "120%"},1000, function(){ //Animate position
		$(this).hide(); //hide element once out of view
	});
}

/**
*	importData()
*	Imports datafile from the server with the help of the PHP datafile parser
*	@return associative jQuery array
*/
function importData() {
	$result = $.ajax({ //Synchronous AJAX request
		type: "GET",
		url: "ServerSide/ParseDataFile.php",
		async: false
	}).responseText;
	$result = JSON.parse($result);
	return $result;
}

/**
*	continueForm()
*	When the user is done selecting the country of origin, proceed to selecting countries of travel.
*/
function continueForm() {
	$selectingTravel = true;
	$origin = $("select.origin").val(); //Register select field into variable
	$('select.countriesOfTravel option:contains("'+$origin+'")').remove();
	$(".travellingFrom").fadeOut(300, function(){ //Animate new instruction and form
		$(".travellingThrough").fadeIn(300);
		animateInstructions(40);
	});
	$("#" + $("select.origin option:selected").attr("mapID")).addClass("countryOfOrigin");
}

function showContinueBtn() {
	$(".continueBtn").show();
}

/**
*	animateInstructions()
*	Typing animation that changes "from" to "through" in an animation
*	@param speed - How fast to complete the animation
*	@return true when complete
*/
function animateInstructions(speed) {
	$typeBox = $(".instructionTitle > span"); //Element to animate
	$typeBox.fadeOut(300, function(){  //Fade out
		$typeBox.html("<b>through</b>"); //Change value
		$typeBox.fadeIn(300);  //Fade back in
	});
}

/**
*	addCountry($country)
*	Adds a country of travel to the list by changing its appearance on the interactive map, adding it to the program array, and adding it to the UI table.
*	@param country - supported country to add
*/
function addCountry($country) {
	$countriesOfTravel.push($country); //Add to array
	$('*[country="' + $country +'"]').addClass("countryOfTravel"); //Add selected class to map
	$('select.countriesOfTravel option:contains("'+$country+'")').prop({"disabled": true, "selected": true}); //Disable select option
	$newRow = $("<tr class="+$country+"><td>"+$country+"</td></tr>").appendTo(".selectedCountries").click(function(){ //Append row to table and create deletion handler
		removeCountry($country);
	});
	$(".finishBtn").show(); //Show the finish button
}

/**
*	removeCountry($country)
*	Removes a country by performing the reverse actions of "addCountry()"
*	@param country - supported country to remove
*/
function removeCountry($country) {
	$countriesOfTravel.splice($countriesOfTravel.indexOf($country),1); //Remove from array
	$('*[country="' + $country +'"]').removeClass("countryOfTravel"); //Remove class from map
	$('select.countriesOfTravel option:contains("'+$country+'")').prop("disabled", false); //Re-enable select option
	$(".selectedCountries ."+$country).remove(); //Remove from table
	$("select.countriesOfTravel option:eq(0)").prop("selected", true); //Select default value for countries of travel : "(Use the interactive map!)"
	if($countriesOfTravel.length < 1) //If there are no countries of travel selected...
		$(".finishBtn").hide(); //Hide the finish button from the user.
}

/**
*	finishForm($country)
*	Converts all "$countryData" data into a user-friendly format and only shows the country of which the user is travelling through.
*/
function finishForm() {
	slide(2); //Switches to the last slide
	for($i in $countriesOfTravel) //For every country of travel selected by the user
		addCountryInfo($countriesOfTravel[$i], $countryData[$countriesOfTravel[$i].toLowerCase()]); //Convert the country info into a user-friendly interface
}

/**
*	addCountryInfo($country, $data)
*	Adds the country data to the DOM.
*	@param country - country to add
*	@param data - corresponding data for the country
*/
function addCountryInfo($country, $data) {
	$dom = $(".countryInfo.template").clone().appendTo(".countryInfoContainer"); //Create new info object from template (template is hidden)
	$dom.removeClass("template"); //Remove the template class from the actual information
	$dom.find(".country").html($country); //replace country
	$dom.find(".flag").attr("src", $data["flag"].substr(3)); //Add src to flag
	$documents = JSON.parse($data["documents"]); //Documents
	$units = ""; //Units of measuring speed
	for($i in $documents) //Add list items
		$dom.find(".documentsRequired").append("<li>"+$documents[$i]+"</li>");
	//Required equipment
	if($data["reqHeadlightDeflectors"] == "t") //Headlight deflectors
		$dom.find(".equipmentRequired").append("<tr class='equiptment'><td><img src='media/images/headlightDeflectors.png'/></td><td>Headlight deflectors if your vehicle has its steering on the opposite side.</td></tr>");
	if($data["reqWarningTriangle"] == "t") //Warning triangle
		$dom.find(".equipmentRequired").append("<tr class='equiptment'><td><img src='media/images/warningTriangle.png'/></td><td>A warning triangle</td></tr>");
	if($data["reqJacket"] == "t") //Reflective Jacket
		$dom.find(".equipmentRequired").append("<tr class='equiptment'><td><img src='media/images/reflectiveJacket.png'/></td><td>A reflective jacket in case of a breakdown</td></tr>");
	if($data["reqFireExtinguisher"] == "t") //Fire extinguisher
		$dom.find(".equipmentRequired").append("<tr class='equiptment'><td><img src='media/images/fireExtinguisherFirstAid.png'/></td><td>A fire extinguisher and a first-aid kit.</td></tr>");
	if($data["reqHelmets"] == "t") //Helmets for motorcyclists
		$dom.find(".equipmentRequired").append("<tr class='equiptment'><td><img src='media/images/helmet.png'/></td><td>Crash helmet (For motorcyclists).</td></tr>");
	//Driving age
	$dom.find(".drivingAge").html($data["drivingAge"]);
	//curfew
	if($data["hornCurfew"] == "null") //If there is no curfew
		$dom.find(".curfewContainer").remove(); //Remove the curfew tab
	else
		$dom.find(".curfew").html($data["hornCurfew"]); //Add the curfew to the UI
	//Driving side
	if($data["sideOfTheRoad"] == "r") {  //If the country drives on the right
		$dom.find(".sideOfTheRoad").html("right"); //Change text of UI
		$dom.find(".sideOfTheRoadImg").addClass("right"); //Change image to show right-hand traffic
	}
	else {
		$dom.find(".sideOfTheRoad").html("left"); //Change text of UI
		$dom.find(".sideOfTheRoadImg").addClass("left"); //Change image to show left-hand traffic
	}
	//Seatbelts
	if($data["seatbelts"] == "null") //If there are no seatbelt requirements
		$dom.find(".seatbeltsContainer").remove(); //Remove the seatbelt tab in UI
	else
		$dom.find(".seatbelts").html($data["seatbelts"]); //Add user seatbelt information to UI
	//Children
	if($data["children"] == "null") //If there are no special requirements for children
		$dom.find(".childrenContainer").remove(); //Remove the children tab in UI
	else
		$dom.find(".children").html($data["children"]); //Add children info to UI
	//Priority
	$dom.find(".priority").html($data["priority"]); //Add priority info to UI
	//Alcohol
	$dom.find(".alcohol").html($data["alcoholLimit"]); //Add alcohol limit to UI
	//Units of measurement
	if($data["units"] == "i") { //If the country uses the imperial system
		$dom.find(".unitsDisp").addClass("imperial"); //Change the icon to imperial
		$dom.find(".units").html("imperial"); //Change UI text
		$units = "mph"; //Select units as "mph"
	}
	else {
		$dom.find(".unitsDisp").addClass("metric"); //Change the icon to metric
		$dom.find(".units").html("metric"); //Change UI text
		$units = "kph"; //Select units as "kph"
	}
	//Speed limit
	createSpeedometer($dom.find(".motorcycle"), "Motorcycle", $data["speedLimits"]["motorcycle"], $units); //Create the speedometer for motorcycle speed
	createSpeedometer($dom.find(".car"), "Car", $data["speedLimits"]["car"], $units); //Create the speedometer for car speed
	createSpeedometer($dom.find(".carAndCaravan"), "Car with Caravan", $data["speedLimits"]["carAndCaravan"], $units); //Create the speedometer for car with caravan speed
	//Snow chains
	if($data["snowChains"] == "t") //If snow chains are allowed
		$dom.find(".snowChains").html("Snow chains are permitted in " + $country + ". Please see notes for further details."); //Change UI text
	else
		$dom.find(".snowChains").html("Snow chains are <b>NOT permitted</b> in " + $country + "."); //Change UI text to show that snow chains are prohibited in the country
	//Parking
	if($data["parking"] == "null") //If there is no parking information
		$dom.find(".parkingContainer").remove(); //Remove the parking tab
	else
		$dom.find(".parking").html($data["parking"]); //Transfer parking info to UI
	//Signs
	if($data["signDifferences"] != "null" && $data["signDifferences"] != null ) //If there are signs to add to the UI
		$.each($data["signDifferences"], function($index, $value){ 
			addSign($dom.find(".signsContainer"), $value[1], $value[0]); //Add the signs to the UI.
		});
	else
		$dom.find(".signsContainer").remove(); //If there are no signs to add to the UI, remove the signs tab.
	//Notes
	if($data["notes"] == "null") //If there are no additional notes
		$dom.find(".notesContainer").remove(); //Remove notes tab
	else
		$dom.find(".notes").html(breakIntoList($data["notes"])); //Transfer notes to UI
	//On-the-spot fines
	if($data["onTheSpotFines"] == "t") //If there are on-the-spot fines
		$dom.find(".onTheSpotFines").html(" On-the-spot fines may be imposed in " + $country + " for traffic violations."); //Warn user that the country poses on-the-spot fines
}

/**
*	createSpeedometer($parentObj, $vehicle, $data, $units)
*	Creates an image of a speedometer. Manipulates the speedometer SVG so that the arrows are pointing to the speed that corresponds to the data provided to this function.
*	@param parentObj - Object to append the speedometer to
*	@param vehicle - Label for the speedometer
*	@param data - Array of three numbers, ranging from 0-160 if $units = "kph" or from 0-120 if $units = "mph"
*	@param units - kph or mph (imperial or metric)
*	@return the speedometer element in the DOM
*/
function createSpeedometer($parentObj, $vehicle, $data, $units) {
	//Create speedometer graphic
	$parentObj.load("media/interactive/Speedometer/speedometer.svg", function() { //Import speedometer SVG and execute the enclosed code once it loads
		$speedometer = $("#Speedometer").addClass("speedometer").removeAttr("id"); //Change ids with classes due to multiple instances of speedometers (there can only be one of an id, whereas there can be multiple instances of the same class)
		$maxSpeedometerNum = 0; //The maximum value the speedometer can reach
		$speedometerAngleRange = 220; //The SVG angle range from 0 to max.s
		$speedometer.find("*").each(function($i) {  //transfer all ids to classes as done on line 292, except to all enclosing elements.s
			$(this).addClass($(this).attr("id")).removeAttr("id");
		});
		//Choose metric or imperial
		if($units == "mph") { //If the units for the country is imperial
			$speedometer.find(".metricLines").hide(); //Hide the metric ticks on the SVG speedometer
			$maxSpeedometerNum = 110; //Set the maximum value of the speedometer to 110 
		}
		else  {
			$speedometer.find(".imperialLines").hide(); //Hide the imperial ticks on the SVG speedometer
			$maxSpeedometerNum = 160; //Set the maximum value of the speedometer to 160 
		}
		//Move arrows
		$validArrows = removeIfNotInt($data["urban"], $speedometer.find(".Urban").attr("transform", "rotate("+ ($data["urban"] / $maxSpeedometerNum * $speedometerAngleRange) +" 113 114)"), 3); //Set green arrow position to the urban speed limit
		$validArrows = removeIfNotInt($data["rural"], $speedometer.find(".Rural").attr("transform", "rotate("+ ($data["rural"] / $maxSpeedometerNum * $speedometerAngleRange) +" 113 114)"), $validArrows); //Set yellow arrow position to the rural speed limit
		$validArrows = removeIfNotInt($data["motorway"], $speedometer.find(".Motorway").attr("transform", "rotate("+ ($data["motorway"] / $maxSpeedometerNum * $speedometerAngleRange) +" 113 114)"), $validArrows); //Set red arrow position to the motorway speed limit
		//Check if no valid arrows. If so, then replace speedometer text with note saying that there are no set limits for the country
		if($validArrows < 1)
			$speedometer.find(".unit").html("Posted");
		//Create label
		$parentObj.append("<div class='vehicleLabel'>"+$vehicle+"</div>");
		return $speedometer; //Return the DOM instance of the speedometer
	});
	
}

/**
*	removeIfNotInt($field, $obj, $index)
*	removes an object if a supplied variable is null.
*	@param field - field to check
*	@param obj - object to remove if field is null
*	@param index - a number that is returned if the supplied variable is a number, or a decremented number is returned if the variable is not a number
*	@return the speedometer element in the DOM
*/
function removeIfNotInt($field, $obj, $index) {
	if($field === null) { //If the field is not null
		$obj.remove();
		return $index - 1;
	}
	else return $index;
}

/**
*	addSign($parentObj, $url, $note)
*	adds a sign to the user interface with an attached note to the bottom
*	@param parentObj - object to append the sign to
*	@param url - directory of the sign image
*	@param note - note to attach with the sign
*/
function addSign($parentObj, $url, $note) {
	$parentObj.append("<div class='signDifference'><img src='"+$url.substr(3)+"'/>"+$note+"</div>");
}

/**
*	breakIntoList($string, $regexp (optional))
*	Converts sentences into list elements
*	@param string - string to convert
*	@param regexp - sentence delimiter (default is semicolon to differentiate decimal and period)
*	@return converted string
*/
function breakIntoList($string, $regexp = /;/g) {
	return ("<li>" + $string.replace($regexp, "</li><li>").slice(0, -4));
}