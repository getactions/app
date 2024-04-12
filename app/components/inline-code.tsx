import type { PropsWithChildren } from "react";

export function InlineCode({ children }: PropsWithChildren) {
  return (
    <code className="border-midnight/50 border rounded text-xs text-midnight px-1.5 py-0.5">
      {children}
    </code>
  );
}
