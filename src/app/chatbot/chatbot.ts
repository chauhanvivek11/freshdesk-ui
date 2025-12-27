import { Component, ViewChild, ElementRef, inject, ChangeDetectorRef , Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../ticket.service'; // 👈 1. Service Import karo

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class Chatbot {
  
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  private cd = inject(ChangeDetectorRef);
  
// 👇 1. Ye Naya "Mic" hai (Signal bhejne ke liye)
  @Output() ticketCreated = new EventEmitter<void>();

  // 👇 2. Service Inject karo
  private ticketService = inject(TicketService); 

  isOpen = false;
  chatInput: string = '';
  
  messages: any[] = [
    { text: 'Hi! 👋 Main aapki kya madad kar sakta hoon?', sender: 'bot' }
  ];

  // 👇 3. Naya Variable: Kya hum ticket offer kar rahe hain?
  showCreateTicketOption = false;
  lastUserMessage = ''; // User ki problem save karne ke liye

  toggleChat() { this.isOpen = !this.isOpen; }

  sendMessage() {
    if (this.chatInput.trim() === '') return;
    const userText = this.chatInput;
    this.chatInput = '';
    this.onOptionSelect(userText); 
  }

  onOptionSelect(option: string) {
    this.messages.push({ text: option, sender: 'user' });
    this.lastUserMessage = option; // Save kar lo user ne kya bola
    this.cd.detectChanges(); 
    this.scrollToBottom();

    setTimeout(() => {
      this.botReply(option);
    }, 500);
  }

  botReply(userMsg: string) {
    let reply = '';
    const lowerMsg = userMsg.toLowerCase();
    
    // Reset option
    this.showCreateTicketOption = false;

    if (lowerMsg.includes('password') || lowerMsg.includes('wifi')) {
      reply = 'Iska solution FAQ mein hai. Try restarting.';
    } 
    // 👇 Agar baat serious hai (Broken, Fire, Smoke, Hardware)
    else if (lowerMsg.includes('broken') || lowerMsg.includes('toot') || lowerMsg.includes('smoke') || lowerMsg.includes('kharab') || lowerMsg.includes('not working')) {
      reply = 'Oh! Yeh serious lag raha hai. 😟 \nKya main iska Ticket create kar doon?';
      this.showCreateTicketOption = true; // Button dikhao
    }
    else {
      reply = 'Main samjha nahi. Kya main support team ke liye Ticket bana doon?';
      this.showCreateTicketOption = true; // Button dikhao
    }

    this.messages.push({ text: reply, sender: 'bot' });
    this.cd.detectChanges(); 
    this.scrollToBottom();
  }

  // 👇 4. Jadoo: Chat se Ticket banane ka function
  createTicketFromChat() {
    const newTicket = {
      title: 'Chat Request: ' + this.lastUserMessage, // Title mein problem
      description: 'User reported via Chatbot: ' + this.lastUserMessage,
      status: 'Open'
    };

    // Service call
    this.ticketService.createTicket(newTicket).subscribe(() => {
      
      // Success message
      this.messages.push({ text: '✅ Ticket Created! Dashboard check karein.', sender: 'bot' });
      this.showCreateTicketOption = false; // Button hata do
      
      this.cd.detectChanges();
      this.scrollToBottom();
      // 👇 2. YAHAN SIGNAL BHEJO (Jadoo yahan hoga)
      this.ticketCreated.emit();
    });
  }

  scrollToBottom() {
    try { this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight; } catch(err) { }
  }
}