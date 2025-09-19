'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, MoreHorizontal, Pin } from 'lucide-react';

interface DiscussionPost {
  id: string;
  authorId: string;
  authorUsername: string;
  authorDisplayName: string;
  content: string;
  type: 'TEXT' | 'MEDIA' | 'REVIEW' | 'NEWS' | 'EVENT_ANNOUNCEMENT' | 'STREAM_HIGHLIGHT';
  mediaUrl?: string;
  mediaType?: string;
  externalUrl?: string;
  createdAt: Date;
  likes: number;
  replies: number;
  isPinned: boolean;
  isLiked: boolean;
}

interface EventDiscussionProps {
  eventId: string;
  communityId?: string;
}

export function EventDiscussion({ eventId, communityId }: EventDiscussionProps) {
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pinned' | 'highlights'>('all');

  useEffect(() => {
    // TODO: Load discussion posts
    // Mock data for demo
    const mockPosts: DiscussionPost[] = [
      {
        id: '1',
        authorId: 'user1',
        authorUsername: 'eventorganizer',
        authorDisplayName: 'Event Organizer',
        content: 'Welcome everyone! Thanks for joining our event. Feel free to share your thoughts and connect with other attendees here.',
        type: 'EVENT_ANNOUNCEMENT',
        createdAt: new Date(Date.now() - 3600000),
        likes: 15,
        replies: 8,
        isPinned: true,
        isLiked: false
      },
      {
        id: '2',
        authorId: 'user2',
        authorUsername: 'gamer123',
        authorDisplayName: 'Gamer123',
        content: 'This was an amazing stream! That final boss fight was incredible. Anyone else think the new mechanics are game-changing?',
        type: 'STREAM_HIGHLIGHT',
        createdAt: new Date(Date.now() - 1800000),
        likes: 23,
        replies: 12,
        isPinned: false,
        isLiked: true
      },
      {
        id: '3',
        authorId: 'user3',
        authorUsername: 'reviewer',
        authorDisplayName: 'Game Reviewer',
        content: 'Just published my review of the game featured in today\'s stream. The graphics improvements are substantial compared to the previous version.',
        type: 'REVIEW',
        externalUrl: 'https://example.com/review',
        createdAt: new Date(Date.now() - 900000),
        likes: 8,
        replies: 3,
        isPinned: false,
        isLiked: false
      }
    ];
    setPosts(mockPosts);
  }, [eventId]);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setIsPosting(true);
    
    // TODO: Submit post to API
    const post: DiscussionPost = {
      id: Date.now().toString(),
      authorId: 'current-user',
      authorUsername: 'currentuser',
      authorDisplayName: 'Current User',
      content: newPost,
      type: 'TEXT',
      createdAt: new Date(),
      likes: 0,
      replies: 0,
      isPinned: false,
      isLiked: false
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setIsPosting(false);
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const getPostTypeColor = (type: DiscussionPost['type']) => {
    switch (type) {
      case 'EVENT_ANNOUNCEMENT': return 'bg-blue-500';
      case 'STREAM_HIGHLIGHT': return 'bg-purple-500';
      case 'REVIEW': return 'bg-green-500';
      case 'NEWS': return 'bg-orange-500';
      case 'MEDIA': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getPostTypeLabel = (type: DiscussionPost['type']) => {
    switch (type) {
      case 'EVENT_ANNOUNCEMENT': return 'Announcement';
      case 'STREAM_HIGHLIGHT': return 'Highlight';
      case 'REVIEW': return 'Review';
      case 'NEWS': return 'News';
      case 'MEDIA': return 'Media';
      default: return 'Post';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const filteredPosts = posts.filter(post => {
    switch (filter) {
      case 'pinned': return post.isPinned;
      case 'highlights': return post.type === 'STREAM_HIGHLIGHT';
      default: return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            filter === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setFilter('pinned')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            filter === 'pinned'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Pinned
        </button>
        <button
          onClick={() => setFilter('highlights')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            filter === 'highlights'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Highlights
        </button>
      </div>

      {/* New Post Form */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmitPost} className="space-y-4">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your thoughts about the event..."
              className="min-h-[100px]"
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {newPost.length}/500 characters
              </div>
              <Button type="submit" disabled={!newPost.trim() || isPosting}>
                {isPosting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Discussion Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className={post.isPinned ? 'border-primary/50' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`/avatars/${post.authorUsername}.jpg`} />
                    <AvatarFallback>
                      {post.authorDisplayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{post.authorDisplayName}</span>
                      <span className="text-sm text-muted-foreground">
                        @{post.authorUsername}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatTimeAgo(post.createdAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      {post.isPinned && (
                        <Badge variant="secondary" className="text-xs">
                          <Pin className="w-3 h-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                      <Badge 
                        variant="secondary" 
                        className={`text-xs text-white ${getPostTypeColor(post.type)}`}
                      >
                        {getPostTypeLabel(post.type)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="mb-4 leading-relaxed">{post.content}</p>
              
              {post.externalUrl && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <a 
                    href={post.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {post.externalUrl}
                  </a>
                </div>
              )}
              
              {post.mediaUrl && (
                <div className="mb-4">
                  {post.mediaType?.startsWith('image/') ? (
                    <img 
                      src={post.mediaUrl} 
                      alt="Post media"
                      className="rounded-lg max-w-full h-auto"
                    />
                  ) : (
                    <video 
                      src={post.mediaUrl}
                      controls
                      className="rounded-lg max-w-full h-auto"
                    />
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                    post.isLiked ? 'text-red-500' : ''
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  {post.likes}
                </button>
                
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  {post.replies}
                </button>
                
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}