import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NitSharedLibsModule, NitSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [NitSharedLibsModule, NitSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [NitSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NitSharedModule {
  static forRoot() {
    return {
      ngModule: NitSharedModule
    };
  }
}
