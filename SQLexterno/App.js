import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { supabase } from './supabaseClient';

export default function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [primeiroNome, setPrimeiroNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [idade, setIdade] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [sessao, setSessao] = useState(null);
  const [ehCadastro, setEhCadastro] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessao(session);
      if (session) buscarUsuarios();
    };
  
    checkSession();
  
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session);
      if (session) buscarUsuarios();
    });
  
    return () => {
      authListener.unsubscribe();
    };
  }, []);
  

  const buscarUsuarios = async () => {
    const { user } = supabase.auth.session();
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('user_id', user.id) // Filtra pelo ID do usuário logado
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error(error);
    } else {
      setUsuarios(data);
    }
  };

  const cadastrarUsuario = async () => {
    if (primeiroNome && sobrenome && idade) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { user } = session;
        const { data, error } = await supabase
          .from('usuarios')
          .insert([{ 
            primeiro_nome: primeiroNome, 
            sobrenome: sobrenome, 
            idade: parseInt(idade, 10),
            user_id: user.id // Define o user_id com o ID do usuário logado
          }]);
  
        if (error) {
          console.error(error);
        } else {
          setPrimeiroNome('');
          setSobrenome('');
          setIdade('');
          buscarUsuarios();
        }
      } else {
        console.error('Usuário não autenticado.');
      }
    }
  };
  




  const entrarComEmail = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) {
      alert(error.message);
    }
  };

  const cadastrarComEmail = async () => {
    const { error } = await supabase.auth.signUp({ email, password: senha });

    if (error) {
      alert(error.message);
    }
  };

  const sair = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
  };

  if (!sessao) {
    return (
      <View style={estilos.container}>
        <Text style={estilos.titulo}>Welcome - Cadastro de Usuários</Text>
        <TextInput
          style={estilos.entrada}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={estilos.entrada}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        {ehCadastro ? (
          <>
            <TouchableOpacity style={estilos.botao} onPress={cadastrarComEmail}>
              <Text style={estilos.textoBotao}>Cadastrar</Text>
            </TouchableOpacity>
            <Text onPress={() => setEhCadastro(false)} style={estilos.ligacao}>Já tem uma conta? Entrar</Text>
          </>
        ) : (
          <>
            <TouchableOpacity style={estilos.botao} onPress={entrarComEmail}>
              <Text style={estilos.textoBotao}>Entrar</Text>
            </TouchableOpacity>
            <Text onPress={() => setEhCadastro(true)} style={estilos.ligacao}>Não tem uma conta? Cadastre-se</Text>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <TextInput
        style={estilos.entrada}
        placeholder="Primeiro Nome"
        value={primeiroNome}
        onChangeText={setPrimeiroNome}
      />
      <TextInput
        style={estilos.entrada}
        placeholder="Sobrenome"
        value={sobrenome}
        onChangeText={setSobrenome}
      />
      <TextInput
        style={estilos.entrada}
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />
      <TouchableOpacity style={estilos.botao} onPress={cadastrarUsuario}>
        <Text style={estilos.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={estilos.usuario}>
            <Text style={estilos.textoUsuario}>Nome: {item.primeiro_nome} {item.sobrenome}</Text>
            <Text style={estilos.textoUsuario}>Idade: {item.idade}</Text>
          </View>
        )}
        style={estilos.listaUsuarios}
      />
      <TouchableOpacity style={estilos.botao} onPress={sair}>
        <Text style={estilos.textoBotao}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  entrada: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  botao: {
    backgroundColor: '#F3752B',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ligacao: {
    color: '#F3752B',
    textAlign: 'center',
    marginTop: 10,
  },
  listaUsuarios: {
    marginTop: 20,
  },
  usuario: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  textoUsuario: {
    fontSize: 16,
  },
});
