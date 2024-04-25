import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { copen, sbopen } from '../actions';
import SettingBox from './SettingBox';

export default function MenuPopupState() {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userData);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSettingsClick = () => {
    dispatch(sbopen());
    setMenuOpen(false);
  };

  const handleLogoutClick = () => {
    dispatch(copen('log out'));
    setMenuOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={toggleMenu}>
        <img
          src={userData.logo}
          alt="User Avatar"
          style={{ borderRadius: "50%", height: "20px", width: "20px" }}
        />
        {userData.name}
      </button>
      {menuOpen && (
        <div className="absolute z-10 mt-1 w-40 bg-white rounded shadow-lg">
          <ul>
            <li onClick={handleSettingsClick} className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
              Settings
            </li>
            <li onClick={handleLogoutClick} className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
              Log out
            </li>
          </ul>
        </div>
      )}
      <SettingBox />
    </div>
  );
}
