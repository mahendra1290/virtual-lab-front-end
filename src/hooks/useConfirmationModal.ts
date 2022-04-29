import { ConfirmationModalProps } from './../components/modals/ConfirmationModal';
import { useReducer, useState } from 'react';

enum ACTIONS {
  OPEN_MODAL = "OPEN MODAL",
  CLOSE_MODAL = 'CLOSE MODAL'
}

interface ConfirmModalState {
  open: boolean
  header: string
  body: string
  onOkHandler: () => void
  onCancelHandler: () => void
}

interface ConfirmModalAction {
  type: ACTIONS
  payload?: {
    open?: boolean
    header?: string
    body?: string
    onOkHandler?: () => void
    onCancelHandler?: () => void
  }
}

const reducer = (state: ConfirmModalState, action: ConfirmModalAction): ConfirmModalState => {
  const { type, payload } = action
  const defaultHandler = () => { }
  switch (type) {
    case ACTIONS.OPEN_MODAL: {
      return {
        ...state,
        open: true,
        header: payload?.header || '',
        body: payload?.body || '',
        onOkHandler: payload?.onOkHandler || defaultHandler,
        onCancelHandler: payload?.onCancelHandler || defaultHandler,
      }
    }
    case ACTIONS.CLOSE_MODAL: {
      return {
        ...state,
        open: false,
        header: '',
        body: '',
        onCancelHandler: defaultHandler,
        onOkHandler: defaultHandler
      }
    }
  }
}

interface ModalOptions {
  header: string,
  body: string,
  onOk?: () => void,
  onCancel?: () => void
}

interface UseCofirmModalOptions {
  header?: string,
  body?: string,
  onOkBtnText?: string,
  onCancelBtnText?: string
}

export const useConfirmationModal = (options?: UseCofirmModalOptions) => {

  const [state, dispatch] = useReducer(reducer, {
    open: false,
    header: options?.header || '',
    body: options?.body || '',
    onOkHandler: () => { },
    onCancelHandler: () => { }
  })

  const handleOk = () => {
    if (state.onOkHandler) {
      state.onOkHandler();
    }
    dispatch({ type: ACTIONS.CLOSE_MODAL })
  }

  const handleOnClose = () => {
    if (state.onCancelHandler) {
      state.onCancelHandler();
    }
    dispatch({ type: ACTIONS.CLOSE_MODAL })
  }

  const modalProps: ConfirmationModalProps = {
    header: state.header,
    body: state.body,
    isOpen: state.open,
    onOk: handleOk,
    onClose: handleOnClose,
    okBtnText: options?.onOkBtnText,
    cancelBtnText: options?.onCancelBtnText
  }
  return {
    makeModal: (options?: ModalOptions) => {
      if (options) {
        dispatch({ type: ACTIONS.OPEN_MODAL, payload: { header: options.header, body: options.body, onOkHandler: options.onOk, onCancelHandler: options.onCancel } })
      }
    },
    modalProps
  }

}
