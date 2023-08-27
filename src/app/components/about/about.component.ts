import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  videoIcon:string = "./assets/images/play.png";
  play:string = "Play";
  videodisabled:boolean = true;

  changeImg(){
    if(this.play == "Play")
    {
      this.play = "Pause",
      this.videoIcon = "./assets/images/pause.png",
      this.videodisabled = false
    }
    else
    {
      this.videoIcon = "./assets/images/play.png",
      this.play = "Play",
      this.videodisabled = true
    }
  }
  constructor() { }

  ngOnInit() {
  }

}
