import { findProductsWithPrimaryImagesAndStore } from "@lib/db"
import { InferGetServerSidePropsType, NextPage } from "next"
import ProductList from "@components/product-list"
import React from "react"
import CategoryNavigation from "@components/category-navigation"

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ products }) => {
  return (
    <div>
      <CategoryNavigation />

      <main>
        <ProductList products={products} />
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  const products = await findProductsWithPrimaryImagesAndStore()

  // Pass data to the page via props
  return { props: { products } }
}

export default Home
