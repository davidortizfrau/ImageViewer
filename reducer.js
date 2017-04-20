let initState = {
  show: false,
  images: [],
  index: 0,
  delta: null,
  startingX: null
}

export default (state = initState, action) => {
  switch (action.type) {
    case 'SHOW_IMAGE_VIEWER':
      return {
        ...state,
        show: true,
        images: action.images,
        index: action.index ? action.index : 0
      }
    case 'NEXT_IMAGE':
    case 'SLIDE_LEFT':
      return {
        ...state,
        index: state.images.length == state.index + 1 ? state.index : state.index + 1,
        delta: null,
        startingX: null
      }
    case 'PREVIOUS_IMAGE':
    case 'SLIDE_RIGHT':
      return {
        ...state,
        index: state.index == 0 ? 0 : state.index - 1,
        delta: null,
        startingX: null
      }
    case 'SET_IMAGE_VIEWER_INDEX':
      return {
        ...state,
        index: action.index
      }
    case 'HIDE_IMAGE_VIEWER':
      return initState
    case 'SET_STARTING_X':
      return {
        ...state,
        startingX: action.startingX
      }
    case 'SET_IMAGE_DELTA':
      return {
        ...state,
        delta: action.delta
      }
    default:
      return state
  }
}
