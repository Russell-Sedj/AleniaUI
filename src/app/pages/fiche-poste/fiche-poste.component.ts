import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-fiche-poste',
  standalone: true,
  imports: [],
  templateUrl: './fiche-poste.component.html',
  styleUrls: ['../../../../public/assets/Css/SendToBDD.css'],
})
export class FichePosteComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const node = document.createElement('script');
      node.src = '/assets/JavaScript/test.js';
      node.type = 'text/javascript';
      node.async = true;
      node.onload = () => {
        console.log('Script loaded successfully.');
      };
      node.onerror = () => {
        console.error('Error loading script.');
      };
      document.head.appendChild(node);
    }
  }
}
