import { createAccessControl } from 'better-auth/plugins/access';
import {
  defaultStatements,
  adminAc,
} from 'better-auth/plugins/organization/access';

const statement = {
  ...defaultStatements,
  vault: ['create', 'read', 'update', 'delete'],
};

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  vault: ['create', 'read', 'update', 'delete'],
  ...adminAc.statements,
});

export const owner = ac.newRole({
  vault: ['create', 'read', 'update', 'delete'],
  ...adminAc.statements,
});

export const memeber = ac.newRole({
  vault: ['read', 'update', 'create'],
});
