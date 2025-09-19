// Re-export all types for easier imports
export * from './user';
export * from './event';
export * from './community';
export * from './stream';

// Common types used across the application
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
  followingCount: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  organizerId: string;
  communityId?: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}