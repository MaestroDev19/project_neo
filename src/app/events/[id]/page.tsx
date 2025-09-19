import { EventDetail } from '@/components/events/EventDetail';
import { notFound } from 'next/navigation';

// Mock data - replace with actual API calls
const mockEvent = {
  id: '1',
  title: 'Epic Gaming Tournament Finals',
  description: 'Join us for the most exciting gaming tournament of the year! Watch as the top players compete for the championship title in this thrilling finale. Experience live commentary, exclusive interviews, and behind-the-scenes content.',
  startsAt: new Date('2024-01-20T19:00:00Z'),
  endsAt: new Date('2024-01-20T23:00:00Z'),
  location: 'Virtual Event',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  organizerId: 'org1',
  communityId: 'community1',
  streams: [
    {
      id: 'stream1',
      platform: 'TWITCH' as const,
      externalId: 'epicgaming',
      title: 'Main Tournament Stream',
      scheduledStart: new Date('2024-01-20T19:00:00Z'),
      startedAt: new Date('2024-01-20T19:05:00Z'),
      endedAt: undefined,
      url: 'https://twitch.tv/epicgaming',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      eventId: '1',
      communityId: 'community1'
    },
    {
      id: 'stream2',
      platform: 'YOUTUBE' as const,
      externalId: 'dQw4w9WgXcQ',
      title: 'Commentary Stream',
      scheduledStart: new Date('2024-01-20T19:00:00Z'),
      startedAt: undefined,
      endedAt: undefined,
      url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      eventId: '1',
      communityId: 'community1'
    }
  ],
  attendees: [
    { user: { id: '1', username: 'gamer1', displayName: 'Pro Gamer' } },
    { user: { id: '2', username: 'viewer2', displayName: 'Gaming Fan' } },
    { user: { id: '3', username: 'streamer3', displayName: 'Content Creator' } }
  ],
  community: {
    id: 'community1',
    name: 'Epic Gaming Community',
    slug: 'epic-gaming'
  }
};

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  
  // TODO: Fetch event data from API
  // const event = await getEvent(id);
  
  if (id !== '1') {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <EventDetail event={mockEvent} />
    </div>
  );
}

export async function generateMetadata({ params }: EventPageProps) {
  const { id } = await params;
  
  // TODO: Fetch event data for metadata
  if (id === '1') {
    return {
      title: `${mockEvent.title} | Fandom Social Platform`,
      description: mockEvent.description,
    };
  }
  
  return {
    title: 'Event Not Found | Fandom Social Platform',
  };
}