import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import type { SchoolMetadata } from '../../services/schools/schools.type';


@Component({
  selector: 'app-popup',
  imports: [DialogModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {
  @Input() school_infos!: SchoolMetadata | undefined;
  @Input() visible: boolean = false;
  @Output() onPopupClose = new EventEmitter<boolean>();

  onClose() {
    this.onPopupClose.emit(true);
  }
}
