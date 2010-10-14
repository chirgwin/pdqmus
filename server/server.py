import tornado.httpserver
import tornado.httpclient
import tornado.ioloop
import tornado.web
from subprocess import *
import tempfile
import os
import string

class MainHandler(tornado.web.RequestHandler):
    def get(self):                
        self.write("pdqmus")

class ProxyHandler(tornado.web.RequestHandler):
    def get(self):
        http = tornado.httpclient.HTTPClient()
        url = string.split(str(self.request.uri), "?", 1)[1]
        print (url)
        response = http.fetch(url)
        self.write(response.body)        

# translate Nightingale Notelist to MusicXML, using nl2xml
# requires nl2xml to be installed and in your system path
# see: http://github.com/chirgwin/nl2xml
class Nl2XmlHandler(tornado.web.RequestHandler):
    def post(self):
        #write request to temp file, then call nl2xml to read and translate
        temp = tempfile.NamedTemporaryFile()
        pring("proxying")
        self.set_header("Content-Type", "text/xml")
        temp.write(self.request.body)
        temp.read(1)
        
        #write translated MusicXML to reponse
        musicXml = Popen(["nl2xml", temp.name], stdout=PIPE).communicate()[0]
        self.write(musicXml)
        temp.close()

settings = {
    "static_path": "../."
}
application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/nl2xml", Nl2XmlHandler),
    (r"/proxy", ProxyHandler),
], **settings)

if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

