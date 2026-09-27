import { Fragment } from "react";

import { cn } from "@notion-kit/cn";
import { Icon } from "@notion-kit/icons";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  MenuLabel,
} from "@/primitives";

import { Navbar } from "../core";

export interface AppBarBreadcrumb {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface AppBarUser {
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface AppBarProps {
  /** Product/workspace mark rendered at the far left. */
  brand: React.ReactNode;
  /** Breadcrumb trail; the last entry is treated as the current page. */
  breadcrumbs?: AppBarBreadcrumb[];
  /** Center slot, e.g. search or tabs. */
  children?: React.ReactNode;
  /** Signed-in user; renders an account menu when provided. */
  user?: AppBarUser;
  /** Extra controls rendered before the account menu. */
  actions?: React.ReactNode;
  /** Called when "Sign out" is selected from the account menu. */
  onSignOut?: () => void;
  className?: string;
}

function AppBarBreadcrumbs({ items }: { items: AppBarBreadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && (
                <Icon.Chevron
                  aria-hidden="true"
                  className="size-3.5 shrink-0 fill-icon"
                />
              )}
              <li className="flex min-w-0 items-center">
                {item.href ? (
                  <a
                    href={item.href}
                    aria-current={isLast ? "page" : undefined}
                    className="truncate text-sm text-secondary hover:text-primary hover:underline"
                  >
                    {item.label}
                  </a>
                ) : item.onClick ? (
                  <Button
                    variant="hint"
                    size="xs"
                    onClick={item.onClick}
                    aria-current={isLast ? "page" : undefined}
                    className="max-w-full truncate px-1 text-secondary"
                  >
                    {item.label}
                  </Button>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={cn(
                      "truncate text-sm text-secondary",
                      isLast && "font-medium text-primary",
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export function AppBar({
  brand,
  breadcrumbs = [],
  children,
  user,
  actions,
  onSignOut,
  className,
}: AppBarProps) {
  return (
    <Navbar className={cn("justify-between", className)}>
      <div className="flex min-w-0 shrink-0 items-center gap-x-3">
        <div className="flex shrink-0 items-center text-sm font-semibold text-primary">
          {brand}
        </div>
        {breadcrumbs.length > 0 && <AppBarBreadcrumbs items={breadcrumbs} />}
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-center">
        {children}
      </div>
      <div className="flex shrink-0 items-center gap-x-2">
        {actions}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant={null}
                  aria-label="Account menu"
                  className="size-7 rounded-full p-0 hover:bg-transparent"
                >
                  <Avatar className="size-7">
                    <AvatarImage src={user.avatarUrl} alt="" />
                    <AvatarFallback className="bg-main text-xs font-semibold">
                      {user.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <MenuLabel
                  title={
                    <div className="flex min-w-0 flex-col gap-0.5 py-0.5">
                      <span className="truncate text-sm font-medium text-primary">
                        {user.name}
                      </span>
                      {user.email && (
                        <span className="truncate text-xs text-muted">
                          {user.email}
                        </span>
                      )}
                    </div>
                  }
                />
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem label="Sign out" onClick={onSignOut} />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </Navbar>
  );
}
