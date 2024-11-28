import React, { useState } from 'react'
import YouTube from 'react-youtube'

export const YoutubeVideo = ({
  videoId,
  width,
  height,
}: {
  videoId: string
  width: string
  height: string
}) => {
  const [errorMessage, setErrorMessage] = useState<string>('')

  const onPlayerReady = (event: any) => {
    event.target.pauseVideo()
  }

  const onPlayerError = () => {
    setErrorMessage(
      'Error loading Youtube video. Please check the url and try again.'
    )
  }

  
  const opts = {
    height: height,
    width: width,
    playerVars: {
      autoplay: 0,
    },
  }

  return (
    <>
      <div>
        {errorMessage && <div>{errorMessage}</div>}
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onPlayerReady}
          onError={onPlayerError}
        />
      </div>
    </>
  )
}
