from drawing import *
from tiles import tile
from fileParser import tileParser, export
from pallet import pallet
from tkinter import *
from os import path
import math
import webbrowser

#LEVELFILE = "../level3.js"
TILEFILE = "projects/MGHz/tiles.txt"

class mainExec:
    def __init__(self):
        self.currentLevel = [
            [-1,-1,-1,-1],
            [-1,-1,-1,-1],
            [-1,[1,0],-1,-1],
            [ 0, 4, 0, 0],
            [ 4, 4, 4, 4]
            ]
        self.currentTiles = [tile("..\\res\\Level\\mechaGreen\\tiles\\0m2.png")]
        self.offset = [0,0]
        self.dragLastPos = [0,0]
        self.dragPPress = False
        tp = tileParser(TILEFILE)
        self.currentTiles = tp.getTiles()
        self.selTile = 0
        self.currentLayer = -1
        self.currentitems = []
        print(str(len(self.currentTiles))+" tiles imported")

        self.pallet = None            
        self.mainWin = drawer()
        self.mainWin.addUpdateProcess(self.mainLoop)
        self.mainWin.title("Motobug Studio (beta)")
        self.openPallet()
        self.menubar = Menu(self.mainWin)
        self.menubar.add_command(label="run",command=self.run)
        self.winMenu = Menu(self.mainWin)
        self.winMenu.add_command(label="Tile Pallet",command=self.openPallet)
        self.menubar.add_cascade(label="Windows",menu=self.winMenu)
        self.mainWin.config(menu=self.menubar)

        self.mainWin.mainloop()
    def run(self):
        export(self.currentLevel,"../TestLevel.js")
        webbrowser.open("file://"+path.realpath("../index.html"))
    def openPallet(self):
        if self.pallet == None or self.pallet.winfo_exists() == False:
            self.pallet = pallet(self.mainWin)
            self.pallet.imgClick = self.selectTile
            self.pallet.setTiles(self.currentTiles)
            self.layerButton = Button(self.pallet,text="Layer: both",command=self.toggleLayer)
            self.layerButton.pack()
            self.pallet.focus_force()
        else:
            self.pallet.focus_force()
    def toggleLayer(self):
        if self.currentLayer == 1:
            self.currentLayer = -1
            self.layerButton.config(text="Layer: both")
        elif self.currentLayer == 0:
            self.currentLayer = 1
            self.layerButton.config(text="Layer: 1")
        else:
            self.currentLayer = 0
            self.layerButton.config(text="Layer: 0")
    def mainLoop(self):
        if self.mainWin.mouseMiddle:
            self.offset[0] -= self.mainWin.mousePos[0]-self.dragLastPos[0]
            self.offset[1] -= self.mainWin.mousePos[1]-self.dragLastPos[1]
        self.dragLastPos = self.mainWin.mousePos
        self.drawTiles()
        self.mainWin.setFill((0,0,0,0))
        if self.mainWin.mouseLeft:
            self.mainWin.setFill((0,255,0,255))
            if math.floor((self.mainWin.mousePos[0]+self.offset[0])/128) < 0:
                for i in range(0-math.floor((self.mainWin.mousePos[0]+self.offset[0])/128)):
                    self.addFCol()
                    self.offset[0] += 128
            elif math.floor((self.mainWin.mousePos[0]+self.offset[0])/128) >= len(self.currentLevel[0]):
                for i in range(math.floor((self.mainWin.mousePos[0]+self.offset[0])/128)-len(self.currentLevel[0])+1):
                    self.addLCol()
            if math.floor((self.mainWin.mousePos[1]+self.offset[1])/128) < 0:
                for i in range(0-math.floor((self.mainWin.mousePos[1]+self.offset[1])/128)):
                    self.addFRow()
                    self.offset[1] += 128
            elif math.floor((self.mainWin.mousePos[1]+self.offset[1])/128) >= len(self.currentLevel):
                for i in range(math.floor((self.mainWin.mousePos[1]+self.offset[1])/128)-len(self.currentLevel)+1):
                    self.addLRow()
            if math.floor((self.mainWin.mousePos[0]+self.offset[0])/128) >= 0 and math.floor((self.mainWin.mousePos[0]+self.offset[0])/128) < len(self.currentLevel[0]):
                if math.floor((self.mainWin.mousePos[1]+self.offset[1])/128) >= 0 and math.floor((self.mainWin.mousePos[1]+self.offset[1])/128) < len(self.currentLevel):
                    cTile = self.currentLevel[math.floor((self.mainWin.mousePos[1]+self.offset[1])/128)][math.floor((self.mainWin.mousePos[0]+self.offset[0])/128)]
                    if self.currentLayer == -1:
                        self.currentLevel[math.floor((self.mainWin.mousePos[1]+self.offset[1])/128)][math.floor((self.mainWin.mousePos[0]+self.offset[0])/128)] = self.selTile
                    elif self.currentLayer == 0:
                        if type(cTile) == int:
                            self.currentLevel[math.floor((self.mainWin.mousePos[1]+self.offset[1])/128)][math.floor((self.mainWin.mousePos[0]+self.offset[0])/128)] = [self.selTile,cTile]
                        else:
                            self.currentLevel[math.floor((self.mainWin.mousePos[1]+self.offset[1])/128)][math.floor((self.mainWin.mousePos[0]+self.offset[0])/128)][0] = self.selTile
                    elif self.currentLayer == 1:
                        if type(cTile) == int:
                            self.currentLevel[math.floor((self.mainWin.mousePos[1]+self.offset[1])/128)][math.floor((self.mainWin.mousePos[0]+self.offset[0])/128)] = [cTile,self.selTile]
                        else:
                            self.currentLevel[math.floor((self.mainWin.mousePos[1]+self.offset[1])/128)][math.floor((self.mainWin.mousePos[0]+self.offset[0])/128)][1] = self.selTile

        elif self.mainWin.mouseRight:
            self.mainWin.setFill((255,0,0,255))
            if math.floor((self.mainWin.mousePos[0]+self.offset[0])/128) >= 0 and math.floor((self.mainWin.mousePos[0]+self.offset[0])/128) < len(self.currentLevel[0]):
                if math.floor((self.mainWin.mousePos[1]+self.offset[1])/128) >= 0 and math.floor((self.mainWin.mousePos[1]+self.offset[1])/128) < len(self.currentLevel):
                    cTile = self.currentLevel[math.floor((self.mainWin.mousePos[1]+self.offset[1])/128)][math.floor((self.mainWin.mousePos[0]+self.offset[0])/128)]
                    if self.currentLayer == -1:
                        self.currentLevel[math.floor((self.mainWin.mousePos[1]+self.offset[1])/128)][math.floor((self.mainWin.mousePos[0]+self.offset[0])/128)] = -1
                    elif self.currentLayer == 0:
                        if type(cTile) == int:
                            self.currentLevel[math.floor((self.mainWin.mousePos[1]+self.offset[1])/128)][math.floor((self.mainWin.mousePos[0]+self.offset[0])/128)] = [-1,cTile]
                        else:
                            self.currentLevel[math.floor((self.mainWin.mousePos[1]+self.offset[1])/128)][math.floor((self.mainWin.mousePos[0]+self.offset[0])/128)][0] = -1
                    elif self.currentLayer == 1:
                        if type(cTile) == int:
                            self.currentLevel[math.floor((self.mainWin.mousePos[1]+self.offset[1])/128)][math.floor((self.mainWin.mousePos[0]+self.offset[0])/128)] = [cTile,-1]
                        else:
                            self.currentLevel[math.floor((self.mainWin.mousePos[1]+self.offset[1])/128)][math.floor((self.mainWin.mousePos[0]+self.offset[0])/128)][1] = -1
                  

        elif self.mainWin.mouseMiddle:
            self.mainWin.setFill((0,0,255,255))

        self.mainWin.drawRect(math.floor((self.mainWin.mousePos[0]+self.offset[0])/128)*128-self.offset[0],math.floor((self.mainWin.mousePos[1]+self.offset[1])/128)*128-self.offset[1],128,128)
    def drawTiles(self):
        for row in range(0,len(self.currentLevel)):
            for i in range(0,len(self.currentLevel[row])):
                if type(self.currentLevel[row][i]) == int:
                    if self.currentLevel[row][i] >= 0 and self.currentLevel[row][i] < len(self.currentTiles):
                        self.currentTiles[self.currentLevel[row][i]].default()
                        self.mainWin.drawTile(self.currentTiles[self.currentLevel[row][i]],i*128-self.offset[0],row*128-self.offset[1])
                    elif self.currentLevel[row][i] >= len(self.currentTiles):
                        self.mainWin.setFill((255,0,255,255))
                        self.mainWin.setStroke((255,0,255,255))
                        #self.mainWin.drawRect(0,0,128,128)
                        self.mainWin.drawRect(i*128-self.offset[0],row*128-self.offset[1],128,128)
                        self.mainWin.setStroke((0,0,0,0))
                else:
                    for z in range(len(self.currentLevel[row][i])-1,-1,-1):
                        if self.currentLevel[row][i][z] >= 0 and self.currentLevel[row][i][z] < len(self.currentTiles):
                            if int(z) == int(self.currentLayer) and self.currentLayer != -1:
                                #self.currentTiles[self.currentLevel[row][i][z]].default()
                                self.currentTiles[self.currentLevel[row][i][z]].colorized((255,0,0,50),(255,255,255,50))
                            elif self.currentLayer != -1:
                                self.currentTiles[self.currentLevel[row][i][z]].colorized((0,0,0,50),(0,0,255,50))
                            else:
                                self.currentTiles[self.currentLevel[row][i][z]].default()
                            self.mainWin.drawTile(self.currentTiles[self.currentLevel[row][i][z]],i*128-self.offset[0],row*128-self.offset[1])
                        elif self.currentLevel[row][i][z] >= len(self.currentTiles):
                            self.mainWin.setFill((255,0,255,255))
                            self.mainWin.setStroke((255,0,255,255))
                            #self.mainWin.drawRect(0,0,128,128)
                            self.mainWin.drawRect(i*128-self.offset[0],row*128-self.offset[1],128,128)
                            self.mainWin.setStroke((0,0,0,0))
    def selectTile(self,sel):
        self.selTile = sel
    def addFCol(self):
        for i in range(len(self.currentLevel)):
            self.currentLevel[i].insert(0,-1)
    def addLCol(self):
        for i in range(len(self.currentLevel)):
            self.currentLevel[i].append(-1)
    def addFRow(self):
        self.currentLevel.insert(0,[-1 for i in range(len(self.currentLevel[0]))])
    def addLRow(self):
        self.currentLevel.append([-1 for i in range(len(self.currentLevel[0]))])
        #self.offset[0] += 1

if __name__=="__main__":
    mn = mainExec()

    """rootWin.update_idletasks()
    rootWin.update()
    
    
    def motion(event):
        x, y = event.x, event.y
        print('{}, {}'.format(x, y))

        root.bind('<Motion>', motion)
"""