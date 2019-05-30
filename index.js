var express = require('express');
var app = express();
var axios = require('axios');
var cors = require('cors')

const apikey = "";

var weatherUrl = "https://api.darksky.net/forecast/" + apikey;
var wpara = "?units=si"
var locationUrl = "https://www.iplocate.io/api/lookup/"


app.set('trust proxy', true);
app.use(cors());

app.get("/", function (req, rep) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  try {
    var coor = '';
    console.log(locationUrl + ip)
    axios.get(locationUrl + ip)
      .then((resp) => resp.data)
      .then((data) => {
        coor = data.latitude + "," + data.longitude
        var city = data.city
        var country = data.country
        console.log("Position got")
        console.log(weatherUrl + '/' + coor + wpara)
        axios.get(weatherUrl + '/' + coor + wpara)
          .then((resp) => resp.data)
          .then((data) => {
            data["city"] = city;
            data["country"] = country
            console.log("Weather got")
            rep.send(data);
          });
      });
  } catch (e) {

  }

});


var port = 8080;
app.listen(port);
console.log('Server run on port:', port);
