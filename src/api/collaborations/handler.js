/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator) {
    this._collaborationsService = collaborationsService;
    this._validator = validator;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    autoBind(this);
  }

  async postCollaborationsHandler(request, h) {
    this._validator.validateCollaborationsPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._usersService.checkUser(userId);
    await this._playlistsService.checkPlaylist(playlistId);
    const collaborationId = await this._collaborationsService.addCollaboration(request.payload);
    return h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    }).code(201);
  }

  async deleteCollaborationsHandler(request, h) {
    this._validator.validateCollaborationsPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._usersService.checkUser(userId);
    await this._playlistsService.checkPlaylist(playlistId);
    await this._collaborationsService.deleteCollaborations(request.payload);
    return h.response({
      status: 'success',
      message: 'Berhasil Menghapus Collaborations',
    }).code(200);
  }
}

module.exports = CollaborationsHandler;
