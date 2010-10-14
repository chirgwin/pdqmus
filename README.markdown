pdqm.us
=======
pdqm.us (Pretty Damn Quick Music) is a Javascript library for creating browser-based music applications. No plugins required. No server required.

It's currently in a larval state, so please keep your expectations low, but do expect the API to change. Many things are incomplete and likely broken, but that shouldn't prevent you from having some fun with it.

name
----
The name is a nod to PDQ Bach. Umm… like … uh … because JS stands for both Javascript and Johann Sebastian. Get it?

The "Q" refers to the quickness of development, not performance. On the contrary, performance may be very low.

hello, world
------------
`
//middle c, with a duration of 1 second
var notes = [new pdqmus.Note(0, 1, 60)];

//create and play MIDI  
var midi = new pdqmus.Midi();
midi.addTrack(notes);
midi.play();

//create and play audio
var audioSequence = new pdqmus.AudioSequence(notes);
audioSequence.play();

//draw a piano roll
var pianoRoll = new pdqmus.PianoRoll(notes);
pianoRoll.draw();
`   
hello, solar system
-------------------
`
//middle c, d, e with a duration of a 1/4 second, varying velocities
var notes = [new pdqmus.Note(0.00, 0.25, 60, 20),
             new pdqmus.Note(0.25, 0.25, 62, 50),
             new pdqmus.Note(0.50, 0.50, 64, 102)];

//create and play MIDI  
var midi = new pdqmus.Midi();
midi.addTrack(notes);
midi.play();

//create and play audio using a sawtooth wave and envelope shaping
var audioSequence = new pdqmus.AudioSequence(notes, pdqmus.Wave.OSC_SAWTOOTH, 
                                      pdqmus.Envelope.DEFAULT_ENVELOPE);
audioSequence.play();

//draw and playback a piano roll, at a larger x scale
var pianoRoll = new pdqmus.PianoRoll(notes, 50);
pianoRoll.draw();
pianoRoll.play();

//draw wave form
audioSequence.drawWaveform();

//create a 60 BPM looping sequencer containing the MIDI and audio
var sounds = [MidiSound.createFromUrl(midi.getDataUrl()),
              pdqmus.Sample.createFromUrl(audioSequence.getDataUrl())];
sequencer = new pdqmus.Sequencer(sounds, 60);
sequencer.draw();
sequencer.play();    

