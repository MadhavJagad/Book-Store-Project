import { ContactUsComponent } from './Pages/contact-us/contact-us.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { RegisterComponent } from './Pages/Auth/register/register.component';
import { LoginComponent } from './Pages/Auth/login/login.component';
import { PageNotFoundComponent } from './Pages/page-not-found/page-not-found.component';
import { AboutUsComponent } from './Pages/about-us/about-us.component';
import { BooksComponent } from './Pages/Products/books/books.component';
import { PasswordPageComponent } from './Pages/Auth/Forget-Password-page/password-page/password-page.component';
import { EmailPageComponent } from './Pages/Auth/Forget-Password-page/email-page/email-page.component';
import { SellProductComponent } from './Pages/Seller/sell-product/sell-product.component';
import { SellerProfileComponent } from './Pages/Seller/seller-profile/seller-profile.component';
import { CartComponent } from './Pages/Buyer/cart/cart.component';
import { BuyerProfileComponent } from './Pages/Buyer/buyer-profile/buyer-profile.component';
import { ChangePasswordComponent } from './Pages/change-password/change-password.component';
import { ProductDetailComponent } from './Pages/product-detail/product-detail.component';
import { CheckoutComponent } from './Pages/checkout/checkout.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'books', component: BooksComponent },
  { path: 'forget-password/email', component: EmailPageComponent },
  { path: 'forget-password/password', component: PasswordPageComponent },
  { path: 'sell-product', component: SellProductComponent },
  { path: 'seller-profile', component: SellerProfileComponent },
  { path: 'buyer-profile', component: BuyerProfileComponent },
  { path: 'cart', component: CartComponent },
  { path: 'update-password', component: ChangePasswordComponent },
  { path: 'product-details/:id', component: ProductDetailComponent },
  { path: 'checkout', component: CheckoutComponent },

  { path: '**', component: PageNotFoundComponent },
];
    ``