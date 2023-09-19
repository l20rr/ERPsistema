import React, {useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import '../../../App.css'

import Graf from '../Grafico/Chart'

import MenuAdmin from '../../../components/menu-admin';
import { getIdUsuario, getTipoUsuario , getIdUser} from '../../../services/auth';

import { getDashboard } from '../../../services/auth';




import api from '../../../services/api';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflowY: 'hidden',
  },
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  
 
}));


export default function Dashboard() {
  const classes = useStyles();

  const [produtos, setProdutos] = useState([]);
  const [ loading, setLoading ] = useState(true);
  

  useEffect(() =>{
    async function loadProdutos(){
      const response = await api.get("/api/produtos");
      setProdutos(response.data)
      setLoading(false);
    }
    loadProdutos();
    
  },[]);

// Filtrar os produtos com iduser igual ao valor retornado por getIdUsuario()
var produtosFiltrados = produtos.filter((item) => item.iduser === getIdUsuario() ||  item.iduser === getIdUser() || item._id === getIdUser() || item._id === getIdUsuario());

// Calcular o total usando a função getTotal
var total = produtosFiltrados.reduce(getTotal, 0);

function getTotal(total, item) {
  return total + (item.numero_produto * item.preco_produto);
}

// Calcular o total2 usando a função getTotal2
var total2 = produtosFiltrados.reduce(getTotal2, 0);

function getTotal2(total, item) {
  return total + (item.qtd_produto - item.numero_produto);
}

// Calcular o total3 usando a função getTotal3
var total3 = produtosFiltrados.reduce(getTotal3, 0);

function getTotal3(total, item) {
  return total + item.numero_produto;
}

// Calcular o total4 usando a função getTotal4
var total4 = produtosFiltrados.reduce(getTotal4, 0);

function getTotal4(total, item) {
  return total + ((item.preco_produto - item.valor_produto) * item.numero_produto);
}

  
  return (
    <div className={classes.root}>
      
      <MenuAdmin title={'Dashboard'}/>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item sm={12}>         
              <Grid container spacing={3}>
                  <Grid item xs={12} sm={12}>
                <div id='conter'>
                <div className='tot'>
                  <div className='square das'>
                     <ul>
                       <li className='numero das'>{total}€</li>
                       <li>Receita atual</li>
                     </ul>
                   </div>
                   <div className='square das'>
                     <ul>
                       <li className='numero'>{total2}</li>
                       <li>Produtos em stock</li>
                       </ul>
                   </div>
                   <div className='square das'>
                     <ul>
                       <li className='numero '>{total3}</li>
                       <li>Total de vendas</li>
                      </ul>
                   </div>
                      <div className='squaree'> 
                        <div id='graf'><Graf /></div>
            
                      </div>
                   <div className='square das' id='luc'>
                     <ul>
                       <li className='numero'>{total4}€</li>
                       <li ><h3>Lucro total</h3></li>
                      </ul>
                   </div>
                   <div className='squaree das'>
                 <table className='tab'>
                 {console.log(produtos)}
                 <h4>Total de vendas por produto: </h4>
                 {produtos
                   .filter((row) => row.iduser === getIdUsuario() || row._id === getIdUsuario() || row.iduser === getIdUser() || row._id === getIdUser()) 
                   .map((row) => (
                    
                        <TableRow key={row._id} className='conteudo'>
                          <TableCell component="th"  scope="row">
                            <div>{row.nome_produto}</div>
                          </TableCell>
          
                          <TableCell align="right">
                          {row.numero_produto * row.preco_produto}€
    
                          </TableCell>
                          
                          
                          <TableCell align="right">
                          {(row.preco_produto - row.valor_produto) * row.numero_produto  }€ 
    
                          </TableCell>
                          
                        </TableRow>
                        
                      ))}
                  </table>
                 </div>
    
                 </div>
                </div>
                  </Grid>
                </Grid>
             
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

