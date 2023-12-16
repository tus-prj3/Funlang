import {OuterBlock} from "./base/OuterBlock";
import {INode, LogicalOperator} from "../expression/interface/INode";
import {Vec2} from "../types/Vec2";
import {blockStore} from "../index";
import {BlockPosition} from "../interface/IBlockPosition";
import {FComparisonExpression, FLogicalExpression} from "../expression/FNode";
import {NumberBlock} from "./NumberBlock";
import {LOGICAL} from "../types/Color";

export class LogicalOuterBlock extends OuterBlock {
    op: HTMLSelectElement

    constructor() {
        super(new Vec2(100, 100), 125, 175, `operator_${blockStore.blocks.length}`, [
            new BlockPosition(25, 25, 100, 50),
            new BlockPosition(25, 100, 100, 50)
        ]);

        const letText = document.createElement('span')
        letText.innerText = "論理演算"
        letText.style.color = 'white'
        letText.style.fontSize = '12px'
        letText.style.fontWeight = 'bold'
        letText.style.position = 'absolute'
        letText.style.top = '5px'
        letText.style.left = '5px'

        this.op = document.createElement('select')
        this.op.add(
            new Option('&&', 'and'),
        )
        this.op.add(
            new Option('||', 'or'),
        )
        this.op.style.fontSize = '12px'
        this.op.style.fontWeight = 'bold'
        this.op.style.position = 'absolute'
        this.op.style.top = '80px'
        this.op.style.left = '5px'

        this.element.appendChild(letText)
        this.element.appendChild(this.op)

        this.element.style.background = LOGICAL
    }

    validate(): boolean{
        return true
    }

    getExpression(): INode {
        let logical: LogicalOperator | null = null
        const children = Array.from(this.children.values())
        switch (this.op.value) {
            case 'and':
                logical = LogicalOperator.AND
                break
            case 'or':
                logical = LogicalOperator.OR
                break
        }
        return new FLogicalExpression(
            logical!, (children[0][0] as NumberBlock).getExpression(), (children[1][0] as NumberBlock).getExpression()
        )
    }
}