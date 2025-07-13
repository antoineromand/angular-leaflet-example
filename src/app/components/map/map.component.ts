import { Component, type AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { SchoolsService } from '../../services/schools/schools.service';
import type { SchoolApiFilters, SchoolMetadata, SchoolsApiResult } from '../../services/schools/schools.type';
import { PopupComponent } from '../popup/popup.component';
import { MapFilterComponent } from "../map-filter/map-filter.component";
import 'leaflet-minimap';

@Component({
  selector: 'app-map',
  standalone: true,
  providers: [SchoolsService],
  imports: [PopupComponent, MapFilterComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {

  private map!: L.Map;

  popupVisible = false;
  selectedSchool?: SchoolMetadata;

  private lastStoredMarkers: L.Marker[] = [];



  filters: SchoolApiFilters = {
    polygon: [],
    type: 'ALL'
  };


  private icon = new L.Icon({
    iconUrl: 'icons/map-marker.png',
    iconSize: [32, 32],          // optionnel : taille en pixels
    iconAnchor: [16, 32],        // optionnel : point d'ancrage
    popupAnchor: [0, -32]
  });

  constructor(private readonly schoolsService: SchoolsService) { }

  initLeafletMap() {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 5
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    this.map.locate({ setView: true, maxZoom: 16 });

    const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

    const positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/{z}/{x}/{y}.png', {
      attribution: cartodbAttribution
    }).addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initLeafletMap();
    this.map.on('moveend', () => {
      this.cleanMarkers();

      const zoom = this.map.getZoom();
      if (zoom < 11) {
        console.log("Zoom trop faible, pas de requête.");
        return;
      }

      const bounds = this.map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      console.log({ ne, sw });


      const polygonCoords = [
        [sw.lng, sw.lat],
        [ne.lng, sw.lat],
        [ne.lng, ne.lat],
        [sw.lng, ne.lat],
        [sw.lng, sw.lat]
      ];

      this.filters.polygon = [polygonCoords];

      this.createSchoolsMarkers(this.filters);
    });
  }

  createSchoolsMarkers(filters: SchoolApiFilters) {
    this.schoolsService.getSchools(this.filters).subscribe((next: SchoolsApiResult) => {
      next.results.forEach((school: SchoolMetadata) => {
        const marker = L.marker({ lat: school.position.lat, lng: school.position.lon }, { icon: this.icon });
        this.lastStoredMarkers.push(marker);
        marker.on("click", (e) => this.clickOnMarker(school, e)).addTo(this.map);
      });
    });
  }

  clickOnMarker(school: SchoolMetadata, e: any) {
    this.selectedSchool = school;
    this.popupVisible = true;
  }

  onClosePopup() {
    this.selectedSchool = undefined;
    this.popupVisible = false;
  }

  updateFilters(newFilters: SchoolApiFilters) {
    this.cleanMarkers();

    this.createSchoolsMarkers(newFilters);
  }

  cleanMarkers() {
    this.lastStoredMarkers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
  }

}
