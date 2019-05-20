import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'region',
        loadChildren: './region/region.module#NitRegionModule'
      },
      {
        path: 'country',
        loadChildren: './country/country.module#NitCountryModule'
      },
      {
        path: 'location',
        loadChildren: './location/location.module#NitLocationModule'
      },
      {
        path: 'department',
        loadChildren: './department/department.module#NitDepartmentModule'
      },
      {
        path: 'task',
        loadChildren: './task/task.module#NitTaskModule'
      },
      {
        path: 'employee',
        loadChildren: './employee/employee.module#NitEmployeeModule'
      },
      {
        path: 'job',
        loadChildren: './job/job.module#NitJobModule'
      },
      {
        path: 'job-history',
        loadChildren: './job-history/job-history.module#NitJobHistoryModule'
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NitEntityModule {}
