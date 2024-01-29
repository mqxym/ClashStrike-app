import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  constructor(private metaTagService: Meta, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Upgrade Helper - ClashMultiTimer');

    this.metaTagService.addTags([
      {name: 'description', content: 'ClashMultiTimer is a tool for Clash of Clans to help them organizing their upgrades.'},
      {name: 'keywords', content: 'Clash of Clans, ClashMultiTimer, Game, Tool, Upgrades'},
      {property: 'og:title', content: 'ClashMultiTimer - Your Clash of Clans Upgrade Helper'},
      {property: 'og:description', content: 'ClashMultiTimer is a tool for Clash of Clans to help them organizing their upgrades.'},
      {property: 'og:url', content: 'http://clashmultitimer.com'},
      {property: 'og:type', content: 'website'},
      {property: 'twitter:title', content: 'ClashMultiTimer - Your Clash of Clans Upgrade Helper'},
      {property: 'twitter:description', content: 'ClashMultiTimer is a tool for Clash of Clans to help them organizing their upgrades.'},
    ]);
  }
}
