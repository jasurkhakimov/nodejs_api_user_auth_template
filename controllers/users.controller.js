const db = require("../models/index.js");
const Users = db.Users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');


exports.findAll = (req, res) => {
    Users.findAll({
        order: [
            ['status', 'DESC'],
        ],
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Users.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    let user = req.body;

    Users.update(user, {
        where: { ID: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update instance with id=${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating instance with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    if (Number(id) === 1) {
        res.status(400).send({
            message: "Permission denied"
        });
    } else {
        Users.update({ status: 0 }, {
            where: { id: id }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "Instance was deleted successfully!"
                    });
                } else {
                    res.send({
                        message: `Cannot delete instance with id=${id}. Instance was not found!`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Could not delete instance with id=" + id
                });
            });
    }
};


exports.create = (req, res) => {
    // Validate request
    if (!req.body.username && !req.body.password) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    if (String(req.body.password).length < 8) {
        res.status(400).send({
            error: "Password length must be atleast 8 symbols!"
        });
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    // Create a Tutorial
    const user = {
        username: req.body.username,
        password: bcrypt.hashSync(String(req.body.password), salt),
        role: req.body.role ? req.body.role : "",
    };

    // console.log(user);

    // Save Tutorial in the database
    Users.create(user, { fields: ['username', 'password', 'role', 'token'] })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Instance."
            });
        });
};

exports.auth = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(req.body);
    // try {
    let user = await Users.findOne({
        where: {
            username: username
        }
    });

    if (user && user.status != 0) {
        console.log(user);
        if (bcrypt.compareSync(password, user.password)) {

            let token = await user.generateToken(user.ID);
            console.log('before ', user.token);
            user.token = token;
            await user.save();
            console.log('after', user.token);
            res.send(user);
        } else {
            res.status(400).send({
                message: 'Login or password are incorrect'
            })
        }
    } else {
        res.status(400).send({
            message: 'Login or password is incorrect, or your account is disabled'
        })
    }


    // } catch (err) {
    //     console.log(err);
    //     res.status(500).send({
    //         message:
    //             err.message 
    //     });
    // }
};