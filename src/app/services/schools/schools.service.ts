import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { SchoolApiFilters, SchoolsApiResult, SchoolType } from './schools.type';

@Injectable({
  providedIn: 'root'
})
export class SchoolsService {

  private httpClient: HttpClient = inject(HttpClient);
  private readonly url: string = "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/records?";

  getSchools(filters: SchoolApiFilters): Observable<SchoolsApiResult> {
    const in_bbox = `where=in_bbox(position, ${filters.lat1}, ${filters.lng1}, ${filters.lat2}, ${filters.lng2})`;
    const school_type = filters.type != "ALL" ? `&where=search(type_etablissement,"${filters.type}")` : ``;
    return this.httpClient.get<SchoolsApiResult>(this.url + in_bbox + school_type);
  }
}
