import icon from '../images/icon-fail.svg';

function PopupFail({ name, isOpen, onClose }) {

  const popupClassName = `popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`;
  const popupContainerClassName = `popup__container popup__container_type_${name}`;
  const popupTitleClassName = `popup__title_type_${name}`;

  return (
    <div className={popupClassName}>
      <div className={popupContainerClassName}>
        <button className="popup__close-button" type="button" onClick={onClose} />
        <img src={icon} alt="Изображение неудачной регистрации." className="popup__image" />
        <p className={popupTitleClassName}>Что-то пошло не так! Попробуйте ещё раз.</p>
      </div>
    </div>
  )
}

export default PopupFail;
