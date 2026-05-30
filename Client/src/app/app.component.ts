import { Component } from '@angular/core';
import { AgentResponse } from './models/agent-response.model';
import { AgentService } from './agent.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tools: { id: string; name: string }[] = [];
  userText = '';
  response: AgentResponse | null = null;
  error = '';
  loading = false;
  toolName = 'ToolBot';

  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    // קבל את רשימת הכלים מהשרת כדי להציג כפתורים בתחתית התיבה
    this.agentService.getTools().subscribe({
      next: (res) => {
        this.tools = res.tools || [];
      },
      error: () => {
        // בשגיאה — נשאר ללא כפתורים (אפשר להוסיף ברירת מחדל)
        this.tools = [];
      }
    });
  }

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
