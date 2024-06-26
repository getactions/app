import { Link } from "@remix-run/react";
import { Separator } from "./separator";

export function Footer() {
  return (
    <footer className="bg-midnight text-white pb-8">
      <Separator gradient="hyper" />

      <div className="container flex flex-col pt-8 py-4">
        <div className="text-sm leading-tighter text-center">
          <span className="opacity-80">Proudly built at</span>{" "}
          <Link to="https://openformation.io" target="_blank">
            <strong className="font-extrabold">Open Formation</strong>
            <strong className="font-extrabold text-primary">.</strong>
          </Link>
        </div>
      </div>

      <p className="text-center text-xs font-medium text-white/50">
        © Copyright, {new Date().getFullYear()} - MIT Licensed -{" "}
        <Link
          className="hover:text-primary cursor-pointer"
          to="https://github.com/getactions/getactions"
          target="_blank"
        >
          Source
        </Link>{" "}
        -{" "}
        <Link
          className="hover:text-primary cursor-pointer"
          to="https://openformation.io/imprint.html"
          target="_blank"
        >
          Imprint
        </Link>
      </p>
    </footer>
  );
}
