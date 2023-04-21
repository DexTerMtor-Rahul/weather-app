const temp = document.getElementById("temp"),
     date = document.getElementById("date-time"),
     currentLocation = document.getElementById("location"),
     condition = document.getElementById("condition"),
     rain = document.getElementById("rain"),
     mainIcon = document.getElementById("icon"),
     uvIndex = document.querySelector(".uv-index"),
     uvText = document.querySelector(".uv-text"), 
     windSpeed = document.querySelector(".wind-speed"), 
     sunRise = document.querySelector(".sunrise"), 
     sunSet = document.querySelector(".sunset"), 
     humidity = document.querySelector(".humidity"),
     visibility = document.querySelector(".visibility"), 
     airQuality = document.querySelector(".air-quality"), 
     airQualityStatus = document.querySelector(".air-quality-status"), 
     visibilityStatus = document.querySelector(".visibility-status"), 
     humidityStatus = document.querySelector(".humidity-status"),
     weatherCards = document.querySelector("#weather-cards"),
     celciusBtn = document.querySelector(".celcius"),
     faherenhiteBtn = document.querySelector(".faherenhite"),
     hourlyBtn = document.querySelector(".hourly"),
     weekBtn = document.querySelector(".week"),
     tempUnit = document.querySelectorAll(".temp-unit"),
     searchForm = document.querySelector("#search"),
     search = document.querySelector("#query");


let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "Week";


//update date and time
function getDateTime(){
     let now = new Date();
     hour = now.getHours();
     minute = now.getMinutes();

     let days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thrusday",
          "Friday",
          "Saturday"
     ];
     //for 12 hour formate
     hour = hour % 12;
     if(hour < 10){
          hour = "0" + hour;
     }
     if(minute < 10){
          minute = "0" + minute;
     }

     let dayString = days[now.getDay()];
     return `${dayString}, ${hour}:${minute}`;
}

date.innerText = getDateTime();
//update time every second
setInterval(()=>{
     date.innerText = getDateTime();
}, 1000);

//function to get public ip using fetch
function getPublicIp(){
     fetch('http://ip-api.com/json',{
          method: "GET",
     })
     .then((response) => response.json())
     .then((data) => {
          console.log(data);
          currentCity = data.city;
          getWeatherData("Warangal", currentUnit, hourlyorWeek);
     });
}
getPublicIp();


//function to get weather data
function getWeatherData(city, unit, hourlyorWeek){
     const apiKey = "9SCJLFD2VLT74KVLM27EB6K29";
     fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
          {
               method: "GET",
          }
     )
     .then((response) => response.json())
     .then((data) => {
          let today = data.currentConditions;
          if(unit === "c"){
               temp.innerText = Math.floor(today.temp);
          } else {
               temp.innerText = celciusToFahrenhite(today.temp);
          }
          currentLocation.innerText = data.resolvedAddress;
          condition.innerText = today.conditions;
          rain.innerText = "Perc - " + today.precip + "%";
          uvIndex.innerHTML = today.uvindex;
          windSpeed.innerText = today.windspeed;
          humidity.innerText = today.humidity + "%";
          visibility.innerText = today.visibility;
          airQuality.innerText = today.winddir;
          measureUvIndex(today.uvindex);
          updateHumiditystatus(today.humidity);
          updateVisibilityStatus(today.visibility);
          updateAirQualitystatus(today.winddir);
          sunRise.innerText = convertTimeTo12HourFormate(today.sunrise);
          sunSet.innerText = convertTimeTo12HourFormate(today.sunset);
          mainIcon.src = getIcon(today.icon);
          if(hourlyorWeek == "hourly"){
               updateForecast(data.days[0].hours, unit, "day");
          } else {
               updateForecast(data.days, unit, "week");
          }
     })
     .catch((err) => {
          alert("City not Found in our DataBase");
     })
}

//covert c to f
function celciusToFahrenhite(temp){
     return ((temp*9) / 5 + 32).toFixed(1);
}

//function to get uv index status
function measureUvIndex(uvIndex){
     if(uvIndex <= 2){
          uvText.innerText = "Low";
     } else if(uvIndex <= 5){
          uvText.innerText = "Moderate";
     } else if (uvIndex <= 7) {
          uvText.innerText = "High";
     } else if (uvIndex <= 10) {
          uvText.innerText = "Very High";
     } else {
          uvText.innerText = "Extreme";
     }
}

//function for update humidity
function updateHumiditystatus(humidity){
     if(humidity <= 30){
          humidityStatus.innerText = "Low";
     } else if(humidity <= 60){
          humidityStatus.innerText = "Moderate";
     } else {
          humidityStatus.innerText = "High";
     }
}

//funtion for visibility status
function updateVisibilityStatus(visibility){
     if(visibility <= 0.3){
          visibilityStatus.innerText = "Dense Fog";
     } else if (visibility <= 0.16) {
          visibilityStatus.innerText = "Moderate Fog";
     } else if (visibility <= 0.35) {
          visibilityStatus.innerText = "Light Fog";
     } else if (visibility <= 1.13) {
          visibilityStatus.innerText = "Very Light Fog";
     } else if (visibility <= 2.16) {
          visibilityStatus.innerText = "List Mist";
     } else if (visibility <= 5.4) {
          visibilityStatus.innerText = "Very Light Mist";
     } else if (visibility <= 10.8) {
          visibilityStatus.innerText = "Clear Air";
     } else {
          visibilityStatus.innerText = "Very Clear Air";
     }
}
//function for update air quality 
function updateAirQualitystatus(airQuality){
     if(airQuality <= 50){
          airQualityStatus.innerText = "Good";
     } else if (airQuality <= 100) {
          airQualityStatus.innerText = "Moderate";
     } else if (airQuality <= 150) {
          airQualityStatus.innerText = "Poor";
     } else if (airQuality <= 250) {
          airQualityStatus.innerText = "Very Poor";
     } else if (airQuality <= 250) {
          airQualityStatus.innerText = "Very Poor";
     } else {
          airQualityStatus.innerText = "Hazardous";
     }
}
//funtion for covert 24 hour time to 12 hour formate
function convertTimeTo12HourFormate(time){
     let hour = time.split(":")[0];
     let minute = time.split(":")[1];
     let ampm = hour >= 12 ? "pm" : "am";
     hour = hour % 12;
     hour = hour ? hour : 12;
     hour = hour < 10 ? "0" + hour : hour;
     minute = minute < 10 ? "0" + minute : minute;
     let setTime = hour + ":" + minute + " " + ampm;
     return setTime;
}
//function for icons according to weather
function getIcon(condition){
     if(condition === "Partly-cloudy-day"){
          return "./icons/animated/cloudy-day-3.svg"
     } else if (condition === "Partly-cloudy-night") {
          return "./icons/animated/cloudy-night-3.svg"
     } else if (condition === "rain") {
          return "./icons/animated/rainy-6.svg"
     } else if (condition === "clear-day") {
          return "./icons/animated/clear-day.svg"
     } else if (condition === "clear-night") {
          return "./icons/animated/clear-night.svg"
     } else {
          return "./icons/animated/clear-day.svg"
     }
}

function getDayName(date){
     let day = new Date(date);
     let days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thrusday",
          "Friday",
          "Saturday"
     ];
     return days[day.getDay()];
}

function getHour(time){
     let hour = time.split(":")[0];
     let min = time.split(":")[1];
     if(hour > 12){
          hour = hour  - 12;
          return `${hour}:${min} PM`;
     } else {
          return `${hour}:${min} AM`;
     }
}

function updateForecast(data, unit, type){
     weatherCards.innerHTML = "";

     let day = 0;
     let numCards = 0;
     if(type === "day"){
          numCards = 24;
     } else {
          numCards = 7;
     }
     for(let i = 0; i < numCards; i++){
          let card = document.createElement("div");
          card.classList.add("card");

          // hour if hourly time and day name if weekly
          let dayName = getHour(data[day].datetime); 
          if(type === "week"){
               dayName = getDayName(data[day].datetime);
          }
          let dayTemp = data[day].temp;
          if(unit === "f"){
               dayTemp = celciusToFahrenhite(data[day].temp);
          }
          let iconCondition = data[day].icon;
          let iconSrc = getIcon(iconCondition);
          let tempUnit = "°C";
          if(unit === "f"){
               tempUnit = "°F";
          }
          card.innerHTML = `

               <h2 class="day-name">${dayName}</h2>
               <div class="card-icon">
                    <img src="${iconSrc}" alt="" srcset="">
               </div>
               <div class="day-temp">
                    <h2 class="temp">${dayTemp} </h2>
                    <span class="temp-unit">${tempUnit}</span>
               </div>
          `;
          weatherCards.appendChild(card);
          day++;
     }
}

faherenhiteBtn.addEventListener("click" , () => {
     changeUnit("f");
})
celciusBtn.addEventListener("click", () => {
     changeUnit("c");
})

function changeUnit(unit){
     if(currentUnit !== unit){
          currentUnit = unit; 
          {
               tempUnit.forEach((elem) => {
                    elem.innerText = `°${unit.toUpperCase()}`;
               });
               if(unit === "c"){
                    celciusBtn.classList.add("active");
                    faherenhiteBtn.classList.remove("active");
               }
               else{
                    celciusBtn.classList.remove("active");
                    faherenhiteBtn.classList.add("active");
               }
               //call getWeatherData after change unit
               getWeatherData(currentCity, currentUnit, hourlyorWeek);
          }
     }
}

hourlyBtn.addEventListener("click", () => {
     changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
     changeTimeSpan("week");
});

function changeTimeSpan(unit){
     if(hourlyorWeek !== unit){
          hourlyorWeek = unit;
          if(unit === "hourly"){
               hourlyBtn.classList.add("active");
               weekBtn.classList.remove("active");
          }
          else{
               hourlyBtn.classList.remove("active");
               weekBtn.classList.add("active");
          }
          //update weather on time change
          getWeatherData(currentCity, currentUnit, hourlyorWeek);
     }
}

searchForm.addEventListener("submit" , (e) => {
     e.preventDefault();
     let location = search.value;
     if(location) {
          currentCity = location;
          getWeatherData(currentCity, currentUnit, hourlyorWeek);
     }
});


