
function senseVLine(x,y,h,c,l){
    var numTiles = Math.ceil(h/16)+1;
    if(numTiles <= 1){
        return sensePt(x,y);
    }
    var results = [];
    for(var i = 0; i<numTiles;i++){
        //so i represents the tile number, and x is the height at which we start.
        if(level[Math.floor((y+i*16)/128)+1] != undefined&&level[Math.floor((y+i*16)/128)+1][Math.floor(x/128)] != undefined){
            if((chunks[level[Math.floor((y+i*16)/128)+1][Math.floor(x/128)]] != undefined||(level[Math.floor((y+i*16)/128)+1][Math.floor(x/128)] != undefined&&chunks[level[Math.floor((y+i*16)/128)+1][Math.floor(x/128)][l]] != undefined))){
                var tiles1 = undefined;
                if(Array.isArray(level[Math.floor((y+i*16)/128)+1][Math.floor(x/128)]) == false){
                    tiles1 = chunks[level[Math.floor((y+i*16)/128)+1][Math.floor(x/128)]].tiles;
                }
                else
                {
                    //console.log("layer: "+level[Math.floor((y+i*16)/128)+1][Math.floor(x/128)][l])
                    tiles1 = chunks[level[Math.floor((y+i*16)/128)+1][Math.floor(x/128)][l]].tiles;
                }
                if(tiles1 != undefined && tiles1[Math.floor(((y+i*16)%128)/16)]){
                    if(tiles1[Math.floor(((y+i*16)%128)/16)][Math.floor((x%128)/16)] && tiles1[Math.floor(((y+i*16)%128)/16)][Math.floor((x%128)/16)][Math.floor((x%128)%16)] != -16){
                        //this must mean that this tile is a solid tile, and exists
                        //c.fillStyle = "#FF0000";
                        //c.fillRect(Math.floor((x)/16)*16,Math.floor(((y+i*16))/16)*16,16,16);
                        var tile = tiles1[Math.floor(((y+i*16)%128)/16)][Math.floor((x%128)/16)]; //grab that tile
                        results[i] = [true,Math.floor((y+i*16)/16)*16+(16-tile[Math.floor((x%128)%16)]),tile[16]]//The y-position of the ground, the angle of the ground
                        //console.log("did work!: ["+results[i][0]+","+results[i][1]+","+results[i][2]+"]");
                    }
                    else
                    {
                        results[i] = [false];
                    }
                }
                else
                {
                    results[i] = [false];
                }
                
            }
            else
            {
                //console.log("didn't work! looking for tile: ("+Math.floor(x/128)+","+Math.floor((y+i*16)/128)+")");
            }
        }
    }
    debug.addRect(x,y,1,h,"#000099");
    var highest = [false, -1];
    for(var i = 0; i < results.length; i++){
        if(results[i] != undefined){
            if(results[i][0] == true && (results[i][1] < highest[1]||highest[1] == -1)){
                //console.log("found!");
                highest = results[i];
            }
        }
    }
    for(var i = 0; i < level[0].length; i++){
        if(level[0][i].solid == true || level[0][i].platform == true){
            if(x > level[0][i].x && x < level[0][i].x+level[0][i].w && level[0][i].y > y && level[0][i].y < y+h){
                if(level[0][i].y < highest[1]||highest[1] == -1){
                    highest = [true,level[0][i].y+1, 0];
                }
            }
        }
    }
    return highest; // returns an array: [<if tile was found>, <height of ground>, <angle of ground>]
}

function senseVLineB(x,y,h,c,l){
    var numTiles = Math.ceil(h/16)+1;
    /*if(numTiles <= 1){
        return sensePt(x,y);
    }*/
    var results = [];
    for(var i = 0; i<numTiles;i++){
        //so i represents the tile number, and x is the height at which we start.
        if(level[Math.floor((y-i*16)/128)+1] != undefined && level[Math.floor((y-i*16)/128)+1][Math.floor(x/128)] != undefined){
            if((chunks[level[Math.floor((y-i*16)/128)+1][Math.floor(x/128)]] != undefined||(level[Math.floor((y-i*16)/128)+1][Math.floor(x/128)] != undefined&&chunks[level[Math.floor((y-i*16)/128)+1][Math.floor(x/128)][l]] != undefined))){
                var tiles1 = undefined;
                if(Array.isArray(level[Math.floor((y-i*16)/128)+1][Math.floor(x/128)]) == false){
                    tiles1 = chunks[level[Math.floor((y-i*16)/128)+1][Math.floor(x/128)]].btiles;
                }
                else
                {
                    //console.log("layer: "+level[Math.floor((y-i*16)/128)+1][Math.floor(x/128)][l]);
                    tiles1 = chunks[level[Math.floor((y-i*16)/128)+1][Math.floor(x/128)][l]].btiles;
                }
                if(tiles1 != undefined && tiles1[Math.floor(((y+i*16)%128)/16)]){
                    if(tiles1[Math.floor(((y-i*16)%128)/16)][Math.floor((x%128)/16)] && tiles1[Math.floor(((y-i*16)%128)/16)][Math.floor((x%128)/16)][Math.floor((x%128)%16)] != -16){
                        //this must mean that this tile is a solid tile, and exists
                        //c.fillStyle = "#FF0000";
                        //c.fillRect(Math.floor((x)/16)*16,Math.floor(((y+i*16))/16)*16,16,16);
                        var tile = tiles1[Math.floor(((y-i*16)%128)/16)][Math.floor((x%128)/16)]; //grab that tile
                        results[i] = [true,Math.floor((y-i*16)/16)*16+(16-tile[Math.floor((x%128)%16)]),tile[16]]//The y-position of the ground, the angle of the ground
                        //console.log("did work!: ["+results[i][0]+","+results[i][1]+","+results[i][2]+"]");
                    }
                    else
                    {
                        results[i] = [false];
                    }
                }
                else
                {
                    results[i] = [false];
                }
                
            }
        }
    }
    debug.addRect(x,y-h,1,h,"#009900");
    var highest = [false, -1];// actually finds lowest...
    for(var i = 0; i < results.length; i++){
        if(results[i] != undefined){
            if(results[i][0] == true && (results[i][1] > highest[1])){
                //console.log("found!");
                highest = results[i];
            }
        }
    }
    return highest; // returns an array: [<if tile was found>, <height of ground>, <angle of ground>]
}

function senseHLineR(x,y,w,c,l){
    var numTiles = Math.ceil(w/16)+1;
    var results = [];
    for(var i = 0; i<numTiles;i++){
        //so i represents the tile number, and x is the height at which we start.
        if(level[Math.floor(y/128)+1] != undefined &&level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)] != undefined){
            if( (chunks[level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)]] != undefined||(level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)] != undefined&&chunks[level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)][l]] != undefined))){
                var tiles1 = undefined;
                if(Array.isArray(level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)]) == false){
                    tiles1 = chunks[level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)]].ltiles;
                }
                else
                {
                    //console.log("layer: "+level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)][l]);
                    tiles1 = chunks[level[Math.floor(y/128)+1][Math.floor((x+i*16)/128)][l]].ltiles;
                }
                if(tiles1 != undefined && tiles1[Math.floor(((x+i*16)%128)/16)]){
                    if(tiles1[Math.floor(((x+i*16)%128)/16)][Math.floor((y%128)/16)]&&tiles1[Math.floor(((x+i*16)%128)/16)][Math.floor((y%128)/16)][Math.floor((y%128)%16)] != -16){
                        //this must mean that this tile is a solid tile, and exists
                        //c.fillStyle = "#FF0000";
                        //c.fillRect(Math.floor((x)/16)*16,Math.floor(((y+i*16))/16)*16,16,16);
                        var tile = tiles1[Math.floor(((x+i*16)%128)/16)][Math.floor((y%128)/16)]; //grab that tile
                        results[i] = [true,Math.floor((x+i*16)/16)*16+(16-tile[Math.floor((y%128)%16)]),tile[16]]//The y-position of the ground, the angle of the ground
                        //console.log("did work!: ["+results[i][0]+","+results[i][1]+","+results[i][2]+"]");
                    }
                    else
                    {
                        results[i] = [false];
                    }
                }
                else
                {
                    results[i] = [false];
                }
                
            }
            else
            {
                //console.log("didn't work! looking for tile: ("+Math.floor(x/128)+","+Math.floor((y+i*16)/128)+")");
            }
        }
    }
    var highest = [false, -1];
    for(var i = 0; i < results.length; i++){
        if(results[i] != undefined){
            if(results[i][0] == true && (results[i][1] < highest[1]||highest[1] == -1)){
                //console.log("found!");
                highest = results[i];
            }
        }
    }

    for(var i = 0; i < level[0].length; i++){
        if(level[0][i].solid == true){
            if(x+w > level[0][i].x && x < level[0][i].x+level[0][i].w && level[0][i].y+level[0][i].h > y && level[0][i].y < y){
                console.log("foundone!")
                if(level[0][i].x+1 < highest[1]||highest[1] == -1){
                    highest = [true,level[0][i].x+1, 90];
                }
            }
        }
    }

    debug.addRect(x,y,w,1,"#990000");

    return highest; // returns an array: [<if tile was found>, <height of ground>, <angle of ground>]
}

function senseHLineL(x,y,w,c,l){
    var numTiles = Math.ceil(w/16)+1;
    var results = [];
    for(var i = 0; i<numTiles;i++){
        //so i represents the tile number, and x is the height at which we start.
        if(level[Math.floor(y/128)+1] != undefined&&level[Math.floor(y/128)+1][Math.floor((x-i*16)/128)] != undefined){
            if((chunks[level[Math.floor(y/128)+1][Math.floor((x-i*16)/128)]] != undefined||chunks[level[Math.floor(y/128)+1][Math.floor((x-i*16)/128)][l]] != undefined)){
                var tiles1 = undefined;
                if(Array.isArray(level[Math.floor(y/128)+1][Math.floor((x-i*16)/128)]) == false){
                    tiles1 = chunks[level[Math.floor(y/128)+1][Math.floor((x-i*16)/128)]].rtiles;
                }
                else
                {
                    //console.log("layer: "+level[Math.floor(y/128)+1][Math.floor((x-i*16)/128)][l]);
                    tiles1 = chunks[level[Math.floor(y/128)+1][Math.floor((x-i*16)/128)][l]].rtiles;
                }
                if(tiles1 != undefined && tiles1[Math.floor(((x-i*16)%128)/16)]){
                    if(tiles1[Math.floor(((x-i*16)%128)/16)][Math.floor((y%128)/16)]&&tiles1[Math.floor(((x-i*16)%128)/16)][Math.floor((y%128)/16)][Math.floor((y%128)%16)] != -16){
                        //this must mean that this tile is a solid tile, and exists
                        //c.fillStyle = "#FF0000";
                        //c.fillRect(Math.floor((x)/16)*16,Math.floor(((y+i*16))/16)*16,16,16);
                        var tile = tiles1[Math.floor(((x-i*16)%128)/16)][Math.floor((y%128)/16)]; //grab that tile
                        results[i] = [true,Math.floor((x-i*16)/16)*16+(16-tile[Math.floor((y%128)%16)]),tile[16]]//The y-position of the ground, the angle of the ground
                        //console.log("did work!: ["+results[i][0]+","+results[i][1]+","+results[i][2]+"]");
                    }
                    else
                    {
                        results[i] = [false];
                    }
                }
                else
                {
                    results[i] = [false];
                }
                
            }
            else
            {
                //console.log("didn't work! looking for tile: ("+Math.floor(x/128)+","+Math.floor((y+i*16)/128)+")");
            }
        }
    }
    debug.addRect(x-w,y,w,1,"#999900");
    
    var highest = [false, -1];
    for(var i = 0; i < results.length; i++){
        if(results[i] != undefined){
            if(results[i][0] == true && (results[i][1] > highest[1])){
                //console.log("found!");
                highest = results[i];
            }
        }
    }
    for(var i = 0; i < level[0].length; i++){
        if(level[0][i].solid == true){
            if(x > level[0][i].x && x-w < level[0][i].x+level[0][i].w && level[0][i].y+level[0][i].h > y && level[0][i].y < y){
                if(level[0][i].x+level[0][i].w-1 > highest[1]||highest[1] == -1){
                    highest = [true,level[0][i].x+level[0][i].w-1, -90];
                }
            }
        }
    }
    return highest; // returns an array: [<if tile was found>, <height of ground>, <angle of ground>]
}