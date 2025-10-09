import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IsAuthGuard } from 'src/auth/guards/isAuth.guard';
import { UserId } from 'src/users/decorators/user.decorator';
import { FilterPostsDto } from './dto/filter-posts.dto';
import { QueryParamsDTO } from './dto/query-params.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(IsAuthGuard)
  @Post()
  create(@Body() dto: CreatePostDto, @UserId() userId: string) {
    return this.postsService.create(dto, userId);
  }

  @Get()
  findAll(@Query() queryParamsDto: QueryParamsDTO) {
    const { page, take } = queryParamsDto;
    console.log(page, take, 'query');
    return this.postsService.findAll(queryParamsDto);
  }

  @Get('search')
  findWithFilters(@Query() FilterPostsDto: FilterPostsDto) {
    return this.postsService.findWithFilters(FilterPostsDto);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }
  @UseGuards(IsAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }
  @UseGuards(IsAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.postsService.remove(id, userId);
  }
}
