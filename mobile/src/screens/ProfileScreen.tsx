import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { deportistaService } from '../services/deportistaService';
import { disciplinaService } from '../services/disciplinaService';
import { userService } from '../services/userService';
import { cardShadow } from '../utils/cardShadow';
import type { MainTabParamList } from '../navigation/types';
import type { Disciplina, DeportistaProfile } from '../types/auth';

type Props = BottomTabScreenProps<MainTabParamList, 'Perfil'>;

const COLORS = {
  primary: '#003366',
  border: '#D0D5DD',
  text: '#1A1A1A',
  textMuted: '#666666',
  error: '#C62828',
  errorBg: 'rgba(198, 40, 40, 0.08)',
};

function getInitials(nombre?: string | null, apellido?: string | null): string {
  const n = nombre?.trim()?.[0]?.toUpperCase();
  const a = apellido?.trim()?.[0]?.toUpperCase();
  if (n && a) return `${n}${a}`;
  if (n) return n;
  return 'FE';
}

function splitFullName(fullName: string): { nombre: string; apellido: string } {
  const parts = fullName.trim().replace(/\s+/g, ' ').split(' ');
  return { nombre: parts[0] ?? '', apellido: parts.slice(1).join(' ') };
}

function getServerErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as { response?: { data?: { error?: string; message?: string } } };
    const message = axiosError.response?.data?.error ?? axiosError.response?.data?.message;
    if (message) return message;
  }
  return 'No se pudo conectar con el servidor.';
}

export function ProfileScreen(_props: Props) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<DeportistaProfile | null>(null);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [disciplinaId, setDisciplinaId] = useState<number | undefined>();
  const [saving, setSaving] = useState(false);
  const [disciplinaModalVisible, setDisciplinaModalVisible] = useState(false);

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const loadProfile = async () => {
    const [perfilRes, disciplinasRes] = await Promise.all([
      deportistaService.getMiPerfil(),
      disciplinaService.getAll(),
    ]);

    if (perfilRes.success && perfilRes.data) {
      setProfile(perfilRes.data);
      setFullName([perfilRes.data.nombre, perfilRes.data.apellido].filter(Boolean).join(' '));
      setEmail(perfilRes.data.cuenta?.email ?? '');
      setDisciplinaId(perfilRes.data.disciplina?.id);
    }

    if (disciplinasRes.success && disciplinasRes.data) {
      setDisciplinas(disciplinasRes.data);
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadProfile();
      } catch {
        // el perfil se muestra vacío si falla la carga inicial
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedDisciplinaNombre =
    disciplinas.find((d) => d.id === disciplinaId)?.nombre ?? profile?.disciplina?.nombre;

  const handleSaveChanges = async () => {
    const { nombre, apellido } = splitFullName(fullName);

    if (!nombre || !apellido) {
      Alert.alert('Datos incompletos', 'Ingresá tu nombre y apellido.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      Alert.alert('Email inválido', 'Ingresá un correo electrónico válido.');
      return;
    }

    if (!disciplinaId) {
      Alert.alert('Disciplina requerida', 'Seleccioná tu disciplina.');
      return;
    }

    setSaving(true);
    try {
      const res = await userService.updateProfile({
        nombre,
        apellido,
        email: email.trim(),
        disciplinaId,
      });

      if (!res.success) {
        Alert.alert('No se pudo guardar', res.error ?? 'Intentá de nuevo más tarde.');
        return;
      }

      await loadProfile();
      Alert.alert('Perfil actualizado', 'Tus cambios se guardaron correctamente.');
    } catch (error) {
      Alert.alert('No se pudo guardar', getServerErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const closePasswordModal = () => {
    setPasswordModalVisible(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      setPasswordError('Ingresá tu contraseña actual.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }

    setPasswordError(null);
    setChangingPassword(true);
    try {
      const res = await userService.updateProfile({ currentPassword, password: newPassword });

      if (!res.success) {
        setPasswordError(res.error ?? 'No se pudo cambiar la contraseña.');
        return;
      }

      closePasswordModal();
      Alert.alert('Contraseña actualizada', 'Tu contraseña se cambió correctamente.');
    } catch (error) {
      setPasswordError(getServerErrorMessage(error));
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#002244', '#003366', '#004080']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(profile?.nombre, profile?.apellido)}</Text>
        </View>
        <Text style={styles.headerName}>{fullName.trim() || 'Mi Perfil'}</Text>
        {!!selectedDisciplinaNombre && (
          <Text style={styles.headerSubtitle}>{selectedDisciplinaNombre}</Text>
        )}
      </LinearGradient>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003366" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Datos personales</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nombre y apellido"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>DNI</Text>
              <View style={[styles.input, styles.inputDisabled]}>
                <Text style={styles.inputDisabledText}>{profile?.dni}</Text>
                <Feather name="lock" size={16} color={COLORS.textMuted} />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Disciplina</Text>
              <Pressable
                style={styles.input}
                onPress={() => setDisciplinaModalVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Seleccionar disciplina"
              >
                <Text style={styles.inputText}>
                  {selectedDisciplinaNombre ?? 'Seleccioná una disciplina'}
                </Text>
                <Feather name="chevron-down" size={18} color={COLORS.textMuted} />
              </Pressable>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="tu@email.com"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Pressable
              style={[styles.saveButton, saving && styles.buttonDisabled]}
              onPress={() => void handleSaveChanges()}
              disabled={saving}
              accessibilityRole="button"
              accessibilityLabel="Guardar cambios"
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar cambios</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.changePasswordLink}
              onPress={() => setPasswordModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Cambiar contraseña"
            >
              <Text style={styles.changePasswordText}>Cambiar contraseña</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      <Modal
        visible={disciplinaModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDisciplinaModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setDisciplinaModalVisible(false)}>
          <View style={styles.disciplinaSheet}>
            <Text style={styles.modalTitle}>Seleccioná tu disciplina</Text>
            <ScrollView>
              {disciplinas.map((d) => (
                <Pressable
                  key={d.id}
                  style={styles.disciplinaOption}
                  onPress={() => {
                    setDisciplinaId(d.id);
                    setDisciplinaModalVisible(false);
                  }}
                >
                  <Text style={styles.disciplinaOptionText}>{d.nombre}</Text>
                  {d.id === disciplinaId && (
                    <Feather name="check" size={18} color={COLORS.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closePasswordModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.passwordCard}>
            <View style={styles.passwordCardHeader}>
              <Text style={styles.modalTitle}>Cambiar contraseña</Text>
              <Pressable onPress={closePasswordModal} accessibilityLabel="Cerrar">
                <Feather name="x" size={22} color={COLORS.textMuted} />
              </Pressable>
            </View>

            {passwordError ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{passwordError}</Text>
              </View>
            ) : null}

            <View style={styles.field}>
              <Text style={styles.label}>Contraseña actual</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Contraseña actual"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Nueva contraseña</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Al menos 6 caracteres"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Confirmar nueva contraseña</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repetí la nueva contraseña"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
              />
            </View>

            <Pressable
              style={[styles.saveButton, changingPassword && styles.buttonDisabled]}
              onPress={() => void handleChangePassword()}
              disabled={changingPassword}
              accessibilityRole="button"
              accessibilityLabel="Confirmar cambio de contraseña"
            >
              {changingPassword ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Cambiar contraseña</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003366',
  },
  headerName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 4,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 16, paddingTop: 20 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    ...cardShadow,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A8F99',
    marginBottom: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: '#FFFFFF',
  },
  inputText: { fontSize: 15, color: COLORS.text },
  inputDisabled: { backgroundColor: '#F2F3F5' },
  inputDisabledText: { fontSize: 15, color: COLORS.textMuted },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.7 },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  changePasswordLink: { alignItems: 'center', marginTop: 16 },
  changePasswordText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  disciplinaSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    maxHeight: '70%',
    gap: 8,
  },
  disciplinaOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  disciplinaOptionText: { fontSize: 15, color: COLORS.text },
  passwordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  passwordCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  errorBanner: {
    backgroundColor: COLORS.errorBg,
    borderColor: 'rgba(198, 40, 40, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: { color: COLORS.error, fontSize: 13, fontWeight: '500' },
});
