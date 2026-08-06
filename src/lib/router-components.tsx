import type {
  AnchorHTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";
import {
  Route,
  Router,
  Switch,
  useLocation as useWouterLocation,
} from "wouter";
import { navigateWithPageTransition } from "@/animations/pageTransitions";

export { Route, Router, Switch };

interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
}

function isModifiedNavigation(event: ReactMouseEvent<HTMLAnchorElement>) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

export function Link({ to, onClick, target, children, ...props }: LinkProps) {
  const [, navigate] = useWouterLocation();

  const handleNavigation = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      isModifiedNavigation(event) ||
      target === "_blank"
    ) {
      return;
    }

    event.preventDefault();
    navigateWithPageTransition(() => navigate(to));
  };

  return (
    <a href={to} target={target} onClick={handleNavigation} {...props}>
      {children}
    </a>
  );
}

interface NavLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> {
  to: string;
  end?: boolean;
  className?: string | ((state: { isActive: boolean }) => string);
  children: ReactNode;
}

export function NavLink({
  to,
  end = false,
  className,
  children,
  ...props
}: NavLinkProps) {
  const [pathname] = useWouterLocation();
  const isActive = end
    ? pathname === to
    : pathname === to || pathname.startsWith(`${to}/`);
  const resolvedClassName =
    typeof className === "function" ? className({ isActive }) : className;
  return (
    <Link to={to} className={resolvedClassName} {...props}>
      {children}
    </Link>
  );
}
