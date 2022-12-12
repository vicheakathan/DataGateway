import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from 'src/app/services/app.layout.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    isLoadingResults: boolean = false;

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService,public _authService: AuthService) { }

    logout(): void {
        this.isLoadingResults = true;
        setTimeout(() => {
            this._authService.logout();
            window.location.href = "login";
            // this._router.navigate(['/login']);
        }, 1000);
        
    }
}
