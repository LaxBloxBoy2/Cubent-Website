'use client';

import { env } from '@/env';

import { Button } from '@repo/design-system/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@repo/design-system/components/ui/navigation-menu';
import { Menu, MoveRight, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import type { Dictionary } from '@repo/internationalization';
import Image from 'next/image';

import Logo from './logo.svg';
import { UserProfile } from './user-profile';
import { useAuthStatus } from '../../hooks/useAuthStatus';

type HeaderProps = {
  dictionary: Dictionary;
};

export const Header = ({ dictionary }: HeaderProps) => {
  const { isAuthenticated, user, isLoading } = useAuthStatus();
  const pathname = usePathname();

  const navigationItems = [
    {
      title: 'Enterprise',
      href: '/enterprise',
      description: '',
    },
    {
      title: 'Pricing',
      href: '/pricing',
      description: '',
    },
    {
      title: dictionary.web.header.docs,
      href: 'https://docs.cubent.dev/',
      description: '',
    },
    {
      title: dictionary.web.header.blog,
      href: '/blog',
      description: '',
    },
    {
      title: 'Company',
      description: 'Learn more about Cubent',
      sections: [
        {
          title: 'Company',
          items: [
            {
              title: 'About Us',
              href: '/about',
              description: 'Learn about our mission and team'
            },
            {
              title: 'Careers',
              href: '/careers',
              description: 'Join our growing team'
            },
          ]
        },
        {
          title: 'Support',
          items: [
            {
              title: 'Contact',
              href: '/contact',
              description: 'Get in touch with our team'
            },
            {
              title: 'Help Center',
              href: '/help',
              description: 'Find answers to common questions'
            },
          ]
        }
      ],
    },
  ];

  // Helper function to check if a navigation item is active
  const isActiveItem = (href: string) => {
    if (href === '/enterprise') return pathname === '/enterprise';
    if (href === '/pricing') return pathname === '/pricing';
    if (href === '/blog') return pathname.startsWith('/blog');
    return false;
  };

  // Helper function to check if Company dropdown should be highlighted
  const isCompanyActive = () => {
    return pathname === '/about' || pathname === '/contact';
  };

  const [isOpen, setOpen] = useState(false);
  return (
    <header className="sticky top-0 left-0 z-40 w-full bg-background/20 backdrop-blur-md supports-[backdrop-filter]:bg-background/10">
      {/* Early Access Banner */}
      <div className="w-full bg-gray-800/60 border-b border-gray-600/20 text-gray-200 py-2.5 px-4 text-center text-sm backdrop-blur-sm">
        <span className="font-medium">Early Access:</span> We released the Byak plan -
        <Button variant="link" className="text-gray-200 hover:text-white underline p-0 ml-1 h-auto font-medium text-sm" asChild>
          <Link href="https://app.cubent.dev/sign-in">
            Start your free trial
          </Link>
        </Button>
      </div>

      <div className="border-b">
        <div className="relative w-full max-w-none flex min-h-20 flex-row items-center justify-between" style={{paddingInline: 'clamp(1rem, 2.5%, 2rem)'}}>
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image
            src={Logo}
            alt="Cubent Logo"
            width={36}
            height={36}
            className="dark:invert"
          />
          <p className="whitespace-nowrap font-semibold text-lg">Cubent</p>
        </Link>
        <div className="hidden flex-row items-center justify-center gap-3 lg:flex absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
          <NavigationMenu className="flex items-center justify-center">
            <NavigationMenuList className="flex flex-row justify-center gap-3">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <>
                      <NavigationMenuLink asChild>
                        <Button
                          variant="ghost"
                          asChild
                          className={isActiveItem(item.href) ? 'bg-neutral-800/50 text-orange-400 hover:bg-neutral-700/50 hover:text-orange-300' : ''}
                        >
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
                      <NavigationMenuTrigger className={`font-medium text-sm bg-transparent hover:bg-transparent data-[state=open]:bg-transparent ${isCompanyActive() ? 'text-orange-400' : ''}`}>
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[500px] p-6">
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col">
                            <p className="text-base font-medium">{item.title}</p>
                            <p className="text-muted-foreground text-sm">
                              {item.description}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            {item.sections?.map((section, sectionIdx) => (
                              <div key={sectionIdx} className="flex flex-col gap-3">
                                <h4 className="text-sm font-medium text-foreground border-b border-border pb-2">
                                  {section.title}
                                </h4>
                                <div className="flex flex-col gap-1">
                                  {section.items?.map((subItem, idx) => (
                                    <NavigationMenuLink
                                      href={subItem.href}
                                      key={idx}
                                      className="flex flex-col gap-1 rounded-lg p-3 hover:bg-muted/50 transition-colors"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{subItem.title}</span>
                                        <MoveRight className="h-3 w-3 text-muted-foreground" />
                                      </div>
                                      <span className="text-xs text-muted-foreground">{subItem.description}</span>
                                    </NavigationMenuLink>
                                  ))}
                                </div>
                              </div>
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
          {isLoading ? (
            <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full"></div>
          ) : isAuthenticated && user ? (
            <UserProfile user={user} />
          ) : (
            <Button variant="ghost" asChild className="text-white hover:text-white hover:bg-white/10 h-10 flex items-center">
              <Link href="https://app.cubent.dev/sign-in">
                Sign In
              </Link>
            </Button>
          )}
          <Button asChild className="hidden md:inline-flex h-10 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-0">
            <Link href="https://marketplace.visualstudio.com/items?itemName=cubent.cubent" className="flex flex-row items-center gap-2 px-4 py-2 whitespace-nowrap">
              <span className="shrink-0 text-sm">Download Cubent</span>
            </Link>
          </Button>
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
                        className={`flex items-center justify-between ${
                          isActiveItem(item.href) ? 'bg-neutral-800/50 text-orange-400 rounded px-2 py-1' : ''
                        }`}
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
                      <p className={`text-lg ${isCompanyActive() ? 'text-orange-400' : ''}`}>{item.title}</p>
                    )}
                    {item.sections?.map((section) => (
                      <div key={section.title} className="ml-4 flex flex-col gap-2">
                        <p className="text-sm font-medium text-muted-foreground">{section.title}</p>
                        {section.items?.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="flex items-center justify-between ml-2"
                          >
                            <span className="text-muted-foreground text-sm">
                              {subItem.title}
                            </span>
                            <MoveRight className="h-3 w-3 stroke-1" />
                          </Link>
                        ))}
                      </div>
                    ))}
                    {('items' in item && item.items) && (item as any).items.map((subItem: any) => (
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
      </div>
    </header>
  );
};
