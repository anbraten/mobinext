import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "~/navigation/subnavigation/MainStack";
import { Rentable } from "~/types";

type Props = NativeStackScreenProps<RootStackParamList, "GiveBackRentedVehicle">;

export const GiveBackRentedVehicle = ({ route, navigation }: Props) => {
    const [selectedRentable, setSelectedRentable] = useState<Rentable>(
        route.params.selectedRentable
      );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
    </SafeAreaView>
  );
};