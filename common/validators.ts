export const isValidCPF = (number: string) => {

    number = (number || "")
        .replace(/\.|-/g, '');

    let
        sum = 0,
        rest = 0;


    if (number == "00000000000") return false;

    for (let index = 1; index <= 9; index++) 
        sum = sum + parseInt(number.substring(index - 1, index)) * (11 - index);
        
    rest = (sum * 10) % 11;

    if ((rest == 10) || (rest == 11)) rest = 0;
    if (rest != parseInt(number.substring(9, 10))) return false;

    sum = 0;
    for (let index = 1; index <= 10; index++) sum = sum + parseInt(number.substring(index - 1, index)) * (12 - index);
    rest = (sum * 10) % 11;

    if ((rest == 10) || (rest == 11)) rest = 0;
    if (rest != parseInt(number.substring(10, 11))) return false;
    return true;
}