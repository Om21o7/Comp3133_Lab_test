import { Routes } from '@angular/router';
import { MissionlistComponent } from './missionlist/missionlist.component';
import { MissiondetailsComponent } from './missiondetails/missiondetails.component';

export const routes: Routes = [
  { path: '', component: MissionlistComponent },
  { path: 'mission/:id', component: MissiondetailsComponent }
];
