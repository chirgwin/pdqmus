/**
 * Creates an instance of pdqmus.Sound, an abstract sound object
 *
 * @constructor
 * @this {pdqmus.Sound}
 */
pdqmus.Sound = function()
{
    this.id;
}

pdqmus.Sound.prototype.play = function()
{
    throw "not implemented";
}

pdqmus.Sound.prototype.pause = function()
{
    throw "not implemented";
}

pdqmus.Sound.prototype.clone = function()
{
    throw "not implemented";
}
