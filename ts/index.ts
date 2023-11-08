// noinspection all
import {NumberBlock} from "./block/base/internal";
import {BlockStore} from "./store/BlockStore";
import {BlockPosition} from "./interface/IBlockPosition";
import {SimpleOuterBlock} from "./block/SimpleOuterBlock";
import {Interpreter} from "./engine/Interpreter";
import {AssignOuterBlock} from "./block/AssignOuterBlock";
import {VariableBlock} from "./block/VariableBlock";
import {OperatorOuterBlock} from "./block/OperatorOuterBlock";

const generateButton = document.getElementById('generate')
const logButton = document.getElementById('log')
const outerButton = document.getElementById('outer')
const mainButton = document.getElementById('main')
const deleteButton = document.getElementById('deleteAll');

export const blockStore = new BlockStore()

generateButton!.onclick = (_) => {
  blockStore.blocks.push(
    // new Block(new Vec2(100, 100), 100, 50, `test_${blockStore.blocks.length}`, new FLiteral(10))
    new NumberBlock(10)
  )
}

logButton!.onclick = (_) => {
  const interpreter = new Interpreter(blockStore.getAst())
  interpreter.run()
  console.info(blockStore.blocks)
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

if (deleteButton) {
  deleteButton.onclick = () => {
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
}



// function menu1() {
//   // ブロックを特定する方法に依存します
//   // この例では、ブロックの識別子 (identifier) を使用してブロックを特定します
//   const blockIdentifier = "identifier_of_the_block_to_delete"; // 削除するブロックの識別子を指定

//   // ブロックを識別子から見つける方法に依存します
//   const blockToDelete = blockStore.blocks.find((block) => block.identifier === blockIdentifier);

//   if (blockToDelete) {
//     // ブロックを削除
//     blockToDelete.deleteBlock(blockIdentifier);
//   }
// }

function menu1() {
  // ブロックを特定する方法に依存します
  // この例では、ブロックの識別子 (identifier) を使用してブロックを特定します
  const blockIdentifier = "identifier_of_the_block_to_delete"; // 削除するブロックの識別子を指定

  // ブロックを識別子から見つける方法に依存します
  const blockToDelete = blockStore.blocks.find((block) => block.identifier === blockIdentifier);

  if (blockToDelete) {
    // ブロックを削除
    blockToDelete.deleteBlock(blockIdentifier);
  }
}