const ClientError = require('../../exceptions/ClientError');

/* eslint-disable no-underscore-dangle */
class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumsPayload(request.payload);
      const { name, year } = request.payload;
      const albumId = await this._service.addAlbum({ name, year });
      const response = h.response({
        status: 'success',
        data: {
          albumId,
        },
      }).code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
        return response;
      }
      // server error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
      console.log(error.message);
      return response;
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);
      const response = h.response({
        status: 'success',
        data: {
          album,
        },
      }).code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
        return response;
      }
      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
      console.log(error);
      return response;
    }
  }

  async putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumsPayload(request.payload);
      const { id } = request.params;
      const { name, year } = request.payload;
      await this._service.editAlbumById(id, { name, year });
      const response = h.response({
        status: 'success',
        message: 'Berhasil Update Album',
      }).code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
        return response;
      }
      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
      console.log(error);
      return response;
    }
  }
}

module.exports = AlbumsHandler;
