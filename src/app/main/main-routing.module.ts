// { 
//     path: 'app',  
//     component: MainComponent,
//     children :[
//       {path: 'reviews', component: ReviewsComponent }
//     ]
//   }

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { OnboardingComponent } from './container/onboarding/onboarding.component';
import { SettingsComponent } from './container/settings/settings.component';
import { AuthguardService } from '../service/authguard.service';

const routes = [
    { 
        path: '',
        children :[
          {path: 'onboarding', canActivate:[AuthguardService], component: OnboardingComponent },
          {path: 'settings', canActivate:[AuthguardService], component: SettingsComponent }
        ]
    }
  ]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
  })
  export class MainRoutingModule { }