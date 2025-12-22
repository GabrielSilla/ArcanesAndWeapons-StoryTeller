import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Stories } from '../../static/stories';

@Component({
    imports: [IonicModule, CommonModule],
    standalone: true,
    selector: 'app-story-selector',
    templateUrl: './story-selector.html',
    styleUrls: ['./story-selector.less']
})
export class StorySelector {
    @Input() show: boolean = false;
    @Output() return = new EventEmitter<void>();
    public stories = signal<Stories>(new Stories());

    storyId = 0;

    close() {
        this.return.emit();
    }

    handleStory(event: any) {
        this.storyId = event.detail.value;
    }

    choose() {
        let obj: any = {
            storyId: this.storyId,
        }

        this.return.emit(obj);
    }
}