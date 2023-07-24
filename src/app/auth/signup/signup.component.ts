import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { AuthService } from "../auth.service";

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
    private authStatusSub: Subscription;
    constructor(public authService: AuthService){}

    isLoading = false;

    ngOnInit(){
        this.authStatusSub = this.authService.getAuthStatusListner().subscribe((isAuthenticated)=>{
            this.isLoading = false;
        })
    }

    onSignup(form: NgForm){
        if(form.invalid){
            return
        }
        this.isLoading = true;
        this.authService.creatuser(form.value.email, form.value.password);
    }

    ngOnDestroy(){
        this.authStatusSub.unsubscribe();
    }
}