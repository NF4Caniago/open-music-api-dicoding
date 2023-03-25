const autoBind = require('auto-bind');

/* eslint-disable no-underscore-dangle */
class AlbumsHandler {
  constructor(albumsService, storageService, validator) {
    this._service = albumsService;
    this._storageService = storageService;
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
          coverUrl: album.cover,
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

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    this._validator.validateCoverHeaders(cover.hapi.headers);
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    await this._service.addCoverAlbum(id, `http://${process.env.HOST}:${process.env.PORT}/albums/images/${filename}`);
    return h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    }).code(201);
  }
}

module.exports = AlbumsHandler;
