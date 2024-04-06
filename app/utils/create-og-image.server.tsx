import type { SatoriOptions } from "satori";

import satori from "satori";

import { Resvg } from "@resvg/resvg-js";
import { err, ok } from "neverthrow";

type GenerateOgImageRequest = Readonly<{
  title: string;
  subtitle?: string;
  shell?: string;
}>;

// hypercolor gradients (https://hypercolor.dev)
const backgrounds = [
  {
    name: "Hypher",
    css: "linear-gradient(to right top, rgb(236, 72, 153), rgb(239, 68, 68), rgb(234, 179, 8))",
  },
  {
    name: "Picture",
    css: "linear-gradient(to left bottom, rgb(217, 70, 239), rgb(220, 38, 38), rgb(251, 146, 60))",
  },
  {
    name: "Pink Neon",
    css: "linear-gradient(to right, rgb(192, 38, 211), rgb(219, 39, 119))",
  },
  {
    name: "Emerald",
    css: "linear-gradient(to right, rgb(16, 185, 129), rgb(101, 163, 13))",
  },
];

async function getFonts(fonts: string[], weights = [400, 500, 600, 700]) {
  return (
    await Promise.all(
      fonts.map(async (font) => {
        const css = await fetch(
          `https://fonts.googleapis.com/css2?family=${font}:wght@${weights.join(
            ";",
          )}`,
          {
            headers: {
              // Make sure it returns TTF.
              "User-Agent":
                "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
            },
          },
        ).then((response) => response.text());

        const resource = css.matchAll(
          /src: url\((.+)\) format\('(opentype|truetype)'\)/g,
        );

        return Promise.all(
          [...resource]
            .map((match) => match[1])
            .map((url) => fetch(url).then((response) => response.arrayBuffer()))
            .map(async (buffer, i) => ({
              name: font,
              style: "normal",
              weight: weights[i],
              data: await buffer,
            })),
        ) as Promise<SatoriOptions["fonts"]>;
      }),
    )
  ).flatMap((x) => x);
}

declare module "react" {
  interface HTMLAttributes<T> {
    tw?: string;
  }
}

export function makeGenerateOgImage() {
  // Random background gradient
  const background =
    backgrounds[Math.floor(Math.random() * backgrounds.length)];

  return async (request: GenerateOgImageRequest) => {
    try {
      const template = (
        <div
          tw="flex flex-col w-full h-full py-8"
          style={{
            background: background.css,
          }}
        >
          <h1 tw="flex justify-center text-3xl font-extrabold text-center tracking-[-2px]">
            <span tw=" bg-white px-8 py-2 shadow-2xl rounded-full block">
              get
              <span tw="text-[#e11d48]">actions</span>.dev
            </span>
          </h1>
          <h2 tw="flex justify-center text-7xl font-extrabold tracking-tight leading-tight text-center px-23 text-white">
            {request.title}
          </h2>
          {request.subtitle ? (
            <p tw="flex justify-center text-3xl font-medium w-1/2 mx-auto text-center text-white">
              {request.subtitle}
            </p>
          ) : null}

          {request.shell ? (
            <div tw="flex justify-center mt-14 mx-30 rounded-full bg-white shadow-2xl">
              <pre
                tw="text-xl font-medium"
                style={{ fontFamily: "Space Mono" }}
              >
                {request.shell}
              </pre>
            </div>
          ) : null}
        </div>
      );

      const svg = await satori(template, {
        width: 1200,
        height: 630,
        fonts: await getFonts(["Inter", "Space Mono"]),
      });

      const resvg = new Resvg(svg);
      const pngData = resvg.render();
      const image = pngData.asPng();

      return ok({ image });
    } catch (cause) {
      return err(cause instanceof Error ? cause : new Error(cause as string));
    }
  };
}
