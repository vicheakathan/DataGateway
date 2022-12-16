import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/services/app.layout.service';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TransactionModel } from 'src/app/models/transaction';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { Workbook } from 'exceljs';
import { Paginator } from 'primeng/paginator';
import { ErrorLogModel } from 'src/app/models/errorlog';

@Component({
  templateUrl: './transaction.component.html',
  providers: [MessageService]
})

export class TransactionComponent implements OnInit {
  title = "Company";
    subscription!: Subscription;
    submitted: boolean = false;
    isLoadingResults = true;
    no_record_found = true;
    itemsPerPage = 25;
    totalRecords = 0;
    pageLinks = 0;
    orderByDate = "desc";
    searchFilter: string = "";
    startDate: string = "";
    date: string = "";
    dailogTitleHeader = "";
    firstRow: any = 0;
    endDate: string = "";
    status = "asc";
    transactionModel: TransactionModel[] = [];
    pageSizeOptions: number[] = [this.itemsPerPage, 50, 100, 200];
    @ViewChild('dt', { static: true }) dt!: Table;
    @ViewChild('searchValue') searchValue!: ElementRef;
    @ViewChild('calendar') private calendar: any;
    checkbox: boolean = false;
    selectAll: boolean = false;
    companyDailog: boolean = false;
    isSelectedTransaction: TransactionModel[] = [];
    rangeDates!: Date[];
    @ViewChild('paginator', { static: true }) paginator!: Paginator;
    ErrorLogModel: ErrorLogModel[] = [];
    ErrorLog: any = [];


    constructor(
        public layoutService: LayoutService,
        private _messageService: MessageService,
        public _transactionService: TransactionService,
        public _authService: AuthService,
        public _router: Router
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
        });
    }

  ngOnInit() {
    if (!this._authService.isLoggedIn)
      this._router.navigate(['/login']);

      this._transactionService.getErrorLog().subscribe(
        response => {
          for(var i = 0; i < response.length; i++){ 
            this.ErrorLog.push(response[i]);
          }
        }
      );
  }

  paginate(event: any): any {
      var temp = JSON.parse(JSON.stringify(event));
      this.pageLinks = temp.page;
      this.itemsPerPage = temp.rows;
      this.OnLoadDataSource(Event);
  }

  OnLoadDataSource(event: any) {
    this.isLoadingResults = true;
    console.log(event);
    setTimeout(() => {
        if (event.sortOrder == 1 && event.sortField !== undefined && event.sortField !== null)
            this.orderByDate = "asc";
        if (event.sortOrder == -1)
            this.orderByDate = "desc";

        if (event.sortOrder == 1 && event.sortField !== undefined && event.sortField !== null && event.sortField == "status")
            this.status = "desc";
        if (event.sortOrder == -1)
            this.status = "asc";

        this._transactionService.getTaskSaleTransaction(
            this.itemsPerPage,
            this.pageLinks,
            this.orderByDate,
            this.startDate,
            this.endDate,
            this.status
        ).then(res => {
            this.totalRecords = res.total;
            this.transactionModel = res.data;
            this.isLoadingResults = false;
        });
    }, 1000);
  }

  onChangeDate(){
    if (this.rangeDates[1]) {
      this.startDate = moment(this.rangeDates[0]).format('YYYY-MM-DD');
      this.endDate = moment(this.rangeDates[1]).format('YYYY-MM-DD');
      this.calendar.overlayVisible = false;
    }
  }

  onGlobalFilter(event: any) {
    if (this.startDate != "" && this.endDate != "")
      this.dt.filterGlobal(event, 'contains');
    else
      this._messageService.add({ severity: 'error', summary: 'Error', detail: "Please enter a date range", life: 2000 });

    this.paginator.changePageToFirst(event);
  }

  clear() {
    this.dt.selectionKeys = [];
    this.dt._selection = [];
    this.startDate = "";
    this.endDate = "";
    this.rangeDates = [];
    this.isSelectedTransaction = [];
    this.paginator.changePageToFirst(event);
    this.dt.clear();
  }

  onSelectionChange(value = []) {
    this.isSelectedTransaction = value;
  }

  exportExcel(table: Table): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("List Transaction");
    var rowHeight = 30;
    // header-----------------
      let header = ["Date","Tenant", "Status","Error Log"];
      let headerRow = worksheet.addRow(header);
      headerRow.eachCell(cell => {
        cell.font = {
          bold: true,
          size: 14,
          color: { argb: "FFFFFF" }
        },
        cell.alignment = {
          vertical: "middle",
          horizontal: "center"
        },
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "5b9bd5" },
        } // set background color
      });
      
      worksheet.views = [
        {state: 'frozen', ySplit: 1}
      ]; // freeze panes
      worksheet.getRow(1).height = rowHeight;
    // header-----------------
    
    // set width----------
      worksheet.getColumn("A").width = 25;
      worksheet.getColumn("B").width = 40;
      worksheet.getColumn("C").width = 15;
      worksheet.getColumn("D").width = 50;
      worksheet.getColumn("E").width = 50;
    // set width----------
    var selectData = this.isSelectedTransaction;
    if (selectData.length > 0) {
        for (let i=0; i<=selectData.length; i++) {
            if (selectData[i] !== undefined) {
                var temp: any = [];
                temp.push(moment(selectData[i]['date']).format('MM/DD/YYYY'));
                temp.push(selectData[i]['username']);
                if (selectData[i]['isSuccess'] == false)
                  temp.push("False");
                else
                  temp.push("Success");

                if(selectData[i]['dataError'] != "") {
                  var error = selectData[i]['dataError'];
                  var t: any = [];
                  for (let j=0; j<=error.length; j++) {
                    if (error[j] !== undefined) {
                      t = error[j]['errorLogs'];
                    }
                  }
                  temp.push(t);
                } else 
                  temp.push("");

                // temp.push(selectData[i]['saleTransactionId']);
                
                worksheet.addRow(temp);

                worksheet.eachRow(row => {
                    row.alignment = {
                      vertical: "middle",
                      horizontal: "center",
                      wrapText: true
                    }
                    row.height = rowHeight
                });
            }
        }
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(blob, 'List Transactions.xlsx');
        });
        
        // this.isSelectedTransaction = [];
        // this.dt.selectionKeys = [];
        // this.dt._selection = [];
        // this.paginator.changePageToFirst(event);
        // this.dt.clear();
        this.clear();
    } else
        this._messageService.add({ severity: 'error', summary: 'Error', detail: "Please select at least one transaction", life: 2000 });
  }
  

}