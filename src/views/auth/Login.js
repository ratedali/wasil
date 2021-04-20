import classnames from "classnames";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth, useFirestore } from 'reactfire';

export default function Login() {
  const auth = useAuth();
  const firestore = useFirestore();
  const location = useLocation();
  const history = useHistory();
  const [credentials, setCredentails] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState({});
  const handleChange = ({ target: { name, value } }) => {
    setCredentails(credentials => ({
      ...credentials,
      [name]: value,
    }));
    setError(error => ({
      ...error,
      [name]: undefined,
    }));
  };
  const handleSignIn = e => {
    async function signIn({ email, password }) {
      try {
        const results = await firestore
          .collection("staff")
          .where("email", "==", email)
          .get();
        if (results.empty) {
          throw new Error('Unknown email address');
        }
        await auth.signInWithEmailAndPassword(email, password);
        history.replace(location.state?.from ?? '/');
      } catch (err) {
        switch (err?.code) {
          case 'auth/invalid-email':
            setError({ email: 'Invalid email address.' });
            break;
          default:
            setError({ general: 'Incorrect email or password.' });
        }

      }
    }

    e.preventDefault();
    const { email, password } = credentials;
    if (!email || !password) {
      const error = {}
      if (!email) {
        error.email = 'Please enter your email address';
      }
      if (!password) {
        error.password = 'Please enter your password';
      }
      return setError(error);
    }
    setError({});
    signIn(credentials);
  }
  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="flex-auto px-4 lg:px-10 py-10">
                <form onSubmit={handleSignIn}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      className={classnames(
                        "border-0 px-3 py-3 rounded text-sm shadow w-full",
                        "text-blueGray-600 bg-white",
                        {
                          "placeholder-blueGray-300": !error.email && !error.general,
                          "placeholder-red-500 ring ring-red-500 focus:ring-red-500": error.email || error.general,
                        },
                        "focus:outline-none focus:ring",
                        "ease-linear transition-all duration-150")}
                      placeholder="Email"
                      onChange={handleChange}
                    />
                    {error.email
                      ? <p className="text-red-500 text-xs italic mt-2">{error.email}</p>
                      : null}
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      className={classnames(
                        "border-0 px-3 py-3 rounded text-sm shadow w-full",
                        "text-blueGray-600 bg-white",
                        {
                          "placeholder-blueGray-300": !error.password && !error.general,
                          "placeholder-red-500 ring ring-red-500 focus:ring-red-500": error.password || error.general,
                        },
                        "focus:outline-none focus:ring",
                        "ease-linear transition-all duration-150")}
                      placeholder="Password"
                      onChange={handleChange}
                    />
                    {error.password
                      ? <p className="text-red-500 text-xs italic mt-2">{error.password}</p>
                      : null}
                  </div>
                  {error.general
                    ? <p className="text-red-500 text-xs italic mt-2">{error.general}</p>
                    : null}
                  <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <a
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  className="text-blueGray-200"
                >
                  <small>Forgot password?</small>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
