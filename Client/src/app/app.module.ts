// Main Angular module for the client application.
// Declares the app component and response view components, and imports browser/http/forms support.
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SuccessResponseComponent } from './responses/success-response.component';
import { UnsupportedResponseComponent } from './responses/unsupported-response.component';
import { IrrelevantResponseComponent } from './responses/irrelevant-response.component';

@NgModule({
  declarations: [AppComponent, SuccessResponseComponent, UnsupportedResponseComponent, IrrelevantResponseComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
