import { userSession } from "../pages/_app";

export const UserAuth = ({ username, addr }) => {
  const handleLogout = () => {
    userSession.signUserOut("/");
  };

  return (
    <div>
      <button onClick={handleLogout}>
        {username || truncate(addr)} - Logout
      </button>
    </div>
  );
};

function truncate(str) {
  return str.length > 8
    ? `${str.substr(0, 4)}..${str.substr(str.length - 4)}`
    : str;
}
