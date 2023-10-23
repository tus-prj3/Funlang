import {Block} from "./base/Block";
import {Vec2} from "../types/Vec2";
import {blockStore} from "../index";
import {IExpression, INode, IStatement} from "../expression/interface/INode";
import {FExpressionStatement, FIntLiteral} from "../expression/FNode";

export class NumberBlock extends Block {
  private number: number
  private readonly inputElement: HTMLInputElement

  constructor(number: number) {
    super(
      new Vec2(100, 100),100, 50,
      `number_${blockStore.blocks.length}`
    );
    this.number = number

    this.inputElement = document.createElement('input')
    this.inputElement.style.width = 50 + 'px'
    this.inputElement.style.borderRadius = '5px'
    this.inputElement.value = number.toString()
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
    const stringNumber = target.value
    if (isNaN(Number(stringNumber))) {
      this.inputElement.value = this.number.toString()
      return
    }
    this.number = Number(stringNumber)
  }

  public override getExpression(): IExpression {
    return new FIntLiteral(this.number)
  }
}