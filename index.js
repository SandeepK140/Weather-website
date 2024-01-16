const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


const API = "d5068789fcdce0e990ae0bccf7eacc0b";

// whenever i open the app it open in usertab

let currentTab = userTab; 
currentTab.classList.add("current-tab");  
getfromSessionStorage(); // if any coordinates are present than we see the weather info of user

userTab.addEventListener("click",() => {
    //pass clicked tab as input parameter in below fn:
    switchTab(userTab); 
});

searchTab.addEventListener("click",() => {
    //pass clicked tab as input parameter in below fn:
    switchTab(searchTab); 
});

function switchTab (clickedTab) {
    if (clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){ // check if search form is visible or invisible if it is invisible than make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        else{
            // now i am at your weather tab so we have make it visible
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // first we check local storage for coordinates, whether we had saved it or not?

            getfromSessionStorage();
        }
    }
}

function getfromSessionStorage() {// check coordinates in local storage

    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }

    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates); // fn to get weather info from using api call 
    }

}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active"); // making loading screen visible

    // api call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`);

        const data = await response.json;

        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");

        renderWeatherInfo(data); // fn to extract info(temp,country,etc) from data and update it on UI

    } catch (error) {
        loadingScreen.classList.remove();
        //hw
        console.log("error recieved",error);
    }
}

function renderWeatherInfo(weatherInfo){
    // firstly, we have to fetch elements where we want to update on calling this fn
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-coutryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");;

    console.log(weatherInfo);

    // fetch values from weatherInfo object then put it in UI

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = (weatherInfo?.main?.temp); // have to change in celcius
    windspeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;
}

function getLocation(){
    if(navigator.geolocation){//check browser support geolocation or not
        navigator.geolocation.getCurrentPosition(showPosition); // showposition is a callback function which executed after gathering locations.
    }
    else{
        alert("Browser does not support geolocation.")
    }
}

function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));

    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAcess]");
grantAccessButton.addEventListener("click",getLocation);// get location fn return coordinates of user

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => { //It takes an event object e as its parameter.
    e.preventDefault(); //This ensures that the form does not reload the page when submitted

    let cityName = searchInput.Value;  
{/* 
    - maximum value they can expect within a given range.
    - You’ll typically find aria-valuemax in elements like:
        -> input type="range"
        -> progress
        -> meter 
*/}

    if(cityName === ""){
        return;
    }else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo (city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}`);
        const data = await response.json;
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    } catch (error) {
        console.log("Error has been found",error);
    }
}
