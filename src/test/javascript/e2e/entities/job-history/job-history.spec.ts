/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { JobHistoryComponentsPage, JobHistoryDeleteDialog, JobHistoryUpdatePage } from './job-history.page-object';

const expect = chai.expect;

describe('JobHistory e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let jobHistoryUpdatePage: JobHistoryUpdatePage;
  let jobHistoryComponentsPage: JobHistoryComponentsPage;
  let jobHistoryDeleteDialog: JobHistoryDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load JobHistories', async () => {
    await navBarPage.goToEntity('job-history');
    jobHistoryComponentsPage = new JobHistoryComponentsPage();
    await browser.wait(ec.visibilityOf(jobHistoryComponentsPage.title), 5000);
    expect(await jobHistoryComponentsPage.getTitle()).to.eq('nitApp.jobHistory.home.title');
  });

  it('should load create JobHistory page', async () => {
    await jobHistoryComponentsPage.clickOnCreateButton();
    jobHistoryUpdatePage = new JobHistoryUpdatePage();
    expect(await jobHistoryUpdatePage.getPageTitle()).to.eq('nitApp.jobHistory.home.createOrEditLabel');
    await jobHistoryUpdatePage.cancel();
  });

  it('should create and save JobHistories', async () => {
    const nbButtonsBeforeCreate = await jobHistoryComponentsPage.countDeleteButtons();

    await jobHistoryComponentsPage.clickOnCreateButton();
    await promise.all([
      jobHistoryUpdatePage.setStartDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      jobHistoryUpdatePage.setEndDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      jobHistoryUpdatePage.languageSelectLastOption(),
      jobHistoryUpdatePage.jobSelectLastOption(),
      jobHistoryUpdatePage.departmentSelectLastOption(),
      jobHistoryUpdatePage.employeeSelectLastOption()
    ]);
    expect(await jobHistoryUpdatePage.getStartDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected startDate value to be equals to 2000-12-31'
    );
    expect(await jobHistoryUpdatePage.getEndDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected endDate value to be equals to 2000-12-31'
    );
    await jobHistoryUpdatePage.save();
    expect(await jobHistoryUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await jobHistoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last JobHistory', async () => {
    const nbButtonsBeforeDelete = await jobHistoryComponentsPage.countDeleteButtons();
    await jobHistoryComponentsPage.clickOnLastDeleteButton();

    jobHistoryDeleteDialog = new JobHistoryDeleteDialog();
    expect(await jobHistoryDeleteDialog.getDialogTitle()).to.eq('nitApp.jobHistory.delete.question');
    await jobHistoryDeleteDialog.clickOnConfirmButton();

    expect(await jobHistoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
