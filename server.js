var express = require('express');

var app = express();

app.set('port', 3212);

var __dirname = 'http://web.engr.oregonstate.edu/~davicarr';

app.use(express.static('bettaFish'));
app.use('/css', express.static(__dirname + '/bettaFish/css'));
app.use('/js', express.static(__dirname + '/bettaFish/js'));
app.use('/img', express.static(__dirname + '/bettaFish/img'));
app.use('/data', express.static(__dirname + '/bettaFish/img'));

app.use(function(req,res){
    res.status(404);
    res.render('404');
  });
  
  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
  });

var server = app.listen(app.get('port'), function(){
    var port = server.address().port;
    console.log("Server started at http://web.engr.oregonstate.edu/~davicarr/bettaFish");
});