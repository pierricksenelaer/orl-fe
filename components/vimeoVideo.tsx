import React, { useState } from 'react'
import Vimeo from '@u-wave/react-vimeo'

export const VimeoVideo = ({
  videoId,
  width,
  height,
}: {
  videoId: string
  width: string
  height: string
}) => {
  const [errorMessage, setErrorMessage] = useState<string>('')

  const onPlayerError = () => {
    setErrorMessage(
      'Error loading Vimeo video. Please check the url and try again.'
    )
  }

  return (
    <>
      <div>
        {errorMessage && <div>{errorMessage}</div>}
        <Vimeo
          video={videoId}
          height={height}
          width={width}
          autoplay={false}
          onError={onPlayerError}
        />
      </div>
    </>
  )
}
