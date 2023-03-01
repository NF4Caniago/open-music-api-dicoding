const autoBind = require('auto-bind');

/* eslint-disable no-underscore-dangle */
class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongsPayload(request.payload);
    const songId = await this._service.addSong(request.payload);
    return h.response({
      status: 'success',
      data: {
        songId,
      },
    }).code(201);
  }

  async getSongsHandler(request, h) {
    const songs = await this._service.getSongs(request.query);
    return h.response({
      status: 'success',
      data: {
        songs,
      },
    }).code(200);
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return h.response({
      status: 'success',
      data: {
        song,
      },
    }).code(200);
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongsPayload(request.payload);
    const { id } = request.params;
    await this._service.editSongById(id, request.payload);
    return h.response({
      status: 'success',
      message: 'Song Berhasil Update',
    }).code(200);
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return h.response({
      status: 'success',
      message: 'Songs Berhasil di Delete',
    }).code(200);
  }
}

module.exports = SongsHandler;
