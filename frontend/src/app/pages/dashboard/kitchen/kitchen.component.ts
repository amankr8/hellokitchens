import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { KitchenService } from '../../../service/kitchen.service';
import { TenantService } from '../../../service/tenant.service';

@Component({
  selector: 'app-kitchen',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './kitchen.component.html',
})
export class KitchenComponent {
  private fb = inject(FormBuilder);
  private kitchenService = inject(KitchenService);
  private tenantService = inject(TenantService);

  kitchenForm!: FormGroup;
  isSaving = false;
  message = { type: '', text: '' };

  ngOnInit() {
    const details = this.tenantService.kitchenDetails;

    let rawPhone = details?.whatsapp || '';
    if (rawPhone.startsWith('91')) rawPhone = rawPhone.substring(2);
    else if (rawPhone.startsWith('+91')) rawPhone = rawPhone.substring(3);

    this.kitchenForm = this.fb.group({
      name: [details?.name || '', [Validators.required]],
      tagline: [details?.tagline || ''],
      address: [details?.address || '', Validators.required],
      whatsapp: [
        rawPhone,
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
    });
  }

  onUpdate() {
    if (this.kitchenForm.valid && this.tenantService.kitchenDetails) {
      this.isSaving = true;
      const kitchenId = this.tenantService.kitchenDetails.id;
      const formValue = this.kitchenForm.value;

      const payload = {
        ...formValue,
        whatsapp: '91' + formValue.whatsapp,
      };

      this.kitchenService.updateKitchen(kitchenId, payload).subscribe({
        next: (updatedKitchen) => {
          this.tenantService.kitchenDetails = updatedKitchen; // Sync local state
          this.message = {
            type: 'success',
            text: 'Kitchen details updated successfully!',
          };
          this.isSaving = false;
        },
        error: (err) => {
          this.message = {
            type: 'error',
            text: 'Failed to update. Please try again.',
          };
          this.isSaving = false;
        },
      });
    }
  }
}
