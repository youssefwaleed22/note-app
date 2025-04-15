import axios from "axios";
import { useFormik } from "formik"
import { useContext, useState } from "react";
import * as Yup from 'yup'
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  let [loading, setLoading] = useState(false)
  let [error, setError] = useState(null)
  let [success, setSuccess] = useState(null)
  let {setToken} =useContext(UserContext)
  let navigate = useNavigate();
  function handelSubmit(values) {
    setLoading(true)
    setError("");
    setSuccess("");
    axios.post(`https://note-sigma-black.vercel.app/api/v1/users/signIn`, values)
      .then(({ data }) => {
        console.log(data);
        setLoading(false)
        setSuccess(data.msg);
        localStorage.setItem("token","3b8ny__"+data.token);
        setToken("3b8ny__"+data.token);
        setTimeout(()=>{
          navigate("/")
        },1500)
      })
      .catch((error) => {
        console.log(error.response.data.msg);

        setLoading(false)
        setError(error.response.data.msg);
      })
    console.log(values);
  }
  let validationSchema = Yup.object().shape({
    email: Yup.string().email("please enter a valid email").required("email is required"),
    password: Yup.string().matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/, "pass must Minimum eight characters, at least one letter and one number").required("pass is required"),
  })

  let formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    }
    , validationSchema
    , onSubmit: handelSubmit
  })

  return (
    <>

      <div className="max-w-sm mx-auto">
        <h2 className="text-3xl my-4 font-bold">Register :</h2>
        {success && <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <span className="font-medium">{success}</span>
        </div>}
        {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span className="font-medium">{error}</span>
        </div>}

        <form onSubmit={formik.handleSubmit}>

          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="email" id="email" name="email" value={formik.values.email} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
          </div>
          {formik.errors.email && formik.touched.email && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <span className="font-medium">{formik.errors.email}</span>
          </div>}

          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="password" id="password" name="password" value={formik.values.password} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
          </div>
          {formik.errors.password && formik.touched.password && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <span className="font-medium">{formik.errors.password}</span>
          </div>}


          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{loading ? <i className="fa fa-spin fa-spinner"></i> : "Submit"}</button>
        </form>
      </div>



    </>
  )
}
