module.exports = {
  list: require('./list'),
  search: require('./search'),
  starred: require('./starred'),
  metadata: require('./metadata'),
  preview: require('./preview'),
  thumbnail: require('./thumbnail'),
  move: require('./move'),
  copy: require('./copy'),
  download: require('./download'),
  delete: require('./delete'),
  bulk: {
    createFolder: require('./bulk').createFolder,
    copy: require('./bulk').copy,
    move: require('./bulk').move,
    delete: require('./bulk').delete,
    tag: require('./bulk').tag,
  },
};
