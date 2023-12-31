import {Block} from "./base/Block";
import {Vec2} from "../types/Vec2";
import {blockStore} from "../index";
import {FIdentifier} from "../expression/FNode";
import {VARIABLE} from "../types/Color";

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

    this.element.style.background = VARIABLE
    this.element.style.textAlign = 'center'
    this.element.style.display = 'grid'
    this.element.style.placeItems = 'center'
    this.element.style.color = 'white'

    const typeText = document.createElement('span')
    typeText.innerText = "変数"
    typeText.style.fontSize = '10px'
    typeText.style.fontWeight = 'bold'
    typeText.style.position = 'absolute'
    typeText.style.top = '0px'
    typeText.style.left = '2px'
    this.element.appendChild(typeText)
  }

  private onChangeValue = (event: Event) => {
    const { target } = event
    if (!(target instanceof HTMLInputElement)) {
      return
    }
    this.id = target.value
  }

  public override getExpression() {
    return new FIdentifier(this.id)
  }

  public validate(): boolean {
    return true
  }
}