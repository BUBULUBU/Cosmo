const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dbPool = require('../middleware/dbPool');

const handleLogin = async (req, res) => {
    const cookies = req.cookies;
    const {username, password} = req.body;

    if (!username || !password) return res.sendStatus(400);

    // MAKE SURE TO USE BCRYPT HERE LATER!!!!
    let foundUser = await dbPool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    foundUser = foundUser[0];

    if (foundUser) {
        if (foundUser.status === 'banned') return res.sendStatus(405);

        const permission_flags = JSON.parse(foundUser.permission_flags);
        const parsedRefreshToken = JSON.parse(foundUser.refreshToken);

        const accessToken = jwt.sign(
            {
                username: foundUser.username,
                permission_flags: permission_flags
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '10m'}
        );

        const newRefreshToken = jwt.sign(
            {username: foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );

        let newRefreshTokenArray =
            !cookies?.jwt
                ? parsedRefreshToken
                : parsedRefreshToken.filter(rt => rt !== cookies.jwt);

        if (cookies?.jwt) {
            const refreshToken = cookies.jwt;

            let foundToken = await dbPool.query('SELECT refreshToken FROM users WHERE JSON_SEARCH(refreshToken, \'one\', ?, NULL) IS NOT NULL', [refreshToken]);
            foundToken = foundToken[0];

            if (!foundToken) {
                console.log("Attempted refresh token reuse at login");

                // Clear out all previous refresh tokens
                newRefreshTokenArray = [];
            }

            res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
        }

        // Saving refreshToken with current user
        const insertArray = JSON.stringify([...newRefreshTokenArray, newRefreshToken]);
        await dbPool.query('UPDATE users SET refreshToken = ? WHERE username = ?', [insertArray, foundUser.username]);

        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({accessToken});
    } else {
        res.sendStatus(401);
    }
}

module.exports = {handleLogin}