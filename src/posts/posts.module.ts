import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: PostSchema, name: Post.name }]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
