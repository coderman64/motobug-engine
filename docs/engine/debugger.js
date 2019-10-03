
var toDraw = [];

var debug = {
    toDraw:[],
    logVar:[],
    rect: function(x,y,w,h,c){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;
    },
    drawAll: function(camx,camy,ctx){
        for(var i = 0; i < this.toDraw.length; i++){
            ctx.fillStyle = this.toDraw[i].c;
            ctx.fillRect(this.toDraw[i].x+camx,this.toDraw[i].y+camy,this.toDraw[i].w,this.toDraw[i].h);
        }
        this.toDraw = [];
        ctx.fillStyle = "#000000";
        ctx.textBaseline = "bottom";
        for(var i = 0; i < this.logVar; i++){
            ctx.fillText(this.logVar[i],200,150+i*20);
        }
        ctx.textBaseline = "top";
    },
    addRect: function(x,y,w,h,c){
        this.toDraw[this.toDraw.length] = new this.rect(x,y,w,h,c);
    },
    clearAll: function(){
        this.toDraw = [];
    },
    camX: 0,
    camY: 0,
    log: function(obj){
        this.logVar += "\n"+obj.toString();
    }
}