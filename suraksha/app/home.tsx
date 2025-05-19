import { Text, View } from "react-native";
import "./globals.css"
import { useUserStore } from "@/store/userstore";

export default function Home() {
   const { user } = useUserStore((state) => state);
  return (
    <View
   className="flex-1 items-center justify-center"
    >
      <Text>welcome to home mr {user?.name}  {user?.role}</Text>
    </View>
  );
}
