import { Component, OnInit, inject } from '@angular/core';
import { User, UserCreateDto, UserResponse, UserService } from '../../services/user.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { passwordValidator } from './password-validator';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    TableModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,CommonModule,

  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  isEdit: boolean = false;
  currentUserId: string = '';

  // Role options for dropdown
  roleOptions = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Customer', value: 'Customer' },
  ];

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      Username: ['', [Validators.required, Validators.maxLength(50)]],
      Email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      Password: ['', [Validators.required, Validators.minLength(3), passwordValidator()]],
      Role: [null, Validators.required], // Dropdown value
    });
  }

  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.map(user => ({
          ...user,
        }));
        this.messageService.add({
          severity: 'info',
          summary: 'Success',
          detail: 'Users loaded successfully.',
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load users.',
        });
      },
    });
  }
  
  

  submitForm(): void {
    if (this.userForm.valid) {
      const selectedRole = this.userForm.value.Role?.value; // Extract the `value` property
  
      if (!selectedRole) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select a valid role.',
        });
        return;
      }
  
      if (this.isEdit && this.currentUserId !== '') {
        const user: User = {
          id: this.currentUserId,
          Username: this.userForm.value.Username,
          Email: this.userForm.value.Email,
          Password: this.userForm.value.Password,
          Role: selectedRole,
          createdOn: new Date(),
        };
  
        this.userService.updateUser(this.currentUserId, user).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Success',
              detail: 'User updated successfully.',
            });
            this.loadUsers();
            this.resetForm();
          },
          error: (error) => {
            this.handleError(error, 'Failed to update user');
          },
        });
      } else {
        const userCreateDto: UserCreateDto = {
          Username: this.userForm.value.Username,
          Email: this.userForm.value.Email,
          Password: this.userForm.value.Password,
          Role: selectedRole,
        };
  
        this.userService.createUser(userCreateDto).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Success',
              detail: 'User created successfully.',
            });
            this.loadUsers();
            this.resetForm();
          },
          error: (error) => {
            this.handleError(error, 'Failed to create user');
          },
        });
      }
    }
  }
  
  private handleError(error: any, defaultMessage: string): void {
    if (error.status === 409 && error.error?.detail) {
      // Specific error for duplicate email
      this.messageService.add({
        severity: 'error',
        summary: 'Duplicate Email',
        detail: error.error.detail,
      });
    } else {
      // General error handling
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.error?.detail || defaultMessage,
      });
    }
  }
  
  editUser(user: User): void {
    this.isEdit = true;
    this.currentUserId = user.id;
  
    this.userService.getUserById(user.id).subscribe({
      next: (response: UserResponse) => {
        this.userForm.patchValue({
          Username: response.username, // Map directly from UserResponse
          Email: response.email,       // Map directly from UserResponse
          Role: this.roleOptions.find((role) => role.value === response.role) || null, // Match role
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch user details.',
        });
      },
    });
  }
  

  confirmDeleteUser(event: Event, id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this user?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteUser(id);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
        this.confirmationService.close();
      },
    });
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Success',
          detail: 'User deleted successfully.',
        });
        this.loadUsers(); // Refresh the list
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete user. Please try again.',
        });
      },
    });
  }
  

  resetForm(): void {
    this.isEdit = false;
    this.currentUserId = '';
    this.userForm.reset();
  }
}
