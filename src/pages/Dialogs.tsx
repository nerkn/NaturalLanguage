import { useState } from "react";
import { DialogTree } from "../components/molecules/DialogTree";
import canteenChat from "../data/dialogs/canteenChat"

function DialogLoad(){
	
}

export function Dialogs() {
    const [dialogs, dialogsSet] = useState<DialogTree>(canteenChat)
	

    return <DialogTree dialogs={dialogs} />
}