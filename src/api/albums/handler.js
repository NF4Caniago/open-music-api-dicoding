const autoBind = require('auto-bind');

/* eslint-disable no-underscore-dangle */
class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumsPayload(request.payload);
    const albumId = await this._service.addAlbum(request.payload);
    return h.response({
      status: 'success',
      data: {
        albumId,
      },
    }).code(201);
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const songs = await this._service.getSongsByAlbumId(id);
    return h.response({
      status: 'success',
      data: {
        album: {
          id: album.id,
          name: album.name,
          year: album.year,
          songs,
        },
      },
    }).code(200);
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumsPayload(request.payload);
    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);
    return h.response({
      status: 'success',
      message: 'Berhasil Update Album',
    }).code(200);
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return h.response({
      status: 'success',
      message: 'Berhasil Delete Album',
    }).code(200);
  }
}

module.exports = AlbumsHandler;
