import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import type { SchoolApiFilters } from '../../services/schools/schools.type';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-map-filter',
  imports: [CardModule, SelectButtonModule, FormsModule],
  templateUrl: './map-filter.component.html',
  styleUrl: './map-filter.component.scss'
})
export class MapFilterComponent {
  @Input() filters!: SchoolApiFilters;

  @Output() updateFiltersEvent = new EventEmitter<SchoolApiFilters>();

  typeOptions = [
    { label: "Lycée", value: "Lycée" },
    { label: "Collège", value: "Collège" },
    { label: "Ecole", value: "Ecole" },
    { label: "Tout", value: "ALL" }
  ];

  update() {
    this.updateFiltersEvent.emit(this.filters);
  }
}
