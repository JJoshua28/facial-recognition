"use strict";

class TeachableMachineModel {
	constructor (url) {
		this.imageModelURL = url;
		this.results = undefined;
		this.model = undefined;
	}
	setModel (tmModel) {
		this.model = tmModel;
	}
	setResults (results) {
		this.results = results;
	}
	
	modelPrediction () {
		if(!this.results) return;
		const modelPredictionData = this.results.reduce((accumulator, currentValue) => accumulator.confidence > currentValue.confidence? accumulator:currentValue); 		
		return  modelPredictionData;
	}
}

const genderModelURL = 'https://teachablemachine.withgoogle.com/models/7zojvxBV6/';
const ageModelURL = 'https://teachablemachine.withgoogle.com/models/7b1fjdwZX/';
const glassesModelURL = 'https://teachablemachine.withgoogle.com/models/pPsE50dcv/';

const genderMachine = new TeachableMachineModel(genderModelURL);
const ageMachine = new TeachableMachineModel(ageModelURL);
const glassesMachine = new TeachableMachineModel(glassesModelURL);

const teachableMachineModels = [genderMachine, ageMachine, glassesMachine];

let cam; 


function preload() {
	
	for (model of teachableMachineModels) {
		const classifier = ml5.imageClassifier(model.imageModelURL + 'model.json'); 
		model.setModel(classifier);
	}
}


function setup() {
	const viewport = createCanvas(480, 360); 
	viewport.parent('video_container'); 
	frameRate(24); 
	cam = createCapture(VIDEO);
	cam.hide();
	classify(teachableMachineModels); 
}


function classify(teachableMachineModelsArr) {

		if (document.hasFocus()) {
			for (model of teachableMachineModelsArr) {
				const processor = processResults.bind(model);
				model.model.classify(cam, processor);
			}
		}
		setTimeout(() => classify(teachableMachineModels, 400)); 
}

function processResults(error, results) {
	if (error) { 
		console.error("classifier error: " + error);
	} else { 
		const modelResults = results.reduce((resultsAccumulation, result) => { 
			return [...resultsAccumulation, {label: result.label, confidence: result.confidence}]
		},[]) 
		this.setResults(modelResults);
	}
}


function draw() {
	background("#c0c0c0");
	image(cam, 0, 0); 
	formatResponse(teachableMachineModels, confidenceInPrediction);
}
