import React, { useState, useEffect, createContext, useContext } from 'react';
import './index.css';
import axios from 'axios';

const AppContext = createContext();

function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [cartItems, setCartItems] = useState([]);

  const handleOrder = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentPage('order');
  };

  const addToCart = async (item) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((cartItem) => cartItem.name === item.name);
      if (existingItemIndex >= 0) {
        // If item exists, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // If item does not exist, add it with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  
    // Send the item to your db.json
    try {
      await axios.post('http://localhost:3000/cart', { ...item, quantity: 1 });                                         //post
      console.log(`${item.name} has been added to the cart in db.json!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  useEffect(() => {
    if (cartItems.length > 0) {
      const lastAddedItem = cartItems[cartItems.length - 1];
      alert(`${lastAddedItem.name} has been added to your cart!`);
    }
  }, [cartItems]); // alert triggers when cartItems changes

  const incrementQuantity = (index) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = { 
        ...updatedItems[index], 
        quantity: updatedItems[index].quantity + 1 
      };
      return updatedItems;
    });
  };
  
  const decrementQuantity = (index) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      if (updatedItems[index].quantity > 1) {
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: updatedItems[index].quantity - 1
        };
      } else {
        // Remove the item from cart if quantity is 1 and decrement is clicked
        updatedItems.splice(index, 1);
      }
      return updatedItems;
    });
  };

  const removeFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const goToHome = () => {
    setCurrentPage('home');
    setSelectedRestaurant('');
  };

  return (
    <AppContext.Provider value={{
      currentPage,
      setCurrentPage,
      selectedRestaurant,
      cartItems,
      onOrder: handleOrder,
      addToCart,
      removeFromCart,
      incrementQuantity,
      decrementQuantity,
      goToHome,
      setCartItems, // Expose setCartItems to be used in Cart
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Header Component
function Header() {
  const { setCurrentPage } = useContext(AppContext);//use context
  return (
    <header className="header">
      <img
        className="header__logo"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK4m0_mAl4j_1ybxCnkAq93FZ01t-HE4_L-w&s"
        alt="Swiggy Logo"
      />
      <nav className="header__nav">
        <a href="#home" onClick={() => setCurrentPage('home')}>Home</a>
        <a href="#about" onClick={() => setCurrentPage('about')}>About</a>
        <a href="#cart" onClick={() => setCurrentPage('cart')}>Cart</a>
        <a href="#contact" onClick={() => setCurrentPage('contact')}>Contact</a>
      </nav>
    </header>
  );
}

// SearchBar Component
function SearchBar() {
  return (
    <div className="searchbar">
      <input type="text" placeholder="Search for restaurants, dishes, etc." />
      <button> Search </button>
    </div>
  );
}

// RestaurantCard Component
function RestaurantCard({ name, cuisine, image, price }) {
  const { onOrder, addToCart } = useContext(AppContext);
  return (
    <div className="restaurantCard">
      <img src={image} alt={name} />
      <h2>{name}</h2>
      <p>{cuisine}</p>
      <p>Price: ₹{price}</p>
      <button onClick={() => onOrder(name)}>Order Now</button><br></br>
      <button onClick={() => addToCart({ name, cuisine, image, price })} style={{ marginTop: '10px' }}>Add to Cart</button>
    </div>
  );
}

// OrderPage Component
function OrderPage() {
  const { selectedRestaurant, goToHome } = useContext(AppContext);
  return (
    <div className="orderPage">
      <h2>Thank you for ordering  {selectedRestaurant}!</h2>
      <button onClick={goToHome}>Back to Home</button>
    </div>
  );
}

// RestaurantList Component
function RestaurantList() {
  const restaurants = [
    { name: 'Parotta', image: 'https://c.ndtvimg.com/2021-05/tj7sdqj8_parotta_625x300_14_May_21.jpg',cuisine:'India', price: 45 },
    { name: 'Chappati', image: 'https://static.toiimg.com/thumb/61203720.cms?width=1200&height=900', cuisine: 'Indian', price: 30 },
    { name: 'Dosa', image: 'https://vismaifood.com/storage/app/uploads/public/8b4/19e/427/thumb__1200_0_0_0_auto.jpg', cuisine: 'Indian', price: 50 },
    { name: 'Pongal', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2019/01/ven-pongal-recipe-1a.jpg', cuisine: 'Indian', price: 35 },
    { name: 'Idly', image: 'https://t3.ftcdn.net/jpg/03/62/02/26/360_F_362022640_fZ6UM0JycJlFDdBiR1pYlNddKfdGvYwR.jpg', cuisine: 'Indian', price: 40 },
    { name: 'Chicken Biryani', image: 'https://i0.wp.com/blendofspicesbysara.com/wp-content/uploads/2020/10/PXL_20201011_200951855.PORTRAIT-01.jpeg?resize=800%2C840&ssl=1', cuisine: 'Indian', price: 50 },
    { name: 'Chicken 65', image: 'https://sinfullyspicy.com/wp-content/uploads/2021/10/1200-by-1200-images.jpg', cuisine: 'Indian', price: 55 },
    { name: 'Kizhi Parotta', image: 'https://selfiefamily.com/wp-content/uploads/2021/07/Kizhi-Parotta.jpeg', cuisine: 'Indian', price: 55 },
    { name: 'Spicy Noodles', image: 'https://lindseyeatsla.com/wp-content/uploads/2021/11/LindseyEats_Spicy_Garlic_Noodles-3.jpg', cuisine: 'Asian', price: 60 },
    { name: 'Grill Chicken', image: 'https://www.foodfidelity.com/wp-content/uploads/2020/06/piri-piri-chicken-featured-1.jpg', cuisine: 'Indian', price: 65 },
  ];

  return (
    <div className="restaurantList">
      {restaurants.map((restaurant, index) => (
        <RestaurantCard
          key={index}
          name={restaurant.name}
          cuisine={restaurant.cuisine}
          image={restaurant.image}
          price={restaurant.price}
        />
      ))}
    </div>
  );
}

// About Section
function About() {
  return (
    <div className="about">
      <h2>Welcome to Thai Food!</h2>
      <p>
        <h4>
        Discover India's leading food ordering and delivery platform that 
        brings the joy of dining right to your home. 
        Whether you're craving delicious Indian cuisine or international dishes, 
        we've got you covered!
        </h4>
      </p>

      <h3>Why Choose Swiggy?</h3>
      <div className="about-reasons">
        <div className="reason">
          <h4>🍽 Wide Selection</h4>
          <p>Choose from thousands of restaurants and explore diverse cuisines.</p>
        </div>
        <div className="reason">
          <h4>🚀 Fast Delivery</h4>
          <p>Get your food delivered to your doorstep in no time!</p>
        </div>
        <div className="reason">
          <h4>🎉 Exclusive Offers</h4>
          <p>Enjoy special discounts and deals from your favorite restaurants.</p>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const { cartItems, setCartItems, removeFromCart, incrementQuantity, decrementQuantity } = useContext(AppContext);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/cart');                                            //get
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [setCartItems]);

  // Update both quantity and total price in db.json
  const updateItemInDb = async (item) => {
    try {
      // Calculate the new total price based on the quantity
      const updatedItem = { ...item, totalPrice: item.price * item.quantity };
      
      // Update the item in db.json with new total price
      await axios.put(`http://localhost:3000/cart/${item.id}`, updatedItem);                                               //put


      console.log(`Updated ${item.name}'s quantity to ${item.quantity} and total price to ₹${updatedItem.totalPrice} in db.json!`);
    } catch (error) {
      console.error('Error updating item in db.json:', error);
    }
  };

  const removeItemFromDb = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/cart/${id}`);                                                              //delete
      console.log(`Removed item with id ${id} from db.json!`);
    } catch (error) {
      console.error('Error removing item from db.json:', error);
    }
  };

  // Handle incrementing quantity
  const handleIncrement = (index) => {
    const item = cartItems[index];
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    incrementQuantity(index);
    updateItemInDb(updatedItem); // Update quantity and total price in db.json
  };

  // Handle decrementing quantity
  const handleDecrement = (index) => {
    const item = cartItems[index];
    if (item.quantity > 1) {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      decrementQuantity(index);
      updateItemInDb(updatedItem); // Update quantity and total price in db.json
    } else {
      removeItemFromCart(index);
    }
  };

  const removeItemFromCart = (index) => {
    const item = cartItems[index];
    removeFromCart(index); // Remove from state
    removeItemFromDb(item.id); // Remove from db.json
  };

  // Calculate total amount
  const totalAmount = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in the cart yet.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, index) => (
              <li key={item.id} className="cartItem">
                <img src={item.image} alt={item.name} className="cartItem__image" />
                <span>{item.name} - {item.cuisine}</span>
                <span> (Qty: {item.quantity})</span>
                <span>Total Price: ₹{(item.price * item.quantity).toFixed(2)}</span>
                <div className="cartItem__buttons">
                  <button onClick={() => handleDecrement(index)}>-</button>
                  <button onClick={() => handleIncrement(index)}>+</button>
                  <button onClick={() => removeItemFromCart(index)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <h3>Total Amount: ₹{totalAmount.toFixed(2)}</h3>
        </>
      )}
    </div>
  );
}
// Contact Section
function Contact() {
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your feedback! We appreciate your input.');
    e.target.reset();
  };

  return (
    <div className="contact">
      <h2>Get in Touch</h2>
      <p>We’re here to assist you! Please reach out for any inquiries or feedback.</p>

      <div className="contact__details">
        <h3>Contact Details</h3>
        <p>📧 Email: <a href="mailto:support@thaifood.com" className="contact__link">tamilan@thaifood.com</a></p>
        <p>📞 Phone: <a href="tel:042963456789" className="contact__link">04234567892</a></p>
      </div>

      <div className="contact__feedback">
        <h3>✍ Share Your Feedback</h3>
        <form className="feedback__form" onSubmit={handleFeedbackSubmit}>
          <label>
            Your Name:
            <input type="text" placeholder="Enter your name" required />
          </label>
          <label>
            Your Feedback:
           <br /><br /> <textarea placeholder="Your feedback here" rows="4" required></textarea>
          </label>
          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <AppProvider>
      <div className="app">
        <Header />
        <SearchBar />
        <main>
          <AppContext.Consumer>
            {({ currentPage }) => {
              switch (currentPage) {
                case 'home':
                  return <RestaurantList />;
                case 'order':
                  return <OrderPage />;
                case 'about':
                  return <About />;
                case 'cart':
                  return <Cart />;
                case 'contact':
                  return <Contact/>
                default:
                  return <RestaurantList />;
              }
            }}
          </AppContext.Consumer>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
