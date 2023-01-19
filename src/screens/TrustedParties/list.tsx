import { RealtimeChannel } from "@supabase/realtime-js";
import { useContext, useEffect, useState } from "react";
import { supabase } from "~/supabase";
import { Trusted_parties } from "~/types";
import { View, ScrollView } from "react-native";
import { TrustedPartiesCard } from "~/components/trusted-parties-card";
import {
  Dialog,
  FAB,
  IconButton,
  Portal,
  Text,
  Button,
} from "react-native-paper";
import { AuthContext } from "~/provider/AuthProvider";
import { RootStackParamList } from "~/navigation/subnavigation/MainStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Trusted_Party_With_Members = Trusted_parties & {
  trusted_party_members: { user_id: string }[];
};

export const TrustedParties = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "TrustedParties">) => {
  const { user } = useContext(AuthContext);
  const [showInfoDialog, setShowInfoDialog] = useState(false);

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
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          onPress={() => setShowInfoDialog(true)}
          style={{ marginRight: 10 }}
          icon="information-outline"
          mode="contained"
          size={18}
        />
      ),
    });

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

  const InformationDialog = () => {
    const hideDialog = () => {
      setShowInfoDialog(false);
    };
    return (
      <Portal>
        <Dialog visible={showInfoDialog} onDismiss={hideDialog}>
          <Dialog.Title>Was sind Trusted Parties?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Dies ist eine super tolle Beschreibung der Trusted Parties!
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" onPress={hideDialog}>
              Schließen
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <InformationDialog />
      <ScrollView style={{ padding: 5 }}>
        {filteredTrustedParties.map((trustedParty) => (
          <TrustedPartiesCard
            title={trustedParty.name as string}
            role={trustedParty.owner === user?.id ? "Eigentümer" : "Mitglied"}
            key={trustedParty.id}
            callback={() => {
              navigation.push("TrustedPartiesCreate", {
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
          navigation.navigate("TrustedPartiesCreate", {
            trustedParties: trustedParties,
          })
        }
      />
    </View>
  );
};
