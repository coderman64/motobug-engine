var canvi = document.getElementById("myCanvas");

var c = canvi.getContext("2d"); //"CanvasScreen" the context for the "final" canvas

var mBlurCanvi = document.createElement("canvas"); // additional canvas for motion blur effects

var mBlurCtx = mBlurCanvi.getContext("2d");

var motionBlurToggle = false;
var pMotionBlurToggle = false;

canvi.style.position = "absolute";
canvi.style.top = "0px";
canvi.style.left = "0px";
canvi.style.border = "1px solid black";

var backgroundMusic = document.createElement("audio");
backgroundMusic.src = "res/music/RapidBeach.wav";
var playMusic = function(){
	backgroundMusic.autoplay = true;
	backgroundMusic.play();
	backgroundMusic.loop = true;
}

var sfxObj = {
	airDash:"res/sfx/airDash.mp3",
	death:"res/sfx/death.mp3",
	explosion:"res/sfx/Explosion.mp3",
	jump:"res/sfx/jump.wav",
	looseRings:"res/sfx/looseRings.mp3",
	ring:"res/sfx/ring.mp3",
	spindash:"res/sfx/spindash.wav",
	spring2: "res/sfx/spring2.mp3",
}

var sfx = document.createElement("audio");
sfx.src = sfxObj.jump;
sfx.volume = 0.8;

var keysDown = [];
var gamepads = {};
var sonicImage = document.createElement("img");
sonicImage.src = "SonicSheet2.png";
sonicImage.style.imageRendering = "pixelated";

var backgroundImage1 = document.createElement("img");
backgroundImage1.src = "res/background/beaches2.png";
var backgroundImage2 = document.createElement("img");
backgroundImage2.src = "res/background/beaches2a.png"
var backgroundImage3 = document.createElement("img");
backgroundImage3.src = "res/background/beaches2b.png"
var bkgAnim = 0;
var introAnim = 0;
var introTriangle = document.createElement("img");
introTriangle.src = "res/background/arrowEdge.png";
//var sonicSpinImage = document.createElement("img");
//sonicSpinImage.src = "sonicJumping.png"

//var levelImage = document.createElement("img");
//levelImage.src = "testLevel.png";

var sonicCanvas = document.createElement("canvas");
sonicCanvas.width = 40;
sonicCanvas.height = 40;
var sc = sonicCanvas.getContext("2d");
var devMode = false;
var pToggleDev = false;
var charNum = 0;
var pToggleChar = false;
var touchControlsActive = false;

function lerp(v0, v1, t) {
	return (1 - t) * v0 + t * v1;
}

function grabAnim(startx,starty,W,H,n){
	//c.clearRect(0,0,window.innerWidth, window.innerHeight);
	//c.drawImage(sonicImage,0,0);
	var images = [];
	for(var i = 0; i<n; i++){
		images[i] = [startx+W*i,starty,W,H];
	}
	return images;
}

var anim = {
	stand:grabAnim(0,0,40,40,1),
	jog:grabAnim(0,40,40,40,8),
	run:grabAnim(0,80,40,40,4),
	jump:grabAnim(0,316,31,31,8),
	skid:grabAnim(40,203,40,40,1),
	crouch:grabAnim(40,243,40,40,1),
	spindash:grabAnim(0,284,32,32,5),
	push:grabAnim(0,164,34,39,4),
	hurt:grabAnim(0,203,40,40,1),
	sprung:grabAnim(0,120,43,43,5),
}
var shadow = {
	spriteSheet:"ShadowSheet.png",
	anim:{
		stand:grabAnim(0,0,41,41,1),
		jog:grabAnim(0,41,41,41,8),
		run:grabAnim(0,82,42,42,8),
		jump:grabAnim(0,315,30,30,8),
		skid:grabAnim(41,209,41,41,1),
		crouch:grabAnim(35,250,35,35,1),
		spindash:grabAnim(0,285,30,30,5),
		push:grabAnim(0,168,35,41,4),
		hurt:grabAnim(0,210,40,40,1),
		sprung:grabAnim(0,124,45,45,1),
	},
	char:{
		x:128*1,
		y:128*5+40,
		Gv:0,//ground velocity
		xv:0,//x-velocity
		yv:0,//y-velocity
		grounded: false,
		frameIndex:0,
		currentAnim:anim.stand,
		animSpeed:1,
		rolling: false,
		angle:0,
		state:0, // -1=air state; 0=ground state; 1=right wall state; 2=ceiling state; 3=left wall state;
		//airAnim:0, //0=jump; 1=run; 2=bounceA; 3=falling(after bounce)
		golock:0, //forces player to go in a certain direction for a certain amount of time
		goingLeft: true,
		spindashCharge: 0,
		jumpState: 0,// 0 = fell/walked off a cliff; 1 = jump; 2 = hurt; 3 = spring;
		hurt: false,
		rings:0,
		homing:true,
		pHoming: false,
		layer: 0,
		pAngle: 0,
		invincible: 0,
		//constants
		ACC: 0.046875,
		DEC: 0.5,
		FRC: 0.046875,
		TOP: 5.5,
		JMP: 6.5,
		GRV: 0.21875,
	}
};

var sonic = {
	spriteSheet:"SonicSheet2.png",
	anim:{
		stand:grabAnim(0,0,40,40,1),
		jog:grabAnim(0,40,40,40,8),
		run:grabAnim(0,80,40,40,4),
		jump:grabAnim(0,316,31,31,8),
		dropDash:grabAnim(31,316,31,31,1),
		skid:grabAnim(40,203,40,40,1),
		crouch:grabAnim(40,243,40,40,1),
		spindash:grabAnim(0,284,32,32,5),
		push:grabAnim(0,164,34,39,4),
		hurt:grabAnim(0,203,40,40,1),
		sprung:grabAnim(0,120,43,43,5),
	},
	char: {
		x:128*34,
		y:128*1+40,
		Gv:0,//ground velocity
		xv:0,//x-velocity
		yv:0,//y-velocity
		grounded: false,
		frameIndex:0,
		currentAnim:anim.stand,
		animSpeed:1,
		rolling: false,
		angle:0,
		state:0, // -1=air state; 0=ground state; 1=right wall state; 2=ceiling state; 3=left wall state;
		//airAnim:0, //0=jump; 1=run; 2=bounceA; 3=falling(after bounce)
		golock:0, //forces player to go in a certain direction for a certain amount of time
		goingLeft: true,
		spindashCharge: 0,
		jumpState: 0,// 0 = fell/walked off a cliff; 1 = jump; 2 = hurt; 3 = spring;
		hurt: false,
		rings:0,
		dropDash:true,
		pDropDash:false,
		dropCharge: 0,
		layer: 0,
		pAngle: 0,
		invincible: 0,
		//constants
		ACC: 0.046875,
		DEC: 0.5,
		FRC: 0.046875,
		TOP: 6,
		JMP: 6.5,
		GRV: 0.21875,
	}
};
var silver = {
	spriteSheet:"silversheet2.png",
	anim:{
		stand:grabAnim(0,0,30,48,1),
		jog:grabAnim(0,48,40,41,6),
		run:grabAnim(0,89,44,44,4),
		jump:grabAnim(0,328,32,32,8),
		skid:grabAnim(40,221,41,41,1),
		crouch:grabAnim(0,261,35,35,1),
		spindash:grabAnim(0,296,30,27,5),
		push:grabAnim(0,179,35,41,4),
		hurt:grabAnim(0,223,40,35,1),
		sprung:grabAnim(0,133,45,45,1),
		levi:grabAnim(115,221,29,48,1)
	},
	char:{
		x:100,
		y:384,
		Gv:0,//ground velocity
		xv:0,//x-velocity
		yv:0,//y-velocity
		grounded: false,
		frameIndex:0,
		currentAnim:anim.stand,
		animSpeed:1,
		rolling: false,
		angle:0,
		state:0, // -1=air state; 0=ground state; 1=right wall state; 2=ceiling state; 3=left wall state;
		//airAnim:0, //0=jump; 1=run; 2=bounceA; 3=falling(after bounce)
		golock:0, //forces player to go in a certain direction for a certain amount of time
		goingLeft: true,
		spindashCharge: 0,
		jumpState: 0,// 0 = fell/walked off a cliff; 1 = jump; 2 = hurt; 3 = spring;
		hurt: false,
		rings:0,
		homing:false,
		pHoming: false,
		levitate: true,
		layer: 0,
		pAngle: 0,
		invincible: 0,
		//constants
		ACC: 0.039875,
		DEC: 0.5,
		FRC: 0.046875,
		TOP: 5.5,
		JMP: 6.5,
		GRV: 0.21875,
	}
};
//console.log(images1);

var char = {
	x:100,
	y:384,
	Gv:0,//ground velocity
	xv:0,//x-velocity
	yv:0,//y-velocity
	grounded: false,
	frameIndex:0,
	currentAnim:anim.stand,
	animSpeed:1,
	rolling: false,
	angle:0,
	state:0, // -1=air state; 0=ground state; 1=right wall state; 2=ceiling state; 3=left wall state;
	//airAnim:0, //0=jump; 1=run; 2=bounceA; 3=falling(after bounce)
	golock:0, //forces player to go in a certain direction for a certain amount of time
	goingLeft: true,
	spindashCharge: 0,
	jumpState: 0,// 0 = fell/walked off a cliff; 1 = jump; 2 = hurt; 3 = spring;
	hurt: false,
	rings:0,
	homing:true,
	pHoming: false,
	jumpReleased: false, //makes sure that you don't homing attack by just holding down jump
	layer: 0,
	pAngle: 0,
	//constants
	ACC: 0.046875,
	DEC: 0.5,
	FRC: 0.046875,
	TOP: 6,
	JMP: 6.5,
	GRV: 0.21875,
};

function setChar(newChar){
	char = newChar.char;
	anim = newChar.anim;
	sonicImage.src = newChar.spriteSheet;
}
var possChars = [sonic,shadow,silver];
setChar(sonic);

var cam = {x:0, y:0,tx:0,ty:0};

var color = [0,0,0,0];
var timer = 0;
var continue1 = true;
var fpsFactor = 0;

var lastMillis = Date.now();
var newMillis = lastMillis;
var imageWidth = 0;
var fpsCanvi = document.createElement("canvas");
fpsCanvi.width = 30;
fpsCanvi.height = 20;
var fC = fpsCanvi.getContext("2d");

function loader(){
	var img = chunkBacklog.shift();
	chunks[chunks.length] = autoChunk(img);
	// if(chunkBacklog.length > 0){
	// 	window.requestAnimationFrame(loader());
	// }
}

//window.requestAnimationFrame(loop);
var gameStarted = false;
var startGame = function(){
	window.setInterval(loop,17);
	//window.setTimeout(loop,17);
    fullscreen();
	gameStarted = true;
}

function controls(){
	//debugging camera. First so it can suppress movement keys
	if(keysDown[86]&&devMode){
		if(keysDown[37]){
			debug.camX += 8;
		}
		if(keysDown[38]){
			debug.camY += 8;
		}
		if(keysDown[39]){
			debug.camX -= 8;
		}
		if(keysDown[40]){
			debug.camY -= 8;
		}
	}
	else
	{
		debug.camX = 0;
		debug.camY = 0;
	}
	if(keysDown[65] && char.state != -1 && keysDown[40] != true&&char.pJump != true){//jumping
		char.state = -1;
		char.anim = anim.jump;
		//console.log("angle: "+(char.angle*180/Math.PI).toString());
		char.yv -= char.JMP*Math.cos(char.angle);
		//console.log("yv: "+char.yv.toString());
		char.Gv = char.xv+char.JMP*Math.sin(char.angle);
		//console.log("xv: "+char.Gv.toString());
		char.y -= -15+45*Math.cos(char.angle);
		char.x += 30*Math.sin(char.angle);
		char.jumpState = 1;
		char.pHoming = false;
		sfx.src = sfxObj.jump;
		sfx.play();
		char.pDropDash = false;
		char.dropCharge = 0;
		char.pJump = true;
	}
	if(!keysDown[65] && char.state != -1){
		char.pJump = false;
	}
	if(!keysDown[65] && char.state == -1){ // reset drop dash if you release the jump button
		char.dropCharge = 0;
		char.pDropDash = false;
	}
	if(char.state == -1&&keysDown[65] != true&&char.jumpState == 1&&char.yv < -4){ // controllable jump height
		char.yv = -4;
	}
	if(char.rolling == false){
		if(!(keysDown[86]&&devMode)&&keysDown[39]&&(char.golock <= 0||char.Gv > 0)&&char.state != -1){
			char.goingLeft = true;
			if(char.Gv < 0){
				char.Gv += char.DEC;
				char.currentAnim = anim.skid;
			}
			else if(char.Gv < char.TOP){
				char.Gv += char.ACC;
				if(char.Gv > char.TOP){
					char.Gv = char.TOP;
				}
			}
			
			if(char.Gv > 0)
			{
				if(Math.abs(char.Gv)>=char.TOP){
					char.currentAnim = anim.run;
					char.animSpeed = Math.abs(char.Gv)/40+0.1;
				}
				else{
					char.currentAnim = anim.jog;
					char.animSpeed = Math.abs(char.Gv)/40+0.1;
				}
			}
		}
		else if(!(keysDown[86]&&devMode)&&keysDown[37]&&(char.golock <= 0||char.Gv < 0)&&char.state != -1){
			char.goingLeft = false;
			if(char.Gv > 0){
				char.Gv -= char.DEC;
				char.currentAnim = anim.skid;
			}
			else if(char.Gv > -char.TOP){
				char.Gv -= char.ACC;
				if(char.Gv < -char.TOP){
					char.Gv = -char.TOP;
				}
			}
			
			if(char.Gv < 0)
			{
				if(Math.abs(char.Gv)>=char.TOP){
					char.currentAnim = anim.run;
					char.animSpeed = Math.abs(char.Gv)/40+0.1;
				}
				else{
					char.currentAnim = anim.jog;
					char.animSpeed = Math.abs(char.Gv)/40+0.1;
				}
			}
		}
		else if(char.state != -1)
		{
			//friction
			if(char.Gv < -char.FRC){
				char.Gv += char.FRC;
			}
			else if (char.Gv > char.FRC){
				char.Gv -= char.FRC;
			}
			if(char.Gv >= -char.FRC && char.Gv <= char.FRC && char.Gv != 0){
				char.Gv = 0.0001*(char.goingLeft?1:-1);
			}
			
			if(Math.abs(char.Gv) <= 0.01){
				char.currentAnim = anim.stand;
			}
			else 
			{
				if(Math.abs(char.Gv)>char.TOP){
					char.currentAnim = anim.run;
					char.animSpeed = Math.abs(char.Gv)/40+0.1;
				}	
				else{
					char.currentAnim = anim.jog;
					char.animSpeed = Math.abs(char.Gv)/40+0.1;
				}
			}
			if(!(keysDown[86]&&devMode)&&keysDown[40]){
				if(Math.abs(char.Gv)>0.001){
					char.rolling = true;
					sfx.src = sfxObj.spindash;
					sfx.play();
				}
				else
				{
					if(keysDown[65]){
						char.currentAnim = anim.spindash;
						char.animSpeed = 1;
						char.rolling = true;
						char.spindashCharge = 0;
						sfx.src = sfxObj.spindash;
						sfx.play();
					}
					else
					{
						char.currentAnim = anim.crouch;
					}
				}
			}
		}
	}
	else
	{
		if(char.currentAnim != anim.spindash){
			char.currentAnim = anim.jump;
			char.animSpeed = Math.abs(char.Gv/20)+0.1;
			if(Math.abs(char.Gv) > 0.05){
				char.Gv = (Math.abs(char.Gv)-0.05)*(char.Gv/Math.abs(char.Gv));
			}
			else
			{
				char.Gv = (0.0001)*(char.Gv/Math.abs(char.Gv));
			}
			if(Math.abs(char.Gv) < 0.2&&char.state != -1){
				char.rolling = false;
				char.Gv = 0.0001*(char.Gv/Math.abs(char.Gv));
			}
		}
		else
		{
			if(char.spindashCharge>8){char.spindashCharge = 8;}
			char.spindashCharge -= (Math.floor(char.spindashCharge / 0.125) / 256);
			if(char.spindashCharge<0){char.spindashCharge = 0;}
			if(keysDown[40] == false){
				char.currentAnim = anim.jump;
				char.Gv = (8 + (Math.floor(char.spindashCharge) / 2))*(char.goingLeft == true?1:-1)
				sfx.src = sfxObj.airDash;
				sfx.play();
			}
		}
		if(Math.abs(char.Gv) > 16){
			char.Gv = 16*(char.Gv/Math.abs(char.Gv));
		}
	}
	if(char.golock > 0){
		char.golock--;
		if(Math.abs(char.Gv) < 0.1){
			char.golock = 0;
		}
	}

	if(char.state == -1&&char.jumpState != 2){ // air movement
		if(!(keysDown[86]&&devMode)&&keysDown[39]){
			char.goingLeft = true;
			if(char.Gv<char.TOP){
				char.Gv += char.ACC*2;
				if(char.Gv>char.TOP){char.Gv = char.TOP;}
			}
		}
		if(!(keysDown[86]&&devMode)&&keysDown[37]){
			char.goingLeft = false;
			if(char.Gv>-char.TOP){
				char.Gv -= char.ACC*2;
				if(char.Gv<-char.TOP){char.Gv = -char.TOP;}
			}
		}
	}

	if(keysDown[65] == true&&char.pDropDash == true&&char.state == -1){ // charge the drop dash
		char.dropCharge += 1;
	}

	if(keysDown[76]&&devMode){
		if(!pDevLevelChange){
			pDevLevelChange = true;
			loadNextLevel();
			resetLevel();
		}
	}
	else
	{
		pDevLevelChange = false;
	}
	
	if(keysDown[77]&&devMode){
		if(!pMotionBlurToggle){
			pMotionBlurToggle = true;
			motionBlurToggle = !motionBlurToggle
		}
	}
	else
	{
		pMotionBlurToggle = false;
	}

	
	//console.log(char.dropCharge);
}
var pDevLevelChange = false;

function resetLevel(){
	char.GRV = 0.21875;
	char.y = 256;
	char.x = 128;
	cam.x = 0;
	cam.y = 0;
	char.yv = 0;
	char.xv = 0.001;
	char.Gv = 0;
	char.goingLeft = false;
	char.frameIndex = 0;
	char.currentAnim = anim.jump;
	char.animSpeed = 0.1;
	char.rolling = false;
	introAnim = 0;
	var src1 = backgroundMusic.src;
	backgroundMusic.src = "";
	backgroundMusic.src = src1;
	playMusic();
	/*if(introAnim >= 200){
		sfx.src = sfxObj.death;
		sfx.play();
	}*/
	char.rings = 0;
	for(var i = 0; i < level[0].length; i++){
		if(level[0][i].reset != undefined){
			level[0][i].reset();
		}
	}
}

function physics(){
	// make the beginning of the stage act like a wall
	if(char.x < 15){
		char.x = 15;
		if(char.Gv < 0){
			char.Gv = -0.001;
		}
		if(keysDown[37]&&keysDown[39] != true){
			char.animSpeed = 0.05;
			char.currentAnim = anim.push;
		}
	}

	// load the next stage if you reach the end of this one.
	if(char.x > level[1].length*128-15){
		loadNextLevel();
		resetLevel();
	}

	//if you fall off the level, respawn
	if(char.y > (level.length-1)*128){
		resetLevel();
	}

	//if touching ground ??
	if(Math.abs(char.angle) > Math.PI){
		char.angle = char.angle%(Math.PI*2)+Math.PI*2;
	}

	// if you are on the floor, ceiling or walls...
	if(char.state >= 0 && char.y != NaN){

		if(char.state == 0){//if you are on the ground
			//sense the ground (two lines for angle)
			var backSense = senseVLine(char.x-9,char.y-20,46,c,char.layer);
			var frontSense = senseVLine(char.x+9,char.y-20,46,c,char.layer);

			//sense the walls
			var LsideSense = senseHLineL(char.x, char.y-20,20,c,char.layer);
			var RsideSense = senseHLineR(char.x, char.y-20,20,c,char.layer);
			//if you have an angle that is too far off, you aren't actually touching the ground (prevents weirdness at tops of curves)
			if(Math.abs(backSense[2]*Math.PI/180-char.angle) > Math.PI/5){
				backSense[0] = false;
			}
			if(Math.abs(frontSense[2]*Math.PI/180-char.angle) > Math.PI/5){
				frontSense[0] = false;
			}
			//sets the y position and angle if the ground is detected with both size
			if(backSense[0] != false && frontSense[0] != false){
				char.y = (isNaN((backSense[1]+frontSense[1])/2)?char.y:((backSense[1]+frontSense[1])/2));
				var angle1 = ((isNaN(backSense[2]*Math.PI/180)?char.angle:backSense[2]*Math.PI/180)+(isNaN(frontSense[2]*Math.PI/180)?char.angle:frontSense[2]*Math.PI/180))/2;
				char.angle = angle1;
			}
			//if only one sensor detects the ground, use that sensor to set the angle and y position
			else if(backSense[0] != false || frontSense[0] != false)
			{
				char.y = backSense[0] == false?frontSense[1]:backSense[1];
				char.angle = backSense[0] == false?frontSense[2]*Math.PI/180:backSense[2]*Math.PI/180;
			}
			else if(backSense[0] == false && frontSense[0] == false) // if there is no ground detected at all, fall
			{
				char.state = -1;
				char.jumpState = 0;
			}
			//if your angle is less than -45 degrees (-PI/4 radians), you're running up the left wall
			if(char.angle < -Math.PI/4&&Math.abs(char.Gv) > 0.01){
				char.state = 1;
			}
			//if your angle is greater than 45 degrees (PI/4 radians), you're running up the right wall
			if(char.angle > Math.PI/4&&Math.abs(char.Gv) > 0.01){
				char.state = 3;
			}
			//collide with the walls
			if(char.angle>-Math.PI/6&&RsideSense[0] == true&&char.x > RsideSense[1]-15&&Math.abs(RsideSense[2]*Math.PI/180-char.angle) > Math.PI/4&&LsideSense[1] != RsideSense[1]){
				char.x = RsideSense[1]-15;	// set the position outside of the wall
				char.Gv = 0.01*char.Gv/Math.abs(char.Gv);	// stop your movement
				char.animSpeed = 0.05;		// change animation	
				if(keysDown[39]){
					char.currentAnim = anim.push;
				}
			}
			else if(char.angle<Math.PI/6&&LsideSense[0] == true&&char.x < LsideSense[1]+15&&Math.abs(LsideSense[2]*Math.PI/180-char.angle) > Math.PI/4&&LsideSense[1] != RsideSense[1]){
				char.x = LsideSense[1]+15;		// (mirrored version of above)
				char.Gv = 0.01*char.Gv/Math.abs(char.Gv);
				char.animSpeed = 0.05;
				if(keysDown[37]){
					char.currentAnim = anim.push;
				}
			}
		}
		else if(char.state == 1){//if you're running on the left wall
			//detect the ground of the left wall
			var backSense = senseHLineR(char.x-20,char.y-9,46,c,char.layer);
			var frontSense = senseHLineR(char.x-20,char.y+9,46,c,char.layer);
			
			if(backSense[0] != false && frontSense[0] != false){
				char.x = (isNaN((backSense[1]+frontSense[1])/2)?char.y:((backSense[1]+frontSense[1])/2));
				var angle1 = ((isNaN(backSense[2]*Math.PI/180)?char.angle:backSense[2]*Math.PI/180)+(isNaN(frontSense[2]*Math.PI/180)?char.angle:frontSense[2]*Math.PI/180))/2;
				char.angle = (Math.abs(angle1-char.angle) < Math.PI/4)?angle1:(Math.abs(backSense[2]*Math.PI/180-char.angle) < Math.PI/4?backSense[2]*Math.PI/180:Math.abs(frontSense[2]*Math.PI/180-char.angle) < Math.PI/4?frontSense[2]*Math.PI/180:char.angle)
				if(char.angle > -Math.PI/4 && char.state == 1){
					char.state = 0;
				}
				if(char.angle < -3*Math.PI/4 && char.state == 1){
					char.state = 2;
				}
			}
			else if(backSense[0] != false || frontSense[0] != false)
			{
				char.x = backSense[0] == false?frontSense[1]:backSense[1];
			}
			else if(backSense[0] == false && frontSense[0] == false) // if there is no ground, fall
			{
				char.yv = char.Gv*Math.sin(char.angle);
				char.xv = char.Gv*Math.cos(char.angle);
				char.Gv = char.xv;
				char.state = -1;
				char.jumpState = 0;
			}
			//if you're going too slow, fall
			if(Math.abs(char.Gv) < 0.25&&char.state == 1){
				if(char.angle <= -Math.PI/2){
					char.state = -1;
					char.jumpState = 0;
				}
				else if(char.angle > -Math.PI/2){
					char.Gv = -5;
					char.golock = 30;
				}
			}
		}
		else if(char.state == 3){//if you're running on the right wall
			var backSense = senseHLineL(char.x+20,char.y-9,46,c,char.layer);
			var frontSense = senseHLineL(char.x+20,char.y+9,46,c,char.layer);
			if(backSense[0] != false && frontSense[0] != false){
				char.x = (isNaN((backSense[1]+frontSense[1])/2)?char.x:((backSense[1]+frontSense[1])/2));
				var angle1 = ((isNaN(backSense[2]*Math.PI/180)?char.angle:backSense[2]*Math.PI/180)+(isNaN(frontSense[2]*Math.PI/180)?char.angle:frontSense[2]*Math.PI/180))/2;
				char.angle = (Math.abs(angle1-char.angle) < Math.PI/4)?angle1:(Math.abs(backSense[2]*Math.PI/180-char.angle) < Math.PI/4?backSense[2]*Math.PI/180:Math.abs(frontSense[2]*Math.PI/180-char.angle) < Math.PI/4?frontSense[2]*Math.PI/180:char.angle)
				if(char.angle < Math.PI/4 && char.state == 3){
					char.state = 0;
				}
				
				if(char.angle > 3*Math.PI/4 && char.state == 3){
					char.state = 2;
					
				}
			}
			else if(backSense[0] != false || frontSense[0] != false)
			{
				char.x = backSense[0] == false?frontSense[1]:backSense[1];
			}
			else if(backSense[0] == false && frontSense[0] == false) // if there is no ground, fall
			{
				char.Gv = char.xv;
				char.state = -1;
				char.jumpState = 0;
				
			}
			if(Math.abs(char.Gv) < 0.25&&char.state == 3){
				if(char.angle >= Math.PI/2){
					char.state = -1;
					char.jumpState = 0;
				}
				else if(char.angle < Math.PI/2){
					char.Gv = 5;
					char.golock = 30;
				}
			}
		}
		else if(char.state == 2){//if you're running on the ceiling
			var backSense = senseVLineB(char.x-9,char.y+20,46,c,char.layer);
			var frontSense = senseVLineB(char.x+9,char.y+20,46,c,char.layer);
			if(backSense[0] != false && frontSense[0] != false){
				char.y = (isNaN((backSense[1]+frontSense[1])/2)?char.y:((backSense[1]+frontSense[1])/2));
				var angle1 = ((isNaN(backSense[2]*Math.PI/180)?char.angle:backSense[2]*Math.PI/180)+(isNaN(frontSense[2]*Math.PI/180)?char.angle:frontSense[2]*Math.PI/180))/2;
				char.angle = angle1;
				if((char.angle > -Math.PI*3/4 && char.angle < -Math.PI/4) && char.state == 2){
					char.state = 1;
				}
				if((char.angle < Math.PI*3/4 && char.angle > Math.PI/4)||(char.angle+Math.PI*2 < Math.PI*3/4 && char.angle+Math.PI*2 > Math.PI/4) && char.state == 2){
					char.state = 3;
				}
			}
			else if(backSense[0] != false || frontSense[0] != false)
			{
				char.y = backSense[0] == false?frontSense[1]:backSense[1];
				char.angle = backSense[0] == false?frontSense[2]*Math.PI/180:backSense[2]*Math.PI/180;
			}
			else if(backSense[0] == false && frontSense[0] == false) // if there is no ground, fall
			{
				char.Gv = char.xv;
				char.state = -1;
				char.jumpState = 0;
			}
			if(Math.abs(char.Gv) < 0.25&&char.state == 2){
					char.y += -15*Math.cos(char.angle)+15;
					char.x += 15*Math.sin(char.angle);
					char.state = -1;
					char.angle = 0;
			}
		}
		if(char.rolling){
			if(char.Gv/Math.abs(char.Gv) == Math.sin(char.angle)/Math.abs(Math.sin(char.angle))){
				char.Gv += Math.abs(char.Gv) > 0.01?0.3125*Math.sin(char.angle):0;
			}
			else
			{
				char.Gv += Math.abs(char.Gv) > 0.01?0.078125*Math.sin(char.angle):0;
			}
		}
		else{
			char.Gv += Math.abs(char.Gv) > 0.01?0.125*Math.sin(char.angle):0;
		}
		//set velocity based on the ground velocity
		if(char.state >= 0){
			char.xv = isNaN(char.Gv*Math.cos(char.angle))?char.xv:char.Gv*Math.cos(char.angle);
			char.yv = isNaN(char.Gv*Math.sin(char.angle))?char.yv:char.Gv*Math.sin(char.angle);
		}
	}
	else if(char.state == -1){ // if you are in the air
		
		char.yv += char.GRV*fpsFactor;
		if(char.yv > 16){char.yv = 16;} //limit y speed, so things don't explode.

		// adjust sensors based on rotation, so they always match where the character is onscreen
		var rotX = Math.sin(char.angle)*15;
		var rotY = -(Math.cos(char.angle)*15-15);

		/// SENSE EVERYTHING /// 
		var backSense = senseVLine(char.x-7+rotX,char.y-15+rotY,46,c,char.layer);
		var frontSense = senseVLine(char.x+7+rotX,char.y-15+rotY,46,c,char.layer);
		var RsideSense = senseHLineR(char.x+rotX, char.y-15+rotY,20,c,char.layer);
		var LsideSense = senseHLineL(char.x+rotX, char.y-15+rotY,20,c,char.layer);
		var backTopSense = senseVLineB(char.x-9+rotX,char.y-15+rotY,46,c,char.layer);
		var frontTopSense = senseVLineB(char.x+9+rotX,char.y-15+rotY,46,c,char.layer);

		/// BUGFIX: in case you get stuck in-between two tiles, try to pop out of the top. ///
		if(RsideSense[0]&&LsideSense[0]&&LsideSense[1] >= RsideSense[1] && LsideSense[1] <= RsideSense[1]+1){
			if(Math.abs(char.x-(RsideSense[1]-16.1-rotX)) > Math.abs(char.x-(LsideSense[1]+16.1-rotX))){
				char.x = (LsideSense[1]+16.1-rotX);
			}
			else
			{
				char.x = (RsideSense[1]-16.1-rotX);
			}
			RsideSense = senseHLineR(char.x+rotX, char.y-15+rotY,15,c,char.layer);
			LsideSense = senseHLineL(char.x+rotX, char.y-15+rotY,20,c,char.layer);
			backSense = senseVLine(char.x-7+rotX,char.y-15+rotY,46,c,char.layer);
			frontSense = senseVLine(char.x+7+rotX,char.y-15+rotY,46,c,char.layer);
			backTopSense = senseVLineB(char.x-7+rotX,char.y-15+rotY,46,c,char.layer);
			frontTopSense = senseVLineB(char.x+7+rotX,char.y-15+rotY,46,c,char.layer);
		}


		/// LANDING (LEFT SENSOR) ///
		if(backSense[0] == true && backSense[1] < char.y+rotY && (frontSense[0]==true?backSense[1] <= frontSense[1]:true)&& (Math.abs(char.angle%(Math.PI*2)) < Math.PI/2&&char.yv > 0)){
			console.log("foot1: "+(Math.abs(char.angle%(Math.PI*2))*180/Math.PI).toString());
			if(Math.abs(backSense[2]) < 80){
				if(frontSense[2] > 45 && backSense[2] > 45){
					char.state = 3;
					char.rolling = false;
				}
				else if(frontSense[2] < -45 && backSense[2] < -45){
					char.state = 1;
					char.rolling = false;
				}
				else{
					char.state = 0;
					char.rolling = false;
				}
				char.y = backSense[1]-rotY;
				char.Gv = char.yv*Math.sin(backSense[2]*Math.PI/180)+char.xv*Math.cos(backSense[2]*Math.PI/180);
				char.angle = backSense[2]*Math.PI/180;
				char.yv = 0;
				if(char.dropCharge >= 20){
					char.Gv = Math.min(char.Gv/2+8*(char.goingLeft?1:-1),12);
					char.rolling = true;
					char.dropCharge = 0;
					sfx.src = sfxObj.airDash;
					sfx.play();
				}
			}
		}
		/// LANDING (RIGHT SENSOR) ///
		if(frontSense[0] == true && frontSense[1] < char.y+rotY && (backSense[0] == true?(frontSense[1] <= backSense[1]):true) && (Math.abs(char.angle%(Math.PI*2)) < Math.PI/2&&char.yv > 0)){
			console.log("foot2");
			if(Math.abs(frontSense[2]) < 80){
				if(frontSense[2] > 45){
					char.state = 3;
					char.rolling = false;
				}
				else if(frontSense[2] < -45){
					char.state = 1;
					char.rolling = false;
				}
				else{
					char.state = 0;
					char.rolling = false;
				}
				char.y = frontSense[1]-rotY;
				char.Gv = char.yv*Math.sin(frontSense[2]*Math.PI/180)+char.xv*Math.cos(frontSense[2]*Math.PI/180);
				char.angle = frontSense[2]*Math.PI/180;
				char.yv = 0;
				if(char.dropCharge >= 20){
					char.Gv = Math.min(char.Gv/2+8*(char.goingLeft?1:-1),12);
					char.rolling = true
					char.dropCharge = 0;
					sfx.src = sfxObj.airDash;
					sfx.play();
				}
			}
		}

		/// RUNNING INTO THINGS IN MID AIR ///
		if(RsideSense[0] == true&&char.x+rotX > RsideSense[1]-16&&char.state == -1&&RsideSense[1] != LsideSense[1]+1){
			console.log("sideleft");
			char.x = RsideSense[1]-16.1-rotX;
			if(char.Gv > 0){
				char.Gv = 0.001*char.Gv/Math.abs(char.Gv);
			}			
		}
		if(LsideSense[0] == true&&char.x+rotX < LsideSense[1]+16&&char.state == -1&&RsideSense[1] != LsideSense[1]+1){
			console.log("sideright");
			char.x = LsideSense[1]+16.1-rotX;
			if(char.Gv < 0){
				char.Gv = 0.001*char.Gv/Math.abs(char.Gv);
			}
		}
		if(backTopSense[0] == true&&char.y+rotY<backTopSense[1]+30&&char.yv<0){
			console.log("head1");
			char.yv = -char.yv/2;
			char.y = backTopSense[1]+30-rotY;
		}
		else if(frontTopSense[0] == true&&char.y+rotY<frontTopSense[1]+30&&char.yv < 0){
			console.log("head2");
			char.yv = -char.yv/2;
			char.y = frontTopSense[1]+30-rotY;
		}


		/*if (char.yv < 0 && char.yv > -4)//air drag
		{
			//char.Gv -= (Math.round(char.Gv / 0.125) / 256);
		}*/
		char.xv = char.Gv;

		/// ANIMATIONS ///
		if(char.jumpState == 1&&(char.levitate==false||char.yv != 0)){
			char.currentAnim = anim.jump;
			char.animSpeed = 0.5;
		}
		if(char.jumpState == 3){
			char.currentAnim = anim.sprung;
			char.animSpeed = 0.2;
			if(char.yv > 0){
				char.currentAnim = anim.jog;
				char.jumpState = 0;
			}
		}
		if(char.jumpState == 2){
			char.currentAnim = anim.hurt;
		}

		// once you slow down, slowly transition angle in midair to horizontal
		if(char.yv > -2){
			char.angle = lerp(char.angle,lerp(char.angle,0,0.3),0.3);
		}

		// adjust x and y positions so you rotate around your center rather than around the bottom of the sprite
		char.x += Math.abs(Math.sin((char.angle-char.pAngle)/2)*(30))*Math.sin(char.angle);
		char.y += Math.abs(Math.sin((char.angle-char.pAngle)/2)*(30))*Math.cos(char.angle);
	}
	/// END OF AIR PHYSICS ///


	/// SLIDE DOWN SLOPE IF NOT FAST ENOUGH ///
	if(Math.abs(char.angle+Math.PI/4) < Math.PI/8 && Math.abs(char.Gv) < 0.1&&char.state != -1){
		char.Gv = -2;
		char.golock = 30;
	}
	if(Math.abs(char.angle-Math.PI/4) < Math.PI/8 && Math.abs(char.Gv) < 0.1&&char.state != -1){
		char.Gv = 2;
		char.golock = 30;
	}

	// add the character collision rectangle to the debug screen.
	debug.addRect(char.x-15+15*Math.sin(char.angle),char.y-20-20*Math.cos(char.angle),30,40,"#00550055"); 
	
	/// COLLIDE WITH STAGE ITEMS ///
	for(var i = 0; i < level[0].length; i++){
		if(level[0][i].disable != true&&char.x+15+15*Math.sin(char.angle) > level[0][i].x&&char.x-15+15*Math.sin(char.angle) < level[0][i].x+level[0][i].w){
			if(level[0][i].hit&&char.y+20-20*Math.cos(char.angle) > level[0][i].y&&char.y-20-20*Math.cos(char.angle) < level[0][i].y+level[0][i].h){
				level[0][i].hit(char);
			}
			if(level[0][i].destroy){ // remove items marked to be destroyed
				level[0].splice(i,1);
				i--;
			}
		}
	}

	/// GET HIT ///
	if(char.hurt&&char.rings <= 0&&char.invincible == 0){ // respawn if you have no rings
		resetLevel();
		char.hurt = false;
	}
	if(char.hurt&&char.rings > 0&&char.invincible == 0){ // throw rings if you have some
		char.hurt = false;
		char.GRV = 0.21875;
		var angle = Math.PI/Math.min(char.rings,32);	// calculate the angle between rings
		for(var i = 0; i < Math.min(char.rings,32); i++){ // instantiate thrown rings
			level[0][level[0].length] = new hitRing(char.x+Math.cos(angle*i)*16,char.y-20-Math.sin(angle*i)*16,16,16,"res/items/ring.png",Math.cos(angle*i)*4,-Math.sin(angle*i)*4);
		}
		// update character status
		char.rings = 0;
		char.invincible = 240;
		// play lost rings sound
		sfx.src = sfxObj.looseRings;
		sfx.play();
	}
	if(char.hurt&&char.invincible > 0)
	{
		char.hurt = false; // you can't get hurt while invincible!
	}
	char.pAngle = char.angle; // set the angle to the previous angle

	/// DROP DASH ///
	if (char.dropCharge >= 10 && char.state == -1&&char.jumpState == 1){
		char.currentAnim = anim.dropDash;
		if(char.dropCharge == 20){
			sfx.src = sfxObj.spindash;
			sfx.play();
		}
	}

	// reset himing attack on ground
	if(char.state != -1){
		char.pHoming = true;
	}
}

function drawChar(){
//draw Character
	//console.log("sonic is drawn");
	var a = (char.currentAnim[Math.floor(char.frameIndex)][2]/2)*((char.Gv<0)?1:-1);
	var b = -(char.currentAnim[Math.floor(char.frameIndex)][3])+15;
	//char.angle = Math.round(char.angle/(Math.PI/4))*(Math.PI/4); // <-- "classic Angles"
	c.translate((cam.x == 0?char.x:((cam.x==(-level[1].length*128+vScreenW))?char.x-level[1].length*128+vScreenW:vScreenW/2+(cam.tx-cam.x)))+a*Math.cos(char.angle)-b*Math.sin(char.angle),/**HERE*/(cam.y >= -15?char.y-15:((cam.y==(-(level.length-1)*128+vScreenH))?(char.y-(level.length-1)*128+vScreenH):vScreenH/2+(cam.ty-cam.y)))+b*Math.cos(char.angle)+a*Math.sin(char.angle));
	c.rotate(char.angle);
    if(motionBlurToggle){
        mBlurCtx.translate((vScreenW/2+(cam.tx-cam.x))+a*Math.cos(char.angle)-b*Math.sin(char.angle),/**HERE*/vScreenH/2+(cam.ty-cam.y)+b*Math.cos(char.angle)+a*Math.sin(char.angle));
        mBlurCtx.rotate(char.angle);
    }
	if(char.Gv < 0){
		c.scale(-1,1);
        mBlurCtx.scale(-1,1);
	}
	sonicCanvas.width = char.currentAnim[Math.floor(char.frameIndex)][2];
	sonicCanvas.height = char.currentAnim[Math.floor(char.frameIndex)][3];
	//console.log(sonicCanvas.width+","+sonicCanvas.height)
	//console.log("translations done")
	sc.imageSmoothingEnabled = false;
	if(char.levitate==true&&char.GRV == 0&&char.state == -1){ // draw levitation for silver
		sc.filter = "invert(50%) sepia(200%) hue-rotate(120deg) brightness(110%) contrast(200%) opacity(100%) blur(2px)";
		sc.drawImage(sonicImage,-char.currentAnim[Math.floor(char.frameIndex)][0],-char.currentAnim[Math.floor(char.frameIndex)][1]);
		/*if(char.invincible %10 < 5){
			//c.drawImage(sonicCanvas,-1,-1);
		}*/
		sc.filter = "sepia(0%)";
		sc.drawImage(sonicImage,-char.currentAnim[Math.floor(char.frameIndex)][0],-char.currentAnim[Math.floor(char.frameIndex)][1]);
		sc.filter = "sepia(200%) hue-rotate(120deg) brightness(80%) contrast(200%) opacity(50%)";
	}
	sc.drawImage(sonicImage,-char.currentAnim[Math.floor(char.frameIndex)][0],-char.currentAnim[Math.floor(char.frameIndex)][1]);
	if(char.invincible %10 < 5){
		c.drawImage(sonicCanvas,0,0);
        if(motionBlurToggle&&Math.sqrt(char.xv**2+char.yv**2) >= char.TOP){
            mBlurCtx.globalAlpha = "1";
            mBlurCtx.drawImage(sonicCanvas,0,0);
        }
	}
	if(char.invincible > 0){
		char.invincible--;
	}
	else
	{
		char.invincible = 0;
	}
	c.setTransform(1,0,0,1,0,0);//reset transformations
    if(motionBlurToggle){
        mBlurCtx.setTransform(1,0,0,1,0,0);//reset transformations
        //mBlurCtx.filter = "blur(0.5px)";
        mBlurCtx.globalAlpha = "1";
        mBlurCtx.drawImage(mBlurCanvi,-char.xv,-char.yv);
        //mBlurCtx.filter = "";
    }
}

function drawing(){
	//update frames
	char.frameIndex += Math.abs(char.animSpeed)*fpsFactor;
	if(char.frameIndex>=char.currentAnim.length){char.frameIndex = 0;}
	//draw background
	c.imageSmoothingEnabled = false;
	//c.drawImage(backgroundImage,Math.floor(cam.x/1.5),cam.y/2,vScreenH*4/9,vScreenH/3);
	//c.drawImage(backgroundImage,Math.floor(cam.x/1.5+backgroundImage.width*2),cam.y/2,backgroundImage.width*2,backgroundImage.height*2);
	drawBack(c);
	
	if(char.layer >= 1){
        drawMBlur();
		drawChar();
	}

	//draw level
	drawLevel(c,Math.floor(cam.tx),Math.floor(cam.ty));

	if(char.layer < 1){
        drawMBlur();
		drawChar();
	}
	//char.angle = w;

	//HUD

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
mBlurCtx.clearRect(0,0,vScreenW,vScreenH);
size(0);									// call the screen resize function, passing an empty value for the event
c.fillStyle = "#999999";
c.fillRect(0,0,canvi.width,canvi.height);
c.fillStyle = "#444444";
c.fillText("Click to start",50,50);

var pausePressed =false;

window.addEventListener("resize",size);

function size(e){
	document.body.style.background = "black";
	canvi.style.imageRendering = "crisp-edges";
	canvi.style.position = "absolute";
	if((window.innerHeight/canvi.height) < (window.innerWidth/canvi.width)){
		canvi.style.height = window.innerHeight-4+"px";
		canvi.style.width = (window.innerHeight/vScreenH)*vScreenW-2+"px";
		canvi.style.left = (window.innerWidth/2-((window.innerHeight/vScreenH)*vScreenW-2)/2)+"px";
		canvi.style.top = "0";
	}
	else{
		canvi.style.height = (window.innerWidth/vScreenW)*vScreenH-2+"px";
		canvi.style.width = window.innerWidth-4+"px";
		canvi.style.top = (window.innerHeight/2-((window.innerWidth/vScreenW)*vScreenH-2)/2)+"px";
		canvi.style.left = "0";
	}
}

var slowmo1 = 0;		// variables for slowing the engine for debugging
var timeSince = 0;
var frameStartTime = 0;
var lastDrawTime = 0;

resetLevel();		// reset the game to start out

function loop(){ // the main game loop

	slowmo1++;

	fpsFactor = (keysDown[67]?1:fpsFactor);
	//fpsFactor = 2;
	
	frameStartTime = Date.now();

	//Date.now()-timeSince > 17
	if(continue1&&(keysDown[67]?slowmo1%4==0:true)){//allow to freeze for developer purposes if things get too out of hand.
		timeSince = Date.now()
		//gamepad controls

		if(navigator.getGamepads().length > 0){
			console.log("gamepad(s) connected!");
			gamepads = navigator.getGamepads();
			for(var i = 0; i < gamepads.length; i++){
				if(gamepads[i] != undefined){// The only reason why I need this line is because of Chrome. I hate you too, Chrome.
					if(gamepads[i].buttons[0].pressed){
						if(keysDown[65] == false){
							if(char.rolling&&char.currentAnim == anim.spindash){
								sfx.src = "";
								sfx.src = sfxObj.spindash;
								sfx.currentTime = 0;
								sfx.play();
								char.spindashCharge += 2;
							}
							controlPressed({keyCode:65});
						}
						keysDown[65] = true;
					}
					else
					{
						if(keysDown[65] == true){
							controlReleased({keyCode:65});
						}
						keysDown[65] = false;
					}
					keysDown[40] = (gamepads[i].axes[1] > 0.5);
					keysDown[38] = (gamepads[i].axes[1] < -0.5);
					keysDown[37] = (gamepads[i].axes[0] < -0.5);
					keysDown[39] = (gamepads[i].axes[0] > 0.5);	
				}
			}
		}

		//camera position
		//apply velocity before doing all of that collision stuff, or setting the camera position.
		char.x += char.xv*fpsFactor;
		char.y += char.yv*fpsFactor;
		/*if(false&&char.currentAnim[Math.floor(char.frameIndex)]){
			h1 = char.currentAnim[Math.floor(char.frameIndex)][3];
		}
		else
		{
			h1 = 30;
		}*/
		h1 = 30;
		cam.x = Math.max(Math.min(0,Math.floor((-char.x-Math.sin(char.angle)*h1/2)+vScreenW/2+(char.xv*2))),-level[1].length*128+vScreenW);
		cam.y = Math.max(Math.min(0,(-char.y+Math.cos(char.angle)*h1/2)+vScreenH/2+(char.yv*2)),-(level.length-1)*128+vScreenH);//-(level.length-1)*128+vScreenH/3)
		
		cam.tx = cam.x+debug.camX;
		cam.ty = cam.y+debug.camY;
		
		timer++;

		c.fillStyle = "#9999FF";
		c.fillRect(0,0,window.innerWidth, window.innerHeight);

		if(keysDown[73]){
			if(pToggleDev == false){
				devMode = !devMode;
			}
			pToggleDev = true;
		}
		else
		{
			pToggleDev = false;
		}

		if(keysDown[80]){
			if(pToggleChar == false){
				charNum++;
				if(charNum>=possChars.length){charNum = 0;}
				setChar(possChars[charNum]);
				pToggleChar = true;
			}
		}
		else{pToggleChar = false}


		//----------------------------------CONTROLS----------------------------------
		controls();

		//----------------------------------PHYSICS-----------------------------------
		physics();

		//-----------------------------------DRAW-------------------------------------

		drawing();

		c.font = "10px sans-serif";
		c.textAlign = "left";
		
		lastMillis = newMillis;
		newMillis = Date.now();
		fpsFactor = ((newMillis>lastMillis?newMillis-lastMillis:newMillis-(lastMillis-1000))/100)*6;
		if(fpsFactor>2){
			fpsFactor = 2;
		}
		if(fpsFactor < 1){
			fpsFactor = 1;
		}

		if(isNaN(char.Gv)){
			char.Gv = 0.0001;
		}

		//dev tools
		if(devMode){
			debug.drawAll(cam.tx,cam.ty,c);
			c.fillStyle = "black";
			c.fillText("Angle (deg):"+Math.round(char.angle*180/Math.PI).toString(),200,10);
			c.fillText("Wall state: "+(char.state).toString(),200,20);
			c.fillText("Hor. Velocity: "+(Math.round(char.Gv*100)/100).toString(),200,30);
			c.fillText("FPS factor: "+fpsFactor,200,40);
			c.fillText("FPS: "+Math.round(1000/(newMillis>lastMillis?newMillis-lastMillis:newMillis-(lastMillis-1000))).toString(),200,50);
			c.fillText("Layer: "+(char.layer).toString(),200,60);
			//c.fillText(char.pHoming,200,60);
			c.fillText("Player Pos.: ("+Math.floor(char.x)+","+Math.floor(char.y)+")",200,80);
			fC.drawImage(fpsCanvi,-1,0);
			fC.fillStyle = "#000000";
			fC.fillRect(29,0,1,20);
			fC.fillStyle = "#009900";
			fC.fillRect(29,20-(1000/(newMillis>lastMillis?newMillis-lastMillis:newMillis-(lastMillis-1000)))/3,1,(1000/(newMillis>lastMillis?newMillis-lastMillis:newMillis-(lastMillis-1000)))/3);
			c.drawImage(fpsCanvi,0,200);
		}
		else
		{
			debug.clearAll();
		}

		c.textAlign = "left";
		c.fillStyle = "black";
		c.fillText("RINGS: "+char.rings.toString(),21,21);
		c.fillStyle = "white";
		c.fillText("RINGS: "+char.rings.toString(),20,20);
        
		if(touchControlsActive){
			c.fillStyle = "#55555555";
			c.fillRect(10,350/3,100,100);
			c.fillRect(950/3,450/3,50,50);
			c.fillStyle = "#990000";
			if(keysDown[39]){
				c.fillRect(180/3,425/3,50,50);
			}
			if(keysDown[37]){
				c.fillRect(10,425/3,50,50);
			}
			if(keysDown[38]){
				c.fillRect(105/3,350/3,50,50);
			}
			if(keysDown[40]){
				c.fillRect(105/3,500/3,50,50);
			}

		}
	}
	//console.
	//window.requestAnimationFrame(loop);
	if(keysDown[13]&&introAnim >= 120){
		if(!pausePressed){
			continue1 = !continue1;
		}
		pausePressed = true;
	}
	else
	{
		pausePressed = false;
	}
	//console.log((Date.now()>frameStartTime?Date.now()-frameStartTime:Date.now()-(frameStartTime-1000)));
	//window.setTimeout(loop,Math.min(17,Math.max(17-(Date.now()>frameStartTime?Date.now()-frameStartTime:Date.now()-(frameStartTime-1000)),0)));
}

function drawMBlur(){
    if(motionBlurToggle){ // motion blur (optional)
        c.globalCompositeOperation = "lighter";
        c.globalAlpha = "0.9";
        mBlurCtx.fillStyle = "rgba(0,0,0,0.2)"//"+Math.max(0,Math.min(1,1-(Math.sqrt(char.xv^2+char.yv^2)*2-char.TOP+1))).toString()+")";
        mBlurCtx.fillRect(0,0,vScreenW,vScreenH);      // clear motion blur if you aren't moving fast enough
        //c.globalAlpha = Math.max(Math.min(0.5,(Math.abs(char.Gv)-char.TOP)/5+1),0).toString();
        c.drawImage(mBlurCanvi,0.5+Math.floor((char.x+Math.sin(char.angle)*h1/2)-vScreenW/2-(char.xv*2))+cam.x,0.5+(char.y-Math.cos(char.angle)*h1/2)-vScreenH/2-(char.yv*2)+cam.y);
        c.globalAlpha = "1";
        c.globalCompositeOperation = "source-over";
        //if(Math.max(Math.min(0.5,(Math.abs(char.Gv)-char.TOP)/5+1),0) == 0){
        
        //}
    }
}

function controlPressed(e){
	if(char.homing == true&&char.state == -1){
		if(e.keyCode == 65&&char.pHoming == false&&keysDown[65] == false){
			char.pHoming = true;
			char.currentAnim = anim.jump;
			char.jumpState = 1;
			var result = [0,0,200];
			for(var i = 0; i < level[0].length; i++){
				if(level[0][i].targetable == true&&(level[0][i].x+level[0][i].w/2 > char.x) == char.goingLeft){
					var dist = Math.sqrt(Math.pow((level[0][i].x+level[0][i].w/2)-char.x,2)+Math.pow((level[0][i].y+level[0][i].h/2)-char.y,2));
					//console.log("dist:"+dist+" for: "+level[0][i].hrid);
					if(dist < result[2]){
						result = [(level[0][i].x+level[0][i].w/2),(level[0][i].y+level[0][i].h/2),dist];
					}
				}
			}
			if(result[0] != 0){
				var angle = Math.atan2(result[1]-char.y,result[0]-char.x);
				char.Gv = char.TOP*Math.cos(angle);
				char.yv = char.TOP*Math.sin(angle);
			}
			else
			{
				if(Math.abs(char.Gv) < char.TOP){
					char.Gv += char.goingLeft?char.TOP/2:-char.TOP/2;
					if(char.Gv > char.TOP){char.Gv = char.TOP;}
					if(char.Gv < -char.TOP){char.Gv = -char.TOP;}
				}
			}
			level[0][level[0].length] = new effect(char.x-12,char.y-32,25,25,"res/characters/sonic/speedDash.png",5);
			sfx.src = sfxObj.airDash;
			sfx.play();
		}
	}
	if(char.levitate == true&&char.state == -1&&char.jumpState == 1){
		if(e.keyCode == 65&&keysDown[65] == false){
			char.pHoming = true;
			char.currentAnim = anim.levi;
			char.GRV = 0;
			char.yv = 0;
		}
	}
	if(char.dropDash == true && char.state == -1&&char.jumpState == 1){
		if(e.keyCode == 65&&keysDown[65] == false){
			char.pDropDash = true;
		}
	}
}

function controlReleased(e){
	if(keysDown[65] == true && e.keyCode == 65){
		if(char.levitate == true&&char.state == -1&&char.jumpState == 1){
			char.GRV = 0.21875;
		}
	}
}

function fullscreen(){
	if(document.documentElement.requestFullscreen){
		document.documentElement.requestFullscreen();
		console.log("normal fullscreen");
	}
	else if(document.documentElement.mozRequestFullscreen){
		document.documentElement.mozRequestFullscreen();
		console.log("moz fullscreen");
	}
	else if(document.documentElement.webkitRequestFullscreen){
		document.documentElement.webkitRequestFullscreen();
		console.log("webkit fullscreen");
	}
	else if(document.documentElement.msReqestFullscreen){
		document.documentElement.msReqestFullscreen();
		console.log("ms fullscreen");
	}
}

// touch controls
function updateTouch(touches){
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
	for(var i = 0; i < touches.length; i++){
		if(((touches[i].clientX-cRect.x)/cRect.width)*vScreenW*3 > vScreenW*1.5){
			touch2.x += ((touches[i].clientX-cRect.x)/cRect.width)*vScreenW*3;
			touch2.y += ((touches[i].clientY-cRect.y)/cRect.height)*vScreenH*3;
			touch2.total++;
		}
		else
		{
			touch1.x += ((touches[i].clientX-cRect.x)/cRect.width)*vScreenW*3;
			touch1.y += ((touches[i].clientY-cRect.y)/cRect.height)*vScreenH*3;
			touch1.total++;
		}
	}
	if(touch1.total > 0){
		touch1.x /= touch1.total;
		touch1.y /= touch1.total;
	}
	if(touch2.total > 0){
		touch2.x /= touch2.total;
		touch2.y /= touch2.total;
	}
	console.log(touch1);
	console.log(touch2);
	
	if(touch2.x > 950 && touch2.x < 1100 && touch2.y > 450 && touch2.y < 600 && touch2.total > 0){//jump button
		if(keysDown[65] == false){
			if(char.rolling&&char.currentAnim == anim.spindash){
				sfx.src = "";
				sfx.src = sfxObj.spindash;
				sfx.currentTime = 0;
				sfx.play();
				char.spindashCharge += 2;
			}
			controlPressed({keyCode: 65});
		}
		keysDown[65] = true;
	}
	else
	{
		if(keysDown[65] == true){
			console.log("control released!");
			controlReleased({keyCode:65});
		}
		keysDown[65] = false;
	}
	if(touch1.x > 30 && touch1.x < 330 && touch1.y > 350 && touch1.y < 650 && touch1.total > 0){//touchpad
		console.log(Math.abs(touch1.x-180).toString()+","+Math.abs(touch1.y-500));
		if(Math.abs(touch1.x-180) > Math.abs(touch1.y-500)){
			if(touch1.x > 180){
				keysDown[39] = true;
				keysDown[37] = false;
			}
			else
			{
				keysDown[37] = true;
				keysDown[39] = false;
			}
		}
		else
		{
			keysDown[37] = false;
			keysDown[39] = false;
		}
		if(Math.abs(touch1.x-180) < Math.abs(touch1.y-500)){
			if(touch1.y < 500){
				keysDown[38] = true;
				keysDown[40] = false;
			}
			else
			{
				keysDown[38] = false;
				keysDown[40] = true;
			}
		}
		else
		{
			keysDown[38] = false;
			keysDown[40] = false;
		}

		/* if(touch1.y > 425 && touch1.y < 575){
			if(touch1.x > 180){
				keysDown[39] = true;
				keysDown[37] = false;
			}
			else
			{
				keysDown[37] = true;
				keysDown[39] = false;
			}
		}
		else
		{
			keysDown[37] = false;
			keysDown[39] = false;
		}
		if(touch1.x > 80 && touch1.x < 180){
			if(touch1.y < 500){
				keysDown[38] = true;
				keysDown[40] = false;
			}
			else
			{
				keysDown[38] = false;
				keysDown[40] = true;
			}
		}
		else
		{
			keysDown[38] = false;
			keysDown[40] = false;
		} */
	}
	else{
		keysDown[38] = false;
		keysDown[40] = false;
		keysDown[37] = false;
		keysDown[39] = false;
	}
}

window.addEventListener("click",function(e){
	if(!playingMusic){
		playMusic();
		playingMusic = true;
	}
	if(!gameStarted){
		startGame();
	}
	
});

var playingMusic = false;
window.addEventListener("keydown",function(e){
	touchControlsActive = false;
	console.log(e.keyCode);
	if(e.keyCode == 65&&char.rolling&&char.currentAnim == anim.spindash){
		sfx.src = "";
		sfx.src = sfxObj.spindash;
		sfx.currentTime = 0;
		sfx.play();
		char.spindashCharge += 2;
	}
	controlPressed(e);
	
	keysDown[e.keyCode] = true;
});

window.addEventListener("keyup",function(e){
	controlReleased(e);
	keysDown[e.keyCode] = false;
});

canvi.addEventListener("touchstart",function(e){
	e.preventDefault();
	
	if(!playingMusic){
		playMusic();
	}
	if(!gameStarted){
		startGame();
	}

	updateTouch(e.touches)
});
canvi.addEventListener("touchmove",function(e){
	e.preventDefault();
	updateTouch(e.touches)
	//c.fillRect(touch1.x,touch1.y,100,100);
});
canvi.addEventListener("touchend",function(e){
	e.preventDefault();
	if(e.touches.length == 0){
		if(keysDown[65] == true){
			console.log("control released!");
			controlReleased({keyCode:65});
		}
		keysDown[38] = false;
		keysDown[40] = false;
		keysDown[37] = false;
		keysDown[39] = false;
		keysDown[65] = false;
	}
	updateTouch(e.touches);
});


//   ^ - 
// <   >
// |---| -- 32

