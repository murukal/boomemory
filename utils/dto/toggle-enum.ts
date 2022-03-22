import { registerEnumType } from '@nestjs/graphql';

export enum Type {
  browse = 'browse',
  like = 'like',
  collect = 'collect',
}

export enum TargetType {
  essay = 'essay',
}

registerEnumType(Type, {
  name: 'ToggleType',
  description: '事件类型',
});

registerEnumType(TargetType, {
  name: 'ToggleTargetType',
  description: '事件目标类型',
});
