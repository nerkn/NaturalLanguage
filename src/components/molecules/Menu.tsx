import { Link } from "wouter";

export function Menu() {
    return (
        <div className="flex flexChildGrow">

            <Link href="/CompoundSentences">Compound Sentences</Link>
            <Link href="/SubordinatingConjunctions">Subordinating Conjunctions</Link>
            <Link href="/Synonyms">Synonyms</Link>
            <Link href="/MovieQuotes">MovieQuotes</Link>
            <Link href="/Dialogs">Dialogs</Link>
            <Link href="/profile/Progress">Progress</Link>
        </div>)
}