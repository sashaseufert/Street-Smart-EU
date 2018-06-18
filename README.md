WEBSITE LINK:
[StreetSmart](http://streetsmarteu.000webhostapp.com)

Sasha Seufert
June 4th, 2018
StreetSmart Europe

WELCOME! This readme file describes my javascript project, as well as a description of 
each file in the project directory.

:::::::::::::::::::::::::::::::::  IMPORTANT NOTES :::::::::::::::::::::::::::::::::::

	This website is in it's early stages of responsive design (the user interface
compatibility across various screen sizes). While this project is optimized for screen
sizes greater than 2560 x 1600 (~13.3 in diagonal), devices with smaller screens will
not be guaranteed functionality.

:::::::::::::::::::::::::::::::::  PROJECT SUMMARY  ::::::::::::::::::::::::::::::::::

	Travellers driving internationally are often unaware of subtle differences in the
rules of the road, which vary across jurisdictions. Consequentially, simple road trips 
may quickly become expensive from fines, if specific requirements are not met. My goal
is to develop a program that prompts a user for the countries driven through, and 
return the differences in the rules of the road for each country.
	This type of problem is most evident in Europe, due to the higher frequency of
international travellers and differences between each country. Therefore, this website
will initially be targeted towards the European market.

::::::::::::::::::::::::::::::::  PROJECT DIRECTORY  :::::::::::::::::::::::::::::::::

The following is a description of the main files and folders used in this project.

main.html				- The entire Hypertext Markup for the project
script.js				- The JavaScript used for this project.
ServerSide				- File with datafile and all serverside scripts. (All permissions are
					 	  denied to www. Only accessed locally.)
	DataFile.sasha		- The datafile with all of the information on the rules of the road
				 	 	  for each country included in this program. The datafile is in a
				 	 	  unique format tailored to the purposes of this project, therefore I
				 	 	  gave it my own extension: .sasha
	ImportImages.php	- Downloads all images by their URL in Datafile.txt into
						  media/images directory, then replaces the HTTP url with the local
						  address. (This is for my personal purposes, because when I was
						  making the datafile, I would paste image urls from the internet
						  instead of having to manually download them into the proper
						  directory. Instead, I automate that.)
	ParseDataFile.php	- This PHP file parses the datafile into a multidimensional JSON
						  array (string datatype). This string is then passed on from the
						  server to the client for use.
Stylesheet.css			- The stylesheet used for the user interface. 
media					- Folder used for storing all media in the project. This folder is
					 	  subdivided into the following folders
	images				- All images used on the UI
	videos				- All videos used on the UI
	interactive			- Interactive SVG elements used for this project
	fonts				- Typefaces used in this project
					
::::::::::::::::::::::::::::::::  DATAFILE STRUCTURE  ::::::::::::::::::::::::::::::::

This is a description of what each field of each record in the datafile represents:
	0.	Country
	0.5.Flag url
	1.	Documents required: Documents required for travel, stored in a JSON-formatted 
		array.
	2.	Side of the road: "l" is lefthand traffic and "r" is righthand traffic
	3.	Requires headlight deflectors: t or f depending on whether headlight beam
		deflectors are required for vehicles with steering wheels on the opposite side
	4.	Requires warning triangle: t or f depending on whether warning triangles are
		required to be in every vehicle in case of a breakdown.
	5.	Requires reflective jacket: t or f depending on whether safety jackets are
		required to be in every vehicle in case of a breakdown.
	6.	Requires fire extinguisher & first aid kit: t or f depending on whether or not
		they are required.
	7.	Driving age: Legal driving age of unaccompanied drivers, including the use of
		motorways.
	8.	Helmets required: For motorcyclists
	9.	Daytime headlights: t or f if required or not.
	10.	Who has priority at intersections: In various European countries, it is often
		seen roads labeled with a diamond as "main" roads, which are given priority.
	11.	Horn curfew: Time frame of when you can use horns in urban areas. Eg.
		08:30-16:00
	12.	Seatbelt requirements: A description of who is required seatbelts.
	13.	Children: Special requirements for children
	14. Snow chains permitted: y or n accordingly
	15. Speed limit motorcycle: Array {urban areas, rural areas, motorways}
	16. Speed limit car: Array {urban areas, rural areas, motorways}
	17. Speed limit car with caravan: Array {urban areas, rural areas, motorways}
	18. On the spot fines: Police can impose on the spot fines (y or n)
	19.	Parking notes: Any special notes on parking regulations
	20. Max alcohol: decimal of how much alcohol is permitted to drive.
	21. Sign differences: Differences in signage from the European Sign Standard.
		This will be stored as a 2d JSON array: {{description, sign image}}
	22.	Imperial or Metric: I or M
	23. Special notes.
	SEPERATOR LINE
