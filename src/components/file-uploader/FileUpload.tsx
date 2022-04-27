import { Button } from "@chakra-ui/react"
import React, { useEffect, useMemo, useState } from "react"
import { useDropzone, FileWithPath } from "react-dropzone"
import { AiOutlineDelete } from "react-icons/ai"
import { uploadFromBlobAsync } from "../../storage"

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void
}

const FileUpload = ({ onFilesSelect }: FileUploadProps) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

  const [removedFiles, setRemovedFiles] = useState<string[]>([])

  const handleRemoveFile = (path: string) => () => {
    const temp = [...removedFiles]
    temp.push(path)
    setRemovedFiles(temp)
  }

  const handleRemoveAllFiles = () => {
    const temp = acceptedFiles.map((file: FileWithPath) => file.path || "")
    setRemovedFiles(temp)
  }

  const filteredFiles = useMemo(() => {
    return acceptedFiles.filter(
      (file: FileWithPath) => !removedFiles.includes(file.path || "")
    )
  }, [removedFiles, acceptedFiles])

  useEffect(() => {
    onFilesSelect(filteredFiles)
  }, [filteredFiles])

  const files = filteredFiles.map((file: FileWithPath) => (
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
          <ul className="mt-2">{files}</ul>
        </aside>
      )}
    </section>
  )
}

export default FileUpload
