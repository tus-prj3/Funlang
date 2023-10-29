import {SimpleOuterBlock} from "./SimpleOuterBlock";
import {IBlockPosition} from "../interface/IBlockPosition";
import {IExpression} from "../expression/interface/INode";
import {FFunction, FFunctionBody} from "../expression/FNode";

export class MainOuterBlock extends SimpleOuterBlock {
  constructor(identifier: string, childrenPositions: IBlockPosition[]) {
    super(identifier, childrenPositions);

    const mainText = document.createElement('span')
    mainText.innerText = "Main Function"
    mainText.style.fontSize = '12px'
    mainText.style.fontWeight = 'bold'
    mainText.style.position = 'absolute'
    mainText.style.top = '5px'
    mainText.style.left = '5px'
    this.element.appendChild(mainText)
  }

  public override getExpression(): IExpression {
    return new FFunction("main", null,
      new FFunctionBody(this.getChildrenExpression())
    )
  }

  validate(): boolean {
    return true;
  }
}