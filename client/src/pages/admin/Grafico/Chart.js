import React, {useState,useEffect} from 'react';
import { Chart } from "react-google-charts";
import '../../../App.css'
import api from '../../../services/api';
import _ from 'lodash'
import { getIdUser, getIdUsuario } from '../../../services/auth';

export default function Graf() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProdutos() {
      const response = await api.get("/api/produtos");
      setProdutos(response.data);
      setLoading(false);
    }
    loadProdutos();
  }, []);

  // Função para calcular o total de vendas de produtos filtrados
  const getTotalVendas = (produtosFiltrados) => {
    return produtosFiltrados.reduce((total, produto) => total + produto.numero_produto, 0);
  };

  // Filtro de produtos que atendem ao critério desejado
  const produtosFiltrados = produtos.filter((produto) => {
    // Substitua este exemplo pelo seu critério de filtro, por exemplo, usando a função getIdUsuario()
    return (
      produto.iduser === getIdUsuario() ||
      produto._id === getIdUsuario() ||
      produto.iduser === getIdUser() ||
      produto._id === getIdUser()
    );
  });

  const totalVendas = getTotalVendas(produtosFiltrados);

  // Criação dos dados para o gráfico
  const data = [["Produto", "Vendas"]];
  produtosFiltrados.forEach((produto) => {
    const porcentagem = (produto.numero_produto / totalVendas) * 100;
    data.push([produto.nome_produto, porcentagem]);
  });

  const options = {
    title: "Porcentagem por venda",
  };

  return (
    <div>
      {loading ? (
        <p>Carregando...</p>
      ) : produtosFiltrados.length === 0 ? (
        <div className='square das' style={{display:'flex', flexDirection:'column'}}> 
          <h4>Grafico</h4>
          <h3>faça uma venda</h3>
        </div>
      ) : (
        <div className='squaree'  style={{justifyContent: 'center',
        alignItems: 'center',
        marginTop: '60px'}}> 
        <Chart
          chartType="PieChart"
          data={data}
          options={options}
          width={"100%"}
          height={"400px"}
        />
        </div>
      )}
    </div>
  );
}