import { useUserStore } from "@/store/userstore";
import { Redirect } from "expo-router";

export default function Index() {
  const { user } = useUserStore((state) => state);
  const role = user?.role as unknown as string
   if (!user) {
    return <Redirect href="/login" />;
  }

 return <Redirect href={role === 'parent' ? '/home' : '/childhome' as any} />
}
