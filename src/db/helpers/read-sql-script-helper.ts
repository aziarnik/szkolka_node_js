import { readFile } from 'fs/promises';
import * as path from 'path';

export async function readSqlFileText(fileName: string): Promise<string> {
  const filePath = path.join(
    path.dirname(require.main?.filename as string),
    'db',
    'scripts',
    fileName
  );
  const text = await readFile(filePath);
  return text.toString('utf8');
}
