import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Model } from 'mongoose';
import { Post } from './schema/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schema/users.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async create(createPostDto: CreatePostDto, userId: string) {
    const { title, description, lookfor, contact } = createPostDto;
    if (!title || !description || !lookfor || !contact) {
      throw new BadRequestException('all fields are required');
    }
    const createdPost = await this.postModel.create({
      title,
      description,
      lookfor,
      contact,
      author: userId,
    });

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { posts: createdPost._id } },
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'Post successfully created',
      post: createdPost,
    };
  }
  async findAll() {
    return this.postModel.find();
  }

  async findOne(id: string) {
    const post = this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('post not found');
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const updatedPost = await this.postModel.findByIdAndUpdate(
      id,
      updatePostDto,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedPost) {
      throw new NotFoundException('post not found');
    }
    return {
      message: 'post successfully updated',
      post: updatedPost,
    };
  }

  async remove(id: string) {
    const post = await this.postModel.findByIdAndDelete(id);
    if (!post) {
      throw new NotFoundException('post not found');
    }
    return { message: 'post successfully deleted', post: post };
  }
}
