import {useEffect, useState } from "react"
import {v4 as uuidv4} from 'uuid'
import Style from './index.module.css'
import Button from "../button"

const Form = ({idCar,onEvent})=>{
    const [inputVeiculo,setInputVeiculo]=useState({
        id:uuidv4(),
        locadora:'',
        modelo:'',
        marca:'',
        ano:'',
        motor:'',
        portas:'',
        cambio:'',
        ar_condicionado:false
    })
    const anoInt = parseInt(inputVeiculo.ano,10)
    const portasInt = parseInt(inputVeiculo.portas,10)
    function handleChangeValues(e){
        setInputVeiculo(prevValue=>({
            ...prevValue,
            [e.target.name]:e.target.value
        }))
    }
    function handleSubmit(e){
        e.preventDefault();
        if (isNaN(anoInt) || isNaN(portasInt)) {
            console.error('Ano e número de portas devem ser números inteiros válidos.');
            return;
        }
        const veiculoData = {...inputVeiculo,id:uuidv4(),ano:anoInt,portas:portasInt}
        
        fetch('http://localhost:3030/veiculos',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(veiculoData)
        })
        .then((response) => response.json())
        .catch((error)=>{
            console.log(error,' Erro ao enviar os dados')
        })

    }
    const form = document.getElementsByTagName('input')
    function updatedValues(){
        const veiculoData = {...inputVeiculo,id:uuidv4(),ano:anoInt,portas:portasInt}
        fetch(`http://localhost:3030/veiculos/${idCar}`,{
            method:'PUT',
            headers:{
                'Content-Type':'aplication/json'
            },
            body: JSON.stringify(veiculoData)
        })
        .then(response=>{
            if(!response.ok){
                throw new Error('Falha ao enviar o update')
            }
            return response.json()
        })
        .then(data=>{
            console.log('atualizados ',data)
        })
        .catch(error=>{
            console.log('erro durante a atualização',error)
        })
    }
    useEffect(()=>{
        if(onEvent){
            if(onEvent!=='' && onEvent!==false){
                fetch(`http://localhost:3030/veiculos/${idCar}`,{
                    method:'GET',
                    headers:{
                        "Content-Type":"application/json"
                    }
                })
                .then(response=>{
                    if(!response.ok){
                        throw new Error('Erro ao editar o veiculo')
                    }
                    return response.json()
                })
                .then(data=>{
                    let info =Object.entries(data.cars)
                    for(let i=0;i<form.length;i++){
                        let formElement = form[i]
                        if(info.some(([key,value])=>key ===formElement.name)){
                            let [key, value] = info.find(([key, value]) => key === formElement.name);
                            formElement.value=value
                        }
                    }
                    updatedValues()
                })
                .catch(error=>{
                    console.log(error)
                })
                
                
            }
        }
       
    },[onEvent,idCar])
    return(
        <form onSubmit={handleSubmit} className={Style.form} id="form">
            <label className={Style.box_input}>
                <p>Locadora:</p>
                <input 
                className={Style.input}
                name="locadora"
                type="text" 
                value={inputVeiculo.locadora}
                onChange={handleChangeValues}/>
            </label>
            <label className={Style.box_input}>
                <p>Modelo:</p>
                <input 
                className={Style.input}
                name="modelo"
                type="text"
                value={inputVeiculo.modelo}
                onChange={handleChangeValues}/>
            </label>
            <label className={Style.box_input}>
                <p>Marca:</p>
                <input 
                className={Style.input}
                name="marca"
                type="text"
                value={inputVeiculo.marca}
                onChange={handleChangeValues}/>
            </label>
            <label className={Style.box_input}>
                <p>Ano:</p>
                <input 
                className={Style.input}
                name="ano"
                type="number" 
                value={inputVeiculo.ano}
                onChange={handleChangeValues}/>
            </label>
            <label className={Style.box_input}>
                <p>Motor:</p>
                <input
                className={Style.input}
                name="motor"
                type="text" 
                value={inputVeiculo.motor}
                onChange={handleChangeValues}/>
            </label>
            <label className={Style.box_input}>
                <p>Portas:</p>
                <input 
                className={Style.input}
                name="portas"
                type="number" 
                value={inputVeiculo.portas}
                onChange={handleChangeValues}/>
            </label>
            <label className={Style.box_input}>
                <p>Câmbio:</p>
                <input 
                className={Style.input}
                name="cambio"
                type="text" 
                value={inputVeiculo.cambio}
                onChange={handleChangeValues}/>
            </label>
            <label className={Style.box_input}>
                <p>Ar Condicionado:</p>
                <input
                className={Style.input}
                name="ar_condicionado"
                type='checkbox'
                value={inputVeiculo.ar_condicionado}
                onChange={handleChangeValues}/>
            </label>
            <Button onClick={onEvent?updatedValues:handleSubmit} text={onEvent?'Editar':'Adicionar'}/>
        </form>
    )
}

export default Form