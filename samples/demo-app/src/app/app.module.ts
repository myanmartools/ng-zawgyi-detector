import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ZawgyiDetectorModule } from '@myanmartools/ng-zawgyi-detector';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [CommonModule, BrowserModule, HttpClientModule, ZawgyiDetectorModule],
    bootstrap: [AppComponent]
})
export class AppModule {}
