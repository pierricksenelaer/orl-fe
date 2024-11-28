'use client'

import React from 'react'
import { Card } from './ui/card'
import { PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CreateNewHackathonCard() {
  const router = useRouter()
  const handleClick = () => {
    router.push('/manager/create-hackathon')
  }
  return (
    <Card
      className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-orange-50 w-[500px] py-12"
      onClick={handleClick}
    >
      <PlusCircle className="w-20 h-20 text-gray-600 mb-12" />
      <p className="font-semibold text-gray-600 uppercase text-2xl  group-hover:text-gray-800">
        Create New Discussion Group
      </p>
    </Card>
  )
}