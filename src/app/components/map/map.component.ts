import { Component, type AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { SchoolsService } from '../../services/schools/schools.service';
import type { SchoolMetadata } from '../../services/schools/schools.type';

@Component({
  selector: 'app-map',
  providers: [SchoolsService],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {

  private map!: L.Map;
  private markedPoints: L.Marker[] = [];

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
  }

  ngAfterViewInit(): void {
    this.initLeafletMap();
    this.map.on('moveend', () => {
      const center = this.map.getCenter();
      const zoom = this.map.getZoom();
      const bounds = this.map.getBounds();
      const location = {
        northEast: bounds.getNorthEast(),
        southWest: bounds.getSouthWest()
      };

      this.schoolsService.getSchools(location.southWest.lat, location.southWest.lng, location.northEast.lat, location.northEast.lng).subscribe((next) => {
        this.markedPoints = [];
        next.results.forEach((school) => {
          L.marker({ lat: school.position.lat, lng: school.position.lon }, { icon: this.icon }).on("click", (e) => this.clickOnMarker(school, e)).addTo(this.map);
        });
      });
    });
  }

  clickOnMarker(school: SchoolMetadata, e: any) {
    console.log(school.nom_etablissement);
  }

}
