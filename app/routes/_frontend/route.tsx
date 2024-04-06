import {
  Outlet,
  json,
  useLoaderData,
  type MetaFunction,
} from "@remix-run/react";
import { Footer } from "~/components/footer";
import { getWorkflowCategories } from "./query";

export async function loader() {
  const resultOfGettingCategories = await getWorkflowCategories();

  if (resultOfGettingCategories.isErr()) {
    console.error(resultOfGettingCategories.error);

    throw new Response("Internal Server Error", { status: 500 });
  }

  const categories = resultOfGettingCategories.value;

  return json({ categories });
}

export const meta: MetaFunction = () => {
  return [{ title: "GitHub Actions Starter Workflows - getactions.dev" }];
};

export default function FrontendLayout() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="h-screen flex flex-col gap-24">
      <header className="container flex flex-col gap-4 pt-16">
        <h1 className="leading-none text-midnight text-center font-extrabold text-2xl tracking-tight">
          get<span className="text-primary">actions</span>
        </h1>
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
