import { Component } from '@angular/core';
import { EmailComposer } from 'capacitor-email-composer';
import { Browser } from '@capacitor/browser';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  emails: string[] = [];

  constructor(private http: HttpClient) {
    this.loadEmails();
  }

  loadEmails() {
    this.http.get<{ emails: string[] }>('assets/emails.json').subscribe(
      data => {
        this.emails = data.emails;
      },
      error => {
        console.error('Error loading emails:', error);
      }
    );
  }

  async sendRandomEmails() {
    try {
      const available = await EmailComposer.hasAccount();
      if (available) {
        await EmailComposer.open({
          to: this.emails,
          subject: 'Cordova Icons',
          body: 'How are you? Nice greetings from Leipzig',
          isHtml: true
        });
      } else {
        console.log('Email composer is not available');
      }
    } catch (error) {
      console.error('Error with email composer:', error);
    }
  }

  async sendEmail() {
    const to = this.emails.join(',');
    const subject = 'Default Subject';
    const body = 'Default Body';
    const url = this.composeEmailUrl(to, subject, body);
    await Browser.open({ url });
  }

  private composeEmailUrl(to: string, subject: string, body: string): string {
    const params = new URLSearchParams({
      to,
      subject,
      body
    });
    return `mailto:${to}?${params.toString()}`;
  }
}