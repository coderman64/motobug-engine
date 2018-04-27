
var itemSFX = document.createElement("audio");
var itemSFX2 = document.createElement("audio");

function newImage(name){
    var tmpImg = document.createElement("img");
    tmpImg.src = name;
    return tmpImg;
}


var item = function(x,y,w,h,src){
    this.img = newImage(src);
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.canvi = document.createElement("canvas");
    this.canvi.width = this.w;
    this.canvi.height = this.h;
    this.c = this.canvi.getContext("2d");
}

item.prototype.drawAnim = function(frame,ctx){
    this.c.drawImage(this.img, this.x-frame*this.w,this.y,this.w,this.h);
    ctx.drawImage(this.x,this.y,this.w,this.h);
}

var spring = function(x,y,w,h,src,power,angle){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = newImage(src);
    this.power = power;
    this.canvi = document.createElement("canvas");
    this.canvi.width = this.w;
    this.canvi.height = this.h;
    this.c = this.canvi.getContext("2d");
    this.frame = 1;
    this.destroy = false;
    this.targetable = true;
    this.hrid = "spring";
    this.hit = function(char){
        if(char.state != -1 &&char.yv < 0.1&&char.y-this.y > 10){
            if(char.x < this.x+this.w/2){
                char.x = this.x-15;
                char.Gv = 0.001;
                if(keysDown[39]){
                    char.animSpeed = 0.05;
                    char.currentAnim = anim.push;
                }
            }
            if(char.x > this.x+this.w/2){
                char.x = this.x+this.w+15;
                char.Gv = -0.001;
                if(keysDown[37]){
                    char.animSpeed = 0.05;
                    char.currentAnim = anim.push;
                }
            }
        }
        else if(char.yv > 0&&char.y > this.y+16)
        {
            char.state = -1;
            char.Gv = char.xv;
            char.yv = -this.power;
            char.y -= 6;
            this.frame = 1;
            char.jumpState = 3;
            itemSFX.src = "res/sfx/spring2.wav";
            itemSFX.play();
            if(char.pHoming == true){
                char.pHoming = false;
            }
        }
    }
    this.draw = function(ctx,camx,camy){
        if(this.frame > 0){
            this.frame += 0.25;
            if(this.frame >= 4){
                this.frame = 0;
            }
        }
        this.c.clearRect(0,0,this.w,this.h);
        this.c.drawImage(this.img,-Math.floor(this.frame)*this.w,0);
        ctx.drawImage(this.canvi,this.x+camx,this.y+camy,this.w,this.h);
    }
}

var spikes = function(x,y,w,h,src,angle){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = newImage(src);
    this.canvi = document.createElement("canvas");
    this.canvi.width = this.w;
    this.canvi.height = this.h;
    this.c = this.canvi.getContext("2d");
    this.frame = 1;
    this.destroy = false;
    this.targetable = false;
    this.hrid = "spikes";
    this.solid = true;
    this.hit = function(char){
        if(char.y > this.y+this.h/2){
            /*if(char.x < this.x+this.w/2){
                char.x = this.x-15;
                char.Gv = 0.001;
                if(keysDown[39]){
                    char.animSpeed = 0.05;
                    char.currentAnim = anim.push;
                }
            }
            if(char.x > this.x+this.w/2){
                char.x = this.x+this.w+15;
                char.Gv = -0.001;
                if(keysDown[37]){
                    char.animSpeed = 0.05;
                    char.currentAnim = anim.push;
                }
            }*/
        }
        else if(char.x < this.x+this.w+14&char.x > this.x-14&&char.invincible == 0&&char.yv >= 0)
        {
            char.state = -1;
            char.hurt = true;
            char.yv = -5;
            char.Gv *= -1;
            char.jumpState = 2;
        }
    }
    this.draw = function(ctx,camx,camy){
        /*if(this.frame > 0){
            this.frame += 0.25;
            if(this.frame >= 4){
                this.frame = 0;
            }
        }
        this.c.clearRect(0,0,this.w,this.h);
        this.c.drawImage(this.img,-Math.floor(this.frame)*this.w,0);*/
        for(var i = 0; i<Math.floor(this.w/this.img.width); i++){
            ctx.drawImage(this.img,this.x+camx+this.img.width*i,this.y+camy);
        }
    }
}

var ring = function(x,y,w,h,src){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = newImage(src);
    this.canvi = document.createElement("canvas");
    this.canvi.width = this.w;
    this.canvi.height = this.h;
    this.c = this.canvi.getContext("2d");
    this.frame = 1;
    this.destroy = false;
    this.disable = false;
    this.hit = function(char){
        if(!this.disable){
            char.rings++;
            this.disable = true;
            if(itemSFX && itemSFX.currentTime > 0 && itemSFX.paused && itemSFX.ended && itemSFX.readyState > 2){
                itemSFX.src = "res/sfx/ring.wav";
                itemSFX.play();
            }
            else
            {
                itemSFX2.src = "res/sfx/ring.wav";
                itemSFX2.play();
            }
        }
    }
    this.draw = function(ctx,camx,camy){
        if(!this.disable){
            this.frame += 0.25;
            if(this.frame >= 4){
                this.frame = 0;
            }
            this.c.clearRect(0,0,this.w,this.h);
            this.c.drawImage(this.img,-Math.floor(this.frame)*this.w,0);
            ctx.drawImage(this.canvi,this.x+camx,this.y+camy,this.w,this.h);
        }
    }
    this.reset = function(){
        this.disable = false;
    }
}

var hitRing = function(x,y,w,h,src,vX,vY){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = newImage(src);
    this.canvi = document.createElement("canvas");
    this.canvi.width = this.w;
    this.canvi.height = this.h;
    this.c = this.canvi.getContext("2d");
    this.frame = 1;
    this.destroy = false;
    this.disable = false;
    //hitRing-specific variables
    this.vX = vX;
    this.vY = vY;
    this.timer = 0;
    console.log("hitRing Created!");
    this.hit = function(char){
        if(this.timer > 10){
            char.rings++;
            this.destroy = true;
            if(itemSFX && (itemSFX.paused || itemSFX.ended)){
                itemSFX.src = "res/sfx/ring.wav";
                itemSFX.play();
            }
            else
            {
                itemSFX2.src = "res/sfx/ring.wav";
                itemSFX2.play();
            }
        }
    }
    this.draw = function(ctx,camx,camy){
        this.frame += 0.25;
        if(this.frame >= 4){
            this.frame = 0;
        }
        this.c.clearRect(0,0,this.w,this.h);
        this.c.drawImage(this.img,-Math.floor(this.frame)*this.w,0);
        ctx.drawImage(this.canvi,this.x+camx,this.y+camy,this.w,this.h);
    }
    this.phys = function(){
        this.vY += 0.09375;
        this.x += this.vX;
        this.y += this.vY;
        this.timer++;
        if(this.timer > 300){
            this.destroy = true;
        }
        var sense = senseVLine(this.x,this.y+this.w/2,32,0,0);
        var senseL = senseHLineL(this.x+this.h/2,this.y+this.w/2,32,0,0);
        var senseR = senseHLineR(this.x+this.h/2,this.y+this.w/2,32,0,0);
        if(sense[0]&&sense[1] < this.y+this.h){
            this.vY = this.vY*-0.75;
            this.y = sense[1]-this.h-1;
        }
        if(senseL[0]&&senseL[1] > this.x){
            this.x = senseL[1]+2;
            this.vX *= -0.25;
        }
        if(senseR[0]&&senseR[1] < this.x+this.w){
            this.x = senseR[1]-this.w-1;
            this.vX *= -0.25;
        }
    }
    this.reset = function(){
        this.destroy = true;
    }
}

var effect = function(x,y,w,h,src,length){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = newImage(src);
    this.len = length;
    this.canvi = document.createElement("canvas");
    this.canvi.width = this.w;
    this.canvi.height = this.h;
    this.c = this.canvi.getContext("2d");
    this.frame = 0;
    this.destroy = false;
    this.targetable = false;
    this.hrid = "effect";
    this.hit = function(char){

    }
    this.draw = function(ctx,camx,camy){
        this.frame += 0.25;
        if(this.frame >= this.len){
            this.destroy = true;
        }
        this.c.clearRect(0,0,this.w,this.h);
        this.c.drawImage(this.img,-Math.floor(this.frame)*this.w,0);
        ctx.drawImage(this.canvi,this.x+camx,this.y+camy,this.w,this.h);
    }
}
var motobug = function(x,y,w,h,src){
    this.x = x;
    this.y = y;
    this.oriX = x;
    this.oriY = y;
    this.w = w;
    this.h = h;
    this.vel = -1; //velocity of the motobug
    this.img = newImage(src);
    this.canvi = document.createElement("canvas");
    this.canvi.width = this.w;
    this.canvi.height = this.h;
    this.c = this.canvi.getContext("2d");
    this.frame = 0;
    this.destroy = false;
    this.disable = false;//"disables" object, to be re-enabled when you restart the level.
    this.targetable = true;
    this.hrid = "enemy";
    this.hit = function(char){
        if(!this.disable){
            if((char.rolling)||((char.state == -1&&char.jumpState == 1)&&(char.levitate!=true||char.GR != 0))){
                this.disable = true;
                itemSFX.src = "res/sfx/Explosion.wav";
                itemSFX.play();
                if(char.state == -1){
                    char.yv = Math.abs(char.yv);
                    char.yv *= -0.8;
                    //char.Gv *= -1;
                }
                else
                {///char.Gv /= 4;
                }
                if(char.pHoming == true){
                    char.pHoming = false;
                }
            }
            else{
                this.disable = true;
                char.hurt = true;
                char.yv = -5;
                char.Gv *= -1;
                char.jumpState = 2;
                char.state = -1;
                itemSFX.src = "res/sfx/Explosion.wav";
                itemSFX.play();
            }
            this.targetable = false;
        }
    }
    this.draw = function(ctx,camx,camy){
        if(!this.disable){
            this.frame += 0.25;
            if(this.frame*this.w >= this.img.width){
                this.frame = 0;
            }
            //console.log("clearing rect");
            this.c.clearRect(0,0,this.w,this.h);
            //console.log("drawing img");
            
            this.c.drawImage(this.img,-Math.floor(this.frame)*this.w,0);
            //console.log("drawing canvas");
            ctx.drawImage(this.canvi,this.x+camx,this.y+camy,this.w,this.h);
            a = senseVLine(this.x+this.w/4,this.y+this.h/2,this.h,ctx,0);
            b = senseVLine(this.x+this.w*3/4,this.y+this.h/2,this.h,ctx,0);
            if(a[0] == false){
                if(this.vel < 0){
                    this.vel *= -1;
                    this.c.scale(-1,1);
                    this.c.translate(-this.w,0);
                }
            }
            else if(b[0] == false){
                if(this.vel > 0){
                    this.vel *= -1;
                    this.c.scale(-1,1);
                    this.c.translate(-this.w,0);
                }
            }
            else
            {
                this.y = (a[1]+b[1])/2-this.h;
            }
            this.x += this.vel;
        }
    }
    this.reset = function(){
        this.disable = false;
        this.targetable = true;
        this.x = this.oriX;
        this.y = this.oriY;
    }
}

var layerSwitch = function(x,y,w,h,layerL,layerR){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.layerL = layerL;
    this.layerR = layerR;
    this.destroy = false;
    this.targetable = false;
    this.hrid = "layerSwitch";
    this.hit = function(char){
        if(char.xv < 0){
            char.layer = this.layerL;
        }
        if(char.xv > 0){
            char.layer = this.layerR;
        }
    }
    this.draw = function(ctx,camx,camy){
        if(devMode){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x+camx,this.y+camy,this.w,this.h);
        }
    }
}

var VlayerSwitch = function(x,y,w,h,layerD,layerU){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.layerU = layerU;
    this.layerD = layerD;
    this.destroy = false;
    this.targetable = false;
    this.hrid = "layerSwitch";
    this.hit = function(char){
        if(char.yv < -0.5){
            char.layer = this.layerU;
        }
        if(char.yv > 0.5){
            char.layer = this.layerD;
        }
    }
    this.draw = function(ctx,camx,camy){
        if(devMode){
        ctx.fillStyle = "red";
        ctx.fillRect(this.x+camx,this.y+camy,this.w,this.h);
        }
    }
}

var platform = function(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.platform = true;
    this.draw = function(ctx,camx,camy){
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x+camx,this.y+camy,this.w,this.h);
    }
};