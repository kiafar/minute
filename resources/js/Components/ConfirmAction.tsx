import DialogModal from '@/Components/DialogModal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface Props {}

interface ModalData {
  cancelText?: string;
  confirmCallback: Function;
  confirmText?: string;
  message: string | JSX.Element;
  title: string;
}

function ConfirmAction(
  {}: Props,
  ref: React.Ref<{ show: (modalData: ModalData) => void }>,
): JSX.Element {
  const cancelText = useRef<string>('Cancel');
  const confirmText = useRef<string>('Ok');
  const message = useRef<string | JSX.Element>('');
  const onConfirm = useRef<Function>(() => {});
  const title = useRef<string>('Confirmation');
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    onConfirm.current();
    setShowModal(false);
  };

  const handleClose = () => {
    console.log('handleClose');
  };

  useImperativeHandle(ref, () => ({
    show: (modalData: ModalData) => {
      setShowModal(true);
      onConfirm.current = modalData.confirmCallback;
      title.current = modalData.title;
      message.current = modalData.message;
      if (modalData.confirmText) confirmText.current = modalData.confirmText;
      if (modalData.cancelText) cancelText.current = modalData.cancelText;
    },
  }));

  return (
    <>
      <DialogModal isOpen={showModal} onClose={handleClose} maxWidth="lg">
        <DialogModal.Content title={title.current}>
          <div className="mt-4">{message.current}</div>
        </DialogModal.Content>

        <DialogModal.Footer>
          <SecondaryButton onClick={() => setShowModal(false)}>
            <FontAwesomeIcon icon={faTimes} className="pr-2" />
            {cancelText.current}
          </SecondaryButton>

          <PrimaryButton
            className="ml-2"
            form="tag-form"
            onClick={handleConfirm}
          >
            <FontAwesomeIcon icon={faCheck} className="pr-2" />
            {confirmText.current}
          </PrimaryButton>
        </DialogModal.Footer>
      </DialogModal>
    </>
  );
}

export default forwardRef(ConfirmAction);
