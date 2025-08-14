import PostsManagerPage from "./pages/PostsManagerPage.tsx"
import { Layout } from "widgets/layouts"
import PostsManagerPage_copy from "./pages/PostsManagerPage_copy.tsx"

export default function App() {
  return (
    <Layout>
      <PostsManagerPage />
      {/* <PostsManagerPage_copy /> */}
    </Layout>
  )
}
