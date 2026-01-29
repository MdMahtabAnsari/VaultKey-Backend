import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVaultDto } from './dto/createVault.dto';
import { UpdateVaultDto } from './dto/updateVault.dto';
import { CursorIdentifierDto } from 'src/common/dto/page/cursor.dto';

@Injectable()
export class VaultRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findVaultById(vaultId: string) {
    return this.prisma.vault.findUnique({
      where: { id: vaultId },
      include: { items: true },
    });
  }
  async findValutsByOrganizationId(
    organizationId: string,
    cursorIdentifierDto: CursorIdentifierDto,
  ) {
    const { cursor, limit, identifier } = cursorIdentifierDto;
    return this.prisma.vault.findMany({
      where: {
        organizationId,
        ...(identifier && {
          OR: [
            { name: { contains: identifier, mode: 'insensitive' } },
            { description: { contains: identifier, mode: 'insensitive' } },
            {
              items: {
                some: { key: { contains: identifier, mode: 'insensitive' } },
              },
            },
          ],
        }),
      },
      ...(cursor && {
        cursor: { id: cursor },
      }),
      take: limit,
      include: { items: true },
    });
  }

  async createVault(createVaultDto: CreateVaultDto) {
    const { name, description, organizationId, items } = createVaultDto;
    return this.prisma.vault.create({
      data: {
        name,
        description,
        organizationId: organizationId,
        items: {
          create: items,
        },
      },
      include: { items: true },
    });
  }
  async updateVault(updateVaultDto: UpdateVaultDto) {
    return this.prisma.$transaction(async (prisma) => {
      const result = await prisma.vault.update({
        where: { id: updateVaultDto.id },
        data: {
          name: updateVaultDto.name,
          description: updateVaultDto.description,
        },
      });
      if (updateVaultDto.items) {
        await prisma.vaultItem.deleteMany({
          where: { vaultId: updateVaultDto.id },
        });
        const itemsData = updateVaultDto.items.map((item) => ({
          vaultId: updateVaultDto.id,
          key: item.key,
          value: item.value,
        }));
        await prisma.vaultItem.createMany({
          data: itemsData,
        });
      }
      return result;
    });
  }
  async getVaultCountByOrganizationIds(organizationIds: string[]) {
    const result = await this.prisma.vault.groupBy({
      by: ['organizationId'],
      where: {
        organizationId: { in: organizationIds },
      },
      _count: { id: true },
    });
    return result.reduce((sum, item) => sum + item._count.id, 0);
  }
  async getVaultCountByDatesAndOrganizationIds(
    organizationIds: string[],
    startDate: Date,
    endDate: Date,
  ) {
    const result = await this.prisma.vault.groupBy({
      by: ['organizationId'],
      where: {
        organizationId: { in: organizationIds },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: { id: true },
    });
    return result.reduce((sum, item) => sum + item._count.id, 0);
  }

  async deleteVault(vaultId: string) {
    return this.prisma.vault.delete({
      where: { id: vaultId },
    });
  }
}
