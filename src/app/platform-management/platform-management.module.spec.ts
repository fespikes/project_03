import { PlatformManagementModule } from './platform-management.module';

describe('PlatformManagementModule', () => {
  let platformManagementModule: PlatformManagementModule;

  beforeEach(() => {
    platformManagementModule = new PlatformManagementModule();
  });

  it('should create an instance', () => {
    expect(platformManagementModule).toBeTruthy();
  });
});
