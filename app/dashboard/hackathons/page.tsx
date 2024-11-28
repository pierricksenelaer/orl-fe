import { getAllHackathons } from '@/app/libs/hackathons'
import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import HackathonsList from './hackathons-list'

export default async function Page() {
  const hackathons = await getAllHackathons()
  const session = await getServerSession(authOptions)

  return <HackathonsList initialHackathons={hackathons} session={session} />
}