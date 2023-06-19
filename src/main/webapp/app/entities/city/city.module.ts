import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import {CityRoutingModule} from "./route/city-routing.module";
import {CityComponent} from "./list/city.component";
import {CityDetailComponent} from "./detail/city-detail.component";
import {CityUpdateComponent} from "./update/city-update.component";
import {CityDeleteDialogComponent} from "./delete/city-delete-dialog.component";
import {Base64Pipe} from "../../shared/language/base64ToImage.pipe";

@NgModule({
  imports: [SharedModule, CityRoutingModule],
  declarations: [CityComponent, CityDetailComponent, CityUpdateComponent, CityDeleteDialogComponent, Base64Pipe],
})
export class CityModule {}
