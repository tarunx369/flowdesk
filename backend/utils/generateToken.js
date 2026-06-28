import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

export const setTokenCookie = (res, token, stayLoggedIn = true) => {
  const maxAge = stayLoggedIn ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
  });
};
