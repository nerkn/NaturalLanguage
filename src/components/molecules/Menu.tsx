import { Link } from "wouter";

export function Menu() {
    return (
        <div className="flex flexChildGrow">

            <Link href="/CompoundSentences">Compound Sentences</Link>
            <Link href="/SubordinatingConjunctions">Subordinating Conjunctions</Link>
            <Link href="/Synonyms">Synonyms</Link>
            <Link href="/MovieQuotes">MovieQuotes</Link>
        </div>)
}