import React from 'react'
import { Button } from './ui/button'
import { Prize } from '@/lib/types'

type PrizeCardProps = {
  prize?: any
  prizeList?: Prize[] | undefined
  setPrizeList?: any
  removeElement?: any
  isEditing?: boolean
}

export const PrizeCard = ({
  prize,
  prizeList,
  setPrizeList,
  removeElement,
}: PrizeCardProps) => {
  const editPrizeTag = () => {
    let newPrizeList: Object[] | [] = []
    if (Array.isArray(prizeList) && prizeList.length > 0) {
      newPrizeList = [...prizeList]
      const index = prizeList.findIndex((elm: any) => elm.id === prize.id)
      newPrizeList[index] = { ...newPrizeList[index], isEditing: true }
      setPrizeList(newPrizeList)
    }
  }

  return (
    <div className="bg-slate-200 w-full text-black p-2 flex justify-between rounded-xl">
      <div className="px-6">
        <h1 className="text-lg font-semibold">{prize.name}</h1>
        <p className="text-sm italic">{`${prize.numberOfWinningTeams} teams - $${prize.value}`}</p>
        <p className="text-sm">{prize.description}</p>
      </div>
      <div className="flex gap-6 items-center px-6">
        <Button color="blue-gray" onClick={() => editPrizeTag()}>
          Edit
        </Button>
        <a
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
          onClick={() => removeElement(prize, prizeList, setPrizeList)}
        >
          Delete
        </a>
      </div>
    </div>
  )
}
