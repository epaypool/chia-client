import { readFileSync } from 'fs';
import { homedir } from 'os';
import { resolve } from 'path';
import { parse } from 'yaml';
import { ChiaConfig } from './types/ChiaConfig';

let chiaRootPath = '';

export const getChiaRootPath = (rootPath?: string): string => {
  if (chiaRootPath) return chiaRootPath;

  chiaRootPath = resolve(homedir(), rootPath || process.env['CHIA_ROOT'] || '.chia/mainnet');

  return chiaRootPath;
};

export const getChiaConfig = (rootPath?: string): ChiaConfig => {
  const configFilePath = rootPath
    ? resolve(rootPath, 'config', 'config.yaml')
    : resolve(getChiaRootPath(rootPath), 'config', 'config.yaml');
  const f = readFileSync(configFilePath, 'utf8');
  const result = parse(f);
  return result as ChiaConfig;
};

export const getChiaFilePath = (relativePath: string, rootPath?: string): string => {
  return rootPath ? resolve(rootPath, relativePath) : resolve(getChiaRootPath(), relativePath);
};
