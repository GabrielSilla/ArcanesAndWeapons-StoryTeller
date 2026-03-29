import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
    imports: [IonicModule, CommonModule],
    standalone: true,
    selector: 'app-rules-modal',
    templateUrl: './rules-modal.component.html',
    styleUrls: ['./rules-modal.component.less']
})
export class RulesModalComponent {
  @Input() rules: string = "";

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }
}
