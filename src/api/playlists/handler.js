/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._service.addPlaylist(credentialId, request.payload);
    return h.response({
      status: 'success',
      data: {
        playlistId,
      },
    }).code(201);
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    return h.response({
      status: 'success',
      data: {
        playlists,
      },
    }).code(200);
  }

  async deletePlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylist(id);
    return h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    }).code(200);
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validateSongOnPlaylistPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.addSongToPlaylist(id, request.payload);
    return h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan ke Playlist',
    }).code(201);
  }

  async getSongsPlaylistHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(id, credentialId);
    const playlistInformation = await this._service.getPlaylistInformation(id);
    const songs = await this._service.getSongsPlaylist(id);
    return h.response({
      status: 'success',
      data: {
        playlist: {
          id: playlistInformation.id,
          name: playlistInformation.name,
          username: playlistInformation.username,
          songs,
        },
      },
    }).code(200);
  }

  async deleteSongFromPlaylistHandler(request, h) {
    this._validator.validateSongOnPlaylistPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deleteSongFromPlaylist(id, request.payload);
    return h.response({
      status: 'success',
      message: 'Berhasil Menghapus Song dari playlist',
    }).code(200);
  }
}

module.exports = PlaylistsHandler;
