import type { MetaFunction } from "@remix-run/node";

import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "New Open Formation Remix App" }];
};

export default function Index() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="font-extrabold text-8xl">actions</h1>
    </div>
  );
}
