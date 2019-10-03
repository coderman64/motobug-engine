function titleCard(c){
    if(introAnim < 200){
		introAnim += 0.5*fpsFactor;
		c.fillStyle = "black";
		c.fillRect(0,0,vScreenW,vScreenH+2900-introAnim*40);
		c.fillStyle = "#0006ff";
		c.fillRect(introAnim>70?2800-introAnim*40:0-(introAnim<10?400-introAnim*40:0),0,vScreenW/3+1,vScreenH);
		for(var i = 0; i < 12; i++){
			c.drawImage(introTriangle,vScreenW/3+(introAnim>70?2800-introAnim*40:0)-(introAnim<10?400-introAnim*40:0),vScreenH-i*24+introAnim%24,24,24);
		}
		c.fillStyle = "black";
		c.fillRect(0,vScreenH*4/5-(introAnim>60?600-introAnim*10:0)+(introAnim<5?50-introAnim*10:0)-19,vScreenW,30);
		c.fillStyle = "#CCCC00";
		c.fillRect(0,vScreenH*4/5-(introAnim>60?600-introAnim*10:0)+(introAnim<5?50-introAnim*10:0)-18,vScreenW,5);
		c.fillStyle = "#CC0000";
		c.fillRect(0,vScreenH*4/5-(introAnim>60?600-introAnim*10:0)+(introAnim<5?50-introAnim*10:0)+5,vScreenW,5);
		c.font = "10px sans-serif"
		c.fillStyle = "white";
		c.textAlign = "left";
		c.textBaseline = "alphabetic";
		for(var i = 0; i < 5; i++){
			c.fillText("Motorbug Engine", i*100-100+(introAnim*2)%100,vScreenH*4/5-(introAnim>60?600-introAnim*10:0)+(introAnim<5?50-introAnim*10:0));
		}
		c.font = "30px sans-serif"
		c.fillStyle = "black";
		c.fillText(levelName[0], vScreenW/3-(introAnim<20?introAnim*40-800:0)+(introAnim>100?4000-introAnim*40:0)+2,vScreenH/3+2);
		c.fillText(levelName[1], vScreenW*2/3+(introAnim<20?introAnim*40-800:0)-(introAnim>100?4000-introAnim*40:0)+2,vScreenH*1.3/3+2);
		c.fillText(levelName[0], vScreenW/3-(introAnim<20?introAnim*40-800:0)+(introAnim>100?4000-introAnim*40:0),vScreenH/3+2);
		c.fillText(levelName[1], vScreenW*2/3+(introAnim<20?introAnim*40-800:0)-(introAnim>100?4000-introAnim*40:0),vScreenH*1.3/3+2);
		c.font = "15px sans-serif";
		c.fillText(levelName[2], vScreenW*1.9/3-(introAnim<20?introAnim*40-800:0)+1,vScreenH*1.7/3-(introAnim>100?4000-introAnim*40:0)+1);
		c.fillText(levelName[2], vScreenW*1.9/3-(introAnim<20?introAnim*40-800:0),vScreenH*1.7/3-(introAnim>100?4000-introAnim*40:0)+1);
		c.fillStyle = "white";
		c.font = "30px sans-serif";
		c.fillText(levelName[0], vScreenW/3-(introAnim<20?introAnim*40-800:0)+(introAnim>100?4000-introAnim*40:0),vScreenH/3);
		c.fillText(levelName[1], vScreenW*2/3+(introAnim<20?introAnim*40-800:0)-(introAnim>100?4000-introAnim*40:0),vScreenH*1.3/3);
		c.font = "15px sans-serif";
		c.fillText(levelName[2], vScreenW*1.9/3-(introAnim<20?introAnim*40-800:0),vScreenH*1.7/3-(introAnim>100?4000-introAnim*40:0));
	}
}

/*var letterIndex = "abcdefghijklmnopqrstuvwxyz ";
var letterImg = newImage("res/HUD/text2.png");
var letterCanvi = document.createElement("canvas");
letterCanvi.width = 16;
letterCanvi.height = 16;
var lC = letterCanvi.getContext("2d");

//23 16x16 17

function drawWord(word,x,y,c){
    word = word.toLowerCase()
    for(var letter = 0; letter < word.length; letter++){
        textX = (letterIndex.indexOf(word.charAt(letter))%13)*23;
        textY = Math.floor(letterIndex.indexOf(word.charAt(letter))/13)*17;
        lC.clearRect(0,0,16,16);
        lC.drawImage(letterImg,-textX,-textY);
        c.drawImage(letterCanvi,x+letter*16,y);
        debug.log("hi")
    }
}

var leftTitle = newImage("res/HUD/TitleCardLeft.png");
var botTitle = newImage("res/HUD/TitleCardBottom.png");*/