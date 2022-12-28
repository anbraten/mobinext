import { supabase } from "~/supabase";
import { Rentable } from "~/types";

export async function manageRentable(rentable: Partial <Rentable>, navigation: any) {
const { data: { user } } = await supabase.auth.getUser()

rentable.owner = user?.id as string;
    const { data, error, status } = await supabase
    .from('rentables')
    .upsert([
        rentable
    ])

    console.log(error, status);
    navigation.navigate("OwnRentablesCreate", { rentable, success: status === 201 });
}