'use client';
import CookieConsent from '@/components/CookieConsent';
import NotificationPrompt from '@/components/NotificationPrompt';

/**
 * Client-side wrapper for permission prompts (cookies + notifications).
 * Placed in the root layout so it appears on every page.
 */
export default function PermissionPrompts() {
  return (
    <>
      <CookieConsent />
      <NotificationPrompt />
    </>
  );
}
