import { Routes } from '@angular/router';
import { TicketList } from './ticket-list/ticket-list';
import { Login } from './login/login';

export const routes: Routes = [
  //1.Agar path khali hai (' ')toh login dikhao 
  {path:'' , component: Login},

  //2.Agar path dashboard hai toh TicketList dikhao 
  {path:'dashboard',component:TicketList}
];
