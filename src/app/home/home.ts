import { Component, OnInit } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContactFormComponent } from '../contact-form/contact-form';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [ContactFormComponent]
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    new Swiper('swiper-container', {
      modules: [Navigation, Pagination, Autoplay],
      navigation: true,
      pagination: { clickable: true },
      autoplay: { delay: 3000 },
      loop: true
    });
  }
}