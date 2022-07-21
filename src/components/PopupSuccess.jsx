import icon from '../images/icon-success.svg';

function PopupSuccess({ name, isOpen, onClose }) {

  const popupClassName = `popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`;
  const popupContainerClassName = `popup__container popup__container_type_${name}`;
  const popupTitleClassName = `popup__title_type_${name}`;

  return (
    <div className={popupClassName}>
      <div className={popupContainerClassName}>
        <button className="popup__close-button" type="button" onClick={onClose} />
        <img src={icon} alt="Изображение подтверждения регистрации." className="popup__image" />
        <p className={popupTitleClassName}>Вы успешно зарегистрировались!</p>
      </div>
    </div>
  )
}

export default PopupSuccess;
