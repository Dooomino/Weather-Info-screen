var appkey = "7a642c85238b4a8b0c23f12086939e80";

window.onload = function () {
  checkTime();
  setInterval(checkTime, 1000);

  getPos();
};
//var count = 0;

function getPos() {
  //	count++;
  var la = '',
    lo = '';
  geo = navigator.geolocation.getCurrentPosition(function (p) {
    //		console.log(p.coords.latitude, p.coords.longitude);
    var pa = p.coords.latitude,
      pg = p.coords.longitude;
    la = Math.round(p.coords.latitude);
    lo = Math.round(p.coords.longitude);
    //		console.log(la, lo);
    pos = new XMLHttpRequest();
    pos.onload = function () {
      if (pos.status >= 200 && pos.status < 300) {
        add = JSON.parse(pos.responseText);
        address = add.address.city + ',' + add.address.country_code;

        document.getElementById("direction").innerHTML = address;
        //				console.log(add.address.city + ',' + add.address.country_code);
        getWeather(address);
      } else {
        console.log('The request failed!');
      }
    }
    pos.open("GET", "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + pa + "&lon=" + pg + "&zoom=18&addressdetails=1");
    pos.send();
    //		console.log("up ", count, updated);
  });
}

function getWeather(address) {
  xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      word = xhr.responseText;
      //			console.log(word);
      node = JSON.parse(word);
      //			console.log(node);

      nowtemp = Math.round(node.main.temp - 273.15).toString() + '  °C';
      maxtemp = Math.round(node.main.temp_max - 273.15).toString() + ' °C';
      mintemp = Math.round(node.main.temp_min - 273.15).toString() + ' °C';
      pres = Math.round(node.main.pressure).toString() + ' hpa';
      humi = Math.round(node.main.humidity).toString() + ' %'

      //			console.log(nowtemp);
      //			console.log(maxtemp);
      //			console.log(mintemp);
      //			console.log(pres);
      //			console.log(humi);
      d = new Date();
      document.getElementById("nowWea").innerHTML = 'Current: ' + nowtemp;
      document.getElementById("othWea").innerHTML =
        'Max: ' + maxtemp + '<br/>' +
        '\t\tMin: ' + mintemp + '<br/>Pressure: ' +
        pres + '<br/>Humidity: ' + humi;
      h = d.getHours();
      m = d.getMinutes();
      s = d.getSeconds();
      if (h < 10) {
        h = '0' + h;
      }
      if (m < 10) {
        m = '0' + m;
      }
      if (s < 10) {
        s = '0' + s;
      }
      document.getElementById("last").innerHTML =
        'last update: ' + h + ":" + m;

      dep = node.weather[0].description;

      dep = dep.replace(/\b\w/g, l => l.toUpperCase());

      document.getElementById("weatherSt").innerHTML = dep;
      document.getElementById("icon").src = "http://openweathermap.org/img/w/" + node.weather[0].icon + ".png";

    } else {
      console.log('The request failed!');
    }
  };
  xhr.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=" + address + "&appid=" + appkey);
  xhr.send();

  getFore(address);
}

function getFore(address) {
  xhrf = new XMLHttpRequest();
  xhrf.onload = function () {
    if (xhrf.status >= 200 && xhrf.status < 300) {
      json = JSON.parse(xhrf.responseText);
      lis = document.getElementsByClassName('foreinfo');
      for (i = 0; i < 10; i++) {
        forehour = json.list[i].dt_txt.substring(8, 10) + 'th ' + json.list[i].dt_txt.substring(11, 13) + ':00';
        foretemp = Math.round(json.list[i].main.temp - 273.15) + '  °C';
        forestat = json.list[i].weather[0].main;
        //				console.log(forehour, forestat, foretemp);
        //				console.log(lis[i]);
        lis[i].innerHTML = forehour + '<br/>' + forestat + '<br/>' + foretemp;
        document.getElementsByClassName("foreicon")[i].src = "http://openweathermap.org/img/w/" + json.list[i].weather[0].icon + ".png"
      }
    } else {
      console.log('The request failed!');
    }
  }

  xhrf.open("GET", "https://api.openweathermap.org/data/2.5/forecast?q=" + address + "&appid=" + appkey);
  xhrf.send();


}


function checkDate(date) {
  d = date.toDateString();
  document.getElementById("date").innerHTML = d;
}

var updated = false;

function checkTime() {
  var d = new Date();
  h = d.getHours();
  m = d.getMinutes();
  s = d.getSeconds();
  if (h < 10) {
    h = '0' + h;
  }
  if (m < 10) {
    m = '0' + m;
  }
  if (s < 10) {
    s = '0' + s;
  }
  document.getElementById("time").innerHTML =
    h + ' : ' + m + ' : ' + s;
  nightPres = 0;
  curh = h;
  ratio = (curh / 24);
  if (curh > 12) {
    curh -= 12;
    nightPres = Math.round(ratio * 80).toString();
  } else {
    nightPres = Math.round((1 - ratio) * 80).toString();
  }
  //	console.log(nightPres);
  color2 = [255, 106, 40];
  color1 = [255, 186, 40];
  R = Math.round(color1[0] - color2[0] * (1 - ratio) / 2);
  G = Math.round(color1[1] - color2[1] * (1 - ratio) / 2);
  B = Math.round(color1[2] - color2[2] * (1 - ratio) / 2);
  color = 'rgb(' + R + ',' + G + ',' + B + ')';
  //	console.log(color);
  document.getElementById("mood").style.backgroundImage =
    'linear-gradient(180deg, black ' + nightPres + '%,' + color + ' 100%)';
  //	console.log(document.getElementById("mood").style.backgroundImage);
  checkDate(d);
  if (m % 2 == 0) {
    if (!updated) {
      getPos();
      updated = true;
    }
  } else {
    updated = false;
  }
}
