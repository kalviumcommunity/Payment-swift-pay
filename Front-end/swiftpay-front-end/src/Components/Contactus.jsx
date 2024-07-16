import * as React from "react";
import { db } from "../../Firebase/Fire.config";
import { collection, addDoc } from "firebase/firestore"; 
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = React.useState({
    lastName: '',
    firstName: '',
    email: '',
    phoneNumber: '',
    message: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "contacts"), {
        ...formData,
        timestamp: new Date(),
      });
      toast.success("Thank you for your details!");
      setFormData({
        lastName: '',
        firstName: '',
        email: '',
        phoneNumber: '',
        message: '',
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleClose = () => {
    navigate('/'); // navigate to the landing page
  };

  return (
    <div className="flex justify-center items-center px-16 py-20 max-md:px-5">
      <div className="flex flex-col w-full max-w-[1092px] max-md:max-w-full">
        <div className="flex flex-col self-center max-md:max-w-full">
          <div className="self-center text-7xl font-extrabold tracking-tighter text-blue-500 bg-clip-text max-md:max-w-full max-md:text-4xl">
            Get in touch
          </div>
          <div className="mt-2 text-2xl font-medium tracking-tight text-blue-500 max-md:max-w-full">
            Reach out, and let's create a universe of possibilities together!
          </div>
        </div>
        <button onClick={handleClose} className="absolute top-5 right-5 text-blue-500">
          <FaTimes size={30} />
        </button>
        <form onSubmit={handleSubmit} className="relative p-5 mt-16 rounded-3xl border-2 border-solid backdrop-blur-[190px] bg-white bg-opacity-0 border-blue-500 max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow p-10 max-md:px-5 max-md:mt-10 max-md:max-w-full">
                <div className="flex flex-col text-blue-500 max-md:max-w-full">
                  <div className="text-3xl font-semibold tracking-tight max-md:max-w-full">
                    Let's connect our visions
                  </div>
                  <div className="mt-2 text-base tracking-normal max-md:max-w-full">
                    Let's align our ambitions! Reach out and let the power of collaboration illuminate our financial horizons.
                  </div>
                </div>
                <div className="flex flex-col mt-10 text-base tracking-normal text-blue-500 text-opacity-80 max-md:mt-10 max-md:max-w-full">
                  <div className="flex gap-3.5 max-md:flex-wrap max-md:max-w-full">
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="flex-1 px-3.5 py-3 rounded-md border border-solid bg-white bg-opacity-20 border-white text-blue-500 placeholder-blue-500 max-md:pr-5"
                    />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="flex-1 px-3.5 py-3 rounded-md border border-solid bg-white bg-opacity-20 border-white text-blue-500 placeholder-blue-500 max-md:pr-5"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="px-3.5 py-3 mt-3.5 rounded-md border border-solid bg-white bg-opacity-20 border-white text-blue-500 placeholder-blue-500 max-md:pr-5 max-md:max-w-full"
                  />
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="px-3.5 py-3 mt-3.5 rounded-md border border-solid bg-white bg-opacity-20 border-white text-blue-500 placeholder-blue-500 max-md:pr-5 max-md:max-w-full"
                  />
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    className="px-3.5 py-3 mt-3.5 rounded-md border border-solid bg-white bg-opacity-20 border-white text-blue-500 placeholder-blue-500 max-md:pr-5 max-md:max-w-full"
                  />
                  <button type="submit" className="flex justify-center items-center px-2.5 py-3 mt-3.5 font-medium text-white bg-blue-500 rounded-md max-md:px-5 max-md:max-w-full">
                    <div className="flex gap-2.5">
                      <div>Send it to the Hub</div>
                      <img
                        loading="lazy"
                        srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/60221e7535cac3883ecdbc65d7bebd166142ed4a9a9721f8e70aa7aefcddcae7?apiKey=852a98c768de4e1c839ecb7dea26c44b&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/60221e7535cac3883ecdbc65d7bebd166142ed4a9a9721f8e70aa7aefcddcae7?apiKey=852a98c768de4e1c839ecb7dea26c44b&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/60221e7535cac3883ecdbc65d7bebd166142ed4a9a9721f8e70aa7aefcddcae7?apiKey=852a98c768de4e1c839ecb7dea26c44b&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/60221e7535cac3883ecdbc65d7bebd166142ed4a9a9721f8e70aa7aefcddcae7?apiKey=852a98c768de4e1c839ecb7dea26c44b&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/60221e7535cac3883ecdbc65d7bebd166142ed4a9a9721f8e70aa7aefcddcae7?apiKey=852a98c768de4e1c839ecb7dea26c44b&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/60221e7535cac3883ecdbc65d7bebd166142ed4a9a9721f8e70aa7aefcddcae7?apiKey=852a98c768de4e1c839ecb7dea26c44b&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/60221e7535cac3883ecdbc65d7bebd166142ed4a9a9721f8e70aa7aefcddcae7?apiKey=852a98c768de4e1c839ecb7dea26c44b&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/60221e7535cac3883ecdbc65d7bebd166142ed4a9a9721f8e70aa7aefcddcae7?apiKey=852a98c768de4e1c839ecb7dea26c44b&"
                        className="shrink-0 my-auto mix-blend-screen aspect-[2.17] w-[26px]"
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow justify-center text-base tracking-normal max-md:mt-10 max-md:max-w-full">
                <div className="flex overflow-hidden relative flex-col px-7 pt-20 pb-12 w-full min-h-[536px] max-md:px-5 max-md:max-w-full">
                  <img
                    loading="lazy"
                    src="https://th.bing.com/th/id/R.8c9d6f1c937fbccb32a1c9c6641cedbc?rik=wKwqsAr0Ul9CGw&riu=http%3a%2f%2fadvieswealth.com%2fimg%2fcontact.jpg&ehk=0pGnf4HK3%2bVyRN0oDg%2bumkKScR4NHJ%2bY4w3KvoD0drg%3d&risl=&pid=ImgRaw&r=0"
                    className="object-cover absolute inset-0 size-full"
                  />
                  <div className="flex relative flex-col mt-80 max-md:mt-10 max-md:max-w-full">
                    <div className="text-white max-md:max-w-full">
                      "Two months immersed in the financial hub revealed the fragile beauty of our world against the backdrop of the vast, silent universe, transforming my view of our place within it."
                    </div>
                    <div className="mt-1.5 font-medium text-white max-md:max-w-full">
                      Irinel Traista
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
