
	//velocity
	
	//gravity
	/*if(char.grounded == false){
		//char.yv += 0.5;
	}*/

	//basic floor


	/*if(keysDown[32] && char.grounded){
		if(keysDown[40] != true){
			char.grounded = false;
			char.yv = -10*Math.cos(char.angle);
			char.xv = -10*Math.sin(char.angle);
			char.angle = 0;
			char.rolling = false;
		}
	}*/

	/*if(char.rolling == false){
		if(keysDown[39]){
			if(char.xv < 10){
				char.xv += 0.07;
			}
			if(char.xv < 0){
				char.xv += 1;
				char.currentAnim = anim.skid;
			}
			else
			{
				if(Math.abs(char.xv)>8){
					char.currentAnim = anim.run;
				}
				else{
					char.currentAnim = anim.jog;
					char.animSpeed = Math.abs(char.xv)/20+0.1;
				}
			}
		}
		else if(keysDown[37]){
			if(char.xv > -10){
				char.xv -= 0.07;
			}
			if(char.xv > 0){
				char.xv -= 1;
				char.currentAnim = anim.skid;
			}
			else
			{
				if(Math.abs(char.xv)>8){
					char.currentAnim = anim.run;
				}
				else{
					char.currentAnim = anim.jog;
					char.animSpeed = Math.abs(char.xv)/20+0.1;
				}
			}
		}
		else
		{
			if(char.xv > 0.001){
				char.xv -= 0.2;
			}
			else if(char.xv < -0.001){
				char.xv += 0.2;
			}
			if(char.xv > -0.2 && char.xv < 0.2 && char.xv != 0){
				char.xv = 0.0001*(char.xv/Math.abs(char.xv));
			}
			
			if(Math.abs(char.xv) <= 0.01){
				char.currentAnim = anim.stand;
			}
			else
			{
				if(Math.abs(char.xv)>8){
					char.currentAnim = anim.run;
				}
				else{
					char.currentAnim = anim.jog;
					char.animSpeed = Math.abs(char.xv)/20+0.1;
				}
			}
		}
		if(keysDown[40]){
			if(Math.abs(char.xv)>0.001){
				char.rolling = true;
			}
			else
			{
				if(keysDown[32]){
					char.currentAnim = anim.spindash;
					char.animSpeed = 1;
					char.rolling = true;
				}
				else
				{
					char.currentAnim = anim.crouch;
				}
			}
		}
	}
	else
	{
		if(char.currentAnim != anim.spindash){
			char.currentAnim = anim.jump;
			char.animSpeed = Math.abs(char.xv/10);
			char.xv = (Math.abs(char.xv)-0.1)*(char.xv/Math.abs(char.xv));
			if(Math.abs(char.xv) < 0.2){
				char.rolling = false;
				char.xv = 0.0001*(char.xv/Math.abs(char.xv));
			}
		}
		else
		{
			if(keysDown[40] == false){
				char.currentAnim = anim.jump;
				char.xv = 15*(char.xv/Math.abs(char.xv));
			}
		}
	}
	if(char.grounded == false){
		char.currentAnim = anim.jump;
		char.animSpeed = Math.abs(char.xv/10)+0.3;
		char.angle /= 5;
	}
	//console.log(char.currentAnim);
	//console.log(char.xv)
	c.fillStyle = "black";
	/*
	for(var i = 0; i < char.currentAnim.length; i++){
		c.putImageData(char.currentAnim[i],i*char.currentAnim[0].width,0);
		c.fillRect(i*char.currentAnim[0].width,0,1,char.currentAnim[0].height);
	}*/