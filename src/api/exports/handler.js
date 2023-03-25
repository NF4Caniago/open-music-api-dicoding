/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(exportsService, playlistsService, validator) {
    this._service = exportsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);
    console.log('lolos validator');
    const { playlistId } = request.params;
    await this._playlistsService.verifyPlaylistOwner(playlistId, request.auth.credentials.id);
    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };
    await this._service.sendMessage('export:playlist', JSON.stringify(message));
    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    }).code(201);
  }
}

module.exports = ExportsHandler;
