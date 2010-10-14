/**
 * Creates an instance of pdqmus.Sequencer,
 * A sequencer is a series of sounds that can be rendered as a grid
 *
 * @constructor
 * @this {pdqmus.Sequencer}
 * @param {Array} sounds An array of pdqmus.Sound objects
 * @param {number} tempo beats per minute, integer
 * @param {string} meterType type of meter, e.g. simple (pdqmus.Sequencer.SIMPLE_METER) or compound
 * @param {number} numBigBeats number of big beats, defaults to 4
 */

pdqmus.Sequencer = function(sounds, tempo, meterType, numBigBeats)
{
    const DEFAULT_TEMPO = 120;
    //TODO: make this an array of actual sample objects, instead of wav files
    
    const DEFAULT_METER_TYPE = pdqmus.Sequencer.SIMPLE_METER;
    
    const DEFAULT_NUM_BIG_BEATS = 4;
    
    var _sounds = sounds;
    //BPM
    //TODO: change tempo on existing instance?
    this.tempo = tempo || DEFAULT_TEMPO;
    this.meterType = meterType || DEFAULT_METER_TYPE;
    this.numBigBeats = numBigBeats || DEFAULT_NUM_BIG_BEATS;
    
    //milliseconds per note division
    var loopDuration = 60000 / this.tempo  / this.meterType;

    //beats by voice grid    
    var numVoices = _sounds.length;
    var numBeats = this.numBigBeats * this.meterType;

    var currentBeatIdx = 0;
    
    this.isPlaying = false;
    this.isLooping = true;
    var _loopTimeout;
    //TODO: try to get this to work
    this.allowSampleOverlap = false;
    
    var self = this;
    function init()
    {
        //set up sounds
        var _sounds2d = [];
        for (var i = 0; i < numVoices; i++) 
        {
            _sounds2d[i] = [];
            _sounds2d[i][0] = _sounds[i];
            //clone sounds into each beat slot to allow overlap
            if (self.allowSampleOverlap) 
            {
                for (var j = 1; j < numBeats; j++) 
                {
                    _sounds2d[i][j] = _sounds[i].clone();
                    console.log(i, j, _sounds2d[i][j].id)
                }
            }
        }    
        _sounds = _sounds2d;        
    }
    //loop    
    this.loop = function()
    {    
    
        if (currentBeatIdx >= numBeats)
        {
            currentBeatIdx = 0;
            if (!self.isLooping)
            {
                return;                
            }
        }        

        for (var i = 0; i < numVoices; i ++)
        {
            for (var j = 0; j < numBeats; j ++)
            {
                var element = document.getElementById(i + "_" + j);
                //TODO: keep scroll in view
                //element.scrollIntoView();          
                //console.log(Util.getObjectPosition(element).x);
                
                element.className = "beatbox";
                if (element.isDownbeat)
                {
                    element.className += " downbeat";
                }
                if (element.beatOn)
                {
                    element.className += " beatOn";
                }
                else
                {
                    element.className += " beatOff";                
                }
                if (j == currentBeatIdx)
                {
                    element.className += " beatHighlighted";                
                }
            }
        }

        
        for (var i = 0; i < _sounds.length; i++)
        {
            if (document.getElementById(i + "_" + currentBeatIdx).beatOn)
            {
                if (!self.allowSampleOverlap) 
                {
                    //? _sounds[i][0].pause()
                    _sounds[i][0].play();
                }
                else
                {
                    _sounds[i][currentBeatIdx].play();                    
                }
            }
        }

        currentBeatIdx ++;

        if (self.isPlaying)
        {
            _loopTimeout = setTimeout(self.loop, loopDuration);
        }
        
    }


    function handleMouseDown(event)
    {
        event.target.beatOn = !event.target.beatOn;
        
        if (event.target.beatOn)
        {
            event.target.className = "beatbox beatOn";
        }
        else
        {
            event.target.className = "beatbox beatOff";            
        }
        
        if (event.target.isDownbeat)
        {
            event.target.className += " downbeat";            
        }
        
    }
    
    this.render = function(container)
    {        
        for (var i = 0; i < numVoices; i ++)
        {
            var row = document.createElement("div");
            for (var j = 0; j < numBeats; j ++)
            {
                var inputRef = document.createElement("div");
                inputRef.setAttribute("id", i + "_" + j); 
                inputRef.beatOn = false;
                
                inputRef.addEventListener("mousedown", handleMouseDown, "true");               
                if (j > 0 && j % this.meterType == 0)
                {            
                    inputRef.isDownbeat = true;
                    inputRef.className = "beatbox beatOff downbeat";
                }
                else
                {
                    inputRef.className = "beatbox beatOff";                
                }
                row.appendChild(inputRef);
                row.className = "row";
            }
            container.appendChild(row);
        }  
    }
    
    this.pauseAllSounds = function()
    {    
       //this.sounds
    }
    this.play = function()
    {
        this.isPlaying = true;
        self.loop();
    }

    this.pause = function()
    {
        self.isPlaying = false;
        if (_loopTimeout)
        {
            clearTimeout(_loopTimeout);
        }
        self.pauseAllSounds();
    }

    init();
}

//convenience method for lazy drawing
//TODO: refactor render method to return canvas
pdqmus.Sequencer.prototype.draw = function()
{
    var sDiv = document.createElement("div");
    sDiv.className = "sequencer";
    this.render(sDiv);
    document.body.appendChild(sDiv);
}
pdqmus.Sequencer.SIMPLE_METER = 4;
pdqmus.Sequencer.COMPOUND_METER = 3;
pdqmus.Sequencer.DUPLE_METER = 2;
pdqmus.Sequencer.SINGLE_METER = 1;

