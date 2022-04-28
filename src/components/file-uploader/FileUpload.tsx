import { Button, useToast } from "@chakra-ui/react"
import { ref, uploadBytes } from "firebase/storage"
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
}

const FileUpload = ({ onFilesSelect, uploadUnderPath }: FileUploadProps) => {
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
      className="mb-2 flex justify-between rounded border p-1"
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
    const promises: Promise<any>[] = []
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
    await Promise.all(promises)
    setFiles([])
    stopLoading()
    fileUploadSuccessToast()
  }

  return (
    <section className="container ">
      <div
        {...getRootProps({
          className:
            "mt-4 rounded-lg border-2 border-dashed bg-gray-100 p-4 text-center text-gray-400 hover:bg-gray-50 hover:text-gray-600",
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
