const locationInput = document.getElementById('input');
const searchBtn = document.getElementById('searchBtn');
const validateInput = document.getElementById('validate');
const temp = document.getElementById('temp');
const time = document.getElementById('time');
const area = document.getElementById('area');
const currentLocationBtn = document.getElementById('currentLocation');
// const icon = document.getElementById('icon');
const weatherCondition = document.getElementById('weather-condition');
const deg = document.getElementById('deg');
// const loading = document.getElementById("loading");
const popup = document.getElementById("locationPopup");
const popupText = document.getElementById("popupText");
const retryBtn = document.getElementById("retryBtn");


async function getData(locationInput, lat, long) {
    const promise = await fetch(`https://api.weatherapi.com/v1/current.json?key=eae446bc3fc847189d171641261003&q=${locationInput}&aqi=yes`)
    return await promise.json();
}

// on search
searchBtn.addEventListener('click', async () => {
    const value = locationInput.value;
    if (value === '') {
        validateInput.innerText = 'Enter Location';
        locationInput.style.border = '2px solid red';
    }
    else {

        locationInput.style.border = '';
        validateInput.innerText = '';

        const data = await getData(value);
        const location = `${data.location.name}, ${data.location.region} - ${data.location.country}`;
        const localTime = `${data.location.localtime}`;
        const dateObj = new Date(localTime);
        const temperature = `${data.current.temp_c}`;
        // const icons = `${"https:" + data.current.condition.icon.replace("64x64", "128x128")}`;
        const weather_Condition = `${data.current.condition.text}`;
        temp.innerText = temperature;
        time.innerText = dateObj.toLocaleString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });;
        area.innerText = location;
        // icon.src = icons;
        weatherCondition.innerText = weather_Condition;
        setBackground(data);
        // console.log(data);
    }
})


async function getData(lat, long) {
    const promise = await fetch(`https://api.weatherapi.com/v1/current.json?key=eae446bc3fc847189d171641261003&q=${lat},${long}&aqi=yes`)
    return await promise.json();
}

// current location
async function gotCurrentLoaction(position) {
    const data = await getData(position.coords.latitude, position.coords.longitude);

    const location = `${data.location.name}, ${data.location.region} - ${data.location.country}`;
    const localTime = `${data.location.localtime}`;
    const dateObj = new Date(localTime);
    const temperature = `${data.current.temp_c}`;
    // const icons = `${"https:" + data.current.condition.icon.replace("64x64", "128x128")}`;
    const weather_Condition = `${data.current.condition.text}`;
    temp.innerText = temperature;
    time.innerText = dateObj.toLocaleString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
    area.innerText = location;
    // icon.src = icons;
    weatherCondition.innerText = weather_Condition;
    setBackground(data);
    // console.log(data);
    // loading.classList.add("hidden"); // hide loader

    popup.style.display = "none"; // hide popup
    locationInput.style.border = '2px solid black';
    validateInput.innerText = '';
    
}

async function failedCurrentLocation() {
    // validateInput.innerText = 'Error getting location';

    popup.style.display = "flex"; // ensure popup visible
    popupText.innerText = "Enable location to continue";
    retryBtn.classList.remove("hidden");

    retryBtn.onclick = () => {
        popupText.innerText = "Getting your location...";
        retryBtn.classList.add("hidden");

        navigator.geolocation.getCurrentPosition(
            gotCurrentLoaction,
            failedCurrentLocation,
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };
}

currentLocationBtn.addEventListener('click', async () => {

    popup.style.display = "flex"; // show popup
    popupText.innerText = "Getting your location...";
    retryBtn.classList.add("hidden");

    navigator.geolocation.getCurrentPosition(gotCurrentLoaction, failedCurrentLocation, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    });
    // loading.classList.remove("hidden"); // show loader

})

// onLoad

document.addEventListener('DOMContentLoaded', () => {
    navigator.geolocation.getCurrentPosition(gotCurrentLoaction, failedCurrentLocation, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    });
    // loading.classList.remove("hidden");
})


// dynamic backgrounds and icons
function setBackground(data) {
    const condition = data.current.condition.text.toLowerCase();
    const isDay = data.current.is_day;

    let bg = "";
    let icons = ""

    let conditionText = data.current.condition.text;
    if (!isDay && conditionText.toLowerCase().includes("sunny")) {
        conditionText = "Clear Night";
    }
    weatherCondition.innerText = conditionText;


    if (condition.includes('sunny') || condition.includes('clear')) {
        bg = isDay ? "sunny_bg.jpg" : 'night_bg.jpg';
        icons = isDay ? 'sunny.png' : 'moon.png';
    }
    else if (condition.includes('cloud') || condition.includes('overcast')) {
        bg = isDay ? 'cloudy_day.jpg' : 'cloudy_night.jpg';
        icons = isDay ? 'cloudy-day.png' : 'partly-cloudy-night.png';
    }
    else if (condition.includes('rain') || condition.includes('drizzle')
    ) {
        bg = isDay ? 'rain_day.jpg' : 'rain_night.jpg';
        icons = isDay ? 'rainy-day.png' : 'rainy-night.png';
    }
    else if (condition.includes("thunder") || condition.includes("storm")) {
        bg = isDay ? "thunderstorm_day.jpg" : "thunderstorm_night.jpg";
        icons = isDay ? 'lightening.png' : 'storm.png';
    }
    else if (condition.includes("snow") || condition.includes("blizzard") || condition.includes("ice")) {
        bg = isDay ? "snow_day.jpg" : "snow_night.jpg";
        icons = isDay ? 'snow.png' : 'snowflake.png';
    }
    else if (
        condition.includes("mist") ||
        condition.includes("fog") ||
        condition.includes("haze") ||
        condition.includes("smoke")
    ) {
        bg = isDay ? "mist_day.jpg" : "mist_night.jpg";
        icons = isDay ? "haze.png" : "foggy-night.png";
    }
    else {
        document.body.style.backgroundColor = 'black';
        icons = 'cloudy-day.png'
    }

    if (!isDay) {
        weatherCondition.style.color = 'White';
        temp.style.color = 'white';
        time.style.color = 'white';
        area.style.color = 'white';
        deg.style.color = 'white';
        // loading.style.color = 'white';
    }

    else {
        weatherCondition.style.color = 'gray';
        temp.style.color = 'black';
        time.style.color = 'gray';
        area.style.color = 'black';
        deg.style.color = 'black';
        // loading.style.color = 'gray';
    }

    document.body.style.backgroundImage = `url('images/weather-bg/${bg}')`;
    const icon = document.getElementById('icon');

    if (icon && icons) {
        icon.src = `images/weather-condition/${icons}`;
    }

}
