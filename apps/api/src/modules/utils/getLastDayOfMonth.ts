export function getLastDayOfMonthUtils(
    year: number,
    month: number
): Date {
    return new Date(year, month, 0);
}


export function getFirstDayOfMonthUtils(
    year: number,
    month: number
): Date {
    return new Date(year, month - 1, 1);
}