import React, { useState } from "react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiKey = import.meta.env.VITE_API_KEY;

const App = () => {
  const [search, setSearch] = useState("");
  const [timeoutId, setTimeoutId] = useState();
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [weather, setWeather] = useState({});
  const [isCelcius, setIsCelcius] = useState(true);

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    clearTimeout(timeoutId);

    const getResults = async () => {
      const res = await axios.get(
        `${baseUrl}/search.json?key=${apiKey}&q=${search}`
      );

      console.log(res.data);
      setResults(res.data);
    };

    const timeout = setTimeout(async () => {
      if (search) {
        await getResults();
      }
    }, 500);

    setTimeoutId(timeout);
  };

  const handleSetWeather = async (url) => {
    setShowResults(false);

    const current = await axios.get(
      `${baseUrl}/current.json?key=${apiKey}&q=${url}&aqi=no`
    );

    const forecast = await axios.get(
      `${baseUrl}/forecast.json?key=${apiKey}&q=${url}&days=6&aqi=no&alerts=no`
    );

    setWeather({ ...current.data, ...forecast.data });
    console.log(weather);
  };

  return (
    <div>
      <nav className="flex flex-col gap-2 sm:gap-0 sm:flex-row items-center justify-between bg-[#264653] p-3 py-2 sm:p-6 sm:py-4 min-w-fit">
        <div className="flex items-center text-white mr-6">
          <svg
            className="fill-current h-8 w-8 mr-2"
            width="54"
            height="54"
            viewBox="0 0 54 54"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
          </svg>
          <span className="font-semibold text-xl min-w-max">Weather App</span>
        </div>

        <div className="flex flex-col items-center bg-white rounded-full pl-5 h-8 sm:mr-10">
          <input
            placeholder="Search for a city..."
            className="flex-1 rounded-full focus:outline-none"
            value={search}
            onChange={handleSearch}
            onFocus={() => setShowResults(true)}
          />
        </div>

        <div
          className="results absolute top-24 sm:top-20 sm:right-14 text-sm bg-black rounded-lg w-64 overflow-hidden"
          style={{ display: showResults ? "block" : "none" }}
        >
          {results.map((result) => (
            <div
              key={result.id}
              onClick={() => handleSetWeather(result.url)}
              className="flex flex-col justify-center text-white p-2 hover:bg-[#264653] hover:cursor-pointer border-b"
            >
              {`${result.name},${result.region},${result.country}`}
            </div>
          ))}
        </div>
      </nav>

      <div
        onClick={() => setShowResults(false)}
        className="flex flex-col min-h-[80vh] p-4 md:p-7 pt-16"
      >
        {weather.location && (
          <div className="flex flex-col justify-center items-center">
            <div>
              <span className="text-xl font-semibold">
                {`${weather.location.name}, ${weather.location.region}, ${weather.location.country}`}
              </span>
            </div>

            <div className="flex items-center gap-1 flex-col sm:flex-row justify-center">
              <div className="flex items-center">
                <img
                  className="w-20 h-20"
                  src={weather.current.condition.icon}
                  alt="weather icon"
                />

                <span className="text-3xl font-semibold">
                  {isCelcius ? weather.current.temp_c : weather.current.temp_f}
                  <span
                    className={`cursor-pointer ${
                      isCelcius ? "text-blue-500" : ""
                    }`}
                    onClick={() => setIsCelcius(true)}
                  >
                    °C
                  </span>
                  /
                  <span
                    className={`cursor-pointer ${
                      !isCelcius ? "text-blue-500" : ""
                    }`}
                    onClick={() => setIsCelcius(false)}
                  >
                    °F
                  </span>
                </span>
              </div>

              <div className="flex justify-center items-center">
                <div className="text-xs flex flex-col pl-4">
                  <span>{`Conditons: ${weather.current.condition.text}`}</span>
                  <span>
                    {isCelcius
                      ? `Min: ${weather.forecast.forecastday[0].day.mintemp_c}°C`
                      : `Min: ${weather.forecast.forecastday[0].day.mintemp_f}°F`}
                  </span>
                  <span>
                    {isCelcius
                      ? `Max: ${weather.forecast.forecastday[0].day.maxtemp_c}°C`
                      : `Max: ${weather.forecast.forecastday[0].day.maxtemp_f}°F`}
                  </span>
                </div>

                <div className="text-xs flex flex-col pl-4">
                  <span>{`Humidity: ${weather.current.humidity}%`}</span>
                  <span>{`Wind: ${weather.current.wind_kph}kph ${weather.current.wind_dir}`}</span>
                  <span>
                    {`Time: ${weather.location.localtime.split(" ")[1]}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {weather.forecast && (
          <div className="flex flex-row flex-wrap gap-10 items-center justify-center mt-16">
            {weather.forecast.forecastday.map((day, index) => {
              if (index === 0) return null;
              return (
                <div key={day.date} className="flex flex-col items-center">
                  <span className="text-xl font-semibold">
                    {day.date.split("-").reverse().join("-")}
                  </span>
                  <img
                    className="w-16 h-16"
                    src={day.day.condition.icon}
                    alt="weather icon"
                  />
                  <span className="text-lg">
                    {isCelcius
                      ? `${day.day.avgtemp_c}°C`
                      : `${day.day.avgtemp_f}°F`}
                  </span>
                  <span className="text-lg">{day.day.condition.text}</span>
                </div>
              );
            })}
          </div>
        )}

        {!weather.location && (
          <div className="flex flex-col justify-center items-center mt-16">
            <span className="text-3xl font-semibold">
              Search for a city to get started !!!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
