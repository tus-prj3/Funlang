import {Block} from "../block/Block";
import {blockStore} from "../index";

export class BlockSelectionStore {
  selectedBlocks: Block[] = []

  public calcSelectedBlocks(targetBlock: Block) {
    let result: Block[] = []
    const searched = new Map<string, boolean>()
    blockStore.blocks.forEach((block) => searched.set(block.getIdentifier, false))

    const search = (block: Block) => {
      if (searched.get(block.getIdentifier)) {
        return
      }
      result.push(block)
      searched.set(block.getIdentifier, true)
      /*if (block.hasChild) {
        search(block.getChild!)
      }*/
      if (block.hasNext) {
        search(block.getNext!)
      }
    }

    search(targetBlock)
    this.selectedBlocks = result
  }
}
