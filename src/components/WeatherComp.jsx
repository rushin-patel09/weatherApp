import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SearchSvg from "../assets/search.svg";
import Fuse from "fuse.js";
import Data from "../citiesList.json";
import SunPng from '../assets/sun.png';
import MoonPng from '../assets/moon.png';

const WeatherComp = () => {
  const [searchCity, setSearchCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [err, setErr] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const getWeather = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${searchCity}`
      );
      setWeather(response.data);
      setSearchCity("");
    } catch (erro) {
      console.error("Error:", erro);
      setErr("Searched city not found");
      setWeather(null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebounceSearch(searchCity), 500);
    return () => {
      clearTimeout(timer);
    };
  }, [searchCity]);

  const fuse = new Fuse(Data, {
    keys: ["id", "cityName"],
  });

  const results = useMemo(() => fuse.search(debounceSearch), [debounceSearch]);

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setShowSuggestions(false);
  };

  return (
    <div className="flex items-center flex-col p-[20px]">
      <h1 className="text-5xl font-black text-white py-[50px]">Weather App</h1>
      <form
        onSubmit={getWeather}
        className="p-1.5 flex justify-center relative group"
      >
        <input
          className="placeholder-gray-400 placeholder:text-base placeholder:leading-tight leading-tight box-border rounded-full w-[80dvw] max-w-[496px] min-w-[300px] h-[45px] bg-white pl-6.5 text-[#808080] text-lg font-bold focus:outline-2 focus:outline-[#84d2ff] transition-all focus:scale-[1.1] placeholder:animate-none"
          type="text"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Enter city"
          required
        />
        {debounceSearch.length >= 1 && showSuggestions && (
          <ul className="absolute top-[70px] bg-white w-[80dvw] max-w-[515px] min-w-[300px] py-2.5 px-4 rounded-b-2xl max-[376px]:w-[300px] rounded-2xl outline-2 outline-[#84d2ff]">
            {showSuggestions &&
              results !== "" &&
              results
                .map((e) => (
                  <li key={e.item.id} className="font-medium text-[#808080]">
                    {e.item.cityName}
                  </li>
                ))
                .slice(0, 5)}
          </ul>
        )}
        <button className="bg-[#8ACFF9] max-w-[30px] rounded-full absolute right-3.5 top-3.5 z-1 p-1 group-hover:scale-[1.2] transition-all">
          <img
            src={SearchSvg}
            className="h-[22px] invert-100 brightness-0 hover:rotate-28 transition-transform"
          />
        </button>
      </form>
      {err && <p>{err}</p>}
      {weather && (
        <>
          <div className="w-[80dvw] max-w-[496px] min-w-[300px] h-max bg-white my-5 rounded-2xl py-5 px-5 text-center">
            <h2 className="text-[#8ACFF9] text-4xl font-bold pb-1">
              {weather.location.name}
            </h2>
            <h3 className="text-[#c5c5c5] text-[10px] font-bold pb-2.5">{`${weather.location.region}, ${weather.location.country}`}</h3>

            <p className="text-[#8ACFF9] text-sm font-bold pb-1.5">
              Temperature : {weather.current.temp_c} °C
            </p>
            <p className="text-[#8ACFF9] text-sm font-bold pb-1.5">
              Temperature Feels-like : {weather.current.feelslike_c} °C
            </p>
            <p className="text-[#8ACFF9] text-sm font-bold pb-1.5 flex justify-center items-center">
              Weather : {weather.current.condition.text} <img src={weather.current.condition.icon} alt="Weather" className="w-[25px]" />
            </p>
            <p className="text-[#8ACFF9] text-sm font-bold pb-1.5">
              Humidity : {weather.current.humidity}%
            </p>
            <p className="text-[#8ACFF9] text-sm font-bold pb-1.5">
              Wind Speed : {weather.current.wind_kph} Km/h
            </p>
            <p className="text-[#8ACFF9] text-sm font-bold pb-1.5">
              Wind Direction :{" "}
              {(() => {
                switch (weather.current.wind_dir) {
                  case "W":
                    return "West (270°)";
                  case "NW":
                    return "Northwest (315°)";
                  case "S":
                    return "South (180°)";
                  case "SW":
                    return "Southwest (225°)";
                  case "E":
                    return "East (90°)";
                  case "SE":
                    return "Southeast (135°)";
                  case "N":
                    return "North(0°)";
                  case "NE":
                    return "Northeast (315°)";
                  case "NNE":
                    return "North-Northeast (22.5°)";
                  case "ENE":
                    return "East-Northeast (67.5°)";
                  case "ESE":
                    return "East-Southeast (112.5°)";
                  case "SSE":
                    return "South-Southeast (157.5°)";
                  case "SSW":
                    return "South-Southwest (202.5°)";
                  case "WSW":
                    return "West-Southwest (247.5°)";
                  case "WNW":
                    return "West-Northwest (292.5°)";
                  case "NNW":
                    return "North-Northwest (337.5°)";
                  default:
                    return <div>Unknown status</div>;
                }
              })()}
            </p>
            <p className="text-[#8ACFF9] text-sm font-bold pb-1.5 flex items-center justify-center">
              Day/Night : {weather.current.is_day === 1 ? <>Day<img src={SunPng} alt="icon" className="w-[25px] pl-1" /> </> : <>Night<img src={MoonPng} alt="icon" className="w-[25px] pl-1" /> </>}
            </p>

            <span className="text-[#c5c5c5] text-[8px] font-bold pb-2.5">
              Last Updated : {weather.current.last_updated}
            </span>
          </div>

          <div className="w-[80dvw] max-w-[496px] min-w-[300px] h-max bg-white rounded-2xl py-5 px-5 text-center">
            <h3 className="text-[#8ACFF9] text-2xl font-bold pb-0.5">
              Forecast Today
            </h3>
            <h4 className="text-[#c5c5c5] text-[10px] font-bold pb-2.5">
              {weather.forecast.forecastday[0].date}
            </h4>
            <p className="text-[#8ACFF9] text-sm font-bold pb-1.5">
              Sunrise : {weather.forecast.forecastday[0].astro.sunrise}
            </p>
            <p className="text-[#8ACFF9] text-sm font-bold pb-1.5">
              Sunset : {weather.forecast.forecastday[0].astro.sunset}
            </p>
            <p className="text-[#8ACFF9] text-sm font-bold pb-1.5">
              Max Temperature : {weather.forecast.forecastday[0].day.maxtemp_c}{" "}
              °C
            </p>
            <p className="text-[#8ACFF9] text-sm font-bold pb-1.5">
              Min Temperature : {weather.forecast.forecastday[0].day.mintemp_c}{" "}
              °C
            </p>
            <p className="text-[#8ACFF9] text-sm font-bold pb-1.5">
              Avg Temperature : {weather.forecast.forecastday[0].day.avgtemp_c}{" "}
              °C
            </p>
            <p className="text-[#8ACFF9] text-sm font-bold pb-1.5">
              Avg Wind Speed : {weather.forecast.forecastday[0].day.maxwind_kph}{" "}
              Km/h
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherComp;
