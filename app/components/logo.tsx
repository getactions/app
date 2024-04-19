import { Link } from "@remix-run/react";
import { cn } from "~/utils/cn";

type Props = Readonly<{
  hero?: boolean;
}>;

export function Logo(props: Props) {
  return (
    <Link to="/" prefetch="intent">
      <h1
        className={cn(
          "leading-none text-midnight text-center font-extrabold text-2xl tracking-tighter",
          props.hero && "text-3xl",
        )}
      >
        get<span className="text-primary">actions</span>
      </h1>
    </Link>
  );
}
