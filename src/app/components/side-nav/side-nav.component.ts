import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  @Input() sideNavStatus: boolean = false;
  
  list = [
    {
      number: '1',
      name: 'Dashboard',
      icon: 'fa-solid fa-house',
    },
    {
      number: '2',
      name: 'Clients',
      icon: 'fa-solid fa-building',
    },
    {
      number: '3',
      name: 'Objects',
      icon: 'fa-solid fa-file-invoice fa-beat',
    },
    {
      number: '4',
      name: 'Regions',
      icon: 'fa-solid fa-tree-city',
    },
    {
      number: '5',
      name: 'Agents',
      icon: 'fa-solid fa-user-tie fa-fade',
    },
    {
      number: '6',
      name: 'Responsables',
      icon: 'fa-solid fa-user-gear fa-beat-fade',
    },

  ]
  constructor() { }

  ngOnInit() {
  }

}
