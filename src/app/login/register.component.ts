import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor() { }

  ngOnInit() {
    init_plugins();

    this.forma = new FormGroup({
      
    });
  }

}
