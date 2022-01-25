import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PaginationArgs } from '@exonest/graphql-connections';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import * as P from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { createDateObject } from '../date/utils';
import { PostConnection } from '../models/connections/post.connections';
import { DateObject } from '../models/date.model';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => PostConnection)
  posts(@Args() pagination: PaginationArgs) {
    return findManyCursorConnection(
      (args) =>
        this.prisma.post.findMany({
          where: { publishedAt: { not: null } },
          orderBy: { publishedAt: 'desc' },
          ...args,
        }),
      () =>
        this.prisma.post.count({
          where: { publishedAt: { not: null } },
          orderBy: { publishedAt: 'desc' },
        }),
      pagination
    );
  }

  @Query(() => Post, { nullable: true })
  postBySlug(@Args('slug') slug: string) {
    return this.prisma.post.findUnique({
      where: {
        slug,
      },
    });
  }

  @ResolveField(() => User)
  async author(@Parent() { id }: P.Post) {
    return (
      await this.prisma.post.findUnique({
        where: { id },
        select: { id: true, User: true },
      })
    ).User;
  }

  @ResolveField(() => DateObject)
  createdAt(@Parent() { createdAt }: P.Post) {
    return createDateObject(createdAt);
  }

  @ResolveField(() => DateObject)
  updatedAt(@Parent() { updatedAt }: P.Post) {
    return createDateObject(updatedAt);
  }

  @ResolveField(() => DateObject, { nullable: true })
  publishedAt(@Parent() { publishedAt }: P.Post) {
    return createDateObject(publishedAt);
  }
}
