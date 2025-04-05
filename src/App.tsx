

import dpsLogo from "./assets/DPS.svg";
import "./App.css";
import { BackgroundPattern } from "./component/BackgroundPattern";
import { UserProvider } from "./context/UserContext";
import UserDirectory from "./component/UserDirectory";

function App(): JSX.Element {
  return (
    <UserProvider>
      <div>
        <a href="https://www.digitalproductschool.io/" target="_blank">
          <img src={dpsLogo} className="logo" alt="DPS logo" />
        </a>
      </div>
      <div className="home-card">
        <UserDirectory />
        <BackgroundPattern/>
      </div>
    </UserProvider>
  );
}

export default App;
