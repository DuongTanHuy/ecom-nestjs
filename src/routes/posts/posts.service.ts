import { Injectable } from '@nestjs/common'
import { CreatePostDto } from 'src/routes/posts/dto/create-post.dto'
import { UpdatePostDto } from 'src/routes/posts/dto/update-post.dto'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  private posts = [
    { id: 1, title: 'First Post', content: 'This is the content of the first post.' },
    { id: 2, title: 'Second Post', content: 'This is the content of the second post.' }
  ]

  getPosts(userId: number) {
    return this.prismaService.post.findMany({
      where: {
        authorId: userId
      },
      include: {
        author: {
          omit: {
            password: true
          }
        }
      }
    })
  }

  createPost({ createPostDto: { title, content }, userId }: { createPostDto: CreatePostDto; userId: number }) {
    const newPost = { id: this.posts.length + 1, title, content }
    this.posts.push(newPost)
    return this.prismaService.post.create({
      data: {
        title,
        content,
        authorId: userId
      },
      include: {
        author: {
          omit: {
            password: true
          }
        }
      }
    })
  }

  getPostDetail(id: number) {
    return this.prismaService.post.findUniqueOrThrow({
      where: {
        id
      },
      include: {
        author: {
          omit: {
            password: true
          }
        }
      }
    })
  }
  updatePost({
    userId,
    id,
    updatePostDto: { title, content }
  }: {
    userId: number
    id: number
    updatePostDto: UpdatePostDto
  }) {
    return this.prismaService.post.update({
      where: {
        authorId: userId,
        id
      },
      data: {
        title,
        content
      },
      include: {
        author: {
          omit: {
            password: true
          }
        }
      }
    })
  }

  deletePost(userId: number, id: number) {
    return this.prismaService.post.delete({
      where: {
        authorId: userId,
        id
      }
    })
  }
}
