import { Button } from '@/Components/ui/button';
import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
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
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-w-screen min-h-screen px-4 pb-20 pt-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-60 backdrop-blur-sm transition-all dark:bg-gray-900 dark:bg-opacity-60" />
          </Transition.Child>

          <div className="min-w-screen flex min-h-screen flex-col justify-end">
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
                  'mb-4 ml-auto mr-4 inline-block transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all dark:bg-gray-800 sm:w-full sm:align-middle',
                  maxWidthClass,
                )}
              >
                <Editor
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue={defaultContents}
                  licenseKey="gpl"
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
                <div className="bg-gray-100 px-4 py-2 text-right dark:bg-gray-800">
                  <Button variant="secondary" onClick={onClose}>
                    Close
                  </Button>

                  <Button
                    className={classNames('ml-2', { 'opacity-25': false })}
                    form="tag-form"
                    disabled={false}
                    onClick={submit}
                  >
                    Save
                  </Button>
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
