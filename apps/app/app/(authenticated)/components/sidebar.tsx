'use client';

import { OrganizationSwitcher, UserButton } from '@repo/auth/client';
import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/design-system/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@repo/design-system/components/ui/sidebar';
import { cn } from '@repo/design-system/lib/utils';
import { NotificationsTrigger } from '@repo/notifications/components/trigger';
import {
  AnchorIcon,
  BookOpenIcon,
  BotIcon,
  ChevronRightIcon,
  FolderIcon,
  FrameIcon,
  LifeBuoyIcon,
  MapIcon,
  MoreHorizontalIcon,
  PieChartIcon,
  SendIcon,
  Settings2Icon,
  ShareIcon,
  SquareTerminalIcon,
  Trash2Icon,
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
      title: 'Profile',
      url: '/profile',
      icon: SquareTerminalIcon,
      isActive: true,
      items: [
        {
          title: 'Overview',
          url: '/profile',
        },
        {
          title: 'Extension',
          url: '/profile/extension',
        },
        {
          title: 'Usage Analytics',
          url: '/profile/usage',
        },
        {
          title: 'Settings',
          url: '/profile/settings',
        },
      ],
    },
    {
      title: 'Extension',
      url: '/profile/extension',
      icon: BotIcon,
      items: [
        {
          title: 'Connection',
          url: '/profile/extension',
        },
        {
          title: 'API Keys',
          url: '/profile/extension#api-keys',
        },
        {
          title: 'Sessions',
          url: '/profile/extension#sessions',
        },
      ],
    },
    {
      title: 'Analytics',
      url: '/profile/usage',
      icon: PieChartIcon,
      items: [
        {
          title: 'Usage Overview',
          url: '/profile/usage',
        },
        {
          title: 'Token Usage',
          url: '/profile/usage#tokens',
        },
        {
          title: 'Cost Tracking',
          url: '/profile/usage#costs',
        },
        {
          title: 'Export Data',
          url: '/profile/usage#export',
        },
      ],
    },
    {
      title: 'Settings',
      url: '/profile/settings',
      icon: Settings2Icon,
      items: [
        {
          title: 'Extension Settings',
          url: '/profile/settings',
        },
        {
          title: 'Preferences',
          url: '/profile/settings#preferences',
        },
        {
          title: 'Account',
          url: '/profile/settings#account',
        },
        {
          title: 'Sync Settings',
          url: '/profile/settings#sync',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Terms & Privacy',
      url: '/terms',
      icon: AnchorIcon,
    },
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoyIcon,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: SendIcon,
    },
  ],
  projects: [
    {
      name: 'VS Code Extension',
      url: '/profile/extension',
      icon: FrameIcon,
    },
    {
      name: 'Usage Dashboard',
      url: '/profile/usage',
      icon: PieChartIcon,
    },
    {
      name: 'Account Settings',
      url: '/profile/settings',
      icon: MapIcon,
    },
  ],
};

export const GlobalSidebar = ({ children }: GlobalSidebarProperties) => {
  const sidebar = useSidebar();

  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div
                className={cn(
                  'h-[36px] overflow-hidden transition-all [&>div]:w-full',
                  sidebar.open ? '' : '-mx-1'
                )}
              >
                <OrganizationSwitcher
                  hidePersonal
                  afterSelectOrganizationUrl="/profile"
                />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <Search />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Profile</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRightIcon />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
            <SidebarMenu>
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontalIcon />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48"
                      side="bottom"
                      align="end"
                    >
                      <DropdownMenuItem>
                        <FolderIcon className="text-muted-foreground" />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ShareIcon className="text-muted-foreground" />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2Icon className="text-muted-foreground" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <MoreHorizontalIcon />
                  <span>More</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
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
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <UserButton
                showName
                appearance={{
                  elements: {
                    rootBox: 'flex overflow-hidden w-full',
                    userButtonBox: 'flex-row-reverse',
                    userButtonOuterIdentifier: 'truncate pl-0',
                  },
                }}
              />
              <div className="flex shrink-0 items-center gap-px">
                <ModeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  asChild
                >
                  <div className="h-4 w-4">
                    <NotificationsTrigger />
                  </div>
                </Button>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </>
  );
};
