
// stores the index of the current background
var cBack = 0;

// used to animate certain backgrounds
var bkgAnim = 0;

// stores a list of canvases used for the ocean in the beach background
var back1CanvasList = [];

// load three background images used for the beach background
var backgroundImage1 = document.createElement("img");
backgroundImage1.src = "res/background/beaches2.png";
var backgroundImage2 = document.createElement("img");
backgroundImage2.src = "res/background/beaches2a.png"
var backgroundImage3 = document.createElement("img");
backgroundImage3.src = "res/background/beaches2b.png"

// draws the first background type (default beach background)
function back1(c){
	var backList1 = [backgroundImage1,backgroundImage2,backgroundImage3];
	if(back1CanvasList.length < 1){
		for(var i = 0; i < 50; i++){
			var thisList = [];
			for(var x = 0; x < 3; x++){
				var canvi2 = document.createElement("canvas");
				canvi2.width = 320;
				canvi2.height = 5;
				contex = canvi2.getContext("2d");
				contex.drawImage(backList1[x],0,-((i*4)%120+115));
				thisList.push(canvi2)
			}
			back1CanvasList.push(thisList);
		}
	}
	bkgAnim++;
	var bkg = 0;
	if(bkgAnim > 60){
		bkgAnim = 0;
	}
	if(bkgAnim > 40){
		bkg = 2;
	}
	else if(bkgAnim > 20){
		bkg = 1;
	}
	else{
		bkg = 0;
	}
	imgWidth = vScreenH*4/3;
	c.drawImage(backList1[bkg],Math.floor(cam.tx/5)%imgWidth,0,vScreenH*4/3+1,vScreenH);
	c.drawImage(backList1[bkg],Math.floor(cam.tx/5)%imgWidth+vScreenH*4/3,0,vScreenH*4/3,vScreenH);
	c.drawImage(backList1[bkg],Math.floor(cam.tx/5)%imgWidth+vScreenH*8/3-1,0,vScreenH*4/3,vScreenH);

	sonicCanvas.width = 320;
	sonicCanvas.height = 5;
	for(var i = 0; i<50; i++){
		c.drawImage(back1CanvasList[i][bkg],(Math.floor(cam.tx/(5/(i/33+1)))%(imgWidth)),(i*4+153)*(vScreenH/320),vScreenH*4/3+1,vScreenH/60);
		c.drawImage(back1CanvasList[i][bkg],(Math.floor(cam.tx/(5/(i/33+1)))%(imgWidth))+imgWidth,(i*4+153)*(vScreenH/320),vScreenH*4/3+1,vScreenH/60);
		c.drawImage(back1CanvasList[i][bkg],(Math.floor(cam.tx/(5/(i/33+1)))%(imgWidth))+imgWidth*2,(i*4+153)*(vScreenH/320),vScreenH*4/3+1,vScreenH/60);
	}
}

// load background images for back2
var lbImg = [
    newImage("res/background/CG-2b.png"),
    newImage("res/background/CG-1b.png"),
];

// moveVal stores the divisors used to scroll layers at different speeds in back2
var moveVal = [100,10,10,5];

var back2MotDet = 0;		// the current background position
var back2Canvi = document.createElement("canvas");	// stores an image of back2
var back2ctx = back2Canvi.getContext("2d");			// the context for back2Canvi
back2Canvi.style.imageRendering = "pixelated";		// draw back2Canvi without AA

// back2 draws the second background type (ice cavern)
function back2(c){
	imgWidth = vScreenH*16/9;

	// only draw a new background if the background has changed (to minimize draw calls)
	if(Math.floor(cam.tx/(moveVal[i]))%imgWidth != back2MotDet){
		back2Canvi.width = vScreenW;
		back2Canvi.height = vScreenH;
		back2ctx.fillStyle = "#0044AA"
		back2ctx.fillRect(0,0,vScreenW,vScreenH);
		back2ctx.imageSmoothingEnabled = false;
		for(var i = 0; i < lbImg.length; i++){
			back2ctx.drawImage(lbImg[i],Math.floor(cam.tx/(moveVal[i]))%imgWidth,0,vScreenH*16/9+1,vScreenH);
			back2ctx.drawImage(lbImg[i],Math.floor(cam.tx/(moveVal[i]))%imgWidth+vScreenH*16/9,0,vScreenH*16/9,vScreenH);
			back2ctx.drawImage(lbImg[i],Math.floor(cam.tx/(moveVal[i]))%imgWidth+vScreenH*32/9-1,0,vScreenH*16/9,vScreenH);
		}
		back2MotDet = Math.floor(cam.tx/(moveVal[i]))%imgWidth;
	}

	// draw the background image
	c.drawImage(back2Canvi,0,0);
}

// stores particles for the psychadellic background
var psychParts = [];

// stores a background starfield image
var starCanvi = document.createElement("canvas");

// stores the offset for the background checkers for the psychadellic background
var checkerOffset = {x:0,y:0,s:40,angle:Math.PI/3};

// draws a multicolored, psychadellic background (usually used for special stages)
function psychBack(c){

	// initialize the background
	if(psychParts.length < 1){
		// initialize background particles
		for(var i = 0; i < 10; i++){
			psychParts.push([Math.random()*vScreenW,Math.random()*vScreenH,Math.random()*5-2.5,Math.random()*5-2.5,Math.random()*360,Math.random()*5-2.5])
		}

		// initialize starfield
		starCanvi.width = vScreenW;
		starCanvi.height = vScreenH;
		var starCtx = starCanvi.getContext("2d");
		starCtx.fillStyle = "white";
		for(var i = 0; i < 50; i++){
			starCtx.fillRect(Math.round(Math.random()*vScreenW),Math.round(Math.random()*vScreenH),1,1);
		}
	}

	// draw the void of space
	c.fillStyle = "#000044";
	c.fillRect(0,0,vScreenW,vScreenH);

	// draw starfield
	c.drawImage(starCanvi,0,0);
	
	// manage all the background particles, then draw them
	for(var i = 0; i < psychParts.length; i++){
		psychParts[i][0] += psychParts[i][2];
		psychParts[i][1] += psychParts[i][3];
		psychParts[i][4] += psychParts[i][5];
		psychParts[i][0] = wrap(psychParts[i][0],-200,vScreenW+200);
		psychParts[i][1] = wrap(psychParts[i][1],-200,vScreenH+200);
		psychParts[i][4] = wrap(psychParts[i][4],0,360);
		c.fillStyle = "hsla("+psychParts[i][4].toString()+",100%,50%,0.5)";
		c.beginPath()
		c.arc(psychParts[i][0],psychParts[i][1],200,0,360);
		c.fill()
	}

	// draw the checkered background (since they are at an angle, a lot of math
	// 									is required)
	c.save();
	c.translate(vScreenW/2+Math.floor(cam.tx/3),vScreenH/2+Math.floor(cam.ty/3));
	c.rotate(checkerOffset.angle);
	var xStart = -Math.round(Math.floor(cam.tx/3)*Math.cos(checkerOffset.angle)/40+Math.floor(cam.ty/3)*Math.sin(checkerOffset.angle)/40)
	var yStart = Math.round(Math.floor(cam.tx/3)*Math.sin(checkerOffset.angle)/80-Math.floor(cam.ty/3)*Math.cos(checkerOffset.angle)/80)*2
	for(var x = xStart-8; x < xStart+9; x++){
		for(var y = yStart-6; y < yStart+7; y += 2){
			c.fillRect(x*40+checkerOffset.x%80-checkerOffset.s/2,(y+x%2)*40+checkerOffset.y%80-checkerOffset.s/2,checkerOffset.s,checkerOffset.s);
		}
	}

	// restore the drawing state
	c.restore();
	c.filter = "none";
}

// backFunc stores references to all functions used to draw a background.
var backFunc = [back1,back2,psychBack];

// set drawBack as an easy reference to the current background function
function drawBack(c){
    backFunc[cBack](c);
}

// load in additional, user-provided backgrounds.
var userBack = document.createElement("script");
userBack.src = "res/user_backgrounds.js";
document.body.appendChild(userBack);