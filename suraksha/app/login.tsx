import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/store/userstore";
import { Lock, Mail, Eye, EyeOff } from "lucide-react-native";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState(false);
  const { setUser } = useUserStore((state) => state);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError(null);
      setisLoading(true);
      setError(null);
      setisLoading(true);
      const res = await axios.post("https://minorproject-40ef.onrender.com/api/login", {
        email,
        password,
      });

      setUser(res.data.user);
      setisLoading(false);
      router.push("/home");
    } catch (err: any) {
      setError(
        err.message || "Failed to sign in. Please check your credentials."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexGrow}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Guardian</Text>
            <Text style={styles.headerSubtitle}>Parental Control</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>
              Welcome back! Please enter your details
            </Text>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Mail size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.registerText}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  flexGrow: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 32,
  },
  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 32,
    color: "#2563eb",
  },
  headerSubtitle: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#0f172a",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748b",
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    color: "#dc2626",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: "#fff",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#0f172a",
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    backgroundColor: "#2563eb",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonText: {
    color: "#ffffff",
    fontFamily: "Inter-Medium",
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontFamily: "Inter-Regular",
    color: "#64748b",
    fontSize: 14,
  },
  registerText: {
    fontFamily: "Inter-Medium",
    color: "#2563eb",
    fontSize: 14,
    marginLeft: 4,
  },
});
