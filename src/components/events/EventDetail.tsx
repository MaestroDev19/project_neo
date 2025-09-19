'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { StreamEmbed } from './StreamEmbed';
import { WatchParty } from './WatchParty';
import { EventChat } from './EventChat';
import { EventCapsulePreview } from './EventCapsulePreview';
import { EventDiscussion } from './EventDiscussion';
import { Calendar, MapPin, Users, Play, MessageCircle, Archive } from 'lucide-react';
import type { Event, Stream, WatchParty as WatchPartyType, EventCapsule } from '@/types';

interface EventDetailProps {
  event: Event & {
    streams: Stream[];
    attendees: Array<{ user: { id: string; username: string; displayName: string } }>;
    community?: { id: string; name: string; slug: string };
  };
}

export function EventDetail({ event }: EventDetailProps) {
  const [activeTab, setActiveTab] = useState<'stream' | 'chat' | 'discussion' | 'capsule'>('stream');
  const [activeStream, setActiveStream] = useState<Stream | null>(
    event.streams.find(s => s.startedAt && !s.endedAt) || event.streams[0] || null
  );
  const [watchParty, setWatchParty] = useState<WatchPartyType | null>(null);
  const [eventCapsule, setEventCapsule] = useState<EventCapsule | null>(null);
  const [isRSVPed, setIsRSVPed] = useState(false);

  const isEventLive = event.streams.some(s => s.startedAt && !s.endedAt);
  const isEventUpcoming = new Date(event.startsAt) > new Date();
  const isEventPast = new Date(event.endsAt) < new Date();

  useEffect(() => {
    // Load watch party data if stream is active
    if (activeStream && isEventLive) {
      // TODO: Fetch watch party data
    }

    // Load event capsule if event is past
    if (isEventPast) {
      // TODO: Fetch event capsule
    }
  }, [activeStream, isEventLive, isEventPast]);

  const handleRSVP = async () => {
    // TODO: Implement RSVP functionality
    setIsRSVPed(!isRSVPed);
  };

  const handleJoinWatchParty = async () => {
    if (!activeStream) return;
    // TODO: Join watch party
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Event Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
            {event.community && (
              <p className="text-lg text-muted-foreground mb-4">
                Hosted by <span className="font-semibold">{event.community.name}</span>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRSVP}
              variant={isRSVPed ? "secondary" : "default"}
              size="lg"
            >
              <Users className="w-4 h-4 mr-2" />
              {isRSVPed ? 'RSVP\'d' : 'RSVP'}
            </Button>
            {isEventLive && activeStream && (
              <Button onClick={handleJoinWatchParty} size="lg">
                <Play className="w-4 h-4 mr-2" />
                Join Watch Party
              </Button>
            )}
          </div>
        </div>

        {/* Event Info */}
        <div className="flex flex-wrap gap-6 text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.startsAt)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{event.attendees.length} attending</span>
          </div>
          {isEventLive && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 font-semibold">LIVE</span>
            </div>
          )}
        </div>

        <p className="text-lg leading-relaxed">{event.description}</p>
      </div>

      {/* Stream Selection */}
      {event.streams.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Streams</h3>
          <div className="flex gap-2 flex-wrap">
            {event.streams.map((stream) => (
              <Button
                key={stream.id}
                variant={activeStream?.id === stream.id ? "default" : "outline"}
                onClick={() => setActiveStream(stream)}
                className="flex items-center gap-2"
              >
                <div className={`w-2 h-2 rounded-full ${
                  stream.startedAt && !stream.endedAt ? 'bg-red-500' : 'bg-gray-400'
                }`} />
                {stream.platform} - {stream.title}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stream/Content */}
        <div className="lg:col-span-2">
          {/* Tab Navigation */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('stream')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'stream'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Play className="w-4 h-4 inline mr-2" />
              Stream
            </button>
            <button
              onClick={() => setActiveTab('discussion')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'discussion'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Discussion
            </button>
            {(isEventPast || eventCapsule) && (
              <button
                onClick={() => setActiveTab('capsule')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'capsule'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Archive className="w-4 h-4 inline mr-2" />
                Event Capsule
              </button>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === 'stream' && (
            <div>
              {activeStream ? (
                <div>
                  <StreamEmbed stream={activeStream} />
                  {watchParty && (
                    <WatchParty
                      watchParty={watchParty}
                      onTimeSync={(time) => {
                        // TODO: Sync time with other participants
                      }}
                      onPlayPause={(isPlaying) => {
                        // TODO: Sync play/pause with other participants
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="bg-muted rounded-lg p-12 text-center">
                  <Play className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Active Stream</h3>
                  <p className="text-muted-foreground">
                    {isEventUpcoming
                      ? 'Stream will be available when the event starts'
                      : 'No streams are currently available for this event'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'discussion' && (
            <EventDiscussion eventId={event.id} communityId={event.community?.id} />
          )}

          {activeTab === 'capsule' && (
            <EventCapsulePreview
              eventId={event.id}
              capsule={eventCapsule}
              onCreateCapsule={() => {
                // TODO: Create event capsule
              }}
            />
          )}
        </div>

        {/* Right Column - Chat */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <EventChat
              eventId={event.id}
              streamId={activeStream?.id}
              isLive={isEventLive}
            />
          </div>
        </div>
      </div>
    </div>
  );
}