import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';


@Component({
  templateUrl: './test.component.html',
})

export class TestComponent implements OnInit {
  items!: MenuItem[];
  subscription!: Subscription;
  constructor(public layoutService: LayoutService) {
    this.subscription = this.layoutService.configUpdate$.subscribe(() => {
    });
}

  ngOnInit(): void {
  }

}