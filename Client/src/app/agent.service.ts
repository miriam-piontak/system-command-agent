// Angular service that sends user text to the backend agent API.
// It expects a typed AgentResponse from the server.
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AgentResponse } from './models/agent-response.model';

export interface ToolInfo { id: string; name: string; }

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  constructor(private http: HttpClient) {}

  // Post the text payload to the configured backend API endpoint.
  sendText(text: string): Observable<AgentResponse> {
    return this.http.post<AgentResponse>(environment.apiUrl, { text });
  }

  // Fetch available tools from the backend for the UI.
  getTools(): Observable<{ tools: ToolInfo[] }> {
    return this.http.get<{ tools: ToolInfo[] }>(environment.toolsUrl);
  }
}
