import { useEffect } from "react";

interface MetaOptions {
  title: string;
  description?: string;
  noIndex?: boolean;
}

/**
 * Keeps document metadata in sync with the current language and route without
 * pulling in a routing-side-effects library.
 */
export function usePageMeta({ title, description, noIndex }: MetaOptions): void {
  useEffect(() => {
    const previous = document.title;
    document.title = title;

    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? "";
    if (meta && description) meta.setAttribute("content", description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);

    const robots = document.querySelector('meta[name="robots"]');
    if (robots && noIndex) robots.setAttribute("content", "noindex");

    return () => {
      document.title = previous;
      if (meta && description) meta.setAttribute("content", previousDescription);
      if (robots && noIndex) robots.setAttribute("content", "index,follow");
    };
  }, [title, description, noIndex]);
}
