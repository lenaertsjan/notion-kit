import { useId, type ReactNode } from "react";

import { cn } from "@notion-kit/cn";
import { Icon } from "@notion-kit/icons";

import { Button, SheetTitle } from "@/primitives";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  useSidebar,
} from "@/sidebar";

export interface ConsoleLayoutProps {
  brand: ReactNode;
  navigation: ReactNode;
  navigationLabel: string;
  contextBar: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Responsive application frame. Routing and account state belong to the caller. */
export function ConsoleLayout(props: ConsoleLayoutProps) {
  return (
    <SidebarProvider
      config={{ defaultWidth: "240px", defaultMobileWidth: "280px" }}
    >
      <ConsoleFrame {...props} />
    </SidebarProvider>
  );
}

function ConsoleFrame({
  brand,
  navigation,
  navigationLabel,
  contextBar,
  footer,
  children,
  className,
}: ConsoleLayoutProps) {
  const { open, isMobile, openMobile, toggleSidebar, setOpenMobile } =
    useSidebar();
  const mainId = useId();
  const navId = useId();
  return (
    <div
      data-slot="console-layout"
      className={cn(
        "flex min-h-svh w-full min-w-0 bg-main text-primary",
        className,
      )}
    >
      <a
        href={`#${mainId}`}
        className="sr-only z-50 rounded-md bg-main p-3 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Sidebar>
        {isMobile && (
          <SheetTitle className="sr-only">{navigationLabel}</SheetTitle>
        )}
        <SidebarHeader className="h-14 shrink-0 flex-row items-center justify-between border-b px-4">
          {brand}
          <Button
            variant="hint"
            size="xs"
            aria-label="Close sidebar"
            onClick={toggleSidebar}
          >
            <Icon.ArrowChevronDoubleBackward className="size-4" />
          </Button>
        </SidebarHeader>
        <SidebarContent className="mt-0 gap-6 px-3 py-6">
          <nav
            id={navId}
            aria-label={navigationLabel}
            onClick={(event) => {
              if (
                event.target instanceof Element &&
                event.target.closest("a[href]")
              )
                setOpenMobile(false);
            }}
            className="flex flex-col gap-6"
          >
            {navigation}
          </nav>
        </SidebarContent>
        {footer && (
          <SidebarFooter className="border-t px-4 py-4">{footer}</SidebarFooter>
        )}
      </Sidebar>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-20 flex h-14 shrink-0 items-center border-b bg-main">
          {(isMobile || !open) && (
            <Button
              variant="hint"
              size="sm"
              className="ml-3 shrink-0"
              aria-label="Open sidebar"
              aria-expanded={isMobile ? openMobile : open}
              aria-controls={navId}
              onClick={toggleSidebar}
            >
              <Icon.Menu className="size-4" />
            </Button>
          )}
          <div className="min-w-0 flex-1">{contextBar}</div>
        </div>
        <main
          id={mainId}
          tabIndex={-1}
          className="flex min-w-0 flex-1 flex-col outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
