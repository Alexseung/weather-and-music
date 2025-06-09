import {useState} from 'react';
import Weater from './Weather';
import YoutubeList from './YouTubeList';

const WeatherWithMusic = () => {
  const [desc, setDesc] = useState('');
  const [weatherText, setWeatherText] = useState<string | null>(null);

  return (
    <div className='p-4 max-w-xl mx-auto text-center'>
      <Weater onDescFetch={setDesc} onWeatherTextUpdate={setWeatherText} />

      {weatherText && <p className='mt-4 text-xl font-serif'>{weatherText}</p>}

      {desc && <YoutubeList query={desc} />}
    </div>
  );
};

export default WeatherWithMusic;
