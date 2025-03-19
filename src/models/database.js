const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    dateTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    maxAttendees: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    creatorId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    messageId: {
        type: DataTypes.STRING,
    },
    channelId: {
        type: DataTypes.STRING,
    },
});

const Registration = sequelize.define('Registration', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Event.hasMany(Registration);
Registration.belongsTo(Event);

module.exports = {
    sequelize,
    Event,
    Registration,
};
