import { Component, EventEmitter, Output, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Cards } from '../static/cards';
import { Stories } from '../static/stories';
import { ModalController } from '@ionic/angular';
import { Messages } from './messages/messages';
import { StorySelector } from './story-selector/story-selector';
import { DifficultySelector } from './difficulty-selector/difficulty-selector';
import { RulesComponent } from './rules/rules.component';
import {
    DifficultyId,
    hpPerLevelFor,
    isDifficultyId
} from '../static/difficulty';
import { MusicService } from '../services/music.service';
import { CardModel } from '../static/card-model';
import { DecisionOption } from '../static/story-block';
import { TtsService } from '../services/tts.service';
import { getSummonsForMonster } from '../static/monster-summons';

const BOSS_ARAUTO_DO_FIM_ID = 10002;
const ARAUTO_REVIVE_ATTACK_BONUS = 5;
const REVIVE_FLASH_MS = 850;

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [IonicModule, CommonModule, Messages, StorySelector, DifficultySelector, RulesComponent],
  templateUrl: './game.html',
  styleUrl: './game.less'
})
export class Game {
    musicService: MusicService;
    ttsService: TtsService;

    /** Preferência do narrador (TTS); persistida em localStorage */
    narratorEnabled = signal(true);

    private static readonly NARRATOR_STORAGE_KEY = 'aa-story-narrator-enabled';
    private static readonly DIFFICULTY_STORAGE_KEY = 'aa-game-difficulty';

    /** Multiplicador de HP por nível do bloco (Fácil 1× … Pesadelo 10×) */
    difficultyId = signal<DifficultyId>('normal');

    constructor(musicService: MusicService, ttsService: TtsService) {
        this.musicService = musicService;
        this.ttsService = ttsService;
        try {
            const v = localStorage.getItem(Game.NARRATOR_STORAGE_KEY);
            if (v !== null) {
                this.narratorEnabled.set(v === 'true');
            }
            const d = localStorage.getItem(Game.DIFFICULTY_STORAGE_KEY);
            if (d !== null && isDifficultyId(d)) {
                this.difficultyId.set(d);
            }
        } catch {
            /* modo privado / indisponível */
        }
    }

    private setDifficultyId(id: DifficultyId) {
        this.difficultyId.set(id);
        try {
            localStorage.setItem(Game.DIFFICULTY_STORAGE_KEY, id);
        } catch {
            /* ignore */
        }
    }

    onNarratorChange(ev: Event) {
        const checked = (ev as CustomEvent<{ checked: boolean }>).detail.checked;
        this.setNarratorEnabled(checked);
    }

    /** Alterna o narrador (clique na label "Narrador") */
    toggleNarrator() {
        this.setNarratorEnabled(!this.narratorEnabled());
    }

    private setNarratorEnabled(checked: boolean) {
        this.narratorEnabled.set(checked);
        try {
            localStorage.setItem(Game.NARRATOR_STORAGE_KEY, String(checked));
        } catch {
            /* ignore */
        }
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
    modalDifficulty = signal(false);
    modalRules = signal(false);
    modalDecisionOpen = signal(false);
    modalDecisionData = signal<{ narrative: string; title: string; options: DecisionOption[] } | null>(null);
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
    storyBlock = signal<any>({});

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
        this.modalDifficulty.set(true);
    }

    onDifficultyReturn(event: { difficultyId: DifficultyId } | void) {
        if (event && 'difficultyId' in event) {
            this.setDifficultyId(event.difficultyId);
            this.modalDifficulty.set(false);
            this.modalStory.set(true);
        } else {
            this.modalDifficulty.set(false);
        }
    }

    openRules() {
        this.modalRules.set(true);
    }

    closeRules() {
        this.modalRules.set(false);
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
            const deck = this.cards.bosses;
            const forcedBossId = this.storyBlock().bossId;
            this.pickAMonster(deck, forcedBossId, { applySummons: true });
        }
    }

    /** HP do encontro atual (nível × dificuldade + modificador de boss do bloco). */
    private cloneMonsterWithEncounterHp(baseCard: CardModel): CardModel {
        const hpModifier = this.storyBlock().bossHpModifier ?? 0;
        const level = this.storyBlock().level;
        const hpPerLevel = hpPerLevelFor(this.difficultyId());
        return {
            ...baseCard,
            hp: baseCard.hp + hpPerLevel * level + hpModifier
        };
    }

    /**
     * Invoca monstro por id (efeitos especiais). Recursivo se o invocado também tiver invocações.
     * Só deve ser chamado em encontros comuns (não chefes).
     */
    private spawnMonsterById(summonId: number) {
        const template = this.cards.getCardTemplateById(summonId);
        if (!template) return;

        const selectedCard = this.cloneMonsterWithEncounterHp(template);
        this.monsterSelectedCards.update((list) => [...list, selectedCard]);

        for (const nestedId of getSummonsForMonster(summonId)) {
            this.spawnMonsterById(nestedId);
        }
    }

    pickAMonster(
        deck: CardModel[],
        forcedId?: number,
        opts?: { applySummons?: boolean }
    ) {
        const firstId = deck[0].id;
        let selectedId = forcedId ?? (Math.floor(Math.random() * deck.length) + firstId);

        let baseCard = deck.find(card => card.id === selectedId);
        if (!baseCard && forcedId != null) {
            selectedId = Math.floor(Math.random() * deck.length) + firstId;
            baseCard = deck.find(card => card.id === selectedId);
        }
        if (!baseCard) return;

        const selectedCard = this.cloneMonsterWithEncounterHp(baseCard);

        this.monsterSelectedCards.update((list) => [...list, selectedCard]);

        const applySummons = opts?.applySummons !== false;
        if (applySummons) {
            for (const summonId of getSummonsForMonster(baseCard.id)) {
                this.spawnMonsterById(summonId);
            }
        }
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
            this.storyBlock.set(story.blocks[0] || {});
        }
        
        this.modalStory.set(false);
        await this.initMusic();
    }

    async storyNext() {      
        this.storyBlockIndex.set(this.storyBlockIndex() + 1);
        let block = this.selectedStory()?.blocks[this.storyBlockIndex() - 1];

        if (block && block.blockType === 'decision' && block.decisionOptions?.length) {
            this.storyBlock.set(block);
            this.bgChange.emit(block.background);
            this.modalDecisionData.set({ narrative: block.narrative, title: block.title, options: block.decisionOptions });
            this.modalDecisionOpen.set(true);
            return;
        }

        this.showStoryText(block.narrative);
        this.storyBlock.set(block);
        this.bgChange.emit(block.background);
        await this.speak(block.narrative);
    }

    storyPrevious() {
        this.storyBlockIndex.set(this.storyBlockIndex() - 1);
        let block = this.selectedStory()?.blocks[this.storyBlockIndex() - 1];

        if (block && block.blockType === 'decision') {
            this.modalDecisionOpen.set(false);
            this.modalDecisionData.set(null);
        }

        if(block) {
            this.showStoryText(block.narrative);
            this.storyBlock.set(block);
            this.bgChange.emit(block.background);
        } else {
            this.bgChange.emit("portal");
            this.storyBlock.set({});
        }
    }

    async decisionChoice(targetStoryId: number) {
        this.modalDecisionOpen.set(false);
        this.modalDecisionData.set(null);

        const story = this.stories.stories.find(s => s.id === targetStoryId);
        if (!story) return;

        this.selectedStory.set(story);
        this.hasStorySelected.set(true);
        this.storyBlockCount.set(story.blocks.length);
        this.storyBlockIndex.set(0);
        this.monsterSelectedCards.set([]);

        this.storyBlockIndex.set(1);
        const block = story.blocks[0];

        if (block && block.blockType === 'decision' && block.decisionOptions?.length) {
            this.storyBlock.set(block);
            this.bgChange.emit(block.background);
            this.modalDecisionData.set({ narrative: block.narrative, title: block.title, options: block.decisionOptions });
            this.modalDecisionOpen.set(true);
        } else {
            this.showStoryText(block.narrative);
            this.storyBlock.set(block);
            this.bgChange.emit(block.background);
            await this.speak(block.narrative);
        }
    }

    async speak(text: string) {
        if (!this.narratorEnabled()) {
            return;
        }
        console.log(this.selectedStory().id, this.storyBlock().id);
        await this.ttsService.speak(text, this.selectedStory().id, this.storyBlock().id, this.selectedStory().voice);
    }

    async closeStoryText() {
        this.storyTextModal.set("");
        await this.ttsService.stop();

        if(this.storyBlock().monsterType != '')
            this.shuffleMonsters();
    }

    async initMusic() {
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
            if (monster.hp <= 0 || monster.isDying) return copy;

            const newHp = monster.hp - 1;

            if (newHp == 0) {
                const canRevive =
                    monster.id === BOSS_ARAUTO_DO_FIM_ID &&
                    !monster.bossReviveConsumed;

                if (canRevive) {
                    const template = this.cards.bosses.find(
                        (c) => c.id === BOSS_ARAUTO_DO_FIM_ID
                    );
                    if (template) {
                        const revived = this.cloneMonsterWithEncounterHp(template);
                        copy[index] = {
                            ...revived,
                            attack: revived.attack + ARAUTO_REVIVE_ATTACK_BONUS,
                            bossReviveConsumed: true,
                            reviveFlash: true,
                        };
                        shouldRemove = false;
                        setTimeout(() => {
                            this.monsterSelectedCards.update((list) =>
                                list.map((m: any) =>
                                    m?.reviveFlash
                                        ? { ...m, reviveFlash: false }
                                        : m
                                )
                            );
                        }, REVIVE_FLASH_MS);
                    } else {
                        shouldRemove = true;
                        copy[index] = { ...monster, hp: newHp, isDying: true };
                    }
                } else {
                    shouldRemove = true;
                    copy[index] = { ...monster, hp: newHp, isDying: true };
                }
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

    getMonsterAttack(card: CardModel) {
        if(card.shouldIncrementLevel)
            return this.storyBlock().level + card.attack;
        else 
            return card.attack;
    }

    reset() {
        this.modalDecisionOpen.set(false);
        this.modalDecisionData.set(null);
        this.selectedStory.set({});
        this.hasStorySelected.set(false);
        this.battleStarted.set(false);
        this.storyBlock.set({});
        this.storyBlockCount.set(0);
        this.storyBlockIndex.set(0);
        this.bgChange.emit('portal');
    }
}
