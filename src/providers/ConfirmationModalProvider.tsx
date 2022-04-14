import React, { useReducer, useState } from "react"

enum ACTIONS {
  OPEN_MODAL = "OPEN MODAL",
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

const reducer = (state: ConfirmModalState, action: ConfirmModalAction) => {
  const { type, payload } = action
}

interface IConfirmationModalContext {
  open: boolean
  header: string
  body: string
  createModal: (
    header: string,
    body: string
  ) => { show: (onOk: () => void, onCancel: () => void) => void }
  onOk: () => void
  onCancel: () => void
}

export const ConfirmationModalContext =
  React.createContext<IConfirmationModalContext | null>(null)

type Props = {
  children: React.ReactChild | React.ReactChildren
}

// const ConfirmationModalProvider = ({ children }: Props) => {
//   const [state, dispatch] = useReducer(reducer, { open: false })

//   const createModal = (header: string, body: string) => {
//     return {
//       show: (onOk: () => void, onCancel: () => void) => {
//         setOnOk(onOk)
//         setOnCancel(onCancel)
//         setHeader(header)
//         setBody(body)
//         setOpen(true)
//       },
//     }
//   }

//   return (
//     <ConfirmationModalContext.Provider
//       value={{ open, header, body, createModal, onOk, onCancel }}
//     >
//       {children}
//     </ConfirmationModalContext.Provider>
//   )
// }

// export default ConfirmationModalProvider
