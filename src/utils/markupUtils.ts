export const generateInlineKeyboardFilledWithNumbers = (buttonsInColumnLimit: number, buttons: number, dataPrefix: string = '') => {

    const columnsArr: any = []
    let columnArr: {}[] = []

    for (let num = 0; num <= buttons; num++) {
        if (num % buttonsInColumnLimit === 0 && num > 0) {
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

export const getInlineButton = (text: string, callback_data: string) => JSON.stringify({
    inline_keyboard: [[ { text, callback_data } ]]
}) as any
