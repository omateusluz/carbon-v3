import '../../styles/Entrar.css';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function Entrar(){

    const schema = yup.object({
        email: yup.string().email('Email inválido').required('Email obrigatório'),
        password: yup.string().min(4,'Campo Senha Obrigatório').required(),
    });

    const [msg, setMsg] = useState(' ');

    const form = useForm({
        resolver: yupResolver(schema)
    });

    const { register, handleSubmit, formState } = form;

    const {errors} = formState;

    const submit = async (data) => {
        
        try {
            const response = await axios.post('http://localhost:3000/login', data);

            //Extrair o token
            const token = response.data.token;
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('email', data.email);
            if(token)
                setMsg('Autenticado');
        } catch (error) {
            setMsg(error.response.data);
        }   
        
    }

    if(msg.toLowerCase().includes('autenticado')){
        return <Navigate to='/dashboard' />
    }

    return (
        <div className="enter">
          <p>{msg}</p>
          <p className='erro'>{errors.email?.message}</p>
          <p className='erro'>{errors.password?.message}</p>
          <div className="div1" id="bloco">
            <div className="links1" id="lins">
              <a className="p22" href="/recuperar">{`Esqueci minha senha ->`}</a>
              <a className="p23" href="/cadastro">{`Não tenho uma conta ->`}</a>
            </div>
        
            <form onSubmit={handleSubmit(submit)} noValidate>

                <h3 className="h33">Email</h3>

                <input className="input3" type="text" placeholder="endereco de email" id="email" {...register('email')} />
                
                <h3 className="h32">Senha</h3>
                <input className="input2" type="password" placeholder="senha" id="password" {...register('password')} />
                
                <button className="button1" id="botao">
                    <h3 className="h3-21">{`Entrar ->`}</h3>
                </button>
            </form>          

            <div className="line1" />
            <h2 className="h21">Insira os dados para entrar.</h2>
            <h1 className="h11">Entre em sua conta</h1>
            <img className="logo-icon1" alt="" src="/logo.svg" />
          </div>
        </div>
    );
    
}