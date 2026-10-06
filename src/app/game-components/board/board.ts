import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardMapArt, BoardNode, BoardNodeType, StoryBoard } from '../../static/board';

interface NodeLook {
    color: string;
    radius: number;
}

const NODE_LOOK: Record<BoardNodeType, NodeLook> = {
    start:  { color: '#f5f5f5', radius: 14 },
    safe:   { color: '#cfc8b8', radius: 10 },
    battle: { color: '#c0392b', radius: 10 },
    rest:   { color: '#3fae5a', radius: 13 },
    reward: { color: '#e8b730', radius: 14 },
    fork:   { color: '#9b59d0', radius: 14 },
    gate:   { color: '#e67e22', radius: 16 },
    boss:   { color: '#ff2f6d', radius: 20 }
};

/** Tabuleiro: a arte do mapa de fundo com os nodes e o token do grupo por cima. */
@Component({
    imports: [CommonModule],
    standalone: true,
    selector: 'app-board',
    templateUrl: './board.html',
    styleUrls: ['./board.less']
})
export class Board implements OnChanges {
    @Input() board!: StoryBoard;
    @Input() currentNodeId = '';
    /** escurece o tabuleiro (ex.: durante um combate) */
    @Input() dimmed = false;

    art!: BoardMapArt;
    nodes: BoardNode[] = [];
    edges: { from: BoardNode; to: BoardNode; fork: boolean }[] = [];
    token: BoardNode | undefined;
    animateToken = true;

    private nodesById = new Map<string, BoardNode>();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['board'] && this.board) {
            this.nodesById = new Map(this.board.nodes.map(n => [n.id, n]));
        }
        const current = this.nodesById.get(this.currentNodeId);
        if (!current) return;

        const mapChanged = this.art?.id !== current.map;
        if (mapChanged) {
            this.art = this.board.maps.find(m => m.id === current.map)!;
            this.nodes = this.board.nodes.filter(n => n.map === current.map);
            this.edges = this.nodes.flatMap(from =>
                from.next
                    .map(id => this.nodesById.get(id))
                    .filter((to): to is BoardNode => !!to && to.map === from.map)
                    .map(to => ({ from, to, fork: from.next.length > 1 }))
            );
            // o token "salta" para a nova arte em vez de deslizar de uma posição antiga
            this.animateToken = false;
            setTimeout(() => (this.animateToken = true), 50);
        }
        this.token = current;
    }

    get aspectRatio(): number {
        return this.art.width / this.art.height;
    }

    look(node: BoardNode): NodeLook {
        return NODE_LOOK[node.type];
    }
}
