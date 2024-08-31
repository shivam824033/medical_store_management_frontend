import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { OwnerComponent } from './pages/owner/owner.component';
import { SellerComponent } from './pages/seller/seller.component';
import { PublicComponent } from './pages/public/public.component';

const routes: Routes = [
  {path : "", component: HomeComponent},
  {path : "signup", component: SignupComponent},
  {path : "login", component: LoginComponent},
  {path : "owner", component: OwnerComponent},
  {path : "seller", component: SellerComponent},
  {path : "public", component: PublicComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
