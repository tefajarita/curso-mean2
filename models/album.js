'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
      title: String,
      description: String,
      year: String,
      image: String,
      artist: { type: Schema.Types.ObjectId , ref:'Artist'}
});

module.exports = mongoose.model('Album',AlbumSchema);
