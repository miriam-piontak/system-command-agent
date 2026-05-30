import { Component } from '@angular/core';
import { AgentResponse } from './models/agent-response.model';
import { AgentService } from './agent.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tools = [
    { id: 'calculator', name: 'מחשבון' },
    { id: 'browser', name: 'דפדפן' },
    { id: 'clock', name: 'שעון' },
    { id: 'calendar', name: 'לוח שנה' },
    { id: 'downloads', name: 'הורדות' },
    { id: 'screenshot', name: 'צילום מסך' },
    { id: 'recycle', name: 'סל מיחזור' },
    { id: 'terminal', name: 'טרמינל' },
    { id: 'settings', name: 'הגדרות' },
    { id: 'fileExplorer', name: 'סייר קבצים' },
    { id: 'notes', name: 'פתקים' }
  ];
  userText = '';
  response: AgentResponse | null = null;
  error = '';
  loading = false;
  toolName = 'ToolBot';

  constructor(private agentService: AgentService) {}

  // שלח בקשה שמיועדת לפתיחת כלי ספציפי
  sendTool(toolId: string): void {
    const map: any = {
      calculator: 'פתח מחשבון',
      browser: 'פתח דפדפן',
      clock: 'פתח שעון',
      calendar: 'פתח לוח שנה',
      downloads: 'פתח תיקיית הורדות',
      screenshot: 'צלם מסך',
      terminal: 'פתח טרמינל',
      settings: 'פתח הגדרות',
      recycle: 'פתח סל מיחזור',
      fileExplorer: 'פתח סייר הקבצים',
      notes: 'פתח פנקס רשימות'
    };

    const text = map[toolId] || `פתח ${toolId}`;
    this.userText = text;
    this.sendRequest();
  }

  sendRequest(): void {
    this.error = '';
    this.response = null;

    const trimmed = this.userText.trim();
    if (!trimmed) {
      this.error = 'הכנס בקשה בקשה כדי שאוכל לפעול.';
      return;
    }

    this.loading = true;
    this.agentService.sendText(trimmed).subscribe({
      next: (result) => {
        this.response = result;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'שגיאה בשרת, תבדוק את ה־API.';
        this.loading = false;
      }
    });
  }

  get statusClass(): string {
    if (!this.response) {
      return '';
    }

    switch (this.response.type) {
      case 'supported':
        return 'status-success';
      case 'unsupported':
        return 'status-unsupported';
      case 'irrelevant':
        return 'status-irrelevant';
      default:
        return '';
    }
  }

  getTypeLabel(): string {
    if (!this.response) {
      return '';
    }

    switch (this.response.type) {
      case 'supported':
        return 'פעולה נתמכת';
      case 'unsupported':
        return 'פעולה לא נתמכת';
      case 'irrelevant':
        return 'בקשה לא רלוונטית';
      default:
        return this.response.type;
    }
  }
}
