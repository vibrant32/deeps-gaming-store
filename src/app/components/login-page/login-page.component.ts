import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from './User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  public newUser: boolean = false;
  public loading: boolean = false;
  public isSuccess!: boolean;
  public submitted: boolean = false;
  constructor(
    public authService: AuthenticationService,
    public router: Router
  ) { }

  ngOnInit(): void {

  }

  triggerSignup() {
    this.newUser = true;
  }

  model = new User("", "");

  // for new user
  signUp() {
    this.submitted = true;
    // console.log(this.model);
    this.authService.registerUser(this.model).subscribe((response: object) => {
      const status = response["status" as keyof object];
      if (status === "Success") {
        this.isSuccess = true;
        const id = response["userId" as keyof object];
        this.loadAndNavigateToDashboard(id);
      }
      else {
        const message = response["message" as keyof object];
      }
    })
  }

  // for existing user
  signIn() {
    this.submitted = true;
    this.authService.loginUser(this.model).subscribe((response: object) => {
      const status = response["status" as keyof object];
      if (status === "Success") {
        const id = response["userId" as keyof object];
        this.loadAndNavigateToDashboard(id);
      }
    })
  }

  loadAndNavigateToDashboard(userId: number) {
    this.loading = true;
    setTimeout(() => {
      this.loading = false
      this.router.navigate(['/dashboard']);
    }, 3000);
  }

}
