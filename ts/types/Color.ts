export function getRandomColor() {
  let color = ""
  for (let i = 0; i < 3; i++) {
    let sub = Math.floor(Math.random() * 256).toString(16)
    color += (sub.length == 1 ? "0" + sub : sub)
  }
  return "#" + color
}

export const FUNCTION = '#995ba5'
export const ASSIGN = '#A58551'
export const OPERATOR = '#51791A'
export const VARIABLE = '#838521'
export const LOGIC = '#5b80a5'
export const COMPARISON = '#FF7F50'
export const LOGICAL = '#FFA500'
export const PRINT = '#4000A5'
export const LOOP = '#28640E'
export const RETURN = '#B90044'