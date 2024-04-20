import NoteInputModal from '@/Components/NoteInputModal';
import { Button } from '@/Components/ui/button';
import AppLayout from '@/Layouts/AppLayout';
import classNames from 'classnames';
import React from 'react';
import { Slide, ToastContainer } from 'react-toastify';

type Props = {};

export default function AddNote({}: Props) {
  const [showEditModal, setShowEditModal] = React.useState(false);

  function dismissEditModal() {
    setShowEditModal(false);
  }

  const log = (contents: string) => {
    console.log(contents);
  };

  return (
    <AppLayout title="Add Note">
      <Button
        className={classNames('ml-2', { 'opacity-25': false })}
        form="tag-form"
        disabled={false}
        onClick={() => setShowEditModal(true)}
      >
        Submit
      </Button>

      <ToastContainer
        autoClose={3000}
        containerId="manage-tags-toast-notif"
        draggable
        hideProgressBar
        position="bottom-left"
        theme="dark"
        transition={Slide}
      />

      <NoteInputModal
        defaultContents="<p>This is the initial content of the editor.</p>"
        isOpen={showEditModal}
        maxWidth="2xl"
        onClose={dismissEditModal}
        onSubmit={log}
      />
    </AppLayout>
  );
}
