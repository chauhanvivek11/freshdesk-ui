import { Component, inject,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // AsyncPipe zaroori hai
import { TicketService } from '../ticket.service';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { Chatbot } from '../chatbot/chatbot';





@Component({
  selector: 'app-ticket-list',
  standalone:true,
  // 👇 'AsyncPipe' bahut zaroori hai. Ye HTML ko power deta hai 
  // ki wo khud wait kare data aane ka.
  // 👇 2. Yahan 'FormsModule' add karna mat bhoolna
  imports: [CommonModule,FormsModule,Chatbot],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css',
})


export class TicketList implements OnInit {
  


  // LOgout ka code 

   private router=inject(Router); //inject router 
   onLogout(){
    //wapas login pe bhej do 
    this.router.navigateByUrl('');
   }








  // 👇 'inject' naya tareeka hai Service (Waiter) ko bulane ka.
  // Purane Angular mein ye 'constructor' ke andar hota tha.
  
        private ticketService=inject(TicketService);

        // 👇 DHYAN DEIN: Is variable ke aage '$' laga hai.
  // '$' ka matlab hai ye normal variable nahi, ye ek "Observable" (Live Stream) hai.
  // Hum yahan data store nahi kar rahe, hum bas bata rahe hain ki data KAHAN se aayega.
    //   tickets$=this.ticketService.getTickets();  esko hata diya humnei 
       // Ye hamari purani tickets ki list (Observable Stream)
  



       //1.nyi list bnao usmei  data store krvao 
       allTickets:any[]=[];   // Asli Data (Hamesha full rahega)
       filteredTickets:any[]=[];    // Dikhane wala Data (Search ke hisab se badlega)

// 👇 1. Naye Variables (Stats ke liye)
  totalTickets: number = 0;
  openTickets: number = 0;
  closedTickets: number = 0;
newTicketObj = { title: '', description: '', status: 'Open' };


  searchTerm :string=''; // searh box ticket






  // 👇👇 DEKHO YAHAN BANAYA HAI HUMNE 👇👇
  //newTicketObj={
  //  title:'',          // Shuru mein khali hai
  //  description:'',     // Shuru mein khali hai
  //  status:'Open'         // Default status 'Open' rahega

    // 👆👆 YAHI WO OBJECT HAI JISKA AAP PUCH RAHE HO 👆👆

  // Button dabane par hum ISI object ko backend bhejte hain
 // };
        




  //2. Page khulte hi ye chalega (automatic)
  ngOnInit() {
      this.loadTickets();
  }




  //3.Data lane k liye nya function 
  loadTickets(){
    this.ticketService.getTickets().subscribe((data:any) => {
      this.allTickets=data; //data save krdo 
      this.filteredTickets=data; //shuru mein sab dikhao 

      // 👇 2. Yahan Ginti (Math) ho rahi hai
      this.totalTickets = this.allTickets.length;
      this.openTickets = this.allTickets.filter(t => t.status === 'Open').length;
      this.closedTickets = this.allTickets.filter(t => t.status === 'Closed').length;
    });
  }




//4. search ka logic (filter )
  onSearch(){
    const text=this.searchTerm.toLowerCase();

    //asli list (alltickets ) mei se dhundo jo match krta ho
    this.filteredTickets = this.allTickets.filter(ticket=> 
      ticket.title.toLowerCase().includes(text) || ticket.description.toLowerCase().includes(text)
    );
  }


       // 👇 4. Button dabane par ye function chalega
        onAddTicket(){
          // Agar title khali hai, toh yahin ruk jao (Chupchap).
    // Isse Ghost Ticket banna band ho jayega.
    if (this.newTicketObj.title.trim() === '') {
      return; 
    }
          // Waiter ko bolo: "Ye naya ticket le jao"
          this.ticketService.createTicket(this.newTicketObj).subscribe((response)=>{
            // Jab ticket create ho jaye (Success):
            // A. Form khali kar do taaki agla ticket likh sakein
            this.newTicketObj={title:'',description:'',status:'Open'};
            // B. List ko Refresh karo (Stream ko dobara load karo)
            this.loadTickets();  // Refresh karega toh ginti badh jayegi
          });
        }




        // 👇 5. Delete button ke liye function
        onDeleteTicket(id: number){
          //Waiter ko bolo: "Is ID wala ticket hata do"
          this.ticketService.deleteTicket(id).subscribe(()=>{
            //jab delete ho jaye refresh karo list ko
            this.loadTickets(); // Refresh karega toh ginti kam ho jayegi
          })
        }




        //close button  ka logic bna rhe  hai 
        onCloseTicket(ticket: any) {
    // 1. Safety Check: Agar pehle se Closed hai, toh kuch mat karo
    if (ticket.status === 'Closed') {
      return; 
    }

    // 👇 2. TURANT MATH LAGAO (Instant Update)
    // Pending ko 1 kam karo
    this.openTickets--; 
    
    // Solved ko 1 badhao
    this.closedTickets++;

    // Ticket ka status bhi turant badal do taaki badge Green ho jaye
    ticket.status = 'Closed';

    // 👇 3. Ab Server ko batao (Background mein chalega)
    this.ticketService.updateTicket(ticket).subscribe(() => {
      // Server confirm kar de toh ek baar pakka karne ke liye refresh kar lo
      this.loadTickets(); 
    });
  }

     }
        
