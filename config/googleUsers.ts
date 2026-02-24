import googleUsersData from './googleUsers.json';

export interface GoogleUser {
  email: string;
  password: string;
  displayName: string;
  domain: string;
}

export interface GoogleUsersConfig {
  activeUser: GoogleUser;
  testUser: GoogleUser;
  invalidUser: GoogleUser;
}

export function getGoogleUsers(): GoogleUsersConfig {
  return googleUsersData as GoogleUsersConfig;
}

export function getActiveGoogleUser(): GoogleUser {
  return getGoogleUsers().activeUser;
}

export function getTestGoogleUser(): GoogleUser {
  return getGoogleUsers().testUser;
}

export function getInvalidGoogleUser(): GoogleUser {
  return getGoogleUsers().invalidUser;
}