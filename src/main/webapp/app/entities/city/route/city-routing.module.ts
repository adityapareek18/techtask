import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CityComponent } from '../list/city.component';
import { CityDetailComponent } from '../detail/city-detail.component';
import { CityUpdateComponent } from '../update/city-update.component';
import { CityRoutingResolveService } from './city-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const bankAccountRoute: Routes = [
  {
    path: '',
    component: CityComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CityDetailComponent,
    resolve: {
      city: CityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CityUpdateComponent,
    resolve: {
      city: CityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CityUpdateComponent,
    resolve: {
      city: CityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bankAccountRoute)],
  exports: [RouterModule],
})
export class CityRoutingModule {}
