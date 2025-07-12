import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { SchoolsApiResult } from './schools.type';

@Injectable({
  providedIn: 'root'
})
export class SchoolsService {

  private httpClient: HttpClient = inject(HttpClient);
  private readonly url: string = "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/records?";

  getSchools(lat1: number, lng1: number, lat2: number, lng2: number): Observable<SchoolsApiResult> {
    const in_bbox = `where=in_bbox(position, ${lat1}, ${lng1}, ${lat2}, ${lng2})`;
    return this.httpClient.get<SchoolsApiResult>(this.url + in_bbox);
  }
}
