//bkgAnim
//background image 1 2 and 3
//
var cBack = 0;
function back1(c){
    bkgAnim++;
	var bkg = backgroundImage1;
	if(bkgAnim > 60){
		bkgAnim = 0;
	}
	if(bkgAnim > 40){
		bkg = backgroundImage3;
	}
	else if(bkgAnim > 20){
		bkg = backgroundImage2;
	}
	else{
		bkg = backgroundImage1;
	}
	imgWidth = vScreenH*4/3;
	c.drawImage(bkg,Math.floor(cam.tx/5)%imgWidth,0,vScreenH*4/3+1,vScreenH);
	c.drawImage(bkg,Math.floor(cam.tx/5)%imgWidth+vScreenH*4/3,0,vScreenH*4/3,vScreenH);
	c.drawImage(bkg,Math.floor(cam.tx/5)%imgWidth+vScreenH*8/3-1,0,vScreenH*4/3,vScreenH);

	sonicCanvas.width = 320;
	sonicCanvas.height = 5;
	//var sc = sonicCanvas.getContext("2d");
	for(var i = 0; i<50; i++){
		sc.drawImage(bkg,0,-((i*4)%120+115));
		//sc.fillStyle = "red";
		//sc.fillRect(0,0,320,320);
		//c.drawImage(sonicCanvas,0,0);
		c.drawImage(sonicCanvas,(Math.floor(cam.tx/(5/(i/33+1)))%(imgWidth)),(i*4+153)*(vScreenH/320),vScreenH*4/3+1,vScreenH/60);
		c.drawImage(sonicCanvas,(Math.floor(cam.tx/(5/(i/33+1)))%(imgWidth))+imgWidth,(i*4+153)*(vScreenH/320),vScreenH*4/3+1,vScreenH/60);
		c.drawImage(sonicCanvas,(Math.floor(cam.tx/(5/(i/33+1)))%(imgWidth))+imgWidth*2,(i*4+153)*(vScreenH/320),vScreenH*4/3+1,vScreenH/60);
	}
}

var lbImg = [
    newImage("res/background/CG-2b.png"),
    newImage("res/background/CG-1b.png"),
    //newImage("res/background/launch3.png"),
    //newImage("res/background/launch4.png")
];

var moveVal = [100,10,10,5];

function back2(c){
	c.fillStyle = "#0044AA"
	c.fillRect(0,0,vScreenW,vScreenH);
    c.imageSmoothingEnabled = false;
    imgWidth = vScreenH*16/9;
    for(var i = 0; i < lbImg.length; i++){
        c.drawImage(lbImg[i],Math.floor(cam.tx/(moveVal[i]))%imgWidth,0,vScreenH*16/9+1,vScreenH);
        c.drawImage(lbImg[i],Math.floor(cam.tx/(moveVal[i]))%imgWidth+vScreenH*16/9,0,vScreenH*16/9,vScreenH);
        c.drawImage(lbImg[i],Math.floor(cam.tx/(moveVal[i]))%imgWidth+vScreenH*32/9-1,0,vScreenH*16/9,vScreenH);
    }
}

var backFunc = [back1,back2];

function drawBack(c){
    backFunc[cBack](c);
}