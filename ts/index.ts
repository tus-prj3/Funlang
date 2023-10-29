// noinspection all
import {NumberBlock} from "./block/base/internal";
import {BlockStore} from "./store/BlockStore";
import {BlockPosition} from "./interface/IBlockPosition";
import {SimpleOuterBlock} from "./block/SimpleOuterBlock";
import {Interpreter} from "./engine/Interpreter";
import {AssignOuterBlock} from "./block/AssignOuterBlock";
import {VariableBlock} from "./block/VariableBlock";
import {OperatorOuterBlock} from "./block/OperatorOuterBlock";
import {PrintFunctionOuterBlock} from "./block/function/PrintFunctionOuterBlock";
import { ComparisonOuterBrock } from "./block/ComparisonOuterBrock";

const generateButton = document.getElementById('generate')
const logButton = document.getElementById('log')
const outerButton = document.getElementById('outer')
const mainButton = document.getElementById('main')
const comparisonButton = document.getElementById('comparison')

export const blockStore = new BlockStore()

generateButton!.onclick = (_) => {
  blockStore.blocks.push(
    // new Block(new Vec2(100, 100), 100, 50, `test_${blockStore.blocks.length}`, new FLiteral(10))
    new NumberBlock(10)
  )
}

logButton!.onclick = (_) => {
  /*if (!blockStore.validate()) {
    // TODO: ログへの出力をやめて toast などに変更する
    console.error("構造に誤りがあります.")
    return
  }*/
  console.info(blockStore.getAst())
  const interpreter = new Interpreter(blockStore.getAst())
  interpreter.run()
  console.info(interpreter.variables)
}

outerButton!.onclick = (_) => {
  blockStore.blocks.push(
    new SimpleOuterBlock(
      `outer_${blockStore.blocks.length}`,
      [
        new BlockPosition(25, 25, 100, 50)
      ]
    )
  )
}

mainButton!.onclick = (_) => {
  blockStore.blocks.push(
    /*new MainOuterBlock(
      `main_${blockStore.blocks.length}`,
      [
        new BlockPosition(25, 25, 100, 50)
      ]
    )*/
    new AssignOuterBlock(),
    new VariableBlock("x"),
    new OperatorOuterBlock()
  )
}

comparisonButton!.onclick = (_) => {
  blockStore.blocks.push(
    new ComparisonOuterBrock()
  )
}