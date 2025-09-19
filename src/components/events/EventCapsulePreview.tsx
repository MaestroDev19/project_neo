'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Camera, Scissors, Plus, Download } from 'lucide-react';
import type { EventCapsule, CapsuleHighlight } from '@/types/stream';

interface EventCapsulePreviewProps {
  eventId: string;
  capsule: EventCapsule | null;
  onCreateCapsule: () => void;
}

export function EventCapsulePreview({ eventId, capsule, onCreateCapsule }: EventCapsulePreviewProps) {
  const [selectedHighlight, setSelectedHighlight] = useState<CapsuleHighlight | null>(null);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getHighlightIcon = (type: CapsuleHighlight['type']) => {
    switch (type) {
      case 'moment': return <Clock className="w-4 h-4" />;
      case 'clip': return <Scissors className="w-4 h-4" />;
      case 'screenshot': return <Camera className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const getHighlightColor = (type: CapsuleHighlight['type']) => {
    switch (type) {
      case 'moment': return 'bg-blue-500';
      case 'clip': return 'bg-purple-500';
      case 'screenshot': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (!capsule) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Event Capsule Yet</h3>
          <p className="text-muted-foreground mb-6">
            Create a capsule to preserve the best moments from this event
          </p>
        </div>
        
        <Button onClick={onCreateCapsule} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Create Event Capsule
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Capsule Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{capsule.title}</CardTitle>
              {capsule.summary && (
                <p className="text-muted-foreground">{capsule.summary}</p>
              )}
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        
        {capsule.coverUrl && (
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={capsule.coverUrl}
                alt={capsule.title}
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Highlights */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Event Highlights</h3>
        
        {capsule.highlights.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No highlights added yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capsule.highlights.map((highlight) => (
              <Card
                key={highlight.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedHighlight?.id === highlight.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedHighlight(highlight)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {highlight.thumbnailUrl ? (
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={highlight.thumbnailUrl}
                          alt={highlight.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`w-16 h-16 ${getHighlightColor(highlight.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {getHighlightIcon(highlight.type)}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {highlight.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(highlight.timestamp)}
                        </span>
                      </div>
                      
                      <h4 className="font-medium mb-1 truncate">{highlight.title}</h4>
                      
                      {highlight.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {highlight.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Selected Highlight Detail */}
      {selectedHighlight && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getHighlightIcon(selectedHighlight.type)}
              {selectedHighlight.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedHighlight.description && (
              <p className="text-muted-foreground mb-4">
                {selectedHighlight.description}
              </p>
            )}
            
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                {selectedHighlight.type}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Timestamp: {formatDuration(selectedHighlight.timestamp)}
              </span>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button size="sm">
                <Play className="w-4 h-4 mr-2" />
                Play from here
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download clip
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}