//Creating a weather object
const testWeather = {
    "locationName": "Tampa",
    "countryCode": "USA",
    "description": "Cloudy",
    "temperature": "28.5",
    "feelsLike": "69",
    "windSpeed": "0",
    "humidity": "99"
}

API_KEY = "de9f90ef3c71ac9d3628087d36d76ff5";

//Functions
async function GetCords(name){
    try{
        //Fetching Longitude and Laditude of Location name using Geocoding API
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`, {mode: "cors"});
        //Translating response gibberish into a JavaScript Object 
        const data = await response.json();        
        // console.log(data);
        // console.log(data[0].lat);
        // console.log(data[0].lon);

        //creating new object to store latitude and longitude
        const latlon = {
            lat: data[0].lat,
            lon: data[0].lon
        }
        return latlon;
    }catch {}
}

async function GetCurrentWeather(lat, lon){
    try{
        //calling OpenWeather API
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`, {mode: "cors"});        
        //console.log(response);
        const weatherData = await response.json();
        return weatherData;
    }catch (error) {
        console.error(error);
    }
}

async function Weather(name){
    try{
        const coordinates = GetCords(name);
        const data = await GetCurrentWeather((await coordinates).lat, (await coordinates).lon);

        const locationName = data.name;
        const countryCode = data.sys.country;
        const description = data.weather[0].description;
        const temperature = (data.main.temp - 273.15).toFixed(2);
        const feelsLike = (data.main.feels_like - 273.15).toFixed(2);
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;
        return {
            locationName,
            countryCode,
            description,
            temperature,
            feelsLike,
            windSpeed,
            humidity
        }
    }catch (error) {
        return error;
    }
}

const renderWeatherCompenents = (weatherObj) => {
    console.debug(weatherObj);
    //Making main element object
    const main = document.createElement("main");
    document.querySelector("body").appendChild(main);

    //Making textbox for location and parenting it to main element
    const locationName = document.createElement("h1");
    locationName.textContent = `${weatherObj.locationName}, ${weatherObj.countryCode}`;
    //accesing CSS Style 
    locationName.id = 'location';
    main.appendChild(locationName);

    //Making text for description of weather and parenting it to main element
    const description = document.createElement("h2");
    description.textContent = `${weatherObj.description}`;
    //accesing CSS Style 
    description.id = 'description';
    main.appendChild(description);

    //Creating a divider to set text below main text
    const bottomContainer = document.createElement("div");
    bottomContainer.id = 'bottomContainer';
    main.appendChild(bottomContainer);

    //Left side divider 
    const leftSide = document.createElement("div");
    leftSide.id = 'leftSide';
    bottomContainer.appendChild(leftSide);

    const temperature = document.createElement("h2");
    temperature.id = 'temperature';
    temperature.textContent = `${weatherObj.temperature}`;
    leftSide.appendChild(temperature);

    const units = document.createElement("h4");
    units.id = "units";
    units.textContent = "°C";
    leftSide.appendChild(units);

    //Right side Divider
    const rightSide = document.createElement("div");
    rightSide.id = 'rightSide';
    bottomContainer.appendChild(rightSide);

    const feelsLike = document.createElement("p");
    feelsLike.id = 'feelsLike';
    feelsLike.textContent = `Feels like: ${weatherObj.feelsLike}°C`;
    rightSide.appendChild(feelsLike);

    const windSpeed = document.createElement("p");
    windSpeed.id = 'wind';
    windSpeed.textContent = `Wind: ${weatherObj.windSpeed}`;
    rightSide.appendChild(windSpeed);

    const humidity = document.createElement("p");
    humidity.id = 'humidity';
    humidity.textContent = `Humidity: ${weatherObj.humidity}%`;
    rightSide.appendChild(humidity);
}

async function render (weatherObject, first = false){
    const weatherData = await weatherObject;

    if (first == true){
        renderWeatherCompenents(weatherData)
    }
    else {
        document.querySelector("main").remove();
        document.querySelector("input").value = "";
        renderWeatherCompenents(weatherData)
    }
}


document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
    render(Weather(document.querySelector("input").value))
});


render(Weather("Tampa"), true)
//render(testWeather,true);
