import React, {
  ChangeEvent,
  ChangeEventHandler,
  Children,
  useEffect,
  useReducer,
  useState,
} from "react"
import { FiDelete } from "react-icons/fi"
import { BiRename } from "react-icons/bi"
import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  Tooltip,
} from "@chakra-ui/react"
import TextEditor from "../TextEditor/TextEditor"
import { nanoid } from "nanoid"
import { FcDeleteRow } from "react-icons/fc"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { reducer } from "./reducer"
import {
  EditorState as DraftEditorState,
  convertToRaw,
  convertFromRaw,
} from "draft-js"
import { EditorState } from "react-draft-wysiwyg"
import { ACTIONS } from "./actions"

type SectionEditorValue = {
  id: string
  name: string
  editorState: EditorState
}

type LabMenuPanelProps = {
  className?: string
  initialValue?: SectionEditorValue[]
  onChange?: (value: SectionEditorValue[]) => void
}

const activeMenuStyle =
  "bg-slate-100 text-teal-700 font-bold border-2 border-black"

const unactiveMenuStyle =
  "bg-slate-50 text-black border border-slate-50 border-2"

const SectionEditor = ({
  className,
  onChange,
  initialValue,
}: LabMenuPanelProps) => {
  const [state, dispatch] = useReducer(reducer, {
    activeMenu: "",
    menus: [],
    sectionData: {},
    activeEditorState: DraftEditorState.createEmpty(),
  })

  const { menus, activeMenu, activeEditorState } = state

  const handleMenuAdd = () => {
    dispatch({ type: ACTIONS.ADD_SECTION })
  }

  const handleMenuDelete = (id: string) => () => {
    dispatch({ type: ACTIONS.DELETE_SECTION, payload: { sectionId: id } })
  }

  const handleMenuChange = (id: string) => (val: string) => {
    dispatch({
      type: ACTIONS.EDIT_SECTION,
      payload: { sectionId: id, sectionName: val },
    })
  }

  const handleMenuClick = (id: string) => () => {
    dispatch({
      type: ACTIONS.SELECT_SECTION,
      payload: { sectionId: id },
    })
  }

  const handleSaveExperiment = () => {
    const sectionStates = Object.entries(state.sectionData).map(
      ([key, val]) => {
        return { [key]: convertToRaw(val.getCurrentContent()) }
      }
    )
    console.log(sectionStates)
  }

  useEffect(() => {
    const sections: SectionEditorValue[] = []
    state.menus.forEach((menu) => {
      sections.push({ ...menu, editorState: state.sectionData[menu.id] })
    })
    if (onChange) {
      onChange(sections)
    }
  }, [state.sectionData])

  return (
    <div className="flex gap-4 p-8">
      <div className={`${className} flex w-1/5 flex-col gap-2 rounded-md`}>
        {menus.length === 0 && <h2 className="mx-auto">No sections added</h2>}
        {menus.map((menu) => (
          <div
            key={menu.id}
            role="button"
            onClick={handleMenuClick(menu.id)}
            className={
              (activeMenu === menu.id ? activeMenuStyle : unactiveMenuStyle) +
              " group rounded-md p-2 hover:cursor-pointer hover:bg-slate-100"
            }
          >
            <div className="flex">
              <Editable
                width="full"
                // value={menu.name}
                // defaultValue={menu.name}
                isPreviewFocusable
                // onChange={handleMenuChange(menu.id)}
                placeholder="Enter section name"
                submitOnBlur
                className="capitalize"
                onSubmit={handleMenuChange(menu.id)}
              >
                <EditablePreview width="full" />
                <EditableInput className="capitalize" width="full" />
              </Editable>
              <div className="hidden items-center justify-center group-hover:flex">
                <Tooltip label="Delete section">
                  <IconButton
                    variant="link"
                    aria-label={`delete ${menu.name}`}
                    icon={<FiDelete />}
                    onClick={handleMenuDelete(menu.id)}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
        <Button
          marginTop="2"
          width="fit-content"
          onClick={handleMenuAdd}
          marginInline="auto"
        >
          New Section
        </Button>
      </div>
      <div className="flex-grow">
        <TextEditor
          value={activeEditorState}
          onChange={(editorState) => {
            dispatch({
              type: ACTIONS.EDITOR_STATE_CHANGE,
              payload: { editorState, sectionId: activeMenu },
            })
          }}
        />
        <Button colorScheme="linkedin" className="mt-4">
          Upload Files
        </Button>
        <Button colorScheme="linkedin" className="mt-4 ml-4">
          Add Links
        </Button>
      </div>
    </div>
  )
}

export default SectionEditor
