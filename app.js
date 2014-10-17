var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname)); 

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.post( '/postdata', function( request, response ) {

	var data = request.body.data
	console.log('received data %s', data);
     return response.send( data );
});


var server = app.listen(82, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});
