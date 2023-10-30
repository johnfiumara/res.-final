import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import {Cuisine, Location, PRICE, Review } from "@prisma/client";
import {createClient, SupportedStorage} from "@supabase/supabase-js"
import { supabase } from "../utils/supabaseClient";



export interface RestaurantCardType {
  id: number;
  name: string;
  main_image: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
  slug: string;
  reviews: Review[];
}

const fetchRestaurants = async (): Promise<RestaurantCardType[]> => {
  try {
    const { data, error } = await supabase
      .from("Restaurant")
      .select(
        "id, name, main_image, cuisine, slug, location, price, reviews"
      );

    if (error) {
      throw new Error(error.message);
    }
    return data;
    
  } catch (error) {
    console.error("Fetch restaurants error:", error);
    throw error;
  }
};

export default async function Home() {
  const restaurants = await fetchRestaurants();

  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {restaurants.map((restaurant) => (
          <RestaurantCard restaurant={restaurant} />
        ))}
      </div>
    </main>
  );
}
