import { useEffect, useState } from "react";
import Disciplina from "./Disciplina";
import axios from 'axios';
import { useForm } from "react-hook-form";

export default function ListaDisciplinas(){

    const [validado, setValidado] = useState(false);
    const [formData, setFormData] = useState({
        sigla : ' '
    })

    const form = useForm();
    const { register, handleSubmit } = form;

    const submit = (data) => {
        setFormData({...formData, ...data});
    }

    const config = {
        headers:{
            'Authorization' : 'Bearer '.concat(sessionStorage.getItem('token'))
        }
    }
    
    useEffect(() => {

        async function valida(){
            try{
                const resposta = await axios.get(`http://localhost:3000/disciplinas`,config);
                console.log(resposta);
                if(resposta.status === 200)
                    setValidado(true);
            }catch(error){
                setValidado(false);
            }
        }
        valida();
    }, []);

    if(!validado){
        return <p>Token Inválido</p>
    }

    
    
    return(
        <>  
            <h2>Busque a disciplina pela sigla ou deixe vazio para retornar todas.</h2>
            <form onSubmit={handleSubmit(submit)} noValidate>

                <label htmlFor="sigla" placeholder="sigla">Sigla</label>
                <input type="text" id="sigla" {...register('sigla')} />
             
            <button>Listar</button>
            </form>
            <BuscaDisciplina formData={formData} config={config}/>
        </>   
    )
}

export function BuscaDisciplina({formData, config}){

    const [msg, setMsg] = useState('');
    const [disciplinas, setDisciplinas] = useState(<p>...</p>);
    const view = [];

    useEffect(() => {

        const submit = async () => {
            let endPoint = 'http://localhost:3000/disciplinas';
            endPoint = `${endPoint}/${formData.sigla}`
            try{
                const dados = await axios.get(`${endPoint}`, config);
                if(Array.isArray(dados.data)){
                    for(let disciplina of dados.data){
                        view.push(<Disciplina disciplina={disciplina} />);
                    }
                }else{
                    view.push(<Disciplina disciplina={dados.data} />);
                }
                setDisciplinas(view);
                setMsg('');
            }catch(error){
                setMsg(error.response.data);
                setDisciplinas(<p></p>);
                
            }
        }
        submit();
    }, [formData]);

    return(
        <>
            {disciplinas}
            {msg}
        </>
    )

}