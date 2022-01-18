// titleScreen.js is a part of the Motobug Engine by Coderman64
// it can be redistributed under the MIT license.

// this file contains all the code for the titlescreen, menus, and anything else that
// you see before the actual gameplay starts. 

// It is mostly some rather hacky code that I put together to get ready for SAGE, so 
// please excuse the mess.

// TODO:
// - clean up code
// - remove magic numbers
// - make the code much more re-usable and customizable 
//      without serious javascript editing.


// the two images for the title itself. 
// A forground image, and a background image. 
// These float slightly independently, so plan your logos accordingly
var titleScreenImg = [
    newImage("res/Title/Title_Background.png"),
    newImage("res/Title/Title_Foreground.png")
]

// set to true to immediately start the game in the first level
var SKIP_TITLE=false;

// the times in the intro video (in seconds) that the user can skip to 
// with the start button. This is usually between logos, and at the end 
// (if you want the user to be able to skip the last logo)
var introSkipSections = [
    4.9,
    8.5
];

// local state variables (I don't remember what they are for...)
var titleTimer = -70;
var inMenu = false;
var continueActive = false;
var startActive = false;
var menuMusicStarted = false;
var titleFadeout = 0;
var menuFadeout = 0;
var startTime = 0;
var logosActive = true;
var logosStarted = false;
var skipDown = false;

// enable video element
var logoVid = document.createElement("video"); // the video element for the intro video
var mp4src = document.createElement("source"); // the MP4-format source for the intro video (for compatibility)
mp4src.src = "res/Title/logos.mp4";
mp4src.type = "video/mp4";
var webmsrc = document.createElement("source"); // the WEBM-format source for the intro video (for compatibility)
webmsrc.src = "res/Title/logos_2.webm";
webmsrc.type = "video/webm";
logoVid.appendChild(mp4src);
logoVid.appendChild(webmsrc);
logoVid.loop = false;
logoVid.style.zIndex = "0";
logoVid.muted = false;
document.body.appendChild(logoVid);

// savefile-related state variables 
var currentSave = 0;
var saveAnim = 0;
var pSaveSelect = false;
var charSelectMode = false;
var selectChar = 0;

// a local state variable that stores all the savedata for display.
var saves = [{
    level: 0,
    char: 0
},
{
    level: 0,
    char: 0
},
{
    level: 0,
    char: 0
}];

// the preview for when the save file is new.
var emptyImg = newImage("res/previews/Empty.png");

// stores other previews
var previews = [];

// the names for all the levels. Hopefully this is changed by Motobug Studio, but we'll see.
var levelNames = [
    "CRYSTAL GEYSER",
    "CHAOS CAUSEWAY",
    "SPECIAL STAGE"
]

// I probably want to get rid of these savefile canvases at some point
var saveCanvis = [
    document.createElement("canvas"),
    document.createElement("canvas"),
    document.createElement("canvas"),
]

// initialize save canvases. 
var saveCtx = [];
for(var i = 0; i < saveCanvis.length; i++){
    saveCtx[i] = saveCanvis[i].getContext("2d");
}

// NOTE: why are these here? Is it overriding something?
window.addEventListener("touchdown",function(e){});
window.addEventListener("touchup",function(){})

var pTouch = {x:0,y:0,active:false};

// additional state variables
var deleteSaveMode = false;
var pBGMusicTime = 0;
var pPerfNow = 0;

function titleScreen(){
    if(configuration.skipMenus){
        titleActive = false;
        backgroundMusic.volume = 1;
        logoVid.currentTime = 100;
        backgroundMusic.muted = false;
    }

    if(logosActive){ // --- INTRO VIDEO --- 
        introVideo();
    }
    else if(!inMenu){ // --- TITLE SCREEN ---
        pressStartScreen();
    }
    else // --- SAVE FILE MENU --- 
    {
        saveFileMenu();
    }
}

function introVideo(){
    /// this section runs during the intro video, which is usually a bunch of logos 
    // proclaiming who made the game and stuff. 
    // the main canvas should be behind this video, so nothing much needs to go on here, 
    // except for the "skip" button, which skips to certain times in the video to skip logos.
    c.fillStyle = "#000000";
    c.fillRect(0,0,vScreenW,vScreenH);
    if(!logosStarted){
        backgroundMusic.pause();
        logoVid.play();
        logoVid.addEventListener('ended',function(e){
            logosActive = false;
            logoVid.remove();
        });
        if(logoVid.networkState == 3){
            logosActive = false;
        }
    }
    if(keysDown[configuration.startKey]){
        if(!skipDown){
            for(var i = 0; i < introSkipSections.length; i++){
                if(logoVid.currentTime < introSkipSections[i]){
                    logoVid.currentTime = introSkipSections[i];
                    break;
                }
            }
        }
        skipDown = true;
    }
    else
    {
        skipDown = false;
    }
}

function pressStartScreen() {
    // this is the game's title screen. Most games should just be able to get away with replacing the two 
    // layers for the title graphic, the background, and the music. 

    // this section uses many magic numbers, and should be commonly referred to as "bad code"

    if(titleTimer == -70){
        // play the title menu music (usually a theme of some variety)
        backgroundMusic.innerHTML = "";
        backgroundMusic.appendChild(addSource("res/music/TitleV2.ogg"));
        backgroundMusic.appendChild(addSource("res/music\\TitleV2.mp3"));
        backgroundMusic.load();

        // the starting time, recorded to sync the title with the music. 
        startTime = backgroundMusic.currentTime*3/50+70;
        titleTimer = 0;
        logoVid.remove();
        pBGMusicTime = backgroundMusic.currentTime;
        pPerfNow = performance.now();
        menuFadeout = 0;
        menuMusicStarted = false;
        charSelectMode = false;
    }

    if(pBGMusicTime == backgroundMusic.currentTime){
        // console.log("dup Frame at "+backgroundMusic.currentTime.toString());
        titleTimer += (performance.now()-pPerfNow)/1000;
        
    }
    else
    {
        titleTimer = backgroundMusic.currentTime*3000/50-40;//-startTime;
        pBGMusicTime = backgroundMusic.currentTime;
    }
    pPerfNow = performance.now();
    //console.log("TIME: "+backgroundMusic.currentTime+"\nTIMER: "+titleTimer);
    c.fillStyle = "#000000";
    c.fillRect(0,0,vScreenW,vScreenH);

    if(titleTimer>120){
        cBack = 0;
        drawBack(c);
        cam.tx -= 1;
    }
    c.drawImage(titleScreenImg[0],vScreenW/2-titleScreenImg[0].width/2,
        vScreenH/2-titleScreenImg[0].height/2+Math.floor(Math.sin(titleTimer/20)*5)
        +(titleTimer<100?Math.pow((250-(titleTimer+400)/2),2)/2:0));
    c.drawImage(titleScreenImg[1],vScreenW/2-titleScreenImg[1].width/2,
        vScreenH/2-titleScreenImg[1].height/2+Math.floor(Math.sin(titleTimer/20-1)*5)
        +(titleTimer<50?-Math.pow((250-(titleTimer+450)/2),2)/2:0));
    if(titleTimer>120){
        c.fillStyle = "rgba(255,255,255,"+(1-(titleTimer-110)/100).toString()+")";
        c.fillRect(0,0,vScreenW,vScreenH);
        c.textAlign = "center";
        c.fillStyle = "white";
        c.fillText("Press <Enter>",vScreenW/2,vScreenH-20);
    }
    if(titleFadeout > 0){
        titleFadeout++;
        c.fillStyle = "rgba(0,0,0,"+(titleFadeout/50).toString()+")";
        c.fillRect(0,0,vScreenW,vScreenH);
        backgroundMusic.volume = (51-titleFadeout)/50;
        if(titleFadeout>50){
            inMenu = true;
            titleTimer = -70;
        }
    }
    if(titleTimer > 2800){
        c.fillStyle = "rgba(0,0,0,"+((titleTimer-2800)/100).toString()+")";
        c.fillRect(0,0,vScreenW,vScreenH);
    }
    if(keysDown[configuration.startKey]){
        if(startActive&&titleFadeout<=0&&titleTimer > 120){
            titleFadeout = 1;
            // inMenu = true;
            console.log("LEVELS: "+levelsList.length);
            for(var i = 0; i < levelsList.length; i++){
                previews[i] = newImage("res/previews/"+i.toString()+".png");
            }
        }
    }
    else
    {
        startActive = true;
    }
}

function saveFileMenu(){
    // here is the code for the save file menu. There are three save file slots, and a delete 
    // option.

    // this is overcomplicated by the use of seperate canvases to render each save slot onto. 
    // I want to eventually get rid of this arrangement, and simply this code. 

    // also, the background is hardcoded below, instead of using the background.js subsystem.

    if(!menuMusicStarted){

        // play the menu music, called "Choice Chooser"
        backgroundMusic.innerHTML = "";
        backgroundMusic.appendChild(addSource("res/music/ChoiceChooser.ogg"));
        backgroundMusic.appendChild(addSource("res/music\\ChoiceChooser.mp3"));
        backgroundMusic.load();
        backgroundMusic.play(); 
        menuMusicStarted = true;

        // load all the save files from localstorage into memory (the saves object, specifically)
        for(var i = 0; i < 3; i++){
            if(window.localStorage.getItem(i.toString()+"_level")){
                saves[i].level = Number(window.localStorage.getItem(i.toString()+"_level"));
            }
            else
            {
                saves[i].level = null;
            }
            if(window.localStorage.getItem(i.toString()+"_char") != null){
                saves[i].char = Number(window.localStorage.getItem(i.toString()+"_char"));
            }
            else
            {
                saves[i].char = null;
            }
        }
    }

    backColorA = "#FFEE55";
    backColorB = "#FFAA55";
    if(deleteSaveMode){
        backColorA = "#FF5555";//"#f95c5f";
        backColorB = "#aa1111";
    }

    titleTimer = Date.now() / 50;
    c.fillStyle = backColorA;
    c.fillRect(0,0,vScreenW+80,vScreenH+80);
    c.strokeStyle = backColorB;
    c.beginPath();
    c.arc(vScreenW/2,vScreenH/2,75+50*Math.cos(titleTimer/30),
        5*Math.cos(titleTimer/50),360+5*Math.cos(titleTimer/50));
    c.arc(vScreenW/2,vScreenH/2,75+50*Math.cos(titleTimer/20),
        5*Math.cos(titleTimer/50),360+5*Math.cos(titleTimer/50));
    c.lineWidth = 5;
    c.stroke();
    c.fillStyle = backColorB;
    c.beginPath();
    c.arc(vScreenW/2+Math.cos(5*Math.cos(titleTimer/45))*(75+50*Math.cos(titleTimer/20)),
        vScreenH/2+Math.sin(5*Math.cos(titleTimer/45))*(75+50*Math.cos(titleTimer/20)),
        15,0,360);
    c.arc(vScreenW/2+Math.cos(5*Math.cos(titleTimer/37)+3)*(75+50*Math.cos(titleTimer/30)),
        vScreenH/2+Math.sin(5*Math.cos(titleTimer/37)+3)*(75+50*Math.cos(titleTimer/30)),
        21,0,360);
    c.fill();
    saveAnim += (currentSave-saveAnim)*0.1;

    for(var i = 0; i < saveCtx.length; i++){
        saveCanvis[i].width = Math.floor(vScreenW/3)+5;
        saveCanvis[i].height = vScreenH*3/4+5;

        saveCtx[i].lineWidth = 2;
        saveCtx[i].strokeStyle = "#000000AA";
        saveCtx[i].strokeRect(Math.round(Math.max(0,4-3*(i-saveAnim)**2)),
            Math.round(Math.max(0,4-3*(i-saveAnim)**2)),
            Math.floor(vScreenW/3),vScreenH*3/4);
        saveCtx[i].strokeStyle = deleteSaveMode?"#FFEE55":"#FF2200";
        saveCtx[i].strokeRect(1,1,
            Math.floor(vScreenW/3),vScreenH*3/4);

        // reset completed savefiles
        if(saves[i]&&saves[i].level && saves[i].level == 3){
            saves[i].level = 0;
            window.localStorage.setItem(i.toString()+"_level",0);
        }

        var saveImg = emptyImg;
        var saveTitle = "???";
        var continueText = "New";
        if(saves[i]&&saves[i].level != null){
            saveImg = previews[saves[i].level];
            saveTitle = levelNames[saves[i].level];
            continueText = "Continue";
            if(deleteSaveMode){
                continueText = "Delete";
            }
        }

        saveCtx[i].drawImage(saveImg,Math.floor(vScreenW/6-50),25);

        saveCtx[i].textAlign = "center";
        saveCtx[i].textBaseline = "middle";
        saveCtx[i].font = "20px sans-serif";
        saveCtx[i].fillStyle = "black";
        saveCtx[i].fillText(continueText,vScreenW/6+1,vScreenH*0.5/8+1);
        saveCtx[i].fillStyle = "white";
        saveCtx[i].fillText(continueText,vScreenW/6,vScreenH*0.5/8);
        saveCtx[i].font = "12px sans-serif";
        saveCtx[i].fillStyle = "black";
        saveCtx[i].fillText(saveTitle,vScreenW/6+1,vScreenH*3/8+1);
        saveCtx[i].fillStyle = "white";
        saveCtx[i].fillText(saveTitle,vScreenW/6,vScreenH*3/8);
        
        if(saves[i]&&saves[i].char != null){
            drawCharFrame(possChars[saves[i].char].spriteSheet,possChars[saves[i].char].anim.stand[0],
                Math.floor(vScreenW/2+(saveCanvis[i].width+30)*(i-saveAnim)),Math.floor(vScreenH*3/4));
        }
        if(charSelectMode&&currentSave==i){
            drawCharFrame(possChars[selectChar].spriteSheet,possChars[selectChar].anim.stand[0],
                Math.floor(vScreenW/2+(saveCanvis[i].width+30)*(i-saveAnim)),Math.floor(vScreenH*3/4));
            }
        
        c.drawImage(saveCanvis[i],Math.floor(vScreenW/3+(saveCanvis[i].width+30)
            *(i-saveAnim)),vScreenH/8,saveCanvis[i].width,saveCanvis[i].height);
    }

    c.lineWidth = 2;
    c.strokeStyle = "#000000AA";
    c.strokeRect(Math.floor(vScreenW/3+(saveCanvis[0].width+30)*(-1-saveAnim))+Math.round(Math.max(0,4-3*(-1-saveAnim)**2)),
        vScreenH/8+Math.round(Math.max(0,4-3*(-1-saveAnim)**2)),
        Math.floor(vScreenW/3),Math.floor(vScreenH/3))
    c.strokeStyle = deleteSaveMode?"#FFEE55":"#FF2200";
    c.strokeRect(Math.floor(vScreenW/3+(saveCanvis[0].width+30)*(-1-saveAnim)),vScreenH/8,Math.floor(vScreenW/3),Math.floor(vScreenH/3));

    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "20px sans-serif";
    c.fillStyle = "black";
    c.fillText("Delete",1+Math.floor(vScreenW/2+(saveCanvis[0].width+30)*(-1-saveAnim)),vScreenH*1.5/8+1);
    c.fillStyle = "white";
    c.fillText("Delete",Math.floor(vScreenW/2+(saveCanvis[0].width+30)*(-1-saveAnim)),vScreenH*1.5/8);

    if(titleFadeout>0){
        titleFadeout--;
        c.fillStyle = "rgba(0,0,0,"+(titleFadeout/50).toString()+")";
        c.fillRect(0,0,vScreenW,vScreenH);
        backgroundMusic.volume = Math.min((51-titleFadeout)/50,1);
    }
    if(menuFadeout>0){            
        menuFadeout++;
        c.fillStyle = "rgba(0,0,0,"+(menuFadeout/50).toString()+")";
        c.fillRect(0,0,vScreenW,vScreenH);
        backgroundMusic.volume = Math.min((51-menuFadeout)/50,1);
        if(menuFadeout > 50){
            var store = window.localStorage;
            currentLevel = -1;
            if(store.getItem(currentSave.toString()+"_level")){
                currentLevel = store.getItem(currentSave.toString()+"_level")-1;
            }
            store.setItem(currentSave.toString()+"_level",currentLevel+1);
            charNum = selectChar;
            if(store.getItem(currentSave.toString()+"_char") != null){
                charNum = store.getItem(currentSave.toString()+"_char");
            }
            store.setItem(currentSave.toString()+"_char",charNum);
            setChar(possChars[charNum]);
            // localstorage requirements:
            // lives, continues, level, emeralds
            titleActive = false;
            loadNextLevel();
            resetLevel();
            backgroundMusic.volume = 1;
        }
    }


    if(keysDown[39]||avgTouch.x-pTouch.x < -40&&avgTouch.active&&pTouch.active){
        if(!pSaveSelect&&currentSave < 2&&!charSelectMode){
            currentSave += 1;
        }
        else if(!pSaveSelect&&charSelectMode){
            selectChar++;
        }
        pSaveSelect = true;
    }
    else if(keysDown[37]||avgTouch.x-pTouch.x > 40&&avgTouch.active&&pTouch.active){
        if(!pSaveSelect&&currentSave > -1&&!charSelectMode){
            currentSave -= 1;
        }
        else if(!pSaveSelect&&charSelectMode){
            selectChar--;
        }
        pSaveSelect = true;
    }
    else
    {
        if(!avgTouch.active){
            pSaveSelect = false;
        }
    }
    if(selectChar < 0){
        selectChar = possChars.length-1;
    }
    if(selectChar >= possChars.length){
        selectChar = 0;
    }

    if(keysDown[configuration.startKey]||
        (pTouch.active&&!avgTouch.active&&
            Math.abs(pTouch.x-startTouch.x) < 50&&
            Math.abs(pTouch.y-startTouch.y) < 50)){
        if(continueActive&&deleteSaveMode){
            if(currentSave == -1){
                deleteSaveMode = false;
            }
            else if(currentSave >= 0&&(saves[currentSave]&&saves[currentSave].char != null))
            {
                if(confirm("Are you sure you want to delete this savefile? This action cannot be undone!")){
                    window.localStorage.removeItem(currentSave+"_level");
                    window.localStorage.removeItem(currentSave+"_char");
                    for(var i = 0; i < 3; i++){
                        if(window.localStorage.getItem(i.toString()+"_level")){
                            saves[i].level = Number(window.localStorage.getItem(i.toString()+"_level"));
                        }
                        else
                        {
                            saves[i].level = null;
                        }
                        if(window.localStorage.getItem(i.toString()+"_char") != null){
                            saves[i].char = Number(window.localStorage.getItem(i.toString()+"_char"));
                        }
                        else
                        {
                            saves[i].char = null;
                        }
                    }
                }
                continueActive = false;
            }
        }
        else
        {
            if(continueActive&&menuFadeout == 0&&currentSave >= 0&&(saves[currentSave]&&saves[currentSave].char != null||charSelectMode)){
                menuFadeout = 1;
                if(charSelectMode){
                    saves[currentSave].char = selectChar;
                }
            }
            else if(continueActive&&currentSave >= 0&&!(saves[currentSave]&&saves[currentSave].char != null)){
                charSelectMode = true;
            }
            else if(continueActive&&currentSave == -1){
                deleteSaveMode = true;
            }
        }
        continueActive = false;
    }
    else
    {
        continueActive = true;
    }
    pTouch.x = avgTouch.x;
    pTouch.y = avgTouch.y;
    pTouch.active = avgTouch.active;
}
