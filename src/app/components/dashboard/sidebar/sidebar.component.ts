import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  minPrice: number = 0;
  maxPrice: number = 0;

  priceSteps = [
    { value: '0', label: '0' },
    { value: '1', label: '1K' },
    { value: '2', label: '2K' },
    { value: '3', label: '3K' },
    { value: '4', label: '4K' },
    { value: '5', label: '5K' }
  ];

  constructor() { }

  ngOnInit(): void {
  }



}
