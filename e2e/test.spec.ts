
import { test, expect } from '@playwright/test';
import { DashboardPage } from './poms/DashboardPage';
import { ProjectsPage } from './poms/ProjectsPage';

test.describe('AI Productivity Benchmark', () => {
  test('should allow users to create projects and tasks, and view reports', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const projectsPage = new ProjectsPage(page);

    const projectName = 'My Awesome Project';
    const initialTask = 'Design a new logo';
    const additionalTask = 'Develop a new feature';

    // 1. Navigate to the application
    await page.goto('/');

    // 2. Create a new project
    await projectsPage.goto();
    await projectsPage.createProject(projectName, initialTask);

    // 3. Add an additional task to the project
    await projectsPage.addTaskToProject(projectName, additionalTask);

    // 4. Add task data from the dashboard
    await dashboardPage.goto();
    await dashboardPage.addTask(projectName, additionalTask, '60', '120');

    // 5. Verify the project and tasks are displayed correctly
    await projectsPage.goto();
    await projectsPage.verifyProjectAndTasks(projectName, [initialTask, additionalTask]);

    // 6. Navigate to the Reports page and verify it loads
    await page.getByRole('link', { name: 'Reports' }).click();
    await expect(page.getByText('Reports')).toBeVisible();
  });
});
