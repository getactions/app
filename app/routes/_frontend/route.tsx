import { Outlet, type MetaFunction } from "@remix-run/react";
import { Footer } from "~/components/footer";
import { IntroductionBanner } from "~/components/introduction-banner";
import { Logo } from "~/components/logo";
import { Separator } from "~/components/ui/separator";

export const meta: MetaFunction = () => {
  return [{ title: "GitHub Actions Starter Workflows - getactions.dev" }];
};

export default function FrontendLayout() {
  return (
    <>
      <IntroductionBanner />

      <div className="h-screen flex flex-col gap-24">
        <header className="container flex flex-col lg:flex-row justify-center items-center gap-4 pt-10">
          <Logo />

          <Separator orientation="vertical" className="hidden lg:block" />

          <h2 className="text-midnight text-center text-sm font-medium text-muted-foreground tracking-tight">
            Easy to use GitHub Actions Starter Workflows
          </h2>
        </header>
        <main className="container flex-1 flex flex-col gap-20">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
