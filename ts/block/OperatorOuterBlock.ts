import {OuterBlock} from "./base/OuterBlock";
import {INode, Operator} from "../expression/interface/INode";
import {Vec2} from "../types/Vec2";
import {blockStore} from "../index";
import {BlockPosition} from "../interface/IBlockPosition";
import {FOperatorExpression} from "../expression/FNode";
import {NumberBlock} from "./NumberBlock";

export class OperatorOuterBlock extends OuterBlock {
  op: HTMLSelectElement

  constructor() {
    super(new Vec2(100, 100), 125, 175, `operator_${blockStore.blocks.length}`, [
      new BlockPosition(25, 25, 100, 50),
      new BlockPosition(25, 100, 100, 50)
    ]);

    const letText = document.createElement('span')
    letText.innerText = "[op]"
    letText.style.color = 'white'
    letText.style.fontSize = '12px'
    letText.style.fontWeight = 'bold'
    letText.style.position = 'absolute'
    letText.style.top = '5px'
    letText.style.left = '5px'

    this.op = document.createElement('select')
    this.op.add(
      new Option('+', 'plus'),
    )
    this.op.add(
      new Option('-', 'minus'),
    )
    this.op.add(
      new Option('/', 'div'),
    )
    this.op.add(
      new Option('*', 'multi')
    )
    this.op.style.fontSize = '12px'
    this.op.style.fontWeight = 'bold'
    this.op.style.position = 'absolute'
    this.op.style.top = '80px'
    this.op.style.left = '5px'

    this.element.appendChild(letText)
    this.element.appendChild(this.op)
  }

  validate(): boolean {
    const children = Array.from(this.children.values())
    if (children.length != 2) {
      return false
    }
    return (children[0][0] instanceof NumberBlock) && (children[1][0] instanceof NumberBlock)
  }

  getExpression(): INode {
    let operator: Operator | null = null
    const children = Array.from(this.children.values())
    switch (this.op.value) {
      case 'plus':
        operator = Operator.PLUS
        break
      case 'minus':
        operator = Operator.MINUS
        break
      case 'div':
        operator = Operator.DIVISION
        break
      case 'multi':
        operator = Operator.MULTIPLY
        break
    }
    return new FOperatorExpression(
      operator!, (children[0][0] as NumberBlock).getExpression(), (children[1][0] as NumberBlock).getExpression()
    )
  }
}