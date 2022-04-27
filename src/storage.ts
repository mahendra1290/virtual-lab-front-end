import { ref, uploadBytes } from 'firebase/storage';
import moment from 'moment';
import { storage } from './firebase';

export const uploadFromBlobAsync = async (file: File) => {
  const filename = `${moment().format('DD-MM-YYYY')}-${file.name}`
  if (file !== null && file !== undefined) {
    const storageRef = ref(storage, filename)
    try {
      const byteArray = await file.arrayBuffer()
      const res = await uploadBytes(storageRef, byteArray, {
        contentType: file.type
      })
      return res.ref.fullPath;
    } catch (err) {
      console.log(err);
      return ''
    }
  }

}
