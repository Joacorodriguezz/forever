import { StyleSheet, Text, View } from 'react-native';

export function ComingSoonScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Próximamente</Text>
      <Text style={styles.message}>Esta sección aún no está implementada.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
  },
});
