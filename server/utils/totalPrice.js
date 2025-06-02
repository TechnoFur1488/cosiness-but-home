export const totalPrice = ({size, price, quantity}) => {
    const [w, l] = size.split("x").map(Number)
    const squareMeters = w * l
    const numberProduct = price * squareMeters
    const total = numberProduct * quantity

    return Number(total)
}