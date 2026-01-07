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
  public tenantService = inject(TenantService); // Public for template access

  icons = Icons;
  kitchenForm!: FormGroup;
  isSaving = false;
  message = { type: '', text: '' };

  ngOnInit() {
    const details = this.tenantService.kitchenDetails();

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
    const currentDetails = this.tenantService.kitchenDetails();

    if (this.kitchenForm.valid && currentDetails) {
      this.isSaving = true;
      const formValue = this.kitchenForm.value;

      const payload = {
        ...formValue,
        whatsapp: '91' + formValue.whatsapp,
      };

      this.kitchenService.updateKitchen(currentDetails.id, payload).subscribe({
        next: (updatedKitchen) => {
          this.tenantService.setKitchenDetails(updatedKitchen);

          this.message = {
            type: 'success',
            text: 'Kitchen details updated successfully!',
          };
          this.isSaving = false;

          setTimeout(() => (this.message = { type: '', text: '' }), 3000);
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
