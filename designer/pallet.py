from tkinter import *
from PIL import ImageTk, Image, ImageOps

class pallet(Toplevel):
    def __init__(self,mast):
        Toplevel.__init__(self,mast)
        self.transient(mast)
        self.tiles = []
        self.text = Text(self, state=DISABLED, width = 30, height=30)
        self.text.insert(END,"HI!")
        self.text.pack()
        self.resizable(False,False)
        self.title("Motobug Studio - toolbox")
        self.iconbitmap("motobug.ico")
        self.imgClick = None
        self.selected = 0

    def setTiles(self,tileList):
        self.tiles = tileList
        self.text.config(state = NORMAL)
        imgn = []
        for i in self.tiles:
            img1 = ImageTk.PhotoImage(i.img)
            lab = Label(self.text,image=img1)
            lab.photo = img1
            ic = self.imgClick
            imgn = int(self.tiles.index(i))
            lab.bind('<1>',lambda e,imgn=imgn: ic(imgn))
            #self.text.image_create(END,image=img1)
            self.text.window_create(END,window=lab)
            self.text.insert(END,"\n"+i.img.filename+"\n")
        self.text.config(state = DISABLED)

if __name__ == "__main__":
    root = Tk()
    pal = pallet(root)
    root.mainloop()