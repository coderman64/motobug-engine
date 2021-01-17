
var chunk = function(img,tiles,ltiles,rtiles,btiles){
    this.img = img;
    this.tiles = tiles;
    this.ltiles = ltiles; //left side tiles
    this.rtiles = rtiles; //right-side tiles
    this.btiles = btiles; //bottom-side tiles
}




var chunks = [
    0,
    0
];

var levelCanvi = document.createElement("canvas");
var levelCtx = levelCanvi.getContext("2d");
var levelRendered = false;
var renderComplete = false;
var tileFilter = "";

function renderLevel(){
    // tileFilter = "none";
    // // console.log("HYPER");
    // if(loadingList.length > 0){
    //     // console.log("IMAGES HAVE NOT FINISHED LOADING...");
    //     window.setTimeout(renderLevel,1000);
    //     return;
    // }
    // for(var i = 0; i < chunks.length;i++){
    //     if(!chunks[i].img||!chunks[i].img.complete){
    //         // console.log("IMAGES HAVE NOT FINISHED LOADING...");
    //         window.setTimeout(renderLevel,1000);
    //         return;
    //     }
    // }
    // renderComplete = true;
    // levelCanvi.width = level[1].length*128;
    // levelCanvi.height = (level.length-1)*128;
    // for(var y=1; y<level.length; y++){
    //     for(var x = 0; x<level[y].length;x++){
    //         if(isNaN(level[y][x]/2)&&level[y][x] != undefined){
    //             for(var l = level[y][x].length-1; l >= 0;l--){
    //                 if(level[y][x][l] > -1 && chunks[level[y][x][l]]){
    //                     // document.body.appendChild(chunks[level[y][x][l]].img);
    //                     levelCtx.drawImage(chunks[level[y][x][l]].img,x*128,(y-1)*128);
    //                 }
    //             }
    //         }
    //         else if(level[y][x] > -1 && chunks[level[y][x]]){
    //             // document.body.appendChild(chunks[level[y][x]].img);
    //             levelCtx.drawImage(chunks[level[y][x]].img,x*128,(y-1)*128);
    //         }
    //     }
    // }
    // levelRendered = true;
}

var collidables = []
var newCollidables = [];
var levelRenderLoc = {x:0,y:0};

function drawLevel(ctx,camx,camy){
    if(levelRenderLoc.x != Math.max(0,Math.floor(-camx/128)-1) || 
        levelRenderLoc.y != Math.max(0,Math.floor(-camy/128)-1)){
        if(loadingList.length > 0){
            // console.log("IMAGES HAVE NOT FINISHED LOADING...");
            return;
        }
        for(var i = 0; i < chunks.length;i++){
            if(!chunks[i].img||!chunks[i].img.complete){
                // console.log("IMAGES HAVE NOT FINISHED LOADING...");
                //window.setTimeout(renderLevel,1000);
                return;
            }
        }
        // renderComplete = false;
        //window.setTimeout(renderLevel,1000);
        //renderLevel();
        levelCanvi.width = 128*6;
        levelCanvi.height = 128*4;
        levelCtx.clearRect(0,0,levelCanvi.width,levelCanvi.height);
        // console.log(Math.max(0,Math.floor(-camy/128)).toString()+","+Math.min(level.length,Math.floor(-camy/128+4)+1).toString());
        // console.log(Math.max(0,Math.floor(-camx/128)).toString()+","+Math.min(level[0].length,Math.floor(-camx/128+5)).toString());
        for(var y=1+Math.max(0,Math.floor(-camy/128)-1); y<Math.min(level.length,Math.floor(-camy/128+4)+1);y++){
            for(var x = Math.max(0,Math.floor(-camx/128)-1); x < Math.min(level[y].length,Math.floor(-camx/128+7)); x++){
                if(isNaN(level[y][x]/2)&&level[y][x] != undefined){
                    for(var l = level[y][x].length-1; l >= 0;l--){
                        if(level[y][x][l] > -1 && chunks[level[y][x][l]]){
                            levelCtx.drawImage(chunks[level[y][x][l]].img,x*128-Math.max(0,Math.floor(-camx/128-1))*128,(y-1)*128-128*Math.max(0,Math.floor(-camy/128-1)));
                        }
                    }
                }
                else if(level[y][x] > -1 && chunks[level[y][x]]){
                    //console.log((x*128-Math.max(0,Math.floor(camx/128))*128) + "," + ((y-1)*128-128*Math.max(0,Math.floor(camy/128))));
                    levelCtx.drawImage(chunks[level[y][x]].img,x*128-Math.max(0,Math.floor(-camx/128-1))*128,(y-1)*128-128*Math.max(0,Math.floor(-camy/128-1)));
                }
            }
        }
        levelRenderLoc.x = Math.max(0,Math.floor(-camx/128)-1);
        levelRenderLoc.y = Math.max(0,Math.floor(-camy/128)-1);
        
        
        
        // for(var y=1+Math.max(0,Math.floor(camy/128)); y<Math.min(-camy/128+vScreenH/128,level.length); y++){
        //     for(var x = Math.max(0,Math.floor(camx/128)); x<Math.min(-camx/128+vScreenW/128,level[y].length); x++){
        //         if(isNaN(level[y][x]/2)&&level[y][x] != undefined){
        //             for(var l = level[y][x].length-1; l >= 0;l--){
        //                 if(level[y][x][l] > -1 && chunks[level[y][x][l]]){
        //                     // document.body.appendChild(chunks[level[y][x][l]].img);
        //                     levelCtx.drawImage(chunks[level[y][x][l]].img,x*128-Math.max(0,Math.floor(-camx/128))*128,(y-1)*128-128*Math.max(0,Math.floor(-camy/128)));
        //                 }
        //             }
        //         }
        //         else if(level[y][x] > -1 && chunks[level[y][x]]){
        //             // document.body.appendChild(chunks[level[y][x]].img);
        //             levelCtx.drawImage(chunks[level[y][x]].img,x*128-Math.max(0,Math.floor(-camx/128))*128,(y-1)*128-128*Math.max(0,Math.floor(-camy/128)));
        //         }
        //     }
        // }
        // levelCanvi.style.zIndex = 99999;
        // document.body.append(levelCanvi);
        // document.body.style.overflow = "hidden";
        // document.body.style.border = "2px solid white";
    }
    if(motionBlurToggle){
        ctx.filter = tileFilter;
    }
    ctx.drawImage(levelCanvi,((Math.min(camx,-0.01)+128)%128)-128,(Math.min(camy,-0.01)+128)%128-128);
    ctx.filter = "none";
    newCollidables = [];
    for(var i = 0; i < level[0].length; i++){
        if(level[0][i].destroy){
            level[0].splice(i,1);
            i--;
            continue;
        }
        if(level[0][i] != null&&level[0][i].disable != true){
            if(level[0][i].x+level[0][i].w > -camx && level[0][i].y+level[0][i].h > -camy&& level[0][i].x < -camx+vScreenW && level[0][i].y < -camy+vScreenH){
                if(level[0][i].solid == true || level[0][i].platform == true){
                    newCollidables.push(level[0][i]);
                }
                if(level[0][i].draw){
                    level[0][i].draw(ctx,camx,camy);
                }
                if(level[0].length <= 0){
                    break;
                }
            }
            if(level[0][i].phys != undefined){
                level[0][i].phys();
            }
        }
    }
    collidables = newCollidables;
}
