import {Vec2} from "../../types/Vec2";
import {blockStore} from "../../index";
import {BlockPosition} from "../../interface/IBlockPosition";
import {OuterBlock} from "../base/OuterBlock";
import {IStatement} from "../../expression/interface/INode";
import {FDynamicFunction} from "../../expression/FNode";
import {FUNCTION} from "../../types/Color";
import {FunctionCallOuterBlock} from "./FunctionCallOuterBlock";

export class ClosureOuterBlock extends OuterBlock {
  closureName: string

  constructor(closureName: string = `closure_${blockStore.blocks.length}`) {
    super(
      new Vec2(100, 100), 150, 125,
      `closure_${blockStore.blocks.length}`,
      [
        new BlockPosition(50, 50, 100, 50),
      ]
    );
    this.element.style.background = FUNCTION
    this.closureName = closureName

    const doText = document.createElement('span')
    doText.innerText = '作用'
    doText.style.fontSize = '12px'
    doText.style.fontWeight = 'bold'
    doText.style.position = 'absolute'
    doText.style.color = 'white'
    doText.style.top = '40px'
    doText.style.left = '5px'

    const generateButton = document.createElement('button')
    generateButton.style.position = 'absolute'
    generateButton.style.top = '27.5px'
    generateButton.style.left = '110px'
    generateButton.innerText = '生成'
    generateButton.style.fontSize = '10px'

    const closure = document.createElement('span')
    closure.innerText = '関数閉包'
    closure.style.fontSize = '12px'
    closure.style.fontWeight = 'bold'
    closure.style.position = 'absolute'
    closure.style.color = 'white'
    closure.style.top = '5px'
    closure.style.left = '5px'

    const nameInput = document.createElement('input')
    nameInput.value = closureName
    nameInput.style.position = 'absolute'
    nameInput.style.left = '65px'
    nameInput.style.width = '75px'
    nameInput.style.top = '5px'

    generateButton.onclick = () => {
      blockStore.blocks.push(
        new FunctionCallOuterBlock(this.closureName, false)
      )
    }
    nameInput.onchange = (event) => {
      const { target } = event
      if (!(target instanceof HTMLInputElement)) {
        return
      }
      this.closureName = target.value
    }

    this.element.appendChild(doText)
    this.element.appendChild(generateButton)
    this.element.appendChild(closure)
    this.element.appendChild(nameInput)
  }

  validate(): boolean {
    return false;
  }

  getExpression(): IStatement {
    const children = Array.from(this.children.values())
    return new FDynamicFunction(
      this.closureName, [],
      children[0].map((block) => block.getExpression())
    )
  }
}