# Motobug Engine - A 360&deg; platforming engine for the modern web

This is a 360&deg; ("sonic-style") platformer engine completely written in JavaScript and HTML5 allowing you to develop this style of platforming games for the Open Web.

Example at [https://coderman64.github.io/motobug-engine/](https://coderman64.github.io/motobug-engine/)

## recent updates:

Jan 16, 2021
- Merged updates made to the engine for the SAGE 2020 game Sonic EXP back in to the main Motobug branch. This includes many new and exciting features such as:
    - A title screen, with animated logos that play beforehand (this is simply a .mp4 video file)
    - Save games
    - A save-select screen
    - New items, including a level-finished signpost, and special stage ring
    - polish with some new sprites, sounds, and animations
    - _and much more!_

## features

* 360&deg; Genesis-style Sonic physics.
* Sound effects via HTML5 audio
* Controller support (through the JS Gamepad API) (beta)
* touch controls support (beta)
* full debug interface (press i)
    * press L to change level
    * hold v and use arrow keys to view around the level
    * change character by pressing p (works outside of debug mode)
    * slow down the game a bit by holding c
    * tap m to enable motion blur (experimental)

## Why "Motobug"?

If you can't tell, this engine was highly insipred by the classic Sonic the Hedgehog games. In these games, there was an easy enemy called a "motobug." I thought this fit the engine pretty well, as it allowed you to "motor" along, and (at least at the time) had a lot of "bugs."

## How is this different from other "sonic-style" engines?

A number of different engines exist that do quite similar things to Motobug. The most notable of these (off the top of my head) is the Sonic Worlds engine. This is a quite fully-featured and well-tested engine, and is much better than Motobug in most cases. However, to fully utilize this engine, you need to install Multimedia Fusion 2 (MMF2), which is commercial software.

Motobug, while occasionally more buggy than Sonic Worlds, depends only on the open HTML5 & JavaScript standards, which means it can be played in any modern browser (including on mobile devices, and on the Xbox One/Series).

There are also some other implementations of sonic physics written in JS (like [this](http://oursonic.org)), but they seem to be incomplete or massively buggy. Frameworks also exist that are layered on top of general-purpose game engines that can export to HTML5.

Another thing that differentiates Motobug is that it has a (beta) level designer called [Motobug Studio](https://github.com/coderman64/motobug-engine-designer). While it _is_ still in beta, it should be stable enough to start making levels with, if you so desire. 

## how does it work?

This engine is based loosely on the original engine for the Genesis sonic games. That being said, it does have its own quirks and differences. I may compile a list of these later on, but for the most part, just know that it isn't one-to-one quite yet.

## Where can I get started?

As previously mentioned, there is a level designer called [Motobug Studio](https://github.com/coderman64/motobug-engine-designer) which should make it easy to desgin and test stages for Motobug. I hope to compile a guide for getting started with this later on, but for now, you should be able to figure out most things just by poking about the interface. Hopefully.

## Media and Resources

Since I am not the best artist, I have used art and graphics from SEGA as well as various other fan artists on the internet:
* Sonic and related sprites are from the ModGen project
* Shadow and related sprites are from Cylent Nite
* Silver and relates sprites are from the S-Factor, a hack by Aquaslash
* Tiles for the first level are modified from various official sonic games, and thus belong to SEGA. Those for Crystal Geyser are original and belong to me. You can use them under a CC-BY-SA license. 
* the beach background, springs, rings, and spikes were made by me! (you can use them under the CC-BY-SA as well)
* sound effects and music were also made by me! (you can use these too, just give credit to Coderman64)
* if there are any sprites here that I didn't credit, they are likely from spriters-resource.com/ and originally came from original sonic games. Thus, they are probably &copy; SEGA.

## DISCLAIMER

This project is an UNOFFICIAL fan project, and does not imply any endorsement or connection to SEGA, Sonic Team, or any relevant owners of Sonic-related IP. This project exists in the good graces (or perhaps ignorance) of SEGA, and may be taken down without notice by the request of SEGA, or any owners of relevant IP.
