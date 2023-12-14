// noinspection all
import {NumberBlock} from "./block/base/internal";
import {BlockStore} from "./store/BlockStore";
import {Interpreter} from "./engine/Interpreter";
import {AssignOuterBlock} from "./block/AssignOuterBlock";
import {VariableBlock} from "./block/VariableBlock";
import {OperatorOuterBlock} from "./block/OperatorOuterBlock";
import {FunctionOuterBlock} from "./block/function/FunctionOuterBlock";
import {ComparisonOuterBlock} from "./block/ComparisonOuterBlock";
import { LogicalOuterBlock } from "./block/LogicalOuterBlock";
import {PrintFunctionOuterBlock} from "./block/function/PrintFunctionOuterBlock";
import {ReturnOuterBlock} from "./block/function/ReturnOuterBlock";
import { ConsoleStore } from "./store/ConsoleStore";

const numberButton = document.getElementById('number')
const logButton = document.getElementById('log')
const operatorButton = document.getElementById('operator')
const mainButton = document.getElementById('main')
const comparisonButton = document.getElementById('comparison')
const logicalButton = document.getElementById('logical')
const functionButton = document.getElementById('function')
const variableButton = document.getElementById('variable')
const printButton = document.getElementById('print')
const assignButton = document.getElementById('assign')
const returnButton = document.getElementById('return')
const deleteButton = document.getElementById('deleteAll');
const clearButton = document.getElementById('clear')

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
  console.info(interpreter.variables)
  console.info(interpreter.functions)
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
    new ComparisonOuterBlock()
  )
}

logicalButton!.onclick = (_) => {
  blockStore.blocks.push(
    new LogicalOuterBlock()
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

assignButton!.onclick = (_) => {
  blockStore.blocks.push(
    new AssignOuterBlock()
  )
}

returnButton!.onclick = (_) => {
  blockStore.blocks.push(
    new ReturnOuterBlock()
  )
}

deleteButton!.onclick = (_) => {
  console.log(blockStore.blocks)
  console.log("deleteAll")
  const workspace = document.getElementById('workspace');
  if (workspace) {
    // ワークスペース内のすべての子要素（ブロック）を削除
    while (workspace.firstChild) {
      workspace.removeChild(workspace.firstChild);
    }
    // ブロックストアのブロックも削除
    blockStore.blocks = [];
  }
  console.log(blockStore.blocks)
  console.log(" ")
}

clearButton!.onclick = (_) => {
  const console = document.getElementById('result_text_area')! as HTMLTextAreaElement
  console.value = ''
  ConsoleStore.outputCount = 0
}