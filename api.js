async function getWeather({ apiKey, city, countryCode }) {
  const query = `${city},${countryCode}&appid=${apiKey}&units=metric`;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}`;
  const response = await fetch(url);
  return response.ok
    ? await response.json()
    : {
        errorMessage:
          response.status === 404
            ? "Could not find country or city"
            : "An error occured",
      };
}
