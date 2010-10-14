# minify using the Google closure compiler
# to work with 'const' requires this patch:http://code.google.com/p/closure-compiler/issues/attachmentText?id=15&aid=8278929041055196939&name=eat-const.patch
java -jar ../closure-compiler-read-only/build/compiler.jar  --js=pdqmus.js --js=Sound.js --js=Notation.js --js=Api.js --js=AsynchRequest.js --js=AudioSequence.js \
--js=Barline.js --js=Base64.js --js=Clef.js --js=EchoNest.js --js=GeneralMidi.js --js=KeySignature.js \
--js=Midi.js --js=MidiSound.js --js=Note.js --js=PianoRoll.js --js=Sample.js --js=Sequencer.js \
 --js=Tempo.js --js=TimeSignature.js --js=Wave.js --js=XmlHttpRequest.js --js=Util.js \
--js_output_file=pdqmus.min.js
