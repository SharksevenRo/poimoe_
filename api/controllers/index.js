var models = require('../models/index');
var util = require('../util/index');
var userCtrl = require('./UserController');
var tagsCtrl = require('./TagsController');
var settingsCtrl = require('./SettingsController');
var relationsCtrl = require('./RelationsController');
var replysCtrl = require('./ReplysController');
var themesCtrl = require('./ThemesController');
var userGroupsCtrl = require('./UserGroupsController');
var timelineCtrl = require('./TimelineController');
var kakuCtrl = require('./KakuController');
var authCtrl = require('./AuthController');

var db = {
  mongoose: undefined
};

module.exports = {

	init: function(mongo) {
		db.mongoose = mongo;
  		models.init(db.mongoose);
	},

	userCtrl: userCtrl.init(models),

	tagsCtrl: tagsCtrl.init(models),

	settingsCtrl: settingsCtrl.init(models),

	relationsCtrl: relationsCtrl.init(models),

	themesCtrl: themesCtrl.init(models),

	replysCtrl: replysCtrl.init(models),

	userGroupsCtrl: userGroupsCtrl.init(models),

	timelineCtrl: timelineCtrl.init(models),

	kakuCtrl: kakuCtrl.init(models),

	authCtrl: authCtrl.init(models)

};
