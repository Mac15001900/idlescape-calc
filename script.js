var MAX_AUGMENT = 50;

var bp = 0;
var chances = 0;
var goal = 0;
var xp = 0;
var augCost = 0;
var itemCost = 0;
var itemLevel = 0;

p = function p(level) {
	var res = Math.pow(bp,level) + chances/100;
	if(res>1) res=1;
	return(res);
}

cp = function cp(endLevel, startLevel) {
	if(startLevel>0) return cp(endLevel)/cp(startLevel);

	var res=1;
	for (var i = 1; i <= endLevel; i++) {
		res*= p(i);
	}
	return(res);
	
}

changeHandler = function changeHandler() {
	bp = Number(document.getElementById("bp").value);
	chances = Number(document.getElementById("chances").value);
	goal = Number(document.getElementById("goal").value);
	xp = Number(document.getElementById("xp").value);
	augCost = Number(document.getElementById("augCost").value);
	itemCost = Number(document.getElementById("itemCost").value);
	itemLevel = Number(document.getElementById("itemLevel").value);

	if(bp>1) bp/=100;

	if(goal>1000){
		alert("For the sake of your computer, I will not run this.");
		return;
	}
	if(itemLevel>40) alert("Note that only augments up to +50 are counted in xp calculations");

	averageWaste = 0;
	for (var i = 1; i <= goal; i++) {
		averageWaste+= i*(Math.pow(bp,(i-1)*i/2))*(1-Math.pow(bp,i));
	}
	successChance = Math.pow(bp,goal*(goal+1)/2);



	document.getElementById("o1").innerHTML = ""+(goal+averageWaste/successChance);
	document.getElementById("o2").innerHTML = ""+(1/successChance);
	document.getElementById("o3").innerHTML = ""+(successChance*100)+"%";
	document.getElementById("o35").innerHTML = ""+
		((goal+averageWaste/successChance)*augCost + (1/successChance)*itemCost);

	avrAugs = 0;
	for (var i = 1; i <= MAX_AUGMENT; i++) {
		avrAugs+= i*(Math.pow(bp,(i-1)*i/2))*(1-Math.pow(bp,i));
	}

	avrXp = 0;
	for (var i = 1; i <= MAX_AUGMENT; i++) {
		avrXp+= (Math.pow(bp,(i-1)*i/2))*(1-Math.pow(bp,i)) * xpTillN(i) * xp;
	}

	document.getElementById("o4").innerHTML = ""+avrAugs;
	document.getElementById("o5").innerHTML = ""+avrXp;
	document.getElementById("o6").innerHTML = ""+avrXp/avrAugs;
	var xpCost = (itemCost+augCost*avrAugs)/avrXp;
	document.getElementById("o7").innerHTML = ""+xpCost;

	//Calculating xp from purchased item
	boughtXp = 0;
	boughtAugs = 0;
	var skippedProb = (itemLevel+1)*itemLevel/2;
	for (var i = itemLevel+1; i <= MAX_AUGMENT; i++) {
		boughtXp += Math.pow(bp,(i-1)*i/2 - skippedProb) * Math.pow(i,1.5) * xp;
		boughtAugs += (i-itemLevel)*(Math.pow(bp,(i-1)*i/2))*(1-Math.pow(bp,i));
	}

	document.getElementById("o8").innerHTML = ""+boughtXp;
	document.getElementById("o9").innerHTML = ""+(boughtXp*xpCost - boughtAugs*augCost);

}

xpTillN = function xpTillN(n) {
	var res = 0;
	for (var i = 1; i <= n; i++) {
		res+=Math.pow(i,1.5);
	}
	return res;
}


//Loop from https://stackoverflow.com/questions/10760847/entire-form-onchange#10760931
var inputs = document.getElementsByTagName("input"); 
for (i=0; i<inputs.length; i++){
   inputs[i].onchange = changeHandler;
}