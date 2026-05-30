// Component to display unsupported action responses.
// Used when the user requests an application this agent cannot launch.
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-unsupported-response',
  templateUrl: './unsupported-response.component.html',
  styleUrls: ['./unsupported-response.component.css']
})
export class UnsupportedResponseComponent {
  @Input() message: string | undefined;
}
