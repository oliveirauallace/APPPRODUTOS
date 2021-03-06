import React from "react";
import { View, FlatList } from "react-native";
import FeedCard from "../../components/FeedCard";
import { Icon, Header } from "react-native-elements";
import { CentralizadoNaMesmaLinha, InputPesquisa, EspacamentoIcon } from "../../assets/style";
import { getFeeds } from "../../api/index.old";

const Paginas = 4;

export default class Feeds extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            feeds: [],
            proximaPagina: 1,
            atualizando: false,
            nomedoProduto: null,
            filtrando: false
        };
    }

    componentDidMount = () => {
        this.carregarFeeds();
    }

    carregarFeeds = () => {
        const { proximaPagina, filtrando} = this.state;

        if (filtrando) {
            return;
        }

        getFeeds().then((response) => 
            this.setState({
                feeds: response,
                todosFeeds: response,
                proximaPagina: proximaPagina + 1,
                atualizando: false
            })
            .catch(function(error) {
                console.log('Erro de conexão: ' + error.message);
            })
        )
    }

    atualizar = () => {
        this.setState(
            {
                feeds: [],
                proximaPagina: 1,
                atualizando: false,
                filtrando: false,
                nomedoProduto: ""
            }, () => { this.carregarFeeds(); }
        );
    }

    atualizarPesquisaNome = (nome) => {
        this.setState({
            nomedoProduto: nome
        });
    }

    buscarFeeds = () => {
        const { nomedoProduto } = this.state;

        const feeds = this.state.todosFeeds.filter((feed) =>
            feed.product.name.toLowerCase().includes(
                nomedoProduto.toLowerCase()
            ));
        

        this.setState({
            feeds: feeds,
            atualizando: false,
            filtrando: true
        });
    }

    barradePesquisa = () => {
        const { nomedoProduto } = this.state;

        return (
            <CentralizadoNaMesmaLinha>
                <InputPesquisa
                    onChangeText={(nome) => {this.atualizarPesquisaNome(nome);}}
                    placeholder="Pesquisar por produto"
                    textAlign={'center'}
                    value={nomedoProduto}
                />
                <EspacamentoIcon/>
                <Icon color={'#154c79'} style={{ padding: 8}} size={30} name="search" 
                onPress={() => {
                    this.setState({feeds:[]});
                    this.buscarFeeds()}}/>
            </CentralizadoNaMesmaLinha>
        );
    }

    render = () => {
        const { feeds, atualizando } = this.state;

        return(
            <>
            <Header 
                containerStyle={{ backgroundColor: '#99ccff'}} 
                centerComponent={this.barradePesquisa()}></Header>
            <FlatList
                data = {feeds}
                onEndReached = { () => { this.carregarFeeds() }}
                onRefresh = { () => { this.atualizar() }}
                refreshing = { atualizando }
                keyExtractor={(item) => String(item._id)}
                renderItem = {({item}) => { 
                    return (
                        <View style={{ width: '100%'}}>
                            <FeedCard feed={item} navegador={this.props.navigation}/>
                        </View>
                    )
                }}
            ></FlatList>
            </>
                
        );
    }
}