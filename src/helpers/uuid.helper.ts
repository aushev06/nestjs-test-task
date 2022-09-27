import * as uuid from 'uuid';

export const getUuidV1 = (): string => {
  return uuid.v1();
};
