import { SelectOdd } from "../components/molecules/selectOdd";
import { synonims } from "../data/synonims";

export function Synonyms() {
    const questions = synonims.filter((a,i)=>i<10);

    return <SelectOdd questions={questions} />

}