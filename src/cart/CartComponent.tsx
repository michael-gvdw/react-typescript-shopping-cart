import CartItemComponent from '../cartitem/CartItemComponent'

// style
import { Wrapper } from './CartComponent.styles'

// type
import { CartItemType } from '../App'

type Props = {
    cartItems: CartItemType[];
    addToCart: (clickedItem: CartItemType) => void;
    removeFromCart: (id: number) => void;
}

const CartComponent: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {

    const calcTotal = (items: CartItemType[]) => items.reduce((ack: number, item) => ack + item.amount * item.price, 0)

    return (
        <Wrapper>
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? <p>No items in cart.</p> : null}
            {cartItems.map(item => (
                <CartItemComponent 
                    key={item.id}
                    item={item}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                />
            ))}
            <h2>Total: ${calcTotal(cartItems).toFixed(2)}</h2>
        </Wrapper>
    )
}

export default CartComponent