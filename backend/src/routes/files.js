const express = require('express');
const { tokenRefreshMiddleware } = require('@core/middlewares/tokenRefresh');
const filesController = require('@controllers/files');

const router = express.Router();
router.use(tokenRefreshMiddleware);

// Routes principales
router.get('/:userId', filesController.list);
router.get('/:userId/search', filesController.search);
router.get('/:userId/starred', filesController.starred);
router.get('/:userId/metadata/:provider/:fileId', filesController.metadata);
router.get('/:userId/preview/:provider/:fileId', filesController.preview);
router.get('/:userId/thumbnail/:provider/:fileId', filesController.thumbnail);

// Actions fichiers
router.post('/:userId/move', filesController.move);
router.post('/:userId/copy', filesController.copy);
router.post('/:userId/download', filesController.download);
router.delete('/:userId/:provider/:fileId', filesController.delete);

// Actions groupées
router.post('/create-folder', filesController.bulk.createFolder);
router.post('/bulk-copy', filesController.bulk.copy);
router.post('/bulk-move', filesController.bulk.move);
router.post('/bulk-delete', filesController.bulk.delete);
router.post('/bulk-tag', filesController.bulk.tag);

module.exports = router;
