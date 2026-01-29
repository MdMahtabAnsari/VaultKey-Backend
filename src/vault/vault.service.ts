import { Injectable } from '@nestjs/common';
import { VaultRepository } from './vault.repository';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { auth } from '../auth/configs/auth';
import { CreateVaultDto } from './dto/createVault.dto';
import { IncomingHttpHeaders } from 'http';
import { fromNodeHeaders } from 'better-auth/node';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { EncryptionService } from '../encryption/encryption.service';
import { OrganizationService } from '../organization/organization.service';
import { UpdateVaultDto } from './dto/updateVault.dto';
import { startOfMonth, endOfMonth } from 'date-fns';
import { CursorIdentifierDto } from 'src/common/dto/page/cursor.dto';

@Injectable()
export class VaultService {
  private readonly vaultMasterKey = process.env.VAULT_MASTER_KEY!;
  constructor(
    private readonly vaultRepository: VaultRepository,
    private readonly authService: AuthService<typeof auth>,
    private readonly encryptionService: EncryptionService,
    private readonly organizationService: OrganizationService,
  ) {}

  async createVault(
    createVaultDto: CreateVaultDto,
    headers: IncomingHttpHeaders,
    userId: string,
  ) {
    const hasPermission = await this.authService.api.hasPermission({
      headers: fromNodeHeaders(headers),
      body: {
        permission: {
          vault: ['create'],
        },
      },
    });

    if (!hasPermission.success) {
      throw new ForbiddenException(
        'You do not have permission to create a vault.',
      );
    }
    const member = await this.organizationService.getMemberByUserId(
      createVaultDto.organizationId,
      userId,
    );
    if (!member) {
      throw new ForbiddenException(
        'You do not have permission to create a vault in this organization.',
      );
    }
    const encryptedItems = await Promise.all(
      createVaultDto.items.map(async (item) => {
        const encryptedPassword = await this.encryptionService.encryptAES256GCM(
          item.value,
          this.vaultMasterKey,
        );
        return {
          ...item,
          value: encryptedPassword,
        };
      }),
    );

    return this.vaultRepository.createVault({
      ...createVaultDto,
      items: encryptedItems,
    });
  }
  async getVaultById(
    vaultId: string,
    headers: IncomingHttpHeaders,
    userId: string,
  ) {
    const hasPermission = await this.authService.api.hasPermission({
      headers: fromNodeHeaders(headers),
      body: {
        permission: {
          vault: ['read'],
        },
      },
    });

    if (!hasPermission.success) {
      throw new ForbiddenException(
        'You do not have permission to view this vault.',
      );
    }
    const vault = await this.vaultRepository.findVaultById(vaultId);
    if (!vault) {
      throw new NotFoundException('Vault not found.');
    }

    const organizationId = vault.organizationId;

    const member = await this.organizationService.getMemberByUserId(
      organizationId,
      userId,
    );
    if (!member) {
      throw new ForbiddenException(
        'You do not have permission to view this vault.',
      );
    }

    vault.items = await Promise.all(
      vault.items.map(async (item) => {
        const decryptedValue = await this.encryptionService.decryptAES256GCM(
          item.value,
          this.vaultMasterKey,
        );
        return {
          ...item,
          value: decryptedValue,
        };
      }),
    );
    return vault;
  }
  async getVaultsByOrgId(
    organizationId: string,
    headers: IncomingHttpHeaders,
    userId: string,
    cursorIdentifierDto: CursorIdentifierDto,
  ) {
    const { cursor, limit, identifier } = cursorIdentifierDto;
    const hasPermission = await this.authService.api.hasPermission({
      headers: fromNodeHeaders(headers),
      body: {
        permission: {
          vault: ['read'],
        },
      },
    });
    if (!hasPermission.success) {
      throw new ForbiddenException(
        'You do not have permission to view vaults in this organization.',
      );
    }
    const member = await this.organizationService.getMemberByUserId(
      organizationId,
      userId,
    );
    if (!member) {
      throw new ForbiddenException(
        'You do not have permission to view vaults in this organization.',
      );
    }
    const vaults = await this.vaultRepository.findValutsByOrganizationId(
      organizationId,
      { cursor, limit: limit + 1, identifier },
    );
    const nextCursor = vaults.length > limit ? vaults[limit - 1].id : null;
    if (nextCursor) {
      vaults.pop();
    }
    // Decrypt items in each vault
    const decryptedVaults = await Promise.all(
      vaults.map(async (vault) => ({
        ...vault,
        items: await Promise.all(
          vault.items.map(async (item) => {
            const decryptedValue =
              await this.encryptionService.decryptAES256GCM(
                item.value,
                this.vaultMasterKey,
              );
            return {
              ...item,
              value: decryptedValue,
            };
          }),
        ),
      })),
    );
    return {
      vaults: decryptedVaults,
      nextCursor,
    };
  }

  async updateVault(
    updateVaultDto: UpdateVaultDto,
    headers: IncomingHttpHeaders,
    userId: string,
  ) {
    const hasPermission = await this.authService.api.hasPermission({
      headers: fromNodeHeaders(headers),
      body: {
        permission: {
          vault: ['update'],
        },
      },
    });

    if (!hasPermission.success) {
      throw new ForbiddenException(
        'You do not have permission to create a vault.',
      );
    }
    const member = await this.organizationService.getMemberByUserId(
      updateVaultDto.organizationId,
      userId,
    );
    if (!member) {
      throw new ForbiddenException(
        'You do not have permission to create a vault in this organization.',
      );
    }
    const encryptedItems = updateVaultDto.items
      ? await Promise.all(
          updateVaultDto.items.map(async (item) => {
            const encryptedPassword =
              await this.encryptionService.encryptAES256GCM(
                item.value,
                this.vaultMasterKey,
              );
            return {
              ...item,
              value: encryptedPassword,
            };
          }),
        )
      : undefined;

    return this.vaultRepository.updateVault({
      ...updateVaultDto,
      items: encryptedItems,
    });
  }

  async getVaultCountWithAnanlyticsByUserId(userId: string) {
    const now = new Date();
    const startMonth = startOfMonth(now);
    const endMonth = endOfMonth(now);
    const lastMonthStart = startOfMonth(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
    );
    const lastMonthEnd = endOfMonth(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
    );
    const organizations =
      await this.organizationService.getOrganizationsByUserId(userId);
    const organizationIds = organizations.map((org) => org.id);
    const [totalVaults, thisMonthVaults, lastMonthVaults] = await Promise.all([
      this.vaultRepository.getVaultCountByOrganizationIds(organizationIds),
      this.vaultRepository.getVaultCountByDatesAndOrganizationIds(
        organizationIds,
        startMonth,
        endMonth,
      ),
      this.vaultRepository.getVaultCountByDatesAndOrganizationIds(
        organizationIds,
        lastMonthStart,
        lastMonthEnd,
      ),
    ]);
    const percentageChange =
      lastMonthVaults > 0
        ? ((thisMonthVaults - lastMonthVaults) / lastMonthVaults) * 100
        : thisMonthVaults > 0
          ? 100
          : 0;
    return {
      total: totalVaults,
      last: lastMonthVaults,
      current: thisMonthVaults,
      percentageChange,
    };
  }
  async deleteVault(
    vaultId: string,
    headers: IncomingHttpHeaders,
    userId: string,
  ) {
    const hasPermission = await this.authService.api.hasPermission({
      headers: fromNodeHeaders(headers),
      body: {
        permission: {
          vault: ['delete'],
        },
      },
    });

    if (!hasPermission.success) {
      throw new ForbiddenException(
        'You do not have permission to delete this vault.',
      );
    }
    const vault = await this.vaultRepository.findVaultById(vaultId);
    if (!vault) {
      throw new NotFoundException('Vault not found.');
    }
    const organizationId = vault.organizationId;

    const member = await this.organizationService.getMemberByUserId(
      organizationId,
      userId,
    );
    if (!member) {
      throw new ForbiddenException(
        'You do not have permission to delete this vault.',
      );
    }
    return this.vaultRepository.deleteVault(vaultId);
  }
}
