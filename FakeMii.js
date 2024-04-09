var http = require('http'),
  httpProxy = require('http-proxy');
//var request = require('request');
var fs   = require('fs');
var url  = require('url');

var proxy = httpProxy.createProxyServer({});

process.on("uncaughtException", e => console.error(e));
process.on("unhandledRejection", e => console.error(e));

var regex = /^https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;

http.createServer(function (client_req, response) {
  console.log('serving: "' + client_req.url + '"');
  let url = client_req.url;
  if(url == "http://conntest.pretendo .cc/")
    url = "http://conntest.pretendo.cc/";
  if(url == "http://conntest.nintendowifi.net/")
	sendConnTestPage(response);
  else if(["http://launcher", "http://launcher/"].includes(url))
  {
	  sendLauncherPage(response);
  }
  else
  {
    var dom = url.match(regex)?.[0];
    url = url.replace(regex, "") || "/";
    console.log(dom, url)
	  proxy.web(client_req, response, { target: dom });
  }
}).listen(3000);
console.log('Server running on port 3000');


function sendLauncherPage(response){
  response.writeHead(200, {
  'Content-Type'	: 'text/html',
  'connection'		: 'keep-alive'});
  fs.readFile('./launcher.html',function(err,data){
    response.end(data);
  });
  console.log('served launcher.html');
}


function sendConnTestPage(response){
  response.writeHead(200, {
  'Content-Type'	: 'text/html',
  'connection'		: 'keep-alive',
  'Server'			: 'BigIP',
  'X-Organization'	: 'Nintendo'});
  fs.readFile('./conntest.html',function(err,data){
    response.end(data);
  });
  console.log('served conntest.html');
}

function send404(response){
  response.writeHead(404, {"Content-Type": "text/plain"});
  response.write("404 Not Found\n");
  response.end();
  console.log('served 404.')
}
