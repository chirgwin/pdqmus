/**
 * Creates an instance of pdqmus.Barline
 * An barline musical notation. 
 *
 * @constructor
 * @this {pdqmus.Barline}
 * @param {number} onset Onset time, in seconds
 * @param {string} type of barline, mimics MusicXML
 * @param {number} onsetMetric Metric onset, in beats
 */

pdqmus.Barline = function(onset, type, onsetMetric)
{
    this.onset = onset;
    this.type = type || pdqmus.Barline.TYPE_NORMAL;
    this.onsetMetric = onsetMetric;
    this.duration = 0;
}

pdqmus.Barline.prototype = new pdqmus.Notation;

pdqmus.Barline.prototype.clone = function()
{
    return new pdqmus.Barline(
                    this.onset,
                    this.type,
                    this.onsetMetric
                );
};

pdqmus.Barline.TYPE_NORMAL = "normal";
