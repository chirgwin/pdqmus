/**
 * Creates an instance of pdqmus.TimeSignature, a tempo notation
 *
 * @constructor
 * @this {pdqmus.Tempo}
 * @param {number} onset Onset time, in seconds
 * @param {number} bpm beats per minute, integer
 * @param {string} text verbal text associated with the tempo marking
 * @param {number} onsetMetric Metric onset, in beats
 */
pdqmus.Tempo = function(onset, bpm, text, onsetMetric)
{
    this.onset = onset;
    this.bpm = bpm;
    this.text = text;
    this.onsetMetric = onsetMetric;
    this.duration = 0;
}

pdqmus.Tempo.prototype = new pdqmus.Notation;

pdqmus.Tempo.prototype.clone = function()
{
    return new pdqmus.Tempo(
                this.onset,
                this.bpm,
                this.text,
                this.onsetMetric
                );
};

