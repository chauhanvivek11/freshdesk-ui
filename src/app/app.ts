import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TicketList } from './ticket-list/ticket-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,TicketList],
  standalone:true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FreshDeskApp');
}
