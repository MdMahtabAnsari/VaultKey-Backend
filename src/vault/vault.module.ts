import { Module } from '@nestjs/common';
import { VaultService } from './vault.service';
import { VaultController } from './vault.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { VaultRepository } from './vault.repository';
import { EncryptionModule } from '../encryption/encryption.module';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [PrismaModule, AuthModule, EncryptionModule, OrganizationModule],
  providers: [VaultService, VaultRepository],
  controllers: [VaultController],
})
export class VaultModule {}
