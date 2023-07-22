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

    autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListner.next(true);
        }
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
                    this.setAuthTimer(expiresIn);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresIn * 1000);
                    this.saveAuthData(token, expirationDate);
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
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number){
        this.tokenTimer = setTimeout(()=>{
            this.logOut();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expiration: Date){
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expiration.toISOString());
    }

    private clearAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private getAuthData(){
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if(!token || !expirationDate){
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }

}