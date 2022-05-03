import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  collection,
  deleteDoc,
  doc,
  FirestoreError,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore"
import {
  Box,
  Button,
  Divider,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useToast,
  VStack,
} from "@chakra-ui/react"
import draftToHtml from "draftjs-to-html"
import { db, storage } from "../firebase"
import { ExperimentCard } from "../components/experiment/ExperimentCard"
import axios from "axios"
import LabMenuPanel from "../components/labs/LabMenuPanel"
import Header from "../components/header/header"
import { LabOptionMenu, LabMenus } from "../components/labs/LabOptionMenu"
import { useConfirmationModal } from "../hooks/useConfirmationModal"
import ConfirmationModal from "../components/modals/ConfirmationModal"
import LabSettings from "../components/labs/LabSettings"
import { useLabContext } from "../providers/LabProvider"
import { useLab } from "../hooks/useLab"
import LabInviteModal from "../components/LabInviteModal"
import TeacherSessions from "../components/Sessions/TeacherSessions"
import { getDownloadURL, getMetadata, ref } from "firebase/storage"
import LabLoadingSkeleton from "../components/skeletons/LabLoadingSkeleton"
import FileViewer from "../components/file-viewer/FileViewer"

interface LabFiles {
  sectionId: string
  fileUrls: string[]
}

interface LabFileMap {
  [key: string]: string[]
}

const LabPage = () => {
  const { id } = useParams()

  const {
    lab,
    loading: labLoading,
    error: labError,
    experiments,
    expLoading,
  } = useLab(id || "")

  const { makeModal, modalProps } = useConfirmationModal()
  const navigate = useNavigate()
  const deleteToast = useToast({
    title: "Lab deleted successfully",
    status: "success",
    duration: 2000,
    isClosable: true,
  })

  const inviteSentToast = useToast({
    title: "Invite sent successfully",
    status: "success",
    duration: 2000,
    isClosable: true,
    position: "top",
  })

  const somethingWentWrongToast = useToast({
    title: "Something went wrong",
    description: "Please try again later",
    status: "error",
    duration: 2000,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [labFilesMap, setLabFilesMap] = useState<LabFileMap>()

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const openModal = () => {
    setModalOpen(true)
  }

  const handleAddExperiment = () => {
    navigate(`/t/experiments/create?lab=${lab?.id}`)
  }

  const showDeleteLabConfirmation = () => {
    makeModal({
      header: `Delete ${lab?.name}`,
      body: "This will delete all data. Are you sure?",
      onOk: handleDeleteLab,
    })
  }

  const handleDeleteLab = async () => {
    try {
      setDeleteLoading(true)
      await deleteDoc(doc(collection(db, "labs"), lab?.id))
      setDeleteLoading(false)
      deleteToast()
      setTimeout(() => {
        navigate(-1)
      }, 500)
    } catch (err: any) {
      const error = err as FirestoreError
      console.log(error.message)
    }
  }

  const handleSendEmail = async (emails: string[]) => {
    handleModalClose()
    try {
      await axios.post("/notifications/lab-invite", {
        emails,
        labJoinUrl: lab?.joiningLink?.url,
        labName: lab?.name,
      })
      inviteSentToast()
    } catch (err) {
      somethingWentWrongToast()
    }
  }

  useEffect(() => {
    if (lab) {
      const labFilesRef = collection(db, `lab-files-${lab.id}`)
      getDocs(labFilesRef).then((files) => {
        const promises: Promise<[string, string]>[] = []
        files.docs.forEach((doc) => {
          const docData = doc.data() as LabFiles
          docData.fileUrls.forEach((path) => {
            const prom = new Promise<[string, string]>((resolve) => {
              getDownloadURL(ref(storage, path)).then((link) => {
                resolve([docData.sectionId, link])
              })
              return [docData.sectionId]
            })
            promises.push(prom)
          })
        })
        const labFiles: {
          [key: string]: string[]
        } = {}
        Promise.all(promises).then((values) => {
          values.forEach((value) => {
            const [sectionId, url] = value
            if (!labFiles[sectionId]) {
              labFiles[sectionId] = [url]
            } else {
              labFiles[sectionId].push(url)
            }
          })

          setLabFilesMap(labFiles)
        })
      })
    }
  }, [lab])

  const sectionData = useMemo(() => {
    const data: { [key: string]: string } = {}
    if (lab && lab.sectionData) {
      lab.sectionData.forEach((val) => {
        data[val.name] = draftToHtml(val.editorState)
      })
    }
    return data
  }, [lab])

  const sections = useMemo(() => {
    if (lab) {
      console.log("lbasects")

      const arr = Object.keys(sectionData).map((sectionName) => sectionName)
      arr.push("Experiments", "Students", "Settings", "Sessions")
      return arr
    }
    return []
  }, [sectionData])

  if (!activeSection && sections.length > 0) {
    setActiveSection(sections.at(0) || "")
  }

  const RightSection = useMemo(() => {
    if (activeSection === "Experiments") {
      return (
        <>
          {expLoading && (!experiments || experiments?.length == 0) && (
            <div className="mt-4 flex flex-col items-center p-4">
              <Spinner />
              Fetching Experiments...Please wait
            </div>
          )}
          <VStack spacing={4} align={"strecth"} className="mt-4 w-1/2">
            {experiments?.map((item, idx) => (
              <Link key={item.id} to={`experiments/${item.id}`}>
                <ExperimentCard srNo={idx + 1} {...item} key={item.id} />
              </Link>
            ))}
          </VStack>
          {!expLoading && experiments && experiments?.length === 0 && (
            <h1>No experiments found</h1>
          )}
        </>
      )
    } else if (activeSection === "Settings") {
      return <LabSettings lab={lab} />
    } else if (activeSection === "Students") {
      return (
        <>
          <VStack align="strecth" marginTop="3">
            {lab?.students?.map((student) => (
              <Box
                key={student.uid}
                onClick={() =>
                  navigate(`/t/labs/${lab.id}/students/${student.uid}`)
                }
                role="button"
                className="w-full rounded bg-slate-100 px-4 py-2 text-gray-800 shadow-sm hover:bg-slate-200 dark:bg-gray-600 dark:text-slate-200 hover:dark:bg-gray-500  lg:w-1/2"
              >
                <h2 className="text-lg">{student.name}</h2>
                <p className="text-sm">{student.email}</p>
              </Box>
            ))}
          </VStack>
          <Button size="sm" className="mt-4" onClick={openModal}>
            Invite Students
          </Button>
        </>
      )
    } else if (activeSection === "Sessions" && lab) {
      return <TeacherSessions lab={lab} experiments={experiments || []} />
    } else {
      return (
        <div
          style={{ height: "calc(100% - 36px)" }}
          className="flex flex-col justify-between overflow-auto"
        >
          <div
            style={{ width: "100%" }}
            className="reset-tailwindcss"
            dangerouslySetInnerHTML={{ __html: sectionData[activeSection] }}
          />
          <FileViewer
            collectionPath={`lab-files-${lab?.id}`}
            section={activeSection}
          />
          {/* {labFilesMap && labFilesMap[activeSection]?.length > 0 && (
            <div>
              <VStack align="flex-start">
                <h1 className="mb-2 text-xl">Files</h1>
                <Divider />
                {labFilesMap[activeSection].map((url, idx) => {
                  return (
                    <div key={url}>
                      <span>{idx + 1}. &nbsp;</span>
                      <a
                        target="_blank"
                        href={url}
                        className="whitespace-nowrap text-blue-500"
                      >
                        {url.slice(0, 100)}...
                      </a>
                    </div>
                  )
                })}
              </VStack>
            </div>
          )} */}
        </div>
      )
    }
  }, [activeSection, experiments, labFilesMap])

  if (labLoading) {
    return <LabLoadingSkeleton isLoading />
  }

  const handleLabOptionMenuClick = (menu: LabMenus) => {
    switch (menu) {
      case "edit":
        navigate(`/t/labs/${lab?.id}/edit`)
      case "delete":
        showDeleteLabConfirmation()
    }
  }

  return (
    <>
      <Header
        title={lab?.name || ""}
        pathList={[["/t", "labs"], lab?.name || ""]}
        rightContent={
          <div className="space-x-4">
            <Button onClick={handleAddExperiment}>Add Experiment</Button>
            <LabOptionMenu onMenuClick={handleLabOptionMenuClick} />
          </div>
        }
      />
      <div className="p-8">
        <div className="flex gap-4">
          <LabMenuPanel
            activeMenu={activeSection}
            onChange={setActiveSection}
            className="w-1/4 rounded-md border p-4"
            menus={sections}
          />
          <div className="w-3/4 rounded-md border p-4">
            <h1 className="mb-2 text-xl">{activeSection}</h1>
            <Divider />
            {RightSection}
          </div>
        </div>

        <ConfirmationModal {...modalProps} />

        <Modal size="2xl" isOpen={modalOpen} onClose={handleModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Invite Students</ModalHeader>
            <ModalCloseButton />
            <LabInviteModal onSubmit={handleSendEmail} />
          </ModalContent>
        </Modal>
      </div>
    </>
  )
}

export default LabPage
