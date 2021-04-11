import type { PrismaClient, Tag, Store, Session, User, Product } from "@prisma/client/index.js"
import * as prisma from "@prisma/client/index.js"
import { generateUniqueSlug } from "$lib/domain"

let db: PrismaClient
if (prisma.PrismaClient) {
  db = new prisma.PrismaClient()
} else {
  // NOTE: sveltest workaround
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  db = new prisma.default.PrismaClient()
}

export const findAllTags = async (): Promise<Tag[]> => {
  return await db.tag.findMany()
}

export const findStoreBySlug = async (slug: string): Promise<Store> => {
  return await db.store.findFirst({
    where: { slug }
  })
}

export const findStoreBySlugAndUserEmail = async (slug: string, email: string): Promise<Store> => {
  return await db.store.findFirst({
    where: {
      slug,
      owner: { email }
    }
  })
}

export const updateStoreBySlug = async (slug: string, data: Partial<Store>): Promise<Store> => {
  return await db.store.update({ where: { slug }, data })
}

export const findSessionByAccessToken = async (token: string): Promise<Session> => {
  return await db.session.findFirst({
    where: { id: token }
  })
}

export const findUserById = async (id: string): Promise<User> => {
  return await db.user.findFirst({
    where: { id }
  })
}

export const updateUserById = async (id: string, user: Partial<User>): Promise<User> => {
  return await db.user.update({
    where: { id },
    data: user
  })
}

export const insertProductToStore = async (
  product: {
    name: string
    description: string
    price: number
  },
  storeSlug: string
): Promise<Product> => {
  return await db.product.create({
    data: {
      ...product,
      slug: generateUniqueSlug(product.name),
      store: {
        connect: { slug: storeSlug }
      }
    }
  })
}

export const findStoreProductByStoreSlug = async (slug: string): Promise<Product[]> => {
  return await db.product.findMany({
    where: {
      store: { slug }
    }
  })
}

export default db
