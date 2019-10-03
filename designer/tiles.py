from PIL import Image,ImageOps

class tile:
    def __init__(self,imagePath):
        self.masterImg = Image.open(imagePath)
        self.img = self.masterImg
    def colorized(self,black,white):
        r,g,b,alpha = self.masterImg.split()
        self.img = ImageOps.grayscale(self.masterImg)
        self.img = ImageOps.colorize(self.img,black,white)
        self.img.putalpha(alpha)
    def default(self):
        self.img = self.masterImg