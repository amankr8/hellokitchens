import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UiService } from '../../../service/ui.service';
import { Icons } from '../../../utils/icons';

@Component({
  selector: 'app-confirmation-modal',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  public uiService = inject(UiService);
  icons = Icons;
}
