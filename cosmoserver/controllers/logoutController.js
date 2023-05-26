const jwt = require('jsonwebtoken');
const dbPool = require("../middleware/dbPool");

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    const refreshToken = cookies.jwt;

    let foundUser = await dbPool.query('SELECT * FROM users WHERE JSON_SEARCH(refreshToken, \'one\', ?, NULL) IS NOT NULL', [refreshToken]);
    foundUser = foundUser[0];

    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
        return res.sendStatus(204);
    }

    const parsedRefreshToken = JSON.parse(foundUser.refreshToken);
    const token = parsedRefreshToken.filter(rt => rt !== refreshToken);

    await dbPool.query('UPDATE users SET refreshToken = ? WHERE username = ?', [JSON.stringify(token), foundUser.username]);

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.sendStatus(200);
}

module.exports = {handleLogout}