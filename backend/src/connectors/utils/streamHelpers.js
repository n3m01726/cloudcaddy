const { Readable } = require('stream');

/**
 * Convertit un stream en Buffer
 * @param {Stream} stream - Stream à convertir
 * @returns {Promise<Buffer>}
 */
async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

/**
 * Convertit un Buffer en stream lisible
 * @param {Buffer} buffer - Buffer à convertir
 * @returns {Readable}
 */
function bufferToStream(buffer) {
  return Readable.from(buffer);
}

/**
 * Télécharge un fichier avec gestion de timeout
 * @param {Function} downloadFn - Fonction de téléchargement qui retourne un stream
 * @param {number} timeoutMs - Timeout en millisecondes
 * @returns {Promise<Buffer>}
 */
async function downloadWithTimeout(downloadFn, timeoutMs = 30000) {
  return Promise.race([
    downloadFn(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Download timeout')), timeoutMs)
    )
  ]);
}

module.exports = {
  streamToBuffer,
  bufferToStream,
  downloadWithTimeout
};