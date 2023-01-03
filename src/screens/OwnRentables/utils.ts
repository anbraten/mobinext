import { supabase } from "~/supabase";
import { Rentable } from "~/types";

export async function manageRentable(rentable: Partial <Rentable>, navigation: any, update: boolean = false, tpIds: number[] = []) {
const { data: { user } } = await supabase.auth.getUser()

rentable.owner = user?.id as string;
    const { data, error, status } = await supabase
    .from('rentables')
    .upsert([
        rentable
    ])
    .select()

    if (data) {
        // remove all existing trusted parties on this rentable
        await supabase
            .from('trusted_party_rentables')
            .delete()
            .eq('rentable_id', data[0].id)
    }

    if (data && tpIds.length > 0) {
        await supabase
        .from('trusted_party_rentables')
        .insert(
            tpIds.map((tpId) => ({
                rentable_id: data[0].id,
                trusted_party_id: tpId
            }))
        )
    }

    // console.log(error, status);
    navigation.navigate("OwnRentablesCreate", { rentable, success: status === 201, update });
}