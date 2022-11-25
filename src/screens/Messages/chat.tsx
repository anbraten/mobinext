import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RealtimeChannel } from "@supabase/realtime-js";
import { userInfo } from "os";
import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

import { RootStackParamList } from "~/navigation/subnavigation/MainStack";
import { AuthContext } from "~/provider/AuthProvider";
import { supabase } from "~/supabase";
import { Message, User } from "~/types";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

export const Chat = ({ route, navigation }: Props) => {
  const { user } = useContext(AuthContext);

  const [messageInput, setMessageInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatPartner, setChatPartner] = useState<User>();

  useEffect(() => {
    let messagesSubscription: RealtimeChannel;
    (async () => {
      const { data: _profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", route.params.chatPartnerId)
        .limit(1)
        .single();
      if (_profile) {
        setChatPartner(_profile);
      }

      const { data } = await supabase
        .from("messages")
        .select("*")
        // TODO: filter for messages between the two users
        // .or(`author.eq.${user?.id},author.eq.${route.params.chatPartnerId},recipient.eq.${user?.id}`)
        .order("created_at", { ascending: true });
      if (data) {
        setMessages(data);
      }

      messagesSubscription = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            setMessages([...messages, payload.new as Message]);
          }
        );

      messagesSubscription.subscribe();
    })();

    return () => {
      messagesSubscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: `Chat with ${chatPartner?.full_name || "..."}`,
    });
  }, [chatPartner]);

  async function sendMessage() {
    if (messageInput.length < 1 || !user || !chatPartner) {
      return;
    }

    const res = await supabase.from("messages").insert({
      message: messageInput,
      author: user?.id,
      target: chatPartner?.id,
    });

    if (res.error) {
      // TODO: show error
      console.error(res.error);
    } else {
      setMessageInput("");
    }
  }

  return (
    <View style={{ flex: 1, margin: 10 }}>
      <View style={{ flex: 1 }}>
        {messages.map((message) => (
          <>
            <Text>
              {message.author === user?.id ? "Me" : chatPartner?.full_name}:{" "}
              {message.message}
            </Text>
          </>
        ))}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          label="Message"
          mode="outlined"
          value={messageInput}
          onChangeText={setMessageInput}
          style={{ flex: 1 }}
        />
        <Button
          onPress={sendMessage}
          mode="contained"
          style={{
            justifyContent: "center",
            marginLeft: 10,
            marginVertical: 10,
          }}
        >
          Send
        </Button>
      </View>
    </View>
  );
};
