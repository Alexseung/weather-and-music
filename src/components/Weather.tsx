import {useState} from 'react';
import CityName from '../cityName/CityName';

const WEATHER_API_KEY = 'f49cb1692b14fc74d69abb0f1f6a7a26';

const convertToEnglishCity = (kor: string): string => {
  const trimmed = kor.trim();
  return CityName[trimmed] || trimmed;
};

interface Props {
  onDescFetch: (desc: string) => void;
  onWeatherTextUpdate: (text: string) => void;
}

const Weather = ({onDescFetch, onWeatherTextUpdate}: Props) => {
  const [city, setCity] = useState('');

  const fetchWeather = async () => {
    const englishCity = convertToEnglishCity(city);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${englishCity}&appid=${WEATHER_API_KEY}&units=metric&lang=en`
      );

      if (!res.ok) throw new Error('도시 정보를 가져오지 못했습니다.');

      const data = await res.json();
      const desc = data.weather[0].description;
      const temp = data.main.temp;
      const name = data.name;
      const country = data.sys.country;

      onDescFetch(desc); // 유튜브 검색용
      onWeatherTextUpdate(`${name} (${country}) - ${desc}, ${temp}°C`);
    } catch (err) {
      console.error(err);
      onWeatherTextUpdate('날씨 정보를 가져올 수 없습니다.');
    }
  };

  return (
    <div className='p-4 max-w-md mx-auto text-center'>
      <h1 className='text-2xl font-bold mb-4 font-serif'>
        What mood are you in today?
      </h1>
      <input
        type='text'
        value={city}
        onChange={e => setCity(e.target.value)}
        placeholder='Where do you live now?'
        className='border px-3 py-2 w-full mb-2 font-serif'
        onKeyDown={e => {
          if (e.key === 'Enter') {
            fetchWeather();
          }
        }}
      />
      <button
        onClick={fetchWeather}
        className='bg-stone-800 text-white text-sm px-2 py-1 rounded hover:cursor-pointer hover:bg-stone-700 hover:scale-105'
      >
        See Today’s Weather
      </button>
    </div>
  );
};

export default Weather;
