import { nanoid } from 'nanoid';
import { EditorState } from "react-draft-wysiwyg"
import {
  EditorState as DraftEditorState,
  convertToRaw,
  convertFromRaw,
} from "draft-js"
import { ACTIONS } from "./actions"

interface SectionEditorMenu {
  id: string,
  name: string,
  active: boolean
}

export interface SectionEditorState {
  activeMenu: string,
  menus: SectionEditorMenu[]
  sectionData: {
    [key: string]: EditorState
  }
  activeEditorState: EditorState
}

export interface SectionEditorAction {
  type: ACTIONS,
  payload?: {
    section?: SectionEditorMenu,
    sectionId?: string,
    sectionName?: string,
    editorState?: EditorState,
  }
}

const reducer = (state: SectionEditorState, action: SectionEditorAction): SectionEditorState => {

  const { sectionId, sectionName } = action.payload || {}

  switch (action.type) {
    case ACTIONS.ADD_SECTION:
      const newSection = {
        id: nanoid(5),
        name: '',
        active: true
      }
      const menuCopy = [...state.menus]
      menuCopy.push(newSection)
      return { ...state, menus: menuCopy, activeMenu: newSection.id }

    case ACTIONS.EDIT_SECTION:

      if (sectionId) {
        const menuCopy = [...state.menus]
        const sectionCopy = menuCopy.find((item) => item.id === sectionId)
        if (sectionCopy) {
          sectionCopy.name = sectionName || ''
        }
        return { ...state, menus: menuCopy }
      }
      return state;

    case ACTIONS.SELECT_SECTION:
      if (sectionId) {
        const menuCopy = [...state.menus]
        menuCopy.forEach((item) => {
          if (item.id !== sectionId) {
            item.active = false;
          } else {
            item.active = true;
          }
        })
        const editorState = state.sectionData[sectionId]
        return { ...state, menus: menuCopy, activeMenu: sectionId, activeEditorState: editorState }
      }

    case ACTIONS.DELETE_SECTION:
      if (sectionId) {
        const filteredMenu = state.menus.filter((item) => item.id !== sectionId)
        let activeMenu = state.activeMenu
        if (activeMenu === sectionId) {
          activeMenu = filteredMenu.at(0)?.id || ''
        }
        return { ...state, menus: filteredMenu, activeMenu }
      }

    case ACTIONS.EDITOR_STATE_CHANGE:
      if (sectionId) {
        const newEditorData = action.payload?.editorState || DraftEditorState.createEmpty()
        return { ...state, sectionData: { ...state.sectionData, [sectionId]: newEditorData }, activeEditorState: newEditorData }
      }

    default:
      return state;
  }
}

export { reducer }
