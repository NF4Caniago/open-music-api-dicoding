const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapSongsToDBModel } = require('../../utils');

/* eslint-disable no-underscore-dangle */
class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Album Gagal Ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak Ditemukan');
    }
    return result.rows[0];
  }

  async getSongsByAlbumId(albumId) {
    const query = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapSongsToDBModel);
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async addCoverAlbum(id, imagePath) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [imagePath, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async checkAlbum(id) {
    const query = {
      text: 'SELECT * from albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async addLikeDislikeAlbum(albumId, userId) {
    let like = 'like';
    const queryCheckLike = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const resultCheckLike = await this._pool.query(queryCheckLike);
    if (resultCheckLike.rowCount) {
      const queryDeleteLike = {
        text: 'DELETE FROM user_album_likes WHERE id = $1',
        values: [resultCheckLike.rows[0].id],
      };
      await this._pool.query(queryDeleteLike);
      like = 'dislike';
    } else {
      const id = `album-like-${nanoid(16)}`;
      const queryAddLike = {
        text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
        values: [id, userId, albumId],
      };

      const result = await this._pool.query(queryAddLike);
      if (!result.rows[0].id) {
        throw new InvariantError('Album Gagal Ditambahkan');
      }
    }
    return like;
  }

  async getLikes(id) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rowCount;
  }
}

module.exports = AlbumsService;
