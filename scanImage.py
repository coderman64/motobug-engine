"""
This file is a part of the open-source Motorbug game engine. It allows you to create a playable tile for a sonic level 
by simply scanning an already created image, and storing necessary data in a js variable. 

To Do:
- enable basic (single image) scanning
- enable masked (dual image) scanning
- enable layer masked (multiple layers of collision detection) scanning
"""

import sys
from PIL import Image
import math

#imageName = str(sys.argv[len(sys.argv)-1])
#func = str(sys.argv[len(sys.argv)-2])
listFile = open("toScan.txt")

def simpleScan(imgName):
    ############################ TOP ################################
    img1 = Image.open(imgName).convert("RGBA")
    #initalize array
    tileData = [[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None]]
    for x in range(0,128):
        y = 0
        while y < 128:
            if img1.getpixel((x,y))[3] != 0:
                if tileData[math.floor(y/16)][math.floor(x/16)] == None:
                    tileData[math.floor(y/16)][math.floor(x/16)] = [-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,0]
                tileData[math.floor(y/16)][math.floor(x/16)][x%16] = 16-(y%16)
                y = 128
            y += 1
    lAngle = None
    for x in range(0,8):
        for y in range(0,8):
            if tileData[y][x] != None:
                values = [[-16,-1],[-16,-1]]
                for i in range(0,16):
                    if tileData[y][x][i] != -16:
                        if values[0][0] == -16:
                            values[0] = [tileData[y][x][i],i]#first
                        values[1] = [tileData[y][x][i],i] #last
                if (values[0][1]-values[1][1]) != 0:
                    tileData[y][x][16] = -math.floor(math.atan((values[0][0]-values[1][0])/(values[0][1]-values[1][1]))*180/math.pi)
                else:
                    tileData[y][x][16] = 0
                if abs(values[0][1]-values[1][1]) <= 2 and lAngle != None:
                    tileData[y][x][16] = lAngle
                elif abs(values[0][1]-values[1][1]) <= 2:
                    if values[0][1] < 8:
                        tileData[y][x][16] = 90
                    else:
                        tileData[y][x][16] = -90
                if tileData[y][x] != None:
                    lAngle = tileData[y][x][16]
    #print(str(tileData).replace("None","0").replace("'null'","null"))

    ##################################### LEFT #########################################
    #initalize array
    tileData2 = [[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None]]
    for y in range(0,128):
        x = 0
        while x < 128:
            if img1.getpixel((x,y))[3] != 0:
                if tileData2[math.floor(x/16)][math.floor(y/16)] == None:
                    tileData2[math.floor(x/16)][math.floor(y/16)] = [-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,0]
                tileData2[math.floor(x/16)][math.floor(y/16)][y%16] = 16-(x%16)
                x = 128
            x += 1
    lAngle = -90
    for y in range(0,8):
        for x in range(0,8):
            if tileData2[x][y] != None:
                values = [[-16,-1],[-16,-1]]
                for i in range(0,16):
                    if tileData2[x][y][i] != -16:
                        if values[0][0] == -16:
                            values[0] = [tileData2[x][y][i],i]#first
                        values[1] = [tileData2[x][y][i],i] #last
                if (values[0][1]-values[1][1]) != 0:
                    tileData2[x][y][16] = math.floor(-90+math.atan((values[0][0]-values[1][0])/(values[0][1]-values[1][1]))*180/math.pi)
                else:
                    tileData2[x][y][16] = -90
                if abs(values[0][1]-values[1][1]) <= 2:
                    tileData2[x][y][16] = lAngle
                if tileData2[x][y] != None:
                    lAngle = tileData2[x][y][16]
                
    
    #################################### RIGHT #############################
    #initialize array
    tileData3 = [[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None]]
    for y in range(0,128):
        x = 127
        while x > 0:
            if img1.getpixel((x,y))[3] != 0:
                if tileData3[math.floor(x/16)][math.floor(y/16)] == None:
                    tileData3[math.floor(x/16)][math.floor(y/16)] = [-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,0]
                tileData3[math.floor(x/16)][math.floor(y/16)][y%16] = 16-(x%16)
                x = 0
            x -= 1
    lAngle = 90
    for y in range(0,8):
        for x in range(0,8):
            if tileData3[x][y] != None:
                values = [[-16,-1],[-16,-1]]
                for i in range(0,16):
                    if tileData3[x][y][i] != -16:
                        if values[0][0] == -16:
                            values[0] = [tileData3[x][y][i],i]#first
                        values[1] = [tileData3[x][y][i],i] #last
                if (values[0][1]-values[1][1]) != 0:
                    tileData3[x][y][16] = math.floor(90+math.atan((values[0][0]-values[1][0])/(values[0][1]-values[1][1]))*180/math.pi)
                else:
                    tileData3[x][y][16] = 90
                if abs(values[0][1]-values[1][1]) <= 2:
                    tileData3[x][y][16] = lAngle
                if tileData3[x][y] != None:
                    lAngle = tileData3[x][y][16]
    #print(str(tileData3).replace("None","0").replace("'null'","null"))

    ############################# BOTTOM ###################################
    tileData4 = [[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None]]
    for x in range(0,128):
        y = 127
        while y > 0:
            if img1.getpixel((x,y))[3] != 0:
                if tileData4[math.floor(y/16)][math.floor(x/16)] == None:
                    tileData4[math.floor(y/16)][math.floor(x/16)] = [-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,0]
                tileData4[math.floor(y/16)][math.floor(x/16)][x%16] = 16-(y%16)
                y = 0
            y -= 1
    lAngle = 180
    for x in range(0,8):
        for y in range(0,8):
            if tileData4[y][x] != None:
                values = [[-16,-1],[-16,-1]]
                for i in range(0,16):
                    if tileData4[y][x][i] != -16:
                        if values[0][0] == -16:
                            values[0] = [tileData4[y][x][i],i]#first
                        values[1] = [tileData4[y][x][i],i] #last
                if (values[0][1]-values[1][1]) != 0:
                    tileData4[y][x][16] = math.floor(-180-math.atan((values[0][0]-values[1][0])/(values[0][1]-values[1][1]))*180/math.pi)
                else:
                    tileData4[y][x][16] = 180
                if abs(values[0][1]-values[1][1]) <= 2:
                    tileData4[y][x][16] = lAngle
                if tileData4[y][x] != None:
                    lAngle = tileData4[y][x][16]
    #print(str(tileData4).replace("None","0").replace("'null'","null"))

    return "new chunk(newImage(\""+imgName+"\"),"+str(tileData).replace("None","0").replace("'null'","null")+","+str(tileData2).replace("None","0").replace("'null'","null")+","+str(tileData3).replace("None","0").replace("'null'","null")+","+str(tileData4).replace("None","0").replace("'null'","null")+"),"
def noScan(imgName):
    tileData = [[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None]]
    tileData2 = [[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None]]
    tileData3 = [[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None]]
    tileData4 = [[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None]]
    return "new chunk(newImage(\""+imgName+"\"),"+str(tileData).replace("None","0").replace("'null'","null")+","+str(tileData2).replace("None","0").replace("'null'","null")+","+str(tileData3).replace("None","0").replace("'null'","null")+","+str(tileData4).replace("None","0").replace("'null'","null")+"),"

def partScan(imgName,strings):
    ############################ TOP ################################
    img1 = Image.open(imgName).convert("RGBA")
    #initalize array
    tileData = [[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None]]
    if "n" in strings:
        for x in range(0,128):
            y = 0
            while y < 128:
                if img1.getpixel((x,y))[3] != 0:
                    if tileData[math.floor(y/16)][math.floor(x/16)] == None:
                        tileData[math.floor(y/16)][math.floor(x/16)] = [-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,0]
                    tileData[math.floor(y/16)][math.floor(x/16)][x%16] = 16-(y%16)
                    y = 128
                y += 1
        lAngle = None
        for x in range(0,8):
            for y in range(0,8):
                if tileData[y][x] != None:
                    values = [[-16,-1],[-16,-1]]
                    for i in range(0,16):
                        if tileData[y][x][i] != -16:
                            if values[0][0] == -16:
                                values[0] = [tileData[y][x][i],i]#first
                            values[1] = [tileData[y][x][i],i] #last
                    if (values[0][1]-values[1][1]) != 0:
                        tileData[y][x][16] = -math.floor(math.atan((values[0][0]-values[1][0])/(values[0][1]-values[1][1]))*180/math.pi)
                    else:
                        tileData[y][x][16] = 0
                    if abs(values[0][1]-values[1][1]) <= 2 and lAngle != None:
                        tileData[y][x][16] = lAngle
                    elif abs(values[0][1]-values[1][1]) <= 2:
                        if values[0][1] < 8:
                            tileData[y][x][16] = 90
                        else:
                            tileData[y][x][16] = -90
                    if tileData[y][x] != None:
                        lAngle = tileData[y][x][16]
        #print(str(tileData).replace("None","0").replace("'null'","null"))

    ##################################### LEFT #########################################
    #initalize array
    tileData2 = [[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None]]
    if "w" in strings:
        for y in range(0,128):
            x = 0
            while x < 128:
                if img1.getpixel((x,y))[3] != 0:
                    if tileData2[math.floor(x/16)][math.floor(y/16)] == None:
                        tileData2[math.floor(x/16)][math.floor(y/16)] = [-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,0]
                    tileData2[math.floor(x/16)][math.floor(y/16)][y%16] = 16-(x%16)
                    x = 128
                x += 1
        lAngle = -90
        for y in range(0,8):
            for x in range(0,8):
                if tileData2[x][y] != None:
                    values = [[-16,-1],[-16,-1]]
                    for i in range(0,16):
                        if tileData2[x][y][i] != -16:
                            if values[0][0] == -16:
                                values[0] = [tileData2[x][y][i],i]#first
                            values[1] = [tileData2[x][y][i],i] #last
                    if (values[0][1]-values[1][1]) != 0:
                        tileData2[x][y][16] = math.floor(-90+math.atan((values[0][0]-values[1][0])/(values[0][1]-values[1][1]))*180/math.pi)
                    else:
                        tileData2[x][y][16] = -90
                    if abs(values[0][1]-values[1][1]) <= 2:
                        tileData2[x][y][16] = lAngle
                    if tileData2[x][y] != None:
                        lAngle = tileData2[x][y][16]
                
    
    #################################### RIGHT #############################
    #initialize array
    tileData3 = [[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None]]
    if "e" in strings:
        for y in range(0,128):
            x = 127
            while x > 0:
                if img1.getpixel((x,y))[3] != 0:
                    if tileData3[math.floor(x/16)][math.floor(y/16)] == None:
                        tileData3[math.floor(x/16)][math.floor(y/16)] = [-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,0]
                    tileData3[math.floor(x/16)][math.floor(y/16)][y%16] = 16-(x%16)
                    x = 0
                x -= 1
        lAngle = 90
        for y in range(0,8):
            for x in range(0,8):
                if tileData3[x][y] != None:
                    values = [[-16,-1],[-16,-1]]
                    for i in range(0,16):
                        if tileData3[x][y][i] != -16:
                            if values[0][0] == -16:
                                values[0] = [tileData3[x][y][i],i]#first
                            values[1] = [tileData3[x][y][i],i] #last
                    if (values[0][1]-values[1][1]) != 0:
                        tileData3[x][y][16] = math.floor(90+math.atan((values[0][0]-values[1][0])/(values[0][1]-values[1][1]))*180/math.pi)
                    else:
                        tileData3[x][y][16] = 90
                    if abs(values[0][1]-values[1][1]) <= 2:
                        tileData3[x][y][16] = lAngle
                    if tileData3[x][y] != None:
                        lAngle = tileData3[x][y][16]
        #print(str(tileData3).replace("None","0").replace("'null'","null"))

    ############################# BOTTOM ###################################
    tileData4 = [[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None]]
    if "s" in strings:
        for x in range(0,128):
            y = 127
            while y > 0:
                if img1.getpixel((x,y))[3] != 0:
                    if tileData4[math.floor(y/16)][math.floor(x/16)] == None:
                        tileData4[math.floor(y/16)][math.floor(x/16)] = [-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,-16,0]
                    tileData4[math.floor(y/16)][math.floor(x/16)][x%16] = 16-(y%16)
                    y = 0
                y -= 1
        lAngle = 180
        for x in range(0,8):
            for y in range(0,8):
                if tileData4[y][x] != None:
                    values = [[-16,-1],[-16,-1]]
                    for i in range(0,16):
                        if tileData4[y][x][i] != -16:
                            if values[0][0] == -16:
                                values[0] = [tileData4[y][x][i],i]#first
                            values[1] = [tileData4[y][x][i],i] #last
                    if (values[0][1]-values[1][1]) != 0:
                        tileData4[y][x][16] = math.floor(-180-math.atan((values[0][0]-values[1][0])/(values[0][1]-values[1][1]))*180/math.pi)
                    else:
                        tileData4[y][x][16] = 180
                    if abs(values[0][1]-values[1][1]) <= 2:
                        tileData4[y][x][16] = lAngle
                    if tileData4[y][x] != None:
                        lAngle = tileData4[y][x][16]
        #print(str(tileData4).replace("None","0").replace("'null'","null"))

    return "new chunk(newImage(\""+imgName+"\"),"+str(tileData).replace("None","0").replace("'null'","null")+","+str(tileData2).replace("None","0").replace("'null'","null")+","+str(tileData3).replace("None","0").replace("'null'","null")+","+str(tileData4).replace("None","0").replace("'null'","null")+"),"


def maskScan(imgName,maskName):
    return simpleScan(imgName).replace(imgName,maskName)


finalString = "chunks = chunks.concat([\n"
for img in listFile.read().splitlines():
    print(img)
    if img.startswith("%"):#save to file command
        nameChanged = True
        finalString += "]);\n"
        finalFile = open(img[1:],"w")
        finalFile.write(finalString)
        finalString = "chunks = chunks.concat([\n"
    elif img.startswith("//"):
        pass # commented out
    elif img.startswith("#"):#specify sides
        strings = img[1:img.find(">")]
        finalString += str(partScan(img[img.find(">")+1:],strings))+"\n"
    elif img.startswith("s>"):#simple scan
        finalString += str(simpleScan(img[2:]))+"\n"
    elif img.startswith("n>"):#no scan
        finalString += str(noScan(img[2:]))+"\n"
    elif img.startswith("m>"):
        index1 = img.find("||")
        finalString += str(maskScan(img[2:index1],img[index1+2:]))+"\n"
        
