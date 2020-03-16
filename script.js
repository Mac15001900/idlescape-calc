changeHandler = function changeHandler() {
	var bp = Number(document.getElementById("bp").value);
	var goal = Number(document.getElementById("goal").value);
	var xp = Number(document.getElementById("xp").value);

	if(bp>1) bp/=100;

	averageWaste = 0;
	for (var i = 1; i <= goal; i++) {
		averageWaste+= i*(Math.pow(bp,(i-1)*i/2))*(1-Math.pow(bp,i));
	}
	successChance = Math.pow(bp,goal*(goal+1)/2);



	document.getElementById("o1").innerHTML = ""+(goal+averageWaste/successChance);
	document.getElementById("o2").innerHTML = ""+(1/successChance);
	document.getElementById("o3").innerHTML = ""+(successChance*100)+"%";

	avrAugs = 0;
	for (var i = 1; i <= 50; i++) {
		avrAugs+= i*(Math.pow(bp,(i-1)*i/2))*(1-Math.pow(bp,i));
	}

	avrXp = 0;
	for (var i = 1; i <= 50; i++) {
		avrXp+= (Math.pow(bp,(i-1)*i/2))*(1-Math.pow(bp,i)) * xpTillN(i) * xp;
	}

	document.getElementById("o4").innerHTML = ""+avrAugs;
	document.getElementById("o5").innerHTML = ""+avrXp;
	document.getElementById("o6").innerHTML = ""+avrXp/avrAugs;

}

xpTillN = function xpTillN(n) {
	var res = 0;
	for (var i = 1; i <= n; i++) {
		res+=Math.pow(1.5,i-1);
	}
	return res;
}


//Loop from https://stackoverflow.com/questions/10760847/entire-form-onchange#10760931
var inputs = document.getElementsByTagName("input"); 
for (i=0; i<inputs.length; i++){
   inputs[i].onchange = changeHandler;
}