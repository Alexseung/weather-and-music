import {useEffect, useState} from 'react';
import YouTubePlayer from './YouTubePlayer';

interface Video {
  title: string;
  videoId: string;
  thumbnail: string;
}

interface Props {
  query: string;
}

interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}
interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
}

const descToKeywordMap: Record<string, string> = {
  'clear sky': 'clear day chill music',
  'few clouds': 'calm relaxing music',
  'scattered clouds': 'lofi chill beats',
  'broken clouds': 'moody chill music',
  'overcast clouds': 'ambient cloudy day music',
  'light rain': 'rainy day jazz',
  'moderate rain': 'lofi rain sounds',
  'heavy intensity rain': 'sad rainy music',
  thunderstorm: 'dark ambient storm music',
  'light snow': 'soft winter piano music',
  snow: 'cozy winter music',
  mist: 'ambient misty day music',
  haze: 'lofi haze chill',
  fog: 'mysterious ambient fog music',
  smoke: 'smoky blues music',
  sand: 'desert chill music',
  dust: 'desert lo-fi beats',
  tornado: 'dramatic cinematic music',
};

const YoutubeList = ({query}: Props) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    const keyWord = descToKeywordMap[query] ?? 'calm relaxing music';

    const fetchYouTubeVideos = async () => {
      try {
        // 👉 백엔드 서버를 통해 안전하게 요청
        const res = await fetch(
          `http://localhost:3001/api/youtube?q=${encodeURIComponent(keyWord)}`
        );

        const data: YouTubeSearchResponse = await res.json();

        if (!Array.isArray(data.items)) {
          setError('유효하지 않은 응답입니다.');
          return;
        }

        const videoList: Video[] = data.items.map(item => ({
          title: item.snippet.title,
          videoId: item.id.videoId,
          thumbnail: item.snippet.thumbnails.medium.url,
        }));

        setVideos(videoList);
        setSelectedVideoId(videoList[0]?.videoId || null);
        setError(null);
      } catch (err) {
        setError('유튜브 데이터를 불러올 수 없습니다.');
        console.log('Error: ', err);
      }
    };

    fetchYouTubeVideos();
  }, [query]);

  if (error) return <p className='text-red-500'>{error}</p>;

  return (
    <div className='mt-6 space-y-4'>
      {/* 유튜브 플레이어 */}
      {selectedVideoId && (
        <div className='mb-4'>
          <YouTubePlayer videoId={selectedVideoId} />
        </div>
      )}

      {/* 썸네일 리스트 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {videos.map(video => (
          <div
            key={video.videoId}
            onClick={() => setSelectedVideoId(video.videoId)}
            className='cursor-pointer hover:opacity-80 transition'
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className='w-full h-auto rounded'
            />
            <p className='mt-1 font-light'>{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YoutubeList;
