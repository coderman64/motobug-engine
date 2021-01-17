/*
This is a part of the motobug engine. 
These functions are used for collisions between the player/items and the environment. 
There are four functions for this:
senseVLine(x,y,h,c,l): sense the top of something using a vertical line
starts at (x,y) and goes down by h. 
c is the canvas element, which can be drawn on for debugging purposes.
l is the layer (0 or 1) which should be collided with (good for loops and so forth)
the rest are similar, just in different directions:
senseVLineB: same, but upside down
SenseHLineR: same, but to the right
SenseHLineL: same, but to the left

they return the same array, too:
[<Boolean: if something was detected>,<position (x or y) of what was detected>,<angle of what was detected (in degrees)>]

collidables is a list of items within the view that either are "platforms" or "solid" objects
it is defined in tileSystem.js (where all the items are drawn)
*/


function senseVLine(x,y,h,c,l){
    var numTiles = Math.ceil(h/16)+1;
    var highest = [false,-1];
    var result, tiles1, tile;
    for(var i = 0; i<numTiles;i++){
        var yindex = Math.floor((y+i*16)/128)+1;
        var xindex = Math.floor(x/128);
        //so i represents the tile number, and x is the height at which we start.
        if(yindex > 0 && yindex < level.length&& xindex >= 0 && xindex < level[yindex].length){
            if((chunks[level[yindex][xindex]] != undefined||(level[yindex][xindex] != undefined&&chunks[level[yindex][xindex][l]] != undefined))){
                tiles1 = undefined;
                if(Array.isArray(level[yindex][xindex]) == false){
                    tiles1 = chunks[level[yindex][xindex]].tiles;
                }
                else if(l < level[yindex][xindex].length)
                {
                    tiles1 = chunks[level[yindex][xindex][l]].tiles;
                }
                else
                {
                    continue;
                }
                if(tiles1 != undefined && tiles1[Math.floor(((y+i*16)%128)/16)]){
                    if(tiles1[Math.floor(((y+i*16)%128)/16)][Math.floor((x%128)/16)] && tiles1[Math.floor(((y+i*16)%128)/16)][Math.floor((x%128)/16)][Math.floor((x%128)%16)] != -16){
                        //this must mean that this tile is a solid tile, and exists
                        tile = tiles1[Math.floor(((y+i*16)%128)/16)][Math.floor((x%128)/16)]; //grab that tile
                        result = [true,Math.floor((y+i*16)/16)*16+(16-tile[Math.floor((x%128)%16)]),tile[16]]//The y-position of the ground, the angle of the ground
                        if((result[1] < highest[1]||highest[1] == -1)){
                            highest = result;
                        }
                    }
                }
                
            }
        }
    }
    debug.addRect(x,y,1,h,"#000099");
    for(var i = 0; i < collidables.length; i++){
        if(x > collidables[i].x && x < collidables[i].x+collidables[i].w && collidables[i].y > y && collidables[i].y < y+h){
            if(collidables[i].y < highest[1]||highest[1] == -1){
                highest = [true,collidables[i].y+1, 0];
            }
        }
    }
    if(highest[0])
        debug.addRect(x,y,1,highest[1]-y,"#FF0000")
    return highest; // returns an array: [<if tile was found>, <height of ground>, <angle of ground>]
}

function senseVLineB(x,y,h,c,l){
    var numTiles = Math.ceil(h/16)+1;
    var highest = [false,-1];
    var tiles1,tile,result;
    for(var i = 0; i<numTiles;i++){
        var yindex = Math.floor((y-i*16)/128)+1;
        var xindex = Math.floor(x/128);
        //so i represents the tile number, and x is the height at which we start.
        if(level[yindex] != undefined && level[yindex][xindex] != undefined){
            if((chunks[level[yindex][xindex]] != undefined||(level[yindex][xindex] != undefined&&chunks[level[yindex][xindex][l]] != undefined))){
                var tiles1 = undefined;
                if(Array.isArray(level[yindex][xindex]) == false){
                    tiles1 = chunks[level[yindex][xindex]].btiles;
                }
                else if(level[yindex][xindex].length > l)
                {
                    tiles1 = chunks[level[yindex][xindex][l]].btiles;
                }
                else
                {
                    continue;
                }
                if(tiles1 != undefined && tiles1[Math.floor(((y-i*16)%128)/16)]){
                    if(tiles1[Math.floor(((y-i*16)%128)/16)][Math.floor((x%128)/16)] && tiles1[Math.floor(((y-i*16)%128)/16)][Math.floor((x%128)/16)][Math.floor((x%128)%16)] != -16){
                        //this must mean that this tile is a solid tile, and exists
                        var tile = tiles1[Math.floor(((y-i*16)%128)/16)][Math.floor((x%128)/16)]; //grab that tile
                        result = [true,Math.floor((y-i*16)/16)*16+(16-tile[Math.floor((x%128)%16)]),tile[16]]//The y-position of the ground, the angle of the ground
                        if((result[1] > highest[1])){
                            highest = result;
                        }
                    }
                }
                
            }
        }
    }
    debug.addRect(x,y-h,1,h,"#009900");
    if(highest[0])
        debug.addRect(x,highest[1],1,y-highest[1],"#00FF00");
    return highest; // returns an array: [<if tile was found>, <height of ground>, <angle of ground>]
}

function senseHLineR(x,y,w,c,l){
    var numTiles = Math.ceil(w/16)+1;
    var highest = [false,-1];
    var tiles1, tile,result;
    for(var i = 0; i<numTiles;i++){
        //so i represents the tile number, and x is the height at which we start.
        if(level[Math.floor(y/128)+1] != undefined &&level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)] != undefined){
            if( (chunks[level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)]] != undefined||(level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)] != undefined&&chunks[level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)][l]] != undefined))){
                tiles1 = undefined;
                if(Array.isArray(level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)]) == false){
                    tiles1 = chunks[level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)]].ltiles;
                }
                else if(level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)].length > l)
                {
                    tiles1 = chunks[level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)][l]].ltiles;
                }
                else
                {
                    continue;
                }
                if(tiles1 != undefined && tiles1[Math.floor(((x+i*16)%128)/16)]){
                    if(tiles1[Math.floor(((x+i*16)%128)/16)][Math.floor((y%128)/16)]&&tiles1[Math.floor(((x+i*16)%128)/16)][Math.floor((y%128)/16)][Math.floor((y%128)%16)] != -16){
                        //this must mean that this tile is a solid tile, and exists
                        tile = tiles1[Math.floor(((x+i*16)%128)/16)][Math.floor((y%128)/16)]; //grab that tile
                        result = [true,Math.floor((x+i*16)/16)*16+(16-tile[Math.floor((y%128)%16)]),tile[16]]//The y-position of the ground, the angle of the ground
                        if((result[1] < highest[1]||highest[1] == -1)){
                            highest = result;
                        }
                    }
                }
                
            }
        }
    }

    // for(var i = 0; i < level[0].length; i++){
    //     if(level[0][i].solid == true){
    //         if(x+w > level[0][i].x && x < level[0][i].x+level[0][i].w && level[0][i].y+level[0][i].h > y && level[0][i].y < y){
    //             if(level[0][i].x+1 < highest[1]||highest[1] == -1){
    //                 highest = [true,level[0][i].x+1, 90];
    //             }
    //         }
    //     }
    // }
    for(var i = 0; i < collidables.length; i++){
        if(x+w > collidables[i].x && x < collidables[i].x+collidables[i].w && collidables[i].y+collidables[i].h > y && collidables[i].y < y){
            if(collidables[i].x+1 < highest[1]||highest[1] == -1){
                highest = [true,collidables[i].x+1, 90];
            }
        }
    }


    debug.addRect(x,y,w,1,"#990000");

    return highest; // returns an array: [<if tile was found>, <height of ground>, <angle of ground>]
}

function senseHLineL(x,y,w,c,l){
    var numTiles = Math.ceil(w/16)+1;
    var highest = [false,-1];
    var tiles1, tile, result;
    for(var i = 0; i<numTiles;i++){
        //so i represents the tile number, and x is the height at which we start.
        if(level[Math.floor(y/128)+1] != undefined&&level[Math.floor(y/128)+1][Math.floor((x-i*16)/128)] != undefined){
            if((chunks[level[Math.floor(y/128)+1][Math.floor((x-i*16)/128)]] != undefined||chunks[level[Math.floor(y/128)+1][Math.floor((x-i*16)/128)][l]] != undefined)){
                tiles1 = undefined;
                if(Array.isArray(level[Math.floor(y/128)+1][Math.floor((x-i*16)/128)]) == false){
                    tiles1 = chunks[level[Math.floor(y/128)+1][Math.floor((x-i*16)/128)]].rtiles;
                }
                else if(level[Math.floor(y/128)+1][Math.floor((x-i*16)/128)].length > l)
                {
                    tiles1 = chunks[level[Math.floor(y/128)+1][Math.floor((x-i*16)/128)][l]].rtiles;
                }
                else
                {
                    continue;
                }
                if(tiles1 != undefined && tiles1[Math.floor(((x-i*16)%128)/16)]){
                    if(tiles1[Math.floor(((x-i*16)%128)/16)][Math.floor((y%128)/16)]&&tiles1[Math.floor(((x-i*16)%128)/16)][Math.floor((y%128)/16)][Math.floor((y%128)%16)] != -16){
                        //this must mean that this tile is a solid tile, and exists
                        tile = tiles1[Math.floor(((x-i*16)%128)/16)][Math.floor((y%128)/16)]; //grab that tile
                        result = [true,Math.floor((x-i*16)/16)*16+(16-tile[Math.floor((y%128)%16)]),tile[16]]//The y-position of the ground, the angle of the ground
                        if((result[1] > highest[1])){
                            highest = result;
                        }
                    }
                }
            }
        }
    }
    debug.addRect(x-w,y,w,1,"#999900");
    
    // for(var i = 0; i < level[0].length; i++){
    //     if(level[0][i].solid == true){
    //         if(x > level[0][i].x && x-w < level[0][i].x+level[0][i].w && level[0][i].y+level[0][i].h > y && level[0][i].y < y){
    //             if(level[0][i].x+level[0][i].w-1 > highest[1]||highest[1] == -1){
    //                 highest = [true,level[0][i].x+level[0][i].w-1, -90];
    //             }
    //         }
    //     }
    // }
    for(var i = 0; i < collidables.length; i++){
        if(x > collidables[i].x && x-w < collidables[i].x+collidables[i].w && collidables[i].y+collidables[i].h > y && collidables[i].y < y){
            if(collidables[i].x+collidables[i].w-1 > highest[1]||highest[1] == -1){
                highest = [true,collidables[i].x+collidables[i].w-1, -90];
            }
        }
    }


    return highest; // returns an array: [<if tile was found>, <height of ground>, <angle of ground>]
}