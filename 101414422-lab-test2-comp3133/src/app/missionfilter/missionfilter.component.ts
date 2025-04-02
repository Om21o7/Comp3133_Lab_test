import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-missionfilter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './missionfilter.component.html',
  styleUrls: ['./missionfilter.component.css']
})
export class MissionfilterComponent {
  @Output() filterChanged = new EventEmitter<any>();

  year: string = ''; // Initialize the year property
  launchSuccess: string = ''; // Initialize the launchSuccess property
  landingSuccess: string = ''; // Initialize the landingSuccess property

  applyFilters() {
    // Emit the updated filter values to the parent component
    this.filterChanged.emit({
      year: this.year,
      launchStatus: this.launchSuccess,
      landingStatus: this.landingSuccess
    });
  }

  resetFilters() {
    // Reset filter values
    this.year = '';
    this.launchSuccess = '';
    this.landingSuccess = '';
    
    // Emit empty filters to get all data back
    this.filterChanged.emit({
      year: '',
      launchStatus: '',
      landingStatus: ''
    });
  }
}
