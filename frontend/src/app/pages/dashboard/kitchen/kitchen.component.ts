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

@Component({
  selector: 'app-kitchen',
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './kitchen.component.html',
})
export class KitchenComponent {
  private fb = inject(FormBuilder);
  private kitchenService = inject(KitchenService);

  icons = Icons;

  kitchen = this.kitchenService.kitchen;
  loading = this.kitchenService.loading;
  error = this.kitchenService.error;

  saving = signal(false);
  message = signal<{ type: 'success' | 'error'; text: string } | null>(null);

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

      this.kitchenForm.patchValue({
        name: kitchen.name,
        tagline: kitchen.tagline,
        address: kitchen.address,
        whatsapp: kitchen.whatsapp,
      });
    });
  }

  ngOnInit() {
    this.kitchenService.loadKitchen();
  }

  onUpdate() {
    const kitchen = this.kitchen();
    if (this.kitchenForm.valid && kitchen && !this.saving()) {
      this.saving.set(true);
      this.message.set(null);

      const payload = this.kitchenForm.value;

      this.kitchenService.updateKitchen(kitchen.id, payload).subscribe({
        next: (updatedKitchen) => {
          this.message.set({
            type: 'success',
            text: 'Kitchen details updated successfully!',
          });
          this.kitchenForm.markAsPristine();
        },
        error: () => {
          this.message.set({
            type: 'error',
            text: this.error() ?? 'Failed to update kitchen details.',
          });
        },
        complete: () => this.saving.set(false),
      });
    }
  }
}
