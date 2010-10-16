/**
 * Creates an instance of pdqmus.AsynchRequest.
 * An asynchronous (non-blocking) HTTP request.
 * @constructor
 * @this {pdqmus.AsynchRequest}
 * @param {object} loadedCallback function to call when loaded
 * @param {string} method HTTP method, e.g. "POST"
 */

pdqmus.AsynchRequest = function(loadedCallback, method)
{
    this.string = null;
    this.data = null;
    this.xmlHttp = pdqmus.XmlHttpRequest.create();
    this.errorCallback = null;
    this.requestObj = null;
    this.requestData = null;
    this.parseJsonResponse = true;
    if (loadedCallback)
    {
        this.loadedCallback = loadedCallback;
    }
    else
    {
        this.loadedCallback = null;
    }
    if (method)
    {
        this.method = method;
    }
    else
    {
        this.method = "GET";
    }    
}

pdqmus.AsynchRequest.prototype.loadJson = function(url) 
{    
    var self = this;
    this.xmlHttp.overrideMimeType(pdqmus.XmlHttpRequest.CONTENT_TYPE_JSON);
    this.xmlHttp.open(this.method, url, true);
    this.xmlHttp.setRequestHeader(pdqmus.XmlHttpRequest.HEADER_ACCEPT, pdqmus.XmlHttpRequest.CONTENT_TYPE_JSON);
    this.xmlHttp.setRequestHeader(pdqmus.XmlHttpRequest.HEADER_REQUESTED_WITH, pdqmus.XmlHttpRequest.REQUESTED_WITH_TYPE);
    this.xmlHttp.onreadystatechange = handleReadyStateChange;
    if (this.requestObj)
    {        
	this.xmlHttp.setRequestHeader(pdqmus.XmlHttpRequest.HEADER_CONTENT_TYPE, pdqmus.XmlHttpRequest.CONTENT_TYPE_JSON);
        this.requestData = JSON.stringify(this.requestObj);
    }
    this.xmlHttp.send(this.requestData);
    function handleReadyStateChange() 
    {        
        if (self.xmlHttp.readyState == pdqmus.XmlHttpRequest.READYSTATE_COMPLETE) 
        {            
            self.string = self.xmlHttp.responseText;
            try
            {
                if (self.parseJsonResponse) 
                {
                    self.data = JSON.parse(self.string);
                }
                if (pdqmus.XmlHttpRequest.SUCCESS_STATUSES.indexOf(self.xmlHttp.status) >= 0)
                {
                    if (self.loadedCallback != null)
                    {
                        if (self.data) 
                        {
                            self.loadedCallback(self.data);
                        }
                        else
                        {
                            self.loadedCallback(self.string);                            
                        }
                    }
                }
                else if (self.errorCallback != null)
                {
                    self.errorCallback();                
                }
            }
            catch (err)
            {
                if (self.errorCallback != null)
                {
                    self.errorCallback({"error": err, "response": self.xmlHttp.responseText, "status": self.xmlHttp.status});                
                }                
            }
        }
    }        
}    

pdqmus.AsynchRequest.prototype.loadXml = function(url) 
{    
    var self = this;
    this.xmlHttp.overrideMimeType(pdqmus.XmlHttpRequest.CONTENT_TYPE_XML);
    this.xmlHttp.open(this.method, url, true);
    this.xmlHttp.setRequestHeader(pdqmus.XmlHttpRequest.HEADER_ACCEPT, pdqmus.XmlHttpRequest.CONTENT_TYPE_XML);
    this.xmlHttp.setRequestHeader(pdqmus.XmlHttpRequest.HEADER_REQUESTED_WITH, pdqmus.XmlHttpRequest.REQUESTED_WITH_TYPE);
    this.xmlHttp.onreadystatechange = handleReadyStateChange;

    this.xmlHttp.send(this.requestData);
    function handleReadyStateChange() 
    {        
        if (self.xmlHttp.readyState == pdqmus.XmlHttpRequest.READYSTATE_COMPLETE) 
        {            
            self.string = self.xmlHttp.responseText.replace('<?xml version="1.0" encoding="UTF-8"?>', "");
            try
            {
                self.data = self.xmlHttp.responseXML;
                if (XmlHttpRequest.SUCCESS_STATUSES.indexOf(self.xmlHttp.status) >= 0)
                {
                    if (self.loadedCallback != null)
                    {
                        if (self.data) 
                        {
                            self.loadedCallback(self.data);
                        }
                        else
                        {
                            self.loadedCallback(self.string);                            
                        }
                    }
                }
                else if (self.errorCallback != null)
                {
                    self.errorCallback();                
                }
            }
            catch (err)
            {
                if (self.errorCallback != null)
                {
                    self.errorCallback({"error": err, "response": self.xmlHttp.responseText, "status": self.xmlHttp.status});                
                }                
            }
        }
    }      
}    


pdqmus.AsynchRequest.prototype.cancelCallback = function() 
{
    this.loadedCallback = null;
}

