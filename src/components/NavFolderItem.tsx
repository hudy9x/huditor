import { nanoid } from "nanoid";
import { useState } from "react";
import { readDirectory, writeFile } from "../helpers/filesys";
import { saveFileObject } from "../stores/file";
import { IFile } from "../types";
import NavFiles from "./NavFiles";

interface Props {
  file: IFile;
  active: boolean;
}
export default function NavFolderItem({ file, active }: Props) {
  const [files, setFiles] = useState<IFile[]>([])
  const [unfold, setUnfold] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [newFile, setNewFile] = useState(false)
  const [filename, setFilename] = useState('')

  const onShow = async (ev: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    ev.stopPropagation()

    if (loaded) {
      setUnfold(!unfold)
      return;
    }

    const entries = await readDirectory(file.path + '/')

    setLoaded(true)
    setFiles(entries)
    setUnfold(!unfold)
  }

  const onEnter = (key: string) => { 
    if (key === 'Escape') {
      setNewFile(false)
      setFilename('')
      return;
    }

    if (key !== 'Enter') return;

    const filePath = `${file.path}/${filename}`
    
    writeFile(filePath, '').then(() => {
      const id = nanoid();
      const newFile: IFile = {
        id,
        name: filename,
        path: filePath,
        kind: 'file'
      }

      saveFileObject(id, newFile)
      setFiles(prevEntries => [newFile, ...prevEntries])
      setNewFile(false)
      setFilename('')
    })
    
  }

  return <div className="soure-item">
    <div className={`source-folder ${active ? 'bg-gray-200' : ''} flex items-center gap-2 px-2 py-0.5 text-gray-500 hover:text-gray-400 cursor-pointer`}>
      <i className="ri-folder-fill text-yellow-500"></i>
      <div className="source-header flex items-center justify-between w-full group">
        <span onClick={onShow}>{file.name}</span>
        <i onClick={() => setNewFile(true)} className="ri-add-line invisible group-hover:visible"></i>
      </div>
    </div>

      {newFile ? <div className="mx-4 flex items-center gap-0.5 p-2">
      <i className="ri-file-edit-line text-gray-300"></i>
      <input type="text" value={filename} 
        onChange={(ev) => setFilename(ev.target.value)}
        onKeyUp={(ev) => onEnter(ev.key)}
        className="inp"
        />
    </div> : null}

    <NavFiles visible={unfold} files={files} />
  </div>
}
