import type { LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { makeGenerateOgImage } from "~/utils/create-og-image.server";
import { getModel } from "./query";

const ParamsSchema = z.object({
  category: z.string(),
});

export async function loader(args: LoaderFunctionArgs) {
  const params = ParamsSchema.safeParse(args.params);

  if (!params.success) {
    throw new Response("Bad Request", { status: 400 });
  }

  const fetchModelResult = await getModel(params.data.category);

  if (fetchModelResult.isErr()) {
    console.error(fetchModelResult.error);

    throw new Response("Internal Server Error", { status: 500 });
  }

  const model = fetchModelResult.value;

  const createOgImage = makeGenerateOgImage();

  const resultOfGeneratingImage = await createOgImage({
    title: `${model.name} Workflows`,
    subtitle: model.description,
  });

  if (resultOfGeneratingImage.isErr()) {
    throw new Response("Internal Server Error", { status: 500 });
  }

  const { image } = resultOfGeneratingImage.value;

  return new Response(image, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
