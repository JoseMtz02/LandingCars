import { Routes } from '@angular/router';
import { TerminosCondiciones } from './terminos-condiciones/terminos-condiciones';
import { AvisoPrivacidad } from './aviso-privacidad/aviso-privacidad';
import { HomeComponent } from './home/home';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'terminos', component: TerminosCondiciones},
    {path: 'aviso', component: AvisoPrivacidad}
];
