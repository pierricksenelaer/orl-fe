import { getHackathonByHid } from '@/app/libs/hackathons'
import DiscussionDetails from './discussion-details'
import { Hackathon } from '@/lib/types'

export default async function Page({ params }: { params: { hid: string } }) {
  const hackathon: Hackathon = await getHackathonByHid(params.hid)
  
  if (!hackathon) {
    return <div>Discussion not found</div>
  }

  return <DiscussionDetails hackathon={hackathon} />
}