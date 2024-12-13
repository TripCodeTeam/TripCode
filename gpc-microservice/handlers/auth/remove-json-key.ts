import * as fs from 'fs/promises';
import * as path from 'path';

interface resMessage {
    success: boolean
    message: string
}

export async function DeleteServiceAccountKeyFile(keyFilePath: string): Promise<resMessage> {
  try {
    // Verificar si el archivo existe antes de intentar eliminarlo
    const resolvedPath = path.resolve(keyFilePath);
    await fs.access(resolvedPath);

    // Eliminar el archivo
    await fs.unlink(resolvedPath);

    return { success: true, message: `Key file "${resolvedPath}" has been successfully deleted.` };
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Key file "${keyFilePath}" does not exist.`);
    }
    throw new Error(`Failed to delete key file "${keyFilePath}": ${error.message}`);
  }
}
