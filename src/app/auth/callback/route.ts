import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Auth Callback Route
 * Handles email confirmation callback from Supabase
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to dashboard after successful confirmation
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
