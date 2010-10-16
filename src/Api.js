/**
 * Creates an instance of pdqmus.Api
 * An API client for interacting with web services APIs
 * Currently, some of these require a local proxy server
 * to avoid same-origin policy issues
 * Where possible, Jsonp is used to avoid these problems
 * @constructor
 * @this {pdqmus.Api}
 */

pdqmus.Api = function()
{
}

pdqmus.Api.musicXmlFromNotes = function(notes, loadedCallback, errorCallback)
{
    var ar = new pdqmus.AsynchRequest(loadedCallback, "POST");
    notes.sort(pdqmus.Notation.sortByOnset);
    var notelist = pdqmus.Notation.generateNotelist(notes);
    ar.requestData = notelist;
    ar.parseJsonResponse = false;
    ar.errorCallback = errorCallback;
    ar.loadJson("/nl2xml");
};

pdqmus.Api.soundingStoneRowGen = function(pitchClasses, loadedCallback, errorCallback)
{
    if (pitchClasses.length != 3)
    {
        throw ("must have 3 numeric pitch classes, no more, no less")
    }
    var url = pdqmus.Api.PROXY_URL + "http://www.soundingstone.net/cgi-bin/rowgen.cgi?mode=json"
    
    for (var i = 0; i < 3; i ++)
    {
        url += "&pitchlist=" + pitchClasses[i]; 
    }

    var ar = new pdqmus.AsynchRequest(loadedCallback);
    ar.errorCallback = errorCallback;
    ar.loadJson(url);  
};

pdqmus.Api.sappHenon = function(loadedCallback, errorCallback)
{
    //TODO: post options 
    var url = pdqmus.Api.PROXY_URL + "http://henon.sapp.org/cgi-bin/henonsequence"
    
    var ar = new pdqmus.AsynchRequest(loadedCallback, "POST");
    ar.parseJsonResponse = false;
    ar.errorCallback = errorCallback;
    ar.loadJson(url);  
};

pdqmus.Api.PROXY_URL = "/proxy?";

pdqmus.Api.formUrl = function(url, params)
{
	var i = 0;
	for (var key in params)
	{
		if (i == 0)
		{
			url += "?";
		}
        else
        {
            url += "&";
        }
		url += key + "=" + params[key];			
		i++;
	}
	return url;
}

pdqmus.Api.loadJsonp = function(url)
{
    var s = document.createElement("script");    
    s.type = "text/javascript";
    s.src = url;
    document.getElementsByTagName("head")[0].appendChild(s);    
}
