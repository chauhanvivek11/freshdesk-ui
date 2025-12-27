import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],  //forms module mat bhulna 
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
      loginObj:any={
        username:'',
        password:''
      };

      //// 👇 Router ko inject karo (Ye page change karega)
      router=inject(Router);

      onLogin(){
        //Hardcoded check 
        if(this.loginObj.username === 'admin' && this.loginObj.password ==='1234'){
          alert("Login Successfull! 🔓");

          //Dashboard par bhej do 
          this.router.navigateByUrl('/dashboard');
        }
        else{
          alert("Galat Password! ❌ (Try: admin / 1234)")
        }
      }
}
