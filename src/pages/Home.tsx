import { Link } from "wouter";

export function Home() {
  return (
    <div className="flex flexChildGrow">
      <Link href="/game?roomid=12">Enter Room </Link>
      <Link href="/sentences">Sentences</Link>
      <Link href="/SubordinatingConjunctions">Subordinating Conjunctions</Link>
      <Link href="/Synonyms">Synonyms</Link>
      <Link href="/MovieQuotes">MovieQuotes</Link>
      <Link href="/GiydirTs">GiydirTs</Link>
    </div>
  );
}
