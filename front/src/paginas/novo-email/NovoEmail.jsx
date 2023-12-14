import '../../styles/NovoEmail.css';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function NovoEmail(){

    const schema = yup.object({
        token: yup.string().required('Token obrigatório'),
        email: yup.string().email('Email inválido').required('Email obrigatório'),
        novoEmail: yup.string().email('Email inválido').required('Email obrigatório'),
        password: yup.string().min(6, 'Senha com no mínimo 6 caracteres').required(),
      });
    
      const [validado, setValidado] = useState(false);
      const [msg, setMsg] = useState(' ');
    
      const form = useForm({
        resolver: yupResolver(schema),
      });
    
      const { register, handleSubmit, formState } = form;
      const { errors } = formState;
    
      const submit = async (data) => {
        try {
          // Envie uma requisição PUT para a API /email
          const response = await axios.put('http://localhost:3000/email', data);
    
          // Extraia o token da resposta, se necessário
          const token = response.data.token;
          sessionStorage.setItem('token', token);
    
          // Se o token estiver presente ou outra condição de sucesso, defina a mensagem
          if (token){
            setMsg('Autenticado');
            sessionStorage.removeItem('token');
          }
            
        } catch (error) {
          setMsg(error.response.data);
        }
      }
    
      useEffect(() => {
        async function valida() {
          try {
            // Verifique se o token é válido fazendo uma requisição GET para a API /verificador
            const resposta = await axios.get('http://localhost:3000/verificador', {
              headers: {
                'Authorization': 'Bearer '.concat(sessionStorage.getItem('token')),
              },
            });
    
            if (resposta.status === 200) {
              setValidado(true);
            }
          } catch (error) {
            setValidado(false);
          }
        }
        valida();
      }, []);
    
      if (!validado) {
        return <p>Token Inválido</p>;
      }
    

    return (
        <div className="geral">
          <div className="div">
            <div className="h-wrapper">
              <div className="text-wrapper">Alterar meu email</div>
            </div>
            <div className="frameX">
              <p className="h">Insira os dados corretos para seguir</p>
            </div>
            <form onSubmit={handleSubmit(submit)} noValidate>
                <div className="h-6">Token *</div>
                <input className="inputA" type="text" id="token" placeholder="token" {...register('token')} />

                <div className="h-5">Email *</div>
                <input className="inputB" placeholder="endereco de email" type="text" id="email" {...register('email')} />

                <div className="h-4">Novo email *</div>
                <input className="inputC" placeholder="novo endereco de email" type="text" id="novoEmail" {...register('novoEmail')} />

                <div className="h-3">Senha</div>
                <input className="inputD" placeholder="senha" type="password" id="password" {...register('password')} />

                <div className="p-2">Mínimo de 6 caracteres</div>
                <button type="submit" className="button">
                    <div className="h-2">Alterar -&gt;</div>
                </button>

            </form>
            
            <div className="pb-wrapper">
              <a className="p" href="/configuracoes">{`<- Retornar`}</a>
            </div>
            
          </div>
            <p className='erro'>{errors.token?.message}</p>
             <p className='erro'>{errors.email?.message}</p>
             <p className='erro'>{errors.novoEmail?.message}</p>
             <p className='erro'>{errors.password?.message}</p>
             <p className='server-response'>{msg}</p>
        </div>
      );
};