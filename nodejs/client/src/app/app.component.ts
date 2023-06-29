import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'jitter-client';
  calculations: any = [];
  readonly apiURL : string = 'http://localhost:3000';
  onSubmit(form: NgForm) {
    const data = { number1: parseFloat(`0${ form.value.number1 }`), number2: parseFloat(`0${ form.value.number2 }`) };
    this.http.post(`${ this.apiURL }/execCalculation`, data).subscribe(result => console.log(result));
    form.reset();
  }
  getSolved() {
    this.http.get(`${ this.apiURL }/getSolved`).subscribe(result => this.calculations = result);
  }
  constructor(private http : HttpClient) {
      interval(5000).subscribe(async () => {
        this.getSolved();        
      })    
  }
}

