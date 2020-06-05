var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/initialize', function (req, res) {
    var response = {
        "msg": "INITIALIZE",
        "body": {
            "newLine": null,
            "heading": "Player 1",
            "message": "Awaiting Player 1's Move"
        }
    };
    res.send(response);
    console.log(response);
  });

app.post('/', function (req, res) {
    var output = req.body;
    res.send(output);
    console.log(output);
  });

app.listen(8080, function()
{
    console.log("Allahu Akbar");
});