import { getCategories } from "#workflows";
import { redirect } from "@remix-run/react";

export async function loader() {
  // Get first category
  const category = (await getCategories()).at(0);

  return redirect(`/${category?.id}`);
}
