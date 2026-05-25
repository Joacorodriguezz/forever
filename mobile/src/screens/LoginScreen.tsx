import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { cardShadow } from '../utils/cardShadow';

const WHATSAPP_NUMBER = '5492211234567';
const WHATSAPP_MSG = 'Hola, olvidé mi contraseña del portal del club. ¿Me pueden ayudar?';

const COLORS = {
  primary: '#003366',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#666666',
  border: '#D0D5DD',
  error: '#C62828',
  errorBg: 'rgba(198, 40, 40, 0.08)',
};

interface FormErrors {
  dni?: string;
  password?: string;
}

function validateForm(dni: string, password: string): FormErrors {
  const errors: FormErrors = {};
  const trimmedDni = dni.trim();

  if (!trimmedDni) {
    errors.dni = 'Ingresá tu DNI.';
  } else if (!/^\d+$/.test(trimmedDni)) {
    errors.dni = 'El DNI debe contener solo números.';
  } else if (!/^\d{7,8}$/.test(trimmedDni)) {
    errors.dni = 'El DNI debe tener 7 u 8 dígitos.';
  }

  if (!password) {
    errors.password = 'Ingresá tu contraseña.';
  } else if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  }

  return errors;
}

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, loading } = useAuth();
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const errors = validateForm(dni, password);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setLoginError('Completá todos los campos para continuar.');
      return;
    }

    setLoginError(null);
    const result = await login(dni.trim(), password);

    if (!result.success) {
      setLoginError(result.error ?? 'DNI o contraseña incorrectos.');
    }
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;
    void Linking.openURL(url);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={['#002244', '#003366', '#004080']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 32 }]}
        >
          <View style={styles.logoCircle} accessibilityLabel="Logo Club For Ever">
            <Text style={styles.logoText}>FE</Text>
          </View>
          <Text style={styles.clubName}>
            CLUB SOCIAL CULTURAL Y DEPORTIVO FOR EVER
          </Text>
          <Text style={styles.subtitle}>Sistema de socios</Text>
        </LinearGradient>

        <View style={styles.formSection}>
        <View style={styles.card}>
          <Text style={styles.title}>Iniciar sesión</Text>

          {loginError ? (
            <View style={styles.errorBanner} accessibilityRole="alert">
              <Text style={styles.errorBannerText}>{loginError}</Text>
            </View>
          ) : null}

          <View style={styles.field}>
            <Text style={styles.label} nativeID="dni-label">
              DNI
            </Text>
            <TextInput
              style={[styles.input, formErrors.dni ? styles.inputError : null]}
              value={dni}
              onChangeText={(text) => {
                setDni(text.replace(/\D/g, ''));
                if (formErrors.dni) setFormErrors((prev) => ({ ...prev, dni: undefined }));
              }}
              placeholder="Ingresá tu DNI"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              maxLength={8}
              autoComplete="username"
              accessibilityLabelledBy="dni-label"
              editable={!loading}
            />
            {formErrors.dni ? <Text style={styles.fieldError}>{formErrors.dni}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label} nativeID="password-label">
              Contraseña
            </Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  formErrors.password ? styles.inputError : null,
                ]}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (formErrors.password) {
                    setFormErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                placeholder="Ingresá tu contraseña"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry={!showPassword}
                autoComplete="password"
                accessibilityLabelledBy="password-label"
                editable={!loading}
              />
              <Pressable
                style={styles.togglePassword}
                onPress={() => setShowPassword((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <Text style={styles.togglePasswordText}>
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </Pressable>
            </View>
            {formErrors.password ? (
              <Text style={styles.fieldError}>{formErrors.password}</Text>
            ) : null}
          </View>

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => void handleSubmit()}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Ingresar"
          >
            {loading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#FFFFFF" />
                <Text style={styles.buttonText}>Ingresando...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Ingresar</Text>
            )}
          </Pressable>

          <Pressable
            onPress={openWhatsApp}
            style={styles.whatsappLink}
            accessibilityRole="link"
            accessibilityLabel="Olvidar contraseña, contactar por WhatsApp"
          >
            <Text style={styles.whatsappText}>Olvidar contraseña → WhatsApp</Text>
          </Pressable>
        </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 24,
    gap: 20,
  },
  formSection: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  logoText: {
    color: COLORS.primary,
    fontSize: 36,
    fontWeight: '700',
  },
  clubName: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    lineHeight: 20,
    maxWidth: 280,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 24,
    ...cardShadow,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 20,
  },
  errorBanner: {
    backgroundColor: COLORS.errorBg,
    borderColor: 'rgba(198, 40, 40, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '500',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  passwordRow: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 80,
  },
  togglePassword: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  togglePasswordText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  fieldError: {
    marginTop: 6,
    color: COLORS.error,
    fontSize: 13,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  whatsappLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  whatsappText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
