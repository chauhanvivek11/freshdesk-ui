import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
    private http=inject(HttpClient);
    private apiUrl='https://freshdesk-vivek-2025-gyc4htfhaua2agcf.southeastasia-01.azurewebsites.net/tickets';
    constructor(){}


  // 1. GET: Data lana (Ye pehle se tha)
    getTickets(){
      return this.http.get<any[]>(this.apiUrl);
    }

    // 👇 2. POST: Naya Data bhejna (Ye naya hai)
    createTicket(ticketData:any){
      // .post(kahan bhejna hai, kya bhejna hai)
      return this.http.post(this.apiUrl,ticketData);
    }


    //3.Delete ID lekar jao or dlete kardo
    deleteTicket(id : number){
      //Url bn jayega  ye delete id ko leke jayega or url bnega http://localhost:5192/tickets/1 
      return this.http.delete(`${this.apiUrl}/${id}`);
    }



    //4.UPDATE : STAUTS CHNGE KRNE K LIYE CODE 
    updateTicket(ticket:any){
      //hum pura ticket wapas bhej rhe hai taaki server use update kar ske 
      return this.http.put(`${this.apiUrl}/${ticket.id}`,ticket);
    }
}
