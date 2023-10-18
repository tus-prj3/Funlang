import {Block} from "./blocks/Block";
import {BlockStore} from "./store/BlockStore";
import {BlockSelectionStore} from "./store/BlockSelectionStore";

const generateButton = document.getElementById('generate')
const logButton = document.getElementById('log')

export const blockStore = new BlockStore()
export const blockSelectionStore = new BlockSelectionStore()

generateButton!.onclick = (_) => {
  blockStore.blocks.push(
    new Block(100, 100, 100, 50, `test_${blockStore.blocks.length}`)
  )
}

logButton!.onclick = (_) => {
  console.info(blockStore.blocks)
}
