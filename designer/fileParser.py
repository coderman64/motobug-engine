import tiles

class tileParser:
    def __init__(self,fileName):
        self.file = open(fileName).read()
        self.tiles = []
        for i in self.file.splitlines():
            if(i.find("||") > -1):
                self.tiles.append(tiles.tile("../"+i[i.find("||")+2:]))
            else:
                self.tiles.append(tiles.tile("../"+i[i.find(">")+1:]))
    def getTiles(self):
        return self.tiles

def export(level,name):
    final = "level = [[],"
    for y in range(len(level)):
        final += "["
        for x in range(len(level[y])):
            if type(level[y][x]) == int:
                final += str(level[y][x])+","
            else:
                final += "["
                for i in level[y][x]:
                    final += str(i)+","
                final = final[:-1]+"],"
                print(final[final.rfind("["):])

        final = final[:-1]+"],"
    final += """];backgroundMusic.src = "MGH-A1.ogg";backgroundMusic.play();cBack = 0;chunks = [];thisScript = document.createElement("script");thisScript.src = "MGHZtiles.js";document.body.appendChild(thisScript);delete thisScript;"""
    fFile = open(name,'w')
    fFile.write(final)

if __name__ == "__main__":
    tp = tileParser("projects/MGHz/tiles.txt")
