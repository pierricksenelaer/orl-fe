import React, { useEffect, useState } from 'react'
import Avatar from 'react-avatar-edit'

export const UploadAvatar = ({ setPreview, preview }) => {
  const [src, setSrc] = useState('')

  const onCrop = (view) => {
    setPreview(view)
  }

  const onClose = (view) => {
    setPreview(view)
  }

  return (
    <Avatar
      width={400}
      height={300}
      border={50}
      onCrop={onCrop}
      onClose={onClose}
      exportSize={80}
      src={src}
    />
  )
}
