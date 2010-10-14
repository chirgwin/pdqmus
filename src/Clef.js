/**
 * Creates an instance of pdqmus.Clef
 * An clef musical notation. 
 *
 * @constructor
 * @this {pdqmus.Clef}
 * @param {number} onset Onset time, in seconds
 * @param {string} sign of clef, e.g. "G", mimics MusicXML
 * @param {line} line on which the sign is placed, mimics MusicXML
 * @param {number} onsetMetric Metric onset, in beats
 */

pdqmus.Clef = function(onset, sign, line, onsetMetric)
{
    this.onset = onset;
    this.sign = sign;
    this.line = line;
    this.onsetMetric = onsetMetric;
    this.duration = 0;
}

pdqmus.Clef.prototype = new pdqmus.Notation;

pdqmus.Clef.prototype.clone = function()
{
    return new pdqmus.Clef(
                this.onset,
                this.sign,
                this.line,
                this.onsetMetric
                );
};
