import { c32ToB58 } from "c32check";
export function isAddress(user) {
  try {
    const b58Address = c32ToB58(user);
    console.log("address detected", user, b58Address);
    return true;
  } catch (e) {
    console.log("address NOT detected", user, e);
    return false;
  }
}
