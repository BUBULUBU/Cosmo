const masterFlags = [
    "FLAG_ADMIN"
]

const verifyFlags = (...allowedFlags) => {
    return (req, res, next) => {
        if (!req?.permission_flags) return res.sendStatus(401);

        const flagsArray = [...allowedFlags, ...masterFlags];

        const result = req.permission_flags.map(flag => flagsArray.includes(flag)).find(value => value === true);

        if (!result) return res.sendStatus(401);

        next();
    }
}

module.exports = verifyFlags