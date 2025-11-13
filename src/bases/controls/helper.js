const generateStyleTableCol = (tableBody, length, displayCountRow = 15) => {
    if (tableBody) {
        if (displayCountRow <= 0) {
            displayCountRow = 1;
        }

        const table = tableBody.parentElement;

        const header = table.querySelector('thead');

        let offsetHeightHeader = 0;

        if (header) {
            offsetHeightHeader = header.clientHeight;
        }

        const clientHeight = table.clientHeight - offsetHeightHeader;

        const heightRow = clientHeight / displayCountRow;

        return {
            height: `${heightRow}px`
        }
    }
}

export {
    generateStyleTableCol
}