import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import DefaultLayout from "../DefaultLayout";
import { LoginStatus } from "../../context/recoil/atom/user";
import useSetIsLogout from "../../hooks/user/useSetIsLogout";
import { getLS } from "../../utils/localStorage";
import Navbar from "../../components/Navbar/Navbar";
import { userPage } from "../../data/URL/local/user/url";

/**
 * 로그인한 경우 메인페이지로 Redirect 시키는 HOC
 */
export const LogOutOnly = () => {
  const isLogin = useRecoilValue(LoginStatus);
  return !isLogin ? <Outlet /> : <Navigate to={userPage} />;
};

/**
 * 로그인을 하지 않았을 경우 로그인 페이지로 Redirect 시키는 HOC
 */
export const UserOnly = () => {
  const currentLocation = useLocation();
  const setLogout = useSetIsLogout();

  const checkAuth = () => {
    const access = getLS("accessToken");
    const refresh = getLS("refreshToken");
    if (refresh && access) {
      return true;
    } else {
      setLogout();
      return false;
    }
  };
  return checkAuth() ? (
    <Outlet />
  ) : (
    <Navigate state={{ from: currentLocation }} to="/user/login" replace />
  );
};
/** 네비게이션 바가 포함된 레이아웃 HOC */
export const HeaderLayout = () => {
  return (
    <>
      <Navbar />
      <DefaultLayout>
        <Outlet />
      </DefaultLayout>
    </>
  );
};
/** Nested Route 구현을 위해 element에 프롭으로 사용하는 Hoc*/
const NestedLayout = () => {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};

export default NestedLayout;