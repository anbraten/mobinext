import { RealtimeChannel } from "@supabase/realtime-js";
import { useContext, useEffect, useState } from "react";
import { supabase } from "~/supabase";
import { Trusted_parties } from "~/types";
import { View, ScrollView } from "react-native";
import { TrustedPartiesCard } from "~/components/trusted-parties-card";
import { FAB } from "react-native-paper";
import { AuthContext } from "~/provider/AuthProvider";

type Trusted_Party_With_Members = Trusted_parties & {
  trusted_party_members: { user_id: string }[];
};

export const TrustedParties = () => {
  const { user } = useContext(AuthContext);

  const [trustedParties, setTrustedParties] = useState<
    Trusted_Party_With_Members[]
  >([]);
  const filteredTrustedParties = trustedParties.filter(
    (trustedParty) =>
      trustedParty.trusted_party_members.some(
        (member) => member.user_id === user?.id
      ) || trustedParty.owner === user?.id
  );

  let trustedPartiesSubscription: RealtimeChannel;

  async function fetchTrustedParties() {
    const { data, error } = (await supabase
      .from("trusted_parties")
      .select("*, trusted_party_members(user_id)")) as any;

    error && console.log(error);
    setTrustedParties(data);
  }

  useEffect(() => {
    fetchTrustedParties();

    trustedPartiesSubscription = supabase
      .channel("trusted_parties:*")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trusted_parties" },
        (payload) => {
          fetchTrustedParties();
        }
      )
      .subscribe();

    return () => {
      trustedPartiesSubscription.unsubscribe();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 5 }}>
        {filteredTrustedParties.map((trustedParty) => (
          <TrustedPartiesCard
            title={trustedParty.name as string}
            role={trustedParty.owner === user?.id ? "Besitzer" : "Mitglied"}
            key={trustedParty.id}
            callback={() => {
              navigation.navigate("NewTrustedParty", {
                trustedPartyId: trustedParty.id,
                update: true,
              });
            }}
          />
        ))}
      </ScrollView>
      <FAB
        style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
        icon="plus"
        onPress={() =>
          navigation.navigate("NewTrustedParty", {
            trustedParties: trustedParties,
          })
        }
      />
    </View>
  );
};
