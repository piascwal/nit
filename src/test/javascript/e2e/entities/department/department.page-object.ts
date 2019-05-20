import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class DepartmentComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-department div table .btn-danger'));
  title = element.all(by.css('jhi-department div h2#page-heading span')).first();

  async clickOnCreateButton(timeout?: number) {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(timeout?: number) {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons() {
    return this.deleteButtons.count();
  }

  async getTitle() {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class DepartmentUpdatePage {
  pageTitle = element(by.id('jhi-department-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  departmentNameInput = element(by.id('field_departmentName'));
  locationSelect = element(by.id('field_location'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setDepartmentNameInput(departmentName) {
    await this.departmentNameInput.sendKeys(departmentName);
  }

  async getDepartmentNameInput() {
    return await this.departmentNameInput.getAttribute('value');
  }

  async locationSelectLastOption(timeout?: number) {
    await this.locationSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async locationSelectOption(option) {
    await this.locationSelect.sendKeys(option);
  }

  getLocationSelect(): ElementFinder {
    return this.locationSelect;
  }

  async getLocationSelectedOption() {
    return await this.locationSelect.element(by.css('option:checked')).getText();
  }

  async save(timeout?: number) {
    await this.saveButton.click();
  }

  async cancel(timeout?: number) {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class DepartmentDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-department-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-department'));

  async getDialogTitle() {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
