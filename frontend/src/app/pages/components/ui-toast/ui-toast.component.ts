import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UiService } from '../../../service/ui.service';
import { Icons } from '../../../utils/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-toast',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './ui-toast.component.html',
})
export class UiToastComponent {
  public uiService = inject(UiService);
  icons = Icons;
}
