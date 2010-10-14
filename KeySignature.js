/**
 * Creates an instance of pdqmus.KeySignature
 * An key signature musical notation. 
 *
 * @constructor
 * @this {pdqmus.KeySignature}
 * @param {number} onset Onset time, in seconds
 * @param {number} fifths number of clicks on the circle of fifths in the key signature, e.g. 1 is 1 sharp, -1 is 1 flat 
 * @param {string} key signature mode, e.g. pdqmus.KeySignature.MODE_MAJOR
 * @param {number} onsetMetric Metric onset, in beats
 */


pdqmus.KeySignature = function(onset, fifths, mode, onsetMetric)
{
    this.onset = onset;
    this.fifths = fifths;
    this.mode = mode;
    this.duration = 0;
}

pdqmus.KeySignature.prototype = new pdqmus.Notation;

pdqmus.KeySignature.prototype.clone = function()
{
    return new pdqmus.KeySignature(
        this.onset,
        this.fifths,
        this.mode,
        this.onsetMetric
        );
};

pdqmus.KeySignature.MODE_MAJOR = "major";
pdqmus.KeySignature.MODE_MINOR = "minor";