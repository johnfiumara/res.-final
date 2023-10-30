import { useContext } from "react";
import { AuthenticationContext } from "../app/context/AuthContext";
import { supabase } from "../utils/supabaseClient";
import { removeCookies } from "cookies-next";

const useAuth = () => {
  const { setAuthState } = useContext(AuthenticationContext);

  const signin = async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    handleClose: () => void
  ) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const { user, error } = await supabase.auth.signIn({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message);
      }
      setAuthState({
        data: user.data,
        error: null,
        loading: false,
      });
      handleClose();
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  const signup = async (
    {
      email,
      password,
      firstName,
      lastName,
      city,
      phone,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      city: string;
      phone: string;
    },
    handleClose: () => void
  ) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message);
      }
      const response = await supabase.from("User").insert([
        {
          email,
          password,
          firstName,
          lastName,
          city,
          phone,
        },
      ]);
      setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });
      handleClose();
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  const signout = () => {
    removeCookies("jwt");

    setAuthState({
      data: null,
      error: null,
      loading: false,
    });
  };

  return {
    signin,
    signup,
    signout,
  };
};

export default useAuth;