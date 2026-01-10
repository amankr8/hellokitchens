import { Component, inject, output, signal } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { Icons } from '../../../utils/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp-login',
  imports: [FontAwesomeModule, FormsModule, CommonModule],
  templateUrl: './otp-login.component.html',
})
export class OtpLoginComponent {
  private authService = inject(AuthService);

  icons = Icons;

  step = signal<'phone' | 'otp'>('phone');
  loading = signal(false);
  phoneNumber = '';
  otpValue = '';

  recaptchaVerifier: any;
  // confirmationResult: ConfirmationResult | null = null;

  // Events
  close = output<void>();
  success = output<void>();

  ngOnInit() {
    this.setupRecaptcha();
  }

  setupRecaptcha() {
    // this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {
    //   size: 'invisible' // Keeps the UI clean
    // });
  }

  async sendOtp() {
    // this.loading.set(true);
    // try {
    //   // Ensure phone number has country code, e.g., +91
    //   const formattedPhone = `+91${this.phoneNumber}`;
    //   this.confirmationResult = await signInWithPhoneNumber(this.auth, formattedPhone, this.recaptchaVerifier);
    //   this.step.set('otp');
    // } catch (error) {
    //   console.error('SMS Send Error', error);
    // } finally {
    //   this.loading.set(false);
    // }
  }

  async verifyOtp() {
    // this.loading.set(true);
    // try {
    //   const result = await this.confirmationResult?.confirm(this.otpValue);
    //   const firebaseToken = await result?.user.getIdToken();
    //   if (firebaseToken) {
    //     // Send to your backend JWT endpoint
    //     this.authService.firebaseLogin(firebaseToken).subscribe({
    //       next: () => this.success.emit(),
    //       error: (err) => console.error('Backend Auth Failed', err),
    //     });
    //   }
    // } catch (error) {
    //   console.error('Invalid OTP', error);
    // } finally {
    //   this.loading.set(false);
    // }
  }
}
