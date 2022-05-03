import { VStack, Divider, Spinner } from "@chakra-ui/react"
import { collection, getDocs } from "firebase/firestore"
import { getDownloadURL, ref } from "firebase/storage"
import React, { useEffect, useState } from "react"
import { db, storage } from "../../firebase"

interface LabFileMap {
  [key: string]: string[]
}

interface Props {
  collectionPath: string
  section: string
}

interface LabFiles {
  sectionId: string
  fileUrls: string[]
}

const FileViewer = ({ collectionPath, section }: Props) => {
  const [labFilesMap, setLabFilesMap] = useState<LabFileMap>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (collectionPath) {
      const cached = sessionStorage.getItem(collectionPath)
      if (cached) {
        setLabFilesMap(JSON.parse(cached))
        setLoading(false)
      } else {
        setLoading(true)
      }
      const labFilesRef = collection(db, collectionPath)
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
          sessionStorage.setItem(collectionPath, JSON.stringify(labFiles))
          setLabFilesMap(labFiles)
          setLoading(false)
        })
      })
    }
  }, [collectionPath])

  if (loading) {
    return (
      <div className="flex flex-col">
        <h1 className="mb-4 text-xl">Files</h1>
        <Spinner />
      </div>
    )
  }

  return (
    <div>
      {labFilesMap && labFilesMap[section]?.length > 0 && (
        <div>
          <VStack align="flex-start">
            <h1 className="mb-2 text-xl">Files</h1>
            <Divider />
            {loading && <Spinner />}
            {labFilesMap[section].map((url, idx) => {
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
      )}
    </div>
  )
}

export default FileViewer
