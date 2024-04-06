import type { SatoriOptions } from "satori";

import satori from "satori";

import { Resvg } from "@resvg/resvg-js";
import { err, ok } from "neverthrow";

type GenerateOgImageRequest = Readonly<{
  title: string;
  subtitle: string;
  shell?: string;
}>;

// hypercolor gradients (https://hypercolor.dev)
const backgrounds = [
  {
    name: "Hypher",
    css: "linear-gradient(to right top, rgb(236, 72, 153), rgb(239, 68, 68), rgb(234, 179, 8))",
  },
  {
    name: "Midnight",
    css: "linear-gradient(to right top, rgb(29, 78, 216), rgb(30, 64, 175), rgb(17, 24, 39))",
  },
  {
    name: "Flamingo",
    css: "linear-gradient(to right top, rgb(244, 114, 182), rgb(219, 39, 119))",
  },
  {
    name: "Solid Blue",
    css: "linear-gradient(to left, rgb(59, 130, 246), rgb(37, 99, 235))",
  },
  {
    name: "Picture",
    css: "linear-gradient(to left bottom, rgb(217, 70, 239), rgb(220, 38, 38), rgb(251, 146, 60))",
  },
  {
    name: "Video",
    css: "linear-gradient(to left top, rgb(239, 68, 68), rgb(153, 27, 27))",
  },
  {
    name: "Pink Neon",
    css: "linear-gradient(to right, rgb(192, 38, 211), rgb(219, 39, 119))",
  },
  {
    name: "Purple Haze",
    css: "linear-gradient(to left, rgb(107, 33, 168), rgb(76, 29, 149), rgb(107, 33, 168))",
  },
  {
    name: "Emerald",
    css: "linear-gradient(to right, rgb(16, 185, 129), rgb(101, 163, 13))",
  },
  {
    name: "Salem",
    css: "linear-gradient(to top, rgb(17, 24, 39), rgb(88, 28, 135), rgb(124, 58, 237))",
  },
];

async function getFont(font: string, weights = [400, 500, 600, 700]) {
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
          tw="h-full w-full flex items-start justify-start"
          style={{
            background: background.css,
          }}
        >
          <div tw="flex items-start justify-start h-full">
            <div tw="flex flex-col justify-between w-full h-full p-4">
              <div tw="flex flex-col bg-white/70 h-full rounded-3xl justify-center">
                <h1 tw="flex justify-center text-3xl font-extrabold text-center tracking-[-2px] leading-none px-8">
                  get
                  <span tw="text-[#e11d48]">actions</span>.dev
                </h1>

                <h2 tw="flex justify-center text-7xl font-extrabold opacity-90 tracking-tight leading-10">
                  {request.title}
                </h2>
                <p tw="flex justify-center text-3xl font-medium">
                  {request.subtitle}
                </p>

                {request.shell ? (
                  <div tw="flex bg-white justify-center mt-8 mx-38 rounded-2xl border-[#e11d48]">
                    <pre tw="text-xl font-mono">{request.shell}</pre>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      );

      const svg = await satori(template, {
        width: 1200,
        height: 630,
        fonts: await getFont("Inter"),
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
