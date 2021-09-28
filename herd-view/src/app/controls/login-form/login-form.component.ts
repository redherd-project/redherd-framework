import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../bin/auth/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  private formSubmitAttempt: boolean;
  form: FormGroup;
  hide: boolean;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.hide = true;
  }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.authService.isLoggedIn.subscribe();
  }

  public isFieldInvalid(field: string): boolean {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  public onKeyDown(event): void {
    if (event.keyCode === 13) {
      this.onSubmit();
    }
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.authService.login(this.form.value);
    }
    this.formSubmitAttempt = true;
  }
}
