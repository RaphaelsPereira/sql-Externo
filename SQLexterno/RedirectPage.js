import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function EmailConfirmationScreen({ navigation }) {
  const [countdown, setCountdown] = useState(5); // Tempo em segundos

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          navigation.navigate('Login'); // Redireciona para a tela de login
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigation]);

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>E-mail Confirmado!</Text>
      <Text style={estilos.texto}>
        Seu e-mail foi confirmado com sucesso. Você será redirecionado em{' '}
        <Text style={estilos.contagem}>{countdown}</Text> segundos.
      </Text>
      <TouchableOpacity
        style={estilos.botao}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={estilos.textoBotao}>Ir para o Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  texto: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  contagem: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  botao: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
