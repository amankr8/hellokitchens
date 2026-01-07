import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MenuService } from '../../../../service/menu.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../../utils/icons';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-menu-item',
  imports: [CommonModule, FontAwesomeModule, RouterLink, ReactiveFormsModule],
  templateUrl: './add-menu-item.component.html',
  styleUrl: './add-menu-item.component.scss',
})
export class AddMenuItemComponent {
  showAddModal = false;
  itemForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  icons = Icons;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private menuService: MenuService
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      category: ['STARTERS', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      isVeg: [true],
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  toggleVeg() {
    const current = this.itemForm.get('isVeg')?.value;
    this.itemForm.patchValue({ isVeg: !current });
  }

  onSubmit() {
    if (this.itemForm.valid && this.selectedFile) {
      const formData = new FormData();

      Object.keys(this.itemForm.value).forEach((key) => {
        formData.append(key, this.itemForm.value[key]);
      });

      formData.append('image', this.selectedFile);

      this.menuService.addMenuItem(formData).subscribe({
        next: (res) => {
          console.log('Item created successfully');
          this.router.navigate(['/dashboard/menu']);
        },
        error: (err) => {
          console.error('Upload failed', err);
        },
      });
    }
  }
}
