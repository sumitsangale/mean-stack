import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { AuthData } from "./auth-data.model";

@Injectable({providedIn: 'root'})

export class AuthService{
    private token: string;
    private authStatusListner = new Subject<boolean>();
    private isAuthenticated = false;
    private tokenTimer: any;

    constructor(private http: HttpClient, public router: Router){}

    getToken(){
        return this.token;
    }

    getAuthStatusListner(){
        return this.authStatusListner.asObservable();
    }

    getIsAuth(){
        return this.isAuthenticated;
    }

    creatuser(email: string, password: string){
        const authData: AuthData = {
            email: email,
            password: password
        }
        this.http.post("http://localhost:3000/api/users/signup", authData)
            .subscribe((response)=>{
                console.log(response)
            })
    }

    login(email: string, password: string){
        const authData: AuthData = {
            email: email,
            password: password
        }
        this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/users/login", authData)
            .subscribe((response)=>{
                console.log(response)
                const token = response.token;
                this.token = token;
                if(token){
                    const expiresIn = response.expiresIn;
                    this.tokenTimer = setTimeout(()=>{
                        this.logOut();
                    }, expiresIn * 1000);
                    this.isAuthenticated = true;
                    this.authStatusListner.next(true);
                    this.router.navigate(['/']);
                }
            })
    }

    logOut(){
        this.isAuthenticated = false;
        this.token = null;
        this.authStatusListner.next(false);
        this.router.navigate(['/']);
        clearTimeout(this.tokenTimer);
    }

}