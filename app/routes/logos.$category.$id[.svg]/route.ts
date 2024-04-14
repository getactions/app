import type { LoaderFunctionArgs } from "@remix-run/node";
import { getLogo } from "./query";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = `${params.category}/${params.id}`;

  if (!id) {
    throw new Response("Bad Request", { status: 400 });
  }

  const logoResult = await getLogo(id);

  if (logoResult.isErr()) {
    console.error(logoResult.error);

    throw new Response("Internal Server Error", { status: 500 });
  }

  const logo = logoResult.value;

  if (!logo) {
    throw new Response("Not Found", { status: 404 });
  }

  return new Response(logo.contents, {
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
}
