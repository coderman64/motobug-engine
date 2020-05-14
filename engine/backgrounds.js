//bkgAnim
//background image 1 2 and 3
//
var cBack = 0;

var back1CanvasList = [];


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
	//var sc = sonicCanvas.getContext("2d");
	for(var i = 0; i<50; i++){
		//sc.drawImage(bkg,0,-((i*4)%120+115));
		//sc.fillStyle = "red";
		//sc.fillRect(0,0,320,320);
		//c.drawImage(sonicCanvas,0,0);
		c.drawImage(back1CanvasList[i][bkg],(Math.floor(cam.tx/(5/(i/33+1)))%(imgWidth)),(i*4+153)*(vScreenH/320),vScreenH*4/3+1,vScreenH/60);
		c.drawImage(back1CanvasList[i][bkg],(Math.floor(cam.tx/(5/(i/33+1)))%(imgWidth))+imgWidth,(i*4+153)*(vScreenH/320),vScreenH*4/3+1,vScreenH/60);
		c.drawImage(back1CanvasList[i][bkg],(Math.floor(cam.tx/(5/(i/33+1)))%(imgWidth))+imgWidth*2,(i*4+153)*(vScreenH/320),vScreenH*4/3+1,vScreenH/60);
	}
}

var lbImg = [
    newImage("res/background/CG-2b.png"),
    newImage("res/background/CG-1b.png"),
    //newImage("res/background/launch3.png"),
    //newImage("res/background/launch4.png")
];

var MGHImg = newImage("res/background/mgh1.png")

var moveVal = [100,10,10,5];

var back2MotDet = 0;
var back2Canvi = document.createElement("canvas");
var back2ctx = back2Canvi.getContext("2d");
back2Canvi.style.imageRendering = "pixelated";
function back2(c){
	imgWidth = vScreenH*16/9;
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
	c.drawImage(back2Canvi,0,0);
}

var psychParts = [];


function wrap(value,min,max){
	if(value < min){
		value = max-(min-value);
	}
	if(value > max){
		value = min-(max-value);
	}
	return value;
}

function clamp(value,min,max){
	if(value < min){
		value = min;
	}
	if(value > max){
		value = max;
	}
	return value;
}

var starCanvi = document.createElement("canvas");
var checkerOffset = {x:0,y:0,s:40,angle:0};

function psychBack(c){
	if(psychParts.length < 1){
		for(var i = 0; i < 10; i++){
			psychParts.push([Math.random()*vScreenW,Math.random()*vScreenH,Math.random()*5-2.5,Math.random()*5-2.5,Math.random()*360,Math.random()*5-2.5])
		}
		starCanvi.width = vScreenW;
		starCanvi.height = vScreenH;
		var starCtx = starCanvi.getContext("2d");
		starCtx.fillStyle = "white";
		for(var i = 0; i < 50; i++){
			starCtx.fillRect(Math.round(Math.random()*vScreenW),Math.round(Math.random()*vScreenH),1,1);
		}
	}
	//c.fillStyle = "hsl("+psychParts[0][4].toString()+",100%,50%)";
	c.fillStyle = "#000044";
	c.fillRect(0,0,vScreenW,vScreenH);
	c.drawImage(starCanvi,0,0);
	//c.filter = "blur(100px)";
	for(var i = 0; i < psychParts.length; i++){
		//psychParts[i][2] = clamp(psychParts[i][2]+Math.random()*2-1,-5,5);
		//psychParts[i][3] = clamp(psychParts[i][3]+Math.random()*2-1,-5,5);
		//psychParts[i][5] = clamp(psychParts[i][5]+Math.random()*2-1,-2,2);
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
	c.save();
	c.translate(vScreenW/2+Math.floor(cam.tx/3),vScreenH/2+Math.floor(cam.ty/3));
	c.rotate(checkerOffset.angle);
	//checkerOffset.x += Math.sin(Date.now()/1000);
	//checkerOffset.y += Math.cos(Date.now()/1000);
	//checkerOffset.s = 80*Math.cos(Date.now()/3250+22);
	checkerOffset.angle = Math.PI/3;//2*Math.cos(Date.now()/5560-43);
	var xStart = -Math.round(Math.floor(cam.tx/3)*Math.cos(checkerOffset.angle)/40+Math.floor(cam.ty/3)*Math.sin(checkerOffset.angle)/40)
	var yStart = Math.round(Math.floor(cam.tx/3)*Math.sin(checkerOffset.angle)/80-Math.floor(cam.ty/3)*Math.cos(checkerOffset.angle)/80)*2
	for(var x = xStart-8; x < xStart+9; x++){
		for(var y = yStart-6; y < yStart+7; y += 2){
			c.fillRect(x*40+checkerOffset.x%80-checkerOffset.s/2,(y+x%2)*40+checkerOffset.y%80-checkerOffset.s/2,checkerOffset.s,checkerOffset.s);
		}
	}
	c.restore();
	c.filter = "none";
}

function MGHBack(c){
	c.fillStyle = "#0044AA"
	c.fillRect(0,0,vScreenW,vScreenH);
    c.imageSmoothingEnabled = false;
	imgWidth = vScreenH*16/9;
	c.drawImage(MGHImg,Math.floor(cam.tx/(10))%imgWidth,0,vScreenH*16/9+1,vScreenH);
	c.drawImage(MGHImg,Math.floor(cam.tx/(10))%imgWidth+vScreenH*16/9,0,vScreenH*16/9,vScreenH);
	c.drawImage(MGHImg,Math.floor(cam.tx/(10))%imgWidth+vScreenH*32/9-1,0,vScreenH*16/9,vScreenH);
}

var backFunc = [back1,back2,psychBack];
console.log(backFunc)

function drawBack(c){
    backFunc[cBack](c);
}

var userBack = document.createElement("script");
userBack.src = "res/user_backgrounds.js";
document.body.appendChild(userBack);