import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateVaultDto } from './dto/createVault.dto';
import { VaultService } from './vault.service';
import { type Request } from 'express';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { VaultParamsDto } from './dto/vaultParms.dto';
import { OrgParamsDto } from '../organization/dto/orgParams.dto';
import { UpdateVaultDto } from './dto/updateVault.dto';
import { CursorIdentifierDto } from '../common/dto/page/cursor.dto';

@Controller('vault')
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  @Post('/')
  async create(
    @Body() createVaultDto: CreateVaultDto,
    @Req() req: Request,
    @Session() session: UserSession,
  ) {
    const headers = req.headers;
    const userId = session.user.id;
    return this.vaultService.createVault(createVaultDto, headers, userId);
  }

  @Get(':id')
  getVaultById(
    @Session() session: UserSession,
    @Param() vaultParams: VaultParamsDto,
    @Req() req: Request,
  ) {
    const headers = req.headers;
    const userId = session.user.id;
    return this.vaultService.getVaultById(vaultParams.id, headers, userId);
  }

  @Get('/organization/:id')
  async getVaultsByOrgId(
    @Session() session: UserSession,
    @Param() orgParams: OrgParamsDto,
    @Query() cursorDto: CursorIdentifierDto,
    @Req() req: Request,
  ) {
    const headers = req.headers;
    const userId = session.user.id;
    const orgId = orgParams.id;
    return this.vaultService.getVaultsByOrgId(
      orgId,
      headers,
      userId,
      cursorDto,
    );
  }

  @Put('/')
  async updateVault(
    @Req() req: Request,
    @Body() updateVaultDto: UpdateVaultDto,
    @Session() session: UserSession,
  ) {
    const headers = req.headers;
    const userId = session.user.id;
    return this.vaultService.updateVault(updateVaultDto, headers, userId);
  }

  @Get('/analytics/count-by-user')
  async getVaultCountWithAnalyticsByUserId(@Session() session: UserSession) {
    const userId = session.user.id;
    return this.vaultService.getVaultCountWithAnanlyticsByUserId(userId);
  }

  @Delete(':id')
  async deleteVault(
    @Param() vaultParams: VaultParamsDto,
    @Req() req: Request,
    @Session() session: UserSession,
  ) {
    const headers = req.headers;
    const userId = session.user.id;
    return this.vaultService.deleteVault(vaultParams.id, headers, userId);
  }
}
