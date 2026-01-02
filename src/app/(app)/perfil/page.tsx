import { Suspense } from 'react';
import { Metadata } from 'next';
import { getUserProfile } from '@/domains/user/queries';
import { ProfileOverview } from '@/domains/user/components/organisms/profile-overview';
import { UpdateNameForm } from '@/domains/user/components/organisms/update-name-form';
import { ChangePasswordForm } from '@/domains/user/components/organisms/change-password-form';
import { DeleteAccountSection } from '@/domains/user/components/organisms/delete-account-section';
import { USER_MESSAGES } from '@/domains/user/user.text-map';
import { Skeleton } from '@/components/ui/skeleton';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Perfil',
  description: 'Administra tu cuenta y preferencias'
};

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-48" />
      <Skeleton className="h-64" />
    </div>
  );
}

async function ProfileContent() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/auth/login');
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header with staggered fade-in */}
      <div className="animate-in fade-in slide-in-from-bottom-4 mb-8 space-y-2 duration-700">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {USER_MESSAGES.PAGE.TITLE}
        </h1>
        <p className="text-lg text-slate-600">{USER_MESSAGES.PAGE.SUBTITLE}</p>
      </div>

      {/* Profile Overview - Full width */}
      <div className="animate-in fade-in slide-in-from-bottom-4 mb-8 delay-100 duration-700">
        <ProfileOverview profile={profile} />
      </div>

      {/* General Section */}
      <div className="mb-8 space-y-4">
        <h2 className="animate-in fade-in slide-in-from-bottom-4 text-xl font-semibold text-slate-800 delay-150 duration-700">
          {USER_MESSAGES.TABS.GENERAL}
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Name form */}
          <div className="animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700">
            <UpdateNameForm currentName={profile.display_name} />
          </div>

          {/* Password form */}
          <div className="animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700">
            <ChangePasswordForm />
          </div>
        </div>
      </div>

      {/* Security & Account Section */}
      <div className="space-y-4">
        <h2 className="animate-in fade-in slide-in-from-bottom-4 text-xl font-semibold text-slate-800 delay-350 duration-700">
          {USER_MESSAGES.TABS.ACCOUNT}
        </h2>
        <div className="animate-in fade-in slide-in-from-bottom-4 delay-400 duration-700">
          <DeleteAccountSection />
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
