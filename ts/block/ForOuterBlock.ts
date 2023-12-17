import {OuterBlock} from "./base/OuterBlock";
import {IStatement} from "../expression/interface/INode";
import {FFunctionCallExpression} from "../expression/FNode";
import {Vec2} from "../types/Vec2";
import {blockStore} from "../index";
import {BlockPosition} from "../interface/IBlockPosition";
import {VariableBlock} from "./VariableBlock";
import {NumberBlock} from "./NumberBlock";
import {OperatorOuterBlock} from "./OperatorOuterBlock";
import {FUNCTION} from "../types/Color";
import {FForLoop} from "../expression/FNode";
import {IExpression} from "../expression/interface/INode";

export class ForOuterBlock extends OuterBlock {

  private id: number
  private readonly inputElement: HTMLInputElement //inputElement nani

  constructor(id: number) {
    super(
      new Vec2(100, 100), 125, 100,
      `loop_${blockStore.blocks.length}`,
      [
        new BlockPosition(
          25, 25, 100, 50
        )
      ]
    );
    this.id = id

    const printText = document.createElement('span')
    printText.innerText = "ループ(回数)"
    printText.style.color = 'white'
    printText.style.fontSize = '12px'
    printText.style.fontWeight = 'bold'
    printText.style.position = 'absolute'
    printText.style.top = '5px'
    printText.style.left = '5px'

    this.element.appendChild(printText)

    this.element.style.background = FUNCTION

    this.inputElement = document.createElement('input')
    this.inputElement.style.width = 30 + 'px'
    this.inputElement.style.borderRadius = '5px'
    this.inputElement.value = String(id)

    // 新しい位置に変更
    this.inputElement.style.position = 'absolute';
    this.inputElement.style.left = '80px';  // 例: 80px 右に移動
    this.inputElement.style.top = '3px'

    this.inputElement.style.textAlign = 'center'
    this.inputElement.oninput = this.onChangeValue
    this.element.appendChild(this.inputElement)
  }

  private onChangeValue = (event: Event) => {
    const { target } = event
    if (!(target instanceof HTMLInputElement)) {
      return
    }
    this.id = Number(target.value)
  }

  validate(): boolean {
    const children = Array.from(this.children.values())
    if (children.length != 1) {
      return false
    }
    return children[0][0] instanceof VariableBlock
      || children[0][0] instanceof NumberBlock
      || children[0][0] instanceof OperatorOuterBlock
  }

  getExpression(): IExpression {
    const children = Array.from(this.children.values())
    return new FForLoop(
      children[1][0].connectedNextBlocks().map((block) => block.getExpression()),this.id
    )
  }
}