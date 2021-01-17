level = [
    [
    new devText(128,128*5+64,15,"This is an old development level"),
    new devText(128,128*5+80,15,"You can play around here if you want"),
    new devText(128,128*5+100,15,"but don't expect things to be polished"),
    new spring(1224,736+128,32,32,"res/items/springY.png",10),
    new spring(1536,480+128,32,32,"res/items/springY.png",10),
    new spring(2068,544+64,32,32,"res/items/springY.png",10),
    new spring(46.5*128-16,4.5*128-32,32,32,"res/items/springY.png",10),
    new spring(51.5*128-16,6.5*128-32,32,32,"res/items/springY.png",10),
    //new spikes(1900,736,32,32,"res/items/spikes.png"),
    //new ring(2000,675+128,16,16,"res/items/ring.png"),
    new layerSwitch(1904,512+128,32,32,1,0),
    new layerSwitch(13*128-32,768,32,128,0,0),
    new layerSwitch(17*128,768,32,128,1,1),
    new motobug(2500,599+128,41,41,"res/characters/enemies/motobug.png"),
    new motobug(1300,727+128,41,41,"res/characters/enemies/motobug.png"),
    new motobug(53*128+44,87,41,41,"res/characters/enemies/motobug.png"),
    new motobug(49*128+44,128*1.5+87,41,41,"res/characters/enemies/motobug.png"),
    new layerSwitch(9*128-32,640+128,32,128,0,0),
    new layerSwitch(10*128,640+128,32,128,0,0),
    new VlayerSwitch(9*128,600+128,128,20,1,0),
    new layerSwitch(19*128-32,448+128,32,192,0,0),
    new VlayerSwitch(19*128,408+128,256,20,1,1),
    new layerSwitch(23*128,512+128,32,192,0,0),
    new spring(23*128-32,480+128,32,32,"res/items/springY.png",10),
    new motobug(17*128+64,279+128,41,41,"res/characters/enemies/motobug.png"),
    new spring(25*128+32,288+128,32,32,"res/items/springY.png",10),
    new layerSwitch(33*128-32,128*3,32,128,0,0),
    new layerSwitch(35*128-16,128*2,32,32,1,0),
    new layerSwitch(39*128-32,128*2,32,128,1,1),
    new layerSwitch(41*128-16,128,32,32,0,1),
    new layerSwitch(41*128,4*128,32,128,1,1),
    //new VlayerSwitch(23*128,440,128,20,1,0),
],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,    -1,-1,-1,-1,     -1,     -1,     -1,     -1,-1,-1,-1,    -1,      -1,     -1,     -1,-1,-1,-1,-1,-1, 2,14,14,-1,     -1,    -1,-1,-1,-1,-1,     7,     7, 7, 7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,    -1,-1,-1,-1,     -1,     -1,     -1,     -1,-1,-1,-1,    -1,      -1,      4,      4,-1,-1,-1, 4, 4, 2,14,14,-1,      4,     4, 4,19,-1,-1,    14,     6,17,14,-1,-1,-1,-1,-1,-1,-1,-1,-1,15, 7, 7,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,    -1,-1,-1,-1,     -1,     -1,     -1,     -1,-1,-1,-1,    -1,      -1,     -1,     -1,-1,-1,-1,14,14, 2,-1,-1,-1,     14,     6,17,20,18,19,[14,0],    -1,15,14,-1,-1,-1,-1, 4,-1, 4,-1, 7, 7,14,14,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,    -1,-1,-1,-1,      4,      4,      4,     -1, 4,-1,-1,    -1,      -1,     -1,     -1,-1, 4, 4,14,14, 2,-1,-1,-1,[-1, 5],    -1,15,14,14,20,     7, [0,5],14,14,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,    -1,-1,-1,-1,     -1,     14,     14,     -1,-1,-1,[-1,4],  [-1,4],[-1,10],[-1,12],-1,-1,-1,-1,-1,-1,-1, 7, 7,-1,      7,[7,-1],14,14,-1,-1,[14,0],[16,0],-1,-1,-1,-1,-1, 4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,    -1,-1, 7, 7,     14,      6,     17,      7,-1,-1,[-1,14],[-1,14],[-1,11],[-1,13],-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,     14,    -1,14,14,-1, 7,     7,     7, 8, 9,10,12,-1,-1,15, 7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [ 7, 7, 7, 8, 9,10,12,-1,-1,[-1,7],-1,-1,-1,[-1,14],[-1,16],[15,-1],[14,-1],-1,15, 7,     7,      [8,14], [9,14], 10,12,-1,15, 7, 7,16,-1,-1,15,     14,    16,-1,-1,15,14,    14,    14,14,14,11,13, 7, 7, 7,14,-1,-1, 4, 4, 4, 7,16,-1,-1,-1,-1],
    [14,14,14,14,14,11,13, 7, 7,     7, 7, 7, 7,      7,      7,      7,      7, 7, 7,14,    14,      14,     14,     11,13, 7, 7,14,14, 7, 7, 7, 7,     14,     7, 7, 7, 7,14,    14,    14,14,14,14,14,14,14,14,14,-1,-1,14,14,14,14, 7, 7, 7, 7, 7],
//   1                              10                                                20                                                30                                         40                                50                            60
];

backgroundMusic.innerHTML = "";
backgroundMusic.appendChild(addSource("res/music/RapidBeach.wav"));
backgroundMusic.load();

chunks = [0,0];
thisScript = document.createElement("script");
thisScript.src = "levels/preprocessedImages.js";
document.body.appendChild(thisScript);
delete thisScript;

function arrayRings(thisLevel,x,y,w,h,sx,sy){
    for(var x1 = 0; x1 < w; x1++){
        for(var y1 = 0; y1 < h; y1++){
            thisLevel[0][thisLevel[0].length] = new ring(x+x1*sx,y+y1*sy,16,16,"res/items/ring.png");
        }
    }
}

arrayRings(level,12*128,6.75*128,4,1,32,32);
loopRings(level,15*128-8,6*128-8,100,Math.PI/7,Math.PI,8);
arrayRings(level,660,6.29*128,3,1,32,32);

levelName = [
"Seaside Rush",
"Zone",
"ACT 1"
];
cBack = 0;