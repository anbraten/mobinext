import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RealtimeChannel } from "@supabase/realtime-js";
import { useRef, useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const scrollViewRef = useRef<ScrollView>(null);

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

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(author.eq.${user?.id},target.eq.${route.params.chatPartnerId}),and(target.eq.${user?.id},author.eq.${route.params.chatPartnerId})`
        )
        .order("created_at", { ascending: true });
      if (data) {
        setMessages(data);
      }

      // TODO: show error
      error && console.error(error);

      messagesSubscription = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            setMessages((oldMessages) => [
              ...oldMessages,
              payload.new as Message,
            ]);
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
    <SafeAreaView
      style={{ flex: 1, margin: 10 }}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView
        style={{ height: "90%" }}
        ref={scrollViewRef}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd();
        }}
      >
        {messages.map((message, i) => (
          <View
            key={i}
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "row",
              alignSelf:
                message?.author === user?.id ? "flex-end" : "flex-start",
            }}
          >
            <View
              style={{
                backgroundColor:
                  message?.author === user?.id ? "#eadcf9" : "#dddddd",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text>{message?.message}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View
        style={{ flexDirection: "row", alignItems: "center", height: "10%" }}
      >
        <TextInput
          label="Message"
          mode="outlined"
          value={messageInput}
          onChangeText={setMessageInput}
          onSubmitEditing={() => messageInput && sendMessage()}
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
    </SafeAreaView>
  );
};
