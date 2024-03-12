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
    this.titleService.setTitle('Home - ClashStrike - Your Clash of Clans Upgrade Helper');

    this.metaTagService.addTags([
      {name: 'description', content: 'ClashStrike is a tool for Clash of Clans to help them organizing their upgrades.'},
      {name: 'keywords', content: 'Clash of Clans, ClashMultiTimer, ClashStrike, Game, Tool, Upgrades'},
      {property: 'og:title', content: 'ClashStrike - Your Clash of Clans Upgrade Helper'},
      {property: 'og:description', content: 'ClashStrike is a tool for Clash of Clans to help them organizing their upgrades.'},
      {property: 'og:url', content: 'http://clashstrike.com'},
      {property: 'og:type', content: 'website'},
      {property: 'twitter:title', content: 'ClashStrike - Your Clash of Clans Upgrade Helper'},
      {property: 'twitter:description', content: 'ClashStrike is a tool for Clash of Clans to help them organizing their upgrades.'},
    ]);
  }
}
