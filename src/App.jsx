import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SearchSvg from "./assets/search.svg";
import Fuse from "fuse.js";
import Data from "./citiesList.json";

const App = () => {
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
          className="box-border rounded-full w-[80dvw] max-w-[496px] min-w-[300px] h-[45px] bg-white pl-6.5 text-[#808080] text-lg font-bold focus:outline-2 focus:outline-[#84d2ff] transition-all"
          type="text"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Enter city"
          required
        />
        {debounceSearch.length >= 1 && showSuggestions && (
          <ul
            className="absolute top-[70px] bg-white w-[80dvw] max-w-[515px] min-w-[300px] py-2.5 px-4 rounded-b-2xl max-[376px]:w-[300px] rounded-2xl outline-2 outline-[#84d2ff]"
          >
            {showSuggestions &&
              results !== "" &&
              results
                .map((e) => <li key={e.item.id} className="font-medium text-[#808080]">{e.item.cityName}</li>)
                .slice(0, 5)
            }
          </ul>
        )}
        <button className="bg-[#8ACFF9] max-w-[30px] rounded-full absolute right-3.5 top-3.5 z-1 p-1 group-hover:scale-[1.2] transition-all"><img src={SearchSvg} className="h-[22px] w-full invert-100 brightness-0 hover:rotate-28 transition-transform"/></button>
      </form>
      {err && <p>{err}</p>}
      {weather && (
        <div className="w-[80dvw] max-w-[496px] min-w-[300px] h-max bg-white my-5 rounded-2xl py-5 px-5 text-center">
          <h2 className="text-[#8ACFF9] text-4xl font-bold pb-1">
            {weather.location.name}
          </h2>
          <h3 className="text-[#c5c5c5] text-[10px] font-bold pb-2.5">{`${weather.location.region}, ${weather.location.country}`}</h3>
          <p className="text-[#8ACFF9] text-sm font-bold pb-1.5">
            Temperature: {weather.current.temp_c} °C
          </p>
          <p className="text-[#8ACFF9] text-sm font-bold pb-1.5">
            Weather: {weather.current.condition.text}
          </p>
          <p className="text-[#8ACFF9] text-sm font-bold pb-1.5">
            Humidity: {weather.current.humidity}%
          </p>
          <p className="text-[#8ACFF9] text-sm font-bold pb-1.5">
            Wind Speed: {weather.current.wind_kph} Km/h
          </p>
          <span className="text-[#c5c5c5] text-[8px] font-bold pb-2.5">
            Last Updated : {weather.current.last_updated}
          </span>
        </div>
      )}
    </div>
  );
};

export default App;
