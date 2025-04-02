import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpacexapiService } from '../network/spacexapi.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-missiondetails',
  templateUrl: './missiondetails.component.html',
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true,
  styleUrls: ['./missiondetails.component.css']
})
export class MissiondetailsComponent implements OnInit {
  mission: any;

  constructor(
    private route: ActivatedRoute,
    private spacexService: SpacexapiService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.spacexService.getMissionByFlightNumber(id).subscribe(data => {
      this.mission = data;
    });
  }
}
