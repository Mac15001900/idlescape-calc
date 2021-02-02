var MAX_AUGMENT = 50;

var bp = 0;
var chances = 0;
var goal = 0;
var baseXp = 0;
var augCost = 0;
var itemCost = 0;
var itemLevel = 0;

//Probability of augmenting from (level-1) to level
p = function p(level) { 
	var res = Math.pow(bp,level) + chances/100;
	if(res>1) res=1;
	return(res);
}

//Probability of augmenting from startLevel to endLevel
cp = function cp(endLevel, startLevel) {
	if(startLevel>0) return cp(endLevel)/cp(startLevel);

	var res=1;
	for (var i = 1; i <= endLevel; i++) {
		res*= p(i);
	}
	return(res);
} 

//Xp gained by agumenting to a given level
function xpGain(level){
	return Math.pow(level,1.5) * baseXp;
}

//Xp gained by augmenting from startLevel to endLevel (if successful)
function cXpGain(endLevel, startLevel){
	if(startLevel === undefined) startLevel = 0;

	var res = 0;
	for (var i = startLevel+1; i < endLevel; i++) {
		res += xpGain(i);
	}
	res += xpGain(endLevel)/2; //Assuming the final augment fails, i.e. gives half xp
	return res;
}

function output(number, value){
	document.getElementById("o"+number).innerHTML = value;
}

function input(name) {
	try{
		var res = document.getElementById(name).value;
		res = res.toLowerCase();
		res = res.replace(/k/g,"000");
		res = res.replace(/m/g,"000000");
		res = res.replace(/b/g,"000000000");
		console.log(res);
		var value = eval(res);
		if(isNaN(value)) {
			value=0;
			document.getElementById(name).style="color:#FF0000";
		}
		else document.getElementById(name).style="color:#000000";
		return(value);	
	} catch(err){
		document.getElementById(name).style="color:#FF0000";
		return 0;
	}	
}

function updateFields() {
	enchantingLevel = input("enchantingLevel");
	bp = 0.9 + (Math.sqrt(enchantingLevel * 1.5) / 200);
	chances = input("chances");
	goal = input("goal");
	baseXp = input("xp");
	augCost = input("augCost");
	itemCost = input("itemCost");
	itemLevel = input("itemLevel");

	//Deal with weird inputs
	if(bp>1) bp/=100;
	if(goal>1000){
		if(goal>Math.pow(10,10)) alert("Nope.")
		else if(goal>1000000) alert("I'm not running any of this.")
		else alert("For the sake of your computer, please stop.");
		return;
	}

	averageWaste = 0;
	for (var i = 1; i <= goal; i++) {
		averageWaste+= i*(cp(i-1)*(1-p(i)));
	}
	successChance = cp(goal);

	output(1, goal+averageWaste/successChance);
	output(2, 1/successChance);
	output(3, (successChance*100)+"%");
	output(35, (goal+averageWaste/successChance)*augCost + (1/successChance)*itemCost);

	avrAugs = 0;
	avrXp = 0;
	for (var i = 1; i <= MAX_AUGMENT; i++) {
		avrAugs+= i*(cp(i-1))*(1-p(i));
		avrXp+= cp(i-1)*(1-p(i)) * cXpGain(i);
	}

	document.getElementById("o4").innerHTML = ""+avrAugs;
	document.getElementById("o5").innerHTML = ""+avrXp;
	document.getElementById("o6").innerHTML = ""+avrXp/avrAugs;
	var xpCost = (itemCost+augCost*avrAugs)/avrXp;
	document.getElementById("o7").innerHTML = ""+xpCost;

	//Calculating xp from purchased item
	boughtXp = 0;
	boughtAugs = 0;
	for (var i = itemLevel+1; i <= MAX_AUGMENT; i++) {
		//Probability we end up at lvl i-1 (so we get to try for i), times the xp gain from it, reduced by the chance it will fail:
		boughtXp += cp(i-1, itemLevel) * xpGain(i) * (0.5 + 0.5*p(i));
		boughtAugs += cp(i-1, itemLevel); 
	}

	document.getElementById("o8").innerHTML = ""+boughtXp;
	document.getElementById("o9").innerHTML = ""+(boughtXp*xpCost - boughtAugs*augCost);

}

//Update everything on any keypress. Triggering on keydown would have been too early
window.addEventListener("keyup", function (event) {
  updateFields();
});

//Finally run an update after everything has loaded
updateFields();