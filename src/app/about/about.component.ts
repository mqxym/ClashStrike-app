import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {

  constructor(private metaTagService: Meta) { }

  ngOnInit() {
    this.metaTagService.addTags([
      {name: 'description', content: 'This is the about page for ClashStrike.'},
    ]);
  }

}