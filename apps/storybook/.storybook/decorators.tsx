import { useEffect } from "react";
import type { Decorator } from "storybook-react-rsbuild";

import { I18nProvider } from "@notion-kit/i18n";
import { ThemeProvider, Toaster, useTheme } from "@notion-kit/ui/primitives";

const BRAND_CLASS = "theme-bliv";

interface StorybookThemeWrapperProps extends React.PropsWithChildren {
  theme: string;
  brand: string;
}

const StorybookThemeWrapper = ({
  theme,
  brand,
  children,
}: StorybookThemeWrapperProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  if (resolvedTheme !== theme) {
    setTheme(theme);
  }

  useEffect(() => {
    document.documentElement.classList.toggle(BRAND_CLASS, brand === "bliv");
  }, [brand]);

  return children;
};

export const withTheme: Decorator = (Story, context) => {
  const { theme = "system", brand = "notion" } = context.globals;
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <StorybookThemeWrapper theme={theme as string} brand={brand as string}>
        <Story />
      </StorybookThemeWrapper>
    </ThemeProvider>
  );
};

export const withI18next: Decorator = (Story, context) => {
  const { locale } = context.globals;
  return (
    <I18nProvider language={locale as string}>
      <Story />
    </I18nProvider>
  );
};

export const withToast: Decorator = (Story) => (
  <>
    <Toaster />
    <Story />
  </>
);
