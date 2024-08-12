


import useProgressStore from "../lib/stores/progress";

export function Progress() {
    const progress = useProgressStore();

    return <div>{progress.progress.map(p => <div>
        <div>{p.modulename}</div>
        <div>{p.identifier}</div>
        <div>{p.id2}</div>
        <div>{p.favorites}</div>
        <div>{p.askme}</div>
    </div>)}</div>



}

