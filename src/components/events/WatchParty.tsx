'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Play, Pause, RotateCcw } from 'lucide-react';
import type { WatchParty as WatchPartyType } from '@/types/stream';

interface WatchPartyProps {
  watchParty: WatchPartyType;
  onTimeSync: (time: number) => void;
  onPlayPause: (isPlaying: boolean) => void;
}

export function WatchParty({ watchParty, onTimeSync, onPlayPause }: WatchPartyProps) {
  const [isHost, setIsHost] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'out-of-sync'>('synced');

  useEffect(() => {
    // TODO: Check if current user is host
    // TODO: Set up WebSocket connection for real-time sync
  }, []);

  const handleSync = () => {
    setSyncStatus('syncing');
    onTimeSync(watchParty.currentTime);
    setTimeout(() => setSyncStatus('synced'), 1000);
  };

  const handlePlayPause = () => {
    onPlayPause(!watchParty.isPlaying);
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'synced': return 'text-green-500';
      case 'syncing': return 'text-yellow-500';
      case 'out-of-sync': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="mt-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h3 className="font-semibold">Watch Party</h3>
          <span className="text-sm text-muted-foreground">
            ({watchParty.participants.length} viewers)
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-sm ${getSyncStatusColor()}`}>
            {syncStatus === 'synced' && '● Synced'}
            {syncStatus === 'syncing' && '○ Syncing...'}
            {syncStatus === 'out-of-sync' && '● Out of sync'}
          </span>
          
          {syncStatus === 'out-of-sync' && (
            <Button size="sm" variant="outline" onClick={handleSync}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Sync
            </Button>
          )}
          
          {isHost && (
            <Button size="sm" onClick={handlePlayPause}>
              {watchParty.isPlaying ? (
                <Pause className="w-4 h-4 mr-1" />
              ) : (
                <Play className="w-4 h-4 mr-1" />
              )}
              {watchParty.isPlaying ? 'Pause' : 'Play'}
            </Button>
          )}
        </div>
      </div>

      {/* Participants */}
      <div className="flex flex-wrap gap-2">
        {watchParty.participants.slice(0, 8).map((participant) => (
          <div
            key={participant.id}
            className="flex items-center gap-2 bg-muted px-2 py-1 rounded-full text-sm"
          >
            <Avatar className="w-5 h-5">
              <AvatarImage src={`/avatars/${participant.username}.jpg`} />
              <AvatarFallback className="text-xs">
                {participant.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{participant.displayName}</span>
            {participant.isHost && (
              <span className="text-xs bg-primary text-primary-foreground px-1 rounded">
                HOST
              </span>
            )}
          </div>
        ))}
        
        {watchParty.participants.length > 8 && (
          <div className="flex items-center justify-center w-8 h-6 bg-muted rounded-full text-xs">
            +{watchParty.participants.length - 8}
          </div>
        )}
      </div>

      {/* Host Controls Info */}
      {!isHost && (
        <p className="text-xs text-muted-foreground mt-2">
          The host controls playback for all participants
        </p>
      )}
    </div>
  );
}