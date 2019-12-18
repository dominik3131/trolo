import React, {Component} from 'react';
import CardModel from "../../data-models/CardModel";
import axios from "axios";
import Card from "./Card";
import Spinner from "../../utils/Spinner";

interface Props {
    match: any,
}

interface State {
    card: CardModel
    isLoading: boolean
}

export default class SharedCard extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            card: new CardModel(),
            isLoading: true
        };

        this.fetchCard();
    }

    fetchCard() {
        axios.get(`/api/cards/${this.props.match.params.id}`)
            .then((resp) => {
                this.setState({card: resp.data, isLoading: false});
            });
    }


    render() {
        if(this.state.isLoading){
            return <Spinner/>
        }
        return <Card card={this.state.card} afterModify={()=>{}} modalOpened={true}/>
    };
}