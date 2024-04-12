import { err, ok } from "neverthrow";
import { getBaseUrl } from "~/utils/get-base-url.server";
import {
  findByCategory,
  findById,
  getCategories,
} from "~/utils/workflows.server";
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
      source: currentWorkflowDao.contents,
      installCommand: createInstallCommand(baseUrl, currentWorkflowDao.id),
    },
    otherWorkflowsInCurrentCategory: workflowDaos.map((dao) => ({
      id: dao.id,
      title: dao.title,
    })),
  });

  if (!model.success) {
    return err(new Error(`failed to prepare view model: ${model.error}`));
  }

  return ok(model.data);
}
