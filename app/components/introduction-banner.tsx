import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { Banner } from "./banner";

export function IntroductionBanner() {
  return (
    <Banner>
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75">
          &nbsp;
        </span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-white">
          &nbsp;
        </span>
      </span>{" "}
      <span className="lg:pl-3.5">
        Introducing getactions—a community-driven central hub for effortlessly
        installing GitHub Actions workflows.
      </span>
      <Link
        to="https://github.com/getactions/getactions"
        target="_blank"
        className="flex gap-1 items-center mx-2 border rounded-sm px-2 py-1 text-xs"
      >
        <GitHubLogoIcon /> Repository
      </Link>
    </Banner>
  );
}
