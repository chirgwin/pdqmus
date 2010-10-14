/**
 * Creates an instance of pdqmus.Util.
 *
 * @constructor
 * @this {pdqmus.Util}
 */

pdqmus.Util = function()
{
};

//32 bit
pdqmus.Util.strFromDword = function(dword, endianness)
{
    if (endianness == pdqmus.Util.BIG_ENDIAN) 
    {
        return String.fromCharCode(dword >> 24 & 0xFF, dword >> 16 & 0xFF, dword >> 8 & 0xFF, dword & 0xFF);
    }
    return String.fromCharCode(dword & 0xFF, dword >> 8 & 0xFF, dword >> 16 & 0xFF, dword >> 24 & 0xFF);
};

//32 bit, more efficient?
pdqmus.Util.strFromLong = function(value) 
{
    var bytes = "";
    for (i = 0; i < 4; ++i) 
    {
        bytes += String.fromCharCode(value % 256);
        value = Math.floor(value / 256);
    }
    return bytes;
};
        
//16 bit
pdqmus.Util.strFromWord = function(word, endianness)
{
    if (endianness == pdqmus.Util.BIG_ENDIAN) 
    {
        return String.fromCharCode(word >> 8 & 0xFF, word & 0xFF);
    }
    return String.fromCharCode(word & 0xFF, word >> 8 & 0xFF);
};

//8 bit
pdqmus.Util.strFromByte = function(aByte)
{
    return String.fromCharCode(aByte & 0xFF);
};  


pdqmus.Util.strFromVariableInt = function(value)
{
    if (value > 0x0fffffff)
    {
        return;
    }
    
    //single byte
    if (value <= 127)
    {
        return pdqmus.Util.strFromByte(value);
    }
    
    var buffer = value & 0x7f;
    while ((value >>= 7) > 0)
    {
        buffer <<= 8;
        buffer |= 0x80;
        buffer += (value & 0x7f); 
    }
    
    returnValue = "";
    while(true) 
    {
        returnValue += pdqmus.Util.strFromByte(buffer);
        if (buffer & 0x80)
        {
            buffer >>= 8;
        }
        else
        {
            break;
        }
    }
    
    return returnValue;
};

pdqmus.Util.getPosition = function(event)
{
    e = event || window.event;
    var p = {x:0, y:0};
    if (e.pageX || e.pageY) {
        p.x = e.pageX;
        p.y = e.pageY;
    } 
    else 
    {
        var de = document.documentElement;
        var b = document.body;
        p.x = e.clientX + (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
        p.y = e.clientY + (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
    }
    return p;
};

pdqmus.Util.getObjectPosition = function(obj)
{
    var pos = {x: 0, y:0};
    //x
    if (obj.offsetParent) 
    {
        while (true) 
        {
            pos.x += obj.offsetLeft;
            if (!obj.offsetParent) 
            {
                break;
            }
            obj = obj.offsetParent;
        }
    }
    else if (obj.x) 
    {
        pos.x += obj.x;
    }
    
    //y
    if (obj.offsetParent) 
    {
        while (true) 
        {
            pos.y += obj.offsetTop;
            if (!obj.offsetParent) 
            {
                break;
            }
            pos.y = obj.offsetParent;
        }
    }
    else if (obj.y) 
    {
       pos.y += obj.y;
    }
    
    return pos;
};

pdqmus.Util.S4 = function() 
{
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};
pdqmus.Util.guid = function()
{    
   var S4 = pdqmus.Util.S4;
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

pdqmus.Util.BIG_ENDIAN = "bigEndian";
pdqmus.Util.LITTLE_ENDIAN = "littleEndian";

pdqmus.Util.NEWLINE = "\n";

//clone object
Object.prototype.clone = function() 
{
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) 
  {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
        newObj[i] = this[i].clone();
    }
    else 
    {
        newObj[i] = this[i]
    }
  } 
  return newObj;
};

