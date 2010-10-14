/**
 * Creates an instance of pdqmus.Midi, a file-like MIDI object 
 *
 * @constructor
 * @this {pdqmus.Midi}
 * @param {number} numTracks Number of tracks in the midi "file"
 * @param {number} tempo  a integer indicating the tempo of the MIDI "file", in beats per minute.
 */

pdqmus.Midi = function(numTracks, tempo)
{
    const HEADER_CHUNK = "MThd";
    const TRACK_CHUNK = "MTrk";   
    const SINGLE_TRACK_FORMAT = 0;
    const SIMULTANEOUS_TRACKS_FORMAT = 1;
    const SEPARATE_TRACKS_FORMAT = 2;
    const STATUS = 0xFF;
    const SEQUENCE_NUMBER = 0x00; 
    const TEXT = 0x01;
    const COPYRIGHT = 0x02;
    const TRACK_NAME = 0x03;
    const INSTRUMENT = 0x04;
    const LYRIC = 0x05;
    const MARKER = 0x06;
    const CUE_POINT = 0x07;
    const PATCH_NAME = 0x08;
    const PORT_NAME = 0x09;
    const CHANNEL_PREFIX = 0x20;
    const END_OF_TRACK = 0x2F;
    const TEMPO = 0x51;
    const SMPTE_OFFSET = 0x54;
    const TIME_SIGNATURE = 0x58;
    const KEY_SIGNATURE = 0x59;
    const PROPRIETARY = 0x7F;
    const PULSE = 24;
    const THIRTYSECONDS_PER_PULSE = 8;    
    const MICROSECONDS_PER_MINUTE = 60000000;
    const HEADER_LENGTH = 6;        
    const DIVISIONS = 480;      
	    
    const MAX_SOUNDING_TRACKS = 24;
    const MAX_CHANNELS = 16;  

    const NOTE_OFF = 0x8;
    const NOTE_ON = 0x9;
    const AFTERTOUCH = 0xA;
    const CONTROL_CHANGE = 0xB;
    const PROGRAM_CHANGE = 0xC;
    const CHANNEL_PRESSURE = 0xD;
    const PITCH_WHEEL = 0xE;    
    const SYSTEM = 0xF;
    const SYSTEM_EX = 0xF0;
    const MTC_QUARTER_FRAME = 0xF1;
    const SONG_POSITION_POINTER = 0xF2;
    const SONG_SELECT = 0xF3;
    const TUNE_REQUEST = 0xF6;
    const CLOCK = 0xF8;
    const TICK = 0xF9;
    const START = 0xFA;
    const CONTINUE = 0xFB;
    const STOP = 0xFC;
    const ACTIVE_SENSE = 0xFE;
    const RESET = 0xFF;
    const SYSTEM_EX_END = 0xF7;
    const MIDI_MIDDLE_C = 60;    
    const KEY_SIGNATURE_MODE_MAJOR = 0;
    const KEY_SIGNATURE_MODE_MINOR = 1;
	
    const DEFAULT_NUM_TRACKS = 1;
    const DEFAULT_TEMPO = 120;
    const DEFAULT_INSTRUMENT_NAME = "Contrabass Ukulelephonium";
    const DEFAULT_CHANNEL = 0;
    const DEFAULT_PATCH_NUMBER = 0;
    const DEFAULT_TITLE = "MIDI Created by Javascript";
    const DEFAULT_COPYRIGHT = "Copyleft, Music Hack Day Boston 2010 rules";
	
    var _bpm = tempo || DEFAULT_TEMPO;
    var _header = "";
    var _data = "";
    
    var _numTracks = numTracks || DEFAULT_NUM_TRACKS;


    function init()
    {
        createHeader();	
        createTempoTrack();	
    }

    function createHeader ()
    {
	_header = HEADER_CHUNK
        + pdqmus.Util.strFromDword(HEADER_LENGTH, pdqmus.Util.BIG_ENDIAN)
        + pdqmus.Util.strFromWord(SIMULTANEOUS_TRACKS_FORMAT, pdqmus.Util.BIG_ENDIAN)
        + pdqmus.Util.strFromWord(_numTracks + 1, pdqmus.Util.BIG_ENDIAN)
        + pdqmus.Util.strFromWord(DIVISIONS, pdqmus.Util.BIG_ENDIAN);
    }
	
    function writeMessages(messages)
    {
        var prevTime = 0;
        var currentTime = 0;
        var messagesStr = ""
        for (var i = 0; i < messages.length; i++)
        {
            currentTime = Math.round((messages[i].onset * _bpm / 60) * DIVISIONS);
            messagesStr += pdqmus.Util.strFromVariableInt(currentTime - prevTime);
            messagesStr += messages[i].write();
            prevTime = currentTime;
        }   
        return messagesStr;        
    }
      
    // eventually may want to make this public so that 
    // caller may add things to this track
    function createTempoTrack()
    {			
        //hardwire a title and a copyright
        var title = DEFAULT_TITLE;
        var copyright = DEFAULT_COPYRIGHT;
		
        var tempo = Math.round(MICROSECONDS_PER_MINUTE / _bpm);

        var track = pdqmus.Util.strFromByte(0)
        + pdqmus.Util.strFromByte(STATUS)
        + pdqmus.Util.strFromByte(TEMPO)
        //chunk size
        + pdqmus.Util.strFromByte(3)
        + pdqmus.Util.strFromByte(tempo >> 16)
        + pdqmus.Util.strFromByte(tempo >> 8)
        + pdqmus.Util.strFromByte(tempo)

        + pdqmus.Util.strFromByte(0)
        + pdqmus.Util.strFromByte(STATUS)
        + pdqmus.Util.strFromByte(TRACK_NAME)
        + pdqmus.Util.strFromByte(title.length)
        + title		
        + pdqmus.Util.strFromByte(0)
        + pdqmus.Util.strFromByte(STATUS)
        + pdqmus.Util.strFromByte(COPYRIGHT)
        + pdqmus.Util.strFromByte(copyright.length)
        + copyright;
		
        //hardwire a key signature and time signature
        messages = [];		
        messages.push(new pdqmus.MidiKeySignature(0,0,0));
        messages.push(new pdqmus.MidiTimeSignature(1,0,4,4));
        track += writeMessages(messages)
            + pdqmus.Util.strFromByte(0)
            + pdqmus.Util.strFromByte(STATUS)
            + pdqmus.Util.strFromByte(END_OF_TRACK)
            + pdqmus.Util.strFromByte(0);
        
        _data += TRACK_CHUNK
        + pdqmus.Util.strFromDword(track.length, pdqmus.Util.BIG_ENDIAN)
        + track;
    }
    
    this.addTrack = function (elements, channel, GMInstrumentNum)
    {
		//hardwire instrument name
		var instrumentName = DEFAULT_INSTRUMENT_NAME;
		if (!(channel >= 0))
		{
			channel = DEFAULT_CHANNEL;
		}
        if (!(GMInstrumentNum >= 0))
        {
            channel = DEFAULT_PATCH_NUMBER;
        }
		 
        var track = pdqmus.Util.strFromByte(0)
        + pdqmus.Util.strFromByte(PROGRAM_CHANGE * 0x10 + channel)
        + pdqmus.Util.strFromByte(GMInstrumentNum)
		
        + pdqmus.Util.strFromByte(0)
        + pdqmus.Util.strFromByte(STATUS)
        + pdqmus.Util.strFromByte(INSTRUMENT)
        + pdqmus.Util.strFromByte(instrumentName.length)
		+ instrumentName;
			        
        var messages = [];
        for (var i = 0; i < elements.length; i++)
        {
			var note = elements[i];
            messages.push(new pdqmus.MidiNote(i, note.onset, NOTE_ON, channel,
                                       note.noteNum, note.velocity)); 
            //note off, zero velocity
            messages.push(new pdqmus.MidiNote(i, note.onset + note.duration, NOTE_OFF, channel,
                                       note.noteNum, 0));
        }
        
        //sort messages
        messages.sort(pdqmus.Notation.sortByOnset);
        
        track += writeMessages(messages)        
        //pad the end a little
        + pdqmus.Util.strFromVariableInt(Math.round(DIVISIONS / 10))
		//end of track...
        + pdqmus.Util.strFromByte(STATUS)
        + pdqmus.Util.strFromByte(END_OF_TRACK)
        + pdqmus.Util.strFromByte(0);
        
        _data += TRACK_CHUNK
        + pdqmus.Util.strFromDword(track.length, pdqmus.Util.BIG_ENDIAN)
        + track;
    }
	  	
	this.getDataUrl = function()
	{
		return "data:" + pdqmus.Midi.MIME_TYPE + ";base64," + btoa(_header + _data); 
	}
	
	init();	
}

pdqmus.Midi.prototype.play = function()
{
	var ms = pdqmus.MidiSound.createFromUrl(this.getDataUrl());
	ms.play();
}

pdqmus.MidiMessage = function(index, onset, statusCode)
{
    this.index = index;
    this.onset = onset;
    this.statusCode = statusCode;
}        

pdqmus.MidiNote = function(index, onset, statusCode, channel, noteNum, velocity)
{
    this.index = index;
    this.onset = onset;
    this.statusCode = statusCode;
    this.channel = channel;
    this.noteNum = noteNum;
    this.velocity = velocity;
}

pdqmus.MidiNote.prototype = new pdqmus.MidiMessage;

pdqmus.MidiNote.prototype.write = function()
{
    return pdqmus.Util.strFromByte(this.statusCode * 0x10 + this.channel, pdqmus.Util.BIG_ENDIAN)
           + pdqmus.Util.strFromByte(this.noteNum, pdqmus.Util.BIG_ENDIAN)
           + pdqmus.Util.strFromByte(this.velocity, pdqmus.Util.BIG_ENDIAN);
}

pdqmus.MidiKeySignature = function(index, onset, fifths)
{
    this.index = index;
    this.onset = onset;
    //always key signature status code
    this.statusCode = 0x59;
    this.fifths = fifths;
    //always default to "major" mode
    this.mode = 0;
}

pdqmus.MidiKeySignature.prototype = new pdqmus.MidiMessage;
pdqmus.MidiKeySignature.prototype.write = function()
{
    return pdqmus.Util.strFromByte(0xFF)
           + pdqmus.Util.strFromByte(this.statusCode)	
            //chunk size
           + pdqmus.Util.strFromByte(2)	
           + pdqmus.Util.strFromByte(this.fifths)
           + pdqmus.Util.strFromByte(this.mode);
}


pdqmus.MidiTimeSignature = function(index, onset, numerator, denominator)
{
    this.index = index;
    this.onset = onset;
    //always time signature status code
    this.statusCode = 0x58;
    this.numerator = numerator;
    this.denominator = denominator;
    this.pulse = 24;
    this.thirtySecondsPerPulse = 8;
}

pdqmus.MidiTimeSignature.prototype = new pdqmus.MidiMessage;
pdqmus.MidiTimeSignature.prototype.write = function()
{
    //"meta" status
    return pdqmus.Util.strFromByte(0xFF, pdqmus.Util.BIG_ENDIAN)
           + pdqmus.Util.strFromByte(this.statusCode)	
            //chunk size
           + pdqmus.Util.strFromByte(4)	
           + pdqmus.Util.strFromByte(this.numerator)
            //denominator is log2 of normal music notation denominator
           + pdqmus.Util.strFromByte(Math.round(Math.log(this.denominator) / Math.LN2))
           + pdqmus.Util.strFromByte(this.pulse)
           + pdqmus.Util.strFromByte(this.thirtySecondsPerPulse);
}

/*
 * public constants
 */

 pdqmus.Midi.MIME_TYPE = "audio/mid";

 