'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { USER_MESSAGES } from '../../user.text-map';
import type { Database } from '@/types/supabase';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface ProfileOverviewProps {
  profile: UserProfile;
}

/**
 * Profile overview with avatar and user information
 * Refined, spacious design with subtle details
 */
export function ProfileOverview({ profile }: ProfileOverviewProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  // Get initials from display name or email
  const getInitials = () => {
    if (profile.display_name) {
      return profile.display_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return profile.email[0].toUpperCase();
  };

  return (
    <Card className="overflow-hidden border-slate-200/60 shadow-sm">
      <CardHeader className="bg-gradient-to-br from-slate-50 to-white pb-8">
        <CardTitle className="text-lg font-medium text-slate-700">
          {USER_MESSAGES.PROFILE.HEADING}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Avatar and name */}
        <div className="flex items-center gap-4">
          {/* Avatar with initials */}
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl font-semibold text-white shadow-lg shadow-emerald-500/20">
              {getInitials()}
            </div>
            {/* Status indicator */}
            <div className="absolute right-1 bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
          </div>

          {/* User info */}
          <div className="flex-1 space-y-1">
            <h2 className="text-2xl font-semibold text-slate-900">
              {profile.display_name || 'Usuario'}
            </h2>
            <p className="text-sm text-slate-500">{profile.email}</p>
          </div>
        </div>

        {/* Metadata grid */}
        <div className="grid gap-4 rounded-xl bg-slate-50/50 p-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
              {USER_MESSAGES.PROFILE.MEMBER_SINCE}
            </p>
            <p className="text-sm font-medium text-slate-900">
              {formatDate(profile.created_at)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
              Última actualización
            </p>
            <p className="text-sm font-medium text-slate-900">
              {formatDate(profile.updated_at)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
