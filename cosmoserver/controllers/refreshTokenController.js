const jwt = require('jsonwebtoken');
const dbPool = require('../middleware/dbPool');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({message: 'Cannot fetch new refresh token.'});
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});

    let foundUser = await dbPool.query('SELECT * FROM users WHERE JSON_SEARCH(refreshToken, \'one\', ?, NULL) IS NOT NULL', [refreshToken]);
    foundUser = foundUser[0];

    // Detected refresh token reuse
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403); // Forbidden

                await dbPool.query('UPDATE users SET refreshToken = ? WHERE username = ?', ['[]', decoded.username]); // Hacked user
            }
        );

        return res.sendStatus(403); // Forbidden
    } else {
        const parsedRefreshTokens = JSON.parse(foundUser.refreshToken);
        const permission_flags = JSON.parse(foundUser.permission_flags);

        const newRefreshTokenArray = parsedRefreshTokens.filter(rt => rt !== refreshToken);

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    let insertArray = JSON.stringify([...newRefreshTokenArray]);
                    await dbPool.query('UPDATE users SET refreshToken = ? WHERE username = ?', [insertArray, decoded.username]);
                }
                if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

                // Refresh token was still valid
                const accessToken = jwt.sign(
                    {
                        username: decoded.username,
                        permission_flags: permission_flags
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: '30s'}
                );

                const newRefreshToken = jwt.sign(
                    {username: decoded.username},
                    process.env.REFRESH_TOKEN_SECRET,
                    {expiresIn: '1d'}
                );

                let insertArray = JSON.stringify([...newRefreshTokenArray, newRefreshToken]);
                await dbPool.query('UPDATE users SET refreshToken = ? WHERE username = ?', [insertArray, foundUser.username]);

                res.cookie('jwt', newRefreshToken, {
                    httpOnly: true,
                    sameSite: 'None',
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 24 * 60 * 60 * 1000
                });

                res.json({accessToken})
            }
        );
    }
}

module.exports = {handleRefreshToken}