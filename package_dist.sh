# minify using the Google closure compiler
# to work with 'const' requires this patch:
# http://code.google.com/p/closure-compiler/issues/attachmentText?id=15&aid=8278929041055196939&name=eat-const.patch
java -jar ../closure-compiler-read-only/build/compiler.jar  --js=src/pdqmus.js --js=src/Sound.js \
    --js=src/Notation.js --js=src/Api.js --js=src/AsynchRequest.js --js=src/AudioSequence.js \
    --js=src/Barline.js --js=src/Base64.js --js=src/Clef.js --js=src/EchoNest.js --js=src/GeneralMidi.js --js=src/KeySignature.js \
    --js=src/Midi.js --js=src/MidiSound.js --js=src/Note.js --js=src/PianoRoll.js --js=src/Sample.js --js=src/Sequencer.js \
    --js=src/Tempo.js --js=src/TimeSignature.js --js=src/Wave.js --js=src/XmlHttpRequest.js --js=src/Util.js \
    --js_output_file=dist/pdqmus.min.js

# copy css and unminified js files, currently only web workers
cp src/*worker*.js src/*.css dist/.

#package quickstart
mkdir pdqmus_quickstart
cp -R hello_solar_system.html dist pdqmus_quickstart/.
zip -r pdqmus_quickstart.zip pdqmus_quickstart
tar -cvzf pdqmus_quickstart.tar.gz  pdqmus_quickstart
