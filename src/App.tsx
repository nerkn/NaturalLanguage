import "./App.css";
import { Route, Switch } from "wouter";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/game" component={Room} />
      </Switch>
    </>
  );
}

export default App;
