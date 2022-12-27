import { supabase } from "~/supabase";
import { Rentable } from "~/types";

export async function manageTrustedParty(trustedParty: any, members: any, navigation: any) {
    const newTrustedParty = {
        name: trustedParty.name,
        description: trustedParty.description,
        owner: trustedParty.owner,
    } as any;

    if (trustedParty.id) {
        newTrustedParty.id = trustedParty.id;
    }

    const { data, error: tperror } = await supabase
        .from("trusted_parties")
        .upsert(
            newTrustedParty
        )
        .select();

    if (data) {
        // delete all members
        const { data: deleteMembersData, error: deleteMembersError } = await supabase
            .from("trusted_party_members")
            .delete()
            .match({ trusted_party_id: data[0].id });
        
        const { data: membersData, error, status } = await supabase
            .from("trusted_party_members")
            .insert(members.map((member: any) => {
                return {
                    trusted_party_id: data[0].id,
                    user_id: member.id,
                };
        }));

        navigation.navigate("CreateTrustedPartyResult", { trustedParty, members, success: status === 201 });
    }

}