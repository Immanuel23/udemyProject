import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from '../../shared/ui.service';

import { Subscription } from "rxjs";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  loadingSubs: Subscription;

  constructor(private authService: AuthService, private uiservice: UIService) { }

  ngOnInit() {
    this.loadingSubs = this.uiservice.loadingStateChanged.subscribe(isLoading =>{
      this.isLoading = isLoading
    })
    this.loginForm = new FormGroup({
      email: new FormControl('',{validators: [Validators.required, Validators.email]}),
      password: new FormControl('', {validators: [Validators.required]})
    })
  }

  ngOnDestroy() {
    this.loadingSubs.unsubscribe()
  }
  
  onSubmit(){
   this.authService.login({
     email: this.loginForm.value.email,
     password: this.loginForm.value.password
   })
  }
}
