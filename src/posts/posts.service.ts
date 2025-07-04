import { FilterPostsDto } from './dto/filter-posts.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { isValidObjectId, Model } from 'mongoose';
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
    const { title, description, lookfor, contact, city } = createPostDto;
    if (!title || !description || !lookfor || !contact) {
      throw new BadRequestException('all fields are required');
    }
    const createdPost = await this.postModel.create({
      title,
      description,
      lookfor,
      contact,
      author: userId,
      city,
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

  async findWithFilters(FilterPostsDto: FilterPostsDto) {
    const query: any = {};
    if (FilterPostsDto.city) {
      query.city = { $regex: FilterPostsDto.city, $options: 'i' };
    }
    if (FilterPostsDto.position) {
      query.$or = [
        {
          'lookfor.position': {
            $regex: FilterPostsDto.position,
            $options: 'i',
          },
        },
        {
          'lookfor.positions': {
            $elemMatch: {
              $regex: FilterPostsDto.position,
              $options: 'i',
            },
          },
        },
      ];
    }
    if (FilterPostsDto.timeFilter && FilterPostsDto.timeFilter !== 'anytime') {
      const now = new Date();
      let startDate;

      switch (FilterPostsDto.timeFilter) {
        case '24hrs':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }

      query.createdAt = { $gte: startDate };
    }
    return this.postModel.find(query).sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('post not found');
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
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
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const post = await this.postModel.findByIdAndDelete(id);
    if (!post) {
      throw new NotFoundException('post not found');
    }
    await this.userModel.findByIdAndUpdate(
      post.author,
      { $pull: { posts: post._id } },
      { new: true },
    );
    return { message: 'post successfully deleted', post: post };
  }
}
