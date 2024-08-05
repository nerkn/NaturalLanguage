import { MatchMaking } from "../components/molecules/MatchMaking"
import { MovieQuotesDB } from "../data/movieQuotes"
import { randomizeElems } from "../lib/randomizeElems"

export function MovieQuotes() {
    const quotes: typeof MovieQuotesDB = randomizeElems(MovieQuotesDB).filter((mq, i) => i < 5)
    let arr= quotes.map((a)=>({left:a.name , right:a.quote, extra:0 }))

    return <MatchMaking arr={arr} />
}