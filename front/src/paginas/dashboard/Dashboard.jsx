import '../../styles/Dashboard.css';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

export default function Dashboard(){

  const email = sessionStorage.getItem('email');
  const token = sessionStorage.getItem('token');

  const formatarSaldoEmReais = (saldo) => {
    if (saldo) {
      return saldo.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    }
  
    return 'R$ 0';
  };

  const [validado, setValidado] = useState(false);
  const [usuarioConfiguracoes, setUsuarioConfiguracoes] = useState({
    token: '',
    username: '',
    email: '',
  });

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/';
  };

  useEffect(() => {
    // Função para verificar o token antes de buscar configurações
    const verificarToken = async () => {
      try {
        // Verifique se o token é válido fazendo uma requisição GET para a API /verificador
        const resposta = await axios.get('http://localhost:3000/verificador', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (resposta.status === 200) {
          setValidado(true);
        }
      } catch (error) {
        setValidado(false);
      }
    };

    verificarToken();
  }, [token]);

  useEffect(() => {
    // Se o token for válido, busque as configurações do usuário
    const getConfiguracoes = async () => {
      try {
        if (validado) {
          const response = await axios.get(`http://localhost:3000/configuracoes/${email}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Atualize as informações do usuário no estado
          setUsuarioConfiguracoes(response.data);
        }
      } catch (error) {
        console.error('Erro ao obter configurações:', error);
      }
    };

    getConfiguracoes();
  }, [validado, email, token]);

  if (!validado) {
    return <p>Token Inválido</p>;
  }
    
  return (
    <div className="index">
      <div className="div">
        <div className="bloco-III">
          <div className="transaction-IV">
            <img
              className="line"
              alt="Line"
              src="line.svg"
            />
            <img
              className="detalhes"
              alt="Detalhes"
              src="detalhes.svg"
            />
            <div className="p">22/04/2022</div>
            <div className="text-wrapper">- R$ 5.000,00</div>
            <div className="p-2">Matheus Luz</div>
      
          </div>
          <div className="transaction-III">
            <img
              className="line-2"
              alt="Line"
              src="line.svg"
            />
            <img
              className="detalhes"
              alt="Detalhes"
              src="detalhes.svg"
            />
            <div className="p">22/04/2022</div>
            <div className="text-wrapper"> R$ 155.000,00</div>
            <div className="p-2">Matheus Luz</div>
          </div>
          <div className="transaction-II">
            <img
              className="line-2"
              alt="Line"
              src="line.svg"
            />
            <img
              className="detalhes"
              alt="Detalhes"
              src="detalhes.svg"
            />
            <div className="p">22/04/2022</div>
            <div className="text-wrapper">- R$ 50.000,00</div>
            <div className="p-2">Matheus Luz</div>
          </div>
          <div className="transaction-i">
            <img
              className="line-2"
              alt="Line"
              src="line.svg"
            />
            <img
              className="detalhes"
              alt="Detalhes"
              src="detalhes.svg"
            />
            <div className="p">22/04/2022</div>
            <div className="text-wrapper">+ R$ 2.000,00</div>
            <div className="p-2">Matheus Luz</div>
          </div>
          <div className="div-2">
            <div className="p-3">Detalhes</div>
            <div className="p-4">Data</div>
            <div className="p-5">Quantia</div>
            <div className="p-6">Nome</div>
          </div>
          <div className="filtrar">
            <div className="p-7">Filtrar</div>
          </div>
          <div className="pesquisar">
            <div className="p-7">Pesquisar...</div>
          </div>
          <p className="h">Monitore todas as movimentações financeiras.</p>
          <div className="h-2">Transações recentes</div>
          <img
            className="line-3"
            alt="Line"
            src="line.svg"
          />
        </div>
        <div className="bloco-II">
          <div className="historico">
            <img
              className="vector"
              alt="Vector"
              src="vetorUm.png"
            />
            <div className="h-3">Histórico</div>
          </div>
          <div className="enviar" onClick={() => window.location.href = "/envio-um"}>
            <img
              className="vector-2"
              alt="Vector"
              src="vetorDois.png"
            />
            <div className="h-3">Enviar</div>
          </div>
          <div className="carteira">
            <div className="saldo">
              <div className="p-especial">{formatarSaldoEmReais(usuarioConfiguracoes.saldo)}</div>
            </div>
            <div className="h-3">Carteira</div>
          </div>
        </div>
        <div className="bloco-i">
          <p className="h-4">Gerencie seu dinheiro e envie ou receba.</p>
          <div className="h-5">Olá, {usuarioConfiguracoes.username}</div>
        </div>
        <div className="menu">
          <img
            className="vector-3"
            alt="Vector"
            src="fechar.svg"
            onClick={handleLogout}
          />
          <img
            className="vector-4"
            alt="Vector"
            src="configuracoes.svg"
            onClick={() => window.location.href = "/configuracoes"}
          />
          <img
            className="logo"
            alt="Logo"
            src="logo.svg"
            onClick={() => window.location.href = "/dashboard"}
          />
        </div>
      </div>
    </div>
  );
};
