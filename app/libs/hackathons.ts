import prisma from "@/lib/prisma";

export async function getManagedHackathons(creatorId: string) {
  try {
    const hackathons = await prisma.hackathon.findMany({
      where: {
        creatorId,
      },
    });

    return hackathons;
  } catch (error) {
    console.error("Error retrieving managed hackathons:", error);
    throw new Error("Failure retrieving managed hackathon");
  }
}

export async function launchHackathon(hackathonId: string) {
  try {
    const hackathons = await prisma.hackathon.findMany({
      where: {
        id: hackathonId,
      },
    });

    return hackathons;
  } catch (error) {
    console.error("Error retrieving managed hackathons:", error);
    throw new Error("Failure retrieving managed hackathons");
  }
}

export async function getLaunchedHackathons() {
  try {
    const hackathons = await prisma.hackathon.findMany({
      where: {
        launched: true,
      },
    });

    return hackathons;
  } catch (error) {
    console.error("Error retrieving launched hackathons:", error);
    throw new Error("Failed to retrieve hackathons");
  }
}

export async function getAllHackathons() {
  try {
    const hackathons = await prisma.hackathon.findMany({
    });

    return hackathons;
  } catch (error) {
    console.error("Error retrieving launched hackathons:", error);
    throw new Error("Failed to retrieve hackathons");
  }
}

// export async function getHackathonByHackathonId(hid: string) {
//   try {
//     const hackathon = await prisma.hackathon.findUnique({
//       where: {
//         id: hid,
//       },
//     });

//     return hackathon;
//   } catch (error) {
//     console.error("Error retrieving launched hackathons:", error);
//     throw new Error("Failed to retrieve hackathons");
//   }
// }

export async function getHackathonByHid(hid: string) {
  try {
    const hackathon = await prisma.hackathon.findUnique({
      where: {
        id: hid,
      },
    });

    return hackathon;
  } catch (error) {
    console.error("Error retrieving launched hackathons:", error);
    throw new Error("Failed to retrieve hackathons");
  }
}


