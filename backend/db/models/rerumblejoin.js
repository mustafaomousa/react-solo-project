'use strict';
module.exports = (sequelize, DataTypes) => {
  const RerumbleJoin = sequelize.define('RerumbleJoin', {
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {});
  RerumbleJoin.associate = function (models) {
  };
  return RerumbleJoin;
};