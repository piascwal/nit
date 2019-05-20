/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { LocationComponentsPage, LocationDeleteDialog, LocationUpdatePage } from './location.page-object';

const expect = chai.expect;

describe('Location e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let locationUpdatePage: LocationUpdatePage;
  let locationComponentsPage: LocationComponentsPage;
  let locationDeleteDialog: LocationDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Locations', async () => {
    await navBarPage.goToEntity('location');
    locationComponentsPage = new LocationComponentsPage();
    await browser.wait(ec.visibilityOf(locationComponentsPage.title), 5000);
    expect(await locationComponentsPage.getTitle()).to.eq('nitApp.location.home.title');
  });

  it('should load create Location page', async () => {
    await locationComponentsPage.clickOnCreateButton();
    locationUpdatePage = new LocationUpdatePage();
    expect(await locationUpdatePage.getPageTitle()).to.eq('nitApp.location.home.createOrEditLabel');
    await locationUpdatePage.cancel();
  });

  it('should create and save Locations', async () => {
    const nbButtonsBeforeCreate = await locationComponentsPage.countDeleteButtons();

    await locationComponentsPage.clickOnCreateButton();
    await promise.all([
      locationUpdatePage.setStreetAddressInput('streetAddress'),
      locationUpdatePage.setPostalCodeInput('postalCode'),
      locationUpdatePage.setCityInput('city'),
      locationUpdatePage.setStateProvinceInput('stateProvince'),
      locationUpdatePage.countrySelectLastOption()
    ]);
    expect(await locationUpdatePage.getStreetAddressInput()).to.eq(
      'streetAddress',
      'Expected StreetAddress value to be equals to streetAddress'
    );
    expect(await locationUpdatePage.getPostalCodeInput()).to.eq('postalCode', 'Expected PostalCode value to be equals to postalCode');
    expect(await locationUpdatePage.getCityInput()).to.eq('city', 'Expected City value to be equals to city');
    expect(await locationUpdatePage.getStateProvinceInput()).to.eq(
      'stateProvince',
      'Expected StateProvince value to be equals to stateProvince'
    );
    await locationUpdatePage.save();
    expect(await locationUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await locationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Location', async () => {
    const nbButtonsBeforeDelete = await locationComponentsPage.countDeleteButtons();
    await locationComponentsPage.clickOnLastDeleteButton();

    locationDeleteDialog = new LocationDeleteDialog();
    expect(await locationDeleteDialog.getDialogTitle()).to.eq('nitApp.location.delete.question');
    await locationDeleteDialog.clickOnConfirmButton();

    expect(await locationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
