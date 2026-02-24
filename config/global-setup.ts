import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Google Sign-In Test Suite Setup');
  console.log('===========================================');
  
  // Validate required environment variables
  const baseUrl = process.env.BASE_URL || 'https://invoicedesk.siyothsoft.com';
  console.log(`🌐 Base URL: ${baseUrl}`);
  
  // Validate Google OAuth configuration
  try {
    // Check if Google users configuration is available
    const { getActiveGoogleUser } = await import('./googleUsersLoader.js');
    const activeUser = getActiveGoogleUser();
    console.log(`✅ Google users configuration loaded`);
    console.log(`👤 Active user: ${activeUser.email}`);
    console.log(`🏢 User domain: ${activeUser.domain}`);
  } catch (error) {
    console.error('❌ Failed to load Google users configuration:', error);
    throw new Error('Google users configuration not found. Please ensure googleUsers.json exists.');
  }
  
  // Validate test environment
  console.log('🔧 Environment validation:');
  console.log(`   - Node.js version: ${process.version}`);
  console.log(`   - Test environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   - CI environment: ${process.env.CI ? 'Yes' : 'No'}`);
  
  // OAuth-specific setup
  console.log('🔐 OAuth configuration:');
  console.log('   - OAuth flow: Redirect-based authentication');
  console.log('   - Security: HTTPS required for all OAuth requests');
  console.log('   - Timeout: Extended timeouts configured for OAuth flows');
  
  // Performance baseline
  console.log('⚡ Performance baselines:');
  console.log('   - OAuth redirect: < 5 seconds');
  console.log('   - Email processing: < 10 seconds');
  console.log('   - Full flow completion: < 2 minutes');
  
  console.log('✨ Setup completed successfully');
  console.log('===========================================');
}

export default globalSetup;