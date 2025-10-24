// backend/src/modules/files/BatchService.js
const { PrismaClient } = require('@prisma/client');
const ProviderFactory = require('@/connectors/base/ProviderFactory');


class BatchService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 🆕 Create a folder and move selected files into it
   */
  async createFolderWithFiles(userId, folderName, provider, fileIds, parentId = 'root') {
    const results = {
      folder: null,
      movedFiles: [],
      errors: []
    };

    try {
      console.log(`📁 Creating folder "${folderName}" in ${provider} for user ${userId}`);
      
      // Get provider instance
      const providerInstance = await ProviderFactory.getProvider(userId, provider);
      
      // Step 1: Create the folder
      const newFolder = await providerInstance.createFolder(folderName, parentId);
      results.folder = newFolder;
      console.log(`✅ Folder created with ID: ${newFolder.id}`);
      
      // Step 2: Move each file
      for (const fileId of fileIds) {
        try {
          console.log(`📦 Moving file ${fileId} to folder ${newFolder.id}`);
          const movedFile = await providerInstance.moveFile(fileId, newFolder.id);
          results.movedFiles.push({
            fileId,
            success: true,
            data: movedFile
          });
        } catch (error) {
          console.error(`❌ Failed to move file ${fileId}:`, error.message);
          results.errors.push({
            fileId,
            error: error.message
          });
        }
      }
      
      console.log(`✅ Batch operation complete: ${results.movedFiles.length}/${fileIds.length} files moved`);
      return results;
    } catch (error) {
      console.error('❌ Batch operation failed:', error);
      throw new Error(`Batch operation failed: ${error.message}`);
    }
  }

  /**
   * 🆕 Copy multiple files to another provider or folder
   */
  async copyMultipleFiles(userId, sourceProvider, destinationProvider, fileIds, destinationFolderId = 'root') {
    const results = {
      copied: [],
      errors: []
    };

    try {
      console.log(`📋 Copying ${fileIds.length} files from ${sourceProvider} to ${destinationProvider}`);
      
      const sourceInstance = await ProviderFactory.getProvider(userId, sourceProvider);
      const destInstance = destinationProvider === sourceProvider 
        ? sourceInstance 
        : await ProviderFactory.getProvider(userId, destinationProvider);

      for (const fileId of fileIds) {
        try {
          // If same provider, just copy
          if (sourceProvider === destinationProvider) {
            const copiedFile = await sourceInstance.copyFile(fileId, destinationFolderId);
            results.copied.push({
              fileId,
              success: true,
              data: copiedFile
            });
          } else {
            // Cross-provider copy: download then upload
            console.log(`🔄 Cross-provider copy: ${sourceProvider} → ${destinationProvider}`);
            
            // Download from source
            const fileStream = await sourceInstance.downloadFile(fileId);
            const fileInfo = await sourceInstance.getFileInfo(fileId);
            
            // Upload to destination
            const uploadedFile = await destInstance.uploadFile(fileStream, destinationFolderId, fileInfo.name);
            
            results.copied.push({
              fileId,
              success: true,
              data: uploadedFile
            });
          }
        } catch (error) {
          console.error(`❌ Failed to copy file ${fileId}:`, error.message);
          results.errors.push({
            fileId,
            error: error.message
          });
        }
      }

      console.log(`✅ Copy complete: ${results.copied.length}/${fileIds.length} files copied`);
      return results;
    } catch (error) {
      console.error('❌ Batch copy failed:', error);
      throw new Error(`Batch copy failed: ${error.message}`);
    }
  }

  /**
   * 🆕 Move multiple files to another folder
   */
  async moveMultipleFiles(userId, provider, fileIds, destinationFolderId) {
    const results = {
      moved: [],
      errors: []
    };

    try {
      console.log(`📦 Moving ${fileIds.length} files to folder ${destinationFolderId}`);
      
      const providerInstance = await ProviderFactory.getProvider(userId, provider);

      for (const fileId of fileIds) {
        try {
          const movedFile = await providerInstance.moveFile(fileId, destinationFolderId);
          results.moved.push({
            fileId,
            success: true,
            data: movedFile
          });
        } catch (error) {
          console.error(`❌ Failed to move file ${fileId}:`, error.message);
          results.errors.push({
            fileId,
            error: error.message
          });
        }
      }

      console.log(`✅ Move complete: ${results.moved.length}/${fileIds.length} files moved`);
      return results;
    } catch (error) {
      console.error('❌ Batch move failed:', error);
      throw new Error(`Batch move failed: ${error.message}`);
    }
  }

  /**
   * 🆕 Delete multiple files
   */
  async deleteMultipleFiles(userId, provider, fileIds) {
    const results = {
      deleted: [],
      errors: []
    };

    try {
      console.log(`🗑️ Deleting ${fileIds.length} files from ${provider}`);
      
      const providerInstance = await ProviderFactory.getProvider(userId, provider);

      for (const fileId of fileIds) {
        try {
          await providerInstance.deleteFile(fileId);
          results.deleted.push(fileId);
          console.log(`✅ Deleted file ${fileId}`);
        } catch (error) {
          console.error(`❌ Failed to delete file ${fileId}:`, error.message);
          results.errors.push({
            fileId,
            error: error.message
          });
        }
      }

      console.log(`✅ Delete complete: ${results.deleted.length}/${fileIds.length} files deleted`);
      return results;
    } catch (error) {
      console.error('❌ Batch delete failed:', error);
      throw new Error(`Batch delete failed: ${error.message}`);
    }
  }

  /**
   * 🆕 Add tags to multiple files (uses MetadataService)
   */
  async addTagsToMultipleFiles(userId, fileIds, tags, provider) {
    const results = {
      updated: [],
      errors: []
    };

    try {
      console.log(`🏷️ Adding tags to ${fileIds.length} files`);
      const MetadataService = require('../metadata/MetadataService');
      const metadataService = new MetadataService();

      for (const fileId of fileIds) {
        try {
          // Get existing metadata
          let metadata = await metadataService.getMetadata(userId, fileId, provider);
          
          if (!metadata) {
            metadata = {
              userId,
              fileId,
              provider,
              tags: [],
              tagColors: {}
            };
          }

          // Merge tags (avoid duplicates)
          const existingTags = metadata.tags || [];
          const newTags = [...new Set([...existingTags, ...tags])];

          // Update metadata
          await metadataService.updateMetadata(userId, fileId, provider, {
            tags: newTags
          });

          results.updated.push({
            fileId,
            success: true,
            tags: newTags
          });
          
          console.log(`✅ Added tags to file ${fileId}`);
        } catch (error) {
          console.error(`❌ Failed to add tags to file ${fileId}:`, error.message);
          results.errors.push({
            fileId,
            error: error.message
          });
        }
      }

      console.log(`✅ Tag update complete: ${results.updated.length}/${fileIds.length} files updated`);
      return results;
    } catch (error) {
      console.error('❌ Batch tag update failed:', error);
      throw new Error(`Batch tag update failed: ${error.message}`);
    }
  }
}

module.exports = BatchService;