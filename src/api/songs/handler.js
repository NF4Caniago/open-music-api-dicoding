/* eslint-disable no-underscore-dangle */
class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postSongsHandler = this.postSongsHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongsByIdHandler = this.getSongsByIdHandler.bind(this);
    this.putSongsByIdHandler = this.putSongsByIdHandler.bind(this);
    this.deleteSongsByIdHandler = this.deleteSongsByIdHandler.bind(this);
  }

  // async postSongsHandler(request, h) {}

  // async getSongsHandler(request, h) {}

  // async getSongsByIdHandler(request, h) {}

  // async putSongsByIdHandler(request, h) {}

  // async deleteSongsByIdHandler(request, h) {}
}

module.exports = SongsHandler;
