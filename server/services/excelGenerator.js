exports.addSheetToWorkbook = function (params, workbook) {
    // check valid input
    if (!params || !workbook) {
        return null;
    }
    const columnCount = (params.firstRow) ? params.firstRow.length : 0;
    const rowCount = (params.data) ? params.data.length : 0;

    const sheet = workbook.createSheet(params.name, columnCount, rowCount + 1);

    // set the headers
    for (let col = 1; col <= columnCount; col++) {
        sheet.set(col, 1, params.firstRow[col - 1]);
    }
    for (let j = 2; j < rowCount + 2; j++) {
        for (let i = 1; i <= columnCount; i++) {
            let cell = params.data[j - 2][params.firstRow[i - 1]];
            sheet.set(i, j, cell);
            // see if it is a number
            if (!isNaN(parseFloat(cell))) {
                cell = parseFloat(cell);
                sheet.numberFormat(i, j, 'General');
            }
        }
    }
};
