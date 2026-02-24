import { readFileSync } from 'fs';
import { join } from 'path';

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

function loadGoogleUsers(): GoogleUsersConfig {
  try {
    const jsonPath = join(__dirname, 'googleUsers.json');
    const jsonContent = readFileSync(jsonPath, 'utf-8');
    return JSON.parse(jsonContent) as GoogleUsersConfig;
  } catch (error) {
    console.error('Failed to load Google users configuration:', error);
    throw new Error('Google users configuration not found. Please ensure googleUsers.json exists.');
  }
}

export function getGoogleUsers(): GoogleUsersConfig {
  return loadGoogleUsers();
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