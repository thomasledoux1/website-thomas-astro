import { jwtDecrypt, base64url, EncryptJWT } from "jose";
async function encryptJWT(payload, expirationTime, secret) {
  return new EncryptJWT(payload)
    .setExpirationTime(expirationTime)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .encrypt(base64url.decode(secret));
}
async function decryptJWT(cookie, verify, secret) {
  if (typeof cookie !== "string") return;
  try {
    const { payload } = await jwtDecrypt(cookie, base64url.decode(secret));
    const decoded = payload;
    if (!verify || verify(decoded)) {
      delete decoded.iat;
      delete decoded.exp;
      return decoded;
    }
  } catch {}
}

// src/index.ts
function safeJsonStringify(value, replacer, space) {
  return JSON.stringify(value, replacer, space).replace(/</g, "\\u003c");
}
async function encrypt(
  value,
  secret = ((_a) =>
    (_a = process == null ? void 0 : import.meta.env) == null
      ? void 0
      : _a.FLAGS_SECRET)(),
) {
  if (!secret) throw new Error("Missing FLAGS_SECRET");
  return encryptJWT({ c: value }, "1y", secret);
}
async function decrypt(
  encryptedData,
  secret = ((_a) =>
    (_a = process == null ? void 0 : import.meta.env) == null
      ? void 0
      : _a.FLAGS_SECRET)(),
) {
  if (!secret) throw new Error("Missing FLAGS_SECRET");
  const content = await decryptJWT(encryptedData, null, secret);
  return content == null ? void 0 : content.c;
}
async function verifyAccess(
  authHeader,
  secret = ((_a) =>
    (_a = process == null ? void 0 : import.meta.env) == null
      ? void 0
      : _a.FLAGS_SECRET)(),
) {
  if (!authHeader) return false;
  const data = await decrypt(
    authHeader == null ? void 0 : authHeader.replace(/^Bearer /i, ""),
    secret,
  );
  return data !== void 0;
}

export { safeJsonStringify, encrypt, decrypt, verifyAccess };
