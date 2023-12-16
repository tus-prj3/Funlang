import {Vec2} from "../../types/Vec2";
import {blockStore} from "../../index";
import {BlockPosition} from "../../interface/IBlockPosition";
import {OuterBlock} from "../base/OuterBlock";
import {IStatement} from "../../expression/interface/INode";
import {FRecFunction} from "../../expression/FNode";
import {FUNCTION} from "../../types/Color";
import {VariableBlock} from "../VariableBlock";
import {FunctionCallOuterBlock} from "./FunctionCallOuterBlock";

export class RecFunctionOuterBlock extends OuterBlock {
  functionName: string

  constructor(functionName: string = `rec_function_${blockStore.blocks.length}`) {
    super(
      new Vec2(100, 100), 175, 200,
      `rec_function_${blockStore.blocks.length}`,
      [
        new BlockPosition(75, 50, 100, 50),
        new BlockPosition(75, 125, 100, 50)
      ]
    );
    this.element.style.background = FUNCTION
    this.functionName = functionName

    const inputText = document.createElement('span')
    inputText.innerText = "変数は:"
    inputText.style.fontSize = '12px'
    inputText.style.fontWeight = 'bold'
    inputText.style.position = 'absolute'
    inputText.style.color = 'white'
    inputText.style.top = '30px'
    inputText.style.left = '5px'

    const doText = document.createElement('span')
    doText.innerText = 'do'
    doText.style.fontSize = '12px'
    doText.style.fontWeight = 'bold'
    doText.style.position = 'absolute'
    doText.style.color = 'white'
    doText.style.top = '80px'
    doText.style.left = '5px'

    const generateButton = document.createElement('button')
    generateButton.style.position = 'absolute'
    generateButton.style.top = '27.5px'
    generateButton.style.left = '135px'
    generateButton.innerText = '生成'
    generateButton.style.fontSize = '10px'

    const func = document.createElement('span')
    func.innerText = '再帰関数'
    func.style.fontSize = '12px'
    func.style.fontWeight = 'bold'
    func.style.position = 'absolute'
    func.style.color = 'white'
    func.style.top = '5px'
    func.style.left = '5px'

    const nameInput = document.createElement('input')
    nameInput.value = functionName
    nameInput.style.position = 'absolute'
    nameInput.style.left = '70px'
    nameInput.style.width = '95px'
    nameInput.style.top = '5px'

    generateButton.onclick = () => {
      blockStore.blocks.push(
        new FunctionCallOuterBlock(this.functionName, true)
      )
    }
    nameInput.onchange = (event) => {
      const { target } = event
      if (!(target instanceof HTMLInputElement)) {
        return
      }
      this.functionName = target.value
    }

    this.element.appendChild(inputText)
    this.element.appendChild(doText)
    this.element.appendChild(generateButton)
    this.element.appendChild(func)
    this.element.appendChild(nameInput)
  }

  validate(): boolean {
    return false;
  }

  getExpression(): IStatement {
    const children = Array.from(this.children.values())
    return new FRecFunction(
      this.functionName, children[0][0].connectedNextBlocks().map((block) => (block as VariableBlock).getExpression()),
      children[1].map((block) => block.getExpression())
    )
  }
}