const jwt = require("jsonwebtoken");

module.exports = (sequelize, Sequelize) => {
	const Users = sequelize.define("Users", {
		ID: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		username: {
			type: Sequelize.STRING,
			unique: true
		},
		role: {
			type: Sequelize.STRING
		},
		password: {
			type: Sequelize.STRING
		},
		token: {
			type: Sequelize.STRING
		},
		status: {
			type: Sequelize.INTEGER,
			defaultValue: 1
		}
	},
		{
			timestamps: false,
			createdAt: false,
			updatedAt: false,
		});

	Users.prototype.generateToken = function (id) {
		const token = jwt.sign({ ID: id }, process.env.JWTPRIVATEKEY);
		return token;
	};


	return Users;
}
