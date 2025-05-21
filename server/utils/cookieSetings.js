export const generateToken = (res, tokenValue, days) => {
    if (!res || !tokenValue) {
        throw new Error("Требуются параметры res и tokenValue");
    }

    res.cookie("sessionId", tokenValue, {
        maxAge: days * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        path: "/"
    })
}