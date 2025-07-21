import { motion } from "framer-motion";

export default function WeatherCard({ city }) {
  if (!city) {
    return (
      <div className="bg-gray-100 p-5 rounded-xl shadow-md animate-pulse w-full sm:w-60 mx-auto">
        <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-4" />
        <div className="h-20 w-20 bg-gray-300 rounded-full mx-auto mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto" />
          <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto" />
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto" />
          <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-5 rounded-xl shadow-md text-center space-y-2 w-full sm:w-60 mx-auto hover:shadow-lg transition"
    >
      <h3 className="font-bold text-xl text-green-700">{city.name}</h3>

      <div className="flex justify-center">
        <img
          src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`}
          alt={`Weather in ${city.name}: ${city.desc}`}
          className="w-20 h-20"
        />
      </div>

      <p className="text-lg font-medium">🌡 {city.temp}°C</p>
      <p className="text-gray-700">☁️ {city.desc}</p>
      <p className="text-gray-700">💧 {city.humidity}% Humidity</p>
      <p className="text-gray-700">🌬 {city.wind} m/s Wind</p>
    </motion.div>
  );
}
