import axios from "axios";
import {  useEffect, useState } from "react"
import Note from "../Note/Note";
import { useFormik } from 'formik';
import * as Yup from 'yup'

export default function Home() {
  let [modal,setModal]=useState(false)
  let [notes,setNotes]=useState([])
  let [loading, setLoading] = useState(false)
  let [error, setError] = useState(null)
  let [success, setSuccess] = useState(null)
  function getNotes(){
    axios.get(`https://note-sigma-black.vercel.app/api/v1/notes`,{
      headers:{token:localStorage.getItem("token")}
    }).then(({data})=>{
      console.log(data);
      setNotes(data.notes)
    })
    .catch((error)=>{
      console.log(error);
      
    })
  }
  function clearModal(){
    setModal(false)
    formik.resetForm()
    setError("");
    setSuccess("");
  }
  useEffect(()=>{
    getNotes()
  },[])
  function handelSubmit(values) {
    setLoading(true)
    setError("");
    setSuccess("");
    axios.post(`https://note-sigma-black.vercel.app/api/v1/notes`, values,
    {headers:{token:localStorage.getItem("token")}}
  )

      .then(({ data }) => {
        console.log(data);
        setLoading(false)
        setSuccess(data.msg);
        getNotes()
        setTimeout(()=>{
          clearModal()
        },500)
        

      })
      .catch((error) => {
        console.log(error.response.data.msg);
        setLoading(false)
        setError(error.response.data.msg);
      })
    console.log(values);
  }
 let validationSchema = Yup.object().shape({
  title: Yup.string().min(3,"title must be at least 3 chars").required("email is required"),
  content: Yup.string().min(3,"content must be at least 3 chars").required("pass is required"),
  })

  let formik = useFormik({
    initialValues: {
      title: "",
      content: "",
    }
    , validationSchema
    , onSubmit: handelSubmit
  })

  return (
    <>
    <div className="flex flex-wrap">
      {notes.length!=0?notes.map((note)=><Note key={note._id} noteData={note} getNotes={getNotes} />) : null}
    </div>
    
    <div onClick={()=>setModal(true)} className="fixed bottom-10 right-10 bg-blue-700 w-14 h-14 rounded-full text-white flex items-center justify-center hover:scale-110 transition-all">
      <i className="fa fa-plus text-xl"></i>
    </div>
 
{modal && <div id="crud-modal" tabIndex={-1} aria-hidden="true" className=" flex h-screen bg-gray-400/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0  max-h-full">
    <div className="relative p-4 w-full max-w-md max-h-full">
     
      <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
     
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add Note
          </h3>

         
          <button onClick={clearModal} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
            <i className="fa fa-x"></i>
          </button>
        </div>
        {success && <div className="p-4 mb-1 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <span className="font-medium">{success}</span>
        </div>}
        {error && <div className="p-4 mb-1 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span className="font-medium">{error}</span>
        </div>}
        <form onSubmit={formik.handleSubmit} className="p-1 md:p-5">
          <div className="gap-4 mb-4 grid-cols-2">
            <div className="">
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
              <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.title} type="text" name="title" id="title"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
            </div>
            {formik.errors.title && formik.touched.title && <div className="mt-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
  <span className="font-medium">{formik.errors.title}</span> 
</div>}
            <div className="col-span-2">
              <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Note Content</label>
              <textarea name='content' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.content}  id="content" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write Your content here" defaultValue={""} />                    
            </div>
          </div>
          {formik.errors.content && formik.touched.content && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
  <span className="font-medium">{formik.errors.content}</span> 
</div>}
          <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          {
            loading?<i className="fa fa-spin fa-spinner"></i>
            :
            <> <i className="fa fa-plus align-middle"></i>
            Add 
            </>
          }
          </button>
        </form>
      </div>
    </div>
  </div>}
   


    </>
  )
}
