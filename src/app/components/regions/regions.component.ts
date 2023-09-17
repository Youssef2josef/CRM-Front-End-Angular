import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.css']
})
export class RegionsComponent implements OnInit {
  sideNavStatus: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
