// level.js

// contains code for keeping track of level data, loading in levels over the internet 
// (so the entire game doesn't exist in your browser at once), and stashing levels,
// which allows them to be momentarily interrupted then returned to (like with special stages)

var level = [[]];
/*A level is an array of arrays. level[0] stores objeccts like rings and level[1] and onward are rows of level chunks*/

var loading = false;

//[-1,-1,-1,-1,-1,-1,-1,-1,-1,    -1,-1,-1,-1,     -1,     -1,     -1,     -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],

function spawn (thisLevel, thisItem)
{
    thisLevel[0][thisLevel[0].length] = thisItem;
}


function loopRings(thisLevel,cX,cY,r,a,oa,n){
    //center x, center y, radius, angle (between rings), offset angle,  total number (of rings)
    for(var ringNo = 0; ringNo < n; ringNo++){
        thisLevel[0][thisLevel[0].length] = new ring(cX+r*Math.cos(oa+a*ringNo),cY+r*Math.sin(oa+a*ringNo),16,16,"res/items/ring.png");
    }
}

var newScript = null;

function loadLevel(levelName){
    if(newScript != null){
        chunks = [0,0];
        level = [[],[]];
        document.body.removeChild(newScript);
        newScript = null;
    }
    newScript = document.createElement("script");
    loadingList.push(newScript);
    newScript.onload = function(event){if(loadingList.includes(event.target)){loadingList.splice(loadingList.indexOf(event.target),1)}}
    newScript.src = levelName+".js";
    document.body.appendChild(newScript);
}

var levelsList = ['CG-lev1'];
var currentLevel = configuration.startLevel-1;

function loadNextLevel(){
    currentLevel++;
    if(currentLevel >= levelsList.length){
        currentLevel = 0;
    }
    loadLevel("levels/"+levelsList[currentLevel]);
    window.setTimeout(renderLevel,1000);
}

var levelStash = [];
var musicStash = [];
var charStash = [];
var chunksStash = [];
var levelIndexStash = [];
var backIndex = [];
var camStash = [];
var levelNameStash = [];
var levelTimerStash = [];

function stashLevel(){
    // musicStash.push({time:backgroundMusic.currentTime,src:backgroundMusic.src});
    musicStash.push(backgroundMusic.innerHTML);
    // backgroundMusic = document.createElement("audio");
    // backgroundMusic.onload = ((event) => {
    //     // console.log("FINISH LOAD");
    //     if(loadingList.includes(event.target)){
    //         loadingList.splice(loadingList.indexOf(event.target));
    //     }
    // });
    // backgroundMusic.onloadstart = function(event){console.log("AAH");if(!loadingList.includes(event.target)){loadingList.push(event.target)}};   
    levelIndexStash.push(currentLevel); 
    levelStash.push(level);
    chunksStash.push(chunks);
    charStash.push(JSON.parse(JSON.stringify(char)));
    backIndex.push(cBack);
    camStash.push(JSON.parse(JSON.stringify(cam)));
    levelNameStash.push(levelName);
    levelTimerStash.push(levelTimer);
}

function destashLevel(){
    // var bkgReturn = musicStash.pop();
    // backgroundMusic.src = bkgReturn.src;
    // backgroundMusic.currentTime = 0;//bkgReturn.time;
    backgroundMusic.innerHTML = musicStash.pop();
    backgroundMusic.load();
    level = levelStash.pop();
    chunks = chunksStash.pop();
    char = charStash.pop();
    currentLevel = levelIndexStash.pop();
    levelRendered = false;
    cBack = backIndex.pop();
    cam = camStash.pop();
    levelName = levelNameStash.pop();
    introAnim = 0;
    levelTimer = levelTimerStash.pop();
    tileFilter = "none";
}

loadNextLevel();

var levelName = [
"Seaside Rush",
"Zone",
"ACT 1"
];
