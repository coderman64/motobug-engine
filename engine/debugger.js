


// collect all debugging functions into one object
var debug = {
    toDraw:[],  // stores a queue for drawing functions to be completed
    logVar:[],  // stores a log queue
    // an object type to store debug rects
    rect: function(x,y,w,h,c){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;
    },
    // the main drawing function
    drawAll: function(camx,camy,ctx){
        // draw the queued objects
        for(var i = 0; i < this.toDraw.length; i++){
            ctx.fillStyle = this.toDraw[i].c;
            ctx.fillRect(this.toDraw[i].x+camx,this.toDraw[i].y+camy,this.toDraw[i].w,this.toDraw[i].h);
        }
        this.toDraw = [];

        // draw the log
        ctx.fillStyle = "#000000";
        ctx.textBaseline = "bottom";
        for(var i = 0; i < this.logVar; i++){
            ctx.fillText(this.logVar[i],200,150+i*20);
        }
        ctx.textBaseline = "top";
    },
    addRect: function(x,y,w,h,c){   // add a new rect to the draw queue
        this.toDraw[this.toDraw.length] = new this.rect(x,y,w,h,c);
    },
    // clears the drawing queue so that it doesn't get too full when draw isn't called
    clearAll: function(){
        this.toDraw = [];
    },
    camX: 0,    // the positioning for the debug camera
    camY: 0,
    log: function(obj){ // log something to the Motobug debug (deprecated)
        this.logVar += "\n"+obj.toString();
    }
}