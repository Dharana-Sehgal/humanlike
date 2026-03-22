'use server';

/**
 * @fileOverview Server actions for admin authentication.
 */

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  const correctUsername = process.env.ADMIN_USERNAME;
  const correctPassword = process.env.ADMIN_PASSWORD;

  return username === correctUsername && password === correctPassword;
}
