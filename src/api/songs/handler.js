const ClientError = require('../../exceptions/ClientError');

/* eslint-disable no-underscore-dangle */
class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    // this.getSongsByIdHandler = this.getSongsByIdHandler.bind(this);
    // this.putSongsByIdHandler = this.putSongsByIdHandler.bind(this);
    // this.deleteSongsByIdHandler = this.deleteSongsByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongsPayload(request.payload);
      const {
        title, year, genre, performer, duration, albumId,
      } = request.payload;
      const songId = await this._service.addSong({
        title, year, genre, performer, duration, albumId,
      });
      const response = h.response({
        status: 'success',
        data: {
          songId,
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

  async getSongsHandler(request, h) {
    try {
      const songs = await this._service.getSongs();
      const response = h.response({
        status: 'success',
        data: {
          songs,
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
      // server error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
      console.log(error.message);
      return response;
    }
  }

  // async getSongsByIdHandler(request, h) {}

  // async putSongsByIdHandler(request, h) {}

  // async deleteSongsByIdHandler(request, h) {}
}

module.exports = SongsHandler;
