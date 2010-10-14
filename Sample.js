/**
 * Creates an instance of pdqmus.Sample,
 * A sample is an audio sample represented in the DOM.
 *
 * @constructor
 * @this {pdqmus.Sample}
 */
pdqmus.Sample = function()
{
    this.domRef;    
    this.domRef = document.createElement("audio");
    this.domRef.preload = true;
}

pdqmus.Sample.prototype = new pdqmus.Sound;

/*
 * public methods
 */
pdqmus.Sample.prototype.play = function()
{
    this.domRef.play();
}

pdqmus.Sample.prototype.pause = function()
{
    this.domRef.pause();
}

pdqmus.Sample.prototype.clone = function ()
{
    return pdqmus.Sample.createFromUrl(this.url);
}

/*
 * public static methods
 */
pdqmus.Sample.createFromUrl = function(url)
{
    var newSample = new pdqmus.Sample();
    newSample.domRef.src = url;
    newSample.domRef.id = newSample.id = pdqmus.Util.guid();
    return newSample;
}
