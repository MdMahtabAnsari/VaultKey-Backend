import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

const statement = {
  ...defaultStatements,
  // add your custom resources/actions, e.g.:
  course: ['create', 'update', 'view', 'delete'],
};

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  ...adminAc.statements,
  course: ['create', 'update', 'view'],
});

export const user = ac.newRole({
  course: ['view'],
});
