"""
item implimentation in this package will be a bit tricky, so here's the lowdown.

The item API in Motobug is really versitile, so this must be too. 

You can draw something either as a rect or as an image. 

This makes no attempt to imitate the functionality of the items. So there. 
"""
from PIL import Image
import drawing
import tiles

class item:
    def __init__(self, stringOfFunction, drawMode, props):
        props = dict(props)
        self.x = 0
        self.y = 0
        self.w = 16
        self.h = 16
        self.image = Image.new('RGBA',(32,32),color=(255,0,0))
        self.dMode = drawMode
        self.props = props
        if "x" in props.keys():
            self.x = props["x"]
        if "y" in props.keys():
            self.y = props["y"]
        if "w" in props.keys():
            self.w = props["w"]
        if "h" in props.keys():
            self.h = props["h"]
        if "image" in props.keys():
            try:
                self.image = Image.open(props["image"])
    def draw(self,drawer1):
        drawer1 = drawer()
        if self.dMode == 0:
            drawer1.drawRect(self.x,self.y,self.w,self.h)
        elif self.dMode == 1:
            drawer1.drawImg(self.image,self.x,self.y)