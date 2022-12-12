import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/services/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit {
    @Input() username: string = '';
    @Input() password: string = '';
    loginForm: any = FormGroup;
    isLoadingResults: boolean = false;
    constructor(
        public layoutService: LayoutService,
        public formBuilder: FormBuilder,
        public router: Router,
        public authService: AuthService,
    ) {
        this.loginForm = new FormGroup({
            username: new FormControl('', Validators.compose([Validators.required])),
            password: new FormControl('', Validators.compose([Validators.required])),
        })
    }

    ngOnInit(): void {
        
    }

    submitted = false;
    isIncorrectUsernamePassword = false;
    get f() { return this.loginForm.controls; }
    onFormSubmit() : void {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        
        if(this.submitted) {
            this.isLoadingResults = true;
            setTimeout(() => {
                this.authService.login(this.loginForm.value)
                .subscribe(() => {
                    this.router.navigate(['/']);
                }, (err: any) => {
                    if (err)
                        this.isIncorrectUsernamePassword = true;
                    this.isLoadingResults = false;
                });
            }, 100);
        }
    }
}
