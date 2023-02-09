import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/services/app.layout.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import * as moment from 'moment';
import { Calendar } from 'primeng/calendar';
import { Table } from 'exceljs';

class ImageSnippet {
    constructor(public src: string, public file: File) {}
}

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
    rangeDates!: Date[];
    @ViewChild("calendar") private calendar: any;
    @ViewChild('dt', { static: true }) dt!: any;

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
        public _dashboard: DashboardService
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
        });
        this.isLoadingResults = false;
        this._dashboard.saleSummary().then(res => {
            this.ChartsDataGateway = res;
        });
       
    }
  
    ngOnInit(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        this.initChart();
        if (!this._authService.isLoggedIn)
            window.location.href = '/login';

        // test chart
        this.data = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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

        //charts option
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        this.basicData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: '#42A5F5',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: '#FFA726',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };
        
        
    }

    OnLoadDataSource(event: any) {
      this.isLoadingResults = true;
      var day = moment(this.date).format('YYYY-MM-DD');
      setTimeout(() => {
          this._dashboard.dashboard(this.date).then(res => {
            this.dashboard = res;
            this.isLoadingResults = false;
          });
      }, 1000);
    }

    initChart() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
      };

    //   this.chartOptions = {
    //       plugins: {
    //           legend: {
    //               labels: {
    //                   color: textColor
    //               }
    //           }
    //       },
    //       scales: {
    //           x: {
    //               ticks: {
    //                   color: textColorSecondary
    //               },
    //               grid: {
    //                   color: surfaceBorder,
    //                   drawBorder: false
    //               }
    //           },
    //           y: {
    //               ticks: {
    //                   color: textColorSecondary
    //               },
    //               grid: {
    //                   color: surfaceBorder,
    //                   drawBorder: false
    //               }
    //           }
    //       }
    //   };
    }

    openCalendar() {
        this.calendar.showOverlay();
        this.calendar.inputfieldViewChild.nativeElement.dispatchEvent(new Event('click'));
    }

    onDateChange(event:any) {
        this.date = moment(event).format('YYYY-MM-DD');
        this.dt.filterGlobal(event, 'contains');
    }
}