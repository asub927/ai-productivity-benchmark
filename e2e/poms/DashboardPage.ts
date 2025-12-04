import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly projectSelect: Locator;
  readonly activitySelect: Locator;
  readonly aiTimeInput: Locator;
  readonly humanTimeInput: Locator;
  readonly addTaskButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.projectSelect = page.getByTestId('project-select');
    this.activitySelect = page.getByTestId('activity-select');
    this.aiTimeInput = page.getByTestId('ai-time-input');
    this.humanTimeInput = page.getByTestId('human-time-input');
    this.addTaskButton = page.getByRole('button', { name: 'Add Task' });
  }

  async goto() {
    await this.page.getByRole('link', { name: 'Dashboard' }).click();
  }

  async addTask(projectName: string, taskName: string, aiTime: string, humanTime: string) {
    await this.projectSelect.selectOption({ label: projectName });
    await this.activitySelect.selectOption({ label: taskName });
    await this.aiTimeInput.fill(aiTime);
    await this.humanTimeInput.fill(humanTime);
    await this.addTaskButton.click();
  }
}
