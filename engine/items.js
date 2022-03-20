// the motobug engine item scripts

// see the motobug engine wiki for more information


function newImage(name){
    var tmpImg = document.createElement("img");
    loadingList.push(tmpImg);
    tmpImg.onload = function(event){loadingList.splice(loadingList.indexOf(event.target),1);};
    tmpImg.src = name;
    return tmpImg;
}

function addSource(src){
    var sourceElement = document.createElement("source");
    sourceElement.src = src;
    return sourceElement;
}

// a function to store previously loaded images, to make sure they are only loaded
// once
var imgCache = function(){
    this.getImg = function(src){
        var img = null;
        for(var i = 0; i < this.cacheList.length;i++){
            if(this.cacheList[i].src == src)
                img = this.cacheList[i];
        }
        if(img == null){
            img = newImage(src);
            this.cacheList.push(img);
        }
        return img;
    }
    this.cacheList = [];
}

var globalImgCache = new imgCache();

var item = function(x,y,w,h,src){
    this.img = globalImgCache.getImg(src);
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
    this.img = globalImgCache.getImg(src);
    this.power = power;
    this.canvi = document.createElement("canvas");
    this.canvi.width = this.w;
    this.canvi.height = this.h;
    this.c = this.canvi.getContext("2d");
    this.frame = 0;
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
        else if(char.yv > 0&&char.y+char.yv > this.y+16)
        {
            char.state = -1;
            char.Gv = char.xv;
            char.yv = -this.power;
            char.y -= 6;
            char.GRV = 0.21875;
            this.frame = 1;
            char.jumpState = 3;
            spring.sfx.currentTime = 0;
            spring.sfx.play();
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
        debug.addRect(this.x,this.y+16,this.w,this.h-16,"#00FF00AA")
        this.c.clearRect(0,0,this.w,this.h);
        this.c.drawImage(this.img,-Math.floor(this.frame)*this.w,0);
        ctx.drawImage(this.canvi,this.x+camx,this.y+camy,this.w,this.h);
    }
}
spring.sfx = document.createElement("audio");
spring.sfx.src = "res/sfx/spring2.wav";
spring.sfx.type = "audio/wav";
spring.sfx.load();

var hiddenSpring = function(x,y,w,h,src,power,angle){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = globalImgCache.getImg(src);
    this.power = power;
    this.canvi = document.createElement("canvas");
    this.canvi.width = this.w;
    this.canvi.height = this.h;
    this.c = this.canvi.getContext("2d");
    this.frame = 0;
    this.destroy = false;
    this.targetable = false;
    this.hrid = "hiddenSpring";
    this.hit = function(char){
        // if(char.state != -1 &&char.yv < 0.1&&char.y-this.y > 10){
        //     if(char.x < this.x+this.w/2){
        //         char.x = this.x-15;
        //         char.Gv = 0.001;
        //         if(keysDown[39]){
        //             char.animSpeed = 0.05;
        //             char.currentAnim = anim.push;
        //         }
        //     }
        //     if(char.x > this.x+this.w/2){
        //         char.x = this.x+this.w+15;
        //         char.Gv = -0.001;
        //         if(keysDown[37]){
        //             char.animSpeed = 0.05;
        //             char.currentAnim = anim.push;
        //         }
        //     }
        // }
        if(char.y+char.yv > this.y)
        {
            char.state = -1;
            char.Gv = char.xv;
            char.yv = -this.power;
            char.y -= 6;
            char.GRV = 0.21875;
            this.frame = 1;
            char.jumpState = 3;
            spring.sfx.currentTime = 0;
            spring.sfx.play();
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
        debug.addRect(this.x,this.y+16,this.w,this.h-16,"#00FF00AA")
        this.c.clearRect(0,0,this.w,this.h);
        this.c.drawImage(this.img,-Math.floor(this.frame)*this.w,0);
        ctx.drawImage(this.canvi,this.x+camx,this.y+camy,this.w,this.h);
    }
}

var downSpring = function(x,y,w,h,src,power,angle){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = globalImgCache.getImg(src);
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
        if(char.state != -1 &&char.yv > -0.1&&char.y-this.y < -10){
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
        else if(char.yv < 0&&char.y < this.y+this.h-16)
        {
            if(char.state == -1){
                char.Gv = char.xv;
                char.yv = this.power;
                char.y += 6;
                this.frame = 1;
                char.jumpState = 3;
                spring.sfx.currentTime = 0;
                spring.sfx.play();
                if(char.pHoming == true){
                    char.pHoming = false;
                }
            }
            else
            {
                char.golock = 30;
                this.frame = 1;
                spring.sfx.currentTime = 0;
                spring.sfx.play();
                char.Gv = Math.sin(char.angle)*this.power+Math.cos(char.angle)*char.Gv;
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
        this.c.translate(0,this.h);
        this.c.scale(1,-1);
        this.c.drawImage(this.img,-Math.floor(this.frame)*this.w,0);
        this.c.resetTransform();
        ctx.drawImage(this.canvi,this.x+camx,this.y+camy,this.w,this.h);
    }
}

var spikes = function(x,y,w,h,src,angle){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = globalImgCache.getImg(src);
    // this.canvi = document.createElement("canvas");
    // this.canvi.width = this.w;
    // this.canvi.height = this.h;
    // this.c = this.canvi.getContext("2d");
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
        for(var i = 0; i<Math.floor(this.w/this.img.width); i++){
            ctx.drawImage(this.img,this.x+camx+this.img.width*i,this.y+camy);
        }
    }
}

var ringAlternate = false;

var ring = function(x,y,w,h,src){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = globalImgCache.getImg(src);
    // this.canvi = document.createElement("canvas");
    // this.canvi.width = this.w;
    // this.canvi.height = this.h;
    // this.c = this.canvi.getContext("2d");
    this.frame = 1;
    this.destroy = false;
    this.disable = false;
    this.hit = function(char){
        if(!this.disable){
            char.rings++;
            this.disable = true;
            if(!ringAlternate){
                ring.sfxL.currentTime = 0;
                ring.sfxL.play();
                ringAlternate = true;
            }
            else
            {
                ring.sfxR.currentTime = 0;
                ring.sfxR.play();
                ringAlternate = false;
            }
        }
    }
    this.draw = function(ctx,camx,camy){
        if(!this.disable){
            if(ring.frame != (performance.now()/67)%4){
                ring.frame = (performance.now()/67)%4;
                ring.c.clearRect(0,0,16,16);
                ring.c.drawImage(this.img,-Math.floor(ring.frame)*16,0);
            }
            // this.frame += 0.25;
            // if(this.frame >= 4){
            //     this.frame = 0;
            // }
            // ring.c.clearRect(0,0,this.w,this.h);
            // ring.c.drawImage(this.img,-Math.floor(this.frame)*this.w,0);
            ctx.drawImage(ring.canvi,this.x+camx,this.y+camy);
        }
    }
    this.reset = function(){
        this.disable = false;
    }
}

ring.sfxL = document.createElement("audio");
ring.sfxR = document.createElement("audio");
ring.sfxL.src = "res/sfx/ring.wav";
ring.sfxL.type = "audio/wav";
ring.sfxL.load();
ring.sfxR.src = "res/sfx/ring.wav";
ring.sfxR.type = "audio/wav";
ring.sfxR.load();
ring.canvi = document.createElement("canvas");
ring.canvi.width = 16;
ring.canvi.height = 16;
ring.c = ring.canvi.getContext("2d");
ring.frame = 0;

var hitRing = function(x,y,w,h,src,vX,vY){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = globalImgCache.getImg(src);
    // this.canvi = document.createElement("canvas");
    // this.canvi.width = this.w;
    // this.canvi.height = this.h;
    // this.c = this.canvi.getContext("2d");
    this.frame = 1;
    this.destroy = false;
    this.disable = false;
    this.layer = char.layer;
    //hitRing-specific variables
    this.vX = vX;
    this.vY = vY;
    this.timer = 0;
    console.log("hitRing Created!");
    this.hit = function(char){
        if(this.timer > 10){
            char.rings++;
            this.destroy = true;
            if(!ringAlternate){
                ring.sfxL.currentTime = 0;
                ring.sfxL.play();
                ringAlternate = true;
            }
            else
            {
                ring.sfxR.currentTime = 0;
                ring.sfxR.play();
                ringAlternate = false;
            }
        }
    }
    this.draw = function(ctx,camx,camy){
        // this.frame += 0.25;
        // if(this.frame >= 4){
        //     this.frame = 0;
        // }
        // if(this.timer < 200||Math.floor(this.frame)%2 == 0){
        //     this.c.clearRect(0,0,this.w,this.h);
        //     this.c.drawImage(this.img,-Math.floor(this.frame)*this.w,0);
        //     ctx.drawImage(this.canvi,this.x+camx,this.y+camy,this.w,this.h);
        // }
        if(this.timer < 200||Math.floor((performance.now()/67)%4)%2 == 0){
            if(ring.frame != (performance.now()/67)%4){
                ring.frame = (performance.now()/67)%4;
                ring.c.clearRect(0,0,16,16);
                ring.c.drawImage(this.img,-Math.floor(ring.frame)*16,0);
            }
            ctx.drawImage(ring.canvi,this.x+camx,this.y+camy);
        }
    }
    this.phys = function(){
        this.vY += 0.09375;
        this.x += this.vX;
        this.y += this.vY;
        this.timer++;
        if(this.timer > 300){
            this.destroy = true;
        }
        var sense = senseVLine(this.x+this.w/2,this.y+this.w/2,32,0,this.layer);
        var senseL = senseHLineL(this.x+this.h/2,this.y+this.w/2,32,0,this.layer);
        var senseR = senseHLineR(this.x+this.h/2,this.y+this.w/2,32,0,this.layer);
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

var effect = function(x,y,w,h,src,length){ //visual effect sprite.  Deletes itself once animation is finished
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    // this.img = newImage(src);
    this.img = null;
    for(var i = 0; i < effect.assetList.length;i++){
        if(effect.assetList[i].src = src)
            this.img = effect.assetList[i];
    }
    if(this.img == null){
        this.img = newImage(src);
        effect.assetList.push(this.img);
    }


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

effect.assetList = [];

var motobug = function(x,y,w,h,src,layer){
    this.x = x;
    this.y = y;
    this.oriX = x;
    this.oriY = y;
    this.w = w;
    this.h = h;
    this.layer = layer;
    this.vel = -1; //velocity of the motobug
    this.img = globalImgCache.getImg(src);
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
                level[0][level[0].length] = new effect(this.x - this.w, this.y + this.h, 25, 25, "res/items/speedDash.png", 5);
                motobug.explodeFX.currentTime = 0;
                motobug.explodeFX.play();
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
                motobug.explodeFX.currentTime = 0;
                motobug.explodeFX.play();
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
            a = senseVLine(this.x+this.w/4,this.y+this.h/2,this.h,ctx,this.layer);
            b = senseVLine(this.x+this.w*3/4,this.y+this.h/2,this.h,ctx,this.layer);

            left = senseHLineL(this.x+this.w/2,this.y+this.h/2,this.w/2,ctx,this.layer);
            right = senseHLineR(this.x+this.w/2,this.y+this.h/2,this.w/2,ctx,this.layer);

            if((a[0] == false||Math.abs(a[1]-this.y-this.h) > 10)||
                (left[0] == true&&Math.abs(left[1]-this.x-this.w/2) < this.w/2)){
                if(this.vel < 0){
                    this.vel *= -1;
                    this.c.scale(-1,1);
                    this.c.translate(-this.w,0);
                }
            }
            else if((b[0] == false||Math.abs(b[1]-this.y-this.h) > 10)||
                (right[0] == true&&Math.abs(right[1]-this.x-this.w/2) < this.w/2)){
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

motobug.explodeFX = document.createElement("audio");
motobug.explodeFX.src = "res/sfx/Explosion.wav";
motobug.explodeFX.type = "audio/wav";
motobug.explodeFX.load();

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
            ctx.fillStyle = "#FF000099";
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
        ctx.fillStyle = "#FF000099";
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
        ctx.fillStyle = "#8e8e26";
        ctx.fillRect(this.x+camx,this.y+camy,this.w,this.h);
    }
};

var speedPlat = function(x,y,w,h,speed){
    // this is only a platform when you're going fast enough
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.platform = true;
    this.speed = speed;
    this.draw = function(ctx,camx,camy){
        if(Math.abs(char.Gv) > speed){
            this.platform = true;
        }
        else
        {
            this.platform = false;
        }
        if(devMode){
            ctx.fillStyle = "#0000FF99";
            ctx.fillRect(this.x+camx,this.y+camy,this.w,this.h);
        }
    }
}

var WarpRing = function(x,y,w,h,disap,full,specLvl){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.specLvl = specLvl;
    this.disap = globalImgCache.getImg(disap);
    this.full = globalImgCache.getImg(full);
    this.img = this.disap;
    this.canvi = document.createElement("canvas");
    this.canvi.width = this.w;
    this.canvi.height = this.h;
    this.c = this.canvi.getContext("2d");
    this.frame = 0;
    this.disable = false;
    this.targetable = false;
    this.hrid = "Warp Ring";
    this.warpTimer = 0;
    this.hit = function(char){
        if(char.rings >= 50){
            if(this.warpTimer == 0){
                WarpRing.tpSound.play();
                WarpRing.tpSound.currentTime = 0;
            }
            char.x = lerp(char.x,this.x+this.w/2,0.1);
            char.y = lerp(char.y,this.y+this.h/2+16,0.1);
            char.xv = 0;
            char.yv = 0;
            char.Gv = 0;
            char.state = -1;
            char.currentAnim = anim.jump;
            char.layer = 1;
            this.warpTimer += 1;
            char.rolling = false;
        }
    }
    this.draw = function(ctx,camx,camy){
        // console.log("Warp: "+this.warpTimer.toString());
        if(char.rings >= 50){
            this.img = this.full;
            this.frame += 0.2+0.01*this.warpTimer;
        }
        else
        {
            this.img = this.disap;
            this.frame += 0.1;
        }
        if(Math.floor(this.frame*this.w/this.img.width)*this.h >= this.img.height){
            this.frame = 0;
        }
        this.c.clearRect(0,0,this.w,this.h);
        this.c.drawImage(this.img,-(Math.floor(this.frame)*this.w)%this.img.width,
                            -(Math.floor(this.frame*this.w/this.img.width)*this.h));
        ctx.drawImage(this.canvi,this.x+camx,this.y+camy,this.w,this.h);
        if(this.warpTimer > 0){
            if(motionBlurToggle){
                mBlurCtx.drawImage(this.canvi,this.x+camx,this.y+camy,this.w,this.h);
            }
            backgroundMusic.volume = 1-Math.min(1,this.warpTimer/100)
            ctx.fillStyle = "rgba(255,255,255,"+Math.min((this.warpTimer)/200,1).toString()+")";
            ctx.beginPath();
            ctx.arc(this.x+camx+this.w/2,this.y+camy+this.h/2,(this.warpTimer)*1.5,0,2 * Math.PI, false);
            ctx.fill();
            ctx.fillStyle = "rgba(1,1,1,"+Math.min((this.warpTimer-250)/100,1).toString()+")";
            ctx.fillRect(0,0,vScreenW,vScreenH);
            if(this.warpTimer > 350){
                backgroundMusic.volume = 1;
                backgroundMusic.muted = true;
                this.warpTimer = 0;
                this.disable = true;
                char.rings -= 50;
                stashLevel();
                currentLevel = this.specLvl-1;
                loadNextLevel();
                resetLevel();
            }
        }
    }
}

WarpRing.tpSound = document.createElement("audio");
WarpRing.tpSound.src = "res/sfx/Teleport.wav";
WarpRing.tpSound.type = "audio/wav";
WarpRing.tpSound.load();
WarpRing.tpSound.pause();

var charSpawn = function(x,y,w,h){
    // provides a nice place for the player to spawn;
    console.log("CHAR POS ACTIVE!");
    char.x = x+w/2;
    char.y = y+h;
    char.startX = x+w/2;
    char.startY = y+h;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.charSpawn = true;
    this.destroy = false;
    this.draw = function(ctx,camx,camy){};
    this.phys = function(){
        if(!this.destroy){
            console.log("SETTING CHAR POS");
            char.x = this.x+this.w/2;
            char.y = this.y+this.h;
            this.destroy = true;
            cam.x = -char.x;
            cam.y = -char.y;
        }
    }
    this.draw = function(ctx,camx,camy){
        if(devMode){
            ctx.fillStyle = "#4444ff99";
            ctx.fillRect(this.x+camx,this.y+camy,this.w,this.h);
        }
    }
}

var runCompeller = function(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.ringCount = 0;
    this.phys = function(){
        char.Gv = char.TOP*1.1;
        if(char.rings > this.ringCount){
            this.ringCount = char.rings;
        }
        if(char.rings < this.ringCount){
            char.rings = this.ringCount - 30;
            this.ringCount -= 30;
            this.ringCount = this.ringCount<0?0:this.ringCount;
            char.rings = char.rings<0?0:char.rings;
        }
        tileFilter = "hue-rotate("+(Date.now()/20%360)+"deg)";
    }
}

var ringGoal = function(x,y,w,h,rings,final){
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.w = w;
    this.h = h;
    this.rings = rings;
    this.warpTimer = 0;
    this.final = final;
    this.goodTimer = 0;
    this.hit = function(char){
        if(char.rings >= this.rings){
            this.goodTimer = 100;
            char.layer = 1;
            if(this.final > 0){
                this.goodTimer = 1;
            }
        }
        else
        {
            this.warpTimer = 1;
            char.layer = 1;
        }
    }
    this.draw = function(ctx,camx,camy){
        if(this.goodTimer > 0){
            this.x = -camx;
            this.goodTimer += this.final>0?1:-1;
            ctx.font = "20px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black";
            ctx.fillText("GOOD!", vScreenW/2+1,vScreenH/4+1);
            ctx.fillStyle = "white";
            ctx.fillText("GOOD!", vScreenW/2,vScreenH/4);
            if(this.goodTimer > 100){
                ringGoal.warpSound.play();
                backgroundMusic.volume = Math.max(Math.min(1-((this.goodTimer-100)/100),1),0);
                ctx.fillStyle = "rgba(255,255,255,"+((this.goodTimer-100)/50)+")";
                ctx.fillRect(0,0,vScreenW,vScreenH);
                ctx.fillStyle = "rgba(0,0,0,"+((this.goodTimer-150)/50)+")";
                ctx.fillRect(0,0,vScreenW,vScreenH);
            }
        }
        if(this.warpTimer > 0){
            this.x = -camx;
            this.warpTimer += 1;
            ctx.font = "20px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black";
            ctx.fillText("NOT ENOUGH RINGS!", vScreenW/2+1,vScreenH/4+1);
            ctx.fillStyle = "white";
            ctx.fillText("NOT ENOUGH RINGS!", vScreenW/2,vScreenH/4);
            if(this.warpTimer > 100){
                ringGoal.warpSound.play();
                backgroundMusic.volume = Math.max(Math.min(1-((this.warpTimer-100)/100),1),0);
                ctx.fillStyle = "rgba(255,255,255,"+((this.warpTimer-100)/50)+")";
                ctx.fillRect(0,0,vScreenW,vScreenH);
                ctx.fillStyle = "rgba(0,0,0,"+((this.warpTimer-150)/50)+")";
                ctx.fillRect(0,0,vScreenW,vScreenH);
            }
        }
        for(var i = 0; i < 20; i++){
            ctx.fillStyle = "hsl("+(360-(Date.now()+100*i)/10%360)+"deg,100%,50%)";
            ctx.fillRect(this.startX+camx+16*(i%2),this.y+this.h+camy-16*i-16,16,16);
        }
    }
    this.phys = function(){
        if(this.warpTimer > 200||(this.final>0&&this.goodTimer > 200)){
            destashLevel();
            backgroundMusic.volume = 1;
            backgroundMusic.muted = true;
        }
    }
}

ringGoal.warpSound = document.createElement("audio");
ringGoal.warpSound.src = "res/sfx/Teleport.wav";
ringGoal.warpSound.type = "audio/wav";
ringGoal.warpSound.load();
ringGoal.warpSound.pause();

var getRings = function(x,y,w,h,rings){
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.w = w;
    this.h = h;
    this.rings = rings;
    this.textTimer = -50;
    this.hit = function(char){
        this.textTimer = 100;
    }
    this.draw = function(ctx,camx,camy){
        var xPos = Math.max(this.textTimer*10-vScreenW,vScreenW/2);
        if(this.textTimer > -50){
            // if(this.textTimer > 0)
            this.x = -camx;
            this.textTimer -= 1*fpsFactor;
            ctx.font = "20px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "rgba(0,0,0,"+Math.min(1,(50+this.textTimer)/50)+")";
            ctx.fillText("GET "+this.rings.toString()+" RINGS!", xPos+1,vScreenH/4+1);
            ctx.fillStyle = "rgba(255,255,255,"+Math.min(1,(50+this.textTimer)/50)+")";
            ctx.fillText("GET "+this.rings.toString()+" RINGS!", xPos,vScreenH/4);
        }
        // for(var i = 0; i < 20; i++){
        //     ctx.fillStyle = "hsl("+(360-(Date.now()+100*i)/10%360)+"deg,100%,50%)";
        //     ctx.fillRect(this.startX+camx+16*(i%2),this.y+this.h+camy-16*i-16,16,16);
        // }
    }
    this.phys = function(){
        // if(this.warpTimer > 200){
        //     destashLevel();
        //     backgroundMusic.volume = 1;
        // }
    }
}

var creditsRoll = function(x,y,w,h,text){
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.textTimer = -100;
    this.hit = function(char){
        this.textTimer = 100;
    }
    this.draw = function(ctx,camx,camy){
        var xPos = Math.max(this.textTimer*10-vScreenW,vScreenW/2);
        if(this.textTimer > -50){
            // if(this.textTimer > 0)
            this.x = -camx;
            this.textTimer -= 1*fpsFactor;
            ctx.font = "20px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "rgba(0,0,0,"+Math.min(1,(50+this.textTimer)/50)+")";
            ctx.fillText(this.text, xPos+1,vScreenH/4+1);
            ctx.fillStyle = "rgba(255,255,255,"+Math.min(1,(50+this.textTimer)/50)+")";
            ctx.fillText(this.text, xPos,vScreenH/4);
        }
        // if(devMode){
        //     ctx.fillStyle = "#FF00FF99";
        //     ctx.fillRect(this.x+camx,this.y+camy,this.w,this.h);
        // }
    }
    this.phys = function(){
    }
}

var warpToTitle = function(x,y,w,h){
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.w = w;
    this.h = h;
    this.warpTimer = 0;
    this.goodTimer = 0;
    this.hit = function(char){
        this.warpTimer = 1;
        char.layer = 1;
    }
    this.draw = function(ctx,camx,camy){
        if(this.warpTimer > 0){
            this.x = -camx;
            this.warpTimer += 1;
            if(this.warpTimer > 100){
                ringGoal.warpSound.play();
                backgroundMusic.volume = Math.max(Math.min(1-((this.warpTimer-100)/100),1),0);
                ctx.fillStyle = "rgba(255,255,255,"+((this.warpTimer-100)/50)+")";
                ctx.fillRect(0,0,vScreenW,vScreenH);
                ctx.fillStyle = "rgba(0,0,0,"+((this.warpTimer-150)/50)+")";
                ctx.fillRect(0,0,vScreenW,vScreenH);
            }
        }
    }
    this.phys = function(){
        if(this.warpTimer > 200||(this.final>0&&this.goodTimer > 200)){
            backgroundMusic.load();
            titleTimer = -70;
            titleActive = true;
            inMenu = false;
            SKIP_TITLE = false;
            currentLevel = -1;
            backgroundMusic.volume = 1;
            backgroundMusic.muted = true;
        }
    }
}


var devText = function(x,y,size,message){
    this.x = x;
    this.y = y;
    this.w = 200;
    this.h = 200;
    this.size = size;
    this.message = message;
    this.draw = function(ctx,camx,camy){
        ctx.font = this.size.toString()+"px sans-serif";
		ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "black";
        ctx.fillText(this.message, this.x+camx+1,this.y+camy+1);
        ctx.fillStyle = "white";
        ctx.fillText(this.message, this.x+camx,this.y+camy);
    }
}

var fallWarning = function(x,y,w,h,src){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = globalImgCache.getImg(src);
    this.destroy = false;
    this.targetable = false;
    this.hrid = "Fall Warning";
    this.draw = function(ctx,camx,camy){
        ctx.drawImage(this.img,this.x+camx,this.y+camy,this.w,this.h);
    }
    this.phys = function(){}
    this.hit = function(e){}
}

var levelSign = function(x,y,w,h,nextLevel){
    /*
        "That's all folks" - Porky pig
        A sign to end you level. Width and height arguments are for 
        Motobug Studio compatibility.
    */
    this.x = x;
    this.y = y;
    this.w = 48;
    this.h = 48;
    this.canvi = document.createElement("canvas");
    this.canvi.width = this.w;
    this.canvi.height = this.h;
    this.c = this.canvi.getContext("2d");
    this.animframe = 0;
    this.spinTimer = 0;
    this.scoreTimer = 0;
    this.destroy = false;
    this.targetable = false;
    this.levelFinished = false;
    this.nextLevel = nextLevel;

    this.ringBonus = 0;
    this.timeBonus = 0;
    this.finalScore = 0;
    this.bonusDone = -1;
    this.tallyStopTime = 999999999;
    this.totalTimeBonus = 0;

    this.draw = function(ctx,camx,camy){
        this.c.clearRect(0,0,this.w,this.h);
        this.c.drawImage(levelSign.image,-Math.floor(this.animframe)*this.w,0);
        ctx.drawImage(this.canvi,this.x+camx,this.y+camy);
        if(this.spinTimer > 0){
            char.layer = 1;
            this.animframe += fpsFactor*(1/(this.spinTimer/10));
            this.spinTimer += fpsFactor;
            backgroundMusic.volume = Math.max(1-this.spinTimer/100,0);
            if(this.spinTimer > 150&&(Math.floor(this.animframe) == 4||this.levelFinished)){
                this.spinTimer -= fpsFactor;
                this.animframe = 4;
                if(!this.levelFinished){
                    levelSign.endJingle.play();

                    // assign a time bonus a la Sonic 1/Sonic 2
                    if(Math.floor(levelTimer/1000) <= 29){
                        this.totalTimeBonus = 50000;
                    }
                    else if(Math.floor(levelTimer/1000) <= 44){
                        this.totalTimeBonus = 10000;
                    }
                    else if(Math.floor(levelTimer/1000) <= 59){
                        this.totalTimeBonus = 5000;
                    }
                    else if(Math.floor(levelTimer/1000) <= 60+29){
                        this.totalTimeBonus = 4000;
                    }
                    else if(Math.floor(levelTimer/1000) <= 60+59){
                        this.totalTimeBonus = 3000;
                    }
                    else if(Math.floor(levelTimer/1000) <= 60*2+59){
                        this.totalTimeBonus = 2000;
                    }
                    else if(Math.floor(levelTimer/1000) <= 60*3+59){
                        this.totalTimeBonus = 1000;
                    }
                    else{
                        this.totalTimeBonus = 500;
                    }
                    runLevelTimer = false;
                }
                this.levelFinished = true;
                this.scoreTimer += fpsFactor;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = "20px sans-serif";
                ctx.fillStyle = "black";
                ctx.fillText("SONIC GOT THROUGH "+levelName[2]+"!",vScreenW/2+2-(this.scoreTimer<20?-1000+this.scoreTimer*50:0),52);
                ctx.fillStyle = "white";
                ctx.fillText("SONIC GOT THROUGH "+levelName[2]+"!",vScreenW/2-(this.scoreTimer<20?-1000+this.scoreTimer*50:0),50);
                
                ctx.textAlign = "right";
                ctx.font = "15px sans-serif";
                ctx.fillStyle = "black";
                ctx.fillText("RING BONUS: ",vScreenW/2+2,96-(this.scoreTimer<40?this.scoreTimer*10-400:0));
                ctx.fillText("TIME BONUS: ",vScreenW/2+2,116-(this.scoreTimer<60?this.scoreTimer*10-600:0));
                ctx.fillText("TOTAL: ",vScreenW/2+2+(this.scoreTimer<100?this.scoreTimer*10-1000:0),146);
                ctx.fillStyle = "white";
                ctx.fillText("RING BONUS: ",vScreenW/2,95-(this.scoreTimer<40?this.scoreTimer*10-400:0));
                ctx.fillText("TIME BONUS: ",vScreenW/2,115-(this.scoreTimer<60?this.scoreTimer*10-600:0));
                ctx.fillText("TOTAL: ",vScreenW/2+(this.scoreTimer<100?this.scoreTimer*10-1000:0),145);

                ctx.textAlign = "left";
                ctx.font = "15px sans-serif";
                ctx.fillStyle = "black";
                ctx.fillText((this.ringBonus).toString(),vScreenW/2+2,96-(this.scoreTimer<40?this.scoreTimer*10-400:0));
                ctx.fillText((this.timeBonus).toString(),vScreenW/2+2,116-(this.scoreTimer<60?this.scoreTimer*10-600:0));
                ctx.fillText((this.finalScore).toString(),vScreenW/2+2-(this.scoreTimer<100?this.scoreTimer*10-1000:0),146);
                ctx.fillStyle = "white";
                ctx.fillText((this.ringBonus).toString(),vScreenW/2,95-(this.scoreTimer<40?this.scoreTimer*10-400:0)); //+(char.rings*100).toString()
                ctx.fillText((this.timeBonus).toString(),vScreenW/2,115-(this.scoreTimer<60?this.scoreTimer*10-600:0));
                ctx.fillText((this.finalScore).toString(),vScreenW/2-(this.scoreTimer<100?this.scoreTimer*10-1000:0),145);
                if(this.bonusDone == -1){
                    if(this.scoreTimer>50&&this.ringBonus < char.rings*100){
                        this.ringBonus += 100;
                    }
                    else if(this.scoreTimer>70&&this.timeBonus < this.totalTimeBonus){
                        this.timeBonus += 100;
                    }
                    else if(this.scoreTimer>70)
                    {
                        this.bonusDone = this.scoreTimer;
                    }
                }
                else if(this.scoreTimer>110&&this.ringBonus+this.timeBonus>0){
                    this.finalScore += 100;
                    if(this.ringBonus > 0){
                        this.ringBonus -= 100;
                    }
                    else if(this.timeBonus > 0){
                        this.timeBonus -= 100;
                    }
                }
                else if(this.tallyStopTime > this.scoreTimer)
                {
                    this.tallyStopTime = this.scoreTimer;
                }
                
                if(this.scoreTimer > this.tallyStopTime+100){
                    ctx.fillStyle = "rgba(0,0,0,"+Math.min((this.scoreTimer-(this.tallyStopTime+100))/100,1).toString()+")";
                    ctx.fillRect(0,0,vScreenW,vScreenH);
                    if(this.scoreTimer > this.tallyStopTime+200){
                        currentLevel = this.nextLevel-1;
                        loadNextLevel();
                        resetLevel();
                        backgroundMusic.volume = 1;
                        backgroundMusic.muted = true;
                        window.localStorage.setItem(currentSave.toString()+"_level",currentLevel);
                    }
                }
            }
            // put an invisible wall behind the player
            if(char.x < this.x-vScreenW/2+15){
                char.x = this.x-vScreenW/2+15;
                if(char.Gv < 0){
                    char.Gv = -0.001;
                }
                if(keysDown[37]&&keysDown[39] != true){
                    char.animSpeed = 0.05;
                    char.currentAnim = anim.push;
                }
            }
        }
        if(this.animframe >= 8){
            this.animframe = 0;
        }
    }
    this.hit = function(char){

        if(this.spinTimer <= 0){
            this.spinTimer = 1;
            levelSign.sound.play();
            cam.walls.push(new camWall(-Math.floor(this.x-vScreenW/2,"max")))
        }
    }
}

levelSign.image = globalImgCache.getImg("res/items/sign.png");
levelSign.sound = new Audio("res/sfx/SpinSign.wav");
levelSign.endJingle = new Audio("res/music/EndJingle.ogg");
