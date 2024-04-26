import type { PropsWithChildren } from "react";

export function Banner(props: PropsWithChildren) {
  return (
    <div className="flex flex-col lg:flex-row gap-2 justify-center items-center text-white text-sm font-medium py-2 text-center bg-gradient-to-r from-fuchsia-600 to-pink-600">
      {props.children}
    </div>
  );
}
