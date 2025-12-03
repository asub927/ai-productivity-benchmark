
import { test, expect } from '@playwright/test';

test.describe('AI Productivity Benchmark', () => {
  test('should allow users to create projects and tasks, and view reports', async ({ page }) => {
    // 1. Navigate to the application
    await page.goto('http://localhost:5173/');

    // 2. Add a new project
    await page.getByRole('link', { name: 'Projects' }).click();
    await page.getByRole('button', { name: 'Create New Project' }).click();
    await page.getByTestId('project-name-input').fill('My Awesome Project');
    await page.getByTestId('initial-task-input').fill('Design a new logo');
    await page.getByTestId('save-project-button').click();

    // 3. Add a task to the project
    await page.getByRole('link', { name: 'Projects' }).click();
    await page.getByRole('button', { name: 'Manage Tasks' }).click();
    await page.getByPlaceholder('Add new task...').fill('Develop a new feature');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // 4. Add a task to the project from the Dashboard
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.getByTestId('project-select').selectOption({ label: 'My Awesome Project' });
    await page.getByTestId('activity-select').selectOption({ label: 'Develop a new feature' });
    await page.getByTestId('ai-time-input').fill('60');
    await page.getByTestId('human-time-input').fill('120');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // 4. Verify the new project and task are displayed
    await page.getByRole('link', { name: 'Projects' }).click();
    await expect(page.getByText('My Awesome Project')).toBeVisible();
    await page.getByRole('button', { name: 'Manage Tasks' }).click();
    await expect(page.getByText('Design a new logo')).toBeVisible();
    await expect(page.getByText('Develop a new feature')).toBeVisible();

    // 5. Navigate to the Reports page
    await page.getByRole('link', { name: 'Reports' }).click();
    await expect(page.getByText('Reports')).toBeVisible();

    // 6. Capture a screenshot
    await page.screenshot({ path: 'e2e/screenshot.png' });
  });
});
