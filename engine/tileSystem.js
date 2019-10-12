
var chunk = function(img,tiles,ltiles,rtiles,btiles){
    this.img = img;
    this.tiles = tiles;
    this.ltiles = ltiles; //left side tiles
    this.rtiles = rtiles; //right-side tiles
    this.btiles = btiles; //bottom-side tiles
}

var maskChunk = function(img){

}

var flatlandImage = document.createElement("img");
flatlandImage.src = "res/Level/flat.png";
var downslopeImage = document.createElement("img");
downslopeImage.src = "res/Level/downslope.png";
var upslopeImage = document.createElement("img");




var chunks = [
    0,
    0
];

var levelCanvi = document.createElement("canvas");
var levelCtx = levelCanvi.getContext("2d");
var levelRendered = false;

function renderLevel(){
    levelCanvi.width = level[1].length*128;
    levelCanvi.height = (level.length-1)*128;
    for(var y=1; y<level.length; y++){
        for(var x = 0; x<level[y].length;x++){
            if(isNaN(level[y][x]/2)&&level[y][x] != undefined){
                for(var l = level[y][x].length-1; l >= 0;l--){
                    if(level[y][x][l] > -1 && chunks[level[y][x][l]]){
                        levelCtx.drawImage(chunks[level[y][x][l]].img,x*128,(y-1)*128);
                    }
                }
            }
            else if(level[y][x] > -1 && chunks[level[y][x]]){
                levelCtx.drawImage(chunks[level[y][x]].img,x*128,(y-1)*128);
            }
        }
    }
}

function drawLevel(ctx,camx,camy){
    if(!levelRendered){
        window.setTimeout(renderLevel,1000);
        levelRendered = true;
    }
    ctx.drawImage(levelCanvi,camx,camy);
    /*for(var y=1+Math.floor(-camy/128); y<Math.min(level.length, Math.floor(-camy/128)+Math.ceil(vScreenH/128)+2); y++){
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
            }
        }
    }*/
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
