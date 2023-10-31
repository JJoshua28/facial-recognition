function confidenceInPrediction(confidencePercentage) { 
	if (confidencePercentage < 60) {
		return "could be";
	} else if (confidencePercentage < 80) {
		return "is likely";
	} else {
		return "is";
	}
}

function formatResponse (teachableMachineModelsArr, confidenceInPredictionGenerator) {
	teachableMachineModelsArr.forEach((model, index) => {
		const modelResult = model.modelPrediction();
		if (!modelResult) return "Please wait";
		const resultConfidencePercentage = (modelResult.confidence * 100).toFixed(0);
		const elementText = `Subject ${confidenceInPredictionGenerator(resultConfidencePercentage)} ${modelResult.label} (${resultConfidencePercentage}%)`;
		document.getElementById(`results${index + 1}`).innerHTML = elementText;
	
	});

}