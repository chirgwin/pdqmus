/**
 * Creates an instance of pdqmus.AudioSequence.
 *
 * @constructor
 * @this {pdqmus.AudioSequence}
 * @param notes {Array} a sequence of pdqmus.Note objects
 * @param oscillatorType {string} the type of oscillator to synthesize
 * @param envelope {string} the type of envelope shape
 * @param includePath {string} path to include for WebWorker script, should be relative to enclosing HTML
 */

pdqmus.AudioSequence = function(notes, oscillatorType, envelope, includePath)
{
    //milliseconds
    const INTERVAL = 10;
    
    var playhead = 0;
    
    var playLoop;
    var startTime;
    var buffer = [];
    var lookaheadSeconds = 2;

    var _notes = notes.clone();
    var _playbackNotes;
    var _oscillatorType = oscillatorType;
    var _envelope = envelope || null;
    var bufferSpent = false;
    var bufferStarted = false;
    var allNotesBuffered = false;
    
    var _aggregateWave = new pdqmus.Wave();
    var _aggregateWaveNeedsUpdate = true;
    var _startCallback = null;
    var _finishCallback = null;
    var _includePath = includePath || pdqmus.AudioSequence.DEFAULT_WEBWORKER_INCLUDE_PATH;

    var self = this;
    var waveRenderWorker = null;
    /* set up the web worker */
    function setUpWebWorker()
    {
        if (!!window.Worker) 
        {
            waveRenderWorker = new Worker(_includePath + "/wave_render_worker.js");
            waveRenderWorker.onmessage = function(event) 
            {  
                var renderMessage = event.data;
                buffer.push(renderMessage);    
            };  
            
            waveRenderWorker.onerror = function(error) 
            {  
                //console.log("Worker error: " + error.message + "\n");
                throw error;  
            };    
        }    
    }
    
    /* make a single wave "file" from all notes */
    function aggregateWave()
    {
        for (var i = 0; i < _notes.length; i++) 
        {
            var note = _notes[i];
            //TODO: add overlapping notes' samples 
            //otherwise, just append them
            _aggregateWave.render(pdqmus.Note.frequencyFromMidiNote(note.noteNum), 
                                  note.duration, 
                                  pdqmus.Note.midiVelocityToAmplitude(note.velocity), 
                                  oscillatorType);
            if (envelope)
            {
                _aggregateWave.envelope(_envelope);
            }
        }
        _aggregateWaveNeedsUpdate = false;
    }            
    
    this.drawWaveform = function()
    {
        return self.getAggregateWave().draw();
    }
    
    this.getDataUrl = function()
    {
        return self.getAggregateWave().getDataUrl();
    }

    this.getAggregateWave = function()
    {
        if (_aggregateWaveNeedsUpdate)
        {
            aggregateWave();
        }
        return _aggregateWave;        
    }
    this.pause = function()
    {
        throw ("unimplemented");        
    }
    
    this.stop = function()
    {
        if (waveRenderWorker) 
        {
            waveRenderWorker.terminate();
        }
        clearTimeout(playLoop);
        cleanUp();
    }
    
    this.play = function(asynchronous)
    {
        //quick and dirty syncronous playback using aggregate wave
        if (!asynchronous)
        {
            pdqmus.Sample.createFromUrl(self.getDataUrl()).play();
            return;
        }
        
        //make sure web worker is ready to go for asynch playback
        if (!waveRenderWorker)
        {
            setUpWebWorker();
        }
        //asynchronous playback
        startTime = new Date(); 
        _playbackNotes = _notes.clone();
        _playbackNotes.sort(pdqmus.Notation.sortByOnset);
        setTimeout(loop, 1);
    }
    
    
    function playNote(renderMessage)
    {
        pdqmus.Sample.createFromUrl(renderMessage.audioDataUrl).play();    
    }
    
    this.setStartCallback = function(callback)
    {
        _startCallback = callback;
        
    }

    this.setFinishCallback = function(callback)
    {
        _finishCallback = callback;        
    }

    function loop()
    {
        var playhead = (new Date().getTime() - startTime) / 1000;

    
        if (buffer.length > 0 && (buffer[0].notes[0].onset <= playhead - pdqmus.AudioSequence.BUFFER_DELAY)) 
        {
            if (!bufferStarted) 
            {
                if (_startCallback) 
                {
                    _startCallback();
                }
                bufferStarted = true;                
            }
            if (buffer.length <= 1 && allNotesBuffered)
            {
                bufferSpent = true;
            }
            setTimeout(playNote, 1, buffer.shift());
        }
        
        if (_playbackNotes.length > 0 && _playbackNotes[0].onset <= playhead + lookaheadSeconds) 
        {
            var note = _playbackNotes.shift();
            var renderNotes = [note];
            for (var i = 1; i < _playbackNotes.length; i++)
            {
                if (_playbackNotes[i].onset == note.onset)
                {
                    renderNotes.push(_playbackNotes.shift());
                }
                else if (_playbackNotes[i].onset > note.onset)
                {
                    break;
                }
            }
            var renderMessage = new pdqmus.RenderWaveMessage([note], _oscillatorType, _envelope);
            waveRenderWorker.postMessage(renderMessage);
        }
        
        if (_playbackNotes.length <= 0)
        {
            allNotesBuffered = true;
        }

        if (!bufferSpent) 
        {
            playLoop = setTimeout(loop, INTERVAL);
        }    
        else
        {
            cleanUp();
        }    
    }
    
    function cleanUp()
    {
        if (_finishCallback) 
        {
            _finishCallback();
        }
    }
}

//seconds
pdqmus.AudioSequence.BUFFER_DELAY = 0.3;

//ensure webworker file is loaded
pdqmus.AudioSequence.DEFAULT_WEBWORKER_INCLUDE_PATH = "/dist";