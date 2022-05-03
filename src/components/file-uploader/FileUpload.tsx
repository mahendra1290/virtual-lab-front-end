import { Button, useToast } from "@chakra-ui/react"
import {
  getDownloadURL,
  ref,
  uploadBytes,
  UploadResult,
} from "firebase/storage"
import { nanoid } from "nanoid"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useDropzone, FileWithPath } from "react-dropzone"
import { AiOutlineDelete } from "react-icons/ai"
import { storage } from "../../firebase"
import useLoading from "../../hooks/useLoading"
import { uploadFromBlobAsync } from "../../storage"

const splitFileName = (filename: string) => {
  const lastDotPos = filename.lastIndexOf(".")
  const ext = filename.substring(lastDotPos + 1)
  const name = filename.substring(0, lastDotPos)
  return [name, ext]
}

const normalizeFileName = (filename: string) => {
  const [basename, ext] = splitFileName(filename)
  return `${basename}-${nanoid(5)}.${ext}`
}

interface FileUploadProps {
  onFilesSelect?: (files: File[]) => void
  uploadUnderPath: string
  onUploadSuccess: (fileUrls: string[]) => void
}

const FileUpload = ({ onUploadSuccess, uploadUnderPath }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  })

  const [files, setFiles] = useState<FileWithPath[]>([])

  const { loading, startLoading, stopLoading } = useLoading()

  const fileUploadSuccessToast = useToast({
    title: "File uploaded successfully",
    duration: 2000,
    isClosable: true,
    position: "top",
    status: "success",
  })

  const handleRemoveFile = (path: string) => () => {
    const temp = files.filter((file) => file.path !== path)
    setFiles(temp)
  }

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  const filesList = files.map((file: FileWithPath) => (
    <li
      key={file.path}
      className="dark:bg-dark-600 mb-2 flex justify-between rounded border p-1"
    >
      <span>
        {file.path} - {file.size} bytes
      </span>
      <Button
        variant="outline"
        className="ml-auto"
        size="xs"
        onClick={handleRemoveFile(file.path || "")}
      >
        <AiOutlineDelete />
      </Button>
    </li>
  ))

  const handleUpload = async () => {
    startLoading()
    const promises: Promise<UploadResult>[] = []
    const bufferPromises: Promise<any>[] = []
    files.forEach((file) => {
      bufferPromises.push(file.arrayBuffer())
    })
    const bufferValues = await Promise.all(bufferPromises)
    files.forEach((file, index) => {
      const fileName = normalizeFileName(file.path || "")
      const fileRef = ref(storage, `${uploadUnderPath}/${fileName}`)
      promises.push(
        uploadBytes(fileRef, bufferValues[index], { contentType: file.type })
      )
    })
    const response = await Promise.all(promises)
    const urlPromises: Promise<string>[] = []
    const urls = response.map((res) => {
      return res.metadata.fullPath
      // urlPromises.push(getDownloadURL(res.ref))
    })
    // const urls = await Promise.all(urlPromises)
    onUploadSuccess(urls)
    setFiles([])
    stopLoading()
    fileUploadSuccessToast()
  }

  return (
    <section className="container ">
      <div
        {...getRootProps({
          className:
            "mt-4 rounded-lg border-2 border-dashed bg-gray-100 p-4 text-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:bg-gray-700 hover:dark:text-slate-300",
        })}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      {files.length > 0 && (
        <aside className="mt-2">
          <h4>
            Files
            <Button
              size="xs"
              className="ml-2"
              colorScheme={"red"}
              onClick={handleRemoveAllFiles}
            >
              Discard All
            </Button>
          </h4>
          <ul className="mt-2">{filesList}</ul>
          <Button
            marginTop="1"
            onClick={handleUpload}
            colorScheme="blue"
            isLoading={loading}
            loadingText="Uploading..."
            size="sm"
          >
            Upload
          </Button>
        </aside>
      )}
    </section>
  )
}

export default FileUpload
