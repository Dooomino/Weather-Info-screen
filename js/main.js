var conditions = [
  "clear-day",
  "clear-night",
  "rain",
  "snow",
  "sleet",
  "wind",
  "fog",
  "cloudy",
  "partly-cloudy-day",
  "partly-cloudy-night"
];

window.onload = function () {
  $.get("http://localhost:8080", function (rep, status) {
    dd = rep.daily.data
    hd = rep.hourly.data
    rep.currently.time = totime(rep.currently.time)
    for (i = 0; i < dd.length; i++) {
      console.log({
        "high": dd[i].temperatureHigh,
        "low": dd[i].temperatureLow,
        "min": dd[i].temperatureMin,
        "max": dd[i].temperatureMax,
      })
      dd[i].time = totime(dd[i].time)
    }


    for (i = 0; i < hd.length; i++) {
      hd[i].time = totime(hd[i].time)
    }

    loadCurrent(rep)
  });


  //
  //  $.get("test.json", function (res) {
  //    dd = res.daily.data
  //    hd = res.hourly.data
  //    res.currently.time = totime(res.currently.time)
  //    for (i = 0; i < dd.length; i++) {
  //      console.log({
  //        "high": dd[i].temperatureHigh,
  //        "low": dd[i].temperatureLow,
  //        "min": dd[i].temperatureMin,
  //        "max": dd[i].temperatureMax,
  //      })
  //      dd[i].time = totime(dd[i].time)
  //    }
  //
  //
  //    for (i = 0; i < hd.length; i++) {
  //      hd[i].time = totime(hd[i].time)
  //    }
  //
  //    loadCurrent(res)
  //  })

}


function loadCurrent(json) {
  console.log(json);
  var icons = new Skycons({
    "color": "white"
  });
  var current = json.currently;
  var daily = json.daily.data;
  $("#current .local  span").html(json.city)
  $("#current .status .temp span").html(current.apparentTemperature)
  $("#current .status .stat span").html(current.summary)
  $("#current .status .MinMax .min").html(daily[0].temperatureMin)
  $("#current .status .MinMax .max").html(daily[0].temperatureMax)

  //background
  var path = "/Weather/image/";
  var background = path + current.icon + ".jpg";
  $("#bg").css({
    "background": "url(\"" + background + "\")",
    "background-position": "center center",
    "background-repeat": "no-repeat",
    "background-size": "cover"
  })


  var icons = new Skycons({
    "color": "white"
  });
  icons.set("weather-icon", current.icon);
  icons.play();
}



function totime(u) {
  var a = new Date(u * 1000);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;

  return time;
}
