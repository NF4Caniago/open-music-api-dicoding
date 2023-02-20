/* eslint-disable import/no-extraneous-dependencies */
const Joi = require('joi');

const AlbumsPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

const SongsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.string().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

module.exports = { AlbumsPayloadSchema, SongsPayloadSchema };
