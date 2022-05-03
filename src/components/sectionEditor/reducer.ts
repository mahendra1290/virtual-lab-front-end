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

type SectionEditorValue = {
  id: string
  name: string
  editorState: EditorState
}

export interface SectionEditorState {
  activeMenu: string,
  menus: SectionEditorMenu[]
  sectionData: {
    [key: string]: EditorState
  }
  activeEditorState: EditorState
  initial: boolean
}

export interface SectionEditorAction {
  type: ACTIONS,
  payload?: {
    section?: SectionEditorMenu,
    sectionId?: string,
    sectionName?: string,
    editorState?: EditorState,
    initialData?: SectionEditorValue[],
    defaultMenus?: string[]
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

    case ACTIONS.SET_INIITAL_DATA:
      const initData = action.payload?.initialData
      if (initData) {
        const tempMenus = initData.map((v) => ({ id: v.id || nanoid(), name: v.name, active: false }))
        // console.log(action.payload.initialData);
        const tempState = { ...state.sectionData };
        initData?.forEach(item => {
          tempState[item.id] = item.editorState
        })
        return { ...state, menus: tempMenus, sectionData: tempState }
      }
      return state

    case ACTIONS.SET_DEFAULT_MENUS:
      const names = action.payload?.defaultMenus;
      if (names) {
        const tMenus = names?.map((name) => ({ id: nanoid(5), name, active: false }))
        return { ...state, menus: tMenus }
      }
      return state

    default:
      return state;
  }
}

export { reducer }
