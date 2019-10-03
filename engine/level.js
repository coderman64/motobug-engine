var level = [[]];


//[-1,-1,-1,-1,-1,-1,-1,-1,-1,    -1,-1,-1,-1,     -1,     -1,     -1,     -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],

function arrayRings(thisLevel,x,y,w,h,sx,sy){
    for(var x1 = 0; x1 < w; x1++){
        for(var y1 = 0; y1 < h; y1++){
            thisLevel[0][thisLevel[0].length] = new ring(x+x1*sx,y+y1*sy,16,16,"res/items/ring.png");
        }
    }
}

function loopRings(thisLevel,cX,cY,r,a,oa,n){//center x, center y, radius, angle (between rings), offset angle,  total number (of rings)
    for(var ringNo = 0; ringNo < n; ringNo++){
        thisLevel[0][thisLevel[0].length] = new ring(cX+r*Math.cos(oa+a*ringNo),cY+r*Math.sin(oa+a*ringNo),16,16,"res/items/ring.png");
        console.log((ringNo).toString()+","+(cX+r*Math.cos(a*ringNo))+","+(cY+r*Math.sin(a*ringNo)));
    }
}

var newScript = null;

function loadLevel(levelName){
    if(newScript != null){
        document.body.removeChild(newScript);
    }
    newScript = document.createElement("script");
    newScript.src = levelName+".js";
    document.body.appendChild(newScript);
}

var levelsList = ["CG-lev1","level1","level2"];
var currentLevel = -1;

function loadNextLevel(){
    currentLevel++;
    if(currentLevel >= levelsList.length){
        currentLevel = 0;
    }
    loadLevel("levels/"+levelsList[currentLevel])
}

loadNextLevel();

var levelName = [
"Seaside Rush",
"Zone",
"ACT 1"
];