import { View, ScrollView } from "react-native";
import { Text, Card, Avatar, Title } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useContext, useEffect, useState } from "react";
import { RealtimeChannel } from "@supabase/realtime-js";
import { supabase } from "~/supabase";
import { AuthContext } from "~/provider/AuthProvider";
import { Message, User } from "~/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "~/navigation/subnavigation/MainStack";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";

type Chat = {
  partner: User;
  lastMessage: Message;
};

type Props = NativeStackScreenProps<RootStackParamList, "Messages">;

export const Messages = ({ navigation }: Props) => {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState<Map<string, Chat>>(new Map());

  async function addChat(message: Message) {
    const partnerId =
      message.author === user?.id ? message.target : message.author;

    if (!partnerId) {
      return;
    }

    if (chats.has(partnerId)) {
      const chat = chats.get(partnerId)!;
      chat.lastMessage = message;
      chats.set(partnerId, chat);
      setChats(new Map(chats));
    }

    const { data: _profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", partnerId)
      .limit(1)
      .single();

    if (_profile) {
      const chat = {
        partner: _profile,
        lastMessage: message,
      };
      chats.set(_profile.id, chat);
      setChats(new Map(chats));
    }
  }

  useFocusEffect(
    useCallback(() => {
      let messagesSubscription: RealtimeChannel;
      (async () => {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`author.eq.${user?.id},target.eq.${user?.id})`)
          .order("created_at", { ascending: false });
        if (data) {
          let myMessages: { [key: string]: Message[] } = {};
          for await (const message of data) {
            const chatPartnerId =
              message.author === user?.id ? message.target : message.author;
            if (!myMessages[chatPartnerId as string]) {
              myMessages[chatPartnerId as string] = [message];
            } else {
              myMessages[chatPartnerId as string].push(message);
            }
            Object.keys(myMessages).forEach(
              async (key, i) => await addChat(myMessages[key][0])
            );
          }
        }

        // TODO: show error
        error && console.error(error);

        messagesSubscription = supabase
          .channel("messages")
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "messages" },
            (payload) => {
              const message = payload.new as Message;
              addChat(message);
            }
          );

        messagesSubscription.subscribe();
      })();

      return () => {
        messagesSubscription?.unsubscribe();
      };
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <ScrollView style={{ flex: 1 }}>
        {Array.from(chats.values()).map((chat, i) => (
          <Card
            style={{
              margin: 15,
              marginBottom: 10,
              marginTop: i === 0 ? 15 : 0,
            }}
            key={i}
            onPress={() =>
              navigation.navigate("Chat", {
                chatPartnerId: chat.partner.id,
              })
            }
          >
            <Card.Content
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {chat.partner?.avatar_url ? (
                  <Avatar.Image
                    size={65}
                    source={{ uri: chat.partner.avatar_url }}
                  />
                ) : (
                  <Avatar.Text
                    size={65}
                    label={chat.partner.full_name?.[0] || `U${i}`}
                  />
                )}

                <View style={{ marginLeft: 15 }}>
                  <Title>{chat.partner.full_name}</Title>
                  <Text
                    variant="bodyLarge"
                    style={{ marginTop: 5, flex: 1 }}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {chat.lastMessage.message?.slice(0, 10)}
                  </Text>
                </View>
              </View>
              <Text variant="bodyLarge" style={{ flex: 1, textAlign: "right" }}>
                {moment(chat.lastMessage.created_at).format("DD.MM.YY HH:mm")}
              </Text>
              <Ionicons
                name="chevron-forward"
                color={"black"}
                size={24}
                style={{ alignSelf: "center" }}
              />
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
