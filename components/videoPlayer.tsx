import React, { useEffect, useState } from 'react'
import { YoutubeVideo } from './youtubeVideo'
import { VimeoVideo } from './vimeoVideo'

export const VideoPlayer = ({
  videoUrl,
  width,
  height,
}: {
  videoUrl: string
  width: string
  height: string
}) => {
  const [videoId, setVideoId] = useState<string>('')
  const [website, setWebsite] = useState<string>('')

  useEffect(() => {
    if (videoUrl.includes('youtube.com')) {
      setWebsite('youtube')
      const videoId = new URL(videoUrl).searchParams.get('v') || ''
      setVideoId(videoId)
    } else if (videoUrl.includes('vimeo.com')) {
      setWebsite('vimeo')
      const videoId = videoUrl.split('/').pop() || ''
      setVideoId(videoId)
    }
  }, [videoUrl, setWebsite, setVideoId])

  return (
    <>
      <div className="flex justify-center">
        {website === 'youtube' && (
          <YoutubeVideo videoId={videoId} width={width} height={height} />
        )}
        {website === 'vimeo' && (
          <VimeoVideo videoId={videoId} width={width} height={height} />
        )}
      </div>
    </>
  )
}
