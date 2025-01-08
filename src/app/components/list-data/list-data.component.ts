import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { User } from '../../models/user';
import { ModeEnum } from '../../models/mode.enum';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-list-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-data.component.html',
  styleUrl: './list-data.component.css'
})
export class ListDataComponent {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  form = this.fb.group({
    id: [0],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  });
  ModeEnum = ModeEnum;
  users!: User[];
  mode = ModeEnum.NON;

  ngOnInit(): void {
    this.setUsers();
  }

  private setUsers() {
    this.users = this.userService.getAllUsers();
  }

  editUser(user: User) {
    this.mode = ModeEnum.EDIT;
    this.form.setValue(user);
  }

  removeUser(user: User) {
    this.userService.deleteUser(user);
    this.setUsers();
  }

  addNewUser() {
    this.mode = ModeEnum.ADD;
  }

  saveUser() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const user = this.form.value as User;

    if (this.mode === ModeEnum.ADD) {
      this.userService.addUser(user);
    } else {
      this.userService.updateUser(user);
    }
    this.setUsers();
    this.cancel();
  }

  cancel() {
    this.form.reset();
    this.mode = ModeEnum.NON;
  }

}
