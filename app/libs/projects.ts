import prisma from '@/lib/prisma'

export async function getProjectsByUserId(userId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [{ creatorId: userId }, { participants: { some: { id: userId } } }],
      },
      include: {
        hackathon: true,
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            userPreference: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            userPreference: true,
          },
        },
      },
    })
    return projects
  } catch (error) {
    console.error('Error retrieving managed hackathons:', error)
    throw new Error('Failed to retrieve managed hackathons')
  }
}

export async function getProjectByPid(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        hackathon: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            timeZone: true,
          },
        },
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            userPreference: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            userPreference: true,
          },
        },
      },
    })
    return project
  } catch (error) {
    console.error('Error retrieving managed hackathons:', error)
    throw new Error('Failed to retrieve managed hackathons')
  }
}

export async function getProjectsByHackathonId(hid: string) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        hackathonId: hid,
        isSubmitted: true,
      },
      include: {
        hackathon: true,
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            userPreference: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            userPreference: true,
          },
        },
      },
    })
    return projects
  } catch (error) {
    console.error('Error retrieving managed hackathons:', error)
    throw new Error('Failed to retrieve managed hackathons')
  }
}
