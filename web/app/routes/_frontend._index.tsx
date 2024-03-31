import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "getactions.dev" }];
};

export default function Index() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="font-extrabold text-8xl">actions</h1>
    </div>
  );
}
