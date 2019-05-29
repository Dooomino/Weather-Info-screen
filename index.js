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

  //  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  var ip = '192.197.54.31'
  console.log(ip)
  try {
    var coor = '';
    axios.get(locationUrl + ip)
      .then((resp) => resp.data)
      .then((data) => {
        //        console.log(data)
        coor = data.latitude + "," + data.longitude
        var city = data.city
        var country = data.country
        axios.get(weatherUrl + '/' + coor + wpara)
          .then((resp) => resp.data)
          .then((data) => {
            //            console.log(data);
            data["city"] = city;
            data["country"] = country
            rep.send(data);
          });

      });

  } catch (e) {

  }

});


var port = 8080;
app.listen(port);
console.log('Server run on port:', port);
