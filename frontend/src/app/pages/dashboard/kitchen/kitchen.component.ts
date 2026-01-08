import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { KitchenService } from '../../../service/kitchen.service';
import { Icons } from '../../../utils/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UiService } from '../../../service/ui.service';

@Component({
  selector: 'app-kitchen',
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './kitchen.component.html',
})
export class KitchenComponent {
  private fb = inject(FormBuilder);
  private kitchenService = inject(KitchenService);
  private uiService = inject(UiService);

  icons = Icons;

  kitchen = this.kitchenService.kitchen;
  loading = this.kitchenService.loading;
  error = this.kitchenService.error;

  saving = signal(false);

  kitchenForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    tagline: [''],
    address: ['', Validators.required],
    whatsapp: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
  });

  constructor() {
    effect(() => {
      const kitchen = this.kitchen();
      if (!kitchen) return;

      this.kitchenForm.patchValue(
        {
          name: kitchen.name,
          tagline: kitchen.tagline,
          address: kitchen.address,
          whatsapp: kitchen.whatsapp,
        },
        { emitEvent: false }
      );
      this.kitchenForm.markAsPristine();
    });
  }

  ngOnInit() {
    this.kitchenService.loadKitchen();
  }

  onUpdate() {
    const kitchen = this.kitchen();
    if (this.kitchenForm.valid && kitchen && !this.saving()) {
      this.saving.set(true);

      const payload = this.kitchenForm.value;

      this.kitchenService.updateKitchen(kitchen.id, payload).subscribe({
        next: (updatedKitchen) => {
          this.uiService.showToast('Kitchen profile updated successfully!');
          this.kitchenForm.markAsPristine();
        },
        error: () => {
          this.uiService.showToast('Failed to update profile', 'error');
        },
        complete: () => this.saving.set(false),
      });
    }
  }
}
