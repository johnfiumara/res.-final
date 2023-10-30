import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { setCookie } from "cookies-next";
import { createClient,SignInWithPasswordCredentials } from "@supabase/supabase-js";
import { supabase } from "../../../utils/supabaseClient";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const errors: string[] = [];
    const { email, password } = req.body;

    const validationSchema = [
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isLength(password, {
          min: 1,
        }),
        errorMessage: "Password is invalid",
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password:password
    })

    if (error) {
      return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
    }
    else{
      return res.status(404).json({errorMessage:"user does not exsist"})
    }

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ errorMessage: "Email or password is invalid" });
    }

    const alg = "HS256";

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({ email: email })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);

    setCookie("jwt", token, { req, res, maxAge: 60 * 6 * 24 });

    return res.status(200).json({
      firstName: userData.first_name,
      lastName: userData.last_name,
      email: userData.email,
      phone: userData.phone,
      city: userData.city,
    });
  }

  return res.status(404).json("Unknown endpoint");
}
