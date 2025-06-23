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
import { Menu, MoveRight, X, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/design-system/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';

import type { Dictionary } from '@repo/internationalization';
import Image from 'next/image';

import Logo from './logo.svg';

type HeaderProps = {
  dictionary: Dictionary;
};

export const Header = ({ dictionary }: HeaderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    imageUrl?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cross-domain authentication detection using multiple approaches
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 Starting auth check...');

      // Approach 1: Try direct fetch first (might work if CORS is properly configured)
      try {
        console.log('📡 Trying direct fetch...');
        const response = await fetch('https://app-cubent.vercel.app/api/auth/status', {
          credentials: 'include',
          mode: 'cors',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Direct fetch successful:', data);

          if (data.authenticated) {
            setIsAuthenticated(true);
            setUserProfile(data.user);
          }
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log('❌ Direct fetch failed:', error);
      }

      // Approach 2: Fallback to iframe method
      try {
        console.log('📡 Trying iframe method...');

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.src = 'https://app-cubent.vercel.app/api/auth/check-for-website';

        const handleMessage = (event: MessageEvent) => {
          console.log('📨 Received message:', event.data, 'from origin:', event.origin);

          if (event.data.type === 'AUTH_STATUS') {
            console.log('✅ Auth status received:', event.data);

            if (event.data.authenticated) {
              console.log('👤 User authenticated:', event.data.user);
              setIsAuthenticated(true);
              setUserProfile(event.data.user);
            } else {
              console.log('🚫 User not authenticated');
            }
            setIsLoading(false);

            // Clean up
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
            window.removeEventListener('message', handleMessage);
          }
        };

        iframe.onload = () => {
          console.log('🎯 Iframe loaded successfully');
        };

        iframe.onerror = (error) => {
          console.log('❌ Iframe error:', error);
          setIsLoading(false);
        };

        window.addEventListener('message', handleMessage);
        document.body.appendChild(iframe);

        // Timeout after 5 seconds
        setTimeout(() => {
          console.log('⏰ Auth check timeout');
          setIsLoading(false);
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          window.removeEventListener('message', handleMessage);
        }, 5000);
      } catch (error) {
        console.log('❌ Auth check failed:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
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
          {/* Authentication-aware buttons */}
          {isLoading ? (
            <div className="w-16 h-10 bg-muted animate-pulse rounded"></div>
          ) : isAuthenticated && userProfile ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild className="hidden md:inline-flex">
                <Link href="https://app-cubent.vercel.app/profile">
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile.imageUrl} alt={userProfile.name} />
                      <AvatarFallback>
                        {userProfile.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{userProfile.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {userProfile.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="https://app-cubent.vercel.app/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="https://app-cubent.vercel.app/profile/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="https://app-cubent.vercel.app/sign-out">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
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

              {/* Mobile Auth Section */}
              <div className="border-t pt-4">
                {isAuthenticated && userProfile ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userProfile.imageUrl} alt={userProfile.name} />
                        <AvatarFallback>
                          {userProfile.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{userProfile.name}</p>
                        <p className="text-xs text-muted-foreground">{userProfile.email}</p>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="https://app-cubent.vercel.app/profile">
                        <User className="h-4 w-4 mr-2" />
                        Go to Dashboard
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="w-full">
                    <Link href="https://app-cubent.vercel.app/sign-in">
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
