
import Form from "./components/Form";
import Header from "./components/Header";
import { createClient } from "@supabase/supabase-js";
import {supabase} from "../../../utils/supabaseClient";
import { error } from "console";




const fetchRestaurantBySlug = async (slug: string) => {
  const {data,error} = await supabase.from("Restaurant").select().eq("slug",slug)
  .single()


  if (error) {
    console.error("error fetching restuarnt")
    return null;
  }

  return data;
};

export default async function Reserve({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { date: string; partySize: string };
}) {
  const restaurant = await fetchRestaurantBySlug(params.slug);
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header
          image={restaurant.main_image}
          name={restaurant.name}
          date={searchParams.date}
          partySize={searchParams.partySize}
        />
        <Form
          partySize={searchParams.partySize}
          slug={params.slug}
          date={searchParams.date}
        />
      </div>
    </div>
  );
}
