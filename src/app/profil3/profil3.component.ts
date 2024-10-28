import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-profil3',
  standalone: true,
  imports: [],
  templateUrl: './profil3.component.html',
  styleUrls: ['../../../public/assets/Css/ProfilCss.css'],
})
export class Profil3Component implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const node = document.createElement('script');
      node.src = '/assets/JavaScript/ScriptProfil.js';
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
