import { mostCommonWords } from "../data/mostCommomWords";

export function makeBlanks(sentence: string): ({ sentence: string, blanks: string[] }) {
    let sentenceArray = sentence.split(/(\s+)/)
    let words = sentenceArray.filter(word => !mostCommonWords.includes(word)).filter(word => word.length > 3)
    let selectedPlaceHolders: number[] = []
    let blanks: string[] = []
    for (let i = 0; i < 4; i++) {
        let r = Math.round(Math.random() * words.length)
        if (selectedPlaceHolders.includes(r)) {
            i--;
            continue;
        }
        selectedPlaceHolders.push(r);
        blanks.push(words[r])
        sentenceArray.forEach((word, wi) => (word == words[r]) ? sentenceArray[wi] = "{" + i + "}" : "")
    }
    return { sentence: sentenceArray.join(""), blanks }

}