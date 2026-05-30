// Angular service that sends user text to the backend agent API.
// It expects a typed AgentResponse from the server.
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AgentResponse } from './models/agent-response.model';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  constructor(private http: HttpClient) {}

  // Post the text payload to the configured backend agent endpoint.
  sendText(text: string): Observable<AgentResponse> {
    return this.http.post<AgentResponse>(environment.apiUrl, { text });
  }
}
