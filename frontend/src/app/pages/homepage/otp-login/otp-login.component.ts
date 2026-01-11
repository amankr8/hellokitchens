import { Component, inject, output, signal } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { Icons } from '../../../utils/icons';
import { CommonModule } from '@angular/common';
import {
  Auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from '@angular/fire/auth';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-otp-login',
  imports: [FontAwesomeModule, FormsModule, CommonModule],
  templateUrl: './otp-login.component.html',
})
export class OtpLoginComponent {
  private auth = inject(Auth);
  private authService = inject(AuthService);

  icons = Icons;

  step = signal<'phone' | 'otp'>('phone');
  loading = signal(false);
  error = signal<string | null>(null);
  countdown = signal(0);
  timerSubscription?: Subscription;

  phoneNumber = '';
  otpValue = '';

  recaptchaVerifier: any;
  confirmationResult: ConfirmationResult | null = null;

  success = output<void>();
  close = output<void>();

  ngAfterViewInit() {
    this.setupRecaptcha();
  }

  startTimer() {
    this.countdown.set(30);
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.countdown() > 0) {
        this.countdown.update((v) => v - 1);
      } else {
        this.timerSubscription?.unsubscribe();
      }
    });
  }

  setupRecaptcha() {
    this.recaptchaVerifier = new RecaptchaVerifier(
      this.auth,
      'recaptcha-container',
      {
        size: 'invisible',
      }
    );
  }

  async sendOtp() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const formattedPhone = `+91${this.phoneNumber}`;
      this.confirmationResult = await signInWithPhoneNumber(
        this.auth,
        formattedPhone,
        this.recaptchaVerifier
      );
      this.step.set('otp');
      this.startTimer();
    } catch (error) {
      this.error.set('Failed to send SMS. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  async verifyOtp() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const result = await this.confirmationResult?.confirm(this.otpValue);
      const firebaseToken = await result?.user.getIdToken();

      if (firebaseToken) {
        this.authService.firebaseLogin(firebaseToken).subscribe({
          next: () => this.success.emit(),
          error: (err) => console.error('Backend Auth Failed', err),
        });
      }
    } catch (error) {
      this.error.set('Invalid code. Please check and try again.');
      this.otpValue = '';
      this.loading.set(false);
    }
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
    this.recaptchaVerifier?.clear();
  }
}
