import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useReducer, useState, useContext } from "react";
import { View, FlatList } from "react-native";
import {
  Button,
  Card,
  Chip,
  IconButton,
  Searchbar,
  Text,
  TextInput,
  Title,
} from "react-native-paper";
import { RootStackParamList } from "~/navigation/subnavigation/MainStack";
import { AuthContext } from "~/provider/AuthProvider";
import { supabase } from "~/supabase";
import { Trusted_parties, Trusted_party_members } from "~/types";
import { deleteTrustedParty, manageTrustedParty } from "../Profile/utils";

export const TrustedPartiesCreate = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "TrustedPartiesCreate">) => {
  const { update = false, trustedPartyId } = route.params;
  const { user } = useContext(AuthContext);

  const [trustedParty, setTrustedParty] = useState<Partial<Trusted_parties>>({
    name: "",
    owner: user?.id,
  });
  const [members, setMembers] = useState<{ full_name: string; id: string }[]>(
    []
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [possibleMembers, setPossibleMembers] = useState<any[]>([]);

  useEffect(() => {
    let title = update ? "Trusted Party bearbeiten" : "Trusted Party erstellen";
    navigation.setOptions({ title, headerRight: () => null });

    (async () => {
      if (!update) return;

      const { data, error } = await supabase
        .from("trusted_parties")
        .select(
          "*, trusted_party_members(user_id, profiles(full_name)), profiles(id, full_name)"
        )
        .eq("id", trustedPartyId);

      if (data) {
        console.log(data[0]);

        setTrustedParty(data[0]);
        const memberData = data[0].trusted_party_members as {
          user_id: string;
          profiles: { full_name: string };
        }[];

        const ownerId = data[0].owner?.toString() as string;
        const ownerFullName = data[0]?.profiles?.full_name as string;
        memberData.push({
          user_id: ownerId,
          profiles: { full_name: ownerFullName },
        });

        setMembers(
          memberData
            .map((member: any) => {
              return {
                full_name: member.profiles.full_name,
                id: member.user_id,
              };
            })
            .sort((a, b) => a.full_name.localeCompare(b.full_name))
        );
      }
    })();
  }, [navigation]);

  useEffect(() => {
    (async () => {
      if (!searchQuery) {
        setPossibleMembers([]);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user?.id)
        .ilike("full_name", `%${searchQuery}%`);

      setPossibleMembers(
        data?.map((member) => {
          return { full_name: member.full_name, id: member.id };
        }) || []
      );
    })();
  }, [searchQuery]);

  useEffect(() => {
    if (trustedParty.owner !== user?.id) {
      navigation.setOptions({
        title: trustedParty.name || "...",
        headerRight: () => null,
      });
    } else if (trustedParty.owner === user?.id && update) {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            onPress={() => deleteTrustedParty(trustedParty, navigation)}
            style={{ marginRight: 10 }}
            icon="trash-can"
            mode="contained"
            size={18}
          />
        ),
      });
    }
  }, [trustedParty]);

  return (
    <View style={{ margin: 20, zIndex: 0 }}>
      {trustedParty.owner === user?.id && (
        <TextInput
          label="Name der Trusted Party"
          mode="outlined"
          value={trustedParty.name || ""}
          onChangeText={(text) =>
            setTrustedParty({ ...trustedParty, name: text })
          }
        />
      )}

      {trustedParty.owner === user?.id && (
        <Searchbar
          style={{ marginTop: 20 }}
          placeholder="Füge neue Mitglieder hinzu"
          onChangeText={(query) => setSearchQuery(query)}
          value={searchQuery}
        />
      )}

      {possibleMembers.length > 0 && (
        <Title style={{ marginTop: 15 }}>Suchergebnisse:</Title>
      )}
      <FlatList
        data={possibleMembers}
        renderItem={({ item }) => (
          // element with text on left and button to add on right all in one line
          <Card style={{ margin: 5, padding: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>{item.full_name}</Text>
              <Button
                onPress={() => {
                  setMembers([
                    ...members,
                    { id: item.id, full_name: item.full_name },
                  ]);
                  setPossibleMembers(
                    possibleMembers.filter((member) => member.id !== item.id)
                  );
                  setSearchQuery("");
                }}
              >
                Hinzufügen
              </Button>
            </View>
          </Card>
        )}
      />

      <Title style={{ marginTop: 15 }}>Aktuelle Mitglieder:</Title>
      {members.length === 0 && (
        <Text variant="labelMedium">
          Aktuell sind noch keine Mitglieder in dieser Trusted Party. Suche
          weiter oben nach vertrauenswürdigen Nutzern, um diese hinzuzufügen!
        </Text>
      )}
      <FlatList
        data={members}
        renderItem={({ item }) => (
          <Card
            style={{ margin: 5, padding: 10 }}
            mode={item.id === user?.id ? "contained" : "elevated"}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ marginVertical: 10 }}>{item.full_name}</Text>
              {trustedParty.owner === user?.id && item.id !== user?.id && (
                <Button
                  onPress={() => {
                    setMembers(
                      members.filter((member) => member.id !== item.id)
                    );
                  }}
                >
                  Entfernen
                </Button>
              )}
            </View>
          </Card>
        )}
      />

      {trustedParty.owner === user?.id && (
        <Button
          mode="contained"
          onPress={() =>
            manageTrustedParty(trustedParty, members, navigation, update)
          }
          style={{ marginTop: 20 }}
        >
          {update ? "Trusted Party aktualisieren" : "Trusted Party erstellen"}
        </Button>
      )}
    </View>
  );
};
