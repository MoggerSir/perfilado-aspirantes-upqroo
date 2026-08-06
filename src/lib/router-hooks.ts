import { useLocation as useWouterLocation, useParams } from "wouter";
import { navigateWithPageTransition } from "@/animations/pageTransitions";

export { useParams };

export function useNavigate() {
  const [, navigate] = useWouterLocation();
  return (destination: string) => {
    navigateWithPageTransition(() => navigate(destination));
  };
}

export function useLocation() {
  const [pathname] = useWouterLocation();
  return { pathname };
}

export function useSearchParams(): [
  URLSearchParams,
  (next: Record<string, string>, options?: { replace?: boolean }) => void,
] {
  const search = typeof window === "undefined" ? "" : window.location.search;
  return [new URLSearchParams(search), updateSearchParams];
}

function updateSearchParams(
  next: Record<string, string>,
  options?: { replace?: boolean },
) {
  const query = new URLSearchParams(next).toString();
  const url = `${window.location.pathname}?${query}`;
  if (options?.replace) window.history.replaceState(null, "", url);
  else window.history.pushState(null, "", url);
}
