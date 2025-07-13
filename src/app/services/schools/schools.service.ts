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
    const geoJsonPolygon = {
      type: "Polygon",
      coordinates: filters.polygon
    };
    const whereParam = `intersects(position, geom'${JSON.stringify(geoJsonPolygon)}')`;
    const urlEncodedWhere = encodeURIComponent(whereParam);

    const schoolTypeValue = `search(type_etablissement,"${filters.type}")`;
    const school_type = filters.type != "ALL" ? `&where=${encodeURIComponent(schoolTypeValue)}` : ``;

    const url = `${this.url}where=${urlEncodedWhere}${school_type}&limit=100`;
    return this.httpClient.get<SchoolsApiResult>(url);
  }
}
