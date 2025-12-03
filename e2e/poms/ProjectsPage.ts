import { Page, Locator, expect } from '@playwright/test';

export class ProjectsPage {
  readonly page: Page;
  readonly createNewProjectButton: Locator;
  readonly projectNameInput: Locator;
  readonly initialTaskInput: Locator;
  readonly saveProjectButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createNewProjectButton = page.getByRole('button', { name: 'Create New Project' });
    this.projectNameInput = page.getByTestId('project-name-input');
    this.initialTaskInput = page.getByTestId('initial-task-input');
    this.saveProjectButton = page.getByTestId('save-project-button');
  }

  async goto() {
    await this.page.getByRole('link', { name: 'Projects' }).click();
  }

  async createProject(projectName: string, initialTask: string) {
    await this.createNewProjectButton.click();
    await this.projectNameInput.fill(projectName);
    await this.initialTaskInput.fill(initialTask);
    await this.saveProjectButton.click();
  }

  private projectRow(projectName: string): Locator {
    return this.page.getByTestId(`project-row-${projectName}`);
  }

  async addTaskToProject(projectName: string, taskName: string) {
    const projectRow = this.projectRow(projectName);
    await projectRow.getByRole('button', { name: 'Manage Tasks' }).click();

    // The form is in the next sibling row that appears after expanding
    const expandedRow = this.page.locator(`[data-testid="project-row-${projectName}"] + tr`);
    await expandedRow.getByPlaceholder('Add new task...').fill(taskName);
    await expandedRow.getByRole('button', { name: 'Add Task' }).click();
  }

  async verifyProjectAndTasks(projectName: string, tasks: string[]) {
    const projectRow = this.projectRow(projectName);
    await expect(projectRow).toBeVisible();
    await projectRow.getByRole('button', { name: 'Manage Tasks' }).click();

    const expandedRow = this.page.locator(`[data-testid="project-row-${projectName}"] + tr`);
    for (const task of tasks) {
      await expect(expandedRow.getByText(task)).toBeVisible();
    }
  }
}
