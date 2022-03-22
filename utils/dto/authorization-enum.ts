import { registerEnumType } from '@nestjs/graphql';

export enum Resource {
  menu = 'menu',
}

export enum Operation {
  create = 'create',
  retrieve = 'retrieve',
  update = 'update',
  delete = 'delete',
}

registerEnumType(Resource, {
  name: 'AuthorizationResource',
  description: '权限资源',
});

registerEnumType(Operation, {
  name: 'AuthorizationOperation',
  description: '权限操作',
});
