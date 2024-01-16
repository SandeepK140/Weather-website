let API = 'd5068789fcdce0e990ae0bccf7eacc0b'
console.log("heloo bhia kaise ho")


async function fetchWeatherData(){

    try {
        let city = "goa";
        let lat=15.3333;
        let lon=74.0833;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`);
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}`);
        const data =await response.json();
        console.log("response generated ->",data);
    } catch (error) {
        console.log("error generated",error);
    }
}


console.log(fetchWeatherData());