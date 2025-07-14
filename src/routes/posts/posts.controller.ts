import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostsService } from 'src/routes/posts/posts.service'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts() {
    return this.postsService.getPosts()
  }

  @Post()
  createPost(@Body() { title, content }: { title: string; content: string }) {
    return this.postsService.createPost({ title, content })
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    const post = this.postsService.getPostDetail(id)
    return { message: 'Post retrieved successfully', post }
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() { title, content }: { title: string; content: string }) {
    const updatedPost = this.postsService.updatePost({ id, title, content })

    return { message: 'Post updated successfully', post: updatedPost }
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    this.postsService.deletePost(id)
    return { message: 'Post deleted successfully' }
  }
}
