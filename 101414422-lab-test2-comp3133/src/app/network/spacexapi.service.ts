import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpacexapiService {
  private baseUrl = 'https://api.spacexdata.com/v3/launches';

  constructor(private http: HttpClient) {}

  getAllMissions(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getMissionByFlightNumber(flightNumber: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${flightNumber}`);
  }

  getFilteredMissions(filters: { year: string, launchStatus: string, landingStatus: string }): Observable<any> {
    let url = this.baseUrl;
    let queryParams: string[] = [];

    if (filters.year) {
      queryParams.push(`launch_year=${filters.year}`);
    }

  
    if (filters.launchStatus) {
      queryParams.push(`launch_success=${filters.launchStatus === 'successful' ? 'true' : 'false'}`);
    }

 
    if (filters.landingStatus) {
      queryParams.push(`land_success=${filters.landingStatus === 'successful' ? 'true' : 'false'}`);
    }


    if (queryParams.length) {
      url += '?' + queryParams.join('&');
    }

    return this.http.get<any>(url);
  }
}
