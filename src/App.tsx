import 'bootstrap/dist/css/bootstrap.min.css'

import React, { useState, useEffect } from 'react'
import { Button, Badge, Input,  } from 'reactstrap'


const filePickerOptions = {
  excludeAcceptAllOption: false,
  multiple: false
}

const getFile = async (): Promise<false | File> => {
  // Open file picker.
  const [fileHandle] = await showOpenFilePicker(filePickerOptions)

  // Request file access permissions.
  if (await fileHandle.requestPermission({mode: 'readwrite'}) !== 'granted') {
    return false
  }

  // Retrieve the actual file object.
  const file = await fileHandle.getFile()
  return file
}

interface LoadFileFormProps {
  file: File | false | null,
  setFile: Function
}

const LoadFileForm = (props: LoadFileFormProps): JSX.Element => {
  const fileName = props.file ? props.file.name : 'No file selected'

  return (
    <div>
      <Button color="primary" 
              onClick={async () => props.setFile(await getFile())}>
        Select file
      </Button>
      {' '}
      <Badge className="fw-normal lh-lg">
        {fileName}
      </Badge>
    </div>
  )
}

interface FileContentViewerProps {
  file: File | null | false
}

const FileContentViewer = (props: FileContentViewerProps): JSX.Element | null => {
  const file = props.file
  const charsToDisplayCount = 100
  const [displayedContent, setDisplayedContent] = useState<null | string>(null)
  const [currentReaderPos, setCurrentReaderPos] = useState<number>(0)

  useEffect(() => {
    if (file) {
      setCurrentReaderPos(0)
    }
  }, [file])

  useEffect(() => {
    const _getContent = async () => {
      if (file && currentReaderPos !== null) {
        setDisplayedContent(await file
          .slice(currentReaderPos, currentReaderPos + charsToDisplayCount).text())
      }
    }
    _getContent()
  }, [file, currentReaderPos])

  if (!file) {
    return null
  }

  const fileSize = file.size
  const sliderMin = 0
  const sliderMax = fileSize - charsToDisplayCount

  return (
    <div>
      {displayedContent}
      <Input type="range" value={currentReaderPos} min={sliderMin} max={sliderMax} onChange={(e) => {setCurrentReaderPos(e.target.valueAsNumber)}}/>
      <Badge>Viewing chars: {currentReaderPos}–{currentReaderPos + charsToDisplayCount} of {fileSize}</Badge>
     </div>
  )
}

const App = (): JSX.Element => {
  const [file, setFile] = useState<File | null | false>(null)

  return (
    <div>
      <LoadFileForm file={file} setFile={setFile} />
      <FileContentViewer file={file} />
    </div>
  )
}

export default App
