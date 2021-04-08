import db from "$lib/db"
import type { Context } from "$lib/domain"
import type { RequestHandler } from "@sveltejs/kit"
import { string, object } from "yup"

const PostBody = object({
  name: string().required(),
  description: string(),
  address: string().required(),
  phone: string().required()
})

export const post: RequestHandler<Context, string> = async ({ context, body }) => {
  if (!context.user) {
    return {
      status: 400,
      body: {
        message: "you don't have permission to access this api"
      }
    }
  }

  const { name, address, phone, description } = await PostBody.validate(await JSON.parse(body))

  const store = await db.store.create({
    data: {
      name,
      address,
      phone,
      description,
      user: {
        connect: {
          email: context.user.email
        }
      }
    }
  })

  return {
    status: 201,
    body: store
  }
}
