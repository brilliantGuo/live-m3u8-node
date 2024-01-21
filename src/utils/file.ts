import fs from 'fs-extra';
import { exec } from 'child_process';
import { logger } from '@/core/logger';

const fsp = fs.promises;

/**
 * 检查文件或者文件夹都有效，存在则返回 true
 *
 * @param path 文件或者文件夹的路径
 * @returns {boolean} 文件或文件夹是否存在
 */
export async function isExists(path: string): Promise<boolean> {
  try {
    await fs.access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 读文件封装
 * @param path 文件路径
 * @returns 文件内容
 */
export async function readFile(path: string): Promise<string> {
  try {
    return await fsp.readFile(path, 'utf-8');
  } catch (error) {
    logger.warn('Util.System.readFile error', error);
  }

  return '';
}

/**
 * 写文件封装
 * @param path 文件路径
 * @returns 文件内容
 */
export async function writeFile(path: string, data: string) {
  try {
    await fsp.writeFile(path, data, 'utf-8');
  } catch (error) {
    logger.warn('Util.System.writeFile error', error);
  }
}

/**
 * 递归删除文件夹
 * @param {string} path 需要删除的文件夹路径
 */
export async function delDir(path: string) {
  try {
    const isDirExist = await isExists(path);
    if (!isDirExist) return;

    const files = await fsp.readdir(path);
    // 删除文件夹下的所有内容
    await Promise.all(files.map((file) => {
      const curPath = `${path}/${file}`;
      return fsp.stat(curPath).then((stat) => {
        if (stat.isDirectory()) {
          return delDir(curPath); // 递归删除文件夹
        }
        return fsp.unlink(curPath); // 删除文件
      });
    }));

    // 文件夹里面的内容删除完，才能删除这个文件夹
    await fsp.rmdir(path);
  } catch (error) {
    logger.warn('Util.System.delDir error', error);
    return;
  }
}

const WHITE_COMMAND_LIST: RegExp[] = [/^(tnpm)|(npm)|(yarn)|(cd)|(cp)/];
/**
 * 对接 unix 命令，将执行结果 Promise 化
 */
export const execPromise = (command: string) => new Promise<string>((resovle, reject) => {
  const isValid = WHITE_COMMAND_LIST.some((regExp: RegExp) => regExp.test(command));
  if (!isValid) {
    return reject(new Error(`${command} is not in whitelist`));
  }
  exec(command, (error, stdout, stderr) => {
    if (error) {
      logger.warn('Util.System.execPromise error', error);
      logger.warn('Util.System.execPromise stderr', stderr);
      reject(error);
    } else {
      resovle(stdout);
    }
  });
});

