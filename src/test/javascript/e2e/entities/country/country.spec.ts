/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CountryComponentsPage, CountryDeleteDialog, CountryUpdatePage } from './country.page-object';

const expect = chai.expect;

describe('Country e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let countryUpdatePage: CountryUpdatePage;
  let countryComponentsPage: CountryComponentsPage;
  let countryDeleteDialog: CountryDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Countries', async () => {
    await navBarPage.goToEntity('country');
    countryComponentsPage = new CountryComponentsPage();
    await browser.wait(ec.visibilityOf(countryComponentsPage.title), 5000);
    expect(await countryComponentsPage.getTitle()).to.eq('nitApp.country.home.title');
  });

  it('should load create Country page', async () => {
    await countryComponentsPage.clickOnCreateButton();
    countryUpdatePage = new CountryUpdatePage();
    expect(await countryUpdatePage.getPageTitle()).to.eq('nitApp.country.home.createOrEditLabel');
    await countryUpdatePage.cancel();
  });

  it('should create and save Countries', async () => {
    const nbButtonsBeforeCreate = await countryComponentsPage.countDeleteButtons();

    await countryComponentsPage.clickOnCreateButton();
    await promise.all([countryUpdatePage.setCountryNameInput('countryName'), countryUpdatePage.regionSelectLastOption()]);
    expect(await countryUpdatePage.getCountryNameInput()).to.eq('countryName', 'Expected CountryName value to be equals to countryName');
    await countryUpdatePage.save();
    expect(await countryUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await countryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Country', async () => {
    const nbButtonsBeforeDelete = await countryComponentsPage.countDeleteButtons();
    await countryComponentsPage.clickOnLastDeleteButton();

    countryDeleteDialog = new CountryDeleteDialog();
    expect(await countryDeleteDialog.getDialogTitle()).to.eq('nitApp.country.delete.question');
    await countryDeleteDialog.clickOnConfirmButton();

    expect(await countryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
