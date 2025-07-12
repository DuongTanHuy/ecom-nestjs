import { Injectable } from '@nestjs/common'

@Injectable()
export class PostsService {
  private posts = [
    { id: 1, title: 'First Post', content: 'This is the content of the first post.' },
    { id: 2, title: 'Second Post', content: 'This is the content of the second post.' }
  ]

  getPosts() {
    return this.posts
  }

  createPost({ title, content }: { title: string; content: string }) {
    const newPost = { id: this.posts.length + 1, title, content }
    this.posts.push(newPost)
    return newPost
  }

  getPostDetail(id: string) {
    const post = this.posts.find((post) => String(post.id) === id)
    if (!post) {
      throw new Error('Post not found')
    }
    return post
  }
  updatePost({ id, title, content }: { id: string; title: string; content: string }) {
    const postIndex = this.posts.findIndex((post) => String(post.id) === id)
    if (postIndex === -1) {
      throw new Error('Post not found')
    }
    const updatedPost = { ...this.posts[postIndex], title, content }
    this.posts[postIndex] = updatedPost
    return updatedPost
  }

  deletePost(id: string) {
    const postIndex = this.posts.findIndex((post) => String(post.id) === id)
    if (postIndex === -1) {
      throw new Error('Post not found')
    }
    this.posts.splice(postIndex, 1)
  }
}
