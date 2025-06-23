import { Component, OnInit, Renderer2, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContactFormComponent } from '../contact-form/contact-form';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [ContactFormComponent]
})
export class HomeComponent implements OnInit {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    new Swiper('swiper-container', {
      modules: [Navigation, Pagination, Autoplay],
      navigation: true,
      pagination: { clickable: true },
      autoplay: { delay: 3000 },
      loop: true
    });
  }

  // Función para manejar el smooth scroll
  goTo(sectionId: string) {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        const topOfElement = element.offsetTop - 80; // Ajusta según la altura del header
        window.scroll({ top: topOfElement, behavior: 'smooth' });
      }
    }
  }
}