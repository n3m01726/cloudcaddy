import { filesService } from '@core/services/api';

export async function handleMove(userId, file, folder, onSuccess, onError) {
  try {
    const res = await filesService.moveFile(userId, file.provider, file.id, folder.id, { oldParentId: file.parents?.[0] });
    if (res.success) onSuccess?.('move', res.result);
    else onError?.(res.error || 'Erreur lors du déplacement');
  } catch (err) {
    onError?.(err.message);
  }
}

export async function handleCopy(userId, file, folder, onSuccess, onError) {
  try {
    const res = await filesService.copyFile(userId, file.provider, file.id, folder.id, {});
    if (res.success) onSuccess?.('copy', res.result);
    else onError?.(res.error || 'Erreur lors de la copie');
  } catch (err) {
    onError?.(err.message);
  }
}

export async function handleDelete(userId, file, onSuccess, onError) {
  try {
    const res = await filesService.deleteFile(userId, file.provider, file.id);
    if (res.success) onSuccess?.('delete', res.result);
    else onError?.(res.error || 'Erreur lors de la suppression');
  } catch (err) {
    onError?.(err.message);
  }
}
