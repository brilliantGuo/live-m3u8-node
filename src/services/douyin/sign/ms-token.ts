import crypto from 'crypto'

/**
 *
 * @param length
 * @returns
 */
export function getMsToken(length = 107) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytes = crypto.randomBytes(length);
  return Array.from(randomBytes, byte => characters[byte % characters.length]).join('');
}
