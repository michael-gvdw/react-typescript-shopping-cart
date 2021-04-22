import { useState } from 'react'
import { useQuery } from 'react-query'

// components
import ItemComponent from './item/ItemComponent'
import CartComponent from './cart/CartComponent'
import Drawer from '@material-ui/core/Drawer'
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import Badge from '@material-ui/core/Badge'

// styles
import { Wrapper, StyledButton } from './App.styles'

// types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
}


const fetchProducts = async (): Promise<CartItemType[]> => await (await fetch('https://fakestoreapi.com/products')).json()


const App = () => {

  const [cartIsOpen, setCartIsOpen] = useState(false)
  const [cartItems, setCartItems] = useState([] as CartItemType[])

  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products',
    fetchProducts
  )

  const getTotalItems = (items: CartItemType[]) => items.reduce((ack: number, item) => ack + item.amount, 0)

  const handleAddToCart = (clickedItem: CartItemType): void => {
    setCartItems(prev => {
      // 1. item already in cart
      const isItemInCart = prev.find(item => item.id === clickedItem.id)

      if (isItemInCart) {
        return prev.map(item => (
          item.id === clickedItem.id ? 
            {...item, amount: item.amount + 1} :
            item
        ))
      }

      // 2. item no in cart
      return [...prev, {...clickedItem, amount: 1}]
    })
  }

  const handleRemoveToCart = (id: number): void => {
    setCartItems(prev => (
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack
          return [...ack, {...item, amount: item.amount - 1}]
        } else {
          return [...ack, item]
        }
      }, [] as CartItemType[])
    ))
  }


  if (isLoading) return <LinearProgress />
  if (error) return <div>Something went wrong...</div>


  return (
    <Wrapper>

      <Drawer anchor='right' open={cartIsOpen} onClose={() => setCartIsOpen(false)}>
        <CartComponent 
          cartItems={cartItems} 
          addToCart={handleAddToCart} 
          removeFromCart={handleRemoveToCart}
        />
      </Drawer>

      <StyledButton onClick={() => setCartIsOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color={`error`}>
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>

      <Grid container spacing={3}>
        {data?.map(item => (
            <Grid item key={item.id} xs={12} sm={4}>
              <ItemComponent item={item} handleAddToCart={handleAddToCart} />
            </Grid>
          ))
        }
      </Grid>
    </Wrapper>
  )
}

export default App;
