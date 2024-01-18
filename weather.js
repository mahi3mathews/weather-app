const apiKey = "582f951903d4e2469c824add1d527a06";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric";
const searchBtn = document.getElementById("search-btn");
searchBtn.onclick = () => checkWeather();
var currentCity = "Birmingham";

document.querySelector("body").onload = initialize;

var geocoder;

async function initialize() {
    geocoder = new google.maps.Geocoder();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initializeCurrentWeather);
    }
}

async function initializeCurrentWeather(position) {
    await setCurrentCity(position);
    checkWeather();
}

async function setCurrentCity(position) {
    let cityName = await codeLatLng(
        position.coords.latitude,
        position.coords.longitude
    );
    if (cityName) currentCity = cityName;
}
async function codeLatLng(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    var cityName;
    await geocoder.geocode({ latLng: latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                for (var i = 0; i < results[0].address_components.length; i++) {
                    for (
                        var b = 0;
                        b < results[0].address_components[i].types.length;
                        b++
                    ) {
                        if (
                            results[0].address_components[i].types[b] ==
                            "postal_town"
                        ) {
                            cityName =
                                results[0].address_components[i].long_name;
                        }
                    }
                }
            } else {
                alert("No results found");
            }
        } else {
            alert("Geocoder failed due to: " + status);
        }
    });
    return cityName;
}

async function checkWeather() {
    let inputValue = document.getElementById("city-input").value;
    let cityValue = inputValue ? inputValue : currentCity;
    const response = await fetch(apiURL + `&q=${cityValue}&appid=${apiKey}`);

    const data = await response.json();
    setWeatherInfo(data);
}

function setWeatherInfo(weatherInfo) {
    document.getElementById("temp").innerHTML = `${
        weatherInfo?.main?.temp ?? 0
    }°c`;
    document.getElementById("city").innerHTML = weatherInfo?.name ?? "-";
    document.getElementById("humidity").innerHTML = `${
        weatherInfo?.main?.humidity ?? "-"
    }%`;
    document.getElementById("wind").innerHTML = `${
        weatherInfo.wind.speed ?? "-"
    }  km/h`;
    document.getElementById("weather-icon").src = `images/${getWeatherImg(
        weatherInfo?.weather[0]?.main
    )}`;
}

function getWeatherImg(weather) {
    switch (weather) {
        case "Clear":
            return "clear.png";
        case "Clouds":
            return "clouds.png";
        case "Drizzle":
            return "drizzle.png";
        case "Rain":
            return "rain.png";
        case "Snow":
            return "snow.png";
        case "Mist":
            return "mist.png";
        case "Haze":
            return "haze.png";
        default:
            return "clear.png";
    }
}
