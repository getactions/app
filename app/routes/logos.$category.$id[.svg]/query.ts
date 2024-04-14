import { err, ok } from "neverthrow";
import { findById } from "~/utils/workflows.server";
import { Logo } from "./model";

export async function getLogo(id: string) {
  const workflow = await findById(id);

  if (!workflow) {
    return ok(undefined);
  }

  const logo = Logo.safeParse({
    contents: workflow.logo,
  });

  if (!logo.success) {
    return err(logo.error);
  }

  return ok(logo.data);
}
