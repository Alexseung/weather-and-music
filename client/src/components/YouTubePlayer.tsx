import {useEffect, useRef} from 'react';

interface Props {
  videoId: string;
}

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer = ({videoId}: Props) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstance = useRef<YT.Player | null>(null);

  useEffect(() => {
    const loadPlayer = () => {
      if (!playerRef.current) return;

      playerInstance.current = new window.YT.Player(playerRef.current, {
        height: '315',
        width: '100%',
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 0,
          controls: 1,
        },
      });
    };

    if (!window.YT || !window.YT.Player) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = loadPlayer;
    } else {
      loadPlayer();
    }

    return () => {
      playerInstance.current?.destroy();
    };
  }, [videoId]);

  return <div ref={playerRef} />;
};

export default YouTubePlayer;
