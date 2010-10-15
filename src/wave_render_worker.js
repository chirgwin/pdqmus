importScripts("pdqmus.min.js");
/*
 * Receives and handles a wave render WebWorker event.
 * @param {Object} event WebWorker event object
 */
onmessage = function(event) 
{  
    var renderMessage = event.data;
    var notes = renderMessage.notes;
    
    //sort notes descending by duration
    if (notes.length > 0) 
    {
        notes.sort(pdqmus.Notation.sortByDurationDesc);
    }
    
    //create wave and render first note
    var note = notes[0];
       
    var wave = new pdqmus.Wave();
    wave.render(pdqmus.Note.frequencyFromMidiNote(note.noteNum),
                 note.duration, 
                 pdqmus.Note.midiVelocityToAmplitude(note.velocity),
                 renderMessage.oscillatorType);
                 
    //envelope
    if (renderMessage.envelope)
    {
        wave.envelope(renderMessage.envelope);
    }
    
    //TODO: add filter support
                 
    //TODO: add other notes  
    for (var i = 1; i < notes.length; i++)
    {
        var note = notes[i];
        var addWave = new pdqmus.Wave();
        addWave.render(pdqmus.Note.frequencyFromMidiNote(note.noteNum),
                     note.duration, 
                     pdqmus.Note.midiVelocityToAmplitude(note.velocity),
                     renderMessage.oscillatorType);
        wave.addSamples(addWave.getData());
    }
    renderMessage.audioData = wave.getData();
    renderMessage.audioDataUrl = wave.getDataUrl(true);
    postMessage(renderMessage);
};  
