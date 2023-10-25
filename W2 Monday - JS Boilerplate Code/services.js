"use strict";
// Ada Boilerplate - JavaScript and Computer Vision Teachable Machine,
// Machine Learning & Teachable Machine Models


class TeachableMachine {
	model;
	classes;
	constructor (url) {
		this.imageModelURL = url;
	}
	setModel (tmModel) {
		this.model = tmModel;
		console.log(this.model);
	}

	storeResult(error, results) {
		//a simple way to return the current classification details
		if (error) { //something seems to have gone wrong
			console.error("classifier error: " + error);
		} else { //no errors detected, so lets grab the label and execute the classify function again
			const tmData = results.reduce((tmClasses, tmClass) => { 
				return [...tmClasses, {label: tmClass.label, confidence: tmClass.confidence}]
			},[]) 
			
			this.model.classify(); //execute the classify function again
			this.classes = tmData;
		}
	}

	classToDisplay () {
		console.log(this.classes)
		const winningConfidence = this.classes.reduce((accumulator, currentValue) => accumulator > currentValue.confidence? accumulator:currentValue.confidence); 		
		return  winningConfidence
	}

}

var genderModelURL = 'https://teachablemachine.withgoogle.com/models/7zojvxBV6/'; //variable used to hold path to the model
const genderMachine = new TeachableMachine(genderModelURL)

//for easy lets setup some quick global variables

var cam; //variable used to hold the camera object
var label0 = "", confidence0 = 0; //for ease and just because we're only demo'ing with two classes
var label1 = "", confidence1 = 0;



function preload() {
	//p5 function - this function is automatically called by the p5 library, once only
	const classifier = ml5.imageClassifier(genderMachine.imageModelURL + 'model.json'); //load the model!
	genderMachine.setModel(classifier);
}


function setup() {
	//p5 function - this function is autmaticallt called after the 'preload' function; the function is only executed once
	var viewport = createCanvas(480, 360);//p5 function to create a p5 canvas 
	viewport.parent('video_container'); //attach the p5 canvas to the target html div
	frameRate(24); //set the frame rate, we dont need to high performance video

	cam = createCapture(VIDEO);//p5 function, store the video information coming from the camera
	cam.hide();//hide the cam element

	classify(); //start the classifer
}


function classify() {
	//ml5, classify the current information stored in the camera object
	//classifier.classify(cam, processresults); //once complete execute a callback to the processresults function
	genderMachine.model.classify(cam, genderMachine.storeResult)
}

/*
function processresults(error, results) {
	//a simple way to return the current classification details
	if (error) { //something seems to have gone wrong
		console.error("classifier error: " + error);
	} else { //no errors detected, so lets grab the label and execute the classify function again
		label0 = results[0].label; confidence0 = results[0].confidence;
		label1 = results[1].label; confidence1 = results[1].confidence;
		classify(); //execute the classify function again
	}
}
*/
function confidenceToDisplay(tmClass) {
	switch(tmClass.confidence*100) {
		case tmClass.confidence < 60:
			return "could be";
		case tmClass.confidence < 80:
			return "is likely";
		default:
			return "is";
	}


}

function formatResponse (tmClass, tmClassConfidence) {
	if (!tmClass) return "Please wait";
	return `Subject ${tmClassConfidence} ${tmClass.label} (${(confidence.confidence * 100).toFixed}%)`

}
/*
function friendlyresults() {
	//a simple way to return the current classification details
	let result = "Please wait...";
	if(label0.length > 0) {
		result = label0 + ": " + (confidence0*100).toFixed(0) + "%" + ", " + label1 + ": " + (confidence1*100).toFixed(0) + "%";
	}
	return result;
}
*/

function draw() {
	//p5 function - this function is automatically called every frame
	background("#c0c0c0"); //set the canvas default back colour

	image(cam, 0, 0); //pass the video to the p5 canvas
	tmClass = genderMachine.classToDisplay();
	document.getElementById("results").innerHTML = formatResponse(tmClass, confidenceToDisplay(tmClass) ); //update the result string
}
