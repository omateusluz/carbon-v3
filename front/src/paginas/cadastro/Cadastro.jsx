import '../../styles/Cadastro.css';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import { useState } from 'react';

export default function Cadastro(){
    
    const [msg, setMsg] = useState();
    const [setUserCriado] = useState(false);

    const schema = yup.object({
        username: yup.string().required('Usuário obrigatório'),
        email: yup.string().email('Email inválido').required('Email obrigatório'),
        password: yup.string().min(4,'Senha com no mínimo 4 caracteres').required(),
        passwordConf: yup.string().required('Confirme a senha').oneOf([yup.ref('password')], 'As senhas devem coincidir!'),
    });

    const form = useForm({
        resolver: yupResolver(schema)
    });


    const { register, handleSubmit, formState } = form;

    const {errors} = formState;

    const submit = async (data) => {
        
        try {
            const response = await axios.post('http://localhost:3000/create', data);
            setMsg(response.data);
            if(response.data.includes('sucesso'))
                setUserCriado(true);
        } catch (error) {
            setMsg(error.response.data);
        }   
    
    }

    return (
        <div className="geral">
          <div className="div">
            <div className="h-wrapper">
              <div className="text-wrapper">Crie uma nova conta</div>
            </div>
            <div className="frame">
              <p className="h">Insira os dados para cadastrar.</p>
            </div>
            <form onSubmit={handleSubmit(submit)} noValidate>
                <div className="h-6">Nome *</div>
                <input className="inputA" type="text" id="username" placeholder="nome de usuario" {...register('username')} />

                <div className="h-5">Email *</div>
                <input className="inputB" placeholder="endereco de email" type="text" id="email" {...register('email')} />

                <div className="h-4">Senha *</div>
                <input className="inputC" placeholder="senha" type="password" id="password" {...register('password')} />

                <div className="h-3">Confirmação da senha *</div>
                <input className="inputD" placeholder="confirmacao da senha" type="password" id="passwordConf" {...register('passwordConf')} />

                <div className="p-2">Mínimo de 4 caracteres</div>
                <button className="button">
                    <div className="h-2">Cadastrar -&gt;</div>
                </button>

            </form>
            
            <div className="pA-wrapper">
              <a className="pA" href="/entrar">{`<- Tenho uma conta`}</a>
            </div>
            
          </div>
          <p className='erro'>{errors.username?.message}</p>
             <p className='erro'>{errors.email?.message}</p>
             <p className='erro'>{errors.password?.message}</p>
             <p className='erro'>{errors.passwordConf?.message}</p>
             <p className='server-response'>{msg}</p>   
        </div>
      );
    };