import React, {
  ChangeEvent,
  ChangeEventHandler,
  Children,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import { FiDelete } from "react-icons/fi"
import { BiRename } from "react-icons/bi"
import {
  Button,
  Divider,
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
import FileUpload from "../file-uploader/FileUpload"

export type SectionEditorValue = {
  id: string
  name: string
  editorState: EditorState
  order: number
}

type LabMenuPanelProps = {
  className?: string
  initialValue?: SectionEditorValue[]
  onChange?: (value: SectionEditorValue[]) => void
  defaultMenus?: string[]
  uploadUnderPath?: string
  extraRightContent?: React.Component | JSX.Element
}

const activeMenuStyle = "bg-slate-200 text-teal-700 font-bold"

const unactiveMenuStyle = "bg-slate-50 text-black"

const SectionEditor = ({
  className,
  onChange,
  initialValue,
  defaultMenus,
  extraRightContent,
  uploadUnderPath,
}: LabMenuPanelProps) => {
  const [state, dispatch] = useReducer(reducer, {
    activeMenu: "",
    menus: [],
    sectionData: {},
    activeEditorState: DraftEditorState.createEmpty(),
    initial: false,
  })

  const [defaultMenuAdded, setDefaultMenuAdded] = useState(false)

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
  }

  useEffect(() => {
    if (initialValue && initialValue?.length > 0 && !state.initial) {
      dispatch({
        type: ACTIONS.SET_INIITAL_DATA,
        payload: { initialData: initialValue },
      })
    }
  }, [initialValue])

  useEffect(() => {
    if (defaultMenus && !defaultMenuAdded) {
      dispatch({
        type: ACTIONS.SET_DEFAULT_MENUS,
        payload: { defaultMenus: defaultMenus },
      })
      setDefaultMenuAdded(true)
    }
  }, [defaultMenus])

  useEffect(() => {
    const sections: SectionEditorValue[] = []
    state.menus.forEach((menu, index) => {
      sections.push({
        ...menu,
        editorState: state.sectionData[menu.id],
        order: index,
      })
    })
    if (onChange) {
      onChange(sections)
    }
  }, [state.sectionData])

  useEffect(() => {
    if (!activeMenu && menus.length > 0) {
      dispatch({
        type: ACTIONS.SELECT_SECTION,
        payload: {
          sectionId: menus.at(0)?.id,
        },
      })
    }
  }, [menus])

  const activeMenuItem = useMemo(() => {
    return menus.find((item) => item.id === activeMenu)
  }, [activeMenu, menus])

  return (
    <div className="flex h-[calc(100vh-130px)] gap-4">
      <div
        className={`${className} flex w-1/5 flex-col gap-2 overflow-y-auto overflow-x-hidden rounded-md border border-slate-200 p-2 shadow-sm`}
      >
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
                defaultValue={menu.name}
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
          colorScheme="cyan"
          size="sm"
        >
          New Section
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto overflow-x-hidden rounded border py-2 px-4">
        <h1 className="text-xl capitalize">{activeMenuItem?.name}</h1>
        <Divider />
        <div className="mt-4">
          <TextEditor
            value={activeEditorState}
            onChange={(editorState) => {
              dispatch({
                type: ACTIONS.EDITOR_STATE_CHANGE,
                payload: { editorState, sectionId: activeMenu },
              })
            }}
          />
          <FileUpload
            uploadUnderPath={`/${uploadUnderPath || "temp"}/${
              activeMenuItem?.id
            }`}
            onFilesSelect={(files) => console.log(files)}
          />
        </div>
      </div>
    </div>
  )
}

export default SectionEditor
