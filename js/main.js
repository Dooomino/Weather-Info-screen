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

var pullsuccess = false;

var pullWeather() {
  console.log("pulling");
  $.get("http://localhost:8080", function (rep, status) {
    dd = rep.daily.data
    hd = rep.hourly.data

    rep.currently.time = totime(rep.currently.time)
    for (i = 0; i < dd.length; i++) {
      dd[i].time = totime(dd[i].time)
    }
    for (i = 0; i < hd.length; i++) {
      hd[i].time = toHour(hd[i].time)
    }

    pullsuccess = true;
    loadCurrent(rep)
    loadHourly(rep)
  });
}

function getWeather() {
  pullsuccess = false;
  pullWeather();
  var s = setInterval(() => {
    if (!pullsuccess) {
      pullWeather();
    } else {
      clearInterval(s);
    }
  }, 60000);
}

function test() {
  pullsuccess = false;
  var s = setInterval(() => {
    if (!pullsuccess) {
      $.get("test.json", function (res) {
        dd = res.daily.data
        hd = res.hourly.data
        res.currently.time = totime(res.currently.time)
        for (i = 0; i < dd.length; i++) {
          dd[i].time = totime(dd[i].time)
        }

        for (i = 0; i < hd.length; i++) {
          hd[i].time = toHour(hd[i].time)
        }
        pullsuccess = true;
        loadCurrent(res)
        loadHourly(res)
      })
    } else {
      clearInterval(s);
    }
  }, 2000);
}

window.onload = function () {
  getWeather()
  setInterval(getWeather, 1800000)
  //
  //  test()
  //  //  setInterval(test, 10000);

}


function loadCurrent(json) {
  console.log(json);
  var icons = new Skycons({
    "color": "white"
  });

  var current = json.currently;
  var daily = json.daily.data;
  $("#current .local  span").html(json.city)
  $("#current .status .temp span").html(Math.round(current.apparentTemperature))
  $("#current .status .stat span").html(current.summary)
  $("#current .status .MinMax .min").html(Math.round(daily[0].temperatureMin))
  $("#current .status .MinMax .max").html(Math.round(daily[0].temperatureMax))

  //background
  $("#bg").removeClass("show");
  var path = "/image/";
  var background = path + current.icon + ".jpg";
  var src = $('#bg').css('background-image');
  var img = new Image();
  img.onload = function () {
    $("#bg").addClass("show");
  }
  img.src = background;
  if (img.complete)
    img.onload();

  $("#bg").css({
    "background": "url(\"" + background + "\")",
    "background-position": "center center",
    "background-repeat": "no-repeat",
    "background-size": "cover"
  });



  icons.set("weather-icon", current.icon);
  icons.play();
}

function loadHourly(json) {
  var hourly = json.hourly.data.slice(0, 11);
  $("#details").html("");
  for (var i = 0; i < hourly.length; i++) {
    //    $("#details").add("div");
    $("#details").append("<div class=\"hour" + i.toString() + " hs col-1\" index=" + i + "></div>");

    $("#details .hour" + i.toString()).append("<canvas id=\"forcast-icon" + i.toString() + "\" width=\"64\" height=\"64\"></canvas>");

    var temp = Math.round(hourly[i].temperature);

    $("#details .hour" + i.toString()).append("<h2 class=\"deg cdeg col-12\">" +
      temp + "</h2>")

    $(".hour" + i.toString()).css("animation-delay", (i * 0.05).toString() + "s");

    var time = hourly[i].time;
    $("#details .hour" + i.toString()).append("<h3 class=\"time col-12\">" +
      time + "</h3>")

    var icons = new Skycons({
      "color": "white"
    })
    icons.set("forcast-icon" + i.toString(), hourly[i].icon);
    icons.play()
  }
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


function toHour(u) {
  var a = new Date(u * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  });

  return a;
}
