function weatherReport() {
    var forecast = new XMLHttpRequest();
    forecast.open('GET', 'https://api.wunderground.com/api/cdf3f3537bf94c1c/forecast/q/NY/newyork.json', true);
    forecast.send();
    forecast.onload = function () {
        var myForecast = JSON.parse(forecast.responseText);
        console.log(myForecast);
        document.getElementById('high').value = myForecast.forecast.high.fahrenheit;
        document.getElementById('low').value = myForecast.forecast.low.fahrenheit;
        document.getElementById('conditions').value = myForecast.forecast.conditions;


    }

}

