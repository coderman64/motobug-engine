var CCBackList = [
	newImage("res/background/CCBack1_old2.png"),
	newImage("res/background/CCBack2.png"),
];
var CCBackCanviList = [];

function CCBack1(c){
	if(CCBackCanviList.length < 1){
		for(var i = 0; i < 50; i++){
			var canvi2 = document.createElement("canvas");
			canvi2.width = 398;
			canvi2.height = 4;
			contex = canvi2.getContext("2d");
			contex.drawImage(CCBackList[1],0,-((i*4)%120+115));
			CCBackCanviList.push(canvi2);
		}
	}
	imgWidth = CCBackList[0].width;
	c.drawImage(CCBackList[0],0,0);

	for(var i = 0; i<50; i++){
		c.drawImage(CCBackCanviList[i],(Math.floor(cam.tx/(5/(i/20+0.1))+i*Math.sin(Date.now()/2000+i/2))%(imgWidth)),i*4+112);
		c.drawImage(CCBackCanviList[i],(Math.floor(cam.tx/(5/(i/20+0.1))+i*Math.sin(Date.now()/2000+i/2))%(imgWidth))-imgWidth,i*4+112);
		c.drawImage(CCBackCanviList[i],(Math.floor(cam.tx/(5/(i/20+0.1))+i*Math.sin(Date.now()/2000+i/2))%(imgWidth))+imgWidth,i*4+112);
	}
}

backFunc.push(CCBack1);

var STBackImg = [
	newImage("res/background/clouds.png"),
	newImage("res/background/sunnyBackground4.png")
]
// 26
function STBack1(c){
	c.drawImage(STBackImg[1],0,0);
	for(var i = 0; i < 5; i++){
		c.drawImage(STBackImg[0],Math.floor((cam.tx-Date.now()/5)/(5/(i/5+0.1)))%vScreenW,20*i-32);
		c.drawImage(STBackImg[0],Math.floor((cam.tx-Date.now()/5)/(5/(i/5+0.1)))%vScreenW+vScreenW,20*i-32);
	}
}

backFunc.push(STBack1);