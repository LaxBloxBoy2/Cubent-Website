'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { UserButton } from '@repo/auth/client';
import { NotificationsTrigger } from '@repo/notifications/components/trigger';
import Image from 'next/image';
import Link from 'next/link';

import Logo from './logo.svg';

export const AppHeader = () => {
  return (
    <header className="sticky top-0 left-0 z-50 w-full bg-sidebar backdrop-blur-sm border-b border-sidebar-border supports-[backdrop-filter]:bg-sidebar/95">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left side - Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image
            src={Logo}
            alt="Cubent Logo"
            width={28}
            height={28}
            className="dark:invert"
          />
          <span className="font-semibold text-base">Cubent</span>
        </Link>

        {/* Right side - User menu and notifications */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="shrink-0">
            <div className="h-4 w-4">
              <NotificationsTrigger />
            </div>
          </Button>

          {/* User Button */}
          <UserButton
            showName
            appearance={{
              elements: {
                rootBox: 'flex overflow-hidden',
                userButtonBox: 'flex-row-reverse',
                userButtonOuterIdentifier: 'truncate pl-0 !text-white',
                userPreviewMainIdentifier: '!text-white',
                userPreviewSecondaryIdentifier: '!text-white/90',
                userButtonTrigger: '!text-white',
              },
            }}
          />
        </div>
      </div>
    </header>
  );
};
