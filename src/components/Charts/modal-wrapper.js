import React, {useState, useEffect} from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function ModalWrapper(props) {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const content = props.content;
  const title = props.title;
  const footer = props.footer;

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  useEffect(() => {
    if (window.innerWidth > 639) setIsDesktop(true);
    else setIsDesktop(false);
  }, [props]);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    isDesktop && (
      <div className="modal-wrapper">
        <div className="wp-action">
          <button onClick={openModal}>Expand</button>
        </div>
        <div>
          <Modal
            isOpen={open}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            style={modalStyles}
          >
            <div className="wp-title">{title}</div>
            <div className="wp-chart">{content}</div>
            <div className="wp-footer">{footer}</div>
          </Modal>
        </div>
      </div>
    )
  );
}

export default ModalWrapper;
