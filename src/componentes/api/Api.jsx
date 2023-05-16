import { useState } from "react";
import "./Api.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import umidade from "../../assets/humidade.png"

const api = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
});

function Api() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState({});
  const [weatherData, setWeatherData] = useState([]);

  const handleSearch = async () => {
    try {
      if (search === "") {
        throw new Error("Digite o nome da cidade");
      }

      const response = await api.get(
        "/forecast?q=" +
          search +
          "&units=metric&appid=d8b10ec6dd463ba69b316f005d1ccb2c&lang=pt_br"
      );

      setCity(response.data.city);
      setWeatherData(
        response.data.list
          .filter((data, index) => [0, 7, 15, 23, 31].includes(index))
          .map((data) => {
            const date = new Date(data.dt * 1000);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const formattedDate = `${day < 10 ? "0" : ""}${day}-${
              month < 10 ? "0" : ""
            }${month}-${year}`;

            const iconCode = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

            return {
              date: formattedDate,
              temperature_max: data.main.temp_max,
              temperature_min: data.main.temp_min,
              humidty: data.main.humidity,
              condition: data.weather[0].description,
              iconUrl: iconUrl,
            };
          })
      );

      setSearch("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="Api">
      <div className="title">
        <h1>Weather API</h1>
      </div>
      <div className="busca">
        <input
          type="text"
          placeholder="Digite o nome da cidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Pesquisar</button>
      </div>
      <br></br>
      <h1 className="City">{city.name}</h1>
      {Object.keys(city).length !== 0 && (
        <div className="main">
          {weatherData.map((data) => (
            <div className="card">
              <div key={data.date} className="card-body">
                <h5 className="card-title">{data.date}</h5>
                <br />
                <p className="card-text">
                  <div className="temp">
                    <div className="max">{data.temperature_max}°C</div>
                    <div className="min">{data.temperature_min}°C</div>
                  </div>
                  <br />
                  <div className="condition">
                    <div className="data_condition">{data.condition}</div>
                    <img src={data.iconUrl} alt={data.condition}></img>
                  </div>
                  <br />
                  <div className="humidty">
                    <img src={umidade} alt="Humidty-simbol"></img>
                    <p>{data.humidty}%</p>
                  </div>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Api;
