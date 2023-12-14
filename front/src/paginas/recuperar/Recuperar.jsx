import '../../styles/Recuperar.css';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function Recuperar(){
    
    const schema = yup.object({
        token: yup.string().required('Token obrigatório'),
        email: yup.string().email('Email inválido').required('Email obrigatório'),
        password: yup.string().min(6,'Senha com no mínimo 6 caracteres').required(),
        passwordConf: yup.string().required('Confirme a senha').oneOf([yup.ref('password')], 'As senhas devem coincidir!'),
    });

    const [msg, setMsg] = useState(' ');

    const form = useForm({
        resolver: yupResolver(schema)
    });

    const { register, handleSubmit, formState } = form;

    const {errors} = formState;

    const submit = async (data) => {
        
        try {
            const response = await axios.post('http://localhost:3000/recuperar', data);

            //Extrair o token
            const token = response.data.token;
            sessionStorage.setItem('token', token);
            if(token){
              setMsg('Autenticado');
              sessionStorage.removeItem('token');
            }
        } catch (error) {
            setMsg(error.response.data);
        }   
        
    }

    if(msg.toLowerCase().includes('sucesso')){
        return <Navigate to='/dashboard' />
    }

    return (
        <div className="geral">
          <div className="div">
            <div className="h-wrapper">
              <div className="text-wrapper">Alterar minha senha</div>
            </div>
            <div className="frame">
              <p className="h">Insira os dados corretos para seguir</p>
            </div>
            <form onSubmit={handleSubmit(submit)} noValidate>
                <div className="h-6">Token *</div>
                <input className="inputA" type="text" id="token" placeholder="token de recuperação" {...register('token')} />

                <div className="h-5">Email *</div>
                <input className="inputB" placeholder="endereco de email" type="text" id="email" {...register('email')} />

                <div className="h-4">Senha *</div>
                <input className="inputC" placeholder="senha" type="password" id="password" {...register('password')} />

                <div className="h-3">Confirmação da senha *</div>
                <input className="inputD" placeholder="confirmacao da senha" type="password" id="passwordConf" {...register('passwordConf')} />

                <div className="p-2">Mínimo de 6 caracteres</div>
                <button className="button">
                    <div className="h-2">Recuperar -&gt;</div>
                </button>

            </form>
            
            <div className="pb-wrapper">
              <a className="p" href="/entrar">{`<- Retornar`}</a>
            </div>
            
          </div>
          <p className='erro'>{errors.token?.message}</p>
             <p className='erro'>{errors.email?.message}</p>
             <p className='erro'>{errors.password?.message}</p>
             <p className='erro'>{errors.passwordConf?.message}</p>
        </div>
      );
    };