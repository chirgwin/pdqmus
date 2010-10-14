/**
 * Creates an instance of pdqmus.TimeSignature, an abstract time signature object
 *
 * @constructor
 * @this {pdqmus.TimeSignature}
 * @param onset {number} Onset time, in seconds
 * @param numerator {number} time signature numerator, integer
 * @param denominator {number} time signature denominator, integer
 * @param onsetMetric {number} Metric onset, in beats
 */
pdqmus.TimeSignature = function(onset, numerator, denominator, onsetMetric)
{
    this.onset = onset;
    this.numerator = numerator;
    this.denominator = denominator;
    this.onsetMetric = onsetMetric;
    this.duration = 0;
}

pdqmus.TimeSignature.prototype = new pdqmus.Notation;


pdqmus.TimeSignature.prototype.clone = function()
{
    return new pdqmus.KeySignature(
        this.onset,
        this.numerator,
        this.denominator,
        this.onsetMetric
        );
};

