import os
import tkinter as Tkinter

root = Tkinter.Tk()
L = Tkinter.Listbox(selectmode=Tkinter.SINGLE)
gifsdict = {}

dirpath = '.\\res\\'
for gifname in os.listdir(dirpath):
    if not gifname[0].isdigit(): 
       continue
    gifpath = os.path.join(dirpath, gifname)
    gif = Tkinter.PhotoImage(file=gifpath)
    gifsdict[gifname] = gif
    L.insert(Tkinter.END, gifname)

L.pack()
img = Tkinter.Label()
img.pack()
def list_entry_clicked(*ignore):
    imgname = L.get(L.curselection()[0])
    img.config(image=gifsdict[imgname])
L.bind('<ButtonRelease-1>', list_entry_clicked)
root.mainloop()


"""''''''''''''''''''''''''''''''''''''''''''''''''''''''''
From Kevin Routley (kbroutley at gmail.com)

I have tested with Python 2.7 and 3.5 using Windows 7. There were two bugs in the sample code as presented:
1. The dirpath = '.\' would not work. It needs to be './' or '.\\'
2. The line which starts "img.config" (third from the bottom) needs a leading tab.

The description of the sample is misleading. It reads "Insert image to a list box": this implies images are being put in the list box. Tkinter does not support using images inside a list box. The description might be changed to: "View image by selecting name from list." [I was trying the sample because I was seeking to use images in a list box. Research indicates a different widget set will be necessary, e.g. tix or BWidgets.]


import os

try:
  import Tkinter
except ImportError:
  import tkinter as Tkinter

root = Tkinter.Tk()
L = Tkinter.Listbox(selectmode=Tkinter.SINGLE)
gifsdict = {}

dirpath = '.\\'
for gifname in os.listdir(dirpath):
    if not gifname[0].isdigit(): 
       continue
    gifpath = os.path.join(dirpath, gifname)
    gif = Tkinter.PhotoImage(file=gifpath)
    gifsdict[gifname] = gif
    L.insert(Tkinter.END, gifname)

L.pack()
img = Tkinter.Label()
img.pack()

def list_entry_clicked(*ignore):
    imgname = L.get(L.curselection()[0])
    img.config(image=gifsdict[imgname])

L.bind('<ButtonRelease-1>', list_entry_clicked)

root.mainloop()
"""