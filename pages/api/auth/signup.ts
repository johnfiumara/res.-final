import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { setCookie } from "cookies-next";
import { SupabaseClient,createClient } from "@supabase/supabase-js";
import {supabase} from "../../../utils/supabaseClient";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { firstName, lastName, email, phone, city, password } = req.body;
    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validator.isLength(firstName, {
          min: 1,
          max: 20,
        }),
        errorMessage: "First name is invalid",
      },
      {
        valid: validator.isLength(lastName, {
          min: 1,
          max: 20,
        }),
        errorMessage: "First name is invalid",
      },
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isMobilePhone(phone),
        errorMessage: "Phone number is invalid",
      },
      {
        valid: validator.isLength(city, { min: 1 }),
        errorMessage: "City is invalid",
      },
      {
        valid: validator.isStrongPassword(password),
        errorMessage: "Password is not strong enough",
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

    const userWithEmail = await supabase
    .from("User")
    .select("*")
    .eq("email", email)
    .single();

    if (userWithEmail) {
      return res
        .status(400)
        .json({ errorMessage: "Email is associated with another account" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const {data ,error} = await supabase.from("User").insert({ 
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        city:  city,
        phone,
        email,
    });

    if(error){
      return res
      .status(401)
      .json({errorMessage:"failed to create user"});
    }

    const alg = "HS256";

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({ email: email })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);

    setCookie("jwt", token, { req, res, maxAge: 60 * 6 * 24 });
 

    return res.status(200).json({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      city: city,
    });
  }

  return res.status(404).json("Unknown endpoint");
}
