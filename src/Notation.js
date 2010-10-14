/**
 * Creates an instance of pdqmus.Notation, an abstract musical notation object
 *
 * @constructor
 * @this {pdqmus.Notation}
 * @param {number} onset Onset time, in seconds
 * @param {number} duration Duration time, in seconds
 * @param {number} onsetMetric Metric onset, in beats
 * @param {number} durationMetric Metric duration, in beats, e.g. 1.0 is a quarter note
 */
pdqmus.Notation = function(onset, duration, onsetMetric, durationMetric)
{
    this.onset = onset;
    this.duration = duration;
    this.onsetMetric = onsetMetric;
    this.durationMetric = durationMetric;
};

pdqmus.Notation.prototype.durationFromMetric = function(tempo)
{
    this.duration = 60 / tempo * this.durationMetric;
};

pdqmus.Notation.prototype.onsetFromMetric = function(tempo)
{
    this.onset = 60 / tempo * this.onsetMetric;
};

pdqmus.Notation.prototype.convertFromMetric = function(tempo)
{
    this.durationFromMetric(tempo);
    this.onsetFromMetric(tempo);
};

pdqmus.Notation.prototype.getNearestNotelistDur = function(bpm)
{
    if (!bpm)
    {
        bpm = 60;
    }
    //TODO: handle dots
    var nearestDurationIdx = 0;
    var nearestDistance = 9999;
    for (var i = 0; i < pdqmus.Note.METRIC_DURATIONS.length; i++)
    {
        var adjustedDuration = this.duration * (bpm / 60);
        var distance = Math.abs(pdqmus.Note.METRIC_DURATIONS[i] - adjustedDuration);
        
        if (distance < nearestDistance)
        {
            nearestDistance = distance;
            nearestDurationIdx = i;            
        }
    }  
    
    return nearestDurationIdx;
};

pdqmus.Notation.sortByDurationDesc = function(a, b)
{
    if(a.duration > b.duration)
    {
        return -1;
    }
    else if(a.duration < b.duration)
    {
        return 1;
    }
    return 0;
};

pdqmus.Notation.sortByOnset = function(a, b)
{
    if(a.onset < b.onset )
    {
        return -1;
    }
    else if( a.onset > b.onset)
    {
        return 1;
    }
    return 0;
};


/*
 * generate a Nightingale notelist from a series of notes
 * assumes single staff, single part, single voice
 */
pdqmus.Notation.generateNotelist = function(notes, bpm)
{
    var time = 0;
    if (!bpm)
    {
        bpm = 60;
    }
    var notelist = "%%Notelist-V2 file='exported from pdqm.us'  partstaves=1 0 startmeas=1" + pdqmus.Util.NEWLINE
    + "C stf=1 type=3" + pdqmus.Util.NEWLINE  + "K stf=1 KS=0 #" + pdqmus.Util.NEWLINE
    + "M stf=1 '' q=" + bpm + pdqmus.Util.NEWLINE;
    
    for (var i = 0; i < notes.length; i++)
    {    
        var note = notes[i];
        var duration = Math.round(note.duration * pdqmus.Note.NOTELIST_TICKS_PER_QUARTER);
        notelist += "N t=" + time + " v=1 npt=1 stf=1 dur=" + note.getNearestNotelistDur(bpm) 
        + " dots=0 nn=" + note.noteNum
        + " acc=0 eAcc=0 pDur=" + (duration * 0.9)
        +  " vel=75 ...... appear=1" + pdqmus.Util.NEWLINE;        
        time += duration;
    }
    
    //tack a barline on the end
    notelist +=  "/ t=" + time + " type=1" + pdqmus.Util.NEWLINE;
    
    return notelist;    
};

//notelist time factors
pdqmus.Notation.NOTELIST_TICKS_PER_QUARTER = 480;
//                        0         1         2         3     4          5        6       7        8      9       
pdqmus.Notation.NOTELIST_DURATIONS = ["longa", "breve", "whole", "half", "quarter", "eighth", "16th", "32nd", "64th", "128th"];
pdqmus.Notation.METRIC_DURATIONS =   [16.0,     8.0,     4.0,    2.0,    1.0,       0.5,     0.25,   0.125,  0.0625, 0.03125];

