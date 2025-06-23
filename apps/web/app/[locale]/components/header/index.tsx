'use client';

import { env } from '@/env';
import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import { Button } from '@repo/design-system/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@repo/design-system/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/design-system/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@repo/design-system/components/ui/dropdown-menu';
import { Menu, MoveRight, X, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import type { Dictionary } from '@repo/internationalization';
import Image from 'next/image';

import Logo from './logo.svg';

type HeaderProps = {
  dictionary: Dictionary;
};

interface UserInfo {
  id: string;
  name: string;
  email: string;
  picture?: string;
  subscriptionTier?: string;
}

export const Header = ({ dictionary }: HeaderProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount using JSONP for cross-domain access
  useEffect(() => {
    const checkAuthStatus = () => {
      console.log('🔍 Checking authentication status...');

      // Create a unique callback name
      const callbackName = `authCallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Define the callback function
      (window as any)[callbackName] = (data: any) => {
        console.log('📡 Auth callback received:', data);
        try {
          if (data.authenticated && data.user) {
            console.log('✅ User is authenticated:', data.user);
            setUserInfo({
              id: data.user.id,
              name: data.user.name || 'User',
              email: data.user.email,
              picture: data.user.picture,
              subscriptionTier: data.user.subscriptionTier,
            });
          } else {
            console.log('❌ User is not authenticated');
          }
        } catch (error) {
          console.error('❌ Auth callback error:', error);
        } finally {
          setIsLoading(false);
          // Clean up
          delete (window as any)[callbackName];
          const script = document.getElementById(callbackName);
          if (script) {
            script.remove();
          }
        }
      };

      // Create script element for JSONP request
      const script = document.createElement('script');
      script.id = callbackName;
      script.src = `https://app-cubent.vercel.app/api/auth/status?callback=${callbackName}`;
      console.log('📡 Making JSONP request to:', script.src);

      script.onerror = () => {
        console.error('❌ Auth check failed - script error');
        setIsLoading(false);
        delete (window as any)[callbackName];
        script.remove();
      };

      // Add script to document
      document.head.appendChild(script);

      // Timeout fallback
      setTimeout(() => {
        if ((window as any)[callbackName]) {
          console.warn('⏰ Auth check timeout');
          setIsLoading(false);
          delete (window as any)[callbackName];
          const timeoutScript = document.getElementById(callbackName);
          if (timeoutScript) {
            timeoutScript.remove();
          }
        }
      }, 10000); // Increased timeout to 10 seconds
    };

    checkAuthStatus();
  }, []);
  const navigationItems = [
    {
      title: dictionary.web.header.home,
      href: '/',
      description: '',
    },
    {
      title: 'Features',
      description: 'Discover what makes Cubent Coder powerful',
      items: [
        {
          title: 'Chat Mode',
          href: '/features/chat',
        },
        {
          title: 'Agent Mode',
          href: '/features/agent',
        },
        {
          title: 'Custom Modes',
          href: '/features/custom',
        },
      ],
    },
    {
      title: dictionary.web.header.docs,
      href: 'https://cubentdev.mintlify.app',
      description: '',
    },
    {
      title: dictionary.web.header.blog,
      href: '/blog',
      description: '',
    },
    {
      title: 'Support',
      href: 'https://discord.gg/cubent',
      description: '',
    },
  ];

  const [isOpen, setOpen] = useState(false);
  return (
    <header className="sticky top-0 left-0 z-40 w-full border-b bg-background">
      <div className="relative w-full max-w-none flex min-h-20 flex-row items-center justify-between" style={{paddingInline: 'clamp(1rem, 2.5%, 2rem)'}}>
        <div className="flex items-center gap-2">
          <Image
            src={Logo}
            alt="Cubent Logo"
            width={32}
            height={32}
            className="dark:invert"
          />
          <p className="whitespace-nowrap font-semibold">Cubent</p>
        </div>
        <div className="hidden flex-row items-center justify-center gap-3 lg:flex absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
          <NavigationMenu className="flex items-center justify-center">
            <NavigationMenuList className="flex flex-row justify-center gap-3">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <>
                      <NavigationMenuLink asChild>
                        <Button variant="ghost" asChild>
                          <Link
                            href={item.href}
                            target={item.href.startsWith('http') ? '_blank' : undefined}
                            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {item.title}
                          </Link>
                        </Button>
                      </NavigationMenuLink>
                    </>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="font-medium text-sm">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[450px] p-4">
                        <div className="flex grid-cols-2 flex-col gap-4 lg:grid">
                          <div className="flex h-full flex-col justify-between">
                            <div className="flex flex-col">
                              <p className="text-base">{item.title}</p>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                            <Button size="sm" className="mt-10" asChild>
                              <Link href="https://marketplace.visualstudio.com/items?itemName=cubent.cubent">
                                Download Extension
                              </Link>
                            </Button>
                          </div>
                          <div className="flex h-full flex-col justify-end text-sm">
                            {item.items?.map((subItem, idx) => (
                              <NavigationMenuLink
                                href={subItem.href}
                                key={idx}
                                className="flex flex-row items-center justify-between rounded px-4 py-2 hover:bg-muted"
                              >
                                <span>{subItem.title}</span>
                                <MoveRight className="h-4 w-4 text-muted-foreground" />
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex justify-end gap-2">
          <div className="hidden md:inline">
            <ModeToggle />
          </div>
          <Button variant="outline" asChild className="hidden md:inline-flex h-10">
            <Link href="https://marketplace.visualstudio.com/items?itemName=cubent.cubent" className="flex flex-row items-center gap-2 px-4 py-2 whitespace-nowrap">
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 88 88" fill="currentColor">
                <path d="M0 12.402l35.687-4.86.016 34.423L0 45.194zm35.67 33.529l.028 34.453L.028 75.48.026 45.7zm4.326-39.025L87.314 0v41.527l-47.318 4.425zm47.329 39.349v41.527L40.028 81.441l.016-34.486z"/>
              </svg>
              <span className="shrink-0 text-sm">Download</span>
            </Link>
          </Button>

          {/* Debug button - remove in production */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLoading(true);
              setUserInfo(null);
              // Re-run auth check
              setTimeout(() => {
                window.location.reload();
              }, 100);
            }}
            className="hidden md:inline-flex"
          >
            🔄 Check Auth
          </Button>

          {/* Conditional rendering based on authentication status */}
          {!isLoading && userInfo ? (
            // User is authenticated - show user dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userInfo.picture} alt={userInfo.name} />
                    <AvatarFallback>
                      {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{userInfo.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {userInfo.email}
                    </p>
                    {userInfo.subscriptionTier && (
                      <p className="text-xs text-muted-foreground capitalize">
                        {userInfo.subscriptionTier.toLowerCase()} plan
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="https://app-cubent.vercel.app/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="https://app-cubent.vercel.app/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="https://app-cubent.vercel.app/sign-out" className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // User is not authenticated - show sign in button
            <Button asChild>
              <Link href="https://app-cubent.vercel.app/sign-in">
                Sign In
              </Link>
            </Button>
          )}
        </div>
        <div className="flex w-12 shrink items-end justify-end lg:hidden">
          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          {isOpen && (
            <div className="container absolute top-20 right-0 flex w-full flex-col gap-8 border-t bg-background py-4 shadow-lg px-4 sm:px-6 lg:px-8">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex items-center justify-between"
                        target={
                          item.href.startsWith('http') ? '_blank' : undefined
                        }
                        rel={
                          item.href.startsWith('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                      >
                        <span className="text-lg">{item.title}</span>
                        <MoveRight className="h-4 w-4 stroke-1 text-muted-foreground" />
                      </Link>
                    ) : (
                      <p className="text-lg">{item.title}</p>
                    )}
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="flex items-center justify-between"
                      >
                        <span className="text-muted-foreground">
                          {subItem.title}
                        </span>
                        <MoveRight className="h-4 w-4 stroke-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
