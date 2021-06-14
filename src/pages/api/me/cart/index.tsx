import { newPublicApi } from "@lib/rest"
import { NextApiHandler } from "next"
import { getSession } from "next-auth/client"
import { findCartById, findCartByUserEmail, insertGuestCart, insertUserCart } from "@lib/db"
import { Cart, LineItem } from "@prisma/client"

export type GetResponseBody = Omit<Cart, "userId"> & { lineItems: LineItem[] }

async function getGuestCart(cartId?: string) {
  if (!cartId) return null
  return findCartById(cartId)
}

const get: NextApiHandler<GetResponseBody> = async (req, res) => {
  const session = await getSession({ req })
  const cartId = req.cookies["guest-cart-id"]

  if (!session) {
    let cart = await getGuestCart(cartId)
    if (!cart) {
      cart = await insertGuestCart()
      res.setHeader("Set-Cookie", `guest-cart-id=${cart.id}`)
    }

    res.status(200).json({
      id: cart.id,
      lineItems: cart.lineItems
    })
    return
  }

  let cart = await findCartByUserEmail(session.user.email)
  if (!cart) {
    cart = await insertUserCart(session.user.email)
    res.setHeader("Set-Cookie", `guest-cart-id=${cart.id}`)
  }
  res.status(200).json({
    id: cart.id,
    lineItems: cart.lineItems
  })
}

export default newPublicApi({ get })
