import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenState } from '../components/ScreenState';
import { noticiaService } from '../services/noticiaService';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import type { RootStackParamList } from '../navigation/types';
import type { Noticia } from '../types/noticia';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsDetail'>;

function formatNoticiaDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function NewsDetailScreen({ navigation, route }: Props) {
  const { noticiaId } = route.params;
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [noticia, setNoticia] = useState<Noticia | null>(null);

  const fetchNoticia = useCallback(async () => {
    setLoading(true);
    setError(false);
    setNotFound(false);

    try {
      const res = await noticiaService.getById(noticiaId);
      if (res.success && res.data) {
        setNoticia(res.data);
      } else {
        setNotFound(true);
        setNoticia(null);
      }
    } catch (err: unknown) {
      const status =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;
      if (status === 404) {
        setNotFound(true);
      } else {
        setError(true);
      }
      setNoticia(null);
    } finally {
      setLoading(false);
    }
  }, [noticiaId]);

  useEffect(() => {
    void fetchNoticia();
  }, [fetchNoticia]);

  const paragraphs = noticia?.contenido?.split(/\n\n+/).filter(Boolean) ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={12}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Noticia</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003366" />
        </View>
      ) : notFound ? (
        <View style={styles.stateWrap}>
          <ScreenState variant="empty" message="Noticia no encontrada." />
          <Pressable style={styles.backListBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backListText}>Volver al listado</Text>
          </Pressable>
        </View>
      ) : error ? (
        <ScreenState
          variant="error"
          message="No se pudo conectar con el servidor."
          onRetry={() => void fetchNoticia()}
        />
      ) : noticia ? (
        <ScrollView contentContainerStyle={styles.content}>
          {(noticia.imagenes ?? []).map((img, index) => {
            const url = resolveImageUrl(img);
            if (!url) return null;
            return (
              <Image
                key={`${noticia.id}-img-${index}`}
                source={{ uri: url }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            );
          })}

          <Text style={styles.date}>{formatNoticiaDate(noticia.fecha)}</Text>
          <Text style={styles.title}>{noticia.titulo}</Text>
          {noticia.autor ? <Text style={styles.author}>Por {noticia.autor}</Text> : null}

          {paragraphs.map((p, index) => (
            <Text key={index} style={styles.paragraph}>
              {p.trim()}
            </Text>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    backgroundColor: '#003366',
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { padding: 4, marginRight: 8, minWidth: 48, minHeight: 48, justifyContent: 'center' },
  backIcon: { color: '#FFF', fontSize: 28, fontWeight: '300' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stateWrap: { flex: 1 },
  backListBtn: {
    alignSelf: 'center',
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  backListText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 32 },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  date: { fontSize: 14, color: '#999999', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#0A0A0A', marginBottom: 8 },
  author: { fontSize: 14, color: '#666666', marginBottom: 16 },
  paragraph: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 12,
  },
});
