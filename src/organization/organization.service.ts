import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from './organization.respository';
import { ForbiddenException } from '@nestjs/common';
import { startOfMonth, endOfMonth } from 'date-fns';
import { type CursorIdentifierDto } from '../common/dto/page/cursor.dto';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async getNonMembers(
    userId: string,
    organizationId: string,
    cursorIdentifierDto: CursorIdentifierDto,
  ) {
    const { limit, cursor, identifier } = cursorIdentifierDto;
    const isMemeber = await this.organizationRepository.getMemeberByUserId(
      organizationId,
      userId,
    );
    if (!isMemeber) {
      throw new ForbiddenException('User is not a member of the organization');
    }
    if (isMemeber.role !== 'owner' && isMemeber.role !== 'admin') {
      throw new ForbiddenException(
        'User does not have permission to view non-members',
      );
    }
    const nonMembers = await this.organizationRepository.getNonMembers(
      organizationId,
      {
        cursor: cursor,
        limit: limit + 1,
        identifier: identifier,
      },
    );
    const nextCursor =
      nonMembers.length > limit ? nonMembers[limit - 1].id : null;
    if (nextCursor) {
      nonMembers.pop();
    }
    return {
      nonMembers,
      nextCursor,
    };
  }

  async getMemberByUserId(organizationId: string, userId: string) {
    return this.organizationRepository.getMemeberByUserId(
      organizationId,
      userId,
    );
  }

  async getOrganizationsByUserId(userId: string) {
    return this.organizationRepository.getOrganizationsByUserId(userId);
  }

  async getOrganizationCountWithAnanlyticsByUserId(userId: string) {
    const now = new Date();
    const startMonth = startOfMonth(now);
    const endMonth = endOfMonth(now);
    const lastMonthStart = startOfMonth(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
    );
    const lastMonthEnd = endOfMonth(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
    );
    const [totalOrgs, thisMonthOrgs, lastMonthOrgs] = await Promise.all([
      this.organizationRepository.getOrganizationCountByUserId(userId),
      this.organizationRepository.getOrganizationCountByUserIdAndDate(
        userId,
        startMonth,
        endMonth,
      ),
      this.organizationRepository.getOrganizationCountByUserIdAndDate(
        userId,
        lastMonthStart,
        lastMonthEnd,
      ),
    ]);
    const percentageChange =
      lastMonthOrgs > 0
        ? ((thisMonthOrgs - lastMonthOrgs) / lastMonthOrgs) * 100
        : thisMonthOrgs > 0
          ? 100
          : 0;

    return {
      total: totalOrgs,
      last: lastMonthOrgs,
      current: thisMonthOrgs,
      percentageChange,
    };
  }

  async getNonMemebersWithInvitation(
    userId: string,
    organizationId: string,
    cursorIdentifierDto: CursorIdentifierDto,
  ) {
    const { limit, cursor, identifier } = cursorIdentifierDto;
    const isMemeber = await this.organizationRepository.getMemeberByUserId(
      organizationId,
      userId,
    );
    if (!isMemeber) {
      throw new ForbiddenException('User is not a member of the organization');
    }
    if (isMemeber.role !== 'owner' && isMemeber.role !== 'admin') {
      throw new ForbiddenException(
        'User does not have permission to view non-members',
      );
    }
    const nonMembers = await this.organizationRepository.getNonMembers(
      organizationId,
      { cursor: cursor, limit: limit + 1, identifier: identifier },
    );
    const nextCursor =
      nonMembers.length > limit ? nonMembers[limit - 1].id : null;
    if (nextCursor) {
      nonMembers.pop();
    }
    const nonMembersWithInvitations = await Promise.all(
      nonMembers.map(async (user) => {
        const invitation = await this.organizationRepository.getAllInvitations(
          organizationId,
          user.email,
        );
        return {
          ...user,
          invitation: invitation || null,
        };
      }),
    );
    return {
      users: nonMembersWithInvitations,
      nextCursor,
    };
  }

  async getInvitationsWithOrganization(
    email: string,
    cursorIdentifierDto: CursorIdentifierDto,
  ) {
    const { limit, cursor, identifier } = cursorIdentifierDto;
    const invitations = await this.organizationRepository.getInvitations(
      email,
      { cursor: cursor, limit: limit + 1, identifier: identifier },
    );
    const nextCursor =
      invitations.length > limit ? invitations[limit - 1].id : null;
    if (nextCursor) {
      invitations.pop();
    }
    const invitationsWithOrg = await Promise.all(
      invitations.map(async (invite) => {
        const organization =
          await this.organizationRepository.getOrganizationById(
            invite.organizationId,
          );
        return {
          ...invite,
          organization: organization || null,
        };
      }),
    );
    return {
      invitations: invitationsWithOrg,
      nextCursor,
    };
  }

  async getUserOrganizations(
    userId: string,
    cursorIdentifierDto: CursorIdentifierDto,
  ) {
    const { limit, cursor, identifier } = cursorIdentifierDto;
    const userOrganizations =
      await this.organizationRepository.getUserOrganizations(userId, {
        cursor: cursor,
        limit: limit + 1,
        identifier: identifier,
      });
    const nextCursor =
      userOrganizations.length > limit ? userOrganizations[limit - 1].id : null;
    if (nextCursor) {
      userOrganizations.pop();
    }
    return {
      organizations: userOrganizations,
      nextCursor,
    };
  }
  async getMembersByOrganizationId(
    organizationId: string,
    userId: string,
    cursorIdentifierDto: CursorIdentifierDto,
  ) {
    const { limit, cursor, identifier } = cursorIdentifierDto;
    const isMemeber = await this.organizationRepository.getMemeberByUserId(
      organizationId,
      userId,
    );
    if (!isMemeber) {
      throw new ForbiddenException('User is not a member of the organization');
    }
    if (isMemeber.role !== 'owner' && isMemeber.role !== 'admin') {
      throw new ForbiddenException(
        'User does not have permission to view members',
      );
    }
    const members =
      await this.organizationRepository.getMembersByOrganizationId(
        organizationId,
        {
          cursor: cursor,
          limit: limit + 1,
          identifier: identifier,
        },
      );
    const nextCursor = members.length > limit ? members[limit - 1].id : null;
    if (nextCursor) {
      members.pop();
    }
    return {
      members,
      nextCursor,
    };
  }
}
