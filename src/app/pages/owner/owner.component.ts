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
  users: any[] = [];
  selectedRole: string = '';
  selectedUser: any = null;
  constructor(private globalService: GlobalService, private route: Router) { }

  ngOnInit(): void {
        this.fetchUsers();

  }

  generateKey(){

    this.globalService.generateKey().subscribe(data =>{

      Object.assign(this.secretKeyRes, data);


    })


  }

   fetchUsers() {
    this.globalService.getAllUsers(this.selectedRole).subscribe((data: any) => {
      this.users = data.response || [];
    });
  }

  viewUser(user: any) {
    this.selectedUser = user;
    // Show Bootstrap modal
    const modal = new (window as any).bootstrap.Modal(document.getElementById('userDetailModal'));
    modal.show();
  }

  deactivateUser(user: any) {
    if (confirm(`Are you sure you want to deactivate ${user.fullName}'s account?`)) {
      this.globalService.accountAction(user.userId, "deactivate").subscribe(() => {
        user.accountStatus = 'BLOCKED';
      });
    }
  }

    activateUser(user: any) {
    if (confirm(`Are you sure you want to activate ${user.fullName}'s account?`)) {
      this.globalService.accountAction(user.userId, "activate").subscribe(() => {
        user.accountStatus = 'ACTIVE';
      });
    }
  }

}
