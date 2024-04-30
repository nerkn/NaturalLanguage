import "./App.css";
import { Route, Switch } from "wouter";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";
import { GiydirTs } from "./pages/GiydirTs";
import { Giydir } from "./pages/Giydir";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/game" component={Room} />
        <Route path="/Giydir" component={Giydir} />
        <Route path="/GiydirTs" component={GiydirTs} />
      </Switch>
    </>
  );
}

export default App;
