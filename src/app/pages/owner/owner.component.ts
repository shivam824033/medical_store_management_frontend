import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecretKeyResponse } from 'src/app/models/login';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {

  secretKeyRes = new SecretKeyResponse();
  constructor(private signUpService: GlobalService, private route: Router) { }

  ngOnInit(): void {
  }

  generateKey(){

    this.signUpService.generateKey().subscribe(data =>{

      Object.assign(this.secretKeyRes, data);


    })


  }

}
