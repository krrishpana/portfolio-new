import { useCallback, useEffect, useState } from "react";

// Opens a README pop-up for one item in `items`, and keeps the page link in sync,
// so krrishpana.dev/#<slug> opens that item directly.
// `section` is the hash to go back to when the pop-up closes.
export default function useReadme(items, section) {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const fromHash = () => {
      const slug = decodeURIComponent(location.hash.slice(1));
      const item = items.find((x) => x.slug && x.slug === slug);
      if (item) setOpen(item);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [items]);

  const openItem = useCallback((item) => {
    history.replaceState(null, "", `#${item.slug}`);
    setOpen(item);
  }, []);

  const close = useCallback(() => {
    setOpen(null);
    if (items.some((x) => x.slug && `#${x.slug}` === location.hash)) history.replaceState(null, "", `#${section}`);
  }, [items, section]);

  return { open, openItem, close };
}
