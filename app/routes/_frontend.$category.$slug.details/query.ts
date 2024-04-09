import { findByCategory, findById, getCategories } from "#workflows";
import { err, ok } from "neverthrow";
import { getBaseUrl } from "~/utils/get-base-url.server";
import { Model } from "./model";

function createInstallCommand(baseUrl: string, workflowId: string) {
  return `curl -s ${baseUrl}/${workflowId} | sh`;
}

export async function getModel(
  request: Request,
  category: string,
  slug: string,
) {
  const baseUrl = getBaseUrl(request);
  const currentWorkflowDao = findById(`${category}/${slug}`);
  const categoriesDao = getCategories();

  const currentCategoryDao = categoriesDao.find((c) => c.id === category);

  const workflowDaos = findByCategory(category);

  const model = Model.safeParse({
    currentCategory: currentCategoryDao,
    categories: categoriesDao,
    currentWorkflow: {
      id: currentWorkflowDao.id,
      category: currentWorkflowDao.category,
      name: currentWorkflowDao.name,
      description: currentWorkflowDao.description,
      logo: currentWorkflowDao.logo,
      title: currentWorkflowDao.title,
      readme: currentWorkflowDao.readme,
      installCommand: createInstallCommand(baseUrl, currentWorkflowDao.id),
    },
    workflows: workflowDaos.map((dao) => ({
      id: dao.id,
      category: dao.category,
      name: dao.name,
      logo: dao.logo,
      description: dao.description,
      title: dao.title,
      readme: dao.readme,
      installCommand: createInstallCommand(baseUrl, dao.id),
    })),
  });

  if (!model.success) {
    return err(new Error(`failed to prepare view model: ${model.error}`));
  }

  return ok(model.data);
}
