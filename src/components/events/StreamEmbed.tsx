'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Maximize2 } from 'lucide-react';
import type { Stream } from '@/types/stream';

interface StreamEmbedProps {
  stream: Stream;
  autoplay?: boolean;
  muted?: boolean;
  onTimeUpdate?: (time: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function StreamEmbed({
  stream,
  autoplay = false,
  muted = false,
  onTimeUpdate,
  onPlayStateChange
}: StreamEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getEmbedUrl = () => {
    switch (stream.platform) {
      case 'TWITCH':
        return `https://player.twitch.tv/?channel=${stream.externalId}&parent=${window.location.hostname}&autoplay=${autoplay}&muted=${muted}`;
      case 'YOUTUBE':
        const params = new URLSearchParams({
          autoplay: autoplay ? '1' : '0',
          mute: muted ? '1' : '0',
          enablejsapi: '1',
          origin: window.location.origin
        });
        return `https://www.youtube.com/embed/${stream.externalId}?${params}`;
      default:
        return '';
    }
  };

  const handleFullscreen = () => {
    if (!iframeRef.current) return;

    if (!document.fullscreenElement) {
      iframeRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const openInNewTab = () => {
    window.open(stream.url, '_blank');
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // YouTube API integration for watch party sync
  useEffect(() => {
    if (stream.platform === 'YOUTUBE' && (onTimeUpdate || onPlayStateChange)) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);

      // @ts-ignore
      window.onYouTubeIframeAPIReady = () => {
        // @ts-ignore
        const player = new YT.Player(iframeRef.current, {
          events: {
            onStateChange: (event: any) => {
              const isPlaying = event.data === 1; // YT.PlayerState.PLAYING
              onPlayStateChange?.(isPlaying);
            }
          }
        });

        // Poll for time updates
        if (onTimeUpdate) {
          const interval = setInterval(() => {
            if (player.getCurrentTime) {
              onTimeUpdate(player.getCurrentTime());
            }
          }, 1000);

          return () => clearInterval(interval);
        }
      };
    }
  }, [stream.platform, onTimeUpdate, onPlayStateChange]);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      {/* Stream Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleFullscreen}
          className="bg-black/50 hover:bg-black/70 text-white border-0"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={openInNewTab}
          className="bg-black/50 hover:bg-black/70 text-white border-0"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      {/* Stream Status */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
          <div className={`w-2 h-2 rounded-full ${
            stream.startedAt && !stream.endedAt ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
          }`} />
          <span className="text-white text-sm font-medium">
            {stream.startedAt && !stream.endedAt ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {/* Stream Embed */}
      <div className="aspect-video">
        <iframe
          ref={iframeRef}
          src={getEmbedUrl()}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Stream Info */}
      <div className="p-4 bg-card">
        <h3 className="font-semibold mb-1">{stream.title}</h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="capitalize">{stream.platform.toLowerCase()}</span>
          {stream.startedAt && (
            <span>
              Started {new Date(stream.startedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}