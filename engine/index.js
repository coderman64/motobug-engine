///////////////////////////////////////////////////////////
//
//	THIS FILE IS THE MAIN FILE OF THE MOTOBUG ENGINE BY CODERMAN64
//	LICENSED UNDER THE TERMS OF THE MIT LICENSE
//
///////////////////////////////////////////////////////////

// get the main canvas element, and its context
var canvi = document.getElementById("myCanvas");
var c = canvi.getContext("2d");

// do some basic canvas configuration
canvi.style.position = "absolute";
canvi.style.top = "0px";
canvi.style.left = "0px";
canvi.style.border = "1px solid black";
canvi.style.zIndex = "2";

// create an additional canvas for motion blur effects, and get the context
var mBlurCanvi = document.createElement("canvas"); 
var mBlurCtx = mBlurCanvi.getContext("2d");


// attempt to load custom contols from local storage, if not found load default controls:
var leftKey = configuration.lKey;
var rightKey = configuration.rKey;
var upKey = configuration.upKey;
var downKey = configuration.dKey;
var jumpKey = configuration.jKey;
var startKey = configuration.startKey;

// initialize the motion blur toggle configuration
var motionBlurToggle = configuration.mBlurDefault;
var pMotionBlurToggle = configuration.mBlurDefault;


// instantiate the main background music element
var backgroundMusic = document.createElement("audio");
backgroundMusic.muted = true;

// when the background music loads, remove it from the loading list
backgroundMusic.onload = ((event) => {
	if (loadingList.includes(event.target)) {
		loadingList.splice(loadingList.indexOf(event.target));
	}
	backgroundMusic.muted = false;
});
// when the background music starts loading, push it into the loading list
backgroundMusic.onloadstart = function (event) { 
	if (!loadingList.includes(event.target)) { 
		loadingList.push(event.target) 
	} 
};

// this function will configure and start playing the background music
var playMusic = function () {
	backgroundMusic.autoplay = true;
	backgroundMusic.play();
	backgroundMusic.loop = true;
}

// keeps a history of the frames rendered per second (fps)
var fpsLog = [];

// stores the elements used to play all sound effects (seperate elements 
// to load into memory, and play simultaneously)
var sfxObj2 = {
	airDash: document.createElement("audio"),
	death: document.createElement("audio"),
	explosion: document.createElement("audio"),
	jump: document.createElement("audio"),
	looseRings: document.createElement("audio"),
	ring: document.createElement("audio"),
	spindash: document.createElement("audio"),
	spring2: document.createElement("audio"),
}

// set and configure sources for all soundeffects
sfxObj2.airDash.src = "res/sfx/airDash.wav";
sfxObj2.airDash.type = "audio/wav"
sfxObj2.death.src = "res/sfx/death.wav";
sfxObj2.explosion.src = "res/sfx/Explosion.wav";
sfxObj2.jump.src = "res/sfx/jump.wav";
sfxObj2.looseRings.src = "res/sfx/looseRings.wav";
sfxObj2.ring.src = "res/sfx/ring.wav";
sfxObj2.spindash.src = "res/sfx/spindash.wav";
sfxObj2.death.type = "audio/wav";
sfxObj2.explosion.type = "audio/wav";
sfxObj2.jump.type = "audio/wav";
sfxObj2.looseRings.type = "audio/wav";
sfxObj2.ring.type = "audio/wav";
sfxObj2.spindash.type = "audio/wav";
sfxObj2.spindash.volume = 0.8;
sfxObj2.spring2.src = "res/sfx/spring2.wav";
sfxObj2.spring2.type = "audio/wav";


var keysDown = [];
var gamepads = [];
var touchControlsActive = false;

// load the sprite sheet for sonic into memory 
var sonicImage = document.createElement("img");
sonicImage.src = "SonicSheet2.png";

var introAnim = 0;
var introTriangle = document.createElement("img");
introTriangle.src = "res/background/arrowEdge.png";

// sonicCanvas is the offscreen canvas used to draw and manipulate character 
// sprites. It may also be used to do the same for some other sprites
var sonicCanvas = document.createElement("canvas");
var sc = sonicCanvas.getContext("2d");

// configure sonicCanvas
sonicCanvas.width = 40;
sonicCanvas.height = 40;
sc.imageSmoothingEnabled = false;

// are we in dev mode, and was it toggled last frame
var devMode = false;
var pToggleDev = false;

// the index of the current character, and whether it was toggled last frame
var charNum = 0;
var pToggleChar = false;

var levelTimer = 0; //stores the time elapsed since the beginning of the level.
var runLevelTimer = true; // true when the level timer is running

// utility function to quickly generate an array of animation frame cutouts
// each element is a list with [x,y,width,height] in sprite sheet coordinates
function grabAnim(startx, starty, W, H, n) { //assumes all frames of a given animation are arranged in a row on the sprite sheet
	var images = [];
	for (var i = 0; i < n; i++) {
		images[i] = [startx + W * i, starty, W, H]; //requires that all frames intedended for the animation be placed on the same row in the sprite sheet
	}
	return images; //returns a 2 dimensional array of coordinates for use with the sprite sheet, does not store as separate images!
}

// the default animation data. Swapped for different characters (should default to Sonic)
var anim = {
	stand: grabAnim(0, 0, 40, 40, 1),
	jog: grabAnim(0, 40, 40, 40, 8),
	run: grabAnim(0, 80, 40, 40, 4),
	jump: grabAnim(0, 316, 31, 31, 8),
	skid: grabAnim(40, 203, 40, 40, 1),
	death: grabAnim(80, 203, 40, 40, 1),
	crouch: grabAnim(40, 243, 40, 40, 1),
	spindash: grabAnim(0, 284, 32, 32, 5),
	push: grabAnim(0, 164, 34, 39, 4),
	hurt: grabAnim(0, 203, 40, 40, 1),
	sprung: grabAnim(0, 120, 43, 43, 5),
}

// the default character data. Swapped for different characters
var char = {
	x: 100,
	y: 384,
	startX: 128,
	startY: 168,
	Gv: 0,//ground velocity. The sign is used for direction
	xv: 0,//x-velocity
	yv: 0,//y-velocity
	grounded: false,
	frameIndex: 0,
	currentAnim: anim.stand,  //reminder: this is an array of coordinates, not actual images.  These coordinates will be used for other calculations later
	animSpeed: 1,
	rolling: false,
	angle: 0,
	state: 0, // -1=air state; 0=ground state; 1=right wall state; 2=ceiling state; 3=left wall state;
	golock: 0, //forces player to go in a certain direction for a certain amount of time
	goingLeft: false,
	spindashCharge: 0,
	jumpState: 0,// 0 = fell/walked off a cliff; 1 = jump; 2 = hurt; 3 = spring;
	hurt: false,
	rings: 0,
	homing: true,
	pHoming: false,
	jumpReleased: false, //makes sure that you don't homing attack by just holding down jump
	layer: 0,
	pAngle: 0,
	deathTimer:0,
	deathFade:0,
	//constants (only change if you know what you are doing)
	ACC: 0.046875,	// acceleration
	DEC: 0.5,		// deceleration
	FRC: 0.046875,	// friction
	TOP: 6,			// top speed (pixels/frame)
	JMP: 6.5,		// jump speed
	GRV: 0.21875,	// gravity
};

// relevant character data for Sonic the Hedgehog
var sonic = {
	// sonic's sprite sheet
	spriteSheet: newImage("SonicSheet2.png"),
	// sonic's animation data
	anim: {
		stand: grabAnim(0, 0, 40, 40, 1),
		jog: grabAnim(0, 40, 40, 40, 8),
		run: grabAnim(0, 80, 40, 40, 4),
		jump: grabAnim(0, 316, 31, 31, 8),
		dropDash: grabAnim(31, 316, 31, 31, 1),
		skid: grabAnim(40, 203, 40, 40, 1),
		death: grabAnim(80, 203, 40, 40, 1),
		crouch: grabAnim(40, 243, 40, 40, 1),
		spindash: grabAnim(0, 284, 32, 32, 5),
		push: grabAnim(0, 164, 34, 39, 4),
		hurt: grabAnim(0, 203, 40, 40, 1),
		sprung: grabAnim(0, 120, 43, 43, 5),
	},
	// Sonic's default character data
	char: {
		x: 128 * 34,
		y: 128 * 1 + 40,
		startX: 128,
		startY: 168,
		Gv: 0.001,//ground velocity. The sign is used for direction
		xv: 0,//x-velocity
		yv: 0,//y-velocity
		grounded: false,
		frameIndex: 0,
		currentAnim: anim.jump,
		animSpeed: 1,
		rolling: false,
		angle: 0,
		state: -1, // -1=air state; 0=ground state; 1=right wall state; 2=ceiling state; 3=left wall state;
		golock: 0, //forces player to go in a certain direction for a certain amount of time
		goingLeft: false,
		spindashCharge: 0,
		jumpState: 0,// 0 = fell/walked off a cliff; 1 = jump; 2 = hurt; 3 = spring;
		hurt: false,
		rings: 0,
		dropDash: true,
		pDropDash: false,
		dropCharge: 0,
		layer: 0,
		pAngle: 0,
		invincible: 0,
		deathTimer:0,
		deathFade:0,

		//constants (only change if you know what you are doing)
		ACC: 0.046875,	// acceleration
		DEC: 0.5,		// deceleration
		FRC: 0.046875,	// friction
		TOP: 6,			// top speed (pixels/frame)
		JMP: 6.5,		// jump speed
		GRV: 0.21875,	// gravity
	}
};

var shadow = {
	// shadow's sprite sheet
	spriteSheet: newImage("ShadowSheet.png"),
	// shadow's animation data
	anim: {
		stand: grabAnim(0, 0, 41, 41, 1),
		jog: grabAnim(0, 41, 41, 41, 8),
		run: grabAnim(0, 82, 42, 42, 8),
		jump: grabAnim(0, 315, 30, 30, 8),
		skid: grabAnim(41, 209, 41, 41, 1),
		death: grabAnim(82, 209, 41, 41, 1),
		crouch: grabAnim(35, 250, 35, 35, 1),
		spindash: grabAnim(0, 285, 30, 30, 5),
		push: grabAnim(0, 168, 35, 41, 4),
		hurt: grabAnim(0, 210, 40, 40, 1),
		sprung: grabAnim(0, 124, 45, 45, 1),
	},
	// Shadow's default character data
	char: {
		x: 128 * 1,
		y: 128 * 1 + 40,
		startX: 128,
		startY: 168,
		Gv: 0.001,//ground velocity. The sign is used for direction
		xv: 0,//x-velocity
		yv: 0,//y-velocity
		grounded: false,
		frameIndex: 0,
		currentAnim: anim.jump,
		animSpeed: 1,
		rolling: false,
		angle: 0,
		state: -1, // -1=air state; 0=ground state; 1=right wall state; 2=ceiling state; 3=left wall state;
		golock: 0, //forces player to go in a certain direction for a certain amount of time (slopes)
		goingLeft: false,
		spindashCharge: 0,
		jumpState: 0,// 0 = fell/walked off a cliff; 1 = jump; 2 = hurt; 3 = spring;
		hurt: false,
		rings: 0,
		homing: true,
		pHoming: false,
		layer: 0,
		pAngle: 0,
		invincible: 0,
		deathTimer:0,
		deathFade:0,
		//constants (only change if you know what you are doing)
		ACC: 0.046875,	// acceleration
		DEC: 0.5,		// deceleration
		FRC: 0.046875,	// friction
		TOP: 5.5,		// top speed (pixels/frame)
		JMP: 6.5,		// jump speed
		GRV: 0.21875,	// gravity
	}
};

var silver = {
	// Silver's sprite sheet
	spriteSheet: newImage("silversheet2.png"),
	// Silver's animation data
	anim: {
		stand: grabAnim(0, 0, 30, 48, 1),
		jog: grabAnim(0, 48, 40, 41, 6),
		run: grabAnim(0, 89, 44, 44, 4),
		jump: grabAnim(0, 328, 32, 32, 8),
		skid: grabAnim(40, 221, 41, 41, 1),
		death: grabAnim(80, 221, 41, 41, 1),
		crouch: grabAnim(0, 261, 35, 35, 1),
		spindash: grabAnim(0, 296, 30, 27, 5),
		push: grabAnim(0, 179, 35, 41, 4),
		hurt: grabAnim(0, 223, 40, 35, 1),
		sprung: grabAnim(0, 133, 45, 45, 1),
		levi: grabAnim(115, 221, 29, 48, 1)
	},
	// Silver's default character data
	char: {
		x: 100,
		y: 384,
		startX: 128,
		startY: 168,
		Gv: 0.001,//ground velocity. The sign is used for direction
		xv: 0,//x-velocity
		yv: 0,//y-velocity
		grounded: false,
		frameIndex: 0,
		currentAnim: anim.jump,
		animSpeed: 1,
		rolling: false,
		angle: 0,
		state: -1, // -1=air state; 0=ground state; 1=right wall state; 2=ceiling state; 3=left wall state;
		golock: 0, //forces player to go in a certain direction for a certain amount of time
		goingLeft: false,
		spindashCharge: 0,
		jumpState: 0,// 0 = fell/walked off a cliff; 1 = jump; 2 = hurt; 3 = spring;
		hurt: false,
		rings: 0,
		homing: false,
		pHoming: false,
		levitate: true,
		levTimer: 0,
		layer: 0,
		pAngle: 0,
		invincible: 0,
		deathTimer:0,
		deathFade:0,
		//constants (only change if you know what you are doing)
		ACC: 0.039875,	// acceleration
		DEC: 0.5,		// deceleration
		FRC: 0.046875,	// friction
		TOP: 5.5,		// top speed (pixels/frame)
		JMP: 6.5,		// jump speed
		GRV: 0.21875,	// gravity
	}
};

// set the default animation for all characters (we can't access the anim 
// properties until the objects are actually defined)
sonic.char.currentAnim = sonic.anim.jump;
shadow.char.currentAnim = shadow.anim.jump;
silver.char.currentAnim = silver.anim.jump;

// a quick function to set the current character, given a character object
function setChar(newChar) {
	char = newChar.char;
	anim = newChar.anim;
	sonicImage = newChar.spriteSheet;
}
setChar(sonic); // set the default character to Sonic

// possChars stores all possible characters (used for UI)
var possChars = [sonic, shadow, silver];

// instantiates a character wall object, used to limit camera movement
var camWall = function(pos,comp){
	this.pos = pos;
	this.comp = comp;
	this.apply = function(camx){
		if(this.comp == "max"){
			return Math.max(camx,this.pos);
		}
		else{
			return Math.min(camx,this.pos);
		}
	}
}

// camera object used for camera movement
var cam = {
	x: 0,	// normal x and y position
	y: 0,
	tx: 0,	// "true" x and y position, for after debug camera is applied
	ty: 0,
	ptx: 0,	// "true" x and y position from last frame
	pty: 0,
	walls: [],	// stores a list of all effective camera wall limits
};

var timer = 0;
var continue1 = true;
var fpsFactor = 0;

var lastMillis = performance.now();
var newMillis = lastMillis;
var imageWidth = 0;
var fpsCanvi = document.createElement("canvas");
fpsCanvi.width = 30;
fpsCanvi.height = 20;
fpsCanvi.style.imageRendering = "crisp-edges";
fpsCanvi.style.height = "80px";

var fC = fpsCanvi.getContext("2d");

var debugInterface = document.createElement("div")
debugInterface.style.position = "absolute";
debugInterface.style.background = "#FFFFFF55";
debugInterface.style.color = "black";
debugInterface.style.zIndex = "99999";
debugInterface.style.bottom = "0";
debugInterface.style.left = "0";
debugInterface.style.width = "25vw";
debugInterface.style.fontFamily = "monospace";
document.body.appendChild(debugInterface)

function loader() {
	var img = chunkBacklog.shift();
	chunks[chunks.length] = autoChunk(img);
	// if(chunkBacklog.length > 0){
	// 	window.requestAnimationFrame(loader());
	// }
}

//window.requestAnimationFrame(loop);
var gameStarted = false;
var startGame = function () {
	//window.setInterval(loop,17);
	window.setTimeout(loop, 17);
	clickToStart.remove();
	size(0);
	// fullscreen();
	gameStarted = true;
}

function controls() {
	//debugging camera. First so it can suppress movement keys
	if (keysDown[86] && devMode) {
		if (keysDown[leftKey]) {
			debug.camX += 8;
			if (keysDown[16]) {
				debug.camX += 8;
			}
		}
		if (keysDown[upKey]) {
			debug.camY += 8;
			if (keysDown[16]) {
				debug.camY += 8;
			}
		}
		if (keysDown[rightKey]) {
			debug.camX -= 8;
			if (keysDown[16]) {
				debug.camX -= 8;
			}
		}
		if (keysDown[downKey]) {
			debug.camY -= 8;
			if (keysDown[16]) {
				debug.camY -= 8;
			}
		}
	}
	else {
		char.x -= debug.camX;
		char.y -= debug.camY;
		cam.x += debug.camX;
		cam.y += debug.camY;
		debug.camX = 0;
		debug.camY = 0;
	}
	if (keysDown[jumpKey] && char.state != -1 && keysDown[downKey] != true && char.pJump != true) {//jumping
		char.state = -1;
		char.anim = anim.jump;
		//console.log("angle: "+(char.angle*180/Math.PI).toString());
		char.yv -= char.JMP * Math.cos(char.angle);
		//console.log("yv: "+char.yv.toString());
		char.Gv = char.xv + char.JMP * Math.sin(char.angle);
		//console.log("xv: "+char.Gv.toString());
		char.y -= -15 + 45 * Math.cos(char.angle);
		char.x += 30 * Math.sin(char.angle);
		char.jumpState = 1;
		char.pHoming = false;
		//sfx.src = sfxObj.jump;
		sfxObj2.jump.load();
		sfxObj2.jump.play();
		char.pDropDash = false;
		char.dropCharge = 0;
		char.pJump = true;
	}
	if (!keysDown[jumpKey] && char.state != -1) {
		char.pJump = false;
	}
	if (!keysDown[jumpKey] && char.state == -1) { // reset drop dash if you release the jump button
		char.dropCharge = 0;
		char.pDropDash = false;
	}
	if (char.state == -1 && keysDown[jumpKey] != true && char.jumpState == 1 && char.yv < -4) { // controllable jump height
		char.yv = -4;
	}
	if (char.rolling == false) {
		if (!(keysDown[86] && devMode) && keysDown[rightKey] && (char.golock <= 0 || char.Gv > 0) && char.state != -1) {
			//check if right directional input is pressed
			char.goingLeft = false;  
			if (char.Gv < 0) {  //check if sonic is moving to the left
				char.Gv += char.DEC;
				char.currentAnim = anim.skid;
			}
			else if (char.Gv < char.TOP) {
				char.Gv += char.ACC; //accelerate until you reach top speed
				if (char.Gv > char.TOP) { //only called if you are accelerating under Sonic's own power
					char.Gv = char.TOP; 
				}
			}

			if (char.Gv > 0) { //separate if statement that only controls animation
				if (Math.abs(char.Gv) >= char.TOP) {
					char.currentAnim = anim.run;
					char.animSpeed = Math.abs(char.Gv) / 40 + 0.1;
				}
				else {
					char.currentAnim = anim.jog;
					char.animSpeed = Math.abs(char.Gv) / 40 + 0.1;
				}
			}
		}
		else if (!(keysDown[86] && devMode) && keysDown[leftKey] && (char.golock <= 0 || char.Gv < 0) && char.state != -1) {
			//check if left directional input is pressed
			char.goingLeft = true;

			if (char.Gv > 0) {  //check if sonic is moving to the right
				char.Gv -= char.DEC;
				char.currentAnim = anim.skid;
			}
			else if (char.Gv > -char.TOP) {
				char.Gv -= char.ACC;
				if (char.Gv < -char.TOP) {
					char.Gv = -char.TOP;
				}
			}

			if (char.Gv < 0) {
				if (Math.abs(char.Gv) >= char.TOP) {
					char.currentAnim = anim.run;
					char.animSpeed = Math.abs(char.Gv) / 40 + 0.1;
				}
				else {
					char.currentAnim = anim.jog;
					char.animSpeed = Math.abs(char.Gv) / 40 + 0.1;
				}
			}
		}
		else if (char.state != -1) {
			//friction with no left or right input
			if (char.Gv < -char.FRC) {
				char.Gv += char.FRC;
			}
			else if (char.Gv > char.FRC) {
				char.Gv -= char.FRC;
			}
			if (char.Gv >= -char.FRC && char.Gv <= char.FRC && char.Gv != 0) { //is ground speed in either direction less than friction per frame?
				char.Gv = 0.0001 * (char.goingLeft ? -1 : 1); //preserve direction character is facing by setting ground velocity to extremelely small number, instead of 0
			}

			if (Math.abs(char.Gv) <= 0.01) {
				char.currentAnim = anim.stand;
			}
			else {
				if (Math.abs(char.Gv) > char.TOP) {
					char.currentAnim = anim.run;
					char.animSpeed = Math.abs(char.Gv) / 40 + 0.1;
				}
				else {
					char.currentAnim = anim.jog;
					char.animSpeed = Math.abs(char.Gv) / 40 + 0.1;
				}
			}
			if (!(keysDown[86] && devMode) && keysDown[downKey]) {
				if (Math.abs(char.Gv) > 0.001) {
					char.rolling = true;
					//sfx.src = sfxObj.spindash;
					sfxObj2.spindash.load();
					sfxObj2.spindash.play();
				}
				else {
					if (keysDown[jumpKey]) {
						char.currentAnim = anim.spindash;
						char.animSpeed = 1;
						char.rolling = true;
						char.spindashCharge = 0;
						//sfx.src = sfxObj.spindash;
						sfxObj2.spindash.load();
						sfxObj2.spindash.play();
					}
					else {
						char.currentAnim = anim.crouch;
					}
				}
			}
		}
	}
	else {
		if (char.currentAnim != anim.spindash) {
			char.currentAnim = anim.jump;
			char.animSpeed = Math.abs(char.Gv / 20) + 0.1;
			if (Math.abs(char.Gv) > 0.05) {
				char.Gv = (Math.abs(char.Gv) - 0.05) * (char.Gv / Math.abs(char.Gv));
			}
			else {
				char.Gv = (0.0001) * (char.Gv / Math.abs(char.Gv));
			}
			if (Math.abs(char.Gv) < 0.2 && char.state != -1) {
				char.rolling = false;
				char.Gv = 0.0001 * (char.Gv / Math.abs(char.Gv));
			}
		}
		else {
			if (char.spindashCharge > 9) { char.spindashCharge = 9; }
			char.spindashCharge -= (Math.floor(char.spindashCharge / 0.25) / 256);
			if (char.spindashCharge < 0) { char.spindashCharge = 0; }
			if (keysDown[downKey] == false) {
				char.currentAnim = anim.jump;
				char.Gv = (8 + (Math.floor(char.spindashCharge) / 2)) * (char.goingLeft == true ? -1 : 1)
				//sfx.src = sfxObj.airDash;
				sfxObj2.airDash.load();
				sfxObj2.airDash.play();
				sfxObj2.spindash.pause();
			}
		}
		if (Math.abs(char.Gv) > 22) {
			char.Gv = 22 * (char.Gv / Math.abs(char.Gv));
		}
	}
	if (char.golock > 0) {
		char.golock--;
		if (Math.abs(char.Gv) < 0.1) {
			char.golock = 0;
		}
	}

	if (char.state == -1 && char.jumpState != 2) { // air movement
		if (!(keysDown[86] && devMode) && keysDown[rightKey]) {
			char.goingLeft = false;
			if (char.Gv < char.TOP) {
				char.Gv += char.ACC * 2;
				if (char.Gv > char.TOP) { char.Gv = char.TOP; }
			}
		}
		if (!(keysDown[86] && devMode) && keysDown[leftKey]) {
			char.goingLeft = true;
			if (char.Gv > -char.TOP) {
				char.Gv -= char.ACC * 2;
				if (char.Gv < -char.TOP) { char.Gv = -char.TOP; }
			}
		}
	}

	if (keysDown[jumpKey] == true && char.pDropDash == true && char.state == -1) { // charge the drop dash
		char.dropCharge += 1;
	}

	if (keysDown[76] && devMode) {
		if (!pDevLevelChange) {
			pDevLevelChange = true;
			loadNextLevel();
			resetLevel();
		}
	}
	else {
		pDevLevelChange = false;
	}

	if (keysDown[77] && devMode) {
		if (!pMotionBlurToggle) {
			pMotionBlurToggle = true;
			motionBlurToggle = !motionBlurToggle;
		}
	}
	else {
		pMotionBlurToggle = false;
	}

	if(keysDown[84]&&devMode){
		backgroundMusic.load();
		titleTimer = -70;
		titleActive = true;
		inMenu = false;
		SKIP_TITLE = false;
		currentLevel = -1;
		backgroundMusic.volume = 1;
		backgroundMusic.muted = true;
	}

	//console.log(char.dropCharge);
}
var pDevLevelChange = false;

document.body.appendChild(backgroundMusic);

function resetLevel() {
	char.GRV = 0.21875;
	char.x = char.startX;
	char.y = char.startY;
	cam.x = -char.x;
	cam.y = -char.y;
	cam.walls = [];
	// char.y = 256;
	// char.x = 128;
	// for(var i = 0; i < level[0].length; i++){
	// 	if(level[0][i].charSpawn){
	// 		char.x = level[0][i].x;
	// 		char.y = level[0][i].y;
	// 	}
	// }
	char.yv = 0;
	char.xv = 0.001;
	char.Gv = 0;
	char.state = -1;
	char.goingLeft = false;
	char.frameIndex = 0;
	char.currentAnim = anim.jump;
	char.animSpeed = 0.1;
	char.rolling = false;
	char.deathTimer = 0;
	char.deathFade = 0;
	tileFilter = "none";
	introAnim = -20;
	levelTimer = 0;
	runLevelTimer = true;
	playMusic();
	backgroundMusic.load();
	/*if(introAnim >= 200){
		sfx.src = sfxObj.death;
		sfx.play();
	}*/
	char.rings = 0;
	for (var i = 0; i < level[0].length; i++) {
		if (level[0][i].reset != undefined) {
			level[0][i].reset();
		}
	}
}

var backSense, frontSense, LsideSense, RsideSense;
function physics() {
	// make the beginning of the stage act like a wall
	if (char.x < 15) {
		char.x = 15;
		if (char.Gv < 0) {
			char.Gv = -0.001;
		}
		if (keysDown[leftKey] && keysDown[rightKey] != true) {
			char.animSpeed = 0.05;
			char.currentAnim = anim.push;
		}
	}

	// make the end of the stage act like a wall
	if (char.x > level[1].length * 128 - 15) {
		char.x = level[1].length * 128 - 15;
		if (char.Gv > 0) {
			char.Gv = 0.001;
		}
		if (keysDown[rightKey] && keysDown[leftKey] != true) {
			char.animSpeed = 0.05;
			char.currentAnim = anim.push;
		}
	}

	//if you fall off the level, respawn
	if (char.y > (level.length - 1) * 128&&char.deathTimer <= 0) {
		char.deathTimer = 1;
		sfxObj2.death.play();
	}

	// Lock rotations from -180deg to 180deg
	if (Math.abs(char.angle) > Math.PI) {
		char.angle = char.angle % (Math.PI * 2) + Math.PI * 2;
	}

	///////////////////////////////////// MAIN COLLISION //////////////////////
	if (char.state >= 0 && char.y != NaN) {
		if (char.levitate == true && char.GRV == 0) {
			char.GRV = 0.21875;
		}

		if (char.state == 0) {//if you are on the ground

			//sense the ground (two lines for angle)
			backSense = senseVLine(char.x - 9, char.y - 20, 46, c, char.layer);
			frontSense = senseVLine(char.x + 9, char.y - 20, 46, c, char.layer);

			//sense the walls
			LsideSense = senseHLineL(char.x, char.y - 20, 20, c, char.layer);
			RsideSense = senseHLineR(char.x, char.y - 20, 20, c, char.layer);

			//if you have an angle that is too far off, you aren't actually touching the ground (prevents weirdness at tops of curves)
			if (Math.abs(backSense[2] * Math.PI / 180 - char.angle) > Math.PI / 5) {
				backSense[0] = false;
			}
			if (Math.abs(frontSense[2] * Math.PI / 180 - char.angle) > Math.PI / 5) {
				frontSense[0] = false;
			}

			//sets the y position and angle if the ground is detected with both size
			if (backSense[0] != false && frontSense[0] != false) {
				char.y = (isNaN((backSense[1] + frontSense[1]) / 2) ? char.y : ((backSense[1] + frontSense[1]) / 2));
				char.angle = ((isNaN(backSense[2] * Math.PI / 180) ? char.angle : backSense[2] * Math.PI / 180) + (isNaN(frontSense[2] * Math.PI / 180) ? char.angle : frontSense[2] * Math.PI / 180)) / 2;
			}

			//if only one sensor detects the ground, use that sensor to set the angle and y position
			else if (backSense[0] != false || frontSense[0] != false) {
				char.y = backSense[0] == false ? frontSense[1] : backSense[1];
				char.angle = backSense[0] == false ? frontSense[2] * Math.PI / 180 : backSense[2] * Math.PI / 180;
			}
			else if (backSense[0] == false && frontSense[0] == false) // if there is no ground detected at all, fall
			{
				char.state = -1;
				char.jumpState = 0;
			}

			//if your angle is less than -45 degrees (-PI/4 radians), you're running up the left wall
			if (char.angle < -Math.PI / 4 && Math.abs(char.Gv) > 0.01) {
				char.state = 1;
			}

			//if your angle is greater than 45 degrees (PI/4 radians), you're running up the right wall
			if (char.angle > Math.PI / 4 && Math.abs(char.Gv) > 0.01) {
				char.state = 3;
			}

			//collide with the walls
			if (char.angle > -Math.PI / 6 && RsideSense[0] == true && char.x > RsideSense[1] - 15 && Math.abs(RsideSense[2] * Math.PI / 180 - char.angle) > Math.PI / 4 && LsideSense[1] != RsideSense[1]) {
				char.x = RsideSense[1] - 15;	// set the position outside of the wall
				char.Gv = 0.01 * char.Gv / Math.abs(char.Gv);	// stop your movement
				if (keysDown[rightKey]) {
					char.animSpeed = 0.05;		// change animation	
					char.currentAnim = anim.push;
				}
			}
			else if (char.angle < Math.PI / 6 && LsideSense[0] == true && char.x < LsideSense[1] + 15 && Math.abs(LsideSense[2] * Math.PI / 180 - char.angle) > Math.PI / 4 && LsideSense[1] != RsideSense[1]) {
				char.x = LsideSense[1] + 15;		// (mirrored version of above)
				char.Gv = 0.01 * char.Gv / Math.abs(char.Gv);
				if (keysDown[leftKey]) {
					char.animSpeed = 0.05;
					char.currentAnim = anim.push;
				}
			}
		}
		else if (char.state == 1) {//if you're running on the left wall
			//detect the ground of the left wall
			var backSense = senseHLineR(char.x - 20, char.y - 9, 46, c, char.layer);
			var frontSense = senseHLineR(char.x - 20, char.y + 9, 46, c, char.layer);

			// sense to sonic's sides
			var upSideSense = senseVLineB(char.x - 20, char.y, 20, c, char.layer);
			var downSideSense = senseVLine(char.x - 20, char.y, 20, c, char.layer);

			// if you hit anything to your sides, just fall to the ground
			if (upSideSense[0] && char.y + char.yv < upSideSense[1] - 10 && char.Gv > 0 || downSideSense[0] && char.y + char.yv > downSideSense[1] + 10 && char.Gv < 0) {
				char.yv = 0;
				char.xv = char.Gv * Math.cos(char.angle);
				char.Gv = char.xv;
				char.state = -1;
				char.jumpState = 0;
			}

			if (backSense[0] != false && frontSense[0] != false) {
				char.x = (isNaN((backSense[1] + frontSense[1]) / 2) ? char.y : ((backSense[1] + frontSense[1]) / 2));
				var angle1 = ((isNaN(backSense[2] * Math.PI / 180) ? char.angle : backSense[2] * Math.PI / 180) + (isNaN(frontSense[2] * Math.PI / 180) ? char.angle : frontSense[2] * Math.PI / 180)) / 2;
				char.angle = (Math.abs(angle1 - char.angle) < Math.PI / 4) ? angle1 : (Math.abs(backSense[2] * Math.PI / 180 - char.angle) < Math.PI / 4 ? backSense[2] * Math.PI / 180 : Math.abs(frontSense[2] * Math.PI / 180 - char.angle) < Math.PI / 4 ? frontSense[2] * Math.PI / 180 : char.angle)
				if (char.angle > -Math.PI / 4 && char.state == 1) {
					char.state = 0;
				}
				if (char.angle < -3 * Math.PI / 4 && char.state == 1) {
					char.state = 2;
				}
			}
			else if (backSense[0] != false || frontSense[0] != false) {
				char.x = backSense[0] == false ? frontSense[1] : backSense[1];
			}
			else if (backSense[0] == false && frontSense[0] == false) // if there is no ground, fall
			{
				char.yv = char.Gv * Math.sin(char.angle);
				char.xv = char.Gv * Math.cos(char.angle);
				char.Gv = char.xv;
				char.state = -1;
				char.jumpState = 0;
			}
			//if you're going too slow, fall
			if (Math.abs(char.Gv) < 0.25 && char.state == 1) {
				if (char.angle <= -Math.PI / 2) {  //must be at least perpendicular to ground to fall instead of sliding
					char.state = -1;
					char.jumpState = 0;
				}
				else if (char.angle > -Math.PI / 2) { //interestingly, this makes your character faster than if you slide/run down a vertical surface
					char.Gv = -5; //Ground velocity of 5 is fast enough to complete loops and run up most walls
					char.golock = 30;
				}
			}
		}
		else if (char.state == 3) {//if you're running on the right wall
			var backSense = senseHLineL(char.x + 20, char.y - 9, 46, c, char.layer);
			var frontSense = senseHLineL(char.x + 20, char.y + 9, 46, c, char.layer);

			// sense to sonic's sides
			var upSideSense = senseVLineB(char.x + 20, char.y, 20, c, char.layer);
			var downSideSense = senseVLine(char.x + 20, char.y, 20, c, char.layer);

			// if you hit anything to your sides, just fall to the ground
			if (upSideSense[0] && char.y + char.yv < upSideSense[1] - 10 && char.Gv < 0 || downSideSense[0] && char.y + char.yv > downSideSense[1] + 10 && char.Gv > 0) {
				char.yv = 0;
				char.xv = char.Gv * Math.cos(char.angle);
				char.Gv = char.xv;
				char.state = -1;
				char.jumpState = 0;
			}

			if (backSense[0] != false && frontSense[0] != false) {
				char.x = (isNaN((backSense[1] + frontSense[1]) / 2) ? char.x : ((backSense[1] + frontSense[1]) / 2));
				var angle1 = ((isNaN(backSense[2] * Math.PI / 180) ? char.angle : backSense[2] * Math.PI / 180) + (isNaN(frontSense[2] * Math.PI / 180) ? char.angle : frontSense[2] * Math.PI / 180)) / 2;
				char.angle = (Math.abs(angle1 - char.angle) < Math.PI / 4) ? angle1 : (Math.abs(backSense[2] * Math.PI / 180 - char.angle) < Math.PI / 4 ? backSense[2] * Math.PI / 180 : Math.abs(frontSense[2] * Math.PI / 180 - char.angle) < Math.PI / 4 ? frontSense[2] * Math.PI / 180 : char.angle)
				if (char.angle < Math.PI / 4 && char.state == 3) {
					char.state = 0;
				}

				if (char.angle > 3 * Math.PI / 4 && char.state == 3) {
					char.state = 2;

				}
			}
			else if (backSense[0] != false || frontSense[0] != false) {
				char.x = backSense[0] == false ? frontSense[1] : backSense[1];
			}
			else if (backSense[0] == false && frontSense[0] == false) // if there is no ground, fall
			{
				char.Gv = char.xv;
				char.state = -1;
				char.jumpState = 0;

			}
			if (Math.abs(char.Gv) < 0.25 && char.state == 3) {
				if (char.angle >= Math.PI / 2) { //must be at least perpendicular to ground to fall instead of sliding
					char.state = -1;
					char.jumpState = 0;
				}
				else if (char.angle < Math.PI / 2) { //interestingly, this makes your character faster than if you slide/run down a vertical surface
					char.Gv = 5; //Ground velocity of 5 is fast enough to complete loops and run up most walls
					char.golock = 30;
				}
			}
		}
		else if (char.state == 2) {//if you're running on the ceiling
			var backSense = senseVLineB(char.x - 9, char.y + 20, 46, c, char.layer);
			var frontSense = senseVLineB(char.x + 9, char.y + 20, 46, c, char.layer);
			if (backSense[0] != false && frontSense[0] != false) {
				char.y = (isNaN((backSense[1] + frontSense[1]) / 2) ? char.y : ((backSense[1] + frontSense[1]) / 2));
				var angle1 = ((isNaN(backSense[2] * Math.PI / 180) ? char.angle : backSense[2] * Math.PI / 180) + (isNaN(frontSense[2] * Math.PI / 180) ? char.angle : frontSense[2] * Math.PI / 180)) / 2;
				char.angle = angle1;
				if ((char.angle > -Math.PI * 3 / 4 && char.angle < -Math.PI / 4) && char.state == 2) {
					char.state = 1;
				}
				if ((char.angle < Math.PI * 3 / 4 && char.angle > Math.PI / 4) || (char.angle + Math.PI * 2 < Math.PI * 3 / 4 && char.angle + Math.PI * 2 > Math.PI / 4) && char.state == 2) {
					char.state = 3;
				}
			}
			else if (backSense[0] != false || frontSense[0] != false) {
				char.y = backSense[0] == false ? frontSense[1] : backSense[1];
				char.angle = backSense[0] == false ? frontSense[2] * Math.PI / 180 : backSense[2] * Math.PI / 180;
			}
			else if (backSense[0] == false && frontSense[0] == false) // if there is no ground, fall
			{
				char.Gv = char.xv;
				char.state = -1;
				char.jumpState = 0;
			}
			if (Math.abs(char.Gv) < 0.25 && char.state == 2) {
				char.y += -15 * Math.cos(char.angle) + 15;
				char.x += 15 * Math.sin(char.angle);
				char.state = -1;
				char.angle = 0;
			}
		}
		if (char.rolling) {
			if (char.Gv / Math.abs(char.Gv) == Math.sin(char.angle) / Math.abs(Math.sin(char.angle))) {
				char.Gv += Math.abs(char.Gv) > 0.01 ? 0.3125 * Math.sin(char.angle) : 0;
			}
			else {
				char.Gv += Math.abs(char.Gv) > 0.01 ? 0.078125 * Math.sin(char.angle) : 0;
			}
		}
		else {
			char.Gv += Math.abs(char.Gv) > 0.01 ? 0.125 * Math.sin(char.angle) : 0;
		}
		//set velocity based on the ground velocity
		if (char.state >= 0) {
			char.xv = isNaN(char.Gv * Math.cos(char.angle)) ? char.xv : char.Gv * Math.cos(char.angle);
			char.yv = isNaN(char.Gv * Math.sin(char.angle)) ? char.yv : char.Gv * Math.sin(char.angle);
		}
	}
	else if (char.state == -1) { // if you are in the air

		char.yv += char.GRV * fpsFactor;
		if (char.yv > 50) { char.yv = 50; } //limit y speed, so things don't explode.

		// adjust sensors based on rotation, so they always match where the character is onscreen
		var rotX = Math.sin(char.angle) * 15;
		var rotY = -(Math.cos(char.angle) * 15 - 15);

		/// SENSE EVERYTHING /// 
		var backSense = senseVLine(char.x - 7 + rotX, char.y - 15 + rotY, 50, c, char.layer);
		var frontSense = senseVLine(char.x + 7 + rotX, char.y - 15 + rotY, 50, c, char.layer);
		var RsideSense = senseHLineR(char.x + rotX, char.y - 15 + rotY, 20, c, char.layer);
		var LsideSense = senseHLineL(char.x + rotX, char.y - 15 + rotY, 20, c, char.layer);
		var backTopSense = senseVLineB(char.x - 9 + rotX, char.y - 15 + rotY, 46, c, char.layer);
		var frontTopSense = senseVLineB(char.x + 9 + rotX, char.y - 15 + rotY, 46, c, char.layer);

		/// BUGFIX: in case you get stuck in-between two tiles, try to pop out of the top. ///
		if (RsideSense[0] && LsideSense[0] && LsideSense[1] >= RsideSense[1] && LsideSense[1] <= RsideSense[1] + 1) {
			if (Math.abs(char.x - (RsideSense[1] - 16.1 - rotX)) > Math.abs(char.x - (LsideSense[1] + 16.1 - rotX))) {
				char.x = (LsideSense[1] + 16.1 - rotX);
			}
			else {
				char.x = (RsideSense[1] - 16.1 - rotX);
			}
			RsideSense = senseHLineR(char.x + rotX, char.y - 15 + rotY, 15, c, char.layer);
			LsideSense = senseHLineL(char.x + rotX, char.y - 15 + rotY, 20, c, char.layer);
			backSense = senseVLine(char.x - 7 + rotX, char.y - 15 + rotY, 46, c, char.layer);
			frontSense = senseVLine(char.x + 7 + rotX, char.y - 15 + rotY, 46, c, char.layer);
			backTopSense = senseVLineB(char.x - 7 + rotX, char.y - 15 + rotY, 46, c, char.layer);
			frontTopSense = senseVLineB(char.x + 7 + rotX, char.y - 15 + rotY, 46, c, char.layer);
		}


		/// LANDING (LEFT SENSOR) ///
		if (backSense[0] == true && backSense[1] < char.y + rotY + char.yv && (frontSense[0] == true ? backSense[1] <= frontSense[1] : true) && (Math.abs(char.angle % (Math.PI * 2)) < Math.PI / 2 && char.yv >= 0)) {
			// console.log("foot1: " + (Math.abs(char.angle % (Math.PI * 2)) * 180 / Math.PI).toString());
			if (Math.abs(backSense[2]) < 80) {
				if (frontSense[2] > 45 && backSense[2] > 45) {
					char.state = 3;
					char.rolling = false;
				}
				else if (frontSense[2] < -45 && backSense[2] < -45) {
					char.state = 1;
					char.rolling = false;
				}
				else {
					char.state = 0;
					char.rolling = false;
				}
				char.y = backSense[1] - rotY;
				char.Gv = char.yv * Math.sin(backSense[2] * Math.PI / 180) + char.xv * Math.cos(backSense[2] * Math.PI / 180);
				char.angle = backSense[2] * Math.PI / 180;
				char.yv = 0;
				if (char.dropCharge >= 20) { //activate drop dash
					char.Gv = Math.min(char.Gv / 2 + 8 * (char.goingLeft ? -1 : 1), 12);
					char.rolling = true;
					char.dropCharge = 0;
					spawn(level, new effect(char.x - 12, char.y - 32, 25, 25, "res/items/speedDash.png", 5));
					sfxObj2.airDash.load();
					sfxObj2.airDash.play();
					sfxObj2.spindash.pause();
				}
			}
		}
		/// LANDING (RIGHT SENSOR) ///
		if (frontSense[0] == true && frontSense[1] < char.y + rotY + char.yv && (backSense[0] == true ? (frontSense[1] <= backSense[1]) : true) && (Math.abs(char.angle % (Math.PI * 2)) < Math.PI / 2 && char.yv >= 0)) {
			// console.log("foot2");
			if (Math.abs(frontSense[2]) < 80) {
				if (frontSense[2] > 45) {
					char.state = 3;
					char.rolling = false;
				}
				else if (frontSense[2] < -45) {
					char.state = 1;
					char.rolling = false;
				}
				else {
					char.state = 0;
					char.rolling = false;
				}
				char.y = frontSense[1] - rotY;
				char.Gv = char.yv * Math.sin(frontSense[2] * Math.PI / 180) + char.xv * Math.cos(frontSense[2] * Math.PI / 180);
				char.angle = frontSense[2] * Math.PI / 180;
				char.yv = 0;
				if (char.dropCharge >= 20) { //activate drop dash
					char.Gv = Math.min(char.Gv / 2 + 8 * (char.goingLeft ? -1 : 1), 12);
					char.rolling = true
					char.dropCharge = 0;
					spawn(level, new effect(char.x - 12, char.y - 32, 25, 25, "res/items/speedDash.png", 5));
					sfxObj2.airDash.load();
					sfxObj2.airDash.play();
					sfxObj2.spindash.pause();
				}
			}
		}

		/// RUNNING INTO THINGS IN MID AIR ///
		if (RsideSense[0] == true && char.x + rotX + char.xv > RsideSense[1] - 16 && char.state == -1 && RsideSense[1] != LsideSense[1] + 1) {
			// console.log("sideleft");
			char.x = RsideSense[1] - 16.1 - rotX;
			if (char.Gv > 0) {
				char.Gv = 0.001 * char.Gv / Math.abs(char.Gv);
			}
		}
		if (LsideSense[0] == true && char.x + rotX + char.xv < LsideSense[1] + 16 && char.state == -1 && RsideSense[1] != LsideSense[1] + 1) {
			// console.log("sideright");
			char.x = LsideSense[1] + 16.1 - rotX;
			if (char.Gv < 0) {
				char.Gv = 0.001 * char.Gv / Math.abs(char.Gv);
			}
		}
		if (backTopSense[0] == true && char.y + rotY < backTopSense[1] + 30 && char.yv <= 0) {
			// console.log("head1");
			char.yv = -char.yv / 2;
			char.y = backTopSense[1] + 30 - rotY;
		}
		else if (frontTopSense[0] == true && char.y + rotY < frontTopSense[1] + 30 && char.yv <= 0) {
			// console.log("head2");
			char.yv = -char.yv / 2;
			char.y = frontTopSense[1] + 30 - rotY;
		}


		/*if (char.yv < 0 && char.yv > -4)//air drag
		{
			//char.Gv -= (Math.round(char.Gv / 0.125) / 256);
		}*/
		char.xv = char.Gv;

		/// ANIMATIONS ///
		if (char.jumpState == 1 && (char.levitate == false || char.yv != 0)) {
			char.currentAnim = anim.jump;
			char.animSpeed = 0.5;
		}
		if (char.jumpState == 3) {
			char.currentAnim = anim.sprung;
			char.animSpeed = 0.2;
			if (char.yv > 0) {
				char.currentAnim = anim.jog;
				char.jumpState = 0;
			}
		}
		if (char.jumpState == 2) {
			char.currentAnim = anim.hurt;
		}

		// once you slow down, slowly transition angle in midair to horizontal
		if (char.yv > -2) {
			char.angle = lerp(char.angle, lerp(char.angle, 0, 0.3), 0.3);
		}

		// adjust x and y positions so you rotate around your center rather than around the bottom of the sprite
		char.x += Math.abs(Math.sin((char.angle - char.pAngle) / 2) * (30)) * Math.sin(char.angle);
		char.y += Math.abs(Math.sin((char.angle - char.pAngle) / 2) * (30)) * Math.cos(char.angle);
	}
	/// END OF AIR PHYSICS ///


	/// SLIDE DOWN SLOPE IF NOT FAST ENOUGH ///
	if (Math.abs(char.angle + Math.PI / 4) < Math.PI / 8 && Math.abs(char.Gv) < 0.1 && char.state != -1) {
		char.Gv = -2;
		char.golock = 30;
	}
	if (Math.abs(char.angle - Math.PI / 4) < Math.PI / 8 && Math.abs(char.Gv) < 0.1 && char.state != -1) {
		char.Gv = 2;
		char.golock = 30;
	}

	// add the character collision rectangle to the debug screen.
	debug.addRect(char.x - 15 + 15 * Math.sin(char.angle), char.y - 20 - 20 * Math.cos(char.angle), 30, 40, "#00550055");

	/// COLLIDE WITH STAGE ITEMS ///
	for (var i = 0; i < level[0].length; i++) {
		if (level[0][i].disable != true && char.x + char.xv + 15 + 15 * Math.sin(char.angle) > level[0][i].x && char.x + char.xv - 15 + 15 * Math.sin(char.angle) < level[0][i].x + level[0][i].w) {
			if (level[0][i].hit && char.y + char.yv + 20 - 20 * Math.cos(char.angle) > level[0][i].y && char.y + char.yv - 20 - 20 * Math.cos(char.angle) < level[0][i].y + level[0][i].h) {
				level[0][i].hit(char);
			}
			if (level[0][i].destroy) { // remove items marked to be destroyed
				level[0].splice(i, 1);
				i--;
			}
		}
	}

	/// GET HIT ///
	if (char.hurt && char.rings <= 0 && char.invincible == 0) { // respawn if you have no rings
		sfxObj2.death.play();
		char.deathTimer = 1;
		// resetLevel();
		char.hurt = false;
	}
	if (char.hurt && char.rings > 0 && char.invincible == 0) { // throw rings if you have some
		char.hurt = false;
		char.GRV = 0.21875;
		var angle = Math.PI / Math.min(char.rings, 32);	// calculate the angle between rings
		for (var i = 0; i < Math.min(char.rings, 32); i++) { // instantiate thrown rings
			level[0][level[0].length] = new hitRing(char.x + Math.cos(angle * i) * 16, char.y - 20 - Math.sin(angle * i) * 16, 16, 16, "res/items/ring.png", Math.cos(angle * i) * 4, -Math.sin(angle * i) * 4);
		}
		// update character status
		char.rings = 0;
		char.invincible = 240;
		// play lost rings sound
		//sfx.src = sfxObj.looseRings;
		sfxObj2.looseRings.load();
		sfxObj2.looseRings.play();
	}
	if (char.hurt && char.invincible > 0) {
		char.hurt = false; // you can't get hurt while invincible!
	}
	char.pAngle = char.angle; // set the angle to the previous angle

	// TIME OVER!!
	if (levelTimer / 1000 > 600&&char.deathTimer <= 0) {
		sfxObj2.death.play();
		char.deathTimer = 1;
	}

	/// DROP DASH ///
	if (char.dropCharge >= 10 && char.state == -1 && char.jumpState == 1) {
		char.currentAnim = anim.dropDash;
		if (char.dropCharge == 20) {
			//sfx.src = sfxObj.spindash;
			sfxObj2.spindash.load();
			sfxObj2.spindash.play();
		}
	}

	// reset homing attack on ground
	if (char.state != -1) {
		char.pHoming = true;
	}
}

var pCharPos = { x: char.x, y: char.y }
var widthOffset, heightOffset;

var mBlurClearCount = 0;

function drawCharFrame(image, frame, x, y) {
	sonicCanvas.width = frame[2];
	sonicCanvas.height = frame[3];
	sc.drawImage(image, Math.floor(-frame[0]), Math.floor(-frame[1]));
	c.drawImage(sonicCanvas, Math.floor(x - frame[2] / 2), Math.floor(y - frame[3]));
}

var trueAngle;
var lastAnim = {anim:null,frame:null};
function drawChar() {
	//draw Character
	//console.log("sonic is drawn");

	widthOffset = (char.currentAnim[Math.floor(char.frameIndex)][2] / 2) * ((char.goingLeft) ? 1 : -1); //width offset. made to equal half of sprite width
	heightOffset = -(char.currentAnim[Math.floor(char.frameIndex)][3]);// height offset. made to equal sprite heght
	trueAngle = 0; //used to store copy of sonic's physical angle
	
	trueAngle = char.angle //store sonic's actual angle here while using the main variable for graphical calculations

	if (configuration.classicAngles) {	
		char.angle = Math.round(char.angle / (Math.PI / 4)) * (Math.PI / 4); // <-- character angle temporarily set to closest multiple of 45 degrees
	}

	if(char.currentAnim == anim.jump)
	{   //rolling animations are not angled and need different equations to calculate x and y offset-where is the upper left corner in relation to the ground?
		c.translate((char.x + cam.x + widthOffset - heightOffset * Math.sin(char.angle)/2), (char.y + cam.y + (heightOffset * Math.cos(char.angle)/2)) + heightOffset/2);
	    c.rotate(0);
	}
	else 
	{   //offset variables used here to account for sprite rotation-compensates for the fact that images pivot around the upper left corner
		c.translate((char.x + cam.x + widthOffset * Math.cos(char.angle) - heightOffset * Math.sin(char.angle)), (char.y + cam.y + heightOffset * Math.cos(char.angle) + widthOffset * Math.sin(char.angle)));	
		c.rotate(char.angle);
	}
	
	char.angle = trueAngle; //restore sonic's angle to actual value before any physical calculations can be performed

	
	if (motionBlurToggle) {
		//mBlurCtx.translate((vScreenW/2+(cam.tx-cam.x))+a*Math.cos(char.angle)-b*Math.sin(char.angle),vScreenH/2+(cam.ty-cam.y)+b*Math.cos(char.angle)+a*Math.sin(char.angle));
		mBlurCtx.translate(char.x + cam.x + widthOffset * Math.cos(char.angle) - heightOffset * Math.sin(char.angle), char.y + cam.y + heightOffset * Math.cos(char.angle) + widthOffset * Math.sin(char.angle))
		mBlurCtx.rotate(char.angle);
	}

	if (char.goingLeft) { //controls which way sonic is facing
		c.scale(-1, 1); 
		if (motionBlurToggle)
			mBlurCtx.scale(-1, 1); //also mirror any motion blur
	}

	if(lastAnim.anim != char.currentAnim || lastAnim.frame != char.frameIndex){
		sonicCanvas.width = char.currentAnim[Math.floor(char.frameIndex)][2];
		sonicCanvas.height = char.currentAnim[Math.floor(char.frameIndex)][3];
		if (char.levitate == true && char.GRV == 0 && char.state == -1) { // draw levitation for silver
			sc.drawImage(sonicImage, -char.currentAnim[Math.floor(char.frameIndex)][0], -char.currentAnim[Math.floor(char.frameIndex)][1]);
			sc.filter = "sepia(200%) hue-rotate(120deg) brightness(80%) contrast(200%) opacity(50%)";
		}
		sc.drawImage(sonicImage, -char.currentAnim[Math.floor(char.frameIndex)][0], -char.currentAnim[Math.floor(char.frameIndex)][1]);
		lastAnim.anim = char.currentAnim;
		lastAnim.frame = char.frameIndex;
	}

	if (char.invincible % 10 < 5) {
		if (char.levitate == true && char.GRV == 0 && char.state == -1) { // draw levitation for silver
			c.shadowBlur = char.levTimer / 60;
			c.shadowColor = "#00FFFF";
		}
		c.drawImage(sonicCanvas, 0, 0);
		if (char.levitate == true && char.GRV == 0 && char.state == -1) { // draw levitation for silver
			c.shadowBlur = 0;
			c.shadowColor = "#00000000";
		}

		if (motionBlurToggle && Math.sqrt(char.xv ** 2 + char.yv ** 2) >= char.TOP) {
			mBlurCtx.drawImage(sonicCanvas, 0, 0);
		}
	}
	c.setTransform(1, 0, 0, 1, 0, 0);//reset transformations
	if (motionBlurToggle) {
		mBlurCtx.setTransform(1, 0, 0, 1, 0, 0);//reset transformations
		mBlurClearCount++;
		if (mBlurClearCount >= 20) {
			mBlurCtx.filter = "contrast(110%)";
			mBlurClearCount = 0;
		}
		mBlurCtx.drawImage(mBlurCanvi, cam.tx - cam.ptx, cam.ty - cam.pty);
		mBlurCtx.filter = "none";
	}

	// decrease invincibility time
	if (char.invincible > 0) {
		char.invincible -= fpsFactor;
	}
	else {
		char.invincible = 0;
	}
}

function drawing() {
	//update frames
	char.frameIndex += Math.abs(char.animSpeed) * fpsFactor;
	if (char.frameIndex >= char.currentAnim.length) { char.frameIndex = 0; }

	//draw background
	drawBack(c);

	if (char.layer >= 1) {
		drawMBlur();
		drawChar();
	}

	//draw level
	drawLevel(c, Math.floor(cam.tx), Math.floor(cam.ty));

	if (char.layer < 1) {
		drawMBlur();
		drawChar();
	}
	//char.angle = w;

	//HUD
	c.font = "10px sans-serif";
	c.textAlign = "left";
	c.textBaseline = "middle";
	c.textAlign = "left";
	c.fillStyle = "black";
	c.fillText("RINGS: " + char.rings.toString(), 21, 21);
	c.fillText("TIME: " + Math.floor(levelTimer / 60000) + ":" + ((Math.floor(levelTimer / 1000) % 60) > 9 ? "" : "0") + (Math.floor(levelTimer / 1000) % 60).toString(), 21, 31);
	c.fillStyle = "white";
	c.fillText("RINGS: " + char.rings.toString(), 20, 20);
	c.fillText("TIME: " + Math.floor(levelTimer / 60000) + ":" + ((Math.floor(levelTimer / 1000) % 60) > 9 ? "" : "0") + (Math.floor(levelTimer / 1000) % 60).toString(), 20, 30);


	//level Start screen
	titleCard(c);
}

var vScreenH = 224; // "Virtual Screen Width/Height" the lower resolution that the screen renders at by default. 
var vScreenW = 398; // this is upscaled to fit the entire screen

document.body.style.background = "black";	// set the background (aka side bar) color to black
canvi.height = vScreenH;					// set the canvas to three times the virtual width/height of the screen for upscaling.
canvi.width = vScreenW;					// any difference between this and your screen size is made up by CSS scaling
mBlurCanvi.height = vScreenH;
mBlurCanvi.width = vScreenW;
mBlurCtx.clearRect(0, 0, vScreenW, vScreenH);
// size(0);									// call the screen resize function, passing an empty value for the event
// c.fillStyle = "#999999";
// c.fillRect(0,0,canvi.width,canvi.height);
// c.fillStyle = "#444444";
// c.fillText("Click to start",50,50);
canvi.style.height = 0;

var clickToStart = document.createElement("a");
clickToStart.href = "#";
clickToStart.style.textDecoration = "none";
clickToStart.innerHTML = "Tap/Click to start!";
clickToStart.style.color = "white";
clickToStart.style.backgroundColor = "black";
clickToStart.style.position = "absolute";
clickToStart.style.left = "50%";
clickToStart.style.top = "50%";
clickToStart.style.transform = "translate(-50%,-50%)";
clickToStart.style.fontSize = "5em";
clickToStart.style.textAlign = "center";
document.body.appendChild(clickToStart);

var pausePressed = false;
var pauseIndicator = document.createElement("div");
pauseIndicator.innerHTML = "PAUSE";
pauseIndicator.style.animation = "5s ease-in-out 0s infinite running spinloop";
pauseIndicator.style.animationIterationCount = "infinite";
pauseIndicator.style.position = "absolute";
pauseIndicator.style.left = "50%";
pauseIndicator.style.top = "50%";
pauseIndicator.style.zIndex = "1000";
pauseIndicator.style.fontFamily = "monospace";
pauseIndicator.style.fontSize = "20vh";
pauseIndicator.style.color = "white";
pauseIndicator.style.textShadow = "1px 1px 1px black";
pauseIndicator.style.perspective = "200px";

window.addEventListener("resize", size);

function size(e) {
	document.body.style.background = "black";
	canvi.style.imageRendering = "crisp-edges";
	canvi.style.imageRendering = "pixelated";
	canvi.style.position = "absolute";
	if (logoVid) {
		logoVid.style.position = "absolute";
		logoVid.style.imageRendering = "pixelated";
		logoVid.style.imageRendering = "crisp-edges";
	}
	if ((window.innerHeight / canvi.height) < (window.innerWidth / canvi.width)) {
		canvi.style.height = window.innerHeight - 4 + "px";
		canvi.style.width = (window.innerHeight / vScreenH) * vScreenW - 2 + "px";
		canvi.style.left = (window.innerWidth / 2 - ((window.innerHeight / vScreenH) * vScreenW - 2) / 2) + "px";
		canvi.style.top = "0";
		if (logoVid) {
			logoVid.style.height = window.innerHeight - 4 + "px";
			logoVid.style.width = (window.innerHeight / vScreenH) * vScreenW - 2 + "px";
			logoVid.style.left = (window.innerWidth / 2 - ((window.innerHeight / vScreenH) * vScreenW - 2) / 2) + "px";
			logoVid.style.top = "0";
		}
	}
	else {
		canvi.style.height = (window.innerWidth / vScreenW) * vScreenH - 2 + "px";
		canvi.style.width = window.innerWidth - 4 + "px";
		canvi.style.top = (window.innerHeight / 2 - ((window.innerWidth / vScreenW) * vScreenH - 2) / 2) + "px";
		canvi.style.left = "0";
		if (logoVid) {
			logoVid.style.height = (window.innerWidth / vScreenW) * vScreenH - 2 + "px";
			logoVid.style.width = window.innerWidth - 4 + "px";
			logoVid.style.top = (window.innerHeight / 2 - ((window.innerWidth / vScreenW) * vScreenH - 2) / 2) + "px";
			logoVid.style.left = "0";
		}
	}
}

var slowmo1 = 0;		// variables for slowing the engine for debugging
var frameStartTime = 0;
var lastDrawTime = 0;
var titleActive = true;
var avgFPS = 0;
var frameCount = 0;

resetLevel();		// reset the game to start out

function loop() { // the main game loop

	// log the current time as the start of the frame (used for fps)
	frameStartTime = performance.now();

	// make sure that the backgroundMusic element actually fires the onload
	// event.
	if (backgroundMusic.readyState == 4) {
		backgroundMusic.dispatchEvent(new Event('load'));
	}

	// show the loading screen if elements are still loading.
	if (loadingList.length > 0) {
		drawLevel(c, 0, 0);
		c.fillStyle = "black";
		c.fillRect(0, 0, vScreenW, vScreenH);
		c.fillStyle = "white";
		c.fillText("LOADING...", vScreenW - 100, vScreenH - 30 + 5 * Math.cos(Date.now() / 100));
		backgroundMusic.pause();
		window.setTimeout(loop, 16);
		return;
	}
	else {
		backgroundMusic.play();
	}

	// ensure images are drawn without Anti-Aliasing
	c.imageSmoothingEnabled = false;

	slowmo1++;

	// run gamepad controls for outside of the title menu
	if(!titleActive){
		//gamepad controls
		gamepads = navigator.getGamepads();
		for (var i = 0; i < gamepads.length; i++) {
			if (gamepads[i] != undefined) {// The only reason why I need this line is because of Chrome. I hate you too, Chrome.
				if (gamepads[i].buttons[0].pressed) {
					if (keysDown[jumpKey] == false) {
						if (char.rolling && char.currentAnim == anim.spindash) {
							sfxObj2.spindash.load();
							sfxObj2.spindash.play();
							char.spindashCharge += 2;
						}
						controlPressed({ keyCode: 65 });
					}
					keysDown[jumpKey] = true;
				}
				else {
					if (keysDown[jumpKey] == true) {
						controlReleased({ keyCode: 65 });
					}
					keysDown[jumpKey] = false;
				}
				keysDown[startKey] = (gamepads[i].buttons[9].pressed);
				keysDown[downKey] = (gamepads[i].axes[1] > 0.5);
				keysDown[upKey] = (gamepads[i].axes[1] < -0.5);
				keysDown[leftKey] = (gamepads[i].axes[0] < -0.5);
				keysDown[rightKey] = (gamepads[i].axes[0] > 0.5);
			}
		}
	}

	
	if (titleActive) {
		// gamepad controls for the title/menu
		gamepads = navigator.getGamepads();
		for (var i = 0; i < gamepads.length; i++) {
			if (gamepads[i] != undefined) {
				if (gamepads[i].buttons[0].pressed) {
					keysDown[startKey] = true;
				}
				else {
					keysDown[startKey] = false;
				}
				keysDown[downKey] = (gamepads[i].axes[1] > 0.5);
				keysDown[upKey] = (gamepads[i].axes[1] < -0.5);
				keysDown[leftKey] = (gamepads[i].axes[0] < -0.5);
				keysDown[rightKey] = (gamepads[i].axes[0] > 0.5);
			}
		}
		// run the title screen functions (in titleScreen.js)
		titleScreen();
	}
	else if (continue1 && (keysDown[67] ? slowmo1 % 4 == 0 : true)) {//allow to freeze for developer purposes if things get too out of hand.

		//apply velocity before doing all of that collision stuff, or setting the camera position.
		char.x += char.xv * fpsFactor;
		char.y += char.yv * fpsFactor;

		// increment the timer, so we can keep time.
		timer++;

		// draw a solid color background, in case the normal background doesn't draw correctly
		c.fillStyle = "#9999FF";
		c.fillRect(0, 0, window.innerWidth, window.innerHeight);

		// toggle dev mode with the "i" key
		if (keysDown[73]) {
			if (pToggleDev == false) {
				devMode = !devMode;
			}
			pToggleDev = true;
		}
		else {
			pToggleDev = false;
		}

		// cycle through characters in dev mode with the "p" key
		if (keysDown[80]&&devMode) {
			if (pToggleChar == false) {
				charNum++;
				if (charNum >= possChars.length) { charNum = 0; }
				setChar(possChars[charNum]);
				pToggleChar = true;
			}
		}
		else { pToggleChar = false }


		//----------------------------------CONTROLS----------------------------------
		controls();

		//----------------------------------PHYSICS-----------------------------------
		if (introAnim > 80&&char.deathTimer <=0)
			physics();
		
		// do the death animation
		if(char.deathTimer > 0){
			if(char.deathTimer == 1){
				if(char.y > (level.length - 1) * 128){
					char.y = (level.length - 1) * 128;
				}
				cam.x = Math.max(Math.min(0, ((-char.x - Math.sin(char.angle) * 30 / 2) + vScreenW / 2)), -level[1].length * 128 + vScreenW);
				cam.y = Math.max(Math.min(0, (-char.y + Math.cos(char.angle) * 30 / 2) + vScreenH / 2), -(level.length - 1) * 128 + vScreenH);//-(level.length-1)*128+vScreenH/3)
			}
			char.deathTimer++;
			char.xv = 0;
			char.yv = 0;
			char.Gv = 0;
			char.y -= 7-char.GRV*char.deathTimer;
			char.currentAnim = anim.death;
			if(char.y+cam.y-char.currentAnim[0][3]>vScreenH&&char.deathTimer>50&&char.deathFade <= 0){
				// resetLevel();
				char.deathFade = 1;
			}
			if(char.deathFade > 0){
				char.deathFade ++;
				if(char.deathFade > 50){
					resetLevel();
				}
			}
		}

		var temp = 0;
		if (configuration.classicAngles) {
			var temp = char.angle
			char.angle = Math.round(char.angle / (Math.PI / 4)) * (Math.PI / 4); // <-- "classic Angles"
		}

		// update the camera after the physics
		if(char.deathTimer <= 0){
			var h1 = 30;
			cam.x += clamp((Math.max(Math.min(0, ((-char.x - Math.sin(char.angle) * h1 / 2) + vScreenW / 2)), -level[1].length * 128 + vScreenW) - cam.x), -15 * fpsFactor, 15 * fpsFactor);
			cam.y += clamp(Math.max(Math.min(0, (-char.y + Math.cos(char.angle) * h1 / 2) + vScreenH / 2), -(level.length - 1) * 128 + vScreenH) - cam.y, -15 * fpsFactor, 15 * fpsFactor);//-(level.length-1)*128+vScreenH/3)
		}

		for(var i = 0; i < cam.walls.length; i++){
			cam.x = cam.walls[i].apply(cam.x);
		}

		if (configuration.classicAngles) {
			char.angle = temp;
		}

		cam.tx = cam.x + debug.camX;
		cam.ty = cam.y + debug.camY;

		if (char.levTimer && char.levTimer > 0 && char.GRV == 0) {
			char.levTimer -= 1 * fpsFactor;
		}
		else {
			char.GRV = 0.21875;
		}
		if (char.state != -1) {
			char.levTimer = 300;
		}

		//-----------------------------------DRAW-------------------------------------

		drawing();

		if(char.deathFade > 0){
			c.fillStyle = "rgba(0,0,0,"+Math.min(char.deathFade/50,1)+")";
			c.fillRect(0,0,vScreenW,vScreenH);
		}

		lastMillis = newMillis;
		newMillis = performance.now();
		fpsFactor = ((newMillis > lastMillis ? newMillis - lastMillis : newMillis - (lastMillis - 1000)) / 100) * 6;
		if (fpsFactor > 2) {
			fpsFactor = 2;
		}
		if (fpsFactor < 1) {
			fpsFactor = 1;
		}

		if (isNaN(char.Gv)) {
			char.Gv = 0.0001;
		}

		frameCount += 1;
		avgFPS *= (frameCount - 1) / frameCount;
		avgFPS += (1000 / (newMillis > lastMillis ? newMillis - lastMillis : newMillis - (lastMillis - 1000))) / frameCount;
		if (runLevelTimer && introAnim > 80)
			levelTimer += (newMillis > lastMillis ? newMillis - lastMillis : newMillis - (lastMillis - 1000));

		// for(var i = 0; i < fpsLog.length;i++){
		// 	avgFPS += fpsLog[i];
		// }
		// avgFPS /= fpsLog.length;
		if (avgFPS < 40 && frameCount > 300) {
			motionBlurToggle = false;
		}

		//dev tools
		if (devMode) {
			debug.drawAll(cam.tx, cam.ty, c);
			c.fillStyle = "black";
			debugText = "<strong>Angle (deg):" + Math.round(char.angle * 180 / Math.PI).toString() + "<br>";
			debugText += "Wall state: " + (char.state).toString() + "<br>";
			debugText += "level objects" + (level[0].length).toString() + "<br>";
			debugText += "Hor. Velocity: " + (Math.round(char.Gv * 100) / 100).toString() + "<br>";
			debugText += "Vert. Velocity: " + (Math.round(char.yv * 100) / 100).toString() + "<br>";
			debugText += "Spindash Charge: " + (Math.round(char.spindashCharge * 100) / 100).toString() + "<br>";
			debugText += "FPS factor: " + fpsFactor + "<br>";
			debugText += "Layer: " + (char.layer).toString() + "<br>";
			debugText += "Player Pos.: (" + Math.floor(char.x) + "," + Math.floor(char.y) + ")<br>";
			debugText += "frame count:" + Math.round(frameCount).toString() + "<br>";
			debugText += "Avg. FPS:" + Math.round(avgFPS).toString() + "<br>";
			debugText += "FPS:" + Math.round(1000 / (newMillis > lastMillis ? newMillis - lastMillis : newMillis - (lastMillis - 1000))).toString() + "</strong><br>";
			debugText += "Camera: (" + Math.floor(cam.x) + "," + Math.floor(cam.y) + ")<br>";
			debugInterface.innerHTML = debugText;
			debugInterface.appendChild(fpsCanvi);
			if (motionBlurToggle) {
				mBlurCanvi.style.height = "80px";
				debugInterface.appendChild(mBlurCanvi);
			}

			// c.fillText("Angle (deg):"+Math.round(char.angle*180/Math.PI).toString(),200,10);
			// c.fillText("Wall state: "+(char.state).toString(),200,20);
			// c.fillText("Hor. Velocity: "+(Math.round(char.Gv*100)/100).toString(),200,30);
			// c.fillText("Vert. Velocity: "+(Math.round(char.yv*100)/100).toString(),200,40);
			// c.fillText("FPS factor: "+fpsFactor,200,50);
			// c.fillText("Layer: "+(char.layer).toString(),200,70);
			//c.fillText(char.pHoming,200,60);
			// c.fillText("Player Pos.: ("+Math.floor(char.x)+","+Math.floor(char.y)+")",200,90);

			var fpsNo = Math.round(1000 / (newMillis > lastMillis ? newMillis - lastMillis : newMillis - (lastMillis - 1000)));
			fC.drawImage(fpsCanvi, -1, 0);
			fC.fillStyle = "#000000";
			fC.fillRect(29, 0, 1, 20);
			fC.fillStyle = fpsNo > 50 ? "#009900" : fpsNo > 30 ? "#999900" : "#990000";
			fC.fillRect(29, 20 - (1000 / (newMillis > lastMillis ? newMillis - lastMillis : newMillis - (lastMillis - 1000))) / 3, 1, (1000 / (newMillis > lastMillis ? newMillis - lastMillis : newMillis - (lastMillis - 1000))) / 3);
			//c.drawImage(fpsCanvi,0,200);
			//c.fillText(Math.round(1000/(newMillis>lastMillis?newMillis-lastMillis:newMillis-(lastMillis-1000))).toString(),0,210);
		}
		else {
			debug.clearAll();
			debugInterface.innerHTML = "";
		}

		cam.ptx = cam.tx;
		cam.pty = cam.ty;

		if (touchControlsActive) {
			c.fillStyle = "#55555555";
			c.fillRect(vScreenW-10,5,5,15);
			c.fillRect(vScreenW-20,5,5,15);
			c.fillRect(10, 350 / 3, 100, 100);
			c.fillRect(950 / 3, 450 / 3, 50, 50);
			c.fillStyle = "#44444499";
			if (keysDown[rightKey]) {
				c.fillRect(180 / 3, 425 / 3, 50, 50);
			}
			if (keysDown[leftKey]) {
				c.fillRect(10, 425 / 3, 50, 50);
			}
			if (keysDown[upKey]) {
				c.fillRect(105 / 3, 350 / 3, 50, 50);
			}
			if (keysDown[downKey]) {
				c.fillRect(105 / 3, 500 / 3, 50, 50);
			}

		}
	}

	if (keysDown[startKey] && introAnim >= 120&&!titleActive) {
		if (!pausePressed) {
			continue1 = !continue1;
			canvi.style.filter = continue1 ? "" : "grayscale(100%)";
			if (continue1) {
				newMillis = performance.now();
				document.body.removeChild(pauseIndicator);
			}
			else
			{
				document.body.appendChild(pauseIndicator);
			}
		}
		pausePressed = true;
	}
	else {
		pausePressed = false;
	}
	window.setTimeout(loop, 16 - (performance.now() - frameStartTime));
}

function drawMBlur() {
	if (motionBlurToggle) { // motion blur (optional)
		c.globalCompositeOperation = "lighter";
		c.globalAlpha = "0.9";
		mBlurCtx.fillStyle = "rgba(2,2,2,0.2)"//"+Math.max(0,Math.min(1,1-(Math.sqrt(char.xv^2+char.yv^2)*2-char.TOP+1))).toString()+")";
		mBlurCtx.fillRect(0, 0, vScreenW, vScreenH);      // clear motion blur if you aren't moving fast enough
		c.drawImage(mBlurCanvi, 0, 0);//0.5+Math.floor((char.x+Math.sin(char.angle)*h1/2)-vScreenW/2-(char.xv*2))+cam.x,0.5+(char.y-Math.cos(char.angle)*h1/2)-vScreenH/2-(char.yv*2)+cam.y);
		c.globalAlpha = "1";
		c.globalCompositeOperation = "source-over";
	}
}

function controlPressed(e) {
	if (char.homing == true && char.state == -1) {
		if (e.keyCode == 65 && char.pHoming == false && keysDown[jumpKey] == false) { //possible bug, checks keycode against efault jump keyt instead of whatever is saved in config
			char.pHoming = true;
			char.currentAnim = anim.jump;
			char.jumpState = 1;
			var result = [0, 0, 200];
			for (var i = 0; i < level[0].length; i++) {
				if (level[0][i].targetable == true && (level[0][i].x + level[0][i].w / 2 > char.x) == char.goingLeft) {
					var dist = Math.sqrt(Math.pow((level[0][i].x + level[0][i].w / 2) - char.x, 2) + Math.pow((level[0][i].y + level[0][i].h / 2) - char.y, 2));
					//console.log("dist:"+dist+" for: "+level[0][i].hrid);
					if (dist < result[2]) {
						result = [(level[0][i].x + level[0][i].w / 2), (level[0][i].y + level[0][i].h / 2), dist];
					}
				}
			}
			if (result[0] != 0) {
				var speed = Math.sqrt(char.yv ** 2 + char.Gv ** 2);
				var angle = Math.atan2(result[1] - char.y, result[0] - char.x);
				char.Gv = Math.max(char.TOP * 2, speed) * Math.cos(angle);
				char.yv = Math.max(char.TOP * 2, speed) * Math.sin(angle);
			}
			else {
				if (Math.abs(char.Gv) < char.TOP) {
					// char.Gv += char.goingLeft?char.TOP/2:-char.TOP/2;
					// if(char.Gv > char.TOP){char.Gv = char.TOP;}
					// if(char.Gv < -char.TOP){char.Gv = -char.TOP;}
					char.Gv = char.goingLeft ? -char.TOP * 1.5 : char.TOP * 1.5;
					char.yv = Math.min(char.yv, -1);
				}
			}
			level[0][level[0].length] = new effect(char.x - 12, char.y - 32, 25, 25, "res/items/speedDash.png", 5);
			//creates particle effect for shadow's air dash
			sfxObj2.airDash.load();
			sfxObj2.airDash.play();
		}
	}
	if (char.levitate == true && char.state == -1 && char.jumpState == 1 && char.levTimer > 0) {
		if (e.keyCode == 65 && keysDown[jumpKey] == false) {
			char.pHoming = true;
			char.currentAnim = anim.levi;
			char.GRV = 0;
			char.yv = 0;
		}
	}
	if (char.dropDash == true && char.state == -1 && char.jumpState == 1) {
		if (e.keyCode == 65 && keysDown[jumpKey] == false) { //again, compares keycode to integer 65 instead of controls saved in config.
			char.pDropDash = true;
		}
	}
}

function controlReleased(e) {
	if (keysDown[jumpKey] == true && e.keyCode == 65) { //again, compares keycode to integer 65 instead of controls saved in config.
		if (char.levitate == true && char.state == -1 && char.jumpState == 1) {
			char.GRV = 0.21875;
		}
	}
}

// function fullscreen(){
// 	if(document.documentElement.requestFullscreen){
// 		document.documentElement.requestFullscreen();
// 		console.log("normal fullscreen");
// 	}
// 	else if(document.documentElement.mozRequestFullscreen){
// 		document.documentElement.mozRequestFullscreen();
// 		console.log("moz fullscreen");
// 	}
// 	else if(document.documentElement.webkitRequestFullscreen){
// 		document.documentElement.webkitRequestFullscreen();
// 		console.log("webkit fullscreen");
// 	}
// 	else if(document.documentElement.msReqestFullscreen){
// 		document.documentElement.msReqestFullscreen();
// 		console.log("ms fullscreen");
// 	}
// }

// touch controls
var avgTouch = { x: 0, y: 0, active: false };
var startTouch = { x: 0, y: 0, active: false };
function updateTouch(touches) {
	touchControlsActive = true;
	var cRect = canvi.getBoundingClientRect();
	var touch1 = {
		x: 0,
		y: 0,
		total: 0
	};
	var touch2 = {
		x: 0,
		y: 0,
		total: 0
	};
	avgTouch.x = 0;
	avgTouch.y = 0;
	for (var i = 0; i < touches.length; i++) {
		if (((touches[i].clientX - cRect.x) / cRect.width) * vScreenW * 3 > vScreenW * 1.5) {
			touch2.x += ((touches[i].clientX - cRect.x) / cRect.width) * vScreenW * 3;
			touch2.y += ((touches[i].clientY - cRect.y) / cRect.height) * vScreenH * 3;
			touch2.total++;
		}
		else {
			touch1.x += ((touches[i].clientX - cRect.x) / cRect.width) * vScreenW * 3;
			touch1.y += ((touches[i].clientY - cRect.y) / cRect.height) * vScreenH * 3;
			touch1.total++;
		}
		avgTouch.x += ((touches[i].clientX - cRect.x) / cRect.width) * vScreenW * 3;
		avgTouch.y += ((touches[i].clientY - cRect.y) / cRect.height) * vScreenH * 3;
	}
	if (touch1.total > 0) {
		touch1.x /= touch1.total;
		touch1.y /= touch1.total;
	}
	if (touch2.total > 0) {
		touch2.x /= touch2.total;
		touch2.y /= touch2.total;
	}
	if (touch1.total > 0 || touch2.total > 0) {
		avgTouch.x /= touch1.total + touch2.total;
		avgTouch.y /= touch1.total + touch2.total;
	}
	if (avgTouch.active == false && touches.length > 0 && (touch1.total > 0 || touch2.total > 0)) {
		// console.log("GO BOI!");
		startTouch.x = avgTouch.x;
		startTouch.y = avgTouch.y;
		// console.log(startTouch);
		avgTouch.active = true;
	}

	if (titleActive) {
		return;
	}
	// console.log(touch1);
	// console.log(touch2);

	if (touch2.x > 950 && touch2.x < 1100 && touch2.y > 450 && touch2.y < 600 && touch2.total > 0) {//jump button
		if (keysDown[jumpKey] == false) {
			if (char.rolling && char.currentAnim == anim.spindash) {
				// sfx.src = "";
				// sfx.src = sfxObj.spindash;
				// sfx.currentTime = 0;
				sfxObj2.spindash.load();
				sfxObj2.spindash.play();
				char.spindashCharge += 2;
			}
			controlPressed({ keyCode: 65 });
		}
		keysDown[jumpKey] = true;
	}
	else {
		if (keysDown[jumpKey] == true) {
			// console.log("control released!");
			controlReleased({ keyCode: 65 });
		}
		keysDown[jumpKey] = false;
	}
	if (touch1.x > 30 && touch1.x < 330 && touch1.y > 350 && touch1.y < 650 && touch1.total > 0) {//touchpad
		//console.log(Math.abs(touch1.x-180).toString()+","+Math.abs(touch1.y-500));
		if (Math.abs(touch1.x - 180) > Math.abs(touch1.y - 500)) {
			if (touch1.x > 180) {
				keysDown[rightKey] = true;
				keysDown[leftKey] = false;
			}
			else {
				keysDown[leftKey] = true;
				keysDown[rightKey] = false;
			}
		}
		else {
			keysDown[leftKey] = false;
			keysDown[rightKey] = false;
		}
		if (Math.abs(touch1.x - 180) < Math.abs(touch1.y - 500)) {
			if (touch1.y < 500) {
				keysDown[upKey] = true;
				keysDown[downKey] = false;
			}
			else {
				keysDown[upKey] = false;
				keysDown[downKey] = true;
			}
		}
		else {
			keysDown[upKey] = false;
			keysDown[downKey] = false;
		}

		/* if(touch1.y > 425 && touch1.y < 575){
			if(touch1.x > 180){
				keysDown[rightKey] = true;
				keysDown[leftKey] = false;
			}
			else
			{
				keysDown[leftKey] = true;
				keysDown[rightKey] = false;
			}
		}
		else
		{
			keysDown[leftKey] = false;
			keysDown[rightKey] = false;
		}
		if(touch1.x > 80 && touch1.x < 180){
			if(touch1.y < 500){
				keysDown[upKey] = true;
				keysDown[downKey] = false;
			}
			else
			{
				keysDown[upKey] = false;
				keysDown[downKey] = true;
			}
		}
		else
		{
			keysDown[upKey] = false;
			keysDown[downKey] = false;
		} */
	}
	else {
		keysDown[upKey] = false;
		keysDown[downKey] = false;
		keysDown[leftKey] = false;
		keysDown[rightKey] = false;
	}
	// console.log("touch2: "+touch2);
	// console.log((vScreenW-50)*(canvi.clientWidth/vScreenW)+","+50*(canvi.clientHeight/vScreenH));

	if(touch2.x > (vScreenW-50)*(canvi.clientWidth/vScreenW)&&touch2.y < 50*(canvi.clientHeight/vScreenH)&& touch2.total > 0){
		keysDown[startKey] = true;
	}
	else
	{
		keysDown[startKey] = false;
	}
}

window.addEventListener("click", function (e) {
	if (!playingMusic) {
		playMusic();
		playingMusic = true;
	}
	if (!gameStarted) {
		startGame();
		logoVid.currentTime = 0;
		logoVid.style.zIndex = "5";
	}
	if (document.fullscreenEnabled && document.fullscreenElement == null) {
		document.body.requestFullscreen();
	}
});

var playingMusic = false;
window.addEventListener("keydown", function (e) {
	touchControlsActive = false;
	// console.log(e.keyCode);
	if (e.keyCode == 65 && char.rolling && char.currentAnim == anim.spindash) {
		// sfx.src = "";
		// sfx.src = sfxObj.spindash;
		// sfx.currentTime = 0;
		sfxObj2.spindash.load();
		sfxObj2.spindash.play();
		char.spindashCharge += 2;
	}
	controlPressed(e);

	keysDown[e.keyCode] = true;
});

window.addEventListener("keyup", function (e) {
	controlReleased(e);
	keysDown[e.keyCode] = false;
});

canvi.addEventListener("touchstart", function (e) {
	// e.preventDefault();

	if (!playingMusic) {
		playMusic();
	}
	// if(!gameStarted){
	// 	startGame();
	// }

	updateTouch(e.touches);
	if (titleActive && !inMenu) {
		keysDown[startKey] = true;
	}
	// if(document.fullscreenEnabled&&document.fullscreenElement==null){
	// 	document.body.requestFullscreen();
	// }
});
canvi.addEventListener("touchmove", function (e) {
	e.preventDefault();
	updateTouch(e.touches);
	//c.fillRect(touch1.x,touch1.y,100,100);
});
canvi.addEventListener("touchend", function (e) {
	e.preventDefault();
	if (e.touches.length == 0) {
		if (keysDown[jumpKey] == true) {
			// console.log("control released!");
			controlReleased({ keyCode: 65 });
		}
		keysDown[upKey] = false;
		keysDown[downKey] = false;
		keysDown[leftKey] = false;
		keysDown[rightKey] = false;
		keysDown[jumpKey] = false;
		keysDown[startKey] = false;
		avgTouch.active = false;
	}
	updateTouch(e.touches);
});

window.addEventListener("gamepadconnected", function (e) {
	gamepads = navigator.getGamepads();
})

window.addEventListener("gamepaddisconnected", function (e) {
	gamepads = navigator.getGamepads();
})
