export default function WeatherCard({ city }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h3 className="font-semibold text-lg">{city.name}</h3>
      <img
        src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`}
        alt={city.desc}
        className="w-16 h-16 mx-auto"
      />
      <p>🌡 {city.temp}°C</p>
      <p>☁️ {city.desc}</p>
      <p>💧 {city.humidity}% humidity</p>
      <p>🌬 {city.wind} m/s wind</p>
    </div>
  );
}
