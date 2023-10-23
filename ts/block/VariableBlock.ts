import {Block} from "./base/Block";
import {Vec2} from "../types/Vec2";
import {blockStore} from "../index";
import {INode, IStatement, IVariable} from "../expression/interface/INode";
import {FExpressionStatement, FIntLiteral, FVariable} from "../expression/FNode";

export class VariableBlock extends Block {
  private id: string
  private readonly inputElement: HTMLInputElement

  constructor(id: string) {
    super(
      new Vec2(100, 100),100, 50,
      `variable_${blockStore.blocks.length}`
    );
    this.id = id

    this.inputElement = document.createElement('input')
    this.inputElement.style.width = 50 + 'px'
    this.inputElement.style.borderRadius = '5px'
    this.inputElement.value = id
    this.inputElement.style.textAlign = 'center'
    this.inputElement.oninput = this.onChangeValue
    this.element.appendChild(this.inputElement)

    // this.element.innerText = number.toString()
    this.element.style.background = '#5B67A5'
    this.element.style.textAlign = 'center'
    this.element.style.display = 'grid'
    this.element.style.placeItems = 'center'
    this.element.style.color = 'white'
  }

  private onChangeValue = (event: Event) => {
    const { target } = event
    if (!(target instanceof HTMLInputElement)) {
      return
    }
    this.id = target.value
  }

  public override getExpression(): IVariable {
    return new FVariable(this.id)
  }
}