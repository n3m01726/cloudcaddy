const express = require('express');
const router = express.Router();

const tagsCtrl = require('@controllers/metadata/tags');
const filesCtrl = require('@controllers/metadata/files');
const searchCtrl = require('@controllers/metadata/search');
const statsCtrl = require('@controllers/metadata/stats');

router.put('/:userId/:fileId/tags', tagsCtrl.updateTags);
router.put('/:userId/:fileId', filesCtrl.updateMetadata);
router.get('/:userId/:fileId', filesCtrl.getMetadata);
router.get('/:userId/search', searchCtrl.searchByTags);
router.get('/:userId/tags/popular', tagsCtrl.getPopularTags);
router.get('/:userId/stats', statsCtrl.getStats);
router.delete('/:userId/:fileId', filesCtrl.deleteMetadata);

module.exports = router;
