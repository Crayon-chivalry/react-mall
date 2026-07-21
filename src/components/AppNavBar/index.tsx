import { useNavigate } from "react-router-dom";
import styles from './index.module.scss'

import { NavBar } from "antd-mobile";

type AppNavBarProps = {
  title: string;
};

const AppNavBar = ({ title }: AppNavBarProps) => {
  const navigate = useNavigate()

  const onBack = () => {
    navigate(-1)
  }

  return (
    <NavBar className={styles["nav-bar"]} onBack={onBack}>
      { title }
    </NavBar>
  )
}

export default AppNavBar;