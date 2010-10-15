Proxy Server
============
Simple server for proxying HTTP requests (to get around same origin policy limitation in XmlHttpRequest)
and running local webservices.

Based on Tornado. See http://tornadoweb.org/ for requirements.

Running:
`python2.6 server.py`

Point browser at:
http://localhost:7376/

Anything in root 'pdqmus' directory (.. from here) will be served up here:
http://localhost:7376/static/
