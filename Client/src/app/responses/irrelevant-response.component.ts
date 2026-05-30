// Component to display irrelevant request responses.
// Used when the user request is not related to launching desktop tools.
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-irrelevant-response',
  templateUrl: './irrelevant-response.component.html',
  styleUrls: ['./irrelevant-response.component.css']
})
export class IrrelevantResponseComponent {
  @Input() message: string | undefined;
}
