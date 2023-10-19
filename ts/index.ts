import {Block, OuterBlock} from "./block/internal";
import {BlockStore} from "./store/BlockStore";
import {Vec2} from "./types/Vec2";
import {BlockPosition} from "./interface/IBlockPosition";

const generateButton = document.getElementById('generate')
const logButton = document.getElementById('log')
const outerButton = document.getElementById('outer')

export const blockStore = new BlockStore()

generateButton!.onclick = (_) => {
  blockStore.blocks.push(
    new Block(new Vec2(100, 100), 100, 50, `test_${blockStore.blocks.length}`)
  )
}

logButton!.onclick = (_) => {
  console.info(blockStore.blocks)
}

outerButton!.onclick = (_) => {
  blockStore.blocks.push(
    new OuterBlock(
      new Vec2(200, 200), 125, 100, `outer_${blockStore.blocks.length}`,
      [
        new BlockPosition(25, 25, 100, 50)
      ]
    )
  )
}
