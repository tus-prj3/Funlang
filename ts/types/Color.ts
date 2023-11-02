export function getRandomColor() {
  let color = ""
  for (let i = 0; i < 3; i++) {
    let sub = Math.floor(Math.random() * 256).toString(16)
    color += (sub.length == 1 ? "0" + sub : sub)
  }
  return "#" + color
}

export const FUNCTION = '#995ba5'
export const LET = '#A58551'
export const OPERATOR = '#51791A'