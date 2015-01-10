function LogicSimApp()
{
	this.__proto__ = new LogicSim();


	this.initialize = function(canvas, circuit)
	{
		this.setCanvas(canvas);
		
		this.setGridSize(16);
		Saving.load(this, circuit);
		
		this.setReadOnly(true);
		this.onResizeCanvas();
	},
	
	this.onResizeCanvas = function(){
		var c =	this.getCanvas();
		var mrg = 5;
		c.parentNode.style.width  = window.innerWidth /2;
		c.parentNode.style.height = window.innerHeight/2;
		c.width = window.innerWidth /2-4*(mrg+1);
		c.height= window.innerHeight/2-2*(mrg+1)-30;
		this.centerOnCanvas();
	}		
}

logicSim =[];
circuits = [
	// AND example
	"N4IglgxgziBcDaBdANCATgewwFzqA5gIbYCmMCousIA8gK7YAODAImFIwDaECeIqADzgBmAEwAGVH1gBOAGyoMcJKgAmcAHZ1OnAL7JKcEAGEMGqNgCSG5rkFwAjHMkhpD0QA5FygGaFOUCQoIOqwfgEk+obUpuZWNgz8IEKwTi7ScgAs3gjhgcGheZEGIFQgAIIaqgDixCRJKaKZ6XDyOfBFBZraesEA7mBoZMqgUI3NqFDSHi4k47Nu4plRIGNwok2T07PzqCTbK2uwTS5TjhJ7uyD7jpnLJUcb2atud5frE9ev96MpwktbRzud6wMQLIGiXSIXS6IAA==",
	// OR example
	"N4IglgxgziBcDaBdANCATgewwFzqA5gIbYCmMCousIA8gK7YAODAImFIwDaECeIqADzgB2ABwAWVH1gBGAGwAGVBjhJUAEzgA7Op04BfZJTggAwhi1RsASS3NcguHIBMkkNJkBOZ8tUAzQk4oEhQQTVgAoJJDY2pzSxs7Bn4QIVgXNw9nUV8ESODQ8PzooxAqWjQAcWISFLThBUy4eSUQFTzAgo1tXQNQgHcwNDJVUCg0uVEckCgPcTcSesbUEjnxGJmlt1nm+ZWtlY9JjfGnKdQd2GcFacWRZZBVuGvRE4OZjwl9+4XpF7eRJMLh5hHJvrAxL9mqD9Ih9PogAA=",
	// XOR example
	"N4IglgxgziBcDaBdANCATgewwFzqA5gIbYCmMCousIA8gK7YAODAImFIwDaECeIqADzgB2ABwAWVH1gBGAGwAGVBjhJUAEzgA7Op04BfZJTggAwhi1RsASS3NcguHIBMkkNJkBOZ8tUAzQk4oEhQQTVgAoJJDY2pzSxs7Bn4QIVgXNw9nUV8ESODQ8PzooxAqEAANDDQAcWISFLThBUy4eSUQFQQFQu1dA1CAdzA0MlVQKDS5URyQKA9xNxImltQSBfEYuZW3ebbFtZ21j2mtyacZ1D3YZwVZ5ZFVkHW4W9Ezo7mPCUPHpek3h8RNMrh5hHJfrAxP82uD9Ih9PogAA==",
	// NOT example
	"N4IglgxgziBcDaBdANCATgewwFzqA5gIbYCmMCousIAwhgHZTYCS9ADgK66oAecATAA5BqAJ5wALCJAY48AGaEANlBIoQAEziKVJAL7JKcEAHkunbABEwUNksLjekqWMnTZCdVtj0OSpQZG1AByOADixCQgTrAAzABs0uKwLjJy2Ggcaqjevv566gDuYGhkcqBQfHEArPyoUMnxEqgkVQnSJI0SgSCVkrF1vV0tVRKpnXBNBXp6QAA=="
	];
	
for (var i=0;i<circuits.length;i++){
	logicSim.push(new LogicSimApp());
}


function runApp(){
	for (i=0;i<logicSim.length;i++){
		var canvas = document.getElementById("canvas"+i);
		logicSim[i].initialize(canvas, circuits[i]);
		logicSim[i].run(20);
	}
		
}
window.onload = function(e)
{
	if (!images.allImagesLoaded()) {
		images.onAllLoaded = function()
		{
			runApp();
		}
	} else {
		runApp();
	}
}
