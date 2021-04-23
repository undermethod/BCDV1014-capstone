import Rinx from "./components/Rinx";
import { NotificationContainer } from "react-notifications";
import 'react-notifications/lib/notifications.css';
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Rinx Blockchain Betting Pools</h1>
      <Rinx />
      <NotificationContainer />
    </div>
  );
}

export default App;