// Component to display successful agent responses.
// Shows a positive message when a tool launch was successful.
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-success-response',
  templateUrl: './success-response.component.html',
  styleUrls: ['./success-response.component.css']
})
export class SuccessResponseComponent {
  @Input() message: string | undefined;
}
