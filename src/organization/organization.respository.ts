import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CursorIdentifierDto } from 'src/common/dto/page/cursor.dto';

@Injectable()
export class OrganizationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getMemeberByUserId(organizationId: string, userId: string) {
    return this.prismaService.member.findFirst({
      where: {
        organizationId,
        userId,
      },
    });
  }

  async getNonMembers(
    organizationId: string,
    cursorIdentifierDto: CursorIdentifierDto,
  ) {
    const { cursor, limit, identifier } = cursorIdentifierDto;
    return this.prismaService.user.findMany({
      where: {
        NOT: {
          members: {
            some: {
              organizationId: organizationId,
            },
          },
        },
        ...(identifier && {
          OR: [
            { email: { contains: identifier, mode: 'insensitive' } },
            { name: { contains: identifier, mode: 'insensitive' } },
            { username: { contains: identifier, mode: 'insensitive' } },
          ],
        }),
      },
      ...(cursor && {
        cursor: { id: cursor },
      }),
      take: limit,
    });
  }

  async getOrganizationsByUserId(userId: string) {
    return this.prismaService.organization.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });
  }

  async getOrganizationCountByUserId(userId: string) {
    return this.prismaService.organization.count({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });
  }

  async getOrganizationCountByUserIdAndDate(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return this.prismaService.organization.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });
  }

  async getAllInvitations(
    organizationId?: string,
    email?: string,
    status?: string,
  ) {
    return this.prismaService.invitation.findMany({
      where: {
        email: email,
        organizationId: organizationId,
        status: status,
      },
    });
  }
  async getOrganizationById(organizationId: string) {
    return this.prismaService.organization.findUnique({
      where: {
        id: organizationId,
      },
    });
  }
  async getInvitations(
    email: string,
    cursorIdentifierDto: CursorIdentifierDto,
  ) {
    const { limit, cursor, identifier } = cursorIdentifierDto;
    return this.prismaService.invitation.findMany({
      where: {
        email: email,
        ...(identifier && {
          OR: [
            { status: { contains: identifier, mode: 'insensitive' } },
            { role: { contains: identifier, mode: 'insensitive' } },
            {
              organization: {
                OR: [
                  { name: { contains: identifier, mode: 'insensitive' } },
                  { slug: { contains: identifier, mode: 'insensitive' } },
                ],
              },
            },
          ],
        }),
      },
      ...(cursor && {
        cursor: { id: cursor },
      }),
      take: limit,
    });
  }

  async getUserOrganizations(
    userId: string,
    cursorIdentifierDto: CursorIdentifierDto,
  ) {
    const { cursor, limit, identifier } = cursorIdentifierDto;
    return this.prismaService.member.findMany({
      where: {
        userId: userId,
        ...(identifier && {
          organization: {
            OR: [
              { name: { contains: identifier, mode: 'insensitive' } },
              { slug: { contains: identifier, mode: 'insensitive' } },
            ],
          },
        }),
      },
      ...(cursor && {
        cursor: { id: cursor },
      }),
      take: limit,
      include: {
        organization: true,
      },
    });
  }

  async getMembersByOrganizationId(
    organizationId: string,
    cursorIdentifierDto: CursorIdentifierDto,
  ) {
    const { cursor, limit, identifier } = cursorIdentifierDto;
    return this.prismaService.member.findMany({
      where: {
        organizationId: organizationId,
        ...(identifier && {
          user: {
            OR: [
              { email: { contains: identifier, mode: 'insensitive' } },
              { name: { contains: identifier, mode: 'insensitive' } },
              { username: { contains: identifier, mode: 'insensitive' } },
            ],
          },
        }),
      },
      ...(cursor && {
        cursor: { id: cursor },
      }),
      take: limit,
      include: {
        user: true,
      },
    });
  }

  async getMemberByUserId(organizationId: string, userId: string) {
    return this.prismaService.member.findFirst({
      where: {
        organizationId,
        userId,
      },
    });
  }
}
