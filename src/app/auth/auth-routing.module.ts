import { NgModule } from "@angular/core";
import { RouterModule, Routes, provideRoutes } from "@angular/router";

import { loginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [
    { path: 'login', component: loginComponent },
    { path: 'signup', component: SignupComponent },
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AuthRoutingModule {}