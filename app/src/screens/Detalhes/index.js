import React from "react";
import { View, FlatList} from "react-native";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/AntDesign";
import { ScrollView } from "react-native-gesture-handler";
import {NomedoProduto, DescricaodoProduto, PrecodoProduto, TextPromocional, NomeDetalhesProduto, 
EsquerdaDaMesmaLinha, Espacamento, Cabecalho, TextComentarios, ViewAvaliacao, 
ImageProdutoDetalhe, TextAvalicao, AutorDataAvalicao } from "../../assets/style";
import { getFeed, getAvaliacao, getImagem } from "../../api/index.old";

const Paginas = 2;

export default class Detalhes extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            feedId: this.props.navigation.state.params.feedId,
            feed: null,

            avaliacoescliente: [],
            proximaPagina: 1,
            atualizandoAvaliacoes: false
        }
    }

    componentDidMount = () => {
        this.carregarFeed();
        this.carregarAvaliacao();
    }

    carregarFeed = () => {
        const { feedId } = this.state;

        getFeed(feedId).then((response) => 
            this.setState({
                feed: response
            })
        )
        .catch((erro) => {
            console.log("Houve um erro ao carregar o feed: " + erro)
        })
    
    }

    carregarAvaliacao = () => {
        const { feedId , avaliacao} = this.state;

        getAvaliacao(feedId).then((response) => 
            this.setState({
                avaliacao: response
            })
        )
        .catch((erro) => {
            console.log("Houve um erro ao carregar o feed: " + erro)
        })
    }

    exibirAvaliacao = (avaliacao) => {
        return (
            <View>
                <ViewAvaliacao>
                    <EsquerdaDaMesmaLinha>
                        <AutorDataAvalicao>{avaliacao.user.name}</AutorDataAvalicao>
                        <AutorDataAvalicao>{avaliacao.datetime}</AutorDataAvalicao>
                    </EsquerdaDaMesmaLinha>
                    <TextAvalicao>"{avaliacao.content}"</TextAvalicao>
                </ViewAvaliacao>
                <Espacamento/>
            </View>
        );
    }

    render = () => {
        const { feed, avaliacao  } = this.state;

        if (feed) {
            return (
                <>
                    <Header leftComponent={
                        <Icon size={28} name="left" onPress={() => {this.props.navigation.goBack();}} />}
                        containerStyle={Cabecalho}
                    />
                    <ScrollView>
                        <View>
                            <ImageProdutoDetalhe source={getImagem(feed.product.blobs[0].file)}></ImageProdutoDetalhe>
                            <View style={{ padding: 8 }}>
                                <Espacamento />
                                <NomedoProduto>{feed.product.name}</NomedoProduto>  
                                <Espacamento />
                                <PrecodoProduto>{"Pre??o R$" + feed.product.price + " "}</PrecodoProduto> 
                                <Espacamento />
                                <PrecodoProduto>{"Pre??o Promocional* R$" + feed.product.promocao + " "}</PrecodoProduto>
                                <Espacamento /> 
                                <Espacamento />
                                <Espacamento />
                                <NomeDetalhesProduto>Modo de utiliza????o: </NomeDetalhesProduto>
                                <DescricaodoProduto>{feed.product.utilizacao}</DescricaodoProduto> 
                                <Espacamento />
                                <NomeDetalhesProduto>Cuidados: </NomeDetalhesProduto>
                                <DescricaodoProduto>{feed.product.cuidados}</DescricaodoProduto> 
                                <Espacamento />
                                <NomeDetalhesProduto>Tipos de superf??cies: </NomeDetalhesProduto>
                                <DescricaodoProduto>{feed.product.superficie}</DescricaodoProduto> 
                                <Espacamento />
                                <TextPromocional>* Pre??o Promocional acima de 4 unidades</TextPromocional> 
                            </View>
                        </View>
                        <TextComentarios>AVALIA????ES DO PRODUTO:</TextComentarios>
                        <FlatList
                            data={avaliacao}
                            onEndReached={() => { this.carregarAvaliacao() }}
                            keyExtractor={(item) => String(item._id)}
                            renderItem={({ item }) => {
                                return this.exibirAvaliacao(item)
                            }}
                        />
                    </ScrollView>
                </>
            );
        } else {
            return null;
        }
    }

}