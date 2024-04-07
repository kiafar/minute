import { Head, useForm } from '@inertiajs/react';
import React, { useMemo, useRef } from 'react';

import { Slide, ToastContainer, toast } from 'react-toastify';

import {
  faPenToSquare,
  faSquarePlus,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ConfirmAction from '@/Components/ConfirmAction';
import DialogModal from '@/Components/DialogModal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import useRoute from '@/Hooks/useRoute';
import classNames from 'classnames';

type TTreeNode = {
  id: number;
  name: string;
  parent_id: number | null;
  children?: TTreeNode[];
  level?: number;
};

type TTag = {
  id: number;
  name: string;
  parent_id: number;
};

type Props = {
  tags: TTag[];
};

export default function ManageTags({ tags }: Props) {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const route = useRoute();
  const confirmActionRef = useRef<any>(null);
  const form = useForm({
    id: '',
    name: '',
    parent_id: '',
  });

  const modalTitle = useMemo(() => {
    return form.data.id ? 'Edit Tag' : 'Add New Tag';
  }, [form.data.id]);

  function transformTagRecords(
    records: TTreeNode[],
    parentId: number | null = null,
    level: number = 0,
  ): TTreeNode[] {
    const result: TTreeNode[] = [];

    records.forEach(record => {
      if (record.parent_id === parentId) {
        const children = transformTagRecords(records, record.id, level + 1);
        if (children.length) {
          record.children = children;
        }
        record.level = level;
        result.push(record);
      }
    });

    return result;
  }

  const nodes = transformTagRecords(tags);

  function resetForm() {
    form.reset('id', 'name', 'parent_id');
  }

  function dismissEditModal() {
    setShowEditModal(false);
  }

  function createTag() {
    form.post(route('tags.store'), {
      onSuccess: response => {
        resetForm();
        dismissEditModal();
        const { name } = response.props.responseData as TTag;
        toast.success(`"${name}" tag created`, {
          containerId: 'manage-tags-toast-notif',
        });
      },
    });
  }

  function updateTag() {
    const url = route('tags.update', { tag: form.data.id });
    form.put(url, {
      onSuccess: response => {
        resetForm();
        dismissEditModal();
        const { name } = response.props.responseData as TTag;
        toast.success(`"${name}" tag updated`, {
          containerId: 'manage-tags-toast-notif',
        });
      },
    });
  }

  function submitTag(e: React.FormEvent) {
    e.preventDefault();
    if (form.data.id) {
      updateTag();
    } else {
      createTag();
    }
  }
  function childNodeRemoved(node: TTreeNode) {
    toast.info(`"${node.name}" removed`, {
      containerId: 'manage-tags-toast-notif',
    });
  }

  function removeChildNode(node: TTreeNode) {
    const url = route('tags.destroy', node.id);
    form.delete(url, {
      onSuccess: () => {
        childNodeRemoved(node);
      },
    });
  }

  function openEditTagModal(node: TTreeNode) {
    form.data.id = node.id.toString();
    form.data.name = node.name;
    form.data.parent_id = '';
    setShowEditModal(true);
  }

  function openAddNewTagModal(node: TTreeNode) {
    const parentId = node.id === 0 ? '' : node.id.toString();
    form.data.parent_id = parentId;
    form.data.id = '';
    form.data.name = '';
    setShowEditModal(true);
  }

  function openRemoveConfirmationModal(node: TTreeNode) {
    confirmActionRef.current.show({
      confirmCallback: () => removeChildNode(node),
      title: 'Remove the tag?',
      message: (
        <span>
          <strong>{node.name}</strong> will be deleted permanently.
        </span>
      ),
    });
  }

  function renderTree(nodes: TTreeNode[]): JSX.Element[] {
    return nodes.map(node => (
      <div key={node.id} className={`ml-${node.level && 4}`}>
        <div className="flex items-center gap-1 tag-item-row border-l-2 hover:bg-indigo-100 hover:dark:bg-indigo-900 border-gray-200 dark:border-gray-700 pl-1 relative">
          <div className="asd">#</div>
          <div>{node.name}</div>
          <div className="action-buttons ml-auto">
            <FontAwesomeIcon
              title="Add a Child Tag"
              icon={faSquarePlus}
              onClick={() => openAddNewTagModal(node)}
              className="p-1 hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700"
            />
            <FontAwesomeIcon
              title="Edit Tag Name"
              icon={faPenToSquare}
              onClick={() => openEditTagModal(node)}
              className="p-1 hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700"
            />
            {(!node.children || node.children.length === 0) && (
              <FontAwesomeIcon
                title="Remove Tag"
                className="p-1 hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700"
                icon={faTrashAlt}
                onClick={() => openRemoveConfirmationModal(node)}
              />
            )}
          </div>

          {node.children && node.children.length > 0 && (
            <span className="return-sign absolute font-bold text-slate-300 dark:text-slate-700">
              &#8627;
            </span>
          )}
        </div>
        {node.children && node.children.length > 0 && renderTree(node.children)}
      </div>
    ));
  }

  return (
    <>
      <Head title="Manage Tags" />

      <ConfirmAction ref={confirmActionRef} />

      <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 :selectiontext-white">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#FF2D20"
              className="h-16 w-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6h.008v.008H6V6Z"
              />
            </svg>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-6 lg:gap-8">
              <div className="scale-100 p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none">
                <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Your Tags
                </h2>

                <div className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {renderTree(nodes)}
                </div>

                <div className="text-right">
                  <FontAwesomeIcon
                    title="Add a Top Level Tag"
                    icon={faSquarePlus}
                    onClick={() =>
                      openAddNewTagModal({
                        id: 0,
                        name: 'rootTag',
                        parent_id: null,
                      })
                    }
                    className="p-1 text-gray-500 dark:text-gray-400 hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-16 px-6 sm:items-center sm:justify-between">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 sm:text-left">
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/sponsors/taylorotwell"
                  className="group inline-flex items-center hover:text-gray-700 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    className="-mt-px mr-1 w-5 h-5 stroke-gray-400 dark:stroke-gray-600 group-hover:stroke-gray-600 dark:group-hover:stroke-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                  Sponsor
                </a>
              </div>
            </div>

            <div className="ml-4 text-center text-sm text-gray-500 dark:text-gray-400 sm:text-right sm:ml-0">
              Laravel v11
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        autoClose={3000}
        containerId="manage-tags-toast-notif"
        draggable
        hideProgressBar
        position="bottom-left"
        theme="dark"
        transition={Slide}
      />

      <DialogModal
        isOpen={showEditModal}
        onClose={dismissEditModal}
        maxWidth="sm"
      >
        <DialogModal.Content title={modalTitle}>
          <div className="mt-4">
            <form onSubmit={submitTag} id="tag-form">
              <div>
                <InputLabel htmlFor="name">Tag Name</InputLabel>
                <TextInput
                  id="name"
                  type="text"
                  className="mt-1 block w-full"
                  name="name"
                  value={form.data.name}
                  onChange={e => form.setData('name', e.target.value)}
                  required
                  autoFocus
                  autoComplete="name"
                />
                <InputError className="mt-2" message={form.errors.name} />
              </div>

              <input
                type="hidden"
                name="parent_id"
                value={form.data.parent_id}
              />
            </form>
          </div>
        </DialogModal.Content>

        <DialogModal.Footer>
          <SecondaryButton onClick={dismissEditModal}>Cancel</SecondaryButton>

          <PrimaryButton
            className={classNames('ml-2', { 'opacity-25': form.processing })}
            form="tag-form"
            disabled={form.processing}
          >
            Submit
          </PrimaryButton>
        </DialogModal.Footer>
      </DialogModal>
    </>
  );
}
