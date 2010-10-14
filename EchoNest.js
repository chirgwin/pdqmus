/**
 * Creates an instance of pdqmus.EchoNest
 *
 * A wrapper for making calls (via asynchronous HTTP requests) to the EchoNest API
 * 
 * @constructor
 * @this {pdqmus.EchoNest}
 * @param {string} apiKey Echo Nest API key
 * @param {function} loadedCallback function to call when api call is loaded
 */

pdqmus.EchoNest = function(apiKey, loadedCallback)
{
    const BASE_URL = "http://developer.echonest.com/api/v4";
    const DEFAULT_NUM_ROWS = 15;
    const DELIMITER = "/";
    this.apiKey = apiKey;
    this.loadedCallback;
    this.errorCallback;
    this.method = "GET";
    this.result;
    this.useJsonp = false;
    var self = this;

    this.call = function(api, method, params, callback, numRows) 
    {    
        var asynchRequest = new pdqmus.AsynchRequest(callback);
        if (self.errorCallback)
        {
            asynchRequest.errorCallback = self.errorCallback;
        }
        
        var parameters = new Object();
        parameters.api_key = this.apiKey;
        for (var key in params)
        {
            parameters[key] = params[key];
        }
        if (self.useJsonp)
        {        
            parameters["format"] = "jsonp";
            parameters["callback"] = callback;
            var url = Api.formUrl(BASE_URL + DELIMITER + api + DELIMITER + method, parameters);
            Api.loadJsonp(url);            
        }
        else
        {            
            parameters["format"] = "json";        
            var url = Api.formUrl(Api.PROXY_URL + BASE_URL + DELIMITER + api + DELIMITER + method, parameters);
            console.log(url);
            asynchRequest.loadJson(url);
        }
        function loadedCallback (result)
        {				
            self.result = result;
            self.loadedCallback(result);
        }
    }    
}

