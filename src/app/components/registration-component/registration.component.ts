import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return!!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, RouterLink, RouterLinkActive]
})
export class RegistrationComponent implements OnInit {
  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ ]*$')]), // Magyar ékezetek engedélyezése
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9]+$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9]+$')]),
  });

  submitted = false;
  submitError = '';
  matcher = new MyErrorStateMatcher();
  constructor(private router: Router, private ngZone: NgZone, private userService: UserService) { }

  ngOnInit(): void { }

  onSubmit() {
    this.submitted = true;
    this.submitError = '';

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.userService.createUser(this.registrationForm.getRawValue()).subscribe({
      next: () => {
        console.log('User successfully created!');
        this.registrationForm.reset();
        this.ngZone.run(() => this.router.navigateByUrl('/login'));
      },
      error: (err) => {
        console.log(err);
        // A backend által visszadobott hibaüzenet megjelenítése (pl. "Ez a felhasználónév már foglalt!")
        this.submitError = err.message ||
          'Sikertelen regisztráció. Kérjük, próbáld újra!';
          
      }
    });
  }
}