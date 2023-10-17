import {Block} from "./blocks/Block";
import {BlockStore} from "./store/BlockStore";

const generateButton = document.getElementById('generate')

export const blockStore = new BlockStore()
generateButton!.onclick = (_) => {
  blockStore.blocks.push(
    new Block(100, 100, 100, 50, `test_${blockStore.blocks.length}`)
  )
}
