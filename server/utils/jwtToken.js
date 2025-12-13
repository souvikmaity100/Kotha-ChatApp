import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const token = jwt.sign(
    {
      userId,
    },
    process.env.SECRET_KEY
  );
  return token;
};

export const verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  return decoded;
};
