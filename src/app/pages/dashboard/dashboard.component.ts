import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/services/app.layout.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import * as moment from 'moment';
import { TenantService } from 'src/app/services/tenant.service';


@Component({
  templateUrl: './dashboard.component.html',
  providers: [MessageService]
})

export class DashboardComponent implements OnInit {
    subscription!: Subscription;
    submitted: boolean = false;
    isLoadingResults: any = true;
    date: any ;
    dashboard: any;
    chartData: any;
    // chartOptions: any;
    data: any;
    today = new Date();
    rangeDates!: Date[];
    dateFilter!: any;
    @ViewChild("calendar") private calendar: any;
    @ViewChild('dt', { static: true }) dt!: any;
    @ViewChild('calendar') private daterang: any;
    tenantId: any;
    itemTenant: any = [];
    chartLegend: boolean = true;  
    chartType: any = 'bar';
    chartOptions: any;
    ChartsDataGateway: any;
    Test: any;
    basicOptions: any;
    basicData: any;
    constructor(
        public layoutService: LayoutService,
        private _messageService: MessageService,
        public _authService: AuthService,
        public _router: Router,
        public _dashboard: DashboardService,
        public _tenantService: TenantService,
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
        });

        this._tenantService.getTenant(100,0,"","","","").subscribe(
            res => {
                this.itemTenant = res.data;
            }
        );
        this.dateFilter = moment(this.today).format('MM/DD/YYYY');
    }
  
    ngOnInit(): void {
        if (!this._authService.isLoggedIn)
            window.location.href = '/login';

        this.initChart();
    }

    OnLoadDataSource(event: any) {
      this.isLoadingResults = true;
      setTimeout(() => {
          this._dashboard.dashboard(this.date).then(res => {
            this.dashboard = res;
            this.isLoadingResults = false;
          });
      }, 1000);
    }

    openCalendar() {
        this.calendar.showOverlay();
        this.calendar.inputfieldViewChild.nativeElement.dispatchEvent(new Event('click'));
    }

    onDateChange(event:any) {
        this.date = moment(event).format('YYYY-MM-DD');
        this.dt.filterGlobal(event, 'contains');
    }

    onFilterByTenant(event: any) {
        if (event.value != null || event.value !== undefined) {
          this.tenantId = event.value;
          this.dt.filterGlobal(event, 'contains');
        }
    }

    onFilterByDate(event:any) {
        this.dateFilter = moment(event).format('MM/DD/YYYY');
        this.initChart();
    }

    initChart() {
        this.isLoadingResults = true;
        setTimeout(() => {
            this._dashboard.saleSummary(this.dateFilter).then(res => {
                this.ChartsDataGateway = res;
                this.isLoadingResults = false;
            });
        }, 1000);
    }
}