import { Component, EventEmitter, Output, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Cards } from '../static/cards';
import { Stories } from '../static/stories';
import { ModalController } from '@ionic/angular';
import { Messages } from './messages/messages';
import { StorySelector } from './story-selector/story-selector';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { MusicService } from '../services/music.service';
import { CardModel } from '../static/card-model';
import { single } from 'rxjs';
import { TtsService } from '../services/tts.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [IonicModule, CommonModule, Messages, StorySelector],
  templateUrl: './game.html',
  styleUrl: './game.less'
})
export class Game {
    musicService: MusicService;
    ttsService: TtsService;

    constructor(musicService: MusicService, ttsService: TtsService) {
        this.musicService = musicService;
        this.ttsService = ttsService;
    }

    @Output() bgChange = new EventEmitter<string>();    

    protected readonly title = signal('aa-game');

    cards = new Cards();
    monsterSelectedCards = signal<any>([]);

    // State Control
    flashActive = signal(false);
    modalOpen = signal(false);
    alertMessage = signal("");
    messageModal = signal("");
    storyTextModal = signal("");
    modalStory = signal(false);
    battleStarted = signal(false);

    // Atributes
    dice = signal(0);
    diceRolled = signal(false);
    
    // Cards Control
    stories = new Stories();

    selectedCard = signal("");

    selectedStory = signal<any>({});
    hasStorySelected = signal(false);
    storyBlockIndex = signal(0);
    storyBlockCount = signal(0);
    storyBlock = signal<any>({})

    public rollD20() {
        this.animateTo(20);
    }

    public rollD12() {
        this.animateTo(12);
    }

    public rollD4() {
        this.animateTo(4);
    }

    animateTo(target: number, duration = 600) {
        let counter = 0;
        
        const interval = setInterval(() => {
            this.dice.set(Math.floor(Math.random() * target) + 1);
            counter++;

            if (counter > 15) {
                clearInterval(interval);
                this.diceRolled.set(true);
            }
        }, 200);

        setTimeout(() => {
            this.dice.set(0);
            this.diceRolled.set(false);
        }, 6000);
    }

    monsterCardView(path: string) {
        this.selectedCard.set(path);
    }
    
    resetCardView() {
        this.selectedCard.set('');
    }

    storySelection() {
        this.modalStory.set(true);
    }

    // MESSAGE CONTROL

    showMessage(message: string) {
        this.messageModal.set(message);

        setTimeout(() => {
            this.messageModal.set("");
        }, 1500);
    }

    showStoryText(message: string) {
        this.storyTextModal.set(message);
    }

    //SHUFFLE AND SELECTIONS

    shuffleMonsters() {
        this.battleStarted.set(true);

        if(!this.storyBlock().boss) { 
            let qtd = Math.floor(Math.random() * 5) + 1
            let deck: any = [];

            if(this.storyBlock().monsterType == "woods")
                deck = this.cards.woods;
            if(this.storyBlock().monsterType == "caves")
                deck = this.cards.caves;
            if(this.storyBlock().monsterType == "ruins")
                deck = this.cards.ruins;
            if(this.storyBlock().monsterType == "undead")
                deck = this.cards.undead;
            if(this.storyBlock().monsterType == "mountains")
                deck = this.cards.mountains;

            if(deck) {
                for (let index = 0; index < qtd; index++) {
                    this.pickAMonster(deck)            
                }
            }
        } else {
            let deck = this.cards.bosses;
            this.pickAMonster(deck);
        }
    }

    pickAMonster(deck: CardModel[]) {
        const firstId = deck[0].id;
        const selectedId =
            Math.floor(Math.random() * deck.length) + firstId;

        const baseCard = deck.find(card => card.id === selectedId);
        if (!baseCard) return;

        // 🔑 CLONE
        const selectedCard: CardModel = {
            ...baseCard,
            hp: baseCard.hp + this.storyBlock().level
        };

        this.monsterSelectedCards.update(list => [
            ...list,
            selectedCard
        ]);
    }

    openModal() {
        this.modalOpen.set(true);
    }

   resetWithFlash() {
        this.flashActive.set(true);

        setTimeout(() => {
            //this.resetGame();

            setTimeout(() => {
                this.flashActive.set(false);
            }, 150); // tempo do fade-out
        }, 250); // tempo do fade-in
    }

    //STORY
    async storySelected(event: any) {
        if(event) {
            let story = this.stories.stories.filter(s => s.id == event.storyId)[0];
            this.selectedStory.set(story);
            this.hasStorySelected.set(true);
            this.storyBlockCount.set(story.blocks.length);
        }
        
        this.modalStory.set(false);
        await this.initMusic();
    }

    async storyNext() {      
        this.storyBlockIndex.set(this.storyBlockIndex() + 1);
        let block = this.selectedStory()?.blocks[this.storyBlockIndex() - 1];

        this.showStoryText(block.narrative);
        this.storyBlock.set(block);
        this.bgChange.emit(block.background);
        await this.speak(block.narrative);
    }

    storyPrevious() {
        this.storyBlockIndex.set(this.storyBlockIndex() - 1);
        let block = this.selectedStory()?.blocks[this.storyBlockIndex() - 1];

        if(block) {
            this.showStoryText(block.narrative);
            this.storyBlock.set(block);
            this.bgChange.emit(block.background);
        } else {
            this.bgChange.emit("portal");
            this.storyBlock.set({});
        }
    }

    async speak(text: string) {
        await this.ttsService.speak(text);
    }

    async closeStoryText() {
        this.storyTextModal.set("");
        await this.ttsService.stop();

        if(this.storyBlock().monsterType != '')
            this.shuffleMonsters();
    }

    async initMusic() {
        await this.musicService.init();
        await this.musicService.startAmbient();
    }

    //MONSTERS

    addMonsterHealth(index: number) {
        this.monsterSelectedCards.update(list =>
            list.map((m: any, i: any) =>
            i === index
                ? { ...m, hp: m.hp + 1 }
                : m
            )
        );
    }

    removeMonsterHealth(index: number) {
        let shouldRemove = false;
        this.monsterSelectedCards.update(list => {
            const copy = [...list];
            const monster = copy[index];

            if (!monster) return copy;

            const newHp = monster.hp - 1;

            if (newHp == 0) {
                shouldRemove = true;
                copy[index] = { ...monster, hp: newHp, isDying: true };
            } else {
                copy[index] = { ...monster, hp: newHp };
            }

            return copy;
        });

        if(shouldRemove)
            setTimeout(() => {
                this.removeMonster(index);
            }, 400);
    }

    removeMonster(index: number) {
        this.monsterSelectedCards.update(list => { 
            const copy = [...list];
            copy.splice(index, 1); // remove o monstro
            return copy;
        });

        if(this.monsterSelectedCards().length == 0)
            this.battleStarted.set(false);
    } 

    getStoryStatusMessage() {
        if(!this.selectedStory() || !this.selectedStory().id)
            return "Escolha a aventura para iniciar!";
        if(this.hasStorySelected() && this.storyBlockIndex() == this.storyBlockCount())
            return "História concluída! Parabéns aventureiros."
        else
            return "Prossiga aventureiro!"   
    }

    reset() {
        this.selectedStory.set({});
        this.hasStorySelected.set(false);
        this.battleStarted.set(false);
        this.storyBlock.set({});
        this.storyBlockCount.set(0);
        this.storyBlockIndex.set(0);
        this.bgChange.emit('portal');
    }
}
