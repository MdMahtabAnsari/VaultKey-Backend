import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { OrgParamsDto } from './dto/orgParams.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { OrganizationService } from './organization.service';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { type Request } from 'express';
import { auth } from '../auth/configs/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { InviteParamsDto } from './dto/inviteParams.dto';
import { CursorIdentifierDto } from '../common/dto/page/cursor.dto';

@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly authService: AuthService<typeof auth>,
  ) {}

  @Get(':id/non-members')
  async getNonMembers(
    @Session() session: UserSession,
    @Param() orgParams: OrgParamsDto,
    @Query() cursorDto: CursorIdentifierDto,
  ) {
    const userId = session.user.id;
    const organizationId = orgParams.id;
    return this.organizationService.getNonMembers(
      userId,
      organizationId,
      cursorDto,
    );
  }
  @Get('accept-invitation/:id')
  async acceptInvitation(
    @Req() req: Request,
    @Param() inviteParams: InviteParamsDto,
  ) {
    return this.authService.api.acceptInvitation({
      body: {
        invitationId: inviteParams.id,
      },
      headers: fromNodeHeaders(req.headers),
    });
  }
  @Get('analytics/count-by-user')
  async getOrganizationCountWithAnalyticsByUserId(
    @Session() session: UserSession,
  ) {
    const userId = session.user.id;
    return this.organizationService.getOrganizationCountWithAnanlyticsByUserId(
      userId,
    );
  }
  @Get(':id/non-members-with-invitation')
  async getNonMembersWithInvitation(
    @Session() session: UserSession,
    @Param() orgParams: OrgParamsDto,
    @Query() cursorDto: CursorIdentifierDto,
  ) {
    const userId = session.user.id;
    const organizationId = orgParams.id;
    return this.organizationService.getNonMemebersWithInvitation(
      userId,
      organizationId,
      cursorDto,
    );
  }
  @Get('invitations')
  async getInvitations(
    @Session() session: UserSession,
    @Query() cursorDto: CursorIdentifierDto,
  ) {
    const email = session.user.email;
    return this.organizationService.getInvitationsWithOrganization(
      email,
      cursorDto,
    );
  }
  @Get('/')
  async getUserOrganizations(
    @Session() session: UserSession,
    @Query() cursorDto: CursorIdentifierDto,
  ) {
    const userId = session.user.id;
    return this.organizationService.getUserOrganizations(userId, cursorDto);
  }
  @Get(':id/members')
  async getMembersByOrganizationId(
    @Session() session: UserSession,
    @Param() orgParams: OrgParamsDto,
    @Query() cursorDto: CursorIdentifierDto,
  ) {
    const organizationId = orgParams.id;
    const userId = session.user.id;
    return this.organizationService.getMembersByOrganizationId(
      organizationId,
      userId,
      cursorDto,
    );
  }
}
