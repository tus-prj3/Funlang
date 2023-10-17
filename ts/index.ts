import {blocks} from "./store/BlockStore";
import {Block} from "./blocks/Block";

const generateButton: HTMLElement | null = document.getElementById('generate')

generateButton!.onclick = (_) => {
  blocks.push(
    new Block(100, 100, 100, 50, `test_${blocks.length}`)
  )
}

