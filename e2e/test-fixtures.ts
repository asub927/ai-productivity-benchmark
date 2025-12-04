import { test as base } from '@playwright/test';
import { DashboardPage } from './poms/DashboardPage';
import { ProjectsPage } from './poms/ProjectsPage';

type MyFixtures = {
  dashboardPage: DashboardPage;
  projectsPage: ProjectsPage;
};

export const test = base.extend<MyFixtures>({
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  projectsPage: async ({ page }, use) => {
    await use(new ProjectsPage(page));
  },
});

export { expect } from '@playwright/test';
