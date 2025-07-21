import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const BACKEND_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const defaultCities = ["Delhi", "Pune", "Nagpur", "Lucknow", "Indore"];

export default function Home() {
  const [weatherData, setWeatherData] = useState([]);
  const [customCity, setCustomCity] = useState("");
  const [customCityWeather, setCustomCityWeather] = useState(null);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch weather for one city
  const fetchWeather = async (city) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e5a38898ac3f9e33f6b1ec32b12bf374`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      return {
        name: data.name,
        temp: Math.round(data.main.temp - 273.15),
        desc: data.weather[0].description,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        icon: data.weather[0].icon,
      };
    } catch (err) {
      console.error("Failed to fetch weather for:", city, err);
      return null;
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      AOS.init({ duration: 1000 });

      const weather = await Promise.all(defaultCities.map(fetchWeather));
      setWeatherData(weather);

      try {
        const res = await fetch(`${BACKEND_BASE}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCustomCityWeather(null);

    if (!customCity.trim()) return;

    const result = await fetchWeather(customCity.trim());
    result ? setCustomCityWeather(result) : setError("City not found.");
  };

  return (
    <div className="bg-green-50 min-h-screen text-gray-800">
      {/* Hero */}
      <section className="bg-green-600 text-white text-center py-12 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to FarmersMarket</h1>
        <p className="text-lg mx-auto max-w-2xl">
          Your trusted platform for trading, weather updates, and natural farming.
        </p>
        <Link
          to="/register"
          className="mt-6 inline-block bg-white text-green-600 font-semibold px-6 py-3 rounded hover:bg-green-100"
        >
          Get Started
        </Link>
      </section>

      {/* Weather Updates */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6">🌦 Weather Update (Agro Cities)</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {weatherData.map((city) =>
            city ? (
              <div
                key={city.name}
                className="bg-white rounded shadow p-4 text-center border hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold">{city.name}</h3>
                <img
                  src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`}
                  alt={city.desc}
                  className="w-16 h-16 mx-auto"
                />
                <p className="capitalize text-sm text-gray-700">{city.desc}</p>
                <p className="text-sm">🌡 {city.temp}°C</p>
                <p className="text-sm">💧 {city.humidity}%</p>
                <p className="text-sm">🌬 {city.wind} m/s</p>
              </div>
            ) : null
          )}
        </div>

        <h2 className="text-xl font-bold mb-4">🔍 Check Weather in Your City</h2>
        <form onSubmit={handleSubmit} className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter city name..."
            value={customCity}
            onChange={(e) => setCustomCity(e.target.value)}
            className="sm:w-64 w-full border border-gray-300 px-4 py-2 rounded focus:outline-none"
          />
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Get Weather
          </button>
        </form>

        {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}

        {customCityWeather && (
          <div className="max-w-sm mx-auto bg-white p-4 rounded text-center shadow border">
            <h3 className="text-lg font-semibold">{customCityWeather.name}</h3>
            <img
              src={`https://openweathermap.org/img/wn/${customCityWeather.icon}@2x.png`}
              alt={customCityWeather.desc}
              className="w-16 h-16 mx-auto"
            />
            <p className="capitalize text-sm text-gray-700">{customCityWeather.desc}</p>
            <p className="text-sm">🌡 {customCityWeather.temp}°C</p>
            <p className="text-sm">💧 {customCityWeather.humidity}%</p>
            <p className="text-sm">🌬 {customCityWeather.wind} m/s</p>
          </div>
        )}
      </section>

      {/* Rooted in Nature */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-4">🌿 Rooted in Nature</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            We believe food should be clean, real, and grown with love. Our
            farm-to-table organic model connects consumers with fresh, seasonal
            produce straight from farmers who care for the earth.
          </p>
          <img
            src="https://www.shutterstock.com/shutterstock/photos/2034625139/display_1500/stock-photo-smart-woman-farmer-agronomist-using-digital-tablet-for-examining-and-inspecting-quality-control-of-2034625139.jpg"
            alt="Organic Farm"
            className="rounded-lg shadow-lg mx-auto mb-6 w-full max-w-4xl"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left mt-10">
            {[
              {
                icon: "🌾",
                title: "From Our Fields",
                desc: "Our crops are nurtured using natural compost and traditional farming wisdom.",
              },
              {
                icon: "🍅",
                title: "No Chemicals, No Compromise",
                desc: "We don’t use synthetic fertilizers or pesticides — just sunshine, soil, and sustainability.",
              },
              {
                icon: "🚜",
                title: "Direct to You",
                desc: "Get fresh veggies, grains, and herbs delivered straight from farm to your kitchen.",
              },
            ].map((card, idx) => (
              <div key={idx} className="bg-green-50 p-6 rounded shadow hover:shadow-md transition">
                <h4 className="text-xl font-semibold mb-2 text-green-700">
                  {`${card.icon} ${card.title}`}
                </h4>
                <p className="text-sm text-gray-700">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">🌾 Featured Farm Offerings</h2>
          {loading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No products available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const isAvailable = product.quantity > 0;

                return (
                  <div
                    key={product._id}
                    className="border rounded shadow p-4 bg-green-90 hover:shadow-md transition"
                  >
                    <img
                      src={product.imageUrl || "/default-produce.jpg"}
                      alt={`${product.name || "Farm product"} image`}
                      onError={(e) => (e.target.src = "/default-produce.jpg")}
                      className="h-40 w-full object-cover rounded mb-3"
                    />
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-700">
                      {product.description?.slice(0, 60)}...
                    </p>
                    <p className="text-green-700 font-bold mt-2">
                      ₹{product.price} / kg
                    </p>
                    <div className="mt-2">
                      {isAvailable ? (
                        <p className="text-sm text-gray-600 font-medium">
                          Stock: {product.quantity} kg available
                        </p>
                      ) : (
                        <span className="inline-block bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-semibold">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="text-center py-12 bg-green-600 text-white">
        <h2 className="text-2xl font-bold">
          Join our community of farmers and buyers today!
        </h2>
        <Link
          to="/register"
          className="mt-4 inline-block bg-white text-green-600 font-semibold px-6 py-2 rounded hover:bg-green-100"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
}
