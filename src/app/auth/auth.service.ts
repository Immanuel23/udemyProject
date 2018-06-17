import { Subject } from 'rxjs/Subject';

import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from "angularfire2/auth";
import { TrainingService } from '../training/training.service';
import { MatSnackBar } from '@angular/material';
import { UIService } from '../shared/ui.service';

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false

    constructor(private router: Router, private auth: AngularFireAuth, private trainingService: TrainingService, private snackBar: MatSnackBar, private uiService: UIService){}

    inithAuthListener() {
        this.auth.authState.subscribe(user => {
            if(user) {
                this.isAuthenticated = true;
                this.authChange.next(true)
                this.router.navigate(['/training'])
            } else {
                this.trainingService.cancelSubscriptions()
                this.authChange.next(false)
                this.router.navigate(['/login'])
                this.isAuthenticated = false
    
            }
        });
    }

    registerUser(authData: AuthData){
        this.uiService.loadingStateChanged.next(true)
        this.auth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
        .then(res=>{
            this.uiService.loadingStateChanged.next(false)
        })
        .catch(err=>{
            this.uiService.loadingStateChanged.next(false)
            this.uiService.showSnackBar(err.message, null, 3000)
        })
    }

    login(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.auth.auth.signInWithEmailAndPassword(authData.email, authData.password) 
         .then((res)=>{
             this.uiService.loadingStateChanged.next(false)
         })
         .catch(err=>{
            this.uiService.loadingStateChanged.next(false)
            this.uiService.showSnackBar(err.message, null, 3000)
    })}

    logout() {
        this.auth.auth.signOut()
    }

    getUser() {
    }

    isAuth() {
        return this.isAuthenticated
    }

}