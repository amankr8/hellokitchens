import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { KitchenService } from '../../../service/kitchen.service';
import { UserService } from '../../../service/user.service';
import { CartService } from '../../../service/cart.service';
import { OrderService } from '../../../service/order.service';
import { Router, RouterLink } from '@angular/router';
import { UiService } from '../../../service/ui.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Icons } from '../../../utils/icons';
import { APP_NAME } from '../../../constants/app.constant';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../service/location.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CartItem } from '../../../model/cart-item';
import { Address } from '../../../model/user';

declare var google: any;

@Component({
  selector: 'app-delivery-details',
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './delivery-details.component.html',
})
export class DeliveryDetailsComponent {
  @ViewChild('addressSearch') addressSearchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addressDetails')
  addressDetailsArea!: ElementRef<HTMLTextAreaElement>;

  kitchenService = inject(KitchenService);
  userService = inject(UserService);
  cartService = inject(CartService);
  orderService = inject(OrderService);
  locationService = inject(LocationService);
  router = inject(Router);
  uiService = inject(UiService);
  fb = inject(FormBuilder);

  kitchen = this.kitchenService.kitchen;
  cartItems = this.cartService.cartItems;
  specialInstructions = this.cartService.notes;

  user = this.userService.user;
  isUserLoading = this.userService.loading;
  errorLoadingUser = this.userService.error;

  selectedAddressId = signal<number | null>(null);
  editingAddressId = signal<number | null>(null);
  isPlacingOrder = signal(false);
  isRegistering = signal(false);
  isAddingNewAddress = signal(false);
  savingNewAddress = signal(false);
  isLocating = signal(false);

  isUserRegistered = computed(() => !!this.user()?.name);

  private searchTimer: any;
  searchQuery = signal('');
  searchResults = signal<any[]>([]);
  private autocompleteService: any;

  icons = Icons;

  userForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phone: [''],
    address: ['', Validators.required],
  });

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => this.onSearchChange(query));

    effect(() => {
      const user = this.user();
      if (!user) return;

      this.userForm.patchValue(
        {
          name: user.name || '',
          phone: user.phone || '',
        },
        { emitEvent: false }
      );

      if (user.addresses?.length > 0 && !this.selectedAddressId()) {
        const defaultAddr =
          user.addresses.find((a) => a.id === user.defaultAddressId) ||
          user.addresses[0];
        this.selectAddress(defaultAddr);
      }
    });
  }

  ngOnInit() {
    this.userService.loadUser();
    const kitchenName = this.kitchen()?.name ?? APP_NAME;
    document.title = kitchenName + ' - Cart';
    if (typeof google !== 'undefined') {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    }
  }

  registerName() {
    const name = this.userForm.get('name')?.value;
    if (!name || this.isRegistering()) return;

    this.isRegistering.set(true);
    this.userService.registerUser({ name }).subscribe({
      next: () => {
        this.isRegistering.set(false);
        this.uiService.showToast('Profile registered!');
      },
      error: () => {
        this.isRegistering.set(false);
        this.uiService.showToast('Failed to save name', 'error');
      },
    });
  }

  startAddingAddress() {
    this.isAddingNewAddress.set(true);
    this.userForm.patchValue({ address: '' });
  }

  startEditingAddress(event: Event, addr: Address) {
    event.stopPropagation();
    this.editingAddressId.set(addr.id);
    this.isAddingNewAddress.set(true);
    this.userForm.patchValue({ address: addr.address });
  }

  cancelAddingAddress() {
    this.isAddingNewAddress.set(false);
    this.editingAddressId.set(null);
    const addr = this.user()?.addresses.find(
      (a) => a.id === this.selectedAddressId()
    );
    this.userForm.patchValue({ address: addr?.address ?? '' });
  }

  increaseQty(item: CartItem) {
    this.cartService.addToCart(item.menuItem);
  }

  decreaseQty(item: CartItem) {
    this.cartService.removeFromCart(item.menuItem);
  }

  selectAddress(addr: Address) {
    this.selectedAddressId.set(addr.id);
    this.userForm.patchValue({ address: addr.address });
  }

  deleteAddress(event: Event, addrId: number) {
    event.stopPropagation();
    if (this.selectedAddressId() === addrId) {
      this.uiService.showToast('Selected address cannot be deleted', 'error');
      return;
    }

    if (this.user()?.defaultAddressId === addrId) {
      this.uiService.showToast('Default address cannot be deleted', 'error');
      return;
    }

    this.uiService.ask({
      title: 'Delete Address?',
      message: `Are you sure you want to delete this address?`,
      confirmText: 'Yes, Delete',
      action: () => {
        this.userService.deleteAddress(addrId).subscribe({
          next: () => {
            if (this.selectedAddressId() === addrId) {
              this.selectedAddressId.set(null);
              this.userForm.get('address')?.setValue('');
            }
            this.uiService.showToast('Address deleted!');
          },
        });
      },
    });
  }

  saveNewAddress() {
    const addressValue = this.userForm.get('address')?.value;
    if (!addressValue) return;

    this.savingNewAddress.set(true);

    const payload = {
      address: addressValue,
    };

    const isEditing = this.editingAddressId();
    const request$ = isEditing
      ? this.userService.updateAddress(isEditing, payload)
      : this.userService.addAddress(payload);

    request$.subscribe({
      next: (profile) => {
        this.savingNewAddress.set(false);
        this.cancelAddingAddress();
        this.selectAddress(profile);
        this.uiService.showToast(
          isEditing ? 'Address updated!' : 'Address added successfully!'
        );
      },
      error: () => {
        this.savingNewAddress.set(false);
        this.uiService.showToast('Failed to save address', 'error');
      },
    });
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
    if (this.searchTimer) clearTimeout(this.searchTimer);

    if (!query || query.length < 3) {
      this.searchResults.set([]);
      return;
    }

    this.searchTimer = setTimeout(() => {
      this.autocompleteService?.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'in' },
          types: ['address'],
        },
        (predictions: any) => this.searchResults.set(predictions || [])
      );
    }, 300);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.searchResults.set([]);

    if (this.addressSearchInput) {
      this.addressSearchInput.nativeElement.value = '';
      this.addressSearchInput.nativeElement.focus();
    }
  }

  selectSearchResult(result: any) {
    this.userForm.patchValue({ address: result.description });
    this.searchResults.set([]);
    this.clearSearch();
    setTimeout(() => {
      this.addressDetailsArea?.nativeElement.focus();
    }, 100);
  }

  getCurrentLocation() {
    if (!navigator.geolocation) {
      this.uiService.showToast(
        'Geolocation is not supported by your browser',
        'error'
      );
      return;
    }

    this.isLocating.set(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.reverseGeocode(latitude, longitude);
      },
      (error) => {
        this.isLocating.set(false);
        this.handleLocationError(error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  private reverseGeocode(lat: number, lng: number) {
    this.locationService.reverseGeocode(lat, lng).subscribe({
      next: (formattedAddress) => {
        this.userForm.patchValue({ address: formattedAddress });
        this.isLocating.set(false);
        this.uiService.showToast('Location detected!');
      },
      error: (err) => {
        console.error(err);
        this.isLocating.set(false);
        this.uiService.showToast(
          'Could not resolve address. Please type it manually.',
          'error'
        );
      },
    });
  }

  private handleLocationError(error: GeolocationPositionError) {
    let message = 'An unknown error occurred';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'Please allow location access in your browser settings';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Location information is unavailable';
        break;
      case error.TIMEOUT:
        message = 'The request to get user location timed out';
        break;
    }
    this.uiService.showToast(message, 'error');
  }

  placeOrder() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.uiService.showToast('Please confirm your delivery details', 'info');
      return;
    }

    this.isPlacingOrder.set(true);

    const cartItems = this.cartItems();
    const payload = {
      customerDetails: this.userForm.value,
      specialInstructions: this.specialInstructions(),
      orderItems: cartItems.map((item) => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
      })),
    };

    this.orderService.placeOrder(payload).subscribe({
      next: (order) => {
        this.cartService.clearCart();
        this.router.navigate(['/order-success', order.id], {
          state: {
            cartItems: cartItems,
            orderData: order,
          },
          replaceUrl: true,
        });
      },
      error: (err) => {
        console.error('Order failed', err);
        this.isPlacingOrder.set(false);
        this.uiService.showToast(
          'Some error occurred. Please try again.',
          'error'
        );
      },
    });
  }
}
