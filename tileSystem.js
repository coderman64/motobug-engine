
var chunk = function(img,tiles,ltiles,rtiles,btiles){
    this.img = img;
    this.tiles = tiles;
    this.ltiles = ltiles; //left side tiles
    this.rtiles = rtiles; //right-side tiles
    this.btiles = btiles; //bottom-side tiles
}

/*var autoChunk = function(img){
    var testCanvi = document.createElement("canvas");
    ctx = testCanvi.getContext("2d");
    ctx.clearRect(0,0,128,128);
    ctx.drawImage(img,0,0);
    var tileData = [[],[],[],[],[],[],[],[]];
    for(var x = 0; x < img.width; x++){
        var y = 0;
        while(y < 128){
            if(ctx.getImageData(x,y,1,1).data[3] != 0){
                if(tileData[Math.floor(y/16)][Math.floor(x/16)] == undefined){
                    tileData[Math.floor(y/16)][Math.floor(x/16)] = [-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,0];
                }
                tileData[Math.floor(y/16)][Math.floor(x/16)][x%16] = 16-(y%16);
                y = 128;
            }
            y++;
        }
    }
    //set angles
    for(var x = 0; x < 8; x++){
        for(var y = 0; y < 8; y++){
            if(tileData[y][x] != undefined){
                //grab first and last non -16 value:
                var values = [[-16,-1],[-16,-1]];
                for(var i = 0; i < 16; i++){
                    if(tileData[y][x][i] != -16){
                        if(values[0][0] == -16){
                            values[0] = [tileData[y][x][i],i]; // first
                        }
                        values[1] = [tileData[y][x][i],i]; //last
                    }
                }
                tileData[y][x][16] = -Math.atan((values[0][0]-values[1][0])/(values[0][1]-values[1][1]))*180/Math.PI;
            }
        }
    }
    return new chunk(img,tileData);
}*/

var maskChunk = function(img){

}

var flatlandImage = document.createElement("img");
flatlandImage.src = "res/Level/flat.png";
var downslopeImage = document.createElement("img");
downslopeImage.src = "res/Level/downslope.png";
var upslopeImage = document.createElement("img");




var chunks = [
    0,//new chunk(flatlandImage,[[[11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,0],[11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,0],[11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,0],[11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,0],[11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,0],[11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,0],[11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,0],[11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,0]],[],[],[],[],[],[],[]]),
    0//new chunk(downslopeImage, [[[11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,0],[11,11,10,10,10,10,9,9,9,9,8,8,8,8,7,7,17.3],[7,7,6,6,6,6,5,5,5,5,4,4,4,4,3,3,17.3],[3,3,2,2,2,2,1,1,1,1,-1,-1,-1,-1,-4,-4,17.3]],[[],[],[],[16,16,16,16,16,16,16,16,16,16,16,16,16,16,15,15,17.3],[15,15,14,14,14,14,13,13,13,13,12,12,12,12,11,11,17.3],[11,11,10,10,10,10,9,9,9,9,8,8,8,8,7,7,17.3],[7,7,6,6,6,6,5,5,5,5,4,4,4,4,3,3,17.3],[3,3,2,2,2,2,1,1,1,1,-1,-1,-1,-1,-4,-4,17.3]],[[],[],[],[],[],[],[],[16,16,16,16,16,16,16,16,16,16,16,16,16,16,15,15,17.3]],[],[],[],[],[]]),
];

var chunkBacklog = [
    //newImage("res/Level/30.png"),
    //newImage("res/Level/220.png"),
    //newImage("res/Level/1.png"),
    //newImage("res/Level/2.png"),
    //newImage("res/Level/3.png"),
    //newImage("res/Level/waterfallGardens.png"),
    //newImage("res/Level/waterfall-downslope1.png"),
    //newImage("res/Level/waterfall-downslope2.png"),
    //newImage("res/Level/waterfall-downslope3.png"),
    //newImage("res/Level/waterfall-downslope3b.png"),
    //newImage("res/Level/waterfall-downslope4a.png"),
    //newImage("res/Level/waterfall-downslope4b.png"),
    //newImage("res/Level/waterfall-ground.png"),
];



function drawLevel(ctx,camx,camy){
    //ctx.fillStyle = "red";
    for(var y=1+Math.floor(-camy/128); y<Math.min(level.length, Math.floor(-camy/128)+Math.ceil(vScreenH/128)+2); y++){
        for(var x = Math.floor(-camx/128); x<Math.min(level[y].length, Math.floor(-camx/128)+Math.ceil(vScreenW/128)+1);x++){
            if(isNaN(level[y][x]/2)&&level[y][x] != undefined){
                for(var l = level[y][x].length-1; l >= 0;l--){
                    if(level[y][x][l] > -1 && chunks[level[y][x][l]]){
                        ctx.drawImage(chunks[level[y][x][l]].img,x*128+camx,(y-1)*128+camy);
                    }
                }
            }
            else if(level[y][x] > -1 && chunks[level[y][x]]){
                ctx.drawImage(chunks[level[y][x]].img,x*128+camx,(y-1)*128+camy);
                /*for(var x1 = 0; x1 < 128; x1++){
                    for(var y1 = 0; y1 < 8; y1++){
                        if(chunks[level[y][x]].tiles[y1] != undefined && chunks[level[y][x]].tiles[y1][Math.floor(x1/16)] != undefined){
                            ctx.fillRect((x)*128+x1,(y-1)*128+y1*16+(16-chunks[level[y][x]].tiles[y1][Math.floor(x1/16)][x1%16]),1,1);
                        }
                    }
                }*/ 
            }
        }
    }
    for(var i = 0; i < level[0].length; i++){
        if(level[0][i] != null&&level[0][i].disable != true){
            if(level[0][i].x+level[0][i].w > -camx && level[0][i].y+level[0][i].h > -camy&& level[0][i].x < -camx+vScreenW && level[0][i].y < -camy+vScreenH){
                level[0][i].draw(ctx,camx,camy);
            }
            if(level[0][i].phys != undefined){
                level[0][i].phys();
            }
        }
    }
}