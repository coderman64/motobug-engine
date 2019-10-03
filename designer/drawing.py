import tkinter
from PIL import Image, ImageTk, ImageDraw

class drawer(tkinter.Tk):
    def __init__(self):
        tkinter.Tk.__init__(self)

        self.img = Image.new('RGBA',(800,600))
        
        self.silversheet = Image.open("../silversheet2.png")
        self.img.paste(self.silversheet)
        self.tkimg = ImageTk.PhotoImage(self.img)
        self.label = tkinter.Label(self, image=self.tkimg)
        self.label.pack()
        self.imDraw = ImageDraw.Draw(self.img, 'RGBA')
        self.x = 0
        self.after(17,self.loop)
        self.updateProcesses = []
        self.fillColor = (0,0,0,0)
        self.strokeColor = (0,0,0,0)
        self.bind('<Motion>', self.motion)
        self.bind('<1>',self.lbutton)
        self.bind('<2>',self.mbutton)
        self.bind('<3>',self.rbutton)
        self.bind('<ButtonRelease-1>',self.lbuttonr)
        self.bind('<ButtonRelease-2>',self.mbuttonr)
        self.bind('<ButtonRelease-3>',self.rbuttonr)
        self.mousePos = (0,0)
        self.resizable(False,False)
        self.mouseLeft = False
        self.mouseRight = False
        self.mouseMiddle = False
        self.iconbitmap("motobug.ico")

    ########## update processes #############
    def loop(self):
        self.imDraw = ImageDraw.Draw(self.img, "RGBA")
        #self.x += 1
        #self.silversheet = Image.open("../silversheet2.png")
        #self.img.paste(self.silversheet,(self.x,0))
        for proc in self.updateProcesses:
            proc()
        self.updateWin()
        self.imDraw.rectangle([(0,0),(800,600)],fill=(0,0,0))
        self.after(17,self.loop)
    def addUpdateProcess(self,updateProcess):
        self.updateProcesses.append(updateProcess)
    def removeUpdateProcess(self,index):
        self.updateProcesses.remove(self.updateProcesses[index])
    def updateWin(self):
        im = self.img#.resize((800,600))
        self.tkimg = ImageTk.PhotoImage(im)
        self.label.config(image=self.tkimg)
    def motion(self,event):
        self.mousePos = (event.x, event.y)
    def lbutton(self,event):
        self.mouseLeft = True
    def rbutton(self,event):
        self.mouseRight = True
    def mbutton(self,event):
        self.mouseMiddle = True
    def lbuttonr(self,event):
        self.mouseLeft = False
    def rbuttonr(self,event):
        self.mouseRight = False
    def mbuttonr(self,event):
        self.mouseMiddle = False

    ######### actual drawing functions ###########
    def drawTile(self,tile,x,y):
        if tile.img.mode == "RGBA":
            self.img.paste(tile.img,(x,y),mask=tile.img)
        else:
            self.img.paste(tile.img,(x,y))
    def drawImg(self,img,x,y):
        if img.mode == "RGBA":
            self.img.paste(img,(x,y),mask=img)
        else:
            self.img.paste(img,(x,y))
    def drawRect(self,x,y,w,h):
        self.imDraw.rectangle([(x,y),(x+w,y+h)],fill=self.fillColor,outline=self.strokeColor)
    def setFill(self,fill):
        self.fillColor = fill
    def setStroke(self,stroke):
        self.strokeColor = stroke

if __name__ == "__main__":
    drw = drawer()
    drw.mainloop()