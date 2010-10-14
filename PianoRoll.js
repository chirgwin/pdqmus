/**
 * Creates an instance of pdqmus.PianoRoll,
 * A piano roll is a player piano roll style visual representation.
 *
 * @constructor
 * @this {pdqmus.PianoRoll}
 
 notes, unitWidth, unitHeight, cursorColor, pitchRange, destroyOnFinish
 
 * @param {Array} notes An array of pdqmus.Note objects
 * @param {number} unitWidth width of each time unit, in pixels
 * @param {number} unitHeight height of each pitch unit, in pixels
 * @param {string} cursorColor CSS color string of the cursor color
 * @param {number} pitchRange range of pitches, defaults to 127
 * @param {boolean} destroyOnFinish whether or not to remove the paino roll from the DOM when playback is complete 
 */
pdqmus.PianoRoll = function(notes, unitWidth, unitHeight,
                            cursorColor, pitchRange, destroyOnFinish)
{
    this.notes = notes;
    
    DEFAULT_PITCH_RANGE = 127;
    DEFAULT_UNIT_WIDTH = 10;
    DEFAULT_UNIT_HEIGHT = 2;
    DEFAULT_COLOR = "#36c";
    DEFAULT_CURSOR_COLOR = "rgba(200, 100, 50, 0.04)";
   
    var _cursorPosition = 0;
    var _totalLength = 0;
    var _canvasRef = document.createElement("canvas");;
    var _context = _canvasRef.getContext("2d");

    //corresponds to seconds per pixel
    var _unitWidth = unitWidth || DEFAULT_UNIT_WIDTH;
    var _unitHeight = unitHeight || DEFAULT_UNIT_HEIGHT;    
    var _cursorColor = cursorColor || DEFAULT_CURSOR_COLOR;
    var _pitchRange = pitchRange || DEFAULT_PITCH_RANGE;
    var _destroyOnFinish = destroyOnFinish || false;
    self = this;
    this.render = function(color)
    {
        var lastNote = this.notes[this.notes.length - 1];
        _totalLength = (lastNote.onset + lastNote.duration) * _unitWidth;
        _canvasRef.width = _totalLength;
        _canvasRef.height = _unitHeight * _pitchRange;
        _context.strokeStyle = DEFAULT_COLOR;
        if (color) 
        {
            _context.strokeStyle = color;
        }
        _context.lineWidth = _unitHeight;
        _context.beginPath();
        for (var i = 0; i < this.notes.length; i ++)
        {
            var note = this.notes[i];
            var x = note.onset * _unitWidth;
            
            var y = _canvasRef.height - (note.noteNum * _unitHeight);
            var length = note.duration * _unitWidth;
            _context.moveTo(x, y);
            _context.lineTo(x + length, y);
            _context.stroke();
        }
        _context.save();
        return _canvasRef;
    }    
    
    this.play = function()
    {
        renderCursor();
    }
    
    function destroy()
    {
       _canvasRef.parentNode.removeChild(_canvasRef);    
    }

    /* TODO: fix this to render a proper cursor
     * 
    */
    function renderCursor()
    {
        _context.strokeStyle = _cursorColor;
        _context.moveTo(_cursorPosition, 0);
        _context.lineTo(_cursorPosition, _canvasRef.height);    
        _context.stroke();
        _cursorPosition ++;
        if (_cursorPosition <= _totalLength) 
        {
            setTimeout(renderCursor, 1000 / (_unitWidth));
        }
        else
        {
            if (_destroyOnFinish)
            {
                destroy();
            }
            _context.restore();
        }
    }    
}

/* convenience function for lazy drawing */
pdqmus.PianoRoll.prototype.draw = function()
{
    var canvas = this.render();
    canvas.style.border = "1px solid #352";
    canvas.style.padding = "10px";
    document.body.appendChild(canvas);   
}
