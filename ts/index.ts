import {Block} from "./block/Block";
import {BlockStore} from "./store/BlockStore";
import {BlockSelectionStore} from "./store/BlockSelectionStore";
import {ALL_CONNECT} from "./util/ConnectFilter";
import {BlockType} from "./block/BlockType";

const generateButton = document.getElementById('generate')
const logButton = document.getElementById('log')

export const blockStore = new BlockStore()
export const blockSelectionStore = new BlockSelectionStore()

generateButton!.onclick = (_) => {
  blockStore.blocks.push(
    new Block(100, 100, 100, 50, `test_${blockStore.blocks.length}`, ALL_CONNECT, BlockType.TEMP)
  )
}

logButton!.onclick = (_) => {
  console.info(blockStore.blocks)
}
