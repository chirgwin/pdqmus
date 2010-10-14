/**
 * Creates an instance of pdqmus.MidiSound,
 * a wrapper object for the pdqmus.Sound representation of a MIDI object 
 *
 * @constructor
 * @this {pdqmus.MidiSound}
 */
pdqmus.MidiSound = function()
{
    this.domRef = document.createElement("embed");
    this.parentRef = document.getElementsByTagName("body")[0];
}

pdqmus.MidiSound.prototype = new pdqmus.Sound;

/*
 * public methods
 */

pdqmus.MidiSound.prototype.play = function()
{
    //recreate a new embed for each play
    //since embed doesn't have play/pause methods
    this.domRef.hidden = "true";
    //this.domRef.id = "midiEmbed" + new Date();
    this.domRef.autoplay = "true";
    this.domRef.autostart = "True";
    this.domRef.loop = "false";
    this.domRef.volume = "100%";
    this.domRef.style.visibility = "hidden";
    this.parentRef.appendChild(this.domRef);
//??    this.domRef.Play();
}

pdqmus.MidiSound.prototype.pause = function()
{
    this.destroy();
}
pdqmus.MidiSound.prototype.destroy = function()
{    
    this.domRef.parentNode.removeChild(this.domRef);
    this.domRef = null;
}
pdqmus.MidiSound.prototype.clone = function ()
{
    return pdqmus.MidiSound.createFromUrl(this.url);
}

/*
 * public static methods
 */
pdqmus.MidiSound.createFromUrl = function(url)
{
    var newMidiSound = new pdqmus.MidiSound();
    newMidiSound.domRef.src = url;
    newMidiSound.domRef.id = pdqmus.Util.guid();
    return newMidiSound;
}
