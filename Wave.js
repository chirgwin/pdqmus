/**
 * Creates an instance of pdqmus.Wave.
 * Parts of this code (namely filter methods) based heavily
 * on Steven Wittens' JS Audio Synth:
 * http://acko.net/files/audiosynth/index.html
 * @constructor
 * @this {Wave}
 */

pdqmus.Wave = function()
{
    const RIFF_CHUNK_ID = "RIFF";
    const HEADER_CHUNK_SIZE = 36;
    const WAVE_TYPE = "WAVE";
    const FORMAT_CHUNK = "fmt ";
    const DATA_CHUNK = "data";
    const UNCOMPRESSED_FORMAT = 1;
    const SUBCHUNK_PCM_SIZE = 16;
    const BYTE_LENGTH = 8;
    const CHANNELS_MONO = 1;
    const CHANNELS_STEREO = 2;
    
    const DEFAULT_SAMPLE_RATE = 22050;
    const DEFAULT_BITS_PER_SAMPLE = 8;
    const MIME_TYPE = "audio/wav";
    const DEFAULT_AMPLITUDE = 1.0;
    const DEFAULT_DURATION = 1.0;
    
    //16 bit is -32768 to 32767, 2's complement 
    const TWOS_COMPLEMENT = Math.pow(2, DEFAULT_SAMPLE_RATE); 
    const SCALE = Math.pow(2, DEFAULT_SAMPLE_RATE - 1) - 1;
    
    var _numChannels = CHANNELS_MONO;
    var _sampleRate = DEFAULT_SAMPLE_RATE;
    var _bitsPerSample = DEFAULT_BITS_PER_SAMPLE;
    var _header = "";
    var _data = [];
    var _byteRate = 0;
    var _blockAlign = 0;
    var _numSamples = 0;
    var _cycle = [];
    
    var VISUAL_RENDER_DEFAULT_HEIGHT = 100;
    var VISUAL_RENDER_DEFAULT_WIDTH = 100;
    
    function init()
    {
        //setHeader();
    }

    function setHeader()
    {
        _byteRate = _sampleRate * _numChannels * _bitsPerSample / BYTE_LENGTH;
        _blockAlign = _numChannels * _bitsPerSample / BYTE_LENGTH;
        _header = 
        RIFF_CHUNK_ID +
        pdqmus.Util.strFromDword(_data.length + HEADER_CHUNK_SIZE) +
        WAVE_TYPE +
        FORMAT_CHUNK +
        pdqmus.Util.strFromDword(SUBCHUNK_PCM_SIZE) +
        pdqmus.Util.strFromWord(UNCOMPRESSED_FORMAT) +
        pdqmus.Util.strFromWord(_numChannels) +
        pdqmus.Util.strFromDword(_sampleRate) +
        pdqmus.Util.strFromDword(_byteRate) +
        pdqmus.Util.strFromWord(_blockAlign) +
        pdqmus.Util.strFromWord(_bitsPerSample) +
        DATA_CHUNK +
        pdqmus.Util.strFromDword(_data.length * _numChannels * _bitsPerSample / BYTE_LENGTH);
    }

    /**
     * Clears out sample data.
     */

    this.clearData = function()
    {
        _data = [];
    }

    /**
     * Sets the sample datas
     *
     * @param {array} data The sample data, an array of floating point numbers from -1.0 to 1.0
     */
    
    this.setData = function(data)
    {
        _data = data;
        setHeader();
    }
    
    /**
     * Populates the a single cycle with sample data.
     *
     * @param {array} cycle The sample data, an array of floating point numbers from -1.0 to 1.0
     */
    this.setCycle = function(cycle)
    {
        _cycle = cycle;        
    }

    /**
     * Renders sample data using an oscillator.
     * @this {Wave}
     * @param {number} frequency Frequency, in Hertz.
     * @param {number} duration Duration, in seconds.
     * @param {number} amplitude from 0 to 1.0
     * @param {string} oscillatorType type of osciallator, e.g. pdqmus.Wave.OSC_SINE
     */    
    this.render = function(frequency, duration, amplitude, oscillatorType)
    {
        if (!duration) 
        {
            duration = DEFAULT_DURATION;
        }

        if (!amplitude) 
        {
            amplitude = DEFAULT_AMPLITUDE;
        }

        if (!oscillatorType) 
        {
            oscillatorType = pdqmus.Wave.OSC_DEFAULT;
        }
                
        //scale values
        var period = 1 / frequency;
        var numSamples = Math.round(period * _sampleRate);
        if (!(pdqmus.Wave.PERIODIC_OSCILLATORS.indexOf(oscillatorType) >= 0))
        {
            numSamples *= (duration * frequency);
        }        
        var cycle = [];
        switch (oscillatorType) 
        {
            case pdqmus.Wave.OSC_TRIANGLE:
                cycle = oscillateTriangle(frequency, numSamples);
                break;
            case pdqmus.Wave.OSC_SINE:
                cycle = oscillateSine(frequency, numSamples);
                break;
            case pdqmus.Wave.OSC_SILENCE:
                cycle = oscillateSilence(frequency, numSamples);
                break;
            case pdqmus.Wave.OSC_NOISE:
                cycle = oscillateNoise(frequency, numSamples);
                break;
            case pdqmus.Wave.OSC_SQUARE:
                cycle = oscillateSquare(frequency, numSamples);
                break;
            case pdqmus.Wave.OSC_SAWTOOTH:
                cycle = oscillateSawtooth(frequency, numSamples);
                break
            case pdqmus.Wave.OSC_CUSTOM:
                if (_cycle.length <= 0)
                {
                    throw ("need cycle data for custom oscillator");
                }
        }
        
        //scale
        if (amplitude != 1.0)
        {
            for (var i = 0; i < cycle.length; i++) 
            {
                cycle[i] *= amplitude;
            }        
        }
        
        if (pdqmus.Wave.PERIODIC_OSCILLATORS.indexOf(oscillatorType) >= 0) 
        {
            //fill up duration
            for (var i = 0; i < Math.round(duration * frequency); i++) 
            {
                //double for mono?
                _data = _data.concat(cycle);
            }
        }
        else if (oscillatorType == pdqmus.Wave.OSC_CUSTOM) 
        {
            //TODO: fix this
            for (var i = 0; i < Math.round(numSamples / _cycle.length); i++) 
            {
                _data = _data.concat(_cycle);            
            }
            //console.log(_data);
        }
        else
        {
            _data = _data.concat(cycle);
        }
        setHeader();
        
        _cycle = cycle;
    }
    

    //returns one cycle of a sine wave at a given frequency 
    function oscillateSine(frequency, numSamples)
    {
        var cycle = [];
        for (var i = 0; i < numSamples; i++) 
        {
            cycle.push(Math.sin(i/_sampleRate * 2 * Math.PI * frequency));
        }
        return cycle;
    }
    
    function oscillateSquare(frequency, numSamples)
    {
        var cycle = [];
        for (var i = 0; i < numSamples; i++) {
            cycle.push(Math.floor((i / _sampleRate * 2) / (1 / frequency) & 1) ? -1 : 1);
        }
        return cycle;
    }
    
    function oscillateTriangle(frequency, numSamples)
    {
        var cycle = [];
        for (var i = 0; i < numSamples; i++) 
        {        
            cycle.push((Math.abs(( (i / _sampleRate) % (1 / frequency) * 2) * frequency - 1) - 0.5) * 2);
        }
        return cycle;
    }

    function oscillateSilence(frequency, numSamples)
    {
        var cycle = [];
        for (var i = 0; i < numSamples; i++) {
            cycle.push(0);
        }
        return cycle;
    }

    function oscillateNoise(frequency, numSamples)
    {
        var cycle = [];
        for (var i = 0; i < numSamples; i++) 
        {
            cycle.push((0.5 - Math.random()) * 2);
        }
        return cycle;
    }
    

    function oscillateSawtooth(frequency, numSamples)
    {
        var cycle = [];
        for (var i = 0; i < numSamples; i++) 
        {        
            cycle.push(((i / _sampleRate) % (1 / frequency ) * 2 ) * frequency - 1);
        }
        return cycle;
    }

    this.getDataUrl = function(useBase64Lib)
    {
        if (useBase64Lib) 
        {
            return "data:" + MIME_TYPE + ";base64," + Base64.encode(_header + renderData());
        }
        else //use native  
        {
            return "data:" + MIME_TYPE + ";base64," + btoa(_header + renderData());
        }
    }

    this.getData = function()
    {
        return _data;
    }
    function renderData()
    {
        var data = "";
        switch (_bitsPerSample)
        {
            case 8:
                for (var i = 0; i < _data.length; i++) 
                {
                    data += String.fromCharCode(Math.round(Math.min(1, Math.max(-1, _data[i])) * 127 + 127));
                }
                break;
            case 16:
                for (var i = 0; i < _data.length; i++) 
                {
                    var sample = Math.round(Math.min(1, Math.max(-1, _data[i])) * 32767);
                    if (sample < 0) 
                    {
                        sample += TWOS_COMPLEMENT;
                    }  
                    data += sample;          
                }
        }    
        return data;    
    }    

    
    this.renderVisual = function(width, height, type, oneCycle, color)
    {
        if (!type) 
        {
            type = pdqmus.Wave.VISUAL_TYPE_DEFAULT;
        }
        if (!width)
        {
            width = VISUAL_RENDER_DEFAULT_WIDTH;
        }
        if (!height)
        {
            height = VISUAL_RENDER_DEFAULT_HEIGHT;
        }
        
        var data;
        if (oneCycle)
        {
            data = _cycle;
        }
        else
        {
            data = _data;            
        }
        //console.log(data);
        switch (type)
        {
            case pdqmus.Wave.VISUAL_TYPE_WAVEFORM:          
                var canvas = document.createElement("canvas");
                canvas.id = pdqmus.Util.guid();
                canvas.height = height;
                canvas.width = width;
                var context = canvas.getContext("2d");
                var dataWidth = width / data.length;
                var x = 0;
                var halfHeight = height / 2;
                if (color) 
                {
                    context.strokeStyle = color;
                }
                else 
                {
                    context.strokeStyle = "#000";
                }
                context.beginPath();
                context.moveTo(x, halfHeight);
                for (var i = 0; i < data.length; i++)
                {
                    context.lineTo(x, halfHeight * (1 - data[i]));
                    x += dataWidth;
                }
                context.stroke();
                break;
        }
        
        return canvas;
    }
    
    this.envelope = function(envelope)
    {
        var a = envelope.a;
        var d = envelope.d;
        var s = envelope.s;
        var r = envelope.r;
        a *= _data.length; 
        d *= _data.length; 
        r *= _data.length;
        var is = 1 - s;
        for (var i = 0; i < a; i++) 
        {        
            _data[i] *= i/a;
        }
        for (; i < (a + d); i++) 
        {
            _data[i] *= (1 - (i-a)/d) * is + s;
        }
        for (; i < (_data.length - r); i++) 
        {
            _data[i] *= s;
        }
        for (var j = i; i < _data.length; i++) 
        {
            _data[i] *= s * (1 - (i - j) / r);
        }
    }
    
    this.filterResonant = function(frequency, rad_p, rad_z, scale) 
    {
        var theta = freq * 2 / sampleRate * Math.PI;
        var ap = Math.cos(theta) * rad_p, bp = Math.sin(theta) * rad_p;
        var az = Math.cos(theta) * rad_z, bz = Math.sin(theta) * rad_z;

        var a2 = 1, a1 = -2 * ap, a0 = rad_p;
        var b2 = 1, b1 = -2 * az, b0 = rad_z;

        var y1 = 0, y2 = 0, x1 = 0, x2 = 0;
        for (var i = 0; i < _data.length; i++) 
        {
            var out = (b2 * _data[i] + b1 * x1 + b0 * x2 - a1 * y1 - a0 * y2) / a2 * scale;
            x2 = x1;
            x1 = _data[i];
            y2 = y1;
            y1 = out;
            _data[i] = out;
        }
    }    
    
    this.gain = function(gainFactor) 
    {
        for (var i = 0; i < _data.length; i++) 
        {
            _data[i] *= gainFactor;
        }
    }
        
    this.filterClippedDistortion = function() 
    {
        for (var i = 0; i < _data.length; ++i) 
        {
            _data[i] = (Math.abs(_data[i]) < 0.3) ? 
                       (_data[i] * 2) : 
                       (_data[i] / 2 + 0.4 * (_data[i] > 0 ? 1 : -1));
        }
    }

    this.filterSineDistortion = function(drive) 
    {
        var s = Math.PI * drive / 2;
        for (var i = 0; i < _data.length; i++) 
        {
            _data[i] = Math.sin(_data[i] * s);
        }
    }
    
    this.filterDecay = function(f) 
    {
        var s = f * 4;
        for (var i = 0; i < _data.length; i++) 
        {
            _data[i] *= Math.exp(-i / n * s);
        }
    }
    
    this.filterFrequencySweep = function(length, freq1, freq2) 
    {
      var d1 = Math.PI * 2 * freq1 / sampleRate,
          d2 = Math.PI * 2 * freq2 / sampleRate,
          dd = (d2 - d1) / length,
          dt = d1,
          t = 0;
        for (var i = 0; i < length; i++) 
        {
            _data[i] = Math.sin(t);
            t += dt;
            dt += dd;
        }
    }    
    
    /* convenience function for lazy drawing */
    this.draw = function()
    {
        var canvas = this.renderVisual(_data.length / 5, pdqmus.Wave.VISUAL_HEIGHT_DEFAULT, 
                                       pdqmus.Wave.VISUAL_TYPE_DEFAULT, false, "#c53");
        canvas.style.border = "1px solid #352";
        canvas.style.padding = "10px";
        document.body.appendChild(canvas);   
    }

    this.addSamples = function(data)
    {
        //console.log("addSamples");
        for (var i = 0; i < _data.length; i++) 
        {
            _data[i] += data[i];
        }
    }

    
}

//convenience method for playback
pdqmus.Wave.prototype.play = function()
{
    pdqmus.Sample.createFromUrl(this.getDataUrl()).play();   
}

pdqmus.Wave.VISUAL_TYPE_WAVEFORM = "waveform";
pdqmus.Wave.VISUAL_TYPE_DEFAULT = pdqmus.Wave.VISUAL_TYPE_WAVEFORM;
pdqmus.Wave.VISUAL_WIDTH_DEFAULT = 800;
pdqmus.Wave.VISUAL_HEIGHT_DEFAULT = 200;

pdqmus.Wave.OSC_SINE = "sine";
pdqmus.Wave.OSC_SQUARE = "square";
pdqmus.Wave.OSC_SAWTOOTH = "sawtooth";
pdqmus.Wave.OSC_TRIANGLE = "triangle";
pdqmus.Wave.OSC_SILENCE = "silence";
pdqmus.Wave.OSC_NOISE = "noise";
pdqmus.Wave.OSC_CUSTOM = "custom";

pdqmus.Wave.OSC_DEFAULT = pdqmus.Wave.OSC_SINE;

pdqmus.Wave.PERIODIC_OSCILLATORS = [
    pdqmus.Wave.OSC_SINE,
    pdqmus.Wave.OSC_SQUARE,
    pdqmus.Wave.OSC_TRIANGLE,
    pdqmus.Wave.OSC_SILENCE,
    pdqmus.Wave.OSC_SAWTOOTH    
];

pdqmus.Wave.PITCHED_OSCILLATORS = [
    pdqmus.Wave.OSC_SINE,
    pdqmus.Wave.OSC_SQUARE,
    pdqmus.Wave.OSC_TRIANGLE,
    pdqmus.Wave.OSC_SAWTOOTH,    
];

pdqmus.Envelope = function(a, d, s, r)
{
    this.a = a;
    this.d = d;
    this.s = s;
    this.r = r;
}
pdqmus.Envelope.DEFAULT_ENVELOPE = new pdqmus.Envelope(0.05, 0.025, 0.9, 0.025);

//TODO: add array of filter operations
pdqmus.RenderWaveMessage = function(notes, oscillatorType, envelope)
{
    this.notes = notes
    this.oscillatorType = oscillatorType || pdqmus.Wave.OSC_DEFAULT;    
    this.wave;
    this.envelope = envelope;
}


