import React from "react"
import { connect } from 'react-redux'
import { onTouch } from './onTouch'

import './styles.scss'

let ImageViewer = ({
  gallery,
  imageViewer,
  hideImageViewer,
  previousImage,
  nextImage,
  touchEnd,
  setIndex,
  touchMove,
  setStartingX
}) => {

  let windowWidth = window.innerWidth

  // HIDE/SHOW Image Viewer based on state
  let display = () => {
    return imageViewer.show ? 'block' : 'none'
  }

  // Set margins on images for hiding either on left or right of window screen
  let getMargin = (index) => {
    let activeIndex = imageViewer.index
    let delta = imageViewer.delta || 0

    if (index == activeIndex) { return delta }
    if (index > activeIndex) { return windowWidth }
    if (index < activeIndex) { return -windowWidth }
  }

  let galleryItemClass = () => {
    let classes = ['gallery-item']
    let delta = imageViewer.delta
    let animated = imageViewer.animated
    if (delta) {
      classes.push('moving')
    }
    return classes.join(' ')
  }

  let imageStyles = (index) => ({
    marginLeft: getMargin(index)
  })

  let circleStyles = (index) => {
    let active = false
    if(index === imageViewer.index) {
      active = true
    } else if(imageViewer.index === -1 && index === imageViewer.images.length - 1) {
      active = true
    } else if(imageViewer.index === imageViewer.images.length && index === 0) {
      active = true
    }
    return {
      fill: active ? 'white' : 'black'
    }
  }

  const startTouch = (e) => {
    e.preventDefault()
    let startingX = e.changedTouches[0].clientX
    setStartingX(startingX)
  }

  const endTouch = (e) => {
    e.preventDefault()
    let action = onTouch(e, imageViewer.startingX)
    if(typeof action === 'undefined') {
      return
    }
    if(action === 'SLIDE_LEFT') {
      if(imageViewer.index === imageViewer.images.length) {
        return
      }
      touchEnd(action)
      if(imageViewer.index === imageViewer.images.length - 1) {
        setTimeout(() => {
          setIndex(imageViewer.index, false)
        }, 500)
        return
      }

    } else {
      if(imageViewer.index === -1) {
        return
      }
      touchEnd(action)
      if(imageViewer.index === 0) {
        setTimeout(() => {
          setIndex(0, false)
        }, 500)
      }
    }
  }

  let windowResize = () => {
    windowWidth = null
    windowWidth = window.innerWidth
  }

  let leftArrowStyle = () => ({
    opacity: imageViewer.index === 0 ? '0.15' : '1'
  })

  let rightArrowStyle = () => ({
    opacity: imageViewer.index === imageViewer.images.length - 1 ? '0.15' : '1'
  })

  let showControls = () => {
    if(!imageViewer.images || imageViewer.images.length <= 1) {
      return null
    }
    return (
      <div className="controls">
        <div className="touchpad" onTouchStart={startTouch} onTouchEnd={endTouch} onTouchMove={e => {
          touchMove(e, imageViewer.startingX)
        }}></div>


        <i className="fa fa-arrow-left icon-left" style={leftArrowStyle()} onClick={e => {
          if(imageViewer.index === -1) {
            return
          }

          if(imageViewer.index === 0) {
            return
          }
          previousImage()
        }}></i>

        <i className="fa fa-arrow-right icon-right" style={rightArrowStyle()} onClick={e => {
          if(imageViewer.index === imageViewer.images.length) {
            return
          }

          if(imageViewer.index === imageViewer.images.length - 1) {
            return
          }
          nextImage()
        }}></i>
      </div>
    )
  }

  let showImages = () => {
    if(!imageViewer.images || !imageViewer.images.length) {
      return null
    }
    let list = []

    imageViewer.images.forEach((image, index) => {
      list.push(
        <div key={image} className={galleryItemClass()} style={imageStyles(index)}>
          <img
            src={`${image}`}
            onTouchStart={startTouch}
            onTouchEnd={endTouch}
          />
        </div>
      )
    })

    return (
      <div className="gallery">
        {list}
      </div>
    )
  }

  let showDots = () => {
    if(!imageViewer.images || imageViewer.images.length <= 1) {
      return null
    }
    return (
      <div className="indicators">
        <div className="wrapper">
          {imageViewer.images.map( (image, index) => {
            return (
              <svg width="10" height="10" key={index} >
                <circle
                  style={circleStyles(index)}
                  cx="6"
                  cy="6"
                  r="4"
                  stroke="white"
                  strokeWidth="1"
                  onClick={ e => {
                    e.preventDefault()
                    setIndex(index)
                  }}
                />
              </svg>
            )
          })}
        </div>
      </div>
    )
  }

  window.addEventListener("resize", windowResize)

  return (
    <div className='image-viewer' style={{ display: display() }} >

      {showImages()}

      {showControls()}

      {showDots()}

      <i className="fa fa-times icon-close" onClick={ e => hideImageViewer() }></i>
    </div>
  )
}

const mapStateToProps = (state) => ({
  imageViewer: state.imageViewer
})

const mapDispatchToProps = (dispatch) => ({
  hideImageViewer(){
    dispatch({ type: 'HIDE_IMAGE_VIEWER' })
  },
  setIndex(index, animated){
    dispatch({
      type: 'SET_IMAGE_VIEWER_INDEX',
      index,
      animated: (typeof animated != 'undefined') ? animated : true
    })
  },
  nextImage(){
    dispatch({ type: 'NEXT_IMAGE' })
  },
  previousImage(){
    dispatch({ type: 'PREVIOUS_IMAGE' })
  },
  setStartingX(startingX){
    dispatch({ type: 'SET_STARTING_X', startingX })
  },
  touchMove(e, startingX){
    let delta = e.changedTouches[0].clientX - startingX
    dispatch({ type: 'SET_IMAGE_DELTA', delta })
  },
  touchEnd(type) {
    dispatch({ type })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageViewer)
