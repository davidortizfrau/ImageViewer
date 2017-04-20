export function onTouch(e, startingX) {
  e.persist()
  e.preventDefault()

  let Xend = e.changedTouches[0].clientX;

  let leftMovement = Xend < startingX;
  let rightMovement = Xend > startingX;

  if (leftMovement) { return 'SLIDE_LEFT' }
  if (rightMovement) { return 'SLIDE_RIGHT' }
}
