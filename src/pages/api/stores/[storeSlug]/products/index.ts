import { findUserByEmailWithStores, insertProduct } from "@lib/db"
import { array, number, string, type, TypeOf } from "io-ts"
import { newMutationHandler, newProtectedApi } from "@lib/rest"
import { createEnum } from "@lib/enum"
import { Category } from "@prisma/client"

const PostBody = type({
  name: string,
  description: string,
  price: number,
  images: array(string),
  category: createEnum<Category>(Category, "Category")
})
export type PostProductBody = TypeOf<typeof PostBody>

const post = newMutationHandler(PostBody, async (data, session, { query: { storeSlug } }) => {
  const user = await findUserByEmailWithStores(session?.user?.email || "")
  if (!user) {
    return {
      status: 403,
      body: { error: "unauthorized", description: "You don't have access to this store" }
    }
  }

  if (user.stores.findIndex((store) => store.slug === storeSlug) === -1) {
    return {
      status: 403,
      body: { error: "unauthorized", description: "You don't have access to this store" }
    }
  }

  if (string.is(storeSlug)) {
    const store = await insertProduct(data, storeSlug)
    return { status: 200, body: store }
  }

  return {
    status: 400,
    body: {
      error: "bad_request",
      description: "The data provided does not adhere to the standard"
    }
  }
})

export default newProtectedApi({ post })
