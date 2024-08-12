import React, { useState } from "react";


export const DialogTree: React.FC<{ dialogs: DialogOption[]}> = ({ dialogs }) => {
    const [pastDialogs, setPastDialogs] = useState<DialogOption[]>([]);
    const [currentDialog, setCurrentDialog] = useState<DialogOption>(dialogs[0]);

    const handleOptionClick = (optionId: number) => {
        const nextDialog = dialogs.find(dialog => dialog.id === optionId);
        if (nextDialog) {
			setPastDialogs([...pastDialogs, currentDialog])
            setCurrentDialog(nextDialog);
        }
    };

    return (
        <div className="dialog-container">
			{pastDialogs.map(pd=>(
            <div className="dialog-box">
                <p className="dialog-person">{pd.person}:</p>
                <p className="dialog-msg">{pd.msg}</p>
            </div>) )}
            <div className="dialog-box">
                <p className="dialog-person">{currentDialog.person}:</p>
                <p className="dialog-msg">{currentDialog.msg}</p>
            </div>
            <div className="options-container">
				{currentDialog.options.length?<p  className="dialog-person">{dialogs.find(dialog => dialog.id === currentDialog.options[0])?.person}</p>:<></>}
                {currentDialog.options.map(optionId => (
                    <button
                        key={optionId}
                        className="dialog-option"
                        onClick={() => handleOptionClick(optionId)}
                    >
                        {dialogs.find(dialog => dialog.id === optionId)?.msg}
                    </button>
                ))}
            </div>
        </div>
    );
};
