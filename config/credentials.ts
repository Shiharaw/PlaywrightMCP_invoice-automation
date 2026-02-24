import fs from 'fs';
import path from 'path';

export type TestUser = {
  email: string;
  password: string;
};

export function getCredentials(userKey = 'default'): TestUser {
  const envEmail = process.env.TEST_USER_EMAIL;
  const envPassword = process.env.TEST_USER_PASSWORD;
  if (envEmail && envPassword) {
    return { email: envEmail, password: envPassword };
  }

  const cfgPath = path.resolve(__dirname, 'credentials.local.json');
  if (fs.existsSync(cfgPath)) {
    try {
      const raw = fs.readFileSync(cfgPath, 'utf8');
      const json = JSON.parse(raw);
      const user = json[userKey];
      if (user && user.email && user.password) return { email: user.email, password: user.password };
    } catch (e) {
      throw new Error(`Failed to read or parse ${cfgPath}: ${e}`);
    }
  }

  throw new Error(
    'Test credentials not found. Set TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables, or create config/credentials.local.json with {"default": {"email":"...","password":"..."}}'
  );
}