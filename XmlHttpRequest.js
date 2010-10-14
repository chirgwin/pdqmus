/**
 * Creates an instance of pdqmus.XmlHttpRequest.
 *
 * @constructor
 * @this {pdqmus.XmlHttpRequest}
 */
pdqmus.XmlHttpRequest = function()
{

}

//static

pdqmus.XmlHttpRequest.create = function() 
{
    var request = false;
    try 
    {
        request = new ActiveXObject('Msxml2.XMLHTTP');
    }
    catch (err2) 
    {
        try 
        {
            request = new ActiveXObject('Microsoft.XMLHTTP');
        }
        catch (err3) 
        {
            try 
            {
                request = new XMLHttpRequest();
            }
            catch (err1) 
            {
                request = false;
            }
        }
    }
    return request;
}

pdqmus.XmlHttpRequest.READYSTATE_LOADING = 1;
pdqmus.XmlHttpRequest.READYSTATE_LOADED = 2;
pdqmus.XmlHttpRequest.READYSTATE_INTERACTIVE = 3;
pdqmus.XmlHttpRequest.READYSTATE_COMPLETE = 4;

pdqmus.XmlHttpRequest.HTTP_STATUS_OK = 200;
pdqmus.XmlHttpRequest.HTTP_STATUS_CREATED = 201;
pdqmus.XmlHttpRequest.SUCCESS_STATUSES = [XmlHttpRequest.HTTP_STATUS_OK, pdqmus.XmlHttpRequest.HTTP_STATUS_CREATED];


pdqmus.XmlHttpRequest.HEADER_CONTENT_TYPE = "Content-Type";
pdqmus.XmlHttpRequest.CONTENT_TYPE_JSON = "text/json";
pdqmus.XmlHttpRequest.CONTENT_TYPE_XML = "text/xml";
pdqmus.XmlHttpRequest.HEADER_ACCEPT = "Accept";
pdqmus.XmlHttpRequest.HEADER_REQUESTED_WITH = "X-Requested-With";

pdqmus.XmlHttpRequest.REQUESTED_WITH_TYPE = "XMLHttpRequest";
    
