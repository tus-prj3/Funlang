import {OuterBlock} from "./base/OuterBlock";
import {ComparisonOperator, IComparisonExpression} from "../expression/interface/INode";
import {Vec2} from "../types/Vec2";
import {blockStore} from "../index";
import {BlockPosition} from "../interface/IBlockPosition";
import {FComparisonExpression} from "../expression/FNode";
import {NumberBlock} from "./NumberBlock";
import {COMPARISON} from "../types/Color";

export class ComparisonOuterBlock extends OuterBlock {
    op: HTMLSelectElement

    constructor() {
        super(new Vec2(100, 100), 325, 110, `operator_${blockStore.blocks.length}`, [
            new BlockPosition(25, 25, 100, 50),
            new BlockPosition(200, 25, 100, 50)
        ]);

        const letText = document.createElement('span')
        letText.innerText = "比較"
        letText.style.color = 'white'
        letText.style.fontSize = '12px'
        letText.style.fontWeight = 'bold'
        letText.style.position = 'absolute'
        letText.style.top = '5px'
        letText.style.left = '5px'

        this.op = document.createElement('select')
        this.op.add(
            new Option('==', 'eq'),
        )
        this.op.add(
            new Option('!=', 'ne'),
        )
        this.op.add(
            new Option('<', 'lt'),
        )
        this.op.add(
            new Option('>', 'gt'),
        )
        this.op.add(
            new Option('<=', 'le'),
        )
        this.op.add(
            new Option('>=', 'ge')
        )
        this.op.style.fontSize = '12px'
        this.op.style.fontWeight = 'bold'
        this.op.style.position = 'absolute'
        this.op.style.top = '45px'
        this.op.style.left = '145px'

        this.element.appendChild(letText)
        this.element.appendChild(this.op)

        this.element.style.background = COMPARISON
    }

    validate(): boolean{
        return true
    }

    getExpression(): IComparisonExpression {
        let comparison: ComparisonOperator | null = null
        const children = Array.from(this.children.values())
        switch (this.op.value) {
            case 'eq':
                comparison = ComparisonOperator.EQ
                break
            case 'ne':
                comparison = ComparisonOperator.NE
                break
            case 'lt':
                comparison = ComparisonOperator.LT
                break
            case 'gt':
                comparison = ComparisonOperator.GT
                break
            case 'le':
                comparison = ComparisonOperator.LE
                break
            case 'ge':
                comparison = ComparisonOperator.GE
                break
        }
        return new FComparisonExpression(
            comparison!, (children[0][0] as NumberBlock).getExpression(), (children[1][0] as NumberBlock).getExpression()
        )
    }
}