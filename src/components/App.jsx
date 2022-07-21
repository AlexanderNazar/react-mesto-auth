import { useState, useEffect }from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupImageOpen from './PopupImageOpen';
import api from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmPopup from './ConfirmPopup';
import { Route, Switch, useHistory } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/Auth';
import PopupSuccess from './PopupSuccess';
import PopupFail from './PopupFail';

function App() {

  const [isEditAvatarPopup, setIsEditAvatarPopup] = useState(false);
  const [isEditProfilePopup, setIsEditProfilePopup] = useState(false);
  const [isAddPlacePopup, setIsAddPlacePopup] = useState(false);
  const [isConfirmPopup, setIsConfirmPopup] = useState(false);
  const [isSuccessPopup, setIsSuccessPopup] = useState(false);
  const [isFailPopup, setIsFailPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isValidDefault, setIsValidDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buffer, setBuffer] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPressSign, setIsPressSign] = useState(false);
  const [email, setEmail] = useState('');

  const history = useHistory();

  function getUserInfo() {
    api.setUserInfo()
    .then(data => {setCurrentUser(data)})
    .catch(err => console.log(err))
  }

  function getInitialCards() {
    api.getInitialCards()
    .then(cards => setCards([...cards]))
    .catch(err => console.log(err))
  }

  useEffect(() => {
    getUserInfo();
    getInitialCards();
  }, [])

  function handleEditAvatarPopupOpen() {
    setIsEditAvatarPopup(true);
  }

  function handleEditProfilePopupOpen() {
    setIsEditProfilePopup(true);
  }

  function handleAddPlacePopupOpen() {
    setIsAddPlacePopup(true);
  }

  function handleSuccessPopup() {
    setIsSuccessPopup(true);
  }

  function handleFailPopup() {
    setIsFailPopup(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopup(false);
    setIsEditProfilePopup(false);
    setIsAddPlacePopup(false);
    setIsConfirmPopup(false);
    setSelectedCard(null);
    setIsValidDefault(false);
  }

  function closeSuccessPopup() {
    setIsSuccessPopup(false);
    history.push('/sign-in');
  }

  function closeFailPopup() {
    setIsFailPopup(false);
  }

  function handleValid() {
    setIsValidDefault(true);
  }

  function handleInvalidDefault() {
    setIsValidDefault(false);
  }

  function handleUpdateUser({ name, about }) {
    setIsLoading(true);
    api.changeUserInfo({ name, about })
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false))
  }

  function handleUpdateavatar({ avatar }) {
    setIsLoading(true);
    api.updateAvatar({ avatar })
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false))
  }

  function handleConfirmPopup(card) {
    setIsConfirmPopup(true)
    setBuffer(card);
  }

  function handleCardDelete() {
    setIsLoading(true);
    api.deleteImage(buffer._id)
      .then(setCards(state => state.filter(c => c._id !== buffer._id)))
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false));
    setIsConfirmPopup(false);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikePosition(card._id, !isLiked)
      .then(newCard => {
        setCards(state => state.map(c => c._id === card._id ? newCard : c));
      })
      .catch(err => console.log(err))
  }

  function handleAddPlaceSubmit({ name, link }) {
    setIsLoading(true);
    api.addCard({ name, link })
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false))
  }

  function handleSign() {
    setIsPressSign(true);
  }

  function handleCloseSign() {
    setIsPressSign(false);
  }

  function handleLoggedOut() {
    setIsPressSign(false);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
  }

  function handleLoggedIn() {
    setIsLoggedIn(true);
  }

  function tokenCheck() {
    const token = localStorage.getItem('token');
    if (token) {
      auth.getContent(token)
        .then(res => {
          if (res) {
            setIsLoggedIn(true);
            setEmail(res.data.email);
          }
        })
        .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    tokenCheck();
  }, [isLoggedIn])

  useEffect(() => {
    if (isLoggedIn) {
      history.push('/');
    }
  }, [isLoggedIn])

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <Header
          isOpen={isPressSign}
          onSign={handleSign}
          onClose={handleCloseSign}
          onLoggedOut={handleLoggedOut}
          email={email} />
        <Switch>
          <ProtectedRoute exact path="/" isLoggedIn={isLoggedIn} children={
            <>
              <Main
                  onEditAvatar={handleEditAvatarPopupOpen}
                  onEditProfile={handleEditProfilePopupOpen}
                  onAddPlace={handleAddPlacePopupOpen}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleConfirmPopup}
                  cards={cards} />
                <Footer />
                <EditProfilePopup
                  isOpen={isEditProfilePopup}
                  onClose={closeAllPopups}
                  onUpdateUser={handleUpdateUser}
                  isLoading={isLoading} />
                <AddPlacePopup
                  isOpen={isAddPlacePopup}
                  onClose={closeAllPopups}
                  onAddPlace={handleAddPlaceSubmit}
                  validDefault={isValidDefault}
                  setValidDefault={handleValid}
                  isLoading={isLoading} />
                <EditAvatarPopup
                  isOpen={isEditAvatarPopup}
                  onClose={closeAllPopups}
                  onUpdateAvatar={handleUpdateavatar}
                  validDefault={isValidDefault}
                  setValidDefault={handleValid}
                  isLoading={isLoading} />
                <ConfirmPopup
                  isOpen={isConfirmPopup}
                  onClose={closeAllPopups}
                  onDeliteCard={handleCardDelete}
                  isLoading={isLoading} />
                <PopupImageOpen card={selectedCard} onClose={closeAllPopups} />
              </>
            } />
          <Route path="/sign-in">
            <Login
              setIsLoggedIn={handleLoggedIn}
              onFailPopup={handleFailPopup}
              validDefault={isValidDefault}
              setValidDefault={handleValid}
              offValideDefault={handleInvalidDefault} />
            <PopupFail name="fail" isOpen={isFailPopup} onClose={closeFailPopup} />
          </Route>
          <Route path="/sign-up">
            <Register
              onSuccessPopup={handleSuccessPopup}
              onFailPopup={handleFailPopup}
              validDefault={isValidDefault}
              setValidDefault={handleValid}
              offValideDefault={handleInvalidDefault} />
            <PopupSuccess name="success" isOpen={isSuccessPopup} onClose={closeSuccessPopup} />
            <PopupFail name="fail" isOpen={isFailPopup} onClose={closeFailPopup} />
          </Route>
        </Switch>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
