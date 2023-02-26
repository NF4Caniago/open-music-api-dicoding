const ClientError = require('../../exceptions/ClientError');

/* eslint-disable no-underscore-dangle */
class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
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
      const { title, performer } = request.query;
      const songs = await this._service.getSongs(title, performer);
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

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      const response = h.response({
        status: 'success',
        data: {
          song,
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

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongsPayload(request.payload);
      const { id } = request.params;
      const {
        title, year, genre, performer, duration, albumId,
      } = request.payload;
      await this._service.editSongById(id, {
        title, year, genre, performer, duration, albumId,
      });
      const response = h.response({
        status: 'success',
        message: 'Song Berhasil Update',
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

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);
      const response = h.response({
        status: 'success',
        message: 'Songs Berhasil di Delete',
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
}

module.exports = SongsHandler;
