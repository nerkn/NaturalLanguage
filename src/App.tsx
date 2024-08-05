import "./App.css";
import { Route, Switch } from "wouter";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room"; 
import { Giydir } from "./pages/Giydir";
import { CompoundSentences } from "./pages/CompoundSentences";
import { SubordinatingConjunctions } from "./pages/SubordinatingConjunctions";
import { Synonyms } from "./pages/Synonims";
import { MovieQuotes } from "./pages/MovieQuotes";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/Sentences" component={CompoundSentences} />
        <Route path="/SubordinatingConjunctions" component={SubordinatingConjunctions} />
        <Route path="/game" component={Room} />
        <Route path="/Synonyms" component={Synonyms} />
        <Route path="/MovieQuotes" component={MovieQuotes} />
        <Route path="/Giydir" component={Giydir} /> 
      </Switch>
    </>
  );
}

export default App;
