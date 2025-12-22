import { Component, Input, ElementRef, ViewChild, AfterViewInit, signal, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
    imports: [IonicModule, CommonModule],
    standalone: true,
    selector: 'app-init-screen',
    templateUrl: './init-screen.html',
    styleUrls: ['./init-screen.less']
})
export class InitScreen {
    @Input() display: boolean = false;
    @Input() animate: string = '';
    @Input() bgAnimate: string = '';
    @Input() image: string = "";
}