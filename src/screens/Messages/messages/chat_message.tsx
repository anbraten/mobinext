import { Message, Profile } from "~/types";
import { RentableRequestMessage } from "./rentable_request";
import { RentableRequestResponseMessage } from "./rentable_request_response";
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
    case "rentable_request_response":
      return (
        <RentableRequestResponseMessage
          message={message}
          chatPartner={chatPartner!}
        />
      );
    default:
      return <TextMessage message={message} chatPartner={chatPartner!} />;
  }
}
