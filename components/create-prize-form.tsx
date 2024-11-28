import { Prize, TCreatePrizeSchema, createPrizeSchema } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from './ui/button'

type CreatePrizeFormProps = {
  prize: any
  removeElement: any
  prizeList: Prize[]
  setPrizeList: any
}
export default function CreatePrizeForm({
  prize,
  removeElement,
  prizeList,
  setPrizeList,
}: CreatePrizeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<TCreatePrizeSchema>({
    resolver: zodResolver(createPrizeSchema),
  })

  const onSubmit = (data: TCreatePrizeSchema) => {
    if (prizeList !== undefined) {
      const prizeData = { ...data, isEditing: false }
      const index = prizeList.findIndex((it) => it.id === prize.id)
      const newPrizeList: Prize[] = [...prizeList]
      newPrizeList[index] = { ...newPrizeList[index], ...prizeData }
      setPrizeList(newPrizeList)
    }
  }

  useEffect(() => {
    setValue('name', prize.name)
    setValue('value', prize.value)
    setValue('numberOfWinningTeams', prize.numOfWinningTeams)
    setValue('description', prize.description)
  }, [prize, setValue])

  return (
    <div className="flex w-[60rem] flex-col gap-4 rounded-lg bg-slate-200 p-6 text-black">
      <div className="w-1/3">
        <h1 className="mb-1 font-semibold dark:text-white">Name</h1>
        <input
          {...register('name')}
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-600 bg-white px-3 py-2 text-sm 
          focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        {errors.name && (
          <p className="text-red-500">{`${errors.name.message}`}</p>
        )}
      </div>
      <div className="w-[16rem]">
        <h1 className="mb-1 font-semibold dark:text-white">Cash value</h1>
        <input
          {...register('value')}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-white px-3 py-2 text-sm 
          focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          type="number"
        />
        <p className="text-normal mt-2 font-bold text-red-600">
          {errors.value && (
            <p className="text-red-500">{`${errors.value.message}`}</p>
          )}
        </p>
      </div>
      <div className="w-[16rem]">
        <h1 className="mb-1 font-semibold dark:text-white">
          Number of the winning teams
        </h1>
        <input
          {...register('numberOfWinningTeams')}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-white px-3 py-2 text-sm 
          focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          type="number"
        />
        <p className="text-normal mt-2 font-bold text-red-600">
          {errors.numberOfWinningTeams && (
            <p className="text-red-500">{`${errors?.numberOfWinningTeams?.message}`}</p>
          )}
        </p>
      </div>
      <div className="w-1/2">
        <h1 className="mb-1 font-semibold  dark:text-white">Description</h1>
        <label htmlFor="tagline" className="block text-sm text-gray-600">
          Create the details of your hackathon prize.
        </label>
        <textarea
          {...register('description')}
          className="w-full resize rounded-md  border border-gray-600 p-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>
      <div className="flex items-center gap-6">
        <Button className="bg-orange-600" onClick={handleSubmit(onSubmit)}>
          Add Prize
        </Button>
        <a
          onClick={() => removeElement(prize, prizeList, setPrizeList)}
          className="cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          Cancel
        </a>
      </div>
    </div>
  )
}
