import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DifficultyId, DIFFICULTY_OPTIONS } from '../../static/difficulty';

@Component({
    imports: [IonicModule, CommonModule],
    standalone: true,
    selector: 'app-difficulty-selector',
    templateUrl: './difficulty-selector.html',
    styleUrls: ['./difficulty-selector.less']
})
export class DifficultySelector implements OnChanges {
    @Input() show: boolean = false;
    @Input() selectedDifficulty: DifficultyId = 'normal';
    @Output() return = new EventEmitter<{ difficultyId: DifficultyId } | void>();

    readonly options = DIFFICULTY_OPTIONS;

    selectedId: DifficultyId = 'normal';

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['show']?.currentValue === true) {
            this.selectedId = this.selectedDifficulty;
        }
        if (changes['selectedDifficulty'] && this.show) {
            this.selectedId = this.selectedDifficulty;
        }
    }

    onGroupChange(ev: CustomEvent) {
        const v = ev.detail.value;
        if (v === 'easy' || v === 'normal' || v === 'hard' || v === 'nightmare') {
            this.selectedId = v;
        }
    }

    close() {
        this.return.emit();
    }

    choose() {
        this.return.emit({ difficultyId: this.selectedId });
    }
}
