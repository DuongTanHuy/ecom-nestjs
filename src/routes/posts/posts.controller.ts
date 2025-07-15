import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Request } from 'express'
import { CreatePostDto, CretePostResDto, GetPostDto } from 'src/routes/posts/dto/create-post.dto'
import { UpdatePostDto } from 'src/routes/posts/dto/update-post.dto'
import { PostsService } from 'src/routes/posts/posts.service'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { Auth } from 'src/shared/decorators/auth.decorator'

@Auth([AuthType.Bearer])
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Only one method: and
  // @UseGuards(ApiKeyGuard)
  // @UseGuards(AccessTokenGuard)

  // Two method: and, or
  @Auth([AuthType.Bearer, AuthType.ApiKey], { condition: ConditionGuard.And })
  // @UseGuards(AuthenticationGuard) -> da khai bao global thi khong can dung decorator nay
  @Get()
  async getPosts(@ActiveUser('userId') userId: number) {
    return this.postsService.getPosts(userId).then((posts) => posts.map((post) => new GetPostDto(post)))
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto, @ActiveUser('userId') userId: number) {
    const result = await this.postsService.createPost({ createPostDto, userId })
    return new CretePostResDto(result)
  }

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    const post = await this.postsService.getPostDetail(Number(id))
    return { message: 'Post retrieved successfully', post: new GetPostDto(post) }
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @ActiveUser('userId') userId: number
  ) {
    const updatedPost = await this.postsService.updatePost({ userId, id: Number(id), updatePostDto })

    return { message: 'Post updated successfully', post: new GetPostDto(updatedPost) }
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string, @ActiveUser('userId') userId: number) {
    await this.postsService.deletePost(userId, Number(id))
    return { message: 'Post deleted successfully' }
  }
}
