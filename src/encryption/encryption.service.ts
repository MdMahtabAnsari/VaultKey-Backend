import { Injectable } from '@nestjs/common';
import {
  createCipheriv,
  randomBytes,
  scrypt,
  createDecipheriv,
} from 'node:crypto';
import { promisify } from 'node:util';

@Injectable()
export class EncryptionService {
  /**
   * Encrypts plain text using AES-256-GCM
   * @param plainText - The text to encrypt
   * @param masterKey - The master password/key
   * @returns Base64 encoded string containing IV, auth tag, and encrypted data
   */
  async encryptAES256GCM(
    plainText: string,
    masterKey: string,
  ): Promise<string> {
    const iv = randomBytes(12); // 12 bytes for GCM
    const salt = randomBytes(32); // Random salt for each encryption
    const key = (await promisify(scrypt)(masterKey, salt, 32)) as Buffer;

    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(plainText, 'utf8'),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    // Combine: salt + iv + tag + encrypted data
    return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
  }

  /**
   * Decrypts encrypted text using AES-256-GCM
   * @param cipherText - Base64 encoded encrypted string
   * @param masterKey - The master password/key
   * @returns Decrypted plain text
   */
  async decryptAES256GCM(
    cipherText: string,
    masterKey: string,
  ): Promise<string> {
    const data = Buffer.from(cipherText, 'base64');

    // Extract components
    const salt = data.subarray(0, 32);
    const iv = data.subarray(32, 44); // 32 + 12
    const tag = data.subarray(44, 60); // 44 + 16
    const encrypted = data.subarray(60);

    // Derive key from master key and salt
    const key = (await promisify(scrypt)(masterKey, salt, 32)) as Buffer;

    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }

  /**
   * Encrypts plain text using AES-256-CTR (simpler, but less secure than GCM)
   * @param plainText - The text to encrypt
   * @param masterKey - The master password/key
   * @returns Base64 encoded string containing IV and encrypted data
   */
  async encryptAES256CTR(
    plainText: string,
    masterKey: string,
  ): Promise<string> {
    const iv = randomBytes(16); // 16 bytes for CTR
    const salt = randomBytes(32);
    const key = (await promisify(scrypt)(masterKey, salt, 32)) as Buffer;

    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(plainText, 'utf8'),
      cipher.final(),
    ]);

    // Combine: salt + iv + encrypted data
    return Buffer.concat([salt, iv, encrypted]).toString('base64');
  }

  /**
   * Decrypts encrypted text using AES-256-CTR
   * @param cipherText - Base64 encoded encrypted string
   * @param masterKey - The master password/key
   * @returns Decrypted plain text
   */
  async decryptAES256CTR(
    cipherText: string,
    masterKey: string,
  ): Promise<string> {
    const data = Buffer.from(cipherText, 'base64');

    // Extract components
    const salt = data.subarray(0, 32);
    const iv = data.subarray(32, 48); // 32 + 16
    const encrypted = data.subarray(48);

    // Derive key from master key and salt
    const key = (await promisify(scrypt)(masterKey, salt, 32)) as Buffer;

    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }
}
