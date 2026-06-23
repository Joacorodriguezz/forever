import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenState } from '../components/ScreenState';
import { noticiaService } from '../services/noticiaService';
import { cardShadow } from '../utils/cardShadow';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import type { Noticia } from '../types/noticia';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Noticias'>,
  NativeStackScreenProps<RootStackParamList>
>;

function formatNoticiaDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function NewsListScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  const fetchNoticias = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(false);

    try {
      const res = await noticiaService.getAll();
      if (res.success && Array.isArray(res.data)) {
        setNoticias(res.data);
      } else {
        setNoticias([]);
      }
    } catch {
      setError(true);
      setNoticias([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchNoticias();
  }, [fetchNoticias]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Noticias</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003366" />
        </View>
      ) : error ? (
        <ScreenState
          variant="error"
          message="No se pudo conectar con el servidor."
          onRetry={() => void fetchNoticias()}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void fetchNoticias(true)}
              colors={['#003366']}
              tintColor="#003366"
            />
          }
        >
          {noticias.length === 0 ? (
            <ScreenState variant="empty" message="No hay noticias publicadas." />
          ) : (
            noticias.map((noticia) => {
              const imageUrl = resolveImageUrl(noticia.imagenes?.[0]);
              return (
                <Pressable
                  key={noticia.id}
                  style={styles.card}
                  onPress={() => navigation.navigate('NewsDetail', { noticiaId: noticia.id })}
                >
                  {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.cardImage} resizeMode="cover" />
                  ) : (
                    <View style={styles.cardImagePlaceholder}>
                      <Feather name="book-open" size={40} color="#003366" />
                    </View>
                  )}
                  <View style={styles.cardBody}>
                    <Text style={styles.cardDate}>{formatNoticiaDate(noticia.fecha)}</Text>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {noticia.titulo}
                    </Text>
                    <Text style={styles.cardSummary} numberOfLines={3}>
                      {noticia.resumen}
                    </Text>
                  </View>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      )}
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
  },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 32, gap: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
    ...cardShadow,
  },
  cardImage: { width: '100%', height: 140 },
  cardImagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: '#E8ECF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { padding: 12, gap: 6 },
  cardDate: { fontSize: 14, color: '#999999' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0A0A0A' },
  cardSummary: { fontSize: 14, color: '#666666', lineHeight: 20 },
});
