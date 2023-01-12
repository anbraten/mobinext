import { Message, Profile } from "~/types";
import { RentableRequestMessage } from "./rentable_request";
import { RentableRequestGrantedMessage } from "./rentable_request_granted";
import { TextMessage } from "./text";

export function ChatMessage({
  message,
  chatPartner,
}: {
  message: Message;
  chatPartner: Profile;
}) {
  switch (message.type) {
    case "rentable_request":
      return (
        <RentableRequestMessage message={message} chatPartner={chatPartner!} />
      );
    case "rentable_request_granted":
      return (
        <RentableRequestGrantedMessage
          message={message}
          chatPartner={chatPartner!}
        />
      );
    default:
      return <TextMessage message={message} chatPartner={chatPartner!} />;
  }
}
