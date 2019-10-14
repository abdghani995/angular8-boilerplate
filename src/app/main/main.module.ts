import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { HeaderComponent } from './shared/header/header.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { OnboardingComponent } from './container/onboarding/onboarding.component';
import { SettingsComponent } from './container/settings/settings.component';



@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    NavbarComponent,
    OnboardingComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MainModule { }
