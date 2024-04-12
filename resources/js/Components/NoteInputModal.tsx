import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import React, { useRef } from 'react';
import ReactDOM from 'react-dom';

import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import 'tinymce/tinymce';

import 'tinymce/icons/default';
import 'tinymce/models/dom';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
import 'tinymce/themes/silver';

import { Editor } from '@tinymce/tinymce-react';

type ModalProps = {
  defaultContents?: string;
  isOpen: boolean;
  onClose(): void;
  onSubmit(contents: string): void;
  maxWidth?: string;
};

export default function NoteInputModal({
  defaultContents,
  isOpen,
  onClose,
  onSubmit,
  maxWidth = '2xl',
}: ModalProps) {
  const maxWidthClass = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
  }[maxWidth];

  if (typeof window === 'undefined') {
    return null;
  }

  const editorRef = useRef<any>(null);

  const submit = () => {
    if (editorRef.current) {
      onSubmit(editorRef.current.getContent());
    }
  };

  return ReactDOM.createPortal(
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={isOpen}
        onClose={onClose}
      >
        <div className="min-h-screen min-w-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 dark:bg-gray-900 backdrop-blur-sm bg-opacity-60 dark:bg-opacity-60 transition-all" />
          </Transition.Child>

          <div className="flex flex-col min-h-screen min-w-screen justify-end">
            {/* This element is to trick the browser into centering the modal contents. */}
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                className={classNames(
                  'inline-block sm:align-middle sm:w-full mb-4 ml-auto mr-4 bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all',
                  maxWidthClass,
                )}
              >
                <Editor
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue={defaultContents}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: 'table lists autolink link emoticons charmap',
                    skin_url: '/css/tinymce',
                    content_css: '/css/tinymce/container-content.min.css',
                    statusbar: false,
                    toolbar_mode: 'sliding',
                    toolbar:
                      'undo redo | blocks bold italic underline strikethrough | ' +
                      'align numlist bullist outdent indent | link table | ' +
                      'forecolor backcolor removeformat | charmap emoticons',
                    content_style:
                      'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  }}
                />
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-right">
                  <SecondaryButton onClick={onClose}>Close</SecondaryButton>

                  <PrimaryButton
                    className={classNames('ml-2', { 'opacity-25': false })}
                    form="tag-form"
                    disabled={false}
                    onClick={submit}
                  >
                    Save
                  </PrimaryButton>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>,
    document.body,
  );
}
