'use client';

import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,

  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@repo/design-system/components/ui/sidebar';
import { cn } from '@repo/design-system/lib/utils';
import {
  AnchorIcon,
  BookOpenIcon,
  BotIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  PieChartIcon,
  SendIcon,
  Settings2Icon,
  SquareTerminalIcon,
  MessageSquareIcon,
  CreditCardIcon,
  UserIcon,
  BellIcon,
  ShieldIcon,
  HelpCircleIcon,
  BarChart3,
  Activity,
  Zap,
  DollarSign,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Search } from './search';

type GlobalSidebarProperties = {
  readonly children: ReactNode;
};

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: UserIcon,
    },
    {
      title: 'Usage Analytics',
      url: '/profile/usage',
      icon: PieChartIcon,
    },
    {
      title: 'Conversations',
      url: '/conversations',
      icon: MessageSquareIcon,
    },
  ],
  navUsageMetrics: [
    {
      title: 'Cubent Units',
      url: '/usage/cubent-units',
      icon: BarChart3,
      locked: true,
    },
    {
      title: 'Request Tracking',
      url: '/usage/requests',
      icon: Activity,
      locked: false,
    },
    {
      title: 'Token Usage',
      url: '/usage/tokens',
      icon: Zap,
      locked: false,
    },
    {
      title: 'Cost Tracking',
      url: '/usage/cost',
      icon: DollarSign,
      locked: false,
    },
  ],
  navAccount: [
    {
      title: 'Extension',
      url: '/profile/extension',
      icon: BotIcon,
    },
    {
      title: 'Billing',
      url: '/billing',
      icon: CreditCardIcon,
    },
    {
      title: 'Settings',
      url: '/profile/settings',
      icon: Settings2Icon,
    },
    {
      title: 'Notifications',
      url: '/settings/notifications',
      icon: BellIcon,
    },
  ],
  navSecondary: [
    {
      title: 'Documentation',
      url: '/docs',
      icon: BookOpenIcon,
    },
  ],
};

export const GlobalSidebar = ({ children }: GlobalSidebarProperties) => {
  const sidebar = useSidebar();
  const pathname = usePathname();

  return (
    <>
      <Sidebar variant="inset" className="h-full max-h-[calc(100vh-4rem)] mt-16">
        <SidebarHeader>
          {/* Organization selector removed */}
        </SidebarHeader>
        {/* Search hidden */}
        <SidebarContent className="flex-1 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Usage Metrics</SidebarGroupLabel>
            <SidebarMenu>
              {data.navUsageMetrics.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    className={item.locked ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {item.locked ? (
                      <div className="flex items-center gap-2 w-full">
                        <item.icon />
                        <span>{item.title}</span>
                        <Lock className="h-3 w-3 ml-auto" />
                      </div>
                    ) : (
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarMenu>
              {data.navAccount.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {/* User profile moved to header */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex-1">
        {children}
      </SidebarInset>
    </>
  );
};
