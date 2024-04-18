import { Link } from "@remix-run/react";

export function Logo() {
  return (
    <Link to="/" prefetch="intent">
      <h1 className="leading-none text-midnight text-center font-extrabold text-2xl tracking-tighter">
        get<span className="text-primary">actions</span>
      </h1>
    </Link>
  );
}
