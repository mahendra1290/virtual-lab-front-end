import { useCallback } from 'react';
import { FirestoreError, getDoc } from 'firebase/firestore';
import { collection, doc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useState } from 'react';
import { db } from '../firebase';
import { Experiment, Lab } from '../shared/types/Lab';
import axios from 'axios';

const useLab = (labId: string) => {

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  const [lab, setLab] = useState<Lab>()

  const [experiments, setExperiments] = useState<Experiment[]>()

  const [expLoading, setExpLoading] = useState(false);

  useEffect(() => {
    const tempLab = sessionStorage.getItem(labId);
    if (tempLab) {
      setLab(JSON.parse(tempLab) as unknown as Lab)
      fetchLabInBackground()
      fetchExperiments(labId)
    } else {
      fetchLab(labId)
      fetchExperiments(labId)
    }
  }, [labId])

  const fetchLab = async (labId: string) => {
    try {
      setLoading(true)
      const labColRef = collection(db, "labs")
      const labDocRef = doc(labColRef, labId)
      const docRef = await getDoc(labDocRef)
      if (docRef.exists()) {
        const data = docRef.data() as Lab
        setLab(data)
        console.log(data);

        sessionStorage.setItem(data.id, JSON.stringify(data))
      }
      setLoading(false)
    } catch (err: any) {
      const fireError = err as FirestoreError
      setError(fireError.name)
      setLoading(false)
    }
  }

  const fetchExperiments = async (labId: string) => {
    try {
      setExpLoading(true)
      const result = await axios.get(`/labs/${labId}/experiments`);
      setExperiments(result.data)
      setExpLoading(false)
    } catch (err) {
      console.log(err);
      setExpLoading(false)

    }
  }

  const fetchLabInBackground = async () => {
    try {
      const labColRef = collection(db, "labs")
      const labDocRef = doc(labColRef, labId)
      const docRef = await getDoc(labDocRef)
      if (docRef.exists()) {
        const data = docRef.data() as Lab
        setLab(data)
        sessionStorage.setItem(data.id, JSON.stringify(data))
      }
    } catch (err: any) {
      const fireError = err as FirestoreError
      setError(fireError.name)
    }
  }

  const refetch = useCallback(() => {
    fetchLab(labId)
  }, [labId])

  return { loading, lab, error, experiments, refetch, expLoading };

}

export { useLab };
