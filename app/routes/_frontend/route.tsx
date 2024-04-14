import { Outlet, type MetaFunction } from "@remix-run/react";
import { Footer } from "~/components/footer";
import { Logo } from "~/components/logo";

export const meta: MetaFunction = () => {
  return [{ title: "GitHub Actions Starter Workflows - getactions.dev" }];
};

export default function FrontendLayout() {
  return (
    <div className="h-screen flex flex-col gap-24">
      <header className="container flex flex-col gap-4 pt-16">
        <Logo />

        <h2 className="text-midnight text-center text-4xl font-extrabold tracking-tight">
          Easy to use GitHub Actions Starter Workflows
        </h2>

        <p className="text-center text-2xl text-gray-500 lg:w-1/2 m-auto">
          Jumpstart your next project effortlessly without the hassle of
          constructing complex GitHub Actions workflows.
        </p>
      </header>
      <main className="container flex-1 flex flex-col gap-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
