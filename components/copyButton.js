import React from "react";
import clipboardCopy from "clipboard-copy";

export default function CopyToClipBoardButton({text}) {
    console.log(text)
    const [isCopied, setIsCopied] = React.useState(false);

    const handleCopyClick = () => {
        clipboardCopy(text).then((result) => setIsCopied(true), (error) => setIsCopied(false))
    }
    return (
        <div>
            <button onClick={(e) => {
                handleCopyClick();
                e.preventDefault()}}>
                {isCopied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    )
}

