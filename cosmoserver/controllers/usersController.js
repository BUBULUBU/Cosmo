const dbPool = require('../middleware/dbPool');

const getAllUsers = async (req, res) => {
    const results = await dbPool.query("SELECT id, username, permission_flags, status FROM users");

    if (results <= 0) return res.status(204).json({message: 'No users found'});

    res.json(results);
}

const createNewUser = async (req, res) => {
    if (!req?.body?.username || !req?.body?.password) return res.status(400).json({message: 'Username and password is required'});

    try {
        const result = await dbPool.query("INSERT INTO users (id, username, password) VALUES (UUID_SHORT(), ?, ?);", [req.body.username, req.body.password]);

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({message: 'ID parameter is required'});
    if (!req?.body?.username) return res.status(400).json({message: 'Username parameter is required'});
    if (!req?.body?.permission_flags) return res.status(400).json({message: 'Permission Flags parameter is required'});
    if (!req?.body?.status) return res.status(400).json({message: 'Status parameter is required'});

    let user = await dbPool.query("SELECT * FROM users WHERE id = ?", [req.body.id]);
    user = user[0];

    if (!user) {
        return res.status(400).json({"message": `No User matches ID ${req.body.id}`});
    }

    const result = await dbPool.query("UPDATE users SET username = ?, permission_flags = ?, status = ? WHERE id = ?", [req.body.username, req.body.permission_flags, req.body.status, req.body.id]);

    res.json(result);
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({message: 'User ID required'});

    const result = await dbPool.query("DELETE FROM users WHERE id = ?", [req.body.id]);

    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({message: 'User ID required'});

    let user = await dbPool.query("SELECT username, permission_flags, status FROM users WHERE id = ?", [req.params.id]);
    user = user[0];

    if (!user) return res.status(204).json({message: `No User matches ID ${req.body.id}`});

    user.permission_flags = JSON.parse(user.permission_flags);

    res.json(user);
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser
}