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
    chartType: any = 'line';
    chartOptions: any;
    ChartsDataGateway: any;
    basicData: any;
    basicOptions: any;
    SaleSummaryMonthly: any;

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

        var yesterday = new Date(this.today.setDate(new Date().getDate()-1));
        this.dateFilter = moment(yesterday).format('MM/DD/YYYY');

        this._dashboard.SaleSummaryMonthly().subscribe(
            res => {
                this.SaleSummaryMonthly = res;
            }
        );

        this.data = {
            labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            datasets: [{
                type: 'line',
                label: 'Dataset 1',
                borderColor: '#42A5F5',
                borderWidth: 2,
                fill: false,
                data: [
                    50,
                    25,
                    12,
                    48,
                    56,
                    76,
                    42
                ]
            }, {
                type: 'bar',
                label: 'Dataset 2',
                backgroundColor: '#66BB6A',
                data: [
                    21,
                    84,
                    24,
                    75,
                    37,
                    65,
                    34
                ],
                borderColor: 'white',
                borderWidth: 2
            }, {
                type: 'bar',
                label: 'Dataset 3',
                backgroundColor: '#FFA726',
                data: [
                    41,
                    52,
                    24,
                    74,
                    23,
                    21,
                    32
                ]
            }]
        };
    }
  
    ngOnInit(): void {
        if (!this._authService.isLoggedIn)
            window.location.href = '/login';

        this.initChartData("", "");
    }

    OnLoadDataSource(event: any) {
      this.isLoadingResults = true;
      setTimeout(() => {
          this._dashboard.SaleSummaryDailySale(this.date).then(res => {
            this.dashboard = res;
            this.isLoadingResults = false;
          });
      }, 3000);
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
          this.initChartData("", this.tenantId);
        }
    }

    onFilterByDate(event:any) {
        this.dateFilter = moment(event).format('MM/DD/YYYY');
        this.initChartData("", "");
    }

    initChartData(date: any, tenant: any) {
        this.isLoadingResults = true;
        setTimeout(() => {
            this._dashboard.SaleSummaryPerMonth(this.dateFilter, tenant).subscribe(res => {
                this.ChartsDataGateway = res;
                this.isLoadingResults = false;
            });
        }, 3000);
    }
}