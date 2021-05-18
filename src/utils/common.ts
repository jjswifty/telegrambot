export const generateInlineKeyboardFilledWithNumbers = (columns: number, buttons: number, dataPrefix: string = '') => {

    const columnsArr: any = []
    let columnArr: {}[] = []

    for (let num = 0; num <= buttons; num++) {
        if (num % columns === 0 && num > 0) {
            columnsArr.push(columnArr)
            columnArr = []
        }
        columnArr.push({
            text: num,
            callback_data: dataPrefix + num,
        })
    }
    columnsArr.push(columnArr)
    return columnsArr
}

export const getRandomIntegerFromInterval = (min: number, max: number) => {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}