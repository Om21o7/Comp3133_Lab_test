import { Component, OnInit } from '@angular/core';
import { SpacexapiService } from '../network/spacexapi.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MissionfilterComponent } from '../missionfilter/missionfilter.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-missionlist',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, MissionfilterComponent, FormsModule], // <-- Add FormsModule here
  templateUrl: './missionlist.component.html',
  styleUrls: ['./missionlist.component.css']
})
export class MissionlistComponent implements OnInit {
  missions: any[] = [];
  filteredMissions: any[] = [];

  constructor(private spacexService: SpacexapiService) {}

  ngOnInit(): void {
    // Initially, fetch missions without any filters
    this.fetchMissions({
      year: '',
      launchStatus: '',
      landingStatus: ''
    });
  }

  // Method to fetch missions based on the filters
  fetchMissions(filters: { year: string, launchStatus: string, landingStatus: string }) {
    this.spacexService.getFilteredMissions(filters).subscribe((data: any[]) => {
      this.missions = data;
      this.filteredMissions = data;
    });
  }

  // Method that listens for filter changes from MissionfilterComponent
  onFiltersChange(filters: { year: string, launchStatus: string, landingStatus: string }) {
    this.fetchMissions(filters);  // Fetch missions based on new filters
  }
}
