import '../../styles/EnvioA.css';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

export default function EnvioUm(){

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

  const schema = yup.object({
    emailDestinatario: yup.string().email('Email inválido').notOneOf([email], 'Não é permitido o mesmo email da sessão').required('Email obrigatório'),
    valor: yup.number().typeError('Valor deve ser um número').min(0.01, 'Valor deve ser maior que zero').required(),
  });

const [msg, setMsg] = useState(' ');

const form = useForm({
    resolver: yupResolver(schema)
});

const { register, handleSubmit, formState } = form;

const { errors } = formState;

  const [validado, setValidado] = useState(false);
  const [usuarioConfiguracoes, setUsuarioConfiguracoes] = useState({
    token: '',
    username: '',
    email: '',
  });

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
        <div className="indexA">
          <div className="div-wrapper">
            <div className="div">
              <div className="input">
                <div className="p">R$ 66.444,00</div>
              </div>


              <div className="group">
                <div className="data">
                  <div className="p">{formatarSaldoEmReais(usuarioConfiguracoes.saldo)}</div>
                </div>
                <div className="h-2">Saldo da sua carteira</div>
              </div>

              <form>
                  <div className="group-2">
                    <h3 className="h-2" htmlFor="input-1">Email do destinatário</h3>
                    <input className="p-p" id="input-1" type="email" placeholder="email do destino" {...register('email')} />
                  </div>

                <h3 className="text-wrapper">Quantia que você quer enviar</h3>
                <input className="input" type="number" placeholder="valor" id="valor" {...register('valor')} />
              
                <button className="button" id="botao">
                    <h3 className="h">{`Avançar ->`}</h3>
                </button>
              </form>          

              <img
                className="line"
                alt="Line"
                src="line.svg"
              />
              <p className="h-3">Insira os dados do destino.</p>
              <div className="h-4">Enviar uma quantia</div>
              <img
                className="vector"
                alt="Vector"
                src="fechar.svg"
                onClick={() => window.location.href = "/dashboard"}
              />
            </div>
          </div>
        </div>
      );
};
    