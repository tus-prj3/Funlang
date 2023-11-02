// noinspection all
import {NumberBlock} from "./block/base/internal";
import {BlockStore} from "./store/BlockStore";
import {Interpreter} from "./engine/Interpreter";
import {AssignOuterBlock} from "./block/AssignOuterBlock";
import {VariableBlock} from "./block/VariableBlock";
import {OperatorOuterBlock} from "./block/OperatorOuterBlock";
import {PrintFunctionOuterBlock} from "./block/function/PrintFunctionOuterBlock";
import {ComparisonOuterBrock} from "./block/ComparisonOuterBrock";
import {FunctionOuterBlock} from "./block/function/FunctionOuterBlock";

const numberButton = document.getElementById('number')
const logButton = document.getElementById('log')
const operatorButton = document.getElementById('operator')
const mainButton = document.getElementById('main')
const comparisonButton = document.getElementById('comparison')
const functionButton = document.getElementById('function')
const variableButton = document.getElementById('variable')
const printButton = document.getElementById('print')
const defineButton = document.getElementById('define')

export const blockStore = new BlockStore()

numberButton!.onclick = (_) => {
  blockStore.blocks.push(
    new NumberBlock(10)
  )
}

logButton!.onclick = (_) => {
  /*if (!blockStore.validate()) {
    // TODO: ログへの出力をやめて toast などに変更する
    console.error("構造に誤りがあります.")
    return
  }*/
  console.info("--- Ast info ---")
  console.info(blockStore.getAst())
  console.info("--- Blocks info ---")
  console.info(blockStore.blocks)

  const interpreter = new Interpreter(blockStore.getAst())
  interpreter.run()
}

operatorButton!.onclick = (_) => {
  blockStore.blocks.push(
    new OperatorOuterBlock()
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

functionButton!.onclick = (_) => {
  blockStore.blocks.push(
    new FunctionOuterBlock()
  )
}

variableButton!.onclick = (_) => {
  blockStore.blocks.push(
    new VariableBlock("x")
  )
}

printButton!.onclick = (_) => {
  blockStore.blocks.push(
    new PrintFunctionOuterBlock()
  )
}

defineButton!.onclick = (_) => {
  blockStore.blocks.push(
    new AssignOuterBlock()
  )
}