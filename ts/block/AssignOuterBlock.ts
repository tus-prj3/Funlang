import {OuterBlock} from "./base/OuterBlock";
import {BlockPosition} from "../interface/IBlockPosition";
import {Vec2} from "../types/Vec2";
import {blockStore} from "../index";
import {AssignOperator, IExpression, IStatement} from "../expression/interface/INode";
import {FAssignOperatorExpression} from "../expression/FNode";
import {VariableBlock} from "./VariableBlock";
import {NumberBlock} from "./NumberBlock";
import {Block} from "./base/Block";
import {OperatorOuterBlock} from "./OperatorOuterBlock";
import {LET} from "../types/Color";

export class AssignOuterBlock extends OuterBlock {
  constructor() {
    super(new Vec2(100, 100), 125, 175, `assign_${blockStore.blocks.length}`, [
      new BlockPosition(25, 25, 100, 50),
      new BlockPosition(25, 100, 100, 50)
    ]);

    const letText = document.createElement('span')
    letText.innerText = "[let]"
    letText.style.fontSize = '12px'
    letText.style.fontWeight = 'bold'
    letText.style.position = 'absolute'
    letText.style.color = 'white'
    letText.style.top = '5px'
    letText.style.left = '5px'

    const equalText = document.createElement('span')
    equalText.innerText = "="
    equalText.style.fontSize = '12px'
    equalText.style.fontWeight = 'bold'
    equalText.style.position = 'absolute'
    equalText.style.color = 'white'
    equalText.style.top = '80px'
    equalText.style.left = '5px'

    this.element.appendChild(letText)
    this.element.appendChild(equalText)

    this.element.style.background = LET
  }

  public override validate(): boolean {
    const children = Array.from(this.children.values())
    if (children.length != 2) {
      return false
    }
    return (children[0][0] instanceof VariableBlock) && (children[1][0] instanceof OperatorOuterBlock || children[1][0] instanceof NumberBlock)
  }

  public override getExpression(): IStatement {
    const children = Array.from(this.children.values())
    return new FAssignOperatorExpression(
      // TODO: children にセットできるブロックのフィルタ機能が必要
      AssignOperator.ASSIGN, (children[0][0] as VariableBlock).getExpression(),
      children[1][0].getExpression()
    )
  }
}