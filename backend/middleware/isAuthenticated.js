import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "user not authenticated" });
        };
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded);
        if (!decoded) {
            return res.status(401).json({ message: "invalid token" });
        };
        req.Id = decoded.userId;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error" });
    }
};

export default isAuthenticated;


