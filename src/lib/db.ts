import { PrismaClient, Store } from "@prisma/client"
import slugify from "slugify"
import { nanoid } from "nanoid"

const db = new PrismaClient()

export const findAllStores = async (userEmail: string) => {
  const stores = await db.store.findMany({
    where: {
      users: {
        some: {
          email: userEmail
        }
      }
    }
  })

  return stores
}

export const insertStore = async (
  store: Omit<Store, "id" | "owner" | "ownerId" | "slug" | "address">,
  ownerEmail: string
) => {
  const result = await db.store.create({
    data: {
      ...store,
      slug: slugify(`${store.name}-${nanoid(3)}`),
      owner: {
        connect: {
          email: ownerEmail
        }
      }
    }
  })

  return result
}

export default db
