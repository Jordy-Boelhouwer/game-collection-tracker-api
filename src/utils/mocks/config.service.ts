export const MockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'JWT_SECRET':
        return 'secret';
      case 'JWT_EXPIRATION_TIME':
        return '3600';
    }
  },
};
