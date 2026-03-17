import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

export interface RuleSection {
    icon: string;
    title: string;
    content: string[];
}

@Component({
    imports: [IonicModule, CommonModule],
    standalone: true,
    selector: 'app-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.less']
})
export class RulesComponent {
    @Input() show: boolean = false;
    @Output() return = new EventEmitter<void>();

    readonly ruleSections: RuleSection[] = [
        {
            icon: 'book-outline',
            title: 'Introdução',
            content: [
                'Armas e Arcanos é um jogo de RPG de mesa rápido onde os jogadores assumem o papel de aventureiros enfrentando campanhas místicas e cheias de fantasia.',
                'Use criatividade, estratégia e trabalho em equipe para superar monstros, coletar tesouros e completar os objetivos de cada jornada.',
                'As partidas duram cerca de 40 minutos a 1 hora, e não é necessário nenhum mestre fixo — basta seguir a campanha e as regras!'
            ]
        },
        {
            icon: 'layers-outline',
            title: 'Componentes',
            content: [
                'Fichas de personagem (uma por jogador)',
                'Baralho de monstros comuns (dividido por cenário)',
                'Baralho de chefes',
                'Baralho de tesouros',
                'Cartas de classes (Curandeiro, Mago, Guerreiro, Ladino)',
                'Campanhas escritas com encontros, eventos e descansos',
                'Dados de 20 lados (D20)',
                'Papel e lápis (para PV, anotações e controle de combate)'
            ]
        },
        {
            icon: 'people-outline',
            title: 'Criação dos Personagens',
            content: [
                'Cada jogador recebe uma carta de classe aleatoriamente: Curandeiro, Mago, Guerreiro ou Ladino.',
                'Cada classe possui habilidades específicas descritas em sua carta.',
                'Todos os personagens começam no nível 1. O nível máximo é 10, e o jogador sobe +1 nível a cada encontro vencido.',
                'Todos iniciam com 20 PV, e recebem +2 PV por nível.'
            ]
        },
        {
            icon: 'heart-outline',
            title: 'Vida, Morte e Descanso',
            content: [
                'PV (Ponto de Vida) representa a saúde do personagem.',
                'Se um jogador chegar a 0 PV, está morto e não pode agir até ser revivido (por item ou habilidade específica).',
                'Pontos de descanso restauram os PVs completamente e permitem troca/negociação de itens. Eles são definidos pela campanha.',
                'Jogadores mortos não são revividos durante o descanso — apenas itens ou habilidades específicas podem trazê-los de volta à vida.'
            ]
        },
        {
            icon: 'flash-outline',
            title: 'Combate',
            content: [
                'Os encontros acontecem em pontos específicos das campanhas.',
                'A quantidade de monstros é determinada por uma rolagem de D20: Grupos de 4 jogadores: D20 ÷ 2 (arredondando pra cima). Grupos de 2 jogadores: D20 ÷ 4.',
                'O máximo de monstros na mesa é: 10 monstros para 4 jogadores, 5 monstros para 2 jogadores.',
                'Os monstros têm PV, ataque, defesa e efeitos (descritos na carta).',
                'Todos os monstros têm PV + o nível dos jogadores. Se o monstro tem "Ataque: +x + nível", some o nível dos jogadores ao bônus. Se o ataque for apenas "+x", use o valor fixo.',
                'Todos os ataques (jogadores ou monstros) exigem teste de acerto com D20: Acerto: 10 ou mais. Erro: 9 ou menos. Exceto habilidades que especificam o contrário.'
            ]
        },
        {
            icon: 'map-outline',
            title: 'Tipos de Encontros',
            content: [
                'As campanhas têm cenários diferentes, e o baralho de monstros muda conforme o ambiente:',
                '• Selva & Florestas • Cidades & Ruínas • Montanhas & Planícies • Cavernas & Subterrâneo • Mortos-Vivos & Sombras',
                'Monstros podem receber bônus dependendo do cenário (ex: +1 dano perto de água). Essas informações estão descritas na campanha.'
            ]
        },
        {
            icon: 'sparkles-outline',
            title: 'Classes e Habilidades',
            content: [
                'Cada classe possui habilidades exclusivas (descritas em suas cartas).',
                'Habilidades também requerem teste de acerto (D20 ≥ 10) para serem ativadas, salvo exceções escritas na própria carta.',
                'Os jogadores só podem usar as habilidades indicadas pela sua classe.'
            ]
        },
        {
            icon: 'gift-outline',
            title: 'Tesouros e Itens',
            content: [
                'Após cada encontro, os jogadores rolam 1 D20: Número ímpar → 1 item. Número par → 2 itens.',
                'Itens são retirados do baralho de tesouros, e podem incluir: Poções, Armas, Itens mágicos.',
                'Jogadores podem trocar ou negociar itens apenas durante os pontos de descanso.',
                'Cada jogador só pode equipar uma arma por vez. Trocar exige um turno ou um descanso.',
                'Itens descartados (por uso ou efeitos de monstros) retornam ao baralho de tesouros e devem ser embaralhados.'
            ]
        },
        {
            icon: 'skull-outline',
            title: 'Monstros: estrutura da carta',
            content: [
                'Cada carta de monstro mostra: Ataque, Pontos de Vida (PV), Defesa (CD para ser atingido), Efeito especial / descrição.',
                'Exemplo: Zumbi Lento – PV 3 / Ataque +1 / Sempre age por último.',
                'Um cadáver ambulante que cambaleia em direção ao perigo sem pressa nem consciência. Sozinho, não representa ameaça — mas em grupo, pode cercar e sobrecarregar os vivos.'
            ]
        },
        {
            icon: 'document-text-outline',
            title: 'Regras Especiais',
            content: [
                'Alguns monstros têm habilidades que roubam itens: o item vai para o descarte e é embaralhado no baralho de tesouros.',
                'Alguns monstros têm efeitos com testes de acerto próprios. O valor necessário estará descrito na carta.'
            ]
        }
    ];

    close() {
        this.return.emit();
    }
}
