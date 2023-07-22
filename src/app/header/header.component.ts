import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthonticated: boolean;
  authListnerSub: Subscription;
  constructor(public authService: AuthService){}

  ngOnInit() {
    this.userIsAuthonticated = this.authService.getIsAuth();
    this.authListnerSub = this.authService.getAuthStatusListner().subscribe((isAuthenticate)=>{
      this.userIsAuthonticated = isAuthenticate;
    })
  }

  onLogOut(){
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.authListnerSub.unsubscribe();
  }
}
