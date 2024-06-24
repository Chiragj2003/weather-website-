let forwardGeocoding = (location)=>{
  let url = `http://dev.virtualearth.net/REST/v1/Locations?q=${location}&key=0EslTlbi7B4Ku3aF3ZUX~RasMmsopawC765VCALvAbQ~AtrwLTQ2FbzG10Th98Ty7CssCwe6GNapm5H0XwEICs6kNEZDIXilyZuRJ0uXuu2d`
  let data = fetch(url)
  data.then((response)=>{
    try{
      return response.json()
    }catch(e){
      console.log(e)
    }
  }).then((result)=>{
    try{
      let resources = result.resourceSets[0].resources[0].geocodePoints[0].coordinates
      getWeatherData(resources[0], resources[1]);
    }catch(e){
      console.log(e);
    }
  })
}


let userInputLocation = document.getElementById("location-input");
userInputLocation.addEventListener("keypress", (event) => {
  let keyCodes = event.keyCode ? event.keyCode : event.which;
  if (keyCodes === 13) {
    event.preventDefault();
    forwardGeocoding(userInputLocation.value)
    userInputLocation.value = "";
  }
});


function getLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  getWeatherData(latitude, longitude);
}

function permissionDenied() {
  console.log("Permission is denied");
  getWeatherData(28.6139, 77.209);
}

window.onload = async () => {
  navigator.geolocation.getCurrentPosition(getLocation, permissionDenied);
};

let getWeatherData = async (latitude, longitude) => {
  let clientLocation = document.getElementById("client-location");
  let weatherType = document.getElementById("weather-type");
  let currentTemperature = document.getElementById("temperature-value");
  let maxTemperature = document.getElementsByClassName("max-temp-value")[0];
  let minTemperature = document.getElementsByClassName("min-temp-value")[0];
  let currentWeatherIcon = document.getElementsByClassName("weather-icon")[0];
  let extraWeatherParameters = document.getElementsByClassName(
    "extraWeatherParameters"
  )[0];
  let currentFeelsLikeTempValue = document.getElementsByClassName(
    "feels-like-temp-value"
  )[0];
  let weatherAttributeValues =
    document.getElementsByClassName("attribute-value");
  let hourlyForecast = document.getElementsByClassName("hourlyForecast")[0];
  let data = fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=54738615f3dd4ef9a56161156232707&q=${latitude}%2C+${longitude}`
  );
  data
    .then((response) => {
      return response.json();
    })
    .then((value) => {
      let forecastWeatherValues = value.forecast.forecastday[0];
      clientLocation.innerText = `${value.location.name}, ${value.location.region}`;
      weatherType.innerText = value.current.condition.text;
      currentTemperature.innerText = `${value.current.temp_c}°`;
      maxTemperature.innerText = `${forecastWeatherValues.day.maxtemp_c}°`;
      minTemperature.innerText = `${forecastWeatherValues.day.mintemp_c}°`;
      currentWeatherIcon.src = value.current.condition.icon;
      extraWeatherParameters.firstElementChild.innerText = `Weather in ${value.location.name}`;
      currentFeelsLikeTempValue.innerText = `${value.current.feelslike_c}°`;
      weatherAttributeValues[0].innerText = `${value.current.wind_kph} Km/h`;
      weatherAttributeValues[1].innerText = `${value.current.humidity}%`;
      weatherAttributeValues[2].innerText = `${value.current.pressure_mb}`;
      weatherAttributeValues[3].innerText = `${value.current.vis_km} Km`;
      weatherAttributeValues[4].innerText = value.current.uv;
      weatherAttributeValues[5].innerText = `${forecastWeatherValues.day.daily_chance_of_rain}%`;
      weatherAttributeValues[6].innerText = value.current.precip_mm;
      weatherAttributeValues[7].innerText = `${value.current.gust_kph} Km/h`;
      let hourlyForecastInnerHTML = "<h3>Hourly Forecasts</h3>";
      for (let attribute of forecastWeatherValues.hour) {
        hourlyForecastInnerHTML += `<div class="forecasts">
        <div class="forecast-container">
            <span class = "forecast-time">${attribute.time.split(" ")[1]}</span>
            <span class = "forecast-temp">${attribute.temp_c}°</span>
            <div class = "forecast-weather">
                <img src="${
                  attribute.condition.icon
                }" alt="" class = "cloud-icon">
                <span class = "forecast-weather-type">${
                  attribute.condition.text
                }</span>
            </div>
            <div class = "rain-forecast">
                <img src="Images/rain.png" alt="" class = "rain-icon">
                <span class="forecasts-rain-possibility">${
                  attribute.chance_of_rain
                }%</span>
            </div>
        </div>
    </div>`;
      }
      hourlyForecast.innerHTML = hourlyForecastInnerHTML;
    });
};

// getWeatherData("27.1766701", "78.0080745");
